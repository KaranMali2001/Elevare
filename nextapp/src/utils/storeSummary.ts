export function latestDate(mails: DashBoardEmail[] | EmailFullFormat[]) {
  const res: string = mails.reduce(
    (acc: string, mail: DashBoardEmail | EmailFullFormat) => {
      const curDate = new Date(mail.date);
      const accDate = new Date(acc);
      if (curDate > accDate) acc = curDate.toString();
      return acc;
    },
    "1970-01-01"
  );
  return res;
}
