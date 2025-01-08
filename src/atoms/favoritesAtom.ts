import { atom } from "recoil";

export const favoritesState = atom<any[]>({
  key: "favoritesState",
  default: [],
});
