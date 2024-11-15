"use server";

export async function summerizeInRealTime(
  emails: finalbatchOfEmailsReqBody,
  userEmailAddress: string
) {
  let data;
  let URL;
  if (emails.emails.length === 1) {
    // URL = `${process.env.LLM_URL}/api/post/mail`;
    URL = `${process.env.LLM_URL}api/post/summury/mail`;
    data = JSON.stringify(emails.emails.at(0));
  } else {
    URL = `${process.env.LLM_URL}api/post/summury/batch_of_mails`;
    data = JSON.stringify(emails);
  }
  console.log("url is ", URL);
  console.log("LLM input", data);
  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    if (!res.ok) {
      console.log("error from LLM", await res.json());
      throw new Error("error from LLM to generate response");
    }
    const summaryMails: batchOfEmailsResBody[] = await res.json();

    return summaryMails;
  } catch (e: any) {
    console.log("error from LLM", await e);
    throw new Error("error form summery.ts" + e);
  }
}
