import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
// Import your global CSS file
import "../../global.css";

export default function TabLayout() {
  return (
    <BottomSheetModalProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="trade"
          options={{
            title: "Trade",
            tabBarIcon: ({ color }) => <MaterialIcons size={28} name="swap-horiz" color={color} />,
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => <MaterialIcons size={28} name="home" color={color} />,
          }}
        />
      </Tabs>
    </BottomSheetModalProvider>
  );
}
