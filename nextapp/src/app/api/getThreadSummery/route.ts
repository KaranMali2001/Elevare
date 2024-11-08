import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import decrypt from "@/utils/decrypt";
import encrypt from "@/utils/encrypt";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { ids, threadId } = await request.json();

  //first check in db that thread summery exist or not
  const session = await auth();
  try {
    const latestEmailSummery = await prisma.emails.findFirst({
      where: {
        id: ids.at(-1),
        userEmailAddress: session?.user?.email || "",
      },
      select: {
        longSummary: true,
        threadId: true,
        from: true,
      },
    });
    const longSummary = await decrypt(latestEmailSummery?.longSummary || "");
    const isThreadId = await prisma.threads.findUnique({
      where: {
        id: latestEmailSummery?.threadId || "",
      },
    });
    if (!isThreadId) {
      const res = await prisma.threads.create({
        data: {
          id: threadId,
          latestThreadMailId: ids.at(-1),
          threadSummery: latestEmailSummery?.longSummary || "",
          threadMailCount: 1,
        },
      });

      console.log(
        "res from creating first thread id into therad model is",
        res
      );
      return NextResponse.json(longSummary);
    }
    if (isThreadId?.latestThreadMailId === ids.at(-1)) {
      const res = await decrypt(isThreadId?.threadSummery || "");
      return NextResponse.json(res);
    }

    const threadReqObject: ThreadReqBody = {
      thread_id: threadId,
      previous_conversation_summary: isThreadId?.threadSummery || "",
      latest_thread_conversation: {
        latest_sender_name: latestEmailSummery?.from || "",
        latest_body: latestEmailSummery?.longSummary || "",
      },
    };
    //console.log("threaObject", JSON.stringify(threadReqObject));
    const res = await fetch(`${process.env.LLM_URL}api/post/summury/thread`, {
      method: "POST",
      body: JSON.stringify(threadReqObject),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log("data i s", data);
    if (!data.thread_summary) {
      throw new Error("No thread summary found from LLM API");
    }
    const encryptedData = await encrypt(data.thread_summary);
    const response = await prisma.threads.update({
      where: {
        id: threadId,
      },
      data: {
        latestThreadMailId: ids.at(-1),
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
