import { TickerData } from "@/api/binance";
import { favoritesState } from "@/atoms/favoritesAtom";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";

export const useFilteredTradingPairs = (tickerData: TickerData[] | undefined, selectedTab: string, selectedSubTabs: string[]) => {
  const favorites = useRecoilValue(favoritesState);

  //console.log("favorites", favorites);

  return useMemo(() => {
    if (!tickerData || !Array.isArray(tickerData)) return [];

    return tickerData
      .filter((ticker) => {
        if (selectedTab === "Favorites") {
          return favorites.some((favorite: any) => favorite.symbol === ticker.symbol);
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
        let baseAsset, quoteAsset;
        const pair = selectedTab === "ALTS" || selectedTab === "FIAT" ? selectedSubTabs.find((subTab) => ticker.symbol.endsWith(subTab)) || "ETH" : selectedTab;

        if (!pair || pair === "Favorites") {
          //console.log("pair11", pair);
          const quoteAssets = ["USDT", "BUSD", "USDC", "TUSD", "BTC", "ETH", "BNB", "FDUSD"];
          quoteAsset = quoteAssets.find((quote) => ticker.symbol.endsWith(quote)) || "";
          baseAsset = ticker.symbol.replace(quoteAsset, "");

          return {
            symbol: baseAsset,
            pair: quoteAsset,
            leverage: "5x",
            price: parseFloat(ticker.lastPrice).toLocaleString(),
            change: `${parseFloat(ticker.priceChangePercent) >= 0 ? "+" : ""}${ticker.priceChangePercent}%`,
            volume: ticker.volume,
          };
        } else {
          //console.log("pair", pair);
          return {
            symbol: ticker.symbol.replace(pair, ""),
            pair,
            leverage: "5x",
            price: parseFloat(ticker.lastPrice).toLocaleString(),
            change: `${parseFloat(ticker.priceChangePercent) >= 0 ? "+" : ""}${ticker.priceChangePercent}%`,
            volume: ticker.volume,
          };
        }
      })
      .filter((pair) => pair.price !== "0" && pair.price !== "0.00");
  }, [tickerData, selectedTab, selectedSubTabs]);
};
