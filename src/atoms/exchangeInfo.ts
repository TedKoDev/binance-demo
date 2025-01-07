import { atom, selector } from "recoil";
import { ExchangeInfo } from "@/api/binance";

export const exchangeInfoState = atom<ExchangeInfo | null>({
  key: "exchangeInfoState",
  default: null,
});

// 심볼별 step size를 쉽게 가져올 수 있는 selector
export const symbolStepSizeSelector = selector({
  key: "symbolStepSizeSelector",
  get: ({ get }) => {
    const exchangeInfo = get(exchangeInfoState);
    if (!exchangeInfo) return {};

    const stepSizes: { [key: string]: { price: number; amount: number } } = {};

    exchangeInfo.symbols.forEach((symbol) => {
      const priceFilter = symbol.filters.find((filter) => filter.filterType === "PRICE_FILTER");
      const lotSizeFilter = symbol.filters.find((filter) => filter.filterType === "LOT_SIZE");

      if (priceFilter?.tickSize && lotSizeFilter?.stepSize) {
        stepSizes[symbol.baseAsset] = {
          price: parseFloat(priceFilter.tickSize),
          amount: parseFloat(lotSizeFilter.stepSize),
        };
      }
    });

    return stepSizes;
  },
});
