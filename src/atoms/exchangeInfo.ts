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

    const stepSizes: { [key: string]: number } = {};

    exchangeInfo.symbols.forEach((symbol) => {
      const lotSizeFilter = symbol.filters.find((filter) => filter.filterType === "LOT_SIZE");
      if (lotSizeFilter?.stepSize) {
        stepSizes[symbol.baseAsset] = parseFloat(lotSizeFilter.stepSize);
      }
    });

    return stepSizes;
  },
});
