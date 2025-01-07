import React, { useEffect } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedPriceState } from "@/atoms/priceAtom";
import { symbolStepSizeSelector } from "@/atoms/exchangeInfo";
import { useOrderBook } from "@/hooks/queries/useCoinList";

export default function PriceInput({ selectedPair = "FDUSD", selectedCoin }: { selectedPair: string; selectedCoin: string }) {
  const [selectedPrice, setSelectedPrice] = useRecoilState(selectedPriceState);
  const stepSizes = useRecoilValue(symbolStepSizeSelector);
  const stepSize = stepSizes[selectedCoin]?.price || 0.000001;

  // OrderBook에서 현재 가격 가져오기
  const symbol = `${selectedCoin}${selectedPair}`;
  const { data: orderBookData } = useOrderBook(symbol);
  const currentPrice = orderBookData?.asks[0]?.[0] || "0";

  useEffect(() => {
    // 코인이 변경될 때 현재 가격으로 설정
    setSelectedPrice(currentPrice.toString());
  }, [selectedCoin, currentPrice]);

  const handleIncrement = () => {
    const currentPrice = parseFloat(selectedPrice || "0");
    const updatedPrice = (currentPrice + stepSize).toFixed(Math.max(0, -Math.log10(stepSize)));
    setSelectedPrice(updatedPrice);
  };

  const handleDecrement = () => {
    const currentPrice = parseFloat(selectedPrice || "0");
    const updatedPrice = Math.max(0, currentPrice - stepSize).toFixed(Math.max(0, -Math.log10(stepSize)));
    setSelectedPrice(updatedPrice);
  };

  const handleChangeText = (value: string) => {
    // Only allow numeric input with decimal point
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setSelectedPrice(value);
    }
  };

  return (
    <View className="bg-gray-100 rounded-lg mb-3 p-2 flex-row justify-between px-2">
      <View className="flex-row items-center justify-center mb-2">
        <Pressable onPress={handleDecrement}>
          <Text className="text-gray-400 text-3xl">-</Text>
        </Pressable>
      </View>

      <View className="items-center justify-center">
        <Text className="text-center text-gray-400 text-xs -mb-2">Price ({selectedPair})</Text>
        <TextInput className="flex-1 text-center text-black text-lg" value={selectedPrice} keyboardType="numeric" onChangeText={handleChangeText} />
      </View>

      <View className="flex-row items-center justify-center mb-2">
        <Pressable onPress={handleIncrement}>
          <Text className="text-gray-400 text-3xl">+</Text>
        </Pressable>
      </View>
    </View>
  );
}
