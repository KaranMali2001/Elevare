import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { title, description } = await request.json();
  const users = await prisma.users.findMany({
    select: {
      emailAddress: true,
    },
  });
  const NotificationData = users.map((user) => {
    return {
      title: title,
      description: description,
      userEmailAddress: user.emailAddress,
      isRead: false,
    };
  });

  const res = await prisma.notifications.createMany({
    data: NotificationData,
  });

  return NextResponse.json("Notification posted successfully", {
    status: 200,
  });
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

  const res = await prisma.notifications.update({
    where: {
      userEmailAddress: session?.user?.email || " ",
    },
    data: {
      isRead: true,
    },
  });
}
