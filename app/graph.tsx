import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function GraphScreen() {
  const { symbol } = useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Chart for {symbol}</Text>
      </View>
    </SafeAreaView>
  );
}
