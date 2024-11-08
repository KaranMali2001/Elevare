import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  const emailCount = await prisma.replyMails.count({
    where: {
      userEmailAddress: session?.user?.email || "", // Filters emails for this user
    },
  });
  return NextResponse.json({ emailCount });
}
