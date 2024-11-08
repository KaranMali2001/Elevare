import { textFromHtml } from "./textFromHtml";

export function getEmailsFormatForLLM(formattedEmails: EmailFullFormat[]) {
  const finalEmailFormat: batchOfEmailsReqBody[] = [];
  for (let i = 0; i < formattedEmails.length; i++) {
    finalEmailFormat.push({
      mail_id: formattedEmails[i].id,
      subject: formattedEmails[i].subject,
      sender: formattedEmails[i].from,
      body:
        removeEscapeSequence(formattedEmails[i].textPlain) ||
        removeEscapeSequence(textFromHtml(formattedEmails[i].textHtml)) ||
        removeEscapeSequence(textFromHtml(formattedEmails[i].body)),
    });
  }
  return finalEmailFormat;
}
export function removeEscapeSequence(text: string) {
  const result: string = text
    .replace(/https?:\/\/[^\s<>]+/g, "")
    .replace(/<|>/g, "")
    .replace(/[\n\r]/g, "")
    .replace(/\s\s+/g, " ")
    .replace(/''/g, "");
  return result;
}
