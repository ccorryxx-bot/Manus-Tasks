import { MaterialCommunityIcons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const NAV_ITEMS = [
  { route: "/(tabs)/index",         icon: "cards-playing",  label: "ဂိမ်း",     color: "#FFD700" },
  { route: "/(tabs)/prizes",        icon: "gift",           label: "ဆုငွေ",     color: "#F97316" },
  { route: "/(tabs)/vip",           icon: "crown",          label: "VIP",        color: "#FFD700" },
  { route: "/(tabs)/freelance",     icon: "briefcase-check",label: "Freelance",  color: "#22C55E" },
  { route: "/(tabs)/notifications", icon: "bell",           label: "Notif",      color: "#A855F7" },
  { route: "/(tabs)/wheel",         icon: "ferris-wheel",   label: "Wheel",      color: "#EC4899" },
  { route: "/(tabs)/service",       icon: "headset",        label: "ဝန်ဆောင်", color: "#60A5FA" },
];

export function LandscapeNav() {
  const colors = useColors();
  const router = useRouter();
  const pathname = usePathname();
  const { unreadCount } = useApp();

  return (
    <View style={[styles.sidebar, { backgroundColor: colors.headerBg, borderRightColor: colors.border }]}>
      {/* Logo / Avatar area */}
      <View style={[styles.logoWrap, { borderBottomColor: colors.border }]}>
        <Image
          source={require("../assets/images/icon.png")}
          style={styles.logo}
          resizeMode="cover"
        />
      </View>

      {/* Nav items */}
      <View style={styles.navList}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.route || (pathname === "/" && item.route === "/(tabs)/index");
          return (
            <TouchableOpacity
              key={item.route}
              onPress={() => router.navigate(item.route as any)}
              style={[styles.navItem, isActive && { backgroundColor: item.color + "22" }]}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrap, isActive && { backgroundColor: item.color }]}>
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={18}
                  color={isActive ? "#FFF" : colors.mutedForeground}
                />
                {item.route.includes("notifications") && unreadCount > 0 && (
                  <View style={styles.badge} />
                )}
              </View>
              <Text
                style={[styles.label, { color: isActive ? item.color : colors.mutedForeground }]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 68,
    zIndex: 100,
    borderRightWidth: 1,
  },
  logoWrap: {
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  navList: {
    flex: 1,
    paddingVertical: 4,
    gap: 2,
  },
  navItem: {
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: 10,
    marginHorizontal: 4,
    gap: 3,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 8,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    borderWidth: 1,
    borderColor: "#0D1035",
  },
});
