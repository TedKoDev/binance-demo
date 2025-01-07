import { atom } from "recoil";

export const selectedPriceState = atom<string>({
  key: "selectedPriceState",
  default: "",
});
