import { MAIL_COUNT, SUMMERY_LIMIT } from "@/constants";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { getSummerizedEmails } from "@/utils/getSummerized";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import "server-only";
import { refreshAccessToken } from "./refreshAccessToken";

export async function GetAllEmails() {
  const cookieStore = await cookies();

  let accessToken = cookieStore.get("Token")?.value;

  const expiresAt = cookieStore.get("expiresAt")?.value || 0;

  let fetchedByTime: boolean = false;
  const session = await auth();
  const userEmailAddress = session?.user?.email;
  if (Date.now() > Number(expiresAt)) {
    console.log("refresh token in GetAllEmails");
    const res = await prisma.users.findFirst({
      where: {
        emailAddress: userEmailAddress || "",
      },
      select: {
        refreshToken: true,
      },
    });

    accessToken = await refreshAccessToken(res?.refreshToken || "");
  }
  if (!accessToken || !userEmailAddress) {
    throw new Error("Access token/ email is required");
  }
  let response;

  const lastSummarized = await prisma.users.findUnique({
    where: {
      emailAddress: userEmailAddress,
    },
    select: {
      lastFetchdTimeStamp: true,
      underProcessEmailIds: true,
    },
  });

  try {
    if (lastSummarized?.lastFetchdTimeStamp === null) {
      response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=INBOX&q=in:inbox&maxResults=${MAIL_COUNT}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
    } else {
      let timeStamp = new Date(lastSummarized?.lastFetchdTimeStamp!).getTime();
      timeStamp = Math.floor(timeStamp / 1000);

      response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=INBOX&q=in:inbox&q=after:${timeStamp}`,

        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      fetchedByTime = true;
    }

    if (!response) {
      throw new Error("error while fetching email from api");
    }
    const data = await response.json();

    if (data?.resultSizeEstimate === 0)
      return NextResponse.json({
        data: [],
        queue: [],
        skippedMails: [],
      });
    if (!data.messages || data.messages.length === 0) {
      throw new Error("No emails found");
    }
    //---------------------------------------------------------------------------------
    let ids = data.messages.map(
      (cur: { id: string; threadId: string }) => cur.id,
    );

    console.log("ids are zyzgzgasgasa", ids);
    if (fetchedByTime) ids.pop();
    if (ids.length === 0) {
      return NextResponse.json({
        data: [],
        queue: [],
        skippedMails: [],
      });
    }
    //----------------------------------------------------------------------------------------------

    const count = await prisma.analytics.findFirst({
      where: {
        userEmailAddress: userEmailAddress,
      },
      select: {
        dailySummeryCount: true,
      },
    });
    let finalIDs: number = ids.length;
    if (!count) finalIDs = ids.length;
    const dailySummeryCount = count?.dailySummeryCount || 0;
    if (dailySummeryCount + ids.length >= SUMMERY_LIMIT) {
      finalIDs = SUMMERY_LIMIT - dailySummeryCount;
    }

    if (finalIDs === 0 && ids.length > 0) {
      console.log("LIMITS REACHED", finalIDs);
      throw new Error("LIMITS REACHED");
    }
    ids = ids.slice(0, finalIDs);
    response = await getSummerizedEmails(ids, userEmailAddress, accessToken);

    if (!response) {
      throw new Error("empty respose in getAll email file");
    }

    return NextResponse.json({
      data: response.DashBoardEmails,
      queue: response.queue,
      skippedMails: response.skippedMails,
    });
  } catch (e: any) {
    console.log("error in catch i s", e);
    throw e;
  }
}
