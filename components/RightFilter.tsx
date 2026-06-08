import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const FILTER_ITEMS = [
  { id: "vip", icon: "crown", label: "VIP 0" },
  { id: "slots", icon: "slot-machine-outline", label: "Slots" },
  { id: "live", icon: "television-play", label: "Live" },
  { id: "jackpot", icon: "diamond-stone", label: "Jackpot" },
  { id: "new", icon: "new-box", label: "New" },
] as const;

interface RightFilterProps {
  activeFilter?: string;
  onFilterSelect?: (id: string) => void;
}

export function RightFilter({
  activeFilter = "slots",
  onFilterSelect,
}: RightFilterProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.sidebar }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: bottomPad + 8 },
        ]}
      >
        {FILTER_ITEMS.map((item) => {
          const isActive = activeFilter === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.filterItem,
                {
                  backgroundColor: isActive
                    ? colors.accent
                    : colors.playerCount,
                  borderColor: isActive ? colors.accent : colors.border,
                },
              ]}
              onPress={() => onFilterSelect?.(item.id)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={item.icon as any}
                size={16}
                color={isActive ? "#fff" : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.filterLabel,
                  {
                    color: isActive ? "#fff" : colors.mutedForeground,
                    fontFamily: isActive
                      ? "Inter_600SemiBold"
                      : "Inter_400Regular",
                  },
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 62,
  },
  scroll: {
    paddingTop: 8,
    gap: 6,
    paddingHorizontal: 4,
  },
  filterItem: {
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 2,
  },
  filterLabel: {
    fontSize: 9,
    marginTop: 3,
    textAlign: "center",
  },
});
