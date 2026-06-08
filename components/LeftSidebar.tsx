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

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

const NAV_ITEMS: {
  id: string;
  icon: IconName;
  label: string;
  iconColor?: string;
  bgColor?: string;
  red?: boolean;
}[] = [
  {
    id: "treasure",
    icon: "bitcoin",
    label: "ရတနာ",
    iconColor: "#ffcc00",
    bgColor: "rgba(170,68,255,0.35)",
  },
  {
    id: "reward",
    icon: "gift",
    label: "ဆုလဒ်",
    iconColor: "#cc88ff",
  },
  {
    id: "vip",
    icon: "crown",
    label: "VIP",
    iconColor: "#ffcc00",
  },
  {
    id: "ball",
    icon: "soccer",
    label: "ခေတ်မီဘော်",
    iconColor: "#aabbcc",
  },
  {
    id: "chips",
    icon: "poker-chip",
    label: "ဘောင်",
    iconColor: "#ff8844",
  },
  {
    id: "wheel",
    icon: "ferris-wheel",
    label: "Lucky Wheel",
    iconColor: "#88ddff",
  },
  {
    id: "magic",
    icon: "magic-staff",
    label: "မြ",
    iconColor: "#cc88ff",
  },
  {
    id: "money",
    icon: "cash-multiple",
    label: "ငွေကြေး",
    iconColor: "#ffffff",
    red: true,
  },
];

interface LeftSidebarProps {
  activeId?: string;
  onSelect?: (id: string) => void;
}

export function LeftSidebar({ activeId = "treasure", onSelect }: LeftSidebarProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 24 : insets.top;
  const bottomPad = Platform.OS === "web" ? 24 : insets.bottom;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: topPad + 4, paddingBottom: bottomPad + 4 },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeId === item.id;
          const isRed = item.red;

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.navItem,
                isRed && styles.redItem,
                isActive && !isRed && styles.activeItem,
              ]}
              onPress={() => onSelect?.(item.id)}
              activeOpacity={0.75}
            >
              {isActive && !isRed && (
                <View style={[styles.glowRing, { borderColor: colors.accent }]} />
              )}
              <View
                style={[
                  styles.iconWrap,
                  item.bgColor ? { backgroundColor: item.bgColor } : null,
                  isRed ? styles.redIconWrap : null,
                  isActive && !isRed
                    ? { backgroundColor: "rgba(170,68,255,0.3)" }
                    : null,
                ]}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={26}
                  color={item.iconColor ?? "#ffffff"}
                />
              </View>
              <Text
                style={[
                  styles.navLabel,
                  isActive && { color: "#ffffff", opacity: 1 },
                  isRed && { color: "#ffffff" },
                ]}
                numberOfLines={2}
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
    width: 70,
    zIndex: 10,
  },
  scroll: {
    alignItems: "center",
    gap: 6,
  },
  navItem: {
    alignItems: "center",
    width: 62,
    paddingVertical: 6,
    borderRadius: 10,
    position: "relative",
  },
  activeItem: {
    transform: [{ scale: 1.05 }],
  },
  redItem: {
    backgroundColor: "#cc0000",
    borderRadius: 10,
    width: 62,
    marginTop: 4,
  },
  glowRing: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
    borderWidth: 1.5,
    opacity: 0.8,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  redIconWrap: {
    backgroundColor: "transparent",
    width: 36,
    height: 36,
  },
  navLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginTop: 2,
    lineHeight: 12,
  },
});
