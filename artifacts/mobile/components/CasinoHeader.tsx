import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export function CasinoHeader() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, balance, refreshBalance } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const spinAnim = React.useRef(new Animated.Value(0)).current;

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  async function handleRefresh() {
    if (refreshing) return;
    setRefreshing(true);
    Animated.timing(spinAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(() => spinAnim.setValue(0));
    await refreshBalance();
    setRefreshing(false);
  }

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const formatBalance = (n: number) => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
    if (n >= 1_000) return n.toLocaleString();
    return n.toString();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.headerBg, paddingTop: topPad }]}>
      {/* Top row: Avatar | Balance | Icons */}
      <View style={styles.topRow}>
        {/* Avatar */}
        <TouchableOpacity style={[styles.avatar, { backgroundColor: colors.purple }]}>
          <Feather name="user" size={20} color={colors.gold} />
        </TouchableOpacity>

        {/* Balance area */}
        <View style={styles.balanceArea}>
          <MaterialCommunityIcons name="gold" size={18} color={colors.gold} />
          <Text style={[styles.balanceText, { color: colors.gold }]}>
            {formatBalance(balance)}
          </Text>
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshBtn}>
            {refreshing ? (
              <ActivityIndicator size="small" color={colors.gold} />
            ) : (
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Feather name="refresh-cw" size={14} color={colors.gold} />
              </Animated.View>
            )}
          </TouchableOpacity>
        </View>

        {/* Right icons */}
        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Feather name="clock" size={20} color={colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Feather name="menu" size={20} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Withdraw / Deposit row */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.secondary, borderColor: colors.border }]}>
          <MaterialCommunityIcons name="bank-transfer-out" size={16} color="#60A5FA" />
          <Text style={[styles.actionText, { color: "#60A5FA" }]}>ငွေထုတ်</Text>
        </TouchableOpacity>

        <View style={styles.usernamePill}>
          <Text style={[styles.usernameText, { color: colors.mutedForeground }]}>
            {profile?.username ?? "Guest"}
          </Text>
          <View style={[styles.vipBadge, { backgroundColor: colors.gold }]}>
            <Text style={styles.vipText}>VIP {profile?.vip_level ?? 0}</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#DC2626" }]}>
          <MaterialCommunityIcons name="bank-transfer-in" size={16} color="#FFFFFF" />
          <Text style={[styles.actionText, { color: "#FFFFFF" }]}>ငွေသွင်း</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.07)",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingTop: 6,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,215,0,0.4)",
  },
  balanceArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "rgba(255,215,0,0.08)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.2)",
    gap: 6,
  },
  balanceText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    flex: 1,
  },
  refreshBtn: {
    padding: 2,
  },
  rightIcons: {
    flexDirection: "row",
    gap: 4,
  },
  iconBtn: {
    padding: 8,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
    borderWidth: 1,
    borderColor: "transparent",
  },
  actionText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  usernamePill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  usernameText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  vipBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  vipText: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    color: "#000",
  },
});
