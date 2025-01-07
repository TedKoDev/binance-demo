import React, { useState, useCallback, useMemo, useRef } from "react";
import { View, SafeAreaView, Text, TouchableOpacity, TextInput, ScrollView, RefreshControl } from "react-native";
import { TradeTypeMenu } from "@/components/TradeTypeMenu/TradeTypeMenu";
import { OrderBook } from "@/components/OrderBook/OrderBook";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView, BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { use24hrTicker, useCoinList } from "@/hooks/queries/useCoinList";
import { TradingPairsList } from "@/components/TradingPairsList";
import { SubTabs } from "@/components/SubTabs";
import { altsSubTabs, fiatSubTabs } from "@/constants/Tabs";

export default function TradeScreen() {
  const [orderType, setOrderType] = useState("Limit");
  const [isBuy, setIsBuy] = useState(true);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["80%"], []);
  const [isSymbolSheetOpen, setIsSymbolSheetOpen] = useState(false);
  const symbolBottomSheetRef = useRef<BottomSheet>(null);
  const symbolSnapPoints = useMemo(() => ["80%"], []);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("USDT");
  const [selectedSubTabs, setSelectedSubTabs] = useState<string[]>(["ETH"]);
  const { data: tickerData } = use24hrTicker();
  const headerHeight = 180; // 기본 헤더 높이
  const subTabsHeight = 50; // 서브탭 높이

  const handleOrderTypePress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleSymbolPress = useCallback(() => {
    symbolBottomSheetRef.current?.expand();
  }, []);

  const renderBackdrop = useCallback((props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} pressBehavior="close" />, []);

  const handleTabSelect = (tab: string) => {
    symbolBottomSheetRef.current?.snapToIndex(0);

    setSelectedTab(tab);
    if (tab === "ALTS") {
      setSelectedSubTabs(["ETH"]);
    } else if (tab === "FIAT") {
      setSelectedSubTabs(["EUR"]);
    } else {
      setSelectedSubTabs([]);
    }
  };

  const handleSubTabSelect = (tab: string) => {
    setSelectedSubTabs((prev) => {
      if (prev.includes(tab)) {
        return prev.filter((t) => t !== tab);
      } else {
        return [...prev, tab];
      }
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView>
          <TradeTypeMenu />
          <View className="border-b border-gray-200"></View>
          <View className="px-4">
            <View className="flex-row justify-between items-center py-3">
              <TouchableOpacity className="flex-row items-center" onPress={handleSymbolPress}>
                <Text className="text-xl font-bold mr-2">PENGU/USDT</Text>
                <Text className="text-emerald-500">+0.67%</Text>
              </TouchableOpacity>
              <View className="flex-row gap-4">
                <MaterialIcons name="candlestick-chart" size={24} color="#666" />
                <MaterialIcons name="more-vert" size={24} color="#666" />
              </View>
            </View>
          </View>

          {/* Main content with side-by-side layout */}
          <View className="flex-1 flex-row">
            {/* Left side - Order Form */}
            <View className="flex-1 px-4">
              {/* Buy/Sell Toggle */}
              <View className="flex-row bg-gray-100 rounded-lg mb-4">
                <TouchableOpacity className={`flex-1 py-3 rounded-lg ${isBuy ? "bg-emerald-500" : ""}`} onPress={() => setIsBuy(true)}>
                  <Text className={`text-center font-semibold ${isBuy ? "text-white" : "text-gray-500"}`}>Buy</Text>
                </TouchableOpacity>
                <TouchableOpacity className={`flex-1 py-3 rounded-lg ${!isBuy ? "bg-red-500" : ""}`} onPress={() => setIsBuy(false)}>
                  <Text className={`text-center font-semibold ${!isBuy ? "text-white" : "text-gray-500"}`}>Sell</Text>
                </TouchableOpacity>
              </View>
              {/* Limit Order Type */}
              <View className="flex-row items-center mb-3">
                <Ionicons name="information-circle-outline" size={20} color="#999" />
                <TouchableOpacity className="flex-1 flex-row items-center" onPress={handleOrderTypePress}>
                  <Text className="flex-1 ml-2 text-gray-700">{orderType}</Text>
                  <MaterialIcons name="keyboard-arrow-down" size={24} color="#999" />
                </TouchableOpacity>
              </View>
              {/* Price Input */}
              <View className="bg-gray-50 rounded-lg mb-3">
                <Text className="text-gray-400 text-sm px-2 pt-2">Price (USDT)</Text>
                <View className="flex-row items-center px-2">
                  <TouchableOpacity className="p-2">
                    <Text className="text-gray-400">-</Text>
                  </TouchableOpacity>
                  <TextInput className="flex-1 text-center" value="0.042272" keyboardType="numeric" />
                  <TouchableOpacity className="p-2">
                    <Text className="text-gray-400">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* Amount Input */}
              <View className="bg-gray-50 rounded-lg mb-3">
                <Text className="text-gray-400 text-sm px-2 pt-2">Amount (PENGU)</Text>
                <View className="flex-row items-center px-2">
                  <TouchableOpacity className="p-2">
                    <Text className="text-gray-400">-</Text>
                  </TouchableOpacity>
                  <TextInput className="flex-1 text-center" placeholder="0" keyboardType="numeric" />
                  <TouchableOpacity className="p-2">
                    <Text className="text-gray-400">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* Total */}
              <View className="bg-gray-50 rounded-lg mb-3">
                <Text className="text-gray-400 text-sm px-4 pt-2">Total (USDT)</Text>
                <Text className="text-center py-2 text-gray-400">--</Text>
              </View>
              {/* TP/SL */}
              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center">
                  <TouchableOpacity className="mr-2">
                    <MaterialIcons name="check-box-outline-blank" size={24} color="#999" />
                  </TouchableOpacity>
                  <Text className="text-gray-700">TP/SL</Text>
                </View>
                <TouchableOpacity className="flex-row items-center">
                  <Text className="text-gray-700 mr-1">Advanced</Text>
                  <MaterialIcons name="keyboard-arrow-down" size={24} color="#999" />
                </TouchableOpacity>
              </View>
              {/* Iceberg */}
              <View className="flex-row items-center mb-3">
                <TouchableOpacity className="mr-2">
                  <MaterialIcons name="check-box-outline-blank" size={24} color="#999" />
                </TouchableOpacity>
                <Text className="text-gray-700">Iceberg</Text>
              </View>

              {/* Market/Limit Toggle */}
              <View className="flex-row justify-center">
                <View className="border border-gray-300 rounded-lg">
                  <Text className="px-4 py-2">Market</Text>
                </View>
              </View>
            </View>

            {/* Right side - Order Book */}
            <View className="flex-1">
              <OrderBook />
            </View>
          </View>
        </ScrollView>

        {/* Symbol Selection Bottom Sheet */}
        <BottomSheet
          ref={symbolBottomSheetRef}
          index={-1}
          snapPoints={symbolSnapPoints}
          enablePanDownToClose={true}
          enableOverDrag={false}
          backdropComponent={renderBackdrop}
          onChange={(index) => {
            setIsSymbolSheetOpen(index >= 0);
          }}
          enableContentPanningGesture={false}
          enableDynamicSizing={false}
          handleComponent={() => (
            <View className="w-full items-center pt-2 pb-4">
              <View className="w-8 h-1 rounded-full bg-gray-300" />
            </View>
          )}
        >
          <BottomSheetView style={{ flex: 1 }}>
            {/* Fixed Header Section */}
            <View
              style={{
                backgroundColor: "white",
                zIndex: 1,
              }}
            >
              {/* Search Input */}
              <View style={{ height: 70 }} className="px-4 py-3">
                <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
                  <MaterialIcons name="search" size={24} color="#999" />
                  <TextInput className="flex-1 ml-2 text-base" placeholder="Search" placeholderTextColor="#999" />
                </View>
              </View>

              {/* Category Tabs */}
              <View style={{ height: 50 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
                  <View className="flex-row">
                    {["Favorites", "USDT", "FDUSD", "USDC", "TUSD", "BNB", "BTC", "ALTS", "FIAT", "Zones"].map((tab) => (
                      <TouchableOpacity key={tab} onPress={() => handleTabSelect(tab)}>
                        <Text className={`mr-6 pb-2 ${selectedTab === tab ? "text-yellow-500 border-b-2 border-yellow-500" : "text-gray-400"}`}>{tab}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Column Headers */}
              <View style={{ height: 40 }} className="flex-row justify-between px-4 py-2">
                <Text className="text-gray-400">Name / Vol</Text>
                <Text className="text-gray-400">Last Price / 24h Change</Text>
              </View>

              {/* Sub tabs for ALTS and FIAT */}
              {(selectedTab === "ALTS" || selectedTab === "FIAT") && (
                <View style={{ height: subTabsHeight }}>
                  <SubTabs tabs={selectedTab === "ALTS" ? altsSubTabs : fiatSubTabs} selectedSubTabs={selectedSubTabs} onSelectSubTab={handleSubTabSelect} />
                </View>
              )}
            </View>

            {/* List Section */}
            <View style={{ flex: 1 }}>
              <TradingPairsList selectedTab={selectedTab} selectedSubTabs={selectedSubTabs} onPairSelect={() => symbolBottomSheetRef.current?.close()} />
            </View>
          </BottomSheetView>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
