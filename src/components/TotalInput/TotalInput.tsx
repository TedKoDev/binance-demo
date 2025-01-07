import React, { useRef, useState } from "react";
import { View, TextInput, Pressable, Animated, Text } from "react-native";

interface TotalInputProps {
  selectedPair: string;
}

export const TotalInput = ({ selectedPair }: TotalInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");
  const labelAnimation = useRef(new Animated.Value(0)).current;

  const animateLabel = (toFocused: boolean) => {
    Animated.timing(labelAnimation, {
      toValue: toFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    animateLabel(false);
    setValue("");
  };

  const labelStyle = {
    transform: [
      {
        translateY: labelAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -12],
        }),
      },
      {
        scale: labelAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.85],
        }),
      },
    ],
  };

  return (
    <Pressable
      className="bg-gray-100 h-12 rounded-lg mb-3 items-center justify-center"
      onPress={() => {
        setIsFocused(true);
        animateLabel(true);
      }}
    >
      <View className="px-4 py-3 relative items-center">
        <Animated.Text className="text-gray-400 absolute" style={labelStyle}>
          Total ({selectedPair})
        </Animated.Text>
        {isFocused ? (
          <TextInput
            className="text-gray-900 mt-1 text-center w-full"
            keyboardType="numeric"
            value={value}
            onChangeText={setValue}
            onFocus={() => {
              setIsFocused(true);
              animateLabel(true);
            }}
            onBlur={handleBlur}
            autoFocus
          />
        ) : null}
      </View>
    </Pressable>
  );
};
