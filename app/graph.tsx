import React from "react";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useKlines } from "@/hooks/queries/useCoinList";
const TABS = [
  { id: "price", label: "Price" },
  { id: "info", label: "Info" },
  { id: "tradingData", label: "Trading Data" },
  { id: "square", label: "Square" },
];

export default function GraphScreen() {
  const { symbol, baseAsset, quoteAsset } = useLocalSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState("price");
  const { data: klines } = useKlines(symbol as string, "1d", 100);
  console.log(klines);

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]">
      <View className="px-4 h-14 flex-row items-center justify-between border-b border-gray-200">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity onPress={() => router.back()} className="pr-3 py-2">
            <Ionicons name="arrow-back" size={24} color="#1E2026" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-[#1E2026]">
            {baseAsset}/{quoteAsset}
          </Text>
          <MaterialIcons name="keyboard-arrow-down" size={24} color="#1E2026" />
        </View>

        <View className="flex-row items-center gap-4">
          <TouchableOpacity>
            <Ionicons name="star-outline" size={24} color="#1E2026" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="share-outline" size={24} color="#1E2026" />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialIcons name="grid-view" size={24} color="#1E2026" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row border-b border-gray-200">
        {TABS.map((tab) => (
          <TouchableOpacity key={tab.id} onPress={() => setActiveTab(tab.id)} className={`px-4 py-3 ${activeTab === tab.id ? "border-b-2 border-[#F0B90B]" : ""}`}>
            <Text className={`${activeTab === tab.id ? "text-[#1E2026] font-medium" : "text-gray-500"}`}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text>{symbol}</Text>
      <Text>dfds{baseAsset}</Text>
      <Text>dfdsaa{quoteAsset}</Text>
    </SafeAreaView>
  );
}
