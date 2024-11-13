import { MAX_TOKENS } from "./constants.js";
import { encrypt } from "./encrypt.js";
import { formatRawData } from "./formatRaw.js";
import { textFromHtml } from "./htmltoText.js";
import { summerizeInRealTime } from "./summery.js";
// const { writetxtFile } = require("./writeFile");
export async function worker(ids, emailAddress, accessToken) {
  let formattedEmails = [];
  const ReturnArray = [];
  for (let i = 0; i < ids.length; i++) {
    const temp = await formatRawData(ids[i], accessToken);
    if (!temp) return;

    ReturnArray.push({
      emailId: temp.id,
      threadId: temp.threadId,
      contentType: temp.contentType,
      date: temp.date,
      sentiment: "",
      userEmailAddress: emailAddress,
      label: temp.labelIds,
      shortSummary: "",
      longSummary: "",
      from: temp.from,
      tone: "",
      subject: temp.subject,
    });
    formattedEmails.push(temp);
  }
  const finalEmailFormat = [];
  for (let i = 0; i < formattedEmails.length; i++) {
    finalEmailFormat.push({
      mail_id: formattedEmails[i].id,
      subject: formattedEmails[i].subject,
      sender: formattedEmails[i].from,
      body:
        removeEscapeSequence(textFromHtml(formattedEmails[i].textPlain)) ||
        removeEscapeSequence(textFromHtml(formattedEmails[i].textHtml)) ||
        removeEscapeSequence(textFromHtml(formattedEmails[i].body)) ||
        formattedEmails[i].snippet,
    });
  }
  const skippedMails = [];
  let i = 0;
  let j = 0;
  try {
    while (i <= finalEmailFormat.length - 1) {
      let cnt = 0;
      const temp = [];
      j = i;
      while (i <= finalEmailFormat.length - 1) {
        let curCnt = tokenCounter(JSON.stringify(finalEmailFormat[i]));
        if (curCnt > MAX_TOKENS) {
          i++;
          j++;
          console.log(
            "Skipped mail",
            finalEmailFormat[i - 1].subject,
            "token cnt",
            curCnt
          );
          skippedMails.push({
            emailId: formattedEmails[i - 1].id,
            threadId: formattedEmails[i - 1].threadId,
            label: formattedEmails[i - 1].labelIds,

            date: formattedEmails[i - 1].date,
            from: formattedEmails[i - 1].from,
            to: formattedEmails[i - 1].to,
            subject: formattedEmails[i - 1].subject,
            shortSummary: "Too long to summerize",
            longSummary: "Too long to summerize",
            tone: "Too long to summerize",
            category: "Too long to summerize",
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
      console.log(
        `Batch contains ${temp.length} mails with`,
        "total tokens cnt",
        cnt
      );
      const batch = [];
      let tempj = j;
      for (let x = 0; x < temp.length; x++) {
        batch.push(finalEmailFormat[tempj]);
        tempj++;
      }
      const finalBatch = {
        emails: batch,
        username: emailAddress,
        categories: ["support", "enquiry"],
      };
      const summaryMails = await summerizeInRealTime(finalBatch, emailAddress);
      if (summaryMails.constructor !== Array) {
        const temp = ReturnArray[j];

        const encryptedLongSummary = await encrypt(summaryMails.summary);
        if (temp) {
          temp.longSummary = encryptedLongSummary;
          temp.shortSummary = summaryMails.short_summary;
          temp.tone = summaryMails.tone;
          temp.category = summaryMails.category;
          temp.sentiment = summaryMails.sentiment;
        }
        j++;
      } else {
        let k = 0;
        let tempj = j;
        for (; j < summaryMails?.length + tempj || 0; j++) {
          const temp = ReturnArray[j];

          if (temp) {
            const encryptedLongSummary = await encrypt(summaryMails[k].summary);
            temp.longSummary = encryptedLongSummary;
            temp.shortSummary = summaryMails[k].short_summary;

            temp.tone = summaryMails[k].tone;
            temp.category = summaryMails[k].category;
            temp.sentiment = summaryMails[k].sentiment;
          }
          k++;
        }
      }
    }
  } catch (err) {
    console.log("worker.js error", err);
  } finally {
    return { ReturnArray, skippedMails };
  }
  // for (let i = 0; i < queue.length; i++) {
  //   const batch = [];
  //   for (let j = 0; j < queue[i].length; j++) {
  //     const id = queue[i][j].id;
  //     const isSkipped = skippedMails.find((mail) => mail.id === id);
  //     if (!isSkipped){
  //       const temp = finalEmailFormat.find(mail => mail.mail_id === id);
  //       batch.push(temp);
  //     }
  //     else {
  //       const temp = ReturnArray.find((mail) => mail.id === isSkipped.id);
  //       temp.summary = "Too long to summerize";
  //       temp.long_summary = "Too long to summerize";
  //     }

  //     console.log("batch", batch);
  //     const summaryMails = await summerizeInRealTime(batch);
  //     if(summaryMails.constructor !== Array){
  //       const temp = ReturnArray.find(
  //           (mail) => mail.emailID == summaryMails.mail_id
  //         );
  //         if (temp) {
  //           temp.long_summary = summaryMails.summary;
  //           temp.summary = summaryMails.short_summary;
  //           temp.toneOfEmail = summaryMails.tone;
  //         }
  //     }
  //     else{
  //     for (let i = 0; i < summaryMails?.length || 0; i++) {
  //       const temp = ReturnArray.find(
  //         (mail) => mail.emailID == summaryMails[i].mail_id
  //       );

  //       if (temp) {
  //         temp.long_summary = summaryMails[i].summary;
  //         temp.summary = summaryMails[i].short_summary;
  //         temp.toneOfEmail = summaryMails[i].tone;
  //       }
  //     }
  //   }
  //   }

  //   // ReturnArray.push(summaryMails);
  // }
  // console.log("return array", ReturnArray);
  // return ReturnArray;
}

function removeEscapeSequence(text) {
  const result = text
    .replace(/https?:\/\/[^\s<>]+/g, "")
    .replace(/<|>/g, "")
    .replace(/[\n\r]/g, "")
    .replace(/\s\s+/g, " ")
    .replace(/''/g, "");
  return result;
}
function tokenCounter(text) {
  return text.length >> 2;
}
