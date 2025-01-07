import { useQuery } from "@tanstack/react-query";
import { fetchCoinList, fetchOrderBook } from "../api/binance";

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
