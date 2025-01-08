import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface TopTradeItemProps {
  rank: number;
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: string;
  priceChange: string;
  leverage?: string;
  onPress?: () => void;
}

export const TopTradeItem = ({ rank, symbol, baseAsset, quoteAsset, price, priceChange, leverage, onPress }: TopTradeItemProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex-row justify-between items-center py-3">
        <View className="flex-row items-center">
          {/* Rank number */}
          <Text className={`w-6 mr-2 ${rank <= 3 ? "text-yellow-500" : "text-gray-500"}`}>{rank}</Text>

          {/* Symbol info */}
          <View className="flex-row items-center">
            <Text className="text-white font-medium">{baseAsset}</Text>
            <Text className="text-gray-500 ml-1">/{quoteAsset}</Text>
            {leverage && <Text className="text-gray-500 ml-2">{leverage}</Text>}
          </View>
        </View>

        {/* Price info */}
        <View className="items-end">
          <Text className="text-white">{price}</Text>
          <Text className={`${parseFloat(priceChange) >= 0 ? "text-green-500" : "text-red-500"}`}>{priceChange}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
