"use server";
import { EMAIL_PER_PAGE_FROM_DB } from "@/constants";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function getMailsSendViaElevare(pageNumber: number) {
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
      id: "desc", // Optional: order emails by mail's id
    },
  });

  return emails;
}
