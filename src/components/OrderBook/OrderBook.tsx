import React from "react";
import { View, Text, ScrollView } from "react-native";

export const OrderBook = () => {
  const asks = [
    { price: 0.042152, amount: 43.23 },
    { price: 0.042151, amount: 261 },
    { price: 0.04215, amount: 237 },
    { price: 0.042149, amount: 4.73 },
    { price: 0.042148, amount: 8.11 },
    { price: 0.042147, amount: 237 },
    { price: 0.042146, amount: 18.15 },
    { price: 0.042145, amount: 5.68 },
    { price: 0.042144, amount: 48.06 },
    { price: 0.042143, amount: 27.78 },
    { price: 0.042142, amount: 3.1 },
    { price: 0.042141, amount: 24 },
    { price: 0.04214, amount: 4.0 },
  ];

  const currentPrice = 0.042141;

  const bids = [
    { price: 0.042139, amount: 11.99 },
    { price: 0.042138, amount: 24 },
    { price: 0.042137, amount: 237 },
    { price: 0.042136, amount: 4.78 },
    { price: 0.042135, amount: 237 },
    { price: 0.042134, amount: 13.7 },
    { price: 0.042133, amount: 618 },
    { price: 0.042132, amount: 51.49 },
    { price: 0.042131, amount: 118.58 },
  ];

  const formatK = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    return num.toString();
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row justify-between px-4 py-2 border-b border-gray-100">
        <Text className="text-gray-500 text-sm">Price(USDT)</Text>
        <Text className="text-gray-500 text-sm">Amount(PENGU)</Text>
      </View>
      <ScrollView className="flex-1">
        {/* Asks (Sell orders) */}
        {asks.reverse().map((ask, index) => (
          <View key={`ask-${index}`} className="flex-row justify-between px-4 py-[3px]">
            <Text className="text-red-500 text-sm font-medium">{ask.price.toFixed(6)}</Text>
            <Text className="text-gray-700 text-sm">{formatK(ask.amount)}</Text>
          </View>
        ))}

        {/* Current Price */}
        <View className="flex-row justify-between px-4 py-2 border-y border-gray-100">
          <Text className="text-emerald-500 text-sm font-bold">{currentPrice.toFixed(6)}</Text>
          <Text className="text-gray-400 text-sm">≈ ${currentPrice.toFixed(6)}</Text>
        </View>

        {/* Bids (Buy orders) */}
        {bids.map((bid, index) => (
          <View key={`bid-${index}`} className="flex-row justify-between px-4 py-[3px]">
            <Text className="text-emerald-500 text-sm font-medium">{bid.price.toFixed(6)}</Text>
            <Text className="text-gray-700 text-sm">{formatK(bid.amount)}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
