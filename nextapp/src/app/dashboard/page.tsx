import { GetAllEmails } from "@/actions/getAllEmails";
import { getEmailsWithPaginationFromDB } from "@/actions/getEmailsWithPaginationFromDB";
import { EmailClientComponent } from "@/components/email-client";

import { auth } from "@/lib/auth";
import { getDBMailCnt } from "@/lib/data-services";
import { getDashBoardMailsFromQueueElement } from "@/utils/getDashBoardMailsFromQueueElement";
import { getOneEmailForOneThread } from "@/utils/getOneEmailForOneThread";
import { storeRealTimeEmails } from "@/utils/storeRealTimeEmails";

export default async function Page({ searchParams }: any) {
  const res = await GetAllEmails();
  const categories = new Set(["security", "newsletter", "education", "others"]); //IMP we will fetch this from db

  const session = await auth();
  const userEmailAddress = session?.user?.email;

  if (!res) return "Something went wrong";

  let {
    data,
    queue,
    skippedMails,
  }: {
    data: DashBoardEmail[];
    queue: EmailFullFormat[][];
    skippedMails: SkippedMail[];
  } = await res.json();

  let firstTimeFetched = true;
  let dbMailCnt: number = await getDBMailCnt(userEmailAddress || "");
  let PageNumber;
  const threadIdSet = new Set<string>();
  if (data.length == 0) {
    if (queue.length == 0) {
      let emailFromDB: DashBoardEmail[] =
        await getEmailsWithPaginationFromDB(1);

      data = getOneEmailForOneThread(emailFromDB, threadIdSet);
      PageNumber = 2;
      firstTimeFetched = false;
    } else {
      let mailsFromQueue: DashBoardEmail[] =
        await getDashBoardMailsFromQueueElement(
          queue[0],
          userEmailAddress || "",
        );
      data = [...mailsFromQueue]; //IMP

      let underProcessEmailIds: string[] = [];
      for (let i = 1; i < queue.length; i++) {
        for (let j = 0; j < queue[i].length; j++) {
          underProcessEmailIds.push(queue[i][j].id);
        }
      }
      const res = await storeRealTimeEmails(
        data,
        undefined,
        userEmailAddress || "",
        underProcessEmailIds,
      );
      data = getOneEmailForOneThread(mailsFromQueue, threadIdSet);
      if (res) queue.shift();
    }
  } else {
    dbMailCnt -= data.length;
    data = getOneEmailForOneThread(data, threadIdSet);
    //imp because while creating queue we are inserting emails to database which increases the mail cnt but in pagination we are only want to take emails which are not fetched live
  }

  return (
    <EmailClientComponent
      mails={data}
      queue={queue}
      dbMailCnt={dbMailCnt}
      PageNumber={PageNumber}
      firstTimeFetched={firstTimeFetched}
      threadIdSet={threadIdSet}
      categories={categories}
    />
  );
}
