import prisma from "./db";

export async function isExisting(email: string) {
  let existingUser = await prisma.users.findUnique({
    where: { emailAddress: email },
  });
  return existingUser;
}
export async function updateLastFetch(date: string, userEmailAddress: string) {
  const user = await prisma.users.update({
    where: { emailAddress: userEmailAddress },
    data: {
      lastFetchdTimeStamp: date,
    },
  });
  return user;
}
export async function updateUnderProceesEmailIds(
  underProcessEmailIds: string[],
  userEmailAddress: string,
) {
  const user = await prisma.users.update({
    where: { emailAddress: userEmailAddress },
    data: {
      underProcessEmailIds: underProcessEmailIds,
    },
  });
  return user;
}
// Function to fetch emails for a user with pagination
export async function getDBMailCnt(userEmailAddress: string) {
  const emailsCnt = await prisma.users.findUnique({
    where: {
      emailAddress: userEmailAddress,
    },
    select: {
      emailsCnt: true,
    },
  });
  return emailsCnt?.emailsCnt || 0;
}
