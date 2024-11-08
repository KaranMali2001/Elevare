export function getOneEmailForOneThread(
  emails: DashBoardEmail[],
  threadIdSet: Set<string>,
) {
  const res: DashBoardEmail[] = emails.filter((email) => {
    if (threadIdSet.has(email.threadId)) {
      return false;
    } else {
      threadIdSet.add(email.threadId);
      return true;
    }
  });
  return res;
}
