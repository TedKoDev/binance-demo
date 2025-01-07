import React from "react";
import { View, FlatList, Text } from "react-native";
import { useCoinList } from "../../hooks/queries/useCoinList";
import { useRecoilState } from "recoil";
import { coinState } from "../../atoms/coinAtom";

export const CoinList = ({ coins, isLoading }: { coins: any; isLoading: boolean }) => {
  const [coinStateValue, setCoinState] = useRecoilState(coinState);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <FlatList data={coins} renderItem={({ item }) => <Text>{item.symbol}</Text>} keyExtractor={(item) => item.symbol} />
    </View>
  );
};
