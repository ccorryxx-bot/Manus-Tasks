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
      {/* Row 1: Avatar | Balance pill | Clock | Menu */}
      <View style={styles.topRow}>
        {/* Avatar circle */}
        <TouchableOpacity style={[styles.avatar, { backgroundColor: colors.purple, borderColor: colors.gold + "66" }]}>
          <Feather name="user" size={20} color={colors.gold} />
        </TouchableOpacity>

        {/* Balance pill */}
        <TouchableOpacity
          onPress={handleRefresh}
          style={[styles.balancePill, { backgroundColor: "rgba(255,215,0,0.1)", borderColor: "rgba(255,215,0,0.3)" }]}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="gold" size={16} color={colors.gold} />
          <Text style={[styles.balanceText, { color: colors.gold }]}>
            {formatBalance(balance)}
          </Text>
          {refreshing ? (
            <ActivityIndicator size="small" color={colors.gold} style={{ marginLeft: 4 }} />
          ) : (
            <Animated.View style={{ transform: [{ rotate: spin }], marginLeft: 4 }}>
              <Feather name="refresh-cw" size={13} color={colors.gold + "aa"} />
            </Animated.View>
          )}
        </TouchableOpacity>

        {/* Right icon buttons */}
        <View style={styles.rightIcons}>
          <TouchableOpacity style={[styles.iconCircle, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="clock" size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconCircle, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="view-grid-outline" size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Row 2: Withdraw | Username+VIP | Deposit */}
      <View style={styles.actionRow}>
        {/* Withdraw — pill outlined */}
        <TouchableOpacity
          style={[styles.withdrawBtn, { borderColor: "#60A5FA55", backgroundColor: "#1E3A5F" }]}
          activeOpacity={0.75}
        >
          <MaterialCommunityIcons name="bank-transfer-out" size={15} color="#60A5FA" />
          <Text style={[styles.btnText, { color: "#93C5FD" }]}>ငွေထုတ်</Text>
        </TouchableOpacity>

        {/* Center user info */}
        <View style={styles.userInfo}>
          <Text style={[styles.username, { color: colors.foreground }]} numberOfLines={1}>
            {profile?.username ?? "Guest"}
          </Text>
          <View style={[styles.vipPill, { backgroundColor: colors.gold }]}>
            <MaterialCommunityIcons name="crown" size={9} color="#000" />
            <Text style={styles.vipText}>VIP {profile?.vip_level ?? 0}</Text>
          </View>
        </View>

        {/* Deposit — filled red pill */}
        <TouchableOpacity
          style={[styles.depositBtn, { backgroundColor: "#DC2626" }]}
          activeOpacity={0.75}
        >
          <MaterialCommunityIcons name="bank-transfer-in" size={15} color="#FFFFFF" />
          <Text style={[styles.btnText, { color: "#FFF" }]}>ငွေသွင်း</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.07)",
    gap: 10,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 6,
    gap: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  balancePill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
  },
  balanceText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    flex: 1,
    marginLeft: 6,
  },
  rightIcons: {
    flexDirection: "row",
    gap: 6,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  withdrawBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    gap: 5,
  },
  depositBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    gap: 5,
  },
  btnText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  userInfo: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  username: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  vipPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    gap: 3,
  },
  vipText: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    color: "#000",
  },
});
