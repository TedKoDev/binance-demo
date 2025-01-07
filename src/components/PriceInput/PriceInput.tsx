import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";

export default function PriceInput({ selectedPair = "FDUSD" }) {
  const [price, setPrice] = useState("102006.01");

  const handleIncrement = () => {
    const updatedPrice = (parseFloat(price) + 1).toFixed(2);
    setPrice(updatedPrice);
  };

  const handleDecrement = () => {
    const updatedPrice = (parseFloat(price) - 1).toFixed(2);
    setPrice(updatedPrice);
  };

  return (
    <View className="bg-gray-100 rounded-lg mb-3 p-2 flex-row justify-between px-2">
      <View className="flex-row items-center justify-center  mb-2">
        <Pressable className="" onPress={handleDecrement}>
          <Text className="text-gray-400 text-3xl">-</Text>
        </Pressable>
      </View>
      {/* Label */}
      <View className=" items-center justify-center ">
        <Text className="text-center text-gray-400 text-xs -mb-2 ">Price ({selectedPair})</Text>

        {/* Input */}
        <TextInput className="flex-1 text-center text-black text-lg" value={price} keyboardType="numeric" onChangeText={(value) => setPrice(value)} />

        {/* Increment Button */}
      </View>
      <View className="flex-row items-center justify-center  mb-2">
        <Pressable className="" onPress={handleIncrement}>
          <Text className="text-gray-400 text-3xl">+</Text>
        </Pressable>
      </View>
    </View>
  );
}
