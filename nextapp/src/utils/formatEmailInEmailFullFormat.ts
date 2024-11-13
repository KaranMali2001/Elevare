export async function formatEmailInEmailFullFormat(data: any) {
  let email: EmailFullFormat = {
    id: data.id,
    threadId: data.threadId,
    labels: data.labelIds,
    snippet: data.snippet,
    date:
      data.payload?.headers?.find((header: any) => header.name === "Date")
        ?.value || "",
    from:
      data.payload?.headers?.find((header: any) => header.name === "From")
        ?.value || "",
    to:
      data.payload?.headers?.find((header: any) => header.name === "To")
        ?.value || "",
    subject:
      data.payload?.headers?.find((header: any) => header.name === "Subject")
        ?.value || "",
    textPlain:
      data.payload?.parts?.find((part: any) => part.mimeType === "text/plain")
        ?.body.data || "", //
    textHtml:
      data.payload?.parts?.find((part: any) => part.mimeType === "text/html")
        ?.body.data || "",
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

  email.textPlain = Buffer.from(email.textPlain, "base64").toString("utf-8");
  email.textHtml = Buffer.from(email.textHtml, "base64").toString("utf-8");
  email.body = Buffer.from(email.body, "base64").toString("utf-8");
  return email;
}
