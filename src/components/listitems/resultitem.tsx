import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRecoilState } from "recoil";
import { favoritesState } from "@/atoms/favoritesAtom";

interface ResultItemProps {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: string;
  priceChange: string;
  leverage?: string;
  onPress?: () => void;
}

export const ResultItem = ({ symbol, baseAsset, quoteAsset, price, priceChange, leverage, onPress }: ResultItemProps) => {
  const [favorites, setFavorites] = useRecoilState(favoritesState);

  const toggleFavorite = () => {
    setFavorites((prev: any[]) => {
      const exists = prev.some((item: any) => item.symbol === symbol);
      if (exists) {
        return prev.filter((item: any) => item.symbol !== symbol);
      } else {
        return [
          ...prev,
          {
            symbol,
            baseAsset,
            quoteAsset,
            leverage,
          },
        ];
      }
    });
  };

  const isFavorite = favorites.some((item) => item.symbol === symbol);

  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex-row justify-between items-center py-3">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              toggleFavorite();
            }}
            className="mr-3"
          >
            <AntDesign name={isFavorite ? "star" : "staro"} size={20} color={isFavorite ? "#F0B90B" : "#666"} />
          </TouchableOpacity>
          <View>
            <View className="flex-row items-center">
              <Text className="text-white font-medium">{baseAsset}</Text>
              <Text className="text-gray-500 ml-1">/{quoteAsset}</Text>
              {leverage && <Text className="text-gray-500 ml-2">{leverage}</Text>}
            </View>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-white">{price}</Text>
          <Text className={`${parseFloat(priceChange) >= 0 ? "text-green-500" : "text-red-500"}`}>{priceChange}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
