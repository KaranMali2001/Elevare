import { PrismaClient } from "@prisma/client";

export async function resetLimits() {
  const prisma = new PrismaClient();
  const res = await prisma.analytics.updateMany({
    where: {},
    data: {
      dailyGeneratedCount: 0,
      dailySentCount: 0,
      dailySummeryCount: 0,
    },
  });
  await prisma.notifications.deleteMany({
    where: {
      isRead: true,
    },
  });
}
