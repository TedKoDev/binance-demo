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
  const stepSize2 = stepSizes[selectedCoin]?.amount || 1;
  console.log("stepSize2", stepSize2);

  // 코인이 변경될 때 수량 초기화
  useEffect(() => {
    setAmount("");
  }, [selectedCoin]);

  const handleIncrement = () => {
    const currentAmount = parseFloat(amount) || 0;
    // 소수점 자릿수 계산
    const decimals = Math.max(0, -Math.log10(stepSize2));
    const updatedAmount = (currentAmount + stepSize2).toFixed(decimals);
    setAmount(updatedAmount);
  };

  const handleDecrement = () => {
    const currentAmount = parseFloat(amount) || 0;
    if (currentAmount > 0) {
      // 소수점 자릿수 계산
      const decimals = Math.max(0, -Math.log10(stepSize2));
      const updatedAmount = (currentAmount - stepSize2).toFixed(decimals);
      setAmount(updatedAmount);
    }
  };

  const handleChangeText = (value: string) => {
    // 숫자와 소수점만 허용
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setAmount(value);
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
            <TextInput className="flex-1 text-center text-black text-lg" value={amount} keyboardType="numeric" onChangeText={handleChangeText} />
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
