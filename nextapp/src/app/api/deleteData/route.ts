import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { startDate, endDate } = await request.json();
  const session = await auth();
  const email = session?.user?.email;
  if (!startDate || !endDate) {
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
      await prisma.replyMails.deleteMany({
        where: {
          userEmailAddress: email || "",
        },
      });
    });

    return NextResponse.json({ message: "Deleted", status: 200 });
  }
  await prisma.$transaction(async (prisma) => {
    const res = await prisma.emails.deleteMany({
      where: {
        userEmailAddress: email || "",
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    await prisma.users.update({
      where: {
        emailAddress: email || "",
      },
      data: {
        emailsCnt: 0,
      },
    });
    await prisma.replyMails.deleteMany({
      where: {
        userEmailAddress: email || "",
        generatedTimeStamp: {
          gte: startDate.toString(),
          lte: endDate.toString(),
        },
      },
    });
  });

  return NextResponse.json({ message: "Deleted", status: 200 });
}
