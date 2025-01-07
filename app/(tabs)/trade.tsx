import React, { useState, useCallback, useMemo, useRef } from "react";
import { View, SafeAreaView, Text, TouchableOpacity, TextInput, ScrollView, RefreshControl } from "react-native";
import { TradeTypeMenu } from "@/components/TradeTypeMenu/TradeTypeMenu";
import { OrderBook } from "@/components/OrderBook/OrderBook";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView, BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function TradeScreen() {
  const [orderType, setOrderType] = useState("Limit");
  const [isBuy, setIsBuy] = useState(true);
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [isOrderTypeSheetOpen, setIsOrderTypeSheetOpen] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["90%"], []);
  const [isSymbolSheetOpen, setIsSymbolSheetOpen] = useState(false);
  const symbolBottomSheetRef = useRef<BottomSheet>(null);
  const symbolSnapPoints = useMemo(() => ["90%"], []);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // 여기에 데이터를 새로고침하는 로직을 추가하세요
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleOrderTypePress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleSymbolPress = useCallback(() => {
    symbolBottomSheetRef.current?.expand();
  }, []);

  const renderBackdrop = useCallback((props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} pressBehavior="close" />, []);

  // Add sample data
  const orderTypes = useMemo(
    () => [
      { id: "limit", name: "Limit", description: "Place an order at a specific price" },
      { id: "market", name: "Market", description: "Execute immediately at market price" },
      { id: "stop_limit", name: "Stop Limit", description: "Place a limit order when price reaches trigger" },
      { id: "stop_market", name: "Stop Market", description: "Place a market order when price reaches trigger" },
      { id: "trailing_stop", name: "Trailing Stop", description: "Stop price follows market price" },
      { id: "post_only", name: "Post Only", description: "Ensure maker orders only" },
      { id: "fok", name: "Fill or Kill", description: "Execute entirely or cancel" },
      { id: "ioc", name: "Immediate or Cancel", description: "Execute what's available and cancel the rest" },
    ],
    []
  );

  const tradingPairs = useMemo(
    () => [
      { symbol: "PENGU", pair: "USDT", leverage: "5x", price: "0.042272", change: "+0.67%" },
      { symbol: "BTC", pair: "USDT", leverage: "10x", price: "101,754.25", change: "+2.19%" },
      { symbol: "ETH", pair: "USDT", leverage: "10x", price: "3,521.48", change: "-1.23%" },
      { symbol: "BNB", pair: "USDT", leverage: "5x", price: "567.32", change: "+0.89%" },
      { symbol: "SOL", pair: "USDT", leverage: "5x", price: "184.65", change: "+3.45%" },
      { symbol: "XRP", pair: "USDT", leverage: "5x", price: "0.9873", change: "-0.56%" },
      { symbol: "DOGE", pair: "USDT", leverage: "5x", price: "0.1234", change: "+1.23%" },
      { symbol: "AVAX", pair: "USDT", leverage: "5x", price: "45.67", change: "-2.34%" },
    ],
    []
  );

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
              never
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
          handleComponent={() => (
            <View className="w-full items-center pt-2 pb-4">
              <View className="w-8 h-1 rounded-full bg-gray-300" />
            </View>
          )}
        >
          <View style={{ flex: 1, backgroundColor: "white" }}>
            {/* Fixed Search Header */}
            <View style={{ padding: 16 }}>
              {/* Search Input */}
              <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3 mb-4">
                <MaterialIcons name="search" size={24} color="#999" />
                <TextInput className="flex-1 ml-2 text-base" placeholder="Search" placeholderTextColor="#999" />
              </View>

              {/* Category Tabs */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                <View className="flex-row">
                  <Text className="text-gray-400 mr-6">Favorites</Text>
                  <Text className="text-yellow-500 mr-6 border-b-2 border-yellow-500 pb-2">USDT</Text>
                  <Text className="text-gray-400 mr-6">FDUSD</Text>
                  <Text className="text-gray-400 mr-6">USDC</Text>
                  <Text className="text-gray-400 mr-6">TUSD</Text>
                  <Text className="text-gray-400 mr-6">BNB</Text>
                </View>
              </ScrollView>

              {/* Column Headers */}
              <View className="flex-row justify-between px-4">
                <Text className="text-gray-400">Name / Vol</Text>
                <Text className="text-gray-400">Last Price / 24h Change</Text>
              </View>
            </View>

            {/* Scrollable Trading Pairs List */}
            <BottomSheetScrollView
              bounces={true}
              overScrollMode="never"
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#999" />}
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
            >
              {tradingPairs.map((pair, index) => (
                <TouchableOpacity key={index} className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100" onPress={() => symbolBottomSheetRef.current?.close()}>
                  <View>
                    <View className="flex-row items-center">
                      <Text className="text-base font-bold">{pair.symbol}</Text>
                      <Text className="text-gray-400">/{pair.pair}</Text>
                      <View className="ml-2 px-1 bg-gray-100 rounded">
                        <Text className="text-gray-400 text-xs">{pair.leverage}</Text>
                      </View>
                    </View>
                    <Text className="text-gray-400 text-sm">Vol {pair.symbol || "0"}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-base">{pair.price}</Text>
                    <Text className={pair.change.startsWith("+") ? "text-emerald-500" : "text-red-500"}>{pair.change}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </BottomSheetScrollView>
          </View>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
