import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { StyleSheet } from "react-native";
import { exchangeInfoState } from "@/atoms/exchangeInfo";
import { fetchCoinList } from "@/api/binance";

// Import your global CSS file
import "../global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// RecoilRoot 밖에서 실행될 별도의 컴포넌트 생성
function InitializeApp() {
  const setExchangeInfo = useSetRecoilState(exchangeInfoState);

  useEffect(() => {
    const loadExchangeInfo = async () => {
      try {
        const data = await fetchCoinList();
        setExchangeInfo(data);
      } catch (error) {
        console.error("Failed to fetch exchange info:", error);
      }
    };

    loadExchangeInfo();
  }, []);

  return null;
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const queryClient = new QueryClient();

  return (
    <GestureHandlerRootView style={styles.container}>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <InitializeApp />
          <StatusBar style="auto" />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </RecoilRoot>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
