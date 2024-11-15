"use server";
import { EMAIL_PER_PAGE_FROM_DB } from "@/constants";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import decrypt from "@/utils/decrypt";

export async function getEmailsWithPaginationFromDB(
  pageNumber: number,
  userEmailAddress: string,
  liveFetchedEmailsCnt?: number
) {
  // Calculate how many items to skip
  console.log("Started");
  const skip =
    (pageNumber - 1) * EMAIL_PER_PAGE_FROM_DB + (liveFetchedEmailsCnt || 0);

  const emails = await prisma.emails.findMany({
    where: {
      userEmailAddress: userEmailAddress || "",
    },
    skip: skip, // Skip already fetched items
    take: EMAIL_PER_PAGE_FROM_DB, // Limit to 10 emails per request
    orderBy: {
      emailId: "desc", // Optional: order emails by mail's id
    },
  });
  console.log("searched emails", emails);
  const dashBoardFormatEmails: DashBoardEmail[] = await Promise.all(
    emails.map(async (email) => {
      const decryptedLongSummary = await decrypt(email.longSummary || "");
      return {
        id: email.id,
        threadId: email.threadId || "",
        shortSummary: email.shortSummary || "",
        longSummary: decryptedLongSummary,
        tone: email.tone || "",
        date: new Date(email.date || "") || "",
        from: email.from || "",
        subject: email.subject || "",
        labels: email.label || "",
        category: email.category?.toLowerCase() || "",
      };
    })
  );
  return dashBoardFormatEmails;
}
