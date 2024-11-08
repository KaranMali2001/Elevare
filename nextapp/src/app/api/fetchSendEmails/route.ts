import { EMAIL_PER_PAGE_FROM_DB } from "@/constants";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const pageNumber = Number(req.nextUrl.searchParams.get("pageNumber")) || 0;

  const session = await auth();
  // Calculate how many items to skip
  const skip = (pageNumber - 1) * EMAIL_PER_PAGE_FROM_DB;

  const emails = await prisma.replyMails.findMany({
    where: {
      userEmailAddress: session?.user?.email || "",
    },
    skip: skip, // Skip already fetched items
    take: EMAIL_PER_PAGE_FROM_DB, // Limit to 10 emails per request
    orderBy: {
      generatedTimeStamp: "desc", // Optional: order emails by mail's id
    },
  });

  return NextResponse.json({ res: emails });
};
