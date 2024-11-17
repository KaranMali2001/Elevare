export async function summerizeInRealTime(emails, emailAddress) {
  let data;
  let URL;
  // console.log('emails to llm',emails)
  const categories = [
    "Security",
    "Personal",

    "Finance",
    "Marketing",
    "Education",
    "Customer Service",
  ];
  const LLMReqObject = {
    username: emailAddress,
    emails: emails.emails,
    categories: categories,
  };

  URL = `${process.env.LLM_URL}api/post/summury/batch_of_mails`;
  data = JSON.stringify(LLMReqObject);

  try {
    console.log("hello form su");
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    if (!res.ok) {
      console.log("LLM", await res.json());
      throw new Error(
        "error from LLM to generate response:" + (await res.json()),
      );
    }
    const summaryMails = await res.json();
    console.log("LLM response summery Mail", summaryMails);

    return summaryMails;
  } catch (e) {
    console.error(e);
    throw new Error("error form summery.ts" + e);
  }
}
