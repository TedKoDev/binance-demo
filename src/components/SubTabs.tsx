import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface SubTabsProps {
  tabs: string[];
  selectedSubTabs: string[];
  onSelectSubTab: (tab: string) => void;
}

export const SubTabs: React.FC<SubTabsProps> = ({ tabs, selectedSubTabs, onSelectSubTab }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
      <View className="flex-row">
        {tabs.map((tab) => (
          <TouchableOpacity key={tab} onPress={() => onSelectSubTab(tab)}>
            <Text className={`mr-6 pb-2 ${selectedSubTabs.includes(tab) ? "text-yellow-500 border-b-2 border-yellow-500" : "text-gray-400"}`}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};
