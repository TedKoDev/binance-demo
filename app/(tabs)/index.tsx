import React from "react";
import { View, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useRecoilState } from "recoil";
import { fetchCoinList } from "../../src/api/binance";
import { coinState } from "../../src/atoms/coinAtom";
import { CoinList } from "../../src/components/CoinList/CoinList";

export default function TabOneScreen() {
  const { data: coins, isLoading } = useQuery({
    queryKey: ["coinList"],
    queryFn: fetchCoinList,
  });

  const [coinStateValue, setCoinState] = useRecoilState(coinState);

  return (
    <View style={styles.container}>
      <CoinList coins={coins?.symbols} isLoading={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
