import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { startDate, endDate } = await request.json();
  const session = await auth();
  const email = session?.user?.email;
  if (!startDate || !endDate) {
    await prisma.replyMails.deleteMany({
      where: {
        userEmailAddress: email || "",
      },
    });
    await prisma.$transaction(async (prisma) => {
      const res = await prisma.emails.deleteMany({
        where: {
          userEmailAddress: email || "",
        },
      });
      await prisma.users.update({
        where: { emailAddress: email || "" },
        data: { emailsCnt: 0 },
      });
    });
    const res = await axios.post("http://localhost:3000/api/pushNotification", {
      title: "Deleted",
      description: `You have deleted all data stored by Elevare, 
      including your emails, thread summaries, and replies.
       This action is irreversible
      `,
      userEmailAddress: email,
    });
    console.log("res", res);
    return NextResponse.json({ message: "Deleted", status: 200 });
  }
  await prisma.$transaction(async (prisma) => {
    await prisma.replyMails.deleteMany({
      where: {
        userEmailAddress: email || "",
        generatedTimeStamp: {
          gte: startDate.toString(),
          lte: endDate.toString(),
        },
      },
    });
    const res = await prisma.emails.deleteMany({
      where: {
        userEmailAddress: email || "",
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    //need to delete thread data
    await prisma.users.update({
      where: {
        emailAddress: email || "",
      },
      data: {
        emailsCnt: 0,
      },
    });
    await axios.post("http://localhost:3000/api/pushNotification", {
      title: "Data Deletion Confirmed",
      description: `You have deleted all data stored by Elevare from ${startDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} to ${endDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })},
       including your emails, thread summaries, and replies. 
      Please note that this action is irreversible.
      `,
      userEmailAddress: email,
    });
  });

  return NextResponse.json({ message: "Deleted", status: 200 });
}
