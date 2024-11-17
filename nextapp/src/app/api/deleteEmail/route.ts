import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  if (!request.body) {
    return new Response("No body", { status: 400 });
  }
  const { id, userEmailAddress, date } = await request.json();
  if (!date) {
  }

  const email = await prisma.emails.findFirst({
    where: {
      userEmailAddress: userEmailAddress,
      id: id,
    },
    select: {
      emailId: true,
    },
  });
  const res2 = await prisma.replyMails.deleteMany({
    where: {
      userEmailAddress: userEmailAddress,
      idOfOriginalMail: email?.emailId,
    },
  });

  const res = await prisma.emails.delete({
    where: {
      userEmailAddress: userEmailAddress,
      id: id,
    },
  });
  return NextResponse.json({ message: "Deleted", status: 200 });
}
