import { TickerData } from "@/api/binance";
import { useMemo } from "react";

export const useFilteredTradingPairs = (tickerData: TickerData[] | undefined, selectedTab: string, selectedSubTabs: string[]) => {
  return useMemo(() => {
    if (!tickerData || !Array.isArray(tickerData)) return [];

    return tickerData
      .filter((ticker) => {
        if (selectedTab === "Favorites") {
          return false;
        }

        if (selectedTab === "ALTS") {
          const baseSymbols = selectedSubTabs.length > 0 ? selectedSubTabs : ["ETH"];
          return baseSymbols.some(
            (baseSymbol) =>
              ticker.symbol.endsWith(baseSymbol) &&
              !ticker.symbol.endsWith("USDT") &&
              !ticker.symbol.endsWith("FDUSD") &&
              !ticker.symbol.endsWith("USDC") &&
              !ticker.symbol.endsWith("TUSD") &&
              !ticker.symbol.endsWith("BNB") &&
              !ticker.symbol.endsWith("BTC")
          );
        }

        if (selectedTab === "FIAT") {
          const fiatSymbols = selectedSubTabs.length > 0 ? selectedSubTabs : ["EUR"];
          return fiatSymbols.some((fiatSymbol) => ticker.symbol.endsWith(fiatSymbol));
        }

        return ticker.symbol.endsWith(selectedTab);
      })
      .map((ticker) => {
        const pair = selectedTab === "ALTS" || selectedTab === "FIAT" ? selectedSubTabs.find((subTab) => ticker.symbol.endsWith(subTab)) || "ETH" : selectedTab;

        return {
          symbol: ticker.symbol.replace(pair, ""),
          pair,
          leverage: "5x",
          price: parseFloat(ticker.lastPrice).toLocaleString(),
          change: `${parseFloat(ticker.priceChangePercent) >= 0 ? "+" : ""}${ticker.priceChangePercent}%`,
          volume: ticker.volume,
        };
      })
      .filter((pair) => pair.price !== "0" && pair.price !== "0.00");
  }, [tickerData, selectedTab, selectedSubTabs]);
};
