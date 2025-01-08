import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { View, SafeAreaView, Text, TouchableOpacity, TextInput, ScrollView, RefreshControl, Pressable, Animated, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { TradeTypeMenu } from "@/components/TradeTypeMenu/TradeTypeMenu";
import { OrderBook } from "@/components/OrderBook/OrderBook";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TradingPairsList } from "@/components/PairsList.tsx/TradingPairsList";
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

import { SearchHistory, searchHistoryState } from "@/atoms/searchHistoryAtom";
import debounce from "lodash/debounce";
import { TopTradeItem } from "@/components/listitems/toptradeitem";
import TopTradeList from "@/components/PairsList.tsx/toptradeList";
import { use24hrTicker } from "@/hooks/queries/useCoinList";
import { TickerData } from "@/api/binance";
import { favoritesState } from "@/atoms/favoritesAtom";
import { Link, router } from "expo-router";

interface SearchResult {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: string;
  priceChange: string;
  leverage?: string;
  tag?: string;
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

  const [isSearchActive, setIsSearchActive] = useState(false);

  //console.log("isSearchActive", isSearchActive);

  const [searchHistory, setSearchHistory] = useRecoilState(searchHistoryState);

  //console.log("searchHistory", searchHistory);

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const exchangeInfo = useRecoilValue(exchangeInfoState);

  const [showTopTrade, setShowTopTrade] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const searchInputRef = useRef<TextInput>(null);

  const { data: tickerData } = use24hrTicker();

  const [favorites, setFavorites] = useRecoilState(favoritesState);

  const handleFavoritePress = (result: SearchResult) => {
    setFavorites((prev) => {
      const existingIndex = prev.findIndex((item) => item.symbol === result.symbol);

      if (existingIndex >= 0) {
        // Remove from favorites if already exists
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        // Add to favorites
        return [...prev, result];
      }
    });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    if (offsetY > 10) {
      setShowTopTrade(true);
    } else {
      setShowTopTrade(false);
    }
  };

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
      if (!searchText || !tickerData) {
        setSearchResults([]);
        return;
      }
      const results = Array.isArray(tickerData)
        ? tickerData
            .filter((ticker: TickerData) => {
              const symbol = ticker.symbol.toLowerCase();
              const searchLower = searchText.toLowerCase();
              return symbol.includes(searchLower);
            })
            .map((ticker: TickerData) => {
              const baseAsset = ticker.symbol.replace(/(USDT|BUSD|USDC|BTC|ETH)$/, "");
              const quoteAsset = ticker.symbol.slice(baseAsset.length);

              return {
                symbol: ticker.symbol,
                baseAsset: baseAsset,
                quoteAsset: quoteAsset,
                price: parseFloat(ticker.lastPrice).toFixed(2),
                priceChange: parseFloat(ticker.priceChangePercent).toFixed(2),
                leverage: "5x",
              };
            })
        : [];

