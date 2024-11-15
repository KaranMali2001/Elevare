"use server";
import prisma from "@/lib/db";
import encrypt from "./encrypt";

export async function storeRealTimeEmails(
  mails: DashBoardEmail[],
  lastFetchDate: string | undefined,
  userEmailAddress: string,
  underProcessEmailIds: string[]
) {
  const dbMails = await Promise.all(
    mails.map(async (mail) => {
      const encryptedLongSummary = await encrypt(mail.longSummary);

      return {
        emailId: mail.id,
        threadId: mail.threadId,
        contentType: mail.contentType,
        shortSummary: mail.shortSummary,
        longSummary: encryptedLongSummary,
        tone: mail.tone,
        date: new Date(mail.date),
        from: mail.from,
        subject: mail.subject,
        label: mail.labels,
        category: mail.category,
        sentiment: mail.sentiment,
        userEmailAddress: userEmailAddress,
      };
    })
  );

  try {
    console.log("db mails is", dbMails);
    const result = await prisma.$transaction(async (prisma) => {
      const insertMany = await prisma.emails.createMany({
        data: dbMails,
      });
      const update = await prisma.users.update({
        where: { emailAddress: userEmailAddress },
        data: {
          underProcessEmailIds: underProcessEmailIds,
        },
      });
      console.log("insertMany is ", insertMany);
      const dbResponse = await prisma.users.findFirst({
        where: { emailAddress: userEmailAddress },
        select: {
          emailsCnt: true,
          lastFetchdTimeStamp: true,
        },
      });
      const lastFetch = await prisma.users.update({
        where: { emailAddress: userEmailAddress },
        data: {
          lastFetchdTimeStamp: lastFetchDate || dbResponse?.lastFetchdTimeStamp,
          emailsCnt: (dbResponse?.emailsCnt || 0) + dbMails.length,
        },
      });

      //  total no of emails summzeired in db in analytics table

      const res = await prisma.analytics.upsert({
        where: {
          userEmailAddress: userEmailAddress,
        },
        update: {
          dailySummeryCount: { increment: insertMany.count },
          totalSummerized: { increment: insertMany.count },
        },
        create: {
          userEmailAddress: userEmailAddress,
          totalSummerized: insertMany.count,
          dailySummeryCount: insertMany.count,
          totalGenerated: 0, // Or set to any initial value you prefer
          totalSent: 0, // Or set to any initial value you prefer
          dailyGeneratedCount: 0,
          dailySentCount: 0,
        },
      });
      console.log("res from store real time emails is analytics", res);
    });

    return true;
  } catch (error: any) {
    throw new Error(error);
  }
}
