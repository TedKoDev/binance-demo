import axios, { AxiosResponse } from "axios";

export interface ExchangeInfo {
  symbols: Array<{
    symbol: string;
    baseAsset: string;
    quoteAsset: string;
  }>;
}

export interface OrderBookData {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}

const binanceApi = axios.create({
  baseURL: "https://api.binance.com/api/v3",
});

export const fetchCoinList = async (): Promise<ExchangeInfo> => {
  const response: AxiosResponse<ExchangeInfo> = await binanceApi.get("/exchangeInfo");
  return response.data;
};

export const fetchOrderBook = async (symbol: string): Promise<OrderBookData> => {
  const response: AxiosResponse<OrderBookData> = await binanceApi.get("/depth", {
    params: {
      symbol,
      limit: 10,
    },
  });
  return response.data;
};

export const fetchKlines = async (symbol: string, interval: string, limit: number = 100) => {
  const { data } = await binanceApi.get(`/klines`, {
    params: {
      symbol,
      interval,
      limit,
    },
  });
  return data;
};
