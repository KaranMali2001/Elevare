import { refreshAccessToken } from "@/actions/refreshAccessToken";
import { MAIL_COUNT } from "@/constants";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { formatRawData } from "@/utils/getSummerized";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("Token")?.value;
  const expiresAt = cookieStore.get("expiresAt")?.value;

  const session = await auth();
  const userEmailAddress = session?.user?.email;
  if (Date.now() > Number(expiresAt)) {
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
  if (!accessToken) {
    throw new Error("Not got access token");
  }
  try {
    // Build the API URL
    let url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=in:trash&maxResults=${MAIL_COUNT}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!data.messages || data.messages.length === 0) {
      throw new Error("No send Emails found");
    }

    const pageToken = data.nextPageToken || "";
    const ids = data.messages.map(
      (cur: { id: string; threadId: string }) => cur.id
    );
    let formattedEmails: EmailFullFormat[] = [];
    for (let i = 0; i < ids.length; i++) {
      const temp: EmailFullFormat = await formatRawData(ids[i], accessToken);

      formattedEmails.push(temp);
    }
    return NextResponse.json({ formattedEmails, pageToken });
  } catch (error) {
    return NextResponse.json({ formattedEmails: [], pageToken: "" });
  }
}
