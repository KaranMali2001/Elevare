"use server";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export default async function sendMail(email: ReplyEmailFormat) {
  // Get the access token from the session
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("Token")?.value;

  if (!accessToken) {
    return NextResponse.error();
  }
  const session = await auth();

  const sendEmailBody = [
    `From: ${session?.user?.email}`,
    `To: ${email.sender}`, // Replace with the original sender
    `Subject: ${email.subject}`, // Adjust accordingly
    `In-Reply-To: ${email.id}`,
    `References: ${email.id}`,
    "",
    email.body,
  ].join("\n");

  const encodedEmail = Buffer.from(sendEmailBody).toString("base64");

  try {
    // Send the reply
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/send`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          raw: encodedEmail,
          threadId: email.threadId,
        }),
      },
    );

    if (!response.ok) {
      //  const errorData = await response.json();
    }

    const result = await response.json();

    return result;
  } catch (error) {
    return error;
  }
}
