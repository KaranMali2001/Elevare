import { DEFAULT_EMAIL } from "@/constants";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import decrypt from "@/utils/decrypt";
import encrypt from "@/utils/encrypt";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const {
    latestNonSentEmailID,
    threadId,
    url,
  }: { latestNonSentEmailID: string; threadId: string; url: string } =
    await request.json();
  let userEmailAddress: string;
  //first check in db that thread summery exist or not
  if (url.startsWith("/Demo")) {
    userEmailAddress = DEFAULT_EMAIL;
  } else {
    const session = await auth();
    userEmailAddress = session?.user?.email || "";
  }
  try {
    const latestEmailSummery = await prisma.emails.findFirst({
      where: {
        emailId: latestNonSentEmailID,
        userEmailAddress: userEmailAddress,
      },
      select: {
        longSummary: true,
        threadId: true,
        from: true,
      },
    });

    const longSummary = await decrypt(latestEmailSummery?.longSummary || "");
    const isThreadId = await prisma.threads.findFirst({
      where: {
        threadId: latestEmailSummery?.threadId || "",
        userEmailAddress: userEmailAddress,
      },
    });
    if (!isThreadId) {
      console.log("inside thread");
      const res = await prisma.threads.create({
        data: {
          threadId: threadId,
          latestThreadMailId: latestNonSentEmailID,
          threadSummery: latestEmailSummery?.longSummary || "",
          threadMailCount: 1,
          userEmailAddress: userEmailAddress || "",
        },
      });

      return NextResponse.json(longSummary);
    }
    const threadSummary = await decrypt(isThreadId?.threadSummery || "");
    if (isThreadId?.latestThreadMailId === latestNonSentEmailID) {
      return NextResponse.json(threadSummary);
    }

    const threadReqObject: ThreadReqBody = {
      thread_id: threadId,
      previous_conversation_summary: threadSummary,
      latest_thread_conversation: {
        latest_sender_name: latestEmailSummery?.from || "",
        latest_body: longSummary || "",
      },
    };

    const res = await fetch(`${process.env.LLM_URL}api/post/summury/thread`, {
      method: "POST",
      body: JSON.stringify(threadReqObject),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!data.thread_summary) {
      throw new Error("No thread summary found from LLM API");
    }
    const encryptedData = await encrypt(
      data.thread_summary || data.thread_summery,
    );
    const response = await prisma.threads.update({
      where: {
        threadId: threadId || "",
      },
      data: {
        latestThreadMailId: latestNonSentEmailID,
        threadSummery: encryptedData,
        threadMailCount: { increment: 1 },
      },
    });
    return NextResponse.json(data.thread_summary || data.thread_summery);
  } catch (error) {
    console.error(error);
    throw new Error("Error at Thread Summery");
  }
}
