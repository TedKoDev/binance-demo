import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useRecoilState } from "recoil";

import { useFilteredTradingPairs } from "../../hooks/useFilteredTradingPairs";
import { use24hrTicker } from "@/hooks/queries/useCoinList";
import { TickerData } from "@/api/binance";
import { coinState } from "@/atoms/coinAtom";

interface TradingPairsListProps {
  selectedTab: string;
  selectedSubTabs: string[];
  onPairSelect: () => void;
}

export const TradingPairsList: React.FC<TradingPairsListProps> = ({ selectedTab, selectedSubTabs, onPairSelect }) => {
  const [coin, setCoin] = useRecoilState(coinState);
  const { data: tickerData } = use24hrTicker();
  const filteredPairs = useFilteredTradingPairs(tickerData as TickerData[], selectedTab, selectedSubTabs);

  const handlePairSelect = (pair: any) => {
    setCoin((prev) => ({
      ...prev,
      selectedCoin: pair.symbol,
      selectedPair: pair.pair,
      priceChange: pair.change,
    }));
    onPairSelect();
  };

  return (
    <BottomSheetScrollView>
      {filteredPairs.map((pair, index) => (
        <TouchableOpacity
          key={index}
          style={{ height: 72 }}
          className={`flex-row items-center justify-between px-4 border-b border-gray-100 ${pair.symbol === coin.selectedCoin && pair.pair === coin.selectedPair ? "bg-gray-50" : ""}`}
          onPress={() => handlePairSelect(pair)}
        >
          <View>
            <View className="flex-row items-center">
              <Text className="text-base font-bold">{pair.symbol}</Text>
              <Text className="text-gray-400">/{pair.pair}</Text>
              <View className="ml-2 px-1 bg-gray-100 rounded">
                <Text className="text-gray-400 text-xs">{pair.leverage}</Text>
              </View>
            </View>
            <Text className="text-gray-400 text-sm mt-1">Vol {parseFloat(pair.volume).toLocaleString()}</Text>
          </View>
          <View className="items-end">
            <Text className="text-base">{pair.price}</Text>
            <Text className={`mt-1 ${pair.change.startsWith("+") ? "text-emerald-500" : "text-red-500"}`}>{pair.change}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </BottomSheetScrollView>
  );
};
