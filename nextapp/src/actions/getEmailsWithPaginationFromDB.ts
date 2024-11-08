"use server";
import { EMAIL_PER_PAGE_FROM_DB } from "@/constants";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import decrypt from "@/utils/decrypt";

export async function getEmailsWithPaginationFromDB(
  pageNumber: number,
  liveFetchedEmailsCnt?: number
) {
  const session = await auth();
  // Calculate how many items to skip
  const skip =
    (pageNumber - 1) * EMAIL_PER_PAGE_FROM_DB + (liveFetchedEmailsCnt || 0);
  console.log("emails seraching started", session);
  const emails = await prisma.emails.findMany({
    where: {
      userEmailAddress: session?.user?.email || "",
    },
    skip: skip, // Skip already fetched items
    take: EMAIL_PER_PAGE_FROM_DB, // Limit to 10 emails per request
    orderBy: {
      id: "desc", // Optional: order emails by mail's id
    },
  });
  // console.log("searched emails", emails);
  const dashBoardFormatEmails: DashBoardEmail[] = await Promise.all(
    emails.map(async (email) => {
      const decryptedLongSummary = await decrypt(email.longSummary || "");
      return {
        id: email.id,
        threadId: email.threadId || "",
        shortSummary: email.shortSummary || "",
        longSummary: decryptedLongSummary,
        tone: email.tone || "",
        date: email.date || "",
        from: email.from || "",
        subject: email.subject || "",
        labels: email.label || "",
        category: email.category?.toLowerCase() || "",
      };
    })
  );
  return dashBoardFormatEmails;
}
