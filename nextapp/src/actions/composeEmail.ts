"use server";

export async function composeEmail(
  input: string = `To: karansignup5599@gmail.com
From: rohit2khairmode2024@gmail.com
Subject: Test Email
Content-Type: text/plain; charset="UTF-8"

This is a sample email sent from Gmail API.
`,
  accesToken: string,
) {
  console.log("Started", input);
  const url = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";

  const res = await (
    await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accesToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        raw: btoa(unescape(encodeURIComponent(input))), // Base64 encode
      }),
    })
  ).json();
  console.log("Email sent:", res);
  return res;
}
