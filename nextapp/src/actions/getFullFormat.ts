import { NextResponse } from "next/server";
import "server-only";
export async function emailFullFormat(
  id: string,
  accessToken: string,
  requestFrom?: string,
) {
  if (!accessToken || !id) {
    return NextResponse.json(
      { error: "Access token and email ID are required" },
      { status: 400 },
    );
  }
  try {
    const response = await fetch(
      `https://www.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch email details");
    }

    const data = await response.json();
    // console.log("email full format", data.payload.parts.parts);
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

    if (requestFrom === "idPage") return NextResponse.json({ res: email });
    else return email;
  } catch (error: any) {
    if (requestFrom === "idPage") return NextResponse.json({ res: error });
    else return error;
  }
}
