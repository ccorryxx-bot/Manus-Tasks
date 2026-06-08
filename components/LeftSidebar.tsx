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

const NAV_ITEMS = [
  { id: "home", icon: "home", label: "Home" },
  { id: "cashback", icon: "cash-refund", label: "Cashback" },
  { id: "promo", icon: "gift", label: "Promo" },
  { id: "vip", icon: "crown", label: "VIP" },
  { id: "wheel", icon: "slot-machine-outline", label: "Lucky" },
  { id: "withdraw", icon: "bank-transfer-out", label: "ငွေထုတ်" },
  { id: "deposit", icon: "bank-transfer-in", label: "ငွေဖြည့်" },
  { id: "agent", icon: "account-group", label: "Agent" },
] as const;

interface LeftSidebarProps {
  activeId?: string;
  onSelect?: (id: string) => void;
}

export function LeftSidebar({ activeId = "home", onSelect }: LeftSidebarProps) {
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
        {NAV_ITEMS.map((item) => {
          const isActive = activeId === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.navItem,
                isActive && { backgroundColor: colors.card },
              ]}
              onPress={() => onSelect?.(item.id)}
              activeOpacity={0.7}
            >
              {isActive && (
                <View
                  style={[
                    styles.activeBar,
                    { backgroundColor: colors.gold },
                  ]}
                />
              )}
              <MaterialCommunityIcons
                name={item.icon as any}
                size={22}
                color={isActive ? colors.gold : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.navLabel,
                  {
                    color: isActive ? colors.gold : colors.mutedForeground,
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
  },
  navItem: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 8,
    marginHorizontal: 4,
    marginVertical: 2,
    position: "relative",
  },
  activeBar: {
    position: "absolute",
    left: 0,
    top: 8,
    bottom: 8,
    width: 3,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },
  navLabel: {
    fontSize: 9,
    marginTop: 3,
    textAlign: "center",
  },
});
