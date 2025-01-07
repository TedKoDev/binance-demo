import React, { useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { coinState } from "@/atoms/coinAtom";
import { useOrderBook } from "@/hooks/queries/useCoinList";
import { selectedPriceState } from "@/atoms/priceAtom";
import { Ionicons } from "@expo/vector-icons";

export const OrderBook = () => {
  const { selectedCoin, selectedPair } = useRecoilValue(coinState);
  const symbol = `${selectedCoin}${selectedPair}`;
  const { data, isLoading, error } = useOrderBook(symbol);
  const setSelectedPrice = useSetRecoilState(selectedPriceState);

  const [sliceNum, setSliceNum] = useState(7);
  const [viewMode, setViewMode] = useState<"all" | "asks" | "bids">("all");

  const formatK = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    return num.toString();
  };

  const handlePriceSelect = (price: string) => {
    setSelectedPrice(price);
  };

  const toggleViewMode = () => {
    setViewMode((current) => {
      if (current === "all") return "asks";
      if (current === "asks") return "bids";
      return "all";
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error loading order book</Text>
      </View>
    );
  }

  // Get the middle price (last ask price)
  const currentPrice = data?.asks[0]?.[0] || 0;

  return (
    <View className="flex-1 bg-white">
      {/* Header with Toggle Button */}
      <View className="flex-row justify-between px-4 py-2 border-b border-gray-100">
        <View className="flex items-start">
          <Text className="text-gray-500 text-sm">Price</Text>
          <Text className="text-gray-500 text-sm">({selectedPair})</Text>
        </View>
        <View className="flex items-end">
          <Text className="text-gray-500 text-sm">Amount</Text>
          <Text className="text-gray-500 text-sm">({selectedCoin})</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Asks (Sell orders) */}
        {viewMode !== "bids" &&
          data?.asks
            .slice()
            .reverse()
            .slice(0, viewMode === "asks" ? 13 : 7)
            .map((ask, index) => (
              <TouchableOpacity key={`ask-${index}`} className="flex-row justify-between px-4 py-[3px]" onPress={() => handlePriceSelect(ask[0])}>
                <Text className="text-red-500 text-sm font-medium">{Number(ask[0]).toFixed(6)}</Text>
                <Text className="text-gray-700 text-sm">{formatK(Number(ask[1]))}</Text>
              </TouchableOpacity>
            ))}

        {/* Current Price */}
        <TouchableOpacity className="flex-row justify-between px-4 py-2 border-y border-gray-100" onPress={() => handlePriceSelect(currentPrice.toString())}>
          <Text className="text-emerald-500 text-sm font-bold">{Number(currentPrice).toFixed(6)}</Text>
          <Text className="text-gray-400 text-sm">≈ ${Number(currentPrice).toFixed(6)}</Text>
        </TouchableOpacity>

        {/* Bids (Buy orders) */}
        {viewMode !== "asks" &&
          data?.bids.slice(0, viewMode === "bids" ? 13 : 7).map((bid, index) => (
            <TouchableOpacity key={`bid-${index}`} className="flex-row justify-between px-4 py-[3px]" onPress={() => handlePriceSelect(bid[0])}>
              <Text className="text-emerald-500 text-sm font-medium">{Number(bid[0]).toFixed(6)}</Text>
              <Text className="text-gray-700 text-sm">{formatK(Number(bid[1]))}</Text>
            </TouchableOpacity>
          ))}

        <TouchableOpacity onPress={toggleViewMode} className="w-6 h-6 justify-center items-center">
          {viewMode === "all" && <Ionicons name="grid-outline" size={20} color="#666" />}
          {viewMode === "asks" && <Ionicons name="arrow-down" size={20} color="#ef4444" />}
          {viewMode === "bids" && <Ionicons name="arrow-up" size={20} color="#10b981" />}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
