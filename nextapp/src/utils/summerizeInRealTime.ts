"use server";

export async function summerizeInRealTime(
  emails: finalbatchOfEmailsReqBody,
  userEmailAddress: string
) {
  let data;
  let URL;
  const categories = [
    "Security",
    "Personal",

    "Finance",
    "Marketing",
    "Education",
    "Customer Service",
  ];
  const LLMReqObject = {
    username: userEmailAddress,
    emails: emails.emails,
    categories: categories,
  };
  if (emails.emails.length === 1) {
    // URL = `${process.env.LLM_URL}/api/post/mail`;
    URL = `${process.env.LLM_URL}api/post/summury/mail`;
    data = JSON.stringify(LLMReqObject);
  } else {
    URL = `${process.env.LLM_URL}api/post/summury/batch_of_mails`;
    data = JSON.stringify(LLMReqObject);
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
