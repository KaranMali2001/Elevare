// import prisma from "@/lib/db";
// import fs from "fs";

export async function ReqBody(emailBody: string) {
  const lines = emailBody.split("\n");

  let isPlainText = false;
  let isPlainHtml = false;

  let plainTextResult = "";

  const data = "This is the content I want to write to the file.";

  const ReturnObject = {
    sender: "",
    contentType: "",
    date: "",
    subject: "",
    textPlain: "",
    textHtml: "",
    id: "",
    threadId: "",
  };

  // Iterate through each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check for the 'From' field
    if (line.startsWith("From")) {
      ReturnObject.sender = line.slice(6);
    }

    // Check for 'Content-Type' with boundary
    if (line.includes("boundary")) {
      const ind = line.indexOf("boundary");
      const contentType = line.slice(0, ind);
      ReturnObject.contentType = contentType;
    }

    // Capture the date
    if (line.startsWith("Date")) {
      ReturnObject.date = line.slice(6);
    }

    // Capture the subject
    if (line.startsWith("Subject")) {
      ReturnObject.subject = line.slice(8);
    }

    // Check for the start of the 'text/plain' part
    if (line.includes("Content-Type: text/plain")) {
      isPlainText = true;

      continue;
    }

    // Check for the start of the 'text/html' part
    if (line.includes("Content-Type: text/html")) {
      isPlainText = false;

      break;
    }

    // Collect lines between 'text/plain' and 'text/html'
    if (isPlainText) {
      plainTextResult += line + "\n";
      ReturnObject.textPlain = plainTextResult.trim();
    }
  }
  //
  // const res =await prisma.emails.create()

  return ReturnObject;
}
