import { atom } from "recoil";

export const sendEmailsAtom = atom<any[]>({
  key: "sendEmails", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

export const sendEmailsDBpageNumber = atom<number>({
  key: "pageNumber", // unique ID (with respect to other atoms/selectors)
  default: 1, // default value (aka initial value)
});
export const maxSendMailCount = atom<number>({
  key: "maxCount",
  default: 0,
});
