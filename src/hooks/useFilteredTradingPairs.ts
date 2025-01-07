import { TickerData } from "@/api/binance";
import { useMemo } from "react";

export const useFilteredTradingPairs = (tickerData: TickerData[] | undefined, selectedTab: string) => {
  return useMemo(() => {
    if (!tickerData || !Array.isArray(tickerData)) return [];

    return tickerData
      .filter((ticker) => {
        if (selectedTab === "Favorites") {
          // Favorites 로직 구현 필요
          return false;
        }

        if (selectedTab === "ALTS") {
          return (
            !ticker.symbol.endsWith("USDT") &&
            !ticker.symbol.endsWith("FDUSD") &&
            !ticker.symbol.endsWith("USDC") &&
            !ticker.symbol.endsWith("TUSD") &&
            !ticker.symbol.endsWith("BNB") &&
            !ticker.symbol.endsWith("BTC") &&
            !ticker.symbol.endsWith("ALTS") &&
            !ticker.symbol.endsWith("FIAT") &&
            !ticker.symbol.endsWith("Zones")
          );
        }

        return ticker.symbol.endsWith(selectedTab);
      })
      .map((ticker) => ({
        symbol: ticker.symbol.replace(selectedTab, ""),
        pair: selectedTab,
        leverage: "5x",
        price: parseFloat(ticker.lastPrice).toLocaleString(),
        change: `${parseFloat(ticker.priceChangePercent) >= 0 ? "+" : ""}${ticker.priceChangePercent}%`,
        volume: ticker.volume,
      }))
      .filter((pair) => pair.price !== "0" && pair.price !== "0.00");
  }, [tickerData, selectedTab]);
};
