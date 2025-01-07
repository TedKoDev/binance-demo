import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable } from "react-native";

interface AmountInputProps {
  selectedCoin?: string;
  stepSize?: number;
}

export default function AmountInput({ selectedCoin = "BTC", stepSize = 1 }: AmountInputProps) {
  const [amount, setAmount] = useState("");

  useEffect(() => {
    setAmount("");
  }, [selectedCoin]);

  const handleIncrement = () => {
    const currentAmount = parseFloat(amount) || 0;
    const updatedAmount = currentAmount + stepSize;
    setAmount(Number(updatedAmount.toFixed(getDecimalPlaces(stepSize))).toString());
  };

  const handleDecrement = () => {
    const currentAmount = parseFloat(amount) || 0;
    if (currentAmount >= stepSize) {
      const updatedAmount = currentAmount - stepSize;
      setAmount(Number(updatedAmount.toFixed(getDecimalPlaces(stepSize))).toString());
    }
  };

  const handleChangeText = (value: string) => {
    if (value === "") {
      setAmount("");
      return;
    }

    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setAmount(Number(numValue.toFixed(getDecimalPlaces(stepSize))).toString());
    }
  };

  const getDecimalPlaces = (step: number) => {
    const stepStr = step.toString();
    if (stepStr.includes(".")) {
      return stepStr.split(".")[1].length;
    }
    return 0;
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
