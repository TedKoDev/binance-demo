import React, { useRef, useMemo, useCallback, useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useKlines, useOrderBook } from "@/hooks/queries/useCoinList";
import { CandlestickChart } from "react-native-wagmi-charts";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";

const TABS = [
  { id: "price", label: "Price" },
  { id: "info", label: "Info" },
  { id: "tradingData", label: "Trading Data" },
  { id: "square", label: "Square" },
];

const TIME_INTERVALS = [
  { label: "1s", value: "1s" },
  { label: "1m", value: "1m" },
  { label: "3m", value: "3m" },
  { label: "5m", value: "5m" },
  { label: "30m", value: "30m" },
  { label: "2h", value: "2h" },
  { label: "6h", value: "6h" },
  { label: "8h", value: "8h" },
  { label: "12h", value: "12h" },
  { label: "3D", value: "3d" },
  { label: "1w", value: "1w" },
  { label: "1M", value: "1M" },
];

const PERIODS = [
  { label: "Today", value: "-4.00%" },
  { label: "7 Days", value: "-9.13%" },
  { label: "30 Days", value: "-35.12%" },
  { label: "90 Days", value: "90.95%" },
  { label: "180 Days", value: "101.73%" },
  { label: "1 Year", value: "1449.56%" },
];

const INDICATORS = ["MA", "EMA", "BOLL", "SAR", "AVL", "VOL", "MACD"];

