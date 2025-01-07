import { useQuery } from "@tanstack/react-query";
import { fetchCoinList, fetchOrderBook, fetchKlines, fetch24hrTicker } from "../../api/binance";

export const useCoinList = () => {
  return useQuery({
    queryKey: ["coinList"],
    queryFn: fetchCoinList,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

export const useOrderBook = (symbol: string) => {
  return useQuery({
    queryKey: ["orderBook", symbol],
    queryFn: () => fetchOrderBook(symbol),
  });
};

export const useKlines = (symbol: string, interval: string) => {
  return useQuery({
    queryKey: ["klines", symbol, interval],
    queryFn: () => fetchKlines(symbol, interval),
  });
};

export const use24hrTicker = (symbol?: string) => {
  return useQuery({
    queryKey: ["24hrTicker", symbol],
    queryFn: () => fetch24hrTicker(symbol),
    staleTime: 1000 * 60 * 5, // 5분
  });
};
