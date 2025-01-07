import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface SubTabsProps {
  tabs: string[];
  selectedSubTabs: string[];
  onSelectSubTab: (tab: string) => void;
}

export const SubTabs: React.FC<SubTabsProps> = ({ tabs, selectedSubTabs, onSelectSubTab }) => {
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
        <View className="flex-row items-center">
          {tabs.map((tab) => (
            <TouchableOpacity className="mr-6 my-3" key={tab} onPress={() => onSelectSubTab(tab)}>
              <Text className={`text-sm ${selectedSubTabs.includes(tab) ? "text-yellow-500 border-b-2 border-yellow-500" : "text-gray-400"}`}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
