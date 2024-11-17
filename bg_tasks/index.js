//const { PrismaClient } = require("@prisma/client");
import { PrismaClient } from "@prisma/client";
import { worker } from "./worker.js";
import { FetchByTime } from "./fetchByTime.js";
import { handleFirstTimeUser } from "./newUser.js";
import { refreshAccessToken } from "./refreshAccessToken.js";
import "dotenv/config";
console.log("background tasks started");

const prisma = new PrismaClient();

async function main() {
  let ids;
  const Users = await prisma.users.findMany({
    select: {
      emailAddress: true,
      refreshToken: true,
      lastFetchdTimeStamp: true,
      underProcessEmailIds: true,
    },
  });

  //   console.log("Users", Users);
  if (Users.length === 0) {
    return;
  }

  for (let i = 0; i < Users.length; i++) {
    let timestamp;
    let updateTimeStamp = true;
    //fetch users temp mail
    //find temp emails lastfetched time;

    const accessToken = await refreshAccessToken(Users[i].refreshToken);
    if (accessToken === "") {
      continue;
    }
    if (!Users[i].lastFetchdTimeStamp) {
      ids = await handleFirstTimeUser(Users[i].emailAddress, accessToken);
    } else {
      const date = new Date(Users[i].lastFetchdTimeStamp); // Change to the correct date and time if needed
      timestamp = Math.ceil(date.getTime() / 1000); //this one thousand is neccesary
      ids = await FetchByTime(Users[i].emailAddress, accessToken, timestamp);
    }
    if (ids.length == 0) {
      updateTimeStamp = false;
    }
    if (Users[i].underProcessEmailIds.length !== 0) {
      ids = [...new Set([...Users[i].underProcessEmailIds, ...ids])];
    }
    try {
      const { ReturnArray, skippedMails } = await worker(
        ids,
        Users[i].emailAddress,
        accessToken,
      );
      // console.log("Return array", ReturnArray[0].label);
      if (ReturnArray.length === 0) {
        continue;
      }
      if (skippedMails.length === 0) {
      }
      let temp = [];
      let returnArrayInd = 0;
      let skippedInd = 0;

      for (let i = 0; i < ids.length; i++) {
        if (
          skippedInd < skippedMails.length &&
          ids[i] == skippedMails[skippedInd].emailId
        ) {
          temp.push(skippedMails[skippedInd]);
          skippedInd++;
        } else if (
          returnArrayInd < ReturnArray.length &&
          ids[i] == ReturnArray[returnArrayInd].emailId
        ) {
          if (ReturnArray[returnArrayInd].longSummary === "") {
            break;
          }

          temp.push(ReturnArray[returnArrayInd]);
          returnArrayInd++;
        }
      }

      try {
        temp = temp.slice(1);

        temp = temp.reverse();

        if (temp.length !== 0) {
          await prisma.$transaction(async (primsa) => {
            const dbResponse = await prisma.emails.createMany({ data: temp });

            const summeryEmails = await prisma.analytics.upsert({
              where: {
                userEmailAddress: Users[i].emailAddress,
              },
              update: {
                totalSummerized: { increment: dbResponse.count },
                dailySummeryCount: { increment: dbResponse.count },
              },
              create: {
                userEmailAddress: Users[i].emailAddress,
                totalSummerized: dbResponse.count,
                dailySummeryCount: dbResponse.count,
                totalGenerated: 0, // Or set to any initial value you prefer
                totalSent: 0, // Or set to any initial value you prefer
                dailyGeneratedCount: 0,
                dailySentCount: 0,
              },
            });

            let emailCnt = await prisma.users.findFirst({
              where: {
                emailAddress: Users[i].emailAddress,
              },
              select: {
                emailsCnt: true,
                lastFetchdTimeStamp: true,
              },
            });
            const tempStampToUpdate = updateTimeStamp
              ? temp[0].date
              : emailCnt.lastFetchdTimeStamp;
            if (!emailCnt.emailsCnt) emailCnt.emailsCnt = 0;
            const dbResponse2 = await prisma.users.update({
              where: { emailAddress: Users[i].emailAddress },
              data: {
                lastFetchdTimeStamp: tempStampToUpdate, //compare temp[0].date and temp mails lastfetched and update it.
                emailsCnt: emailCnt.emailsCnt + temp.length,
                underProcessEmailIds: [],
              },
            });
          });
        }
      } catch (error) {
        console.log("error", error);
      }
    } catch (error) {
      console.log("error in for loop", error);
    } finally {
      console.log("Next user");
    }
  }
}

import cron from "node-cron";

import { resetLimits } from "./ResetLimit/reset.js";
import { sendErrorEmail } from "./sendEmail.js";
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("trying to reset limit");
    await resetLimits();
    await sendErrorEmail("LIMIT SUCCESSFULY RESET");
  } catch (error) {
    await sendErrorEmail(error);
  }
});
cron.schedule("*/30 * * * *", async () => {
  console.log("running a task every 30 minutes", Date.now().toString());
  try {
    await main();
  } catch (error) {
    await sendErrorEmail(error);
  }
  console.log("task done");
});

await main();
