// recoil/selectors.ts
import { selectorFamily } from "recoil";
import { emailsAtom } from "./atom";

export const emailById = selectorFamily({
  key: "emailById",
  get:
    (id: string) =>
    ({ get }) => {
      const emails = get(emailsAtom);
      return emails.find((email) => email.id === id);
    },
});
