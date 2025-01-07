import { atom } from "recoil";

export interface CoinState {
  selectedCoin: string;
  selectedPair: string;
  priceChange: string;
  searchQuery: string;
  selectedTab: string;
  selectedSubTabs: string[];
}

export const coinState = atom<CoinState>({
  key: "coinState",
  default: {
    selectedCoin: "PENGU",
    selectedPair: "USDT",
    priceChange: "+0.67%",
    searchQuery: "",
    selectedTab: "USDT",
    selectedSubTabs: ["ETH"],
  },
});
