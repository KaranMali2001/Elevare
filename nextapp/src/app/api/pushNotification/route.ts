import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // const { title, description, userEmailAddress } = await request.json();

  // if (!userEmailAddress) {
  //   console.log("no user email address");
  //   const users = await prisma.users.findMany({
  //     select: {
  //       emailAddress: true,
  //     },
  //   });
  //   console.log("users", users);
  //   const NotificationData = users.map((user) => {
  //     return {
  //       id: randomUUID(),
  //       title: title,
  //       description: description,
  //       userEmailAddress: user.emailAddress,
  //       isRead: false,
  //     };
  //   });

  //   const res = await prisma.notifications.createMany({
  //     data: NotificationData,
  //   });
  //   return NextResponse.json(
  //     "Notification posted successfully to all the users",
  //     {
  //       status: 200,
  //     }
  //   );
  // } else {
  //   console.log("user email address is ", userEmailAddress);
  //   const res = await prisma.notifications.create({
  //     data: {
  //       // id: randomUUID(),
  //       title: title,
  //       description: description,
  //       userEmailAddress,
  //       isRead: false,
  //     },
  //   });
  //   return NextResponse.json(
  //     `Notification posted successfully to ${userEmailAddress}`,
  //     {
  //       status: 200,
  //     }
  //   );
  // }
  return NextResponse.json({ message: "Notification posted successfully" });
}
export async function GET() {
  const session = await auth();
  const res = await prisma.notifications.findMany({
    where: {
      userEmailAddress: session?.user?.email || "  ",
      isRead: false,
    },
  });
  return NextResponse.json(res);
}
export async function PUT() {
  const session = await auth();

  await prisma.notifications.updateMany({
    where: {
      userEmailAddress: session?.user?.email || " ",
    },
    data: {
      isRead: true,
    },
  });
  return NextResponse.json("Notifications cleared successfully");
}
