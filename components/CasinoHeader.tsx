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

interface CasinoHeaderProps {
  balance: number;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export function CasinoHeader({
  balance,
  onNotificationPress,
  onProfilePress,
}: CasinoHeaderProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 16 : insets.top;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.sidebar, paddingTop: topPad + 8 },
      ]}
    >
      <View style={styles.leftSection}>
        <View style={[styles.logoCircle, { backgroundColor: colors.gold }]}>
          <MaterialCommunityIcons name="crown" size={18} color="#0E1535" />
        </View>
        <Text style={[styles.logoText, { color: colors.gold }]}>MANUS</Text>
        <Text style={[styles.logoSub, { color: colors.mutedForeground }]}>
          CASINO
        </Text>
      </View>

      <View style={styles.centerSection}>
        <View
          style={[styles.balanceChip, { backgroundColor: colors.playerCount }]}
        >
          <MaterialCommunityIcons
            name="bitcoin"
            size={14}
            color={colors.gold}
          />
          <Text style={[styles.balanceText, { color: colors.gold }]}>
            {balance.toLocaleString()}
          </Text>
          <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.accent }]}>
            <Ionicons name="add" size={12} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onNotificationPress}
        >
          <Ionicons
            name="notifications-outline"
            size={22}
            color={colors.mutedForeground}
          />
          <View
            style={[styles.notifDot, { backgroundColor: colors.destructive }]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.avatarBtn, { borderColor: colors.gold }]}
          onPress={onProfilePress}
        >
          <MaterialCommunityIcons
            name="account-circle"
            size={30}
            color={colors.mutedForeground}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  logoCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.5,
  },
  logoSub: {
    fontSize: 9,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1,
    marginTop: 2,
  },
  centerSection: {
    flex: 1,
    alignItems: "center",
  },
  balanceChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  balanceText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  addBtn: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  rightSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    position: "relative",
  },
  notifDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  avatarBtn: {
    borderRadius: 18,
    borderWidth: 1.5,
  },
});
