export function getDashBoardEmails(
  fullFormatEmails: EmailFullFormat[],
  summaryMails: batchOfEmailsResBody[],
) {
  let DashBoardEmails: DashBoardEmail[] = [];
  for (let i = 0; i < summaryMails.length; i++) {
    DashBoardEmails.push({
      id: fullFormatEmails[i].id,
      threadId: fullFormatEmails[i].threadId,
      sentiment: summaryMails[i].sentiment,
      shortSummary: summaryMails[i]?.short_summary,
      longSummary: summaryMails[i]?.summary,
      tone: summaryMails[i]?.tone,
      date: new Date(fullFormatEmails[i]?.date || ""),
      from: fullFormatEmails[i]?.from,
      subject: fullFormatEmails[i]?.subject,
      labels: fullFormatEmails[i]?.labels,
      category: summaryMails[i]?.category?.toLowerCase(),
    });
  }
  return DashBoardEmails;
}
