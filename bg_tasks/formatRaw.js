export async function formatRawData(id, accessToken) {
  const res = await emailFullFormat(id, accessToken);
  return res;
}

async function emailFullFormat(id, accessToken) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      console.log("inside resp not okey", response);
      throw new Error("Failed to fetch email details");
    }

    const data = await response.json();
    let email = {};
    email = {
      id: data.id,
      threadId: data.threadId,
      labelIds: data.labelIds,
      snippet: data.snippet,
      date:
        data.payload?.headers?.find((header) => header.name === "Date")
          ?.value || "",
      from:
        data.payload?.headers?.find((header) => header.name === "From")
          ?.value || "",
      to:
        data.payload?.headers?.find((header) => header.name === "To")?.value ||
        "",
      subject:
        data.payload?.headers?.find((header) => header.name === "Subject")
          ?.value || "",
      textPlain:
        data.payload?.parts?.find((part) => part.mimeType === "text/plain")
          ?.body.data || "", //
      textHtml:
        data.payload?.parts?.find((part) => part.mimeType === "text/html")?.body
          .data || "",
      body: data.payload?.body.data || "",
    };
    if (email.textHtml === "" && email.textPlain === "" && email.body === "") {
      const temp = data.payload.parts[0].parts;
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].mimeType === "text/plain") {
          email.textPlain = temp[i].body.data;
          break;
        } else if (temp[i].mimeType === "text/html") {
          email.textHtml = temp[i].body.data || "";
          break;
        } else if (temp[i].mimeType === "multipart/alternative") {
          email.body = temp[i].body.data || "";
          break;
        }
      }
    }

    if (email.textPlain !== "")
      email.textPlain = Buffer.from(email.textPlain, "base64").toString(
        "utf-8"
      );
    else if (email.textHtml !== "")
      email.textHtml = Buffer.from(email.textHtml, "base64").toString("utf-8");
    else if (email.body !== "")
      email.body = Buffer.from(email.body, "base64").toString("utf-8");
    return email;
  } catch (error) {
    console.log("inside catch", error);
    throw error;
  }
}
