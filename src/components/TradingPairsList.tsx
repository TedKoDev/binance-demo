import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import { useFilteredTradingPairs } from "../hooks/useFilteredTradingPairs";
import { use24hrTicker } from "@/hooks/queries/useCoinList";
import { TickerData } from "@/api/binance";

interface TradingPairsListProps {
  selectedTab: string;
  onPairSelect: () => void;
}

export const TradingPairsList: React.FC<TradingPairsListProps> = ({ selectedTab, onPairSelect }) => {
  const { data: tickerData } = use24hrTicker();
  const filteredPairs = useFilteredTradingPairs(tickerData as TickerData[], selectedTab);

  return (
    <BottomSheetScrollView>
      {filteredPairs.map((pair, index) => (
        <TouchableOpacity key={index} className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100" onPress={onPairSelect}>
          <View>
            <View className="flex-row items-center">
              <Text className="text-base font-bold">{pair.symbol}</Text>
              <Text className="text-gray-400">/{pair.pair}</Text>
              <View className="ml-2 px-1 bg-gray-100 rounded">
                <Text className="text-gray-400 text-xs">{pair.leverage}</Text>
              </View>
            </View>
            <Text className="text-gray-400 text-sm">Vol {parseFloat(pair.volume).toLocaleString()}</Text>
          </View>
          <View className="items-end">
            <Text className="text-base">{pair.price}</Text>
            <Text className={pair.change.startsWith("+") ? "text-emerald-500" : "text-red-500"}>{pair.change}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </BottomSheetScrollView>
  );
};
