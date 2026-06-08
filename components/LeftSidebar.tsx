import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NAV_ITEMS = [
  {
    id: "withdraw",
    label: "ငွေထုတ်",
    uri: "https://ik.imagekit.io/rbok01qam/Native%20App%20icons%20img/1780913025065.png?tr=w-80,h-80,f-webp",
    red: false,
  },
  {
    id: "reward",
    label: "ဆုလာဘ်",
    uri: "https://ik.imagekit.io/rbok01qam/Native%20App%20icons%20img/IMG_20260608_163859.png?tr=w-80,h-80,f-webp",
    red: false,
  },
  {
    id: "vip",
    label: "VIP",
    uri: "https://ik.imagekit.io/rbok01qam/Native%20App%20icons%20img/1780913465345.png?tr=w-80,h-80,f-webp",
    red: false,
  },
  {
    id: "lucky",
    label: "ကံကောင်းခြင်း",
    uri: "https://ik.imagekit.io/rbok01qam/Native%20App%20icons%20img/1780913565941.png?tr=w-80,h-80,f-webp",
    red: false,
  },
  {
    id: "notify",
    label: "အသိပေးချက်",
    uri: "https://ik.imagekit.io/rbok01qam/Native%20App%20icons%20img/1780913673707.png?tr=w-80,h-80,f-webp",
    red: false,
  },
  {
    id: "wheel",
    label: "Lucky Wheel",
    uri: "https://ik.imagekit.io/rbok01qam/Native%20App%20icons%20img/1780913783929.png?tr=w-80,h-80,f-webp",
    red: false,
  },
  {
    id: "deposit",
    label: "ငွေသွင်း",
    uri: "https://ik.imagekit.io/rbok01qam/Native%20App%20icons%20img/1780913143971.png?tr=w-80,h-80,f-webp",
    red: true,
  },
] as const;

interface LeftSidebarProps {
  activeId?: string;
  onSelect?: (id: string) => void;
}

export function LeftSidebar({ activeId = "withdraw", onSelect }: LeftSidebarProps) {
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

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.navItem,
                item.red && styles.redItem,
                isActive && !item.red && styles.activeItem,
              ]}
              onPress={() => onSelect?.(item.id)}
              activeOpacity={0.75}
            >
              {isActive && !item.red && (
                <View style={styles.glowRing} />
              )}

              <Image
                source={{ uri: item.uri }}
                style={[
                  styles.icon,
                  item.red && styles.iconRed,
                ]}
                resizeMode="contain"
              />

              <Text
                style={[
                  styles.navLabel,
                  isActive && styles.navLabelActive,
                  item.red && styles.navLabelRed,
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
    gap: 4,
    paddingHorizontal: 4,
  },
  navItem: {
    alignItems: "center",
    width: 62,
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderRadius: 10,
    position: "relative",
  },
  activeItem: {
    backgroundColor: "rgba(170,68,255,0.2)",
    transform: [{ scale: 1.05 }],
  },
  redItem: {
    backgroundColor: "#cc0000",
    borderRadius: 10,
    marginTop: 6,
    paddingVertical: 8,
  },
  glowRing: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#aa44ff",
    opacity: 0.85,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  iconRed: {
    width: 36,
    height: 36,
  },
  navLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.65)",
    textAlign: "center",
    marginTop: 3,
    lineHeight: 12,
  },
  navLabelActive: {
    color: "#ffffff",
    opacity: 1,
  },
  navLabelRed: {
    color: "#ffffff",
    opacity: 1,
  },
});
