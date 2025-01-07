import { StyleSheet, Image, Platform, View, Text } from "react-native";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text>Explore</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  container: {
    flex: 1,
    padding: 16,
  },
});
