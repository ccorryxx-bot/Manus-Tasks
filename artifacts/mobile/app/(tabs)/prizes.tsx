import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const PRIZES = [
  { id: "1", title: "Daily Login Bonus", amount: 500, type: "daily", claimed: false, icon: "calendar-check" },
  { id: "2", title: "Referral Reward", amount: 2000, type: "referral", claimed: true, icon: "account-group" },
  { id: "3", title: "VIP Cashback", amount: 1500, type: "cashback", claimed: false, icon: "cash-refund" },
  { id: "4", title: "Tournament Prize", amount: 10000, type: "tournament", claimed: true, icon: "trophy" },
  { id: "5", title: "Weekly Bonus", amount: 3000, type: "weekly", claimed: false, icon: "gift" },
  { id: "6", title: "First Deposit", amount: 5000, type: "deposit", claimed: true, icon: "bank-plus" },
];

export default function PrizesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { updateBalance } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  async function handleClaim(prize: (typeof PRIZES)[0]) {
    if (prize.claimed) return;
    await updateBalance(prize.amount);
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.headerBg, paddingTop: topPad + 10 }]}>
        <MaterialCommunityIcons name="gift" size={24} color={colors.gold} />
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>ဆုငွေများ</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === "web" ? 100 : 90 }]}>
        {/* Total available */}
        <View style={[styles.totalCard, { backgroundColor: colors.card, borderColor: colors.gold + "44" }]}>
          <Text style={[styles.totalLabel, { color: colors.mutedForeground }]}>Total Available Prizes</Text>
          <Text style={[styles.totalAmount, { color: colors.gold }]}>
            {PRIZES.filter((p) => !p.claimed).reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
          </Text>
          <Text style={[styles.currency, { color: colors.mutedForeground }]}>COINS</Text>
        </View>

        {/* Prize list */}
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>Available Rewards</Text>
        {PRIZES.map((prize) => (
          <View
            key={prize.id}
            style={[styles.prizeCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={[styles.prizeIcon, { backgroundColor: prize.claimed ? colors.muted : colors.purple + "33" }]}>
              <MaterialCommunityIcons
                name={prize.icon as any}
                size={24}
                color={prize.claimed ? colors.mutedForeground : colors.purple}
              />
            </View>
            <View style={styles.prizeInfo}>
              <Text style={[styles.prizeName, { color: colors.foreground }]}>{prize.title}</Text>
              <Text style={[styles.prizeAmount, { color: prize.claimed ? colors.mutedForeground : colors.gold }]}>
                +{prize.amount.toLocaleString()} Coins
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleClaim(prize)}
              style={[
                styles.claimBtn,
                prize.claimed
                  ? { backgroundColor: colors.muted }
                  : { backgroundColor: colors.gold },
              ]}
            >
              <Text
                style={[
                  styles.claimText,
                  { color: prize.claimed ? colors.mutedForeground : "#000" },
                ]}
              >
                {prize.claimed ? "Claimed" : "Claim"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 14,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.07)",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  content: { padding: 16, gap: 12 },
  totalCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    marginBottom: 8,
  },
  totalLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
  totalAmount: { fontSize: 36, fontFamily: "Inter_700Bold", marginTop: 4 },
  currency: { fontSize: 12, fontFamily: "Inter_500Medium", marginTop: 2 },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 4,
  },
  prizeCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  prizeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  prizeInfo: { flex: 1 },
  prizeName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  prizeAmount: { fontSize: 13, fontFamily: "Inter_500Medium", marginTop: 2 },
  claimBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  claimText: { fontSize: 13, fontFamily: "Inter_700Bold" },
});
