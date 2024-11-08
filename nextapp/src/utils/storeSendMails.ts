import { PrismaClient } from "@prisma/client";

export async function storeSendMail(replyEmail: ReplyEmailDBFormat) {
  const prisma = new PrismaClient();
  if (!replyEmail) {
    throw new Error("Reply Email is empty");
  }
  try {
    const res = await prisma.replyMails.create({
      data: {
        replyMailId: replyEmail.replyMailId,
        threadId: replyEmail.threadId,
        idOfOriginalMail: replyEmail.idOfOriginalMail,
        generatedSubject: replyEmail.generatedSubject,
        generatedResponse: replyEmail.generatedResponse,
        generatedTimeStamp: replyEmail.generatedTimeStamp,
        to: replyEmail.to,
        cc: replyEmail.cc,
        bcc: replyEmail.bcc,
        labels: replyEmail.labels,
        category: replyEmail.category,
        userEmailAddress: replyEmail.userEmailAddress,
        userFilesId: replyEmail.userFilesId,
      },
    });
    const res2 = await prisma.analytics.update({
      where: {
        userEmailAddress: replyEmail.userEmailAddress,
      },
      data: {
        dailySentCount: { increment: 1 },
        totalSent: { increment: 1 },
      },
    });
    console.log("res from update sent mails is", res2);
  } catch (error: any) {
    throw error;
  }
}
