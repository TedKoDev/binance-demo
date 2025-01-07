import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useRecoilValue } from "recoil";
import { symbolStepSizeSelector } from "../../atoms/exchangeInfo";

interface AmountInputProps {
  selectedCoin?: string;
  stepSize?: number;
}

export default function AmountInput({ selectedCoin = "BTC", stepSize = 1 }: AmountInputProps) {
  const [amount, setAmount] = useState("");

  const stepSizes = useRecoilValue(symbolStepSizeSelector);
  const stepSize2 = stepSizes[selectedCoin]?.amount; // 기본값 1

  // 코인이 변경될 때 수량 초기화
  useEffect(() => {
    setAmount("");
  }, [selectedCoin]);

  const handleIncrement = () => {
    const currentAmount = parseFloat(amount) || 0;
    const updatedAmount = (currentAmount + stepSize2).toString();
    setAmount(updatedAmount);
  };

  const handleDecrement = () => {
    const currentAmount = parseFloat(amount) || 0;
    if (currentAmount > 0) {
      const updatedAmount = (currentAmount - stepSize2).toString();
      setAmount(updatedAmount);
    }
  };

  return (
    <View className="bg-gray-100 rounded-lg mb-3 p-2 flex-row justify-between px-2">
      <View className="flex-row items-center justify-center mb-2">
        <Pressable className="" onPress={handleDecrement}>
          <Text className="text-gray-400 text-3xl">-</Text>
        </Pressable>
      </View>

      <View className="items-center justify-center flex-1">
        {amount === "" ? (
          <Text className="text-gray-400 text-lg">Amount ({selectedCoin})</Text>
        ) : (
          <>
            <Text className="text-center text-gray-400 text-xs -mb-2">Amount ({selectedCoin})</Text>
            <TextInput className="flex-1 text-center text-black text-lg" value={amount} keyboardType="numeric" onChangeText={(value) => setAmount(value)} />
          </>
        )}
      </View>

      <View className="flex-row items-center justify-center mb-2">
        <Pressable className="" onPress={handleIncrement}>
          <Text className="text-gray-400 text-3xl">+</Text>
        </Pressable>
      </View>
    </View>
  );
}
