import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { View, SafeAreaView, Text, TouchableOpacity, TextInput, ScrollView, RefreshControl, Pressable, Animated } from "react-native";
import { TradeTypeMenu } from "@/components/TradeTypeMenu/TradeTypeMenu";
import { OrderBook } from "@/components/OrderBook/OrderBook";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import BottomSheet, { BottomSheetView, BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TradingPairsList } from "@/components/TradingPairsList";
import { SubTabs } from "@/components/SubTabs";
import { altsSubTabs, fiatSubTabs } from "@/constants/Tabs";
import { useRecoilState, useRecoilValue } from "recoil";
import { coinState } from "@/atoms/coinAtom";
import { OrderType, ORDER_TYPES } from "@/constants/Types";
import PriceInput from "@/components/PriceInput/PriceInput";
import AmountInput from "@/components/AmountInput/AmountInput";
import { exchangeInfoState, symbolStepSizeSelector } from "@/atoms/exchangeInfo";
import Slider from "@react-native-community/slider";
import { ImageSourcePropType } from "react-native";
import { TotalInput } from "@/components/TotalInput/TotalInput";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { searchHistoryState } from "@/atoms/searchHistoryAtom";
import debounce from "lodash/debounce";

interface SearchResult {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
}

export default function TradeScreen() {
  const [orderType, setOrderType] = useState<OrderType>("Limit");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const orderTypeBottomSheetRef = useRef<BottomSheet>(null);
  const orderTypeSnapPoints = useMemo(() => ["80%"], []);
  const [isOrderTypeSheetOpen, setIsOrderTypeSheetOpen] = useState(false);

  const [isSymbolSheetOpen, setIsSymbolSheetOpen] = useState(false);
  const symbolBottomSheetRef = useRef<BottomSheet>(null);
  const symbolSnapPoints = useMemo(() => ["80%"], []);

  const [coin, setCoin] = useRecoilState(coinState);
  const stepSizes = useRecoilValue(symbolStepSizeSelector);
  const [icon, setIcon] = useState<ImageSourcePropType>();
  const [thumbIcon, setThumbIcon] = useState<ImageSourcePropType>();

  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchHistory, setSearchHistory] = useRecoilState(searchHistoryState);

  console.log("searchHistory", searchHistory);

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const exchangeInfo = useRecoilValue(exchangeInfoState);

  useEffect(() => {
    // MaterialIcons from @expo/vector-icons doesn't have getImageSource method
    // Using Ionicons instead which has similar functionality
    Ionicons.loadFont().then(() => {
      setIcon({ uri: "circle" });
    });
  }, []);

  const handleOrderTypePress = () => {
    orderTypeBottomSheetRef.current?.expand();
  };

  const handleSymbolPress = () => {
    symbolBottomSheetRef.current?.expand();
  };

  const renderBackdrop = useCallback((props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} pressBehavior="close" />, []);

  const handleTabSelect = (tab: string) => {
    symbolBottomSheetRef.current?.snapToIndex(0);

    setCoin((prev) => ({
      ...prev,
      selectedTab: tab,
      selectedSubTabs: tab === "ALTS" ? ["ETH"] : tab === "FIAT" ? ["EUR"] : [],
    }));
  };

  const handleSubTabSelect = (tab: string) => {
    setCoin((prev) => ({
      ...prev,
      selectedSubTabs: prev.selectedSubTabs.includes(tab) ? prev.selectedSubTabs.filter((t) => t !== tab) : [...prev.selectedSubTabs, tab],
    }));
  };

  // 검색 로직
  const searchSymbols = useCallback(
    (searchText: string) => {
      if (!exchangeInfo || !searchText) {
        setSearchResults([]);
        return;
      }

      const results = exchangeInfo.symbols
        .filter((symbol) => symbol.symbol.toLowerCase().includes(searchText.toLowerCase()) || symbol.baseAsset.toLowerCase().includes(searchText.toLowerCase()))
        .map((symbol) => ({
          symbol: symbol.symbol,
          baseAsset: symbol.baseAsset,
          quoteAsset: symbol.quoteAsset,
        }));

      setSearchResults(results);
    },
    [exchangeInfo]
  );

  console.log("searchHistory", searchHistory);

  const debouncedSearch = useMemo(
    () =>
      debounce((text: string) => {
        searchSymbols(text);
        setSearchHistory((prev) => [{ symbol: text, leverage: "5x" }, ...prev.filter((item) => item.symbol !== text)].slice(0, 10));
      }, 700),
    [searchSymbols]
  );

  const handleSearchInput = (text: string) => {
    debouncedSearch(text);
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  const cancelSearch = () => {
    setIsSearchActive(false);
  };

  const removeHistoryItem = (symbol: string) => {
    setSearchHistory((prev) => prev.filter((item) => item.symbol !== symbol));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView>
          <TradeTypeMenu />
          <View className="border-b border-gray-200"></View>
          <View className="px-4">
            <View className="flex-row justify-between items-center py-3">
              <View className="flex-1   items-start">
                <TouchableOpacity className="flex-row items-center" onPress={handleSymbolPress}>
                  <Text className="text-xl font-bold mr-2">
                    {coin.selectedCoin}/{coin.selectedPair}
                  </Text>
                  <AntDesign name="caretdown" size={12} color="#000" />
                </TouchableOpacity>
                <Text
                  className="flex-start  flex-1 
                text-emerald-500"
                >
                  {coin.priceChange}
                </Text>
              </View>
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
                <Pressable className={`flex-1 py-2 rounded-lg ${tradeType === "buy" ? "bg-emerald-500" : ""}`} onPress={() => setTradeType("buy")}>
                  <Text className={`text-center font-bold ${tradeType === "buy" ? "text-white" : "text-gray-500"}`}>Buy</Text>
                </Pressable>
                <Pressable className={`flex-1 py-2 rounded-lg ${tradeType === "sell" ? "bg-red-500" : ""}`} onPress={() => setTradeType("sell")}>
                  <Text className={`text-center font-bold ${tradeType === "sell" ? "text-white" : "text-gray-500"}`}>Sell</Text>
                </Pressable>
              </View>
              {/* Limit Order Type */}
              <View className="flex-row items-center mb-3">
                <Pressable className="flex-1 flex-row items-center bg-gray-100 rounded-lg py-3 px-4" onPress={handleOrderTypePress}>
                  <Ionicons name="information-circle" size={20} color="#999" />
                  <Text className="flex-1 text-center text-black">{orderType}</Text>
                  <AntDesign name="caretdown" size={12} color="#999" />
                </Pressable>
              </View>
              {/* Price Input */}
              <PriceInput selectedPair={coin.selectedPair} selectedCoin={coin.selectedCoin} />

              {/* Amount Input */}
              <AmountInput selectedCoin={coin.selectedCoin} stepSize={stepSizes[coin.selectedCoin]?.amount} />

              {/* Slider */}
              <View className="mb-3">
                <Slider
                  style={{ width: "100%", height: 10 }}
                  minimumValue={0}
                  maximumValue={1}
                  step={0.01}
                  minimumTrackTintColor="#000000"
                  maximumTrackTintColor="#E5E7EB"
                  thumbTintColor="#000000"
                  thumbImage={require("/Users/taeui/Desktop/dev/binance-demo/assets/images/Rectangle.png")}
                />
              </View>

              {/* Total */}
              <TotalInput selectedPair={coin.selectedPair} />
              {/* TP/SL & Iceberg */}
              <View className="mb-3">
                <View className="flex-row items-center mb-2">
                  <TouchableOpacity className="mr-2">
                    <MaterialIcons name="check-box-outline-blank" size={20} color="#999" />
                  </TouchableOpacity>
                  <Text className="text-gray-500 text-sm">TP/SL</Text>
                </View>
                <View className="flex-row items-center">
                  <TouchableOpacity className="mr-2">
                    <MaterialIcons name="check-box-outline-blank" size={20} color="#999" />
                  </TouchableOpacity>
                  <Text className="text-gray-500 text-sm">Iceberg</Text>
                </View>
              </View>

              {/* Trade Info */}
              <View className="mb-4">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-gray-500 text-sm">Avbl</Text>
                  <Text className="text-gray-700">0 {coin.selectedPair}</Text>
                </View>
                <View className="flex-row justify-between mb-1">
                  <Text className="text-gray-500 text-sm">Max Buy</Text>
                  <Text className="text-gray-700">0 {coin.selectedCoin}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-500 text-sm">Est. Fee</Text>
                  <Text className="text-gray-700">-- {coin.selectedPair}</Text>
                </View>
              </View>

              {/* Buy or Sell Button */}
              <TouchableOpacity className={`${tradeType === "buy" ? "bg-emerald-500" : "bg-red-500"} rounded-lg py-3 items-center`}>
                <Text className="text-white font-medium">
                  {tradeType === "buy" ? "Buy" : "Sell"} {coin.selectedCoin}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Right side - Order Book */}
            <View className="flex-1">
              <OrderBook />
            </View>
          </View>
        </ScrollView>

        {/* Order Type Bottom Sheet */}
        <BottomSheet
          ref={orderTypeBottomSheetRef}
          index={-1}
          snapPoints={orderTypeSnapPoints}
          enablePanDownToClose={true}
          enableOverDrag={false}
          backdropComponent={renderBackdrop}
          onChange={(index) => {
            setIsOrderTypeSheetOpen(index >= 0);
          }}
        >
          <BottomSheetView style={{ flex: 1 }}>
            <View className="p-4">
              <Text className="text-lg font-bold mb-4">Order Type</Text>
              {ORDER_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  className={`py-3 px-4 ${orderType === type ? "bg-gray-100" : ""}`}
                  onPress={() => {
                    setOrderType(type);
                    orderTypeBottomSheetRef.current?.close();
                  }}
                >
                  <Text className={`${orderType === type ? "text-yellow-500" : "text-gray-700"}`}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </BottomSheetView>
        </BottomSheet>

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
              <View className="absolute top-0 left-0 right-0 bottom-0 bg-white z-50">
                <View className="px-4 py-3 flex-row items-center border-b border-gray-100">
                  <View className="flex-row flex-1 bg-gray-100 h-12 rounded-lg px-4 py-3">
                    <MaterialIcons name="search" size={24} color="#999" />
                    <TextInput className="flex-1 ml-2 text-base text-black" placeholder="Search" placeholderTextColor="#999" onChangeText={handleSearchInput} onFocus={() => setIsSearchActive(true)} />
                  </View>

                  {isSearchActive ? (
                    <View className="flex-row items-center ml-4">
                      <TouchableOpacity onPress={cancelSearch}>
                        <Text className="text-yellow-500">Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
                <View className="px-4 py-3">
                  {/* 검색 결과 �는 히스토리 표시 */}
                  {searchHistory.length > 0 ? (
                    // <View className="flex-1">
                    <>
                      <View className="flex-row justify-between items-center">
                        <Text className="text-gray-400 text-lg">Search History</Text>
                        <TouchableOpacity onPress={clearHistory}>
                          <MaterialIcons name="delete" size={24} color="#999" />
                        </TouchableOpacity>
                      </View>
                      {searchHistory.map((item, index) => (
                        <View key={index} className="flex-row justify-between items-center py-3">
                          <View className="flex-row items-center">
                            <Text className="text-gray-400">{item.symbol}</Text>
                            <Text className="text-gray-500 ml-2">{item.leverage}</Text>
                          </View>
                          <TouchableOpacity onPress={() => removeHistoryItem(item.symbol)}>
                            <Text className="text-gray-500">×</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </>
                  ) : null}
                </View>
              </View>

              {/* Main Category Tabs */}
              <View className="border-b border-gray-100">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
                  <View className="flex-row">
                    {["Favorites", "USDT", "FDUSD", "USDC", "TUSD", "BNB", "BTC", "ALTS", "FIAT", "Zones"].map((tab) => (
                      <TouchableOpacity key={tab} onPress={() => handleTabSelect(tab)}>
                        <Text className={`mr-6 pb-2 ${coin.selectedTab === tab ? "text-yellow-500 border-b-2 border-yellow-500" : "text-gray-400"}`}>{tab}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Sub tabs for ALTS and FIAT */}
              {(coin.selectedTab === "ALTS" || coin.selectedTab === "FIAT") && (
                <View>
                  <SubTabs tabs={coin.selectedTab === "ALTS" ? altsSubTabs : fiatSubTabs} selectedSubTabs={coin.selectedSubTabs} onSelectSubTab={handleSubTabSelect} />
                </View>
              )}

              {/* Column Headers */}
              <View style={{ height: 40 }} className="flex-row justify-between px-4 py-2">
                <Text className="text-gray-400">Name / Vol</Text>
                <Text className="text-gray-400">Last Price / 24h Change</Text>
              </View>
            </View>

            {isSearchActive ? (
              <View className="px-4 py-3">
                <Text>검색 히스토리</Text>
              </View>
            ) : (
              <View className="flex-1">
                <TradingPairsList selectedTab={coin.selectedTab} selectedSubTabs={coin.selectedSubTabs} onPairSelect={() => symbolBottomSheetRef.current?.close()} />
              </View>
            )}
          </BottomSheetView>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
