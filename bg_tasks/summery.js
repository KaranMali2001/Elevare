async function summerizeInRealTime(emails, emailAddress) {
  let data;
  let URL;
  // console.log('emails to llm',emails)
  if (emails.length === 1) {
    URL = `${process.env.LLM_URL}api/post/summury/mail`;
    data = JSON.stringify(emails.at(0));
  } else {
    URL = `${process.env.LLM_URL}http://127.0.0.1:8000/api/post/summury/batch_of_mails`;
    data = JSON.stringify(emails);
  }
  // console.log("Input to LLM", data);
  // console.log("Input to LLM without stringgify", emails);

  // const data = JSON.stringify(emails);

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
module.exports = {
  summerizeInRealTime,
};
