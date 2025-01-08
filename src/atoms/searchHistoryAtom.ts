import { atom } from "recoil";

export interface SearchHistory {
  symbol: string;
  leverage: string;
}

export const searchHistoryState = atom<SearchHistory[]>({
  key: "searchHistoryState",
  default: [],
});
