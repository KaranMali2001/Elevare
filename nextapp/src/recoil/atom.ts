import { atom } from "recoil";

export const emailsAtom = atom<DashBoardEmail[]>({
  key: "emails", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
export const dbPageNumberAtom = atom<number>({
  key: "dbPageNumberAtom",
  default: 1,
});
export const sideBarOpen = atom<boolean>({
  key: "sideBarOpen",
  default: false,
});
export const categoryfilter = atom<Set<string>>({
  key: "categoryFilter",
  default: new Set(),
});
export const tab = atom<string>({
  key: "tab",
  default: "",
});
