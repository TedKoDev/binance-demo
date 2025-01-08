import { atom } from "recoil";

export interface SearchHistory {
  symbol: string;
  leverage: string;
  price: number;
  change: number;
  rank: number;
  baseAsset: string;
  quoteAsset: string;
}

export const searchHistoryState = atom<SearchHistory[]>({
  key: "searchHistoryState",
  default: [],
});
