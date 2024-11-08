import { summerizeInRealTime } from "@/utils/summerizeInRealTime";
import { getEmailsFormatForLLM } from "./getEmailsFormatForLLM";
import { getDashBoardEmails } from "./getDashBoardEmails";

export async function getDashBoardMailsFromQueueElement(
  queueElement: EmailFullFormat[],
  userEmailAddress: string,
) {
  const batch: batchOfEmailsReqBody[] = getEmailsFormatForLLM(queueElement);
  const finalLLMformat = {
    emails: batch,
    username: userEmailAddress,
    categories: ["support", "sales"], //this categories need to be fetch according to user/default
  };
  let data: batchOfEmailsResBody[] = await summerizeInRealTime(
    finalLLMformat,
    userEmailAddress,
  );
  let summaryMails: batchOfEmailsResBody[] = [];
  if (data.constructor !== Array) {
    //@ts-ignore
    summaryMails.push(data);
  } else summaryMails = data;
  const dashBoardEmail: DashBoardEmail[] = getDashBoardEmails(
    queueElement,
    summaryMails,
  );
  return dashBoardEmail;
}
