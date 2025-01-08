import { searchHistoryState } from "@/atoms/searchHistoryAtom";
import { coinState } from "@/atoms/coinAtom";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRecoilState } from "recoil";
const tradeData = [
  { rank: 1, symbol: "BTC", price: 65000, change: 2.5, leverage: "5x", baseAsset: "BTC", quoteAsset: "USDT" },
  { rank: 2, symbol: "ETH", price: 3500, change: -1.2, leverage: "5x", baseAsset: "ETH", quoteAsset: "USDT" },
  { rank: 3, symbol: "SOL", price: 120, change: 5.3, leverage: "5x", baseAsset: "SOL", quoteAsset: "USDT" },
  { rank: 4, symbol: "BNB", price: 450, change: 0.8, leverage: "5x", baseAsset: "BNB", quoteAsset: "USDT" },
  { rank: 5, symbol: "XRP", price: 0.75, change: -2.1, leverage: "5x", baseAsset: "XRP", quoteAsset: "USDT" },
  { rank: 6, symbol: "ADA", price: 0.65, change: 1.5, leverage: "5x", baseAsset: "ADA", quoteAsset: "USDT" },
  { rank: 7, symbol: "AVAX", price: 35, change: 3.2, leverage: "5x", baseAsset: "AVAX", quoteAsset: "USDT" },
  { rank: 8, symbol: "DOGE", price: 0.12, change: -0.5, leverage: "5x", baseAsset: "DOGE", quoteAsset: "USDT" },
  { rank: 9, symbol: "DOT", price: 8.5, change: 1.8, leverage: "5x", baseAsset: "DOT", quoteAsset: "USDT" },
  { rank: 10, symbol: "PEPE", price: 1.2, change: -1.5, leverage: "5x", baseAsset: "MATIC", quoteAsset: "USDT" },
];

const TopTradeList = ({ onPress }: { onPress: () => void }) => {
  const [searchHistory, setSearchHistory] = useRecoilState(searchHistoryState);
  const [coin, setCoin] = useRecoilState(coinState);

  return (
    <View>
      {tradeData.map((item) => (
        <TouchableOpacity
          key={item.rank}
          onPress={() => {
            setSearchHistory((prev) =>
              [
                {
                  symbol: item.symbol,
                  leverage: "5x",
                  price: 0,
                  change: 0,
                  rank: 0,
                  baseAsset: item.baseAsset,
                  quoteAsset: item.quoteAsset,
                },
                ...prev.filter((prevItem) => prevItem.symbol !== item.symbol),
              ].slice(0, 10)
            );

            setCoin((prev) => ({
              ...prev,
              selectedCoin: item.baseAsset,
              selectedPair: item.quoteAsset,
              priceChange: `${item.change > 0 ? "+" : ""}${item.change}%`,
            }));

            onPress();
          }}
        >
          <View className="flex-row justify-between items-center py-3">
            <View className="flex-row items-center">
              <View className="w-6 mr-2">
                <Text className={item.rank <= 3 ? "text-yellow-500" : "text-gray-500"}>{item.rank}</Text>
              </View>
              <View>
                <View className="flex-row items-center">
                  <Text className="text-black font-medium">{item.symbol}</Text>
                  <Text className="text-gray-500 ml-1">/USDT</Text>
                  <View className="ml-2 px-1 bg-gray-100 rounded">
                    <Text className="text-gray-400 text-xs">{item.leverage}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View className="items-end">
              <Text className="text-gray-700 text-base">{item.price}</Text>
              <Text className={`${item.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                {item.change > 0 ? "+" : ""}
                {item.change}%
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TopTradeList;
