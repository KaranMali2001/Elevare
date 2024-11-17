import { MAIL_COUNT } from "./constants.js";

export async function handleFirstTimeUser(emailAddress, accessToken) {
  try {
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=INBOX&q=in:inbox&maxResults=${MAIL_COUNT}`,

      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const data = await response.json();
    // console.log("data is ", data);
    if (!response.ok) {
      throw new Error("Failed to fetch email details" + data);
    }
    let ids = [];
    for (let i = data.messages.length - 1; i >= 0; i--) {
      ids.push(data.messages[i].id);
    }
    console.log("ids from newUser & user is ", ids, emailAddress);
    return ids;
  } catch (error) {
    // Improved error logging
    throw new Error("Error fetching emails:" + error.message);
  }
}