function PriceHeader({ data }: { data: any[] }) {
  //console.log("data", data);
  if (!data || data.length === 0) return null;
  const lastPrice = parseFloat(data[data.length - 1].close);
  const prevPrice = parseFloat(data[data.length - 2].close);
  const priceChange = ((lastPrice - prevPrice) / prevPrice) * 100;
  const volume = parseFloat(data[data.length - 1].volume);
  const high = Math.max(...data.map((d) => parseFloat(d.high)));
  const low = Math.min(...data.map((d) => parseFloat(d.low)));

  return (
    <View className="p-4 bg-white border-b border-gray-200">
      {/* Left Column */}
      <View className="flex-row justify-between">
        <View>
          {/* Main Price */}
          <Text className={`text-2xl font-bold ${priceChange >= 0 ? "text-[#089981]" : "text-[#F23645]"}`}>{lastPrice.toFixed(6)}</Text>

          {/* USD Value */}
          <View className="flex-row items-center mt-1">
            <Text className="text-sm text-gray-500">≈ ${lastPrice.toFixed(6)}</Text>
            <Text className={`ml-2 text-sm ${priceChange >= 0 ? "text-[#089981]" : "text-[#F23645]"}`}>
              {priceChange >= 0 ? "+" : ""}
              {priceChange.toFixed(2)}%
            </Text>
          </View>

          {/* Asset Type Tags */}
          <View className="flex-row mt-2">
            <Text className="text-xs text-gray-500 mr-2 px-2 py-1 bg-gray-100 rounded">NFT</Text>
            <Text className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">New</Text>
          </View>
        </View>

        {/* Right Column - Stats */}
        <View>
          <View className="flex-row justify-end mb-2">
            <View className="flex items-center">
              <Text className="text-xs text-gray-500 mr-2">24h High</Text>
              <Text className="text-sm">{high.toFixed(3)}</Text>
            </View>
            <View className="flex items-center">
              <Text className="text-xs text-gray-500 mr-2">24h Vol(PENGU)</Text>
              <Text className="text-sm">{volume.toFixed(2)}B</Text>
            </View>
          </View>
          <View className="flex-row justify-end mb-2">
            <View className="flex items-center">
              <Text className="text-xs text-gray-500 mr-2">24h Low</Text>
              <Text className="text-sm">{low.toFixed(3)}</Text>
            </View>
            <View className="flex items-center">
              <Text className="text-xs text-gray-500 mr-2">24h Vol(USDT)</Text>
              <Text className="text-sm">{(volume * lastPrice).toFixed(2)}M</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function GraphScreen() {
  const { symbol, baseAsset, quoteAsset } = useLocalSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("price");
  const [interval, setInterval] = useState("1d");
  const { data: klines } = useKlines(symbol as string, interval, 100);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["50%"], []);

  const renderBackdrop = useCallback((props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} pressBehavior="close" enableTouchThrough={true} />, []);

  const { data: orderBook } = useOrderBook(symbol as string, 50);

  const chartData = React.useMemo(() => {
    if (!klines) return [];

    return klines.map((kline: any) => ({
      timestamp: parseInt(kline[0]),
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
      volume: parseFloat(kline[5]),
    }));
  }, [klines]);

  //console.log("Chart Data Length:", chartData.length);
  //console.log("First candle:", chartData[0]);

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]">
      <ScrollView>
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

        {activeTab === "price" && (
          <View className="flex-1">
            <PriceHeader data={chartData} />

            <View className="flex-row items-center border-b border-gray-200 bg-[white] px-2">
              {["15m", "1h", "4h", "1D"].map((time) => (
                <TouchableOpacity key={time} onPress={() => setInterval(time.toLowerCase())} className={`px-3 py-2 ${interval === time.toLowerCase() ? "border-b-2 border-[#F0B90B]" : ""}`}>
                  <Text className={`${interval === time.toLowerCase() ? "text-black" : "text-gray-400"}`}>{time}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => bottomSheetRef.current?.expand()} className="flex-row items-center px-3 py-2">
                <Text className="text-gray-400 mr-1">More</Text>
                <MaterialIcons name="keyboard-arrow-down" size={20} color="#848E9C" />
              </TouchableOpacity>
              <TouchableOpacity className="ml-auto px-3 py-2">
                <MaterialIcons name="layers" size={20} color="#848E9C" />
              </TouchableOpacity>
            </View>
            {chartData.length > 0 && (
              <ScrollView horizontal>
                <CandlestickChart.Provider data={chartData}>
                  <CandlestickChart height={300}>
                    <CandlestickChart.Candles positiveColor="#089981" negativeColor="#F23645" />
                    <CandlestickChart.Crosshair>
                      <CandlestickChart.Tooltip />
                    </CandlestickChart.Crosshair>
                  </CandlestickChart>
                </CandlestickChart.Provider>
              </ScrollView>
            )}

            <View className="border-b border-gray-200">
              {/* Indicators */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 border-b border-gray-200">
                {INDICATORS.map((indicator) => (
                  <TouchableOpacity key={indicator} className="mr-6">
                    <Text className="text-gray-600">{indicator}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity>
                  <MaterialIcons name="add-chart" size={24} color="#666" />
                </TouchableOpacity>
              </ScrollView>

              {/* Period statistics */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4  border-b border-gray-200">
                {PERIODS.map((period) => (
                  <View key={period.label} className="mr-6">
                    <Text className="text-gray-500 text-sm">{period.label}</Text>
                    <Text className={`text-base ${period.value.startsWith("-") ? "text-[#F23645]" : "text-[#089981]"}`}>{period.value}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

        <View className="flex-row px-4 py-2">
          <View className="rounded-md px-3 py-1.5 mr-2 bg-gray-200">
            <Text className="text-sm text-gray-700">orderbook</Text>
          </View>
          <View className="rounded-md px-3 py-1.5 bg-transparent">
            <Text className="text-sm text-gray-700">Trades</Text>
          </View>
        </View>

        <View className="flex-1 px-4">
          <View className="bg-white rounded-lg p-3">
            {/* Header */}
            <View className="flex-row justify-between mb-2">
              <Text className="text-black w-[100]">Bid</Text>
              <Text className="text-black flex-1 text-center">Ask</Text>
              <Text className="text-black w-[100] text-right">0.00001</Text>
            </View>

            {/* Progress Bar */}
            <View className="flex-row mb-2">
              <View className="h-[2] bg-[#089981]" style={{ width: "83.15%" }} />
              <View className="h-[2] bg-[#F23645]" style={{ width: "16.85%" }} />
            </View>

            {/* Order Book */}
            {/* <ScrollView className="max-h-[500]"> */}
            {orderBook?.bids?.map((bid: any, index: number) => (
              <View key={`bid-${index}`} className="flex-row justify-between py-[2]">
                {/* Left column - Amount */}
                <Text className="text-black w-[100] text-left">{parseFloat(bid[1]).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</Text>

                {/* Middle columns - Bid/Ask prices */}
                <View className="flex-row justify-center flex-1">
                  <Text className="text-[#089981] w-[80] text-right">{parseFloat(bid[0]).toFixed(5)}</Text>
                  <Text className="text-[#F23645] w-[80] text-right ml-2">{orderBook?.asks?.[index] ? parseFloat(orderBook.asks[index][0]).toFixed(5) : ""}</Text>
                </View>

                {/* Right column - Amount */}
                <Text className="text-black w-[100] text-right">
                  {orderBook?.asks?.[index] ? parseFloat(orderBook.asks[index][1]).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : ""}
                </Text>
              </View>
            ))}
            {/* </ScrollView> */}
          </View>
        </View>
      </ScrollView>

      {/* Action buttons */}
      <View className="px-4 py-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-4 space-x-4">
          <TouchableOpacity className="items-center">
            <MaterialIcons name="more-horiz" size={24} color="#666" />
            <Text className="text-xs text-gray-600 mt-1">More</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <MaterialIcons name="notifications-none" size={24} color="#666" />
            <Text className="text-xs text-gray-600 mt-1">Alert</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <MaterialIcons name="account-balance" size={24} color="#666" />
            <Text className="text-xs text-gray-600 mt-1">Margin</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <MaterialIcons name="grid-view" size={24} color="#666" />
            <Text className="text-xs text-gray-600 mt-1">Grid</Text>
          </TouchableOpacity>
        </View>

        {/* Buy/Sell buttons */}
        <View className="flex-row gap-2">
          <TouchableOpacity className="bg-[#089981] px-8 py-3 rounded-lg">
            <Text className="text-white font-medium">Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-[#F23645] px-8 py-3 rounded-lg">
            <Text className="text-white font-medium">Sell</Text>
          </TouchableOpacity>
        </View>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableOverDrag={false}
        backdropComponent={renderBackdrop}
        onChange={(index) => {
          setIsBottomSheetOpen(index >= 0);
        }}
        enableHandlePanningGesture={true}
        enableContentPanningGesture={true}
        handleComponent={() => (
          <View className="w-full items-center pt-2 pb-4">
            <View className="w-8 h-1 rounded-full bg-gray-300" />
          </View>
        )}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <View className="p-4">
            <Text className="text-xl font-semibold mb-6">Intervals</Text>
            <View className="flex-row flex-wrap gap-2">
              {TIME_INTERVALS.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => {
                    setInterval(item.value);
                    bottomSheetRef.current?.close();
                  }}
                  className={`px-6 py-3 rounded-lg ${interval === item.value ? "bg-yellow-500" : "bg-gray-100"}`}
                  style={{
                    width: "30%", // 3개 배치
                    marginBottom: 8,
                  }}
                >
                  <Text className={`text-center ${interval === item.value ? "text-white font-medium" : "text-gray-700"}`}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              className="flex-row items-center justify-between mt-6 py-4 border-t border-gray-200"
              onPress={() => {
                // Handle preferred intervals
                bottomSheetRef.current?.close();
              }}
            >
              <Text className="text-base text-gray-700">Select preferred intervals</Text>
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
}
