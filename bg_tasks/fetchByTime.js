export async function FetchByTime(email, accessToken, timestamp) {
  try {
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?labelIds=INBOX&q=in:inbox&q=after:${timestamp}`,

      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    if (data.resultSizeEstimate === 0) {
      console.log("All emails of user is already fetched");
      return;
    }
    // console.log("data", data);
    let ids = [];
    for (let i = data.messages.length - 2; i >= 0; i--) {
      ids.push(data.messages[i].id);
    }
    console.log("ids fetchBy time are", ids);
    return ids;
  } catch (error) {
    throw new Error("Error fetching emails:" + error.message);
  }
}
