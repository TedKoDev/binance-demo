import React, { useState, useCallback } from "react";
import { View, TextInput, Text, TouchableOpacity, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRecoilState, useRecoilValue } from "recoil";
import { searchHistoryState } from "@/atoms/searchHistoryAtom";
import { exchangeInfoState } from "@/atoms/exchangeInfo";
import debounce from "lodash/debounce";

interface SearchResult {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
}

export const SearchBar = () => {
  const [isActive, setIsActive] = useState(false);
  const [searchHistory, setSearchHistory] = useRecoilState(searchHistoryState);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const exchangeInfo = useRecoilValue(exchangeInfoState);

  // 검색 로직
  const searchSymbols = (searchText: string) => {
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
  };

  // debounce 적용
  const debouncedSearch = useCallback(
    debounce((text: string) => searchSymbols(text), 300),
    [exchangeInfo]
  );

  const handleSearchInput = (text: string) => {
    debouncedSearch(text);
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  const removeHistoryItem = (symbol: string) => {
    setSearchHistory((prev) => prev.filter((item) => item.symbol !== symbol));
  };

  if (!isActive) {
    return (
      <Pressable onPress={() => setIsActive(true)} className="px-4 py-3">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
          <MaterialIcons name="search" size={24} color="#999" />
          <Text className="flex-1 ml-2 text-base text-gray-400">Search</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 bg-white z-50">
      <View className="px-4 py-3 flex-row items-center border-b border-gray-100">
        <View className="flex-row flex-1 bg-gray-100 rounded-lg px-4 py-3">
          <MaterialIcons name="search" size={24} color="#999" />
          <TextInput className="flex-1 ml-2 text-base text-black" placeholder="Search" placeholderTextColor="#999" autoFocus onChangeText={handleSearchInput} />
        </View>
        <View className="flex-row items-center ml-4">
          <TouchableOpacity onPress={() => setIsActive(false)}>
            <Text className="text-yellow-500">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 검색 결과 표시 */}
      {searchResults.length > 0 ? (
        <View className="flex-1">
          {searchResults.map((result, index) => (
            <TouchableOpacity
              key={index}
              className="px-4 py-3 border-b border-gray-100"
              onPress={() => {
                // 검색 기록에 추가
                setSearchHistory((prev) => [{ symbol: result.symbol, leverage: "5x" }, ...prev.filter((item) => item.symbol !== result.symbol)].slice(0, 10)); // 최대 10개만 유지
                setIsActive(false);
              }}
            >
              <View className="flex-row justify-between items-center">
                <Text className="text-base">
                  {result.baseAsset}/{result.quoteAsset}
                </Text>
                <Text className="text-gray-400">5x</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        // 검색 기록 표시
        <View className="px-4 py-3">
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
        </View>
      )}
    </View>
  );
};
