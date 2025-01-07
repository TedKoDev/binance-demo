import { atom } from "recoil";

export interface CoinState {
  selectedCoin: string;
  searchQuery: string;
}

export const coinState = atom<CoinState>({
  key: "coinState",
  default: {
    selectedCoin: "BTCUSDT",
    searchQuery: "",
  },
});
