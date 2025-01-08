import { useQuery } from "@tanstack/react-query";
import { fetchCoinList, fetchOrderBook, fetchKlines, fetch24hrTicker } from "../../api/binance";

export const useCoinList = () => {
  return useQuery({
    queryKey: ["coinList"],
    queryFn: fetchCoinList,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

export const useOrderBook = (symbol: string, limit: number = 13) => {
  return useQuery({
    queryKey: ["orderBook", symbol, limit],
    queryFn: () => fetchOrderBook(symbol, limit),
  });
};

export const useKlines = (symbol: string, interval: string, limit: number = 100) => {
  return useQuery({
    queryKey: ["klines", symbol, interval],
    queryFn: () => fetchKlines(symbol, interval, limit),
  });
};

export const use24hrTicker = (symbol?: string) => {
  return useQuery({
    queryKey: ["24hrTicker", symbol],
    queryFn: () => fetch24hrTicker(symbol),
    staleTime: 1000 * 60 * 5, // 5분
  });
};
