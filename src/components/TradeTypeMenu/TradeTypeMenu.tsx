import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";

const menuItems = ["Convert", "Spot", "Margin", "Copy", "Bots", "Buy/Sell", "P2P"];

export const TradeTypeMenu = () => {
  const [selected, setSelected] = React.useState("Spot");

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {menuItems.map((item) => (
        <TouchableOpacity key={item} style={styles.menuItem} onPress={() => setSelected(item)}>
          <Text style={[styles.menuText, selected === item && styles.selectedText]}>{item}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    marginBottom: 10,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  menuText: {
    fontWeight: "600",
    color: "#666",
  },
  selectedText: {
    color: "#000",
    fontWeight: "600",
  },
});
