"use server";
import { formatEmailInEmailFullFormat } from "@/utils/formatEmailInEmailFullFormat";
import { cookies } from "next/headers";

export default async function getEmailIdsByThreadId(threadId: string) {
  // console.log("threadId in", threadId);
  const cookieStore = cookies();
  const accessToken = cookieStore.get("Token")?.value;
  // console.log("accessToken", accessToken);
  if (!accessToken) {
    throw new Error("No access token found");
  }

  try {
    const response = await fetch(
      // `https://gmail.googleapis.com/gmail/v1/users/me/threads/${threadId}?format=minimal`,
      `https://gmail.googleapis.com/gmail/v1/users/me/threads/${threadId}?format=full`,

      // `https://gmail.googleapis.com/gmail/v1/users/me/messages?threadId=${threadId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error("Failed to fetch emails from Gmail API");
    }

    const data = await response.json();
    // console.log("response data", data);
    const messages: EmailFullFormat[] = [];
    for (let i = 0; i < data.messages.length; i++) {
      messages.push(await formatEmailInEmailFullFormat(data.messages[i]));
    }
    return messages;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching emails:", errorMessage);
    throw new Error(errorMessage);
  }
}