      setSearchResults(results);
    },
    [tickerData]
  );

  //console.log("searchHistory", searchHistory);

  const debouncedSearch = useMemo(
    () =>
      debounce((text: string) => {
        searchSymbols(text);
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

  const handleBottomSheetChange = (index: number) => {
    setIsSymbolSheetOpen(index >= 0);

    // BottomSheet가 닫힐 때 (index === -1)
    if (index === -1) {
      setIsSearchActive(false);
      setSearchInput("");
      searchInputRef.current?.blur(); // 포커스 해제
    }
  };

  const renderSearchResults = () => {
    if (!searchInput || searchResults.length === 0) return null;

    return (
      <View className="flex-1">
        {searchResults.map((result, index) => (
          <TouchableOpacity
            key={index}
            className="px-4 py-3 flex-row items-center justify-between border-b border-gray-100"
            onPress={() => {
              // Add to search history
              const newHistoryItem = {
                baseAsset: result.baseAsset,
                quoteAsset: result.quoteAsset,
                leverage: result.leverage,
              };

              setSearchHistory((prev: any) => {
                const filtered = prev.filter((item: any) => !(item.baseAsset === newHistoryItem.baseAsset && item.quoteAsset === newHistoryItem.quoteAsset));
                return [newHistoryItem, ...filtered].slice(0, 10);
              });

              setCoin((prev) => ({
                ...prev,
                selectedCoin: result.baseAsset,
                selectedPair: result.quoteAsset,
              }));

              symbolBottomSheetRef.current?.close();
            }}
          >
            {/* Left side */}
            <View className="flex-row items-center">
              <TouchableOpacity
                className="mr-3"
                onPress={(e) => {
                  e.stopPropagation();
                  handleFavoritePress(result);
                }}
              >
                <AntDesign name={favorites.some((f) => f.symbol === result.symbol) ? "star" : "staro"} size={16} color={favorites.some((f) => f.symbol === result.symbol) ? "#F0B90B" : "#999"} />
              </TouchableOpacity>
              <View>
                <View className="flex-row items-center">
                  <Text className="text-base font-medium">
                    {result.baseAsset}/{result.quoteAsset}
                  </Text>
                  {result.leverage && (
                    <View className="ml-2 px-1 py-0.5">
                      <Text className="text-xs text-gray-500">{result.leverage}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Right side */}
            <View className="items-end">
              <Text className="text-base font-medium">{result.price}</Text>
              <Text className={`text-sm ${parseFloat(result.priceChange) < 0 ? "text-red-500" : "text-green-500"}`}>{result.priceChange}%</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
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
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/graph",
                      params: {
                        symbol: `${coin.selectedCoin}${coin.selectedPair}`,
                        baseAsset: coin.selectedCoin,
                        quoteAsset: coin.selectedPair,
                      },
                    })
                  }
                >
                  <MaterialIcons name="candlestick-chart" size={24} color="#666" />
                </TouchableOpacity>
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
          onChange={handleBottomSheetChange}
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
              <View className="px-4 py-3 flex-row items-center border-b border-gray-100">
                <View className="flex-row flex-1 bg-gray-100 h-12 rounded-lg px-4 py-3">
                  <MaterialIcons name="search" size={24} color="#999" />
                  <TextInput
                    ref={searchInputRef}
                    className="flex-1 ml-2 text-base text-black"
                    placeholder="Search"
                    placeholderTextColor="#999"
                    value={searchInput}
                    onChangeText={(text) => {
                      setSearchInput(text);
                      handleSearchInput(text);
                    }}
                    onFocus={() => setIsSearchActive(true)}
                  />
                </View>

                {isSearchActive ? (
                  <View className="flex-row items-center ml-4">
                    <TouchableOpacity onPress={cancelSearch}>
                      <Text className="text-yellow-500">Cancel</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            </View>
            {isSearchActive ? null : (
              <>
                {/* Main Category Tabs */}
                <View className="border-b border-gray-100 mt-2">
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
              </>
            )}
            {isSearchActive ? (
              <View style={{ flex: 1 }}>
                <ScrollView
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                  stickyHeaderIndices={
                    searchInput && searchResults.length > 0
                      ? [] // 검색 결과가 있을 때는 sticky 비활성화
                      : searchHistory.length > 0
                      ? [1] // 히스토가 있을 때 Top Trade는 세 번째 요소
                      : [0] // 히스토가 없을 때 Top Trade는 두 번째 요소
                  }
                >
                  {/* First Section: Search Results or Empty View */}
                  <View>{searchInput && searchResults.length > 0 && renderSearchResults()}</View>

                  {/* Second Section: Search History (if exists) */}
                  {!searchInput || searchResults.length === 0
                    ? searchHistory.length > 0 && (
                        <View className="px-4 py-3">
                          <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-gray-400 text-lg">Search History</Text>
                            <TouchableOpacity onPress={clearHistory}>
                              <MaterialIcons name="delete" size={24} color="#999" />
                            </TouchableOpacity>
                          </View>
                          <View className="flex-row flex-wrap gap-2">
                            {searchHistory.map((item, index) => (
                              <View key={index} className="mb-2">
                                <View className="flex-row bg-gray-800/10 py-2 px-4 rounded-lg">
                                  <Text className="text-black font-medium">
                                    {item.baseAsset}/{item.quoteAsset}
                                  </Text>
                                  <View className="bg-white rounded-md px-1.5 ml-2">
                                    <Text className="text-gray-600 text-sm">{item.leverage}</Text>
                                  </View>
                                </View>
                              </View>
                            ))}
                          </View>
                        </View>
                      )
                    : null}

                  {/* Third Section: Top Trade Header (Sticky) */}
                  {(!searchInput || searchResults.length === 0) && (
                    <View style={{ backgroundColor: "white", elevation: 2 }}>
                      <View className="px-4 py-3 border-t border-b border-gray-100">
                        <Text className="text-lg font-bold">Top Trade</Text>
                      </View>
                    </View>
                  )}

                  {/* Fourth Section: Top Trade List */}
                  {(!searchInput || searchResults.length === 0) && (
                    <View className="px-4">
                      <TopTradeList
                        onPress={() => {
                          symbolBottomSheetRef.current?.close();
                        }}
                      />
                    </View>
                  )}
                </ScrollView>
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
