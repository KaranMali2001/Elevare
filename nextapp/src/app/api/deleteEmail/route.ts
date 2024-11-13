import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  if (!request.body) {
    return new Response("No body", { status: 400 });
  }
  const { id, userEmailAddress, date } = await request.json();
  if (!date) {
  }
  // if (!id.startsWith("6")) {
  //   console.log("inside delete", id);
  //   const res2 = await prisma.emails.findFirst({
  //     where: {
  //       userEmailAddress: userEmailAddress,
  //       emailId: id,
  //     },
  //     select: {
  //       id: true,
  //     },
  //   });
  //   console.log("res2 is", res2);
  //   const res = await prisma.emails.delete({
  //     where: {
  //       userEmailAddress: userEmailAddress,
  //       id: res2?.id,
  //     },
  //   });
  // }
  const res = await prisma.emails.delete({
    where: {
      userEmailAddress: userEmailAddress,
      id: id,
    },
  });
  return NextResponse.json({ message: "Deleted", status: 200 });
}
