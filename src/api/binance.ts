import axios, { AxiosResponse } from "axios";

export interface ExchangeInfo {
  symbols: Array<{
    symbol: string;
    baseAsset: string;
    quoteAsset: string;
    filters: Array<{
      filterType: string;
      stepSize?: string; // LOT_SIZE filter
      tickSize?: string; // PRICE_FILTER filter
      minQty?: string;
      maxQty?: string;
      [key: string]: any;
    }>;
  }>;
}

export interface OrderBookData {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}

export interface TickerData {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
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
      limit: 13,
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

export const fetch24hrTicker = async (symbol?: string): Promise<TickerData | TickerData[]> => {
  const response: AxiosResponse<TickerData | TickerData[]> = await binanceApi.get("/ticker/24hr", {
    params: symbol ? { symbol } : undefined,
  });
  return response.data;
};
