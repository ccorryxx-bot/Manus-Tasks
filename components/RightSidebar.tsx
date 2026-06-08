import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

interface RightSidebarProps {
  coinCount?: number;
  onRefresh?: () => void;
}

export function RightSidebar({ coinCount = 9, onRefresh }: RightSidebarProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 24 : insets.top;
  const bottomPad = Platform.OS === "web" ? 24 : insets.bottom;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: topPad + 8, paddingBottom: bottomPad + 8 },
      ]}
    >
      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons
            name="account-circle"
            size={32}
            color="rgba(255,255,255,0.8)"
          />
        </View>
      </View>

      <View style={[styles.coinCircle, { backgroundColor: colors.gold }]}>
        <MaterialCommunityIcons name="bitcoin" size={14} color="#1a0a3d" />
      </View>

      <Text style={styles.coinCount}>{coinCount}</Text>

      <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn} activeOpacity={0.7}>
        <Ionicons name="refresh" size={18} color="rgba(255,255,255,0.75)" />
      </TouchableOpacity>

      <View style={styles.spacer} />

      <TouchableOpacity style={styles.sparkleBtn} activeOpacity={0.7}>
        <MaterialCommunityIcons
          name="butterfly-outline"
          size={18}
          color="rgba(255,255,255,0.5)"
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuBtn} activeOpacity={0.7}>
        <Ionicons name="menu" size={20} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    alignItems: "center",
    gap: 18,
    zIndex: 10,
  },
  avatarWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "rgba(170,68,255,0.3)",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  coinCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  coinCount: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  refreshBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  spacer: {
    flex: 1,
  },
  sparkleBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  menuBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
