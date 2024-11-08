import "server-only";
import { emailFullFormat } from "@/actions/getFullFormat";
import { MAX_TOKENS } from "@/constants";
import { summerizeInRealTime } from "@/utils/summerizeInRealTime";
import { getDashBoardEmails } from "./getDashBoardEmails";
import { getEmailsFormatForLLM } from "./getEmailsFormatForLLM";
import tokenCounter from "./tokenCounter";
import { latestDate } from "./storeSummary";
import { storeRealTimeEmails } from "./storeRealTimeEmails";

export async function getSummerizedEmails(
  ids: string[],
  userEmailAddress: string,

  accessToken: string,
) {
  console.log("ids are in getSummerized EMails.ts file", ids);
  let formattedEmails: EmailFullFormat[] = [];
  for (let i = 0; i < ids.length; i++) {
    const temp: EmailFullFormat = await formatRawData(ids[i], accessToken);

    formattedEmails.push(temp);
  }

  const finalEmailFormat: batchOfEmailsReqBody[] =
    getEmailsFormatForLLM(formattedEmails);
  let queue: EmailFullFormat[][] = [];
  let skippedMails: SkippedMail[] = [];
  let i = 0;
  while (i <= finalEmailFormat.length - 1) {
    let cnt = 0;
    const temp = [];
    while (i <= finalEmailFormat.length - 1) {
      let curCnt = await tokenCounter(JSON.stringify(finalEmailFormat[i]));
      if (curCnt > MAX_TOKENS) {
        i++;

        skippedMails.push({
          id: formattedEmails[i - 1].id,
          threadId: formattedEmails[i - 1].threadId,
          labels: formattedEmails[i - 1].labels,
          shortSummary: "TOO LONG TO SUMMERIZE",
          longSummary: "TOO LONG TO SUMMERIZE",
          tone: "TOO LONG TO SUMMERIZE",
          date: formattedEmails[i - 1].date,
          from: formattedEmails[i - 1].from,
          subject: formattedEmails[i - 1].subject,
        });
        continue;
      }
      cnt += curCnt;
      if (cnt > MAX_TOKENS) {
        cnt -= curCnt;
        break;
      }

      temp.push(formattedEmails[i]);
      i++;
    }
    queue.push(temp);
  }
  const batch: batchOfEmailsReqBody[] = [];
  for (let i = 0; i < queue[0].length; i++) {
    const isSkipped = skippedMails.findIndex(
      (mail) => mail.id === finalEmailFormat[i].mail_id,
    );
    if (isSkipped === -1) {
      batch.push(finalEmailFormat[i]);
    }
  }

  let finalBatch: finalbatchOfEmailsReqBody = {
    emails: batch,
    username: userEmailAddress,
    categories: ["support"],
  };

  let res: batchOfEmailsResBody[] | batchOfEmailsReqBody =
    await summerizeInRealTime(finalBatch, userEmailAddress);
  let summaryMails: batchOfEmailsResBody[] = [];

  if (res.constructor !== Array) {
    //@ts-ignore
    summaryMails.push(res);
  } else {
    summaryMails = res;
  }
  let DashBoardEmails: DashBoardEmail[] = getDashBoardEmails(
    queue[0],
    summaryMails,
  );
  let underProcessEmailIds: string[] = [];
  for (let i = 1; i < queue.length; i++) {
    for (let j = 0; j < queue[i].length; j++) {
      underProcessEmailIds.push(queue[i][j].id);
    }
  }
  const lastFetchDate = latestDate(formattedEmails);

  const isStoredMails = await storeRealTimeEmails(
    DashBoardEmails,
    lastFetchDate,
    userEmailAddress,
    underProcessEmailIds,
  );
  if (isStoredMails) queue.shift();
  return { DashBoardEmails, queue, skippedMails };
}

export async function formatRawData(id: string, accessToken: string) {
  const res: EmailFullFormat = await emailFullFormat(id, accessToken);
  return res;
}
