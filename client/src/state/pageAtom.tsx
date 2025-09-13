import { atom } from "recoil";

export type Page = "Greet" | "Call";

export const pageAtom = atom<Page>({
  key: "pageAtom", // unique ID for this atom
  default: "Greet", // initial value
});

