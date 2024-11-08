export function getDisplayMails(filter: string, emails: DashBoardEmail[]) {
  let displayMails: DashBoardEmail[] = [];
  if (filter === "all") displayMails = emails;
  if (filter === "security")
    displayMails = emails.filter((email) => email.category === "security");
  if (filter === "education")
    displayMails = emails.filter((email) => email.category === "education");
  if (filter === "career")
    displayMails = emails.filter((email) => email.category === "career");
  if (filter === "newsletter")
    displayMails = emails.filter((email) => email.category === "newsletter");
  return displayMails;
}
