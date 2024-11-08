import { atom } from "recoil";

export const trashEmailsAtom = atom<any[]>({
  key: "trashEmails", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
export const trashNextPageToken = atom<string>({
  key: "trashNextPageToken",
  default: "InitialState",
});
