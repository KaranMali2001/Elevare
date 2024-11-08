import prisma from "@/lib/db";

export async function getMaxSendMailCount(userEmailAddress: string) {
  const emailCount = await prisma.replyMails.count({
    where: {
      userEmailAddress: userEmailAddress, // Filters emails for this user
    },
  });
  return emailCount;
}
