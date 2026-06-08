import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const VIP_LEVELS = [
  { level: 0, name: "Bronze", color: "#CD7F32", minPoints: 0, maxPoints: 999, perks: ["Daily 100 coins", "Access to basic games"] },
  { level: 1, name: "Silver", color: "#C0C0C0", minPoints: 1000, maxPoints: 4999, perks: ["Daily 500 coins", "5% cashback", "Priority support"] },
  { level: 2, name: "Gold", color: "#FFD700", minPoints: 5000, maxPoints: 19999, perks: ["Daily 2000 coins", "10% cashback", "Exclusive tournaments", "Dedicated support"] },
  { level: 3, name: "Platinum", color: "#E5E4E2", minPoints: 20000, maxPoints: 99999, perks: ["Daily 5000 coins", "15% cashback", "Luxury gifts", "Personal manager"] },
  { level: 4, name: "Diamond", color: "#B9F2FF", minPoints: 100000, maxPoints: null, perks: ["Daily 10000 coins", "20% cashback", "VIP events", "Private lounge access"] },
];

export default function VIPScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const currentLevel = profile?.vip_level ?? 0;
  const current = VIP_LEVELS[Math.min(currentLevel, VIP_LEVELS.length - 1)];
  const next = VIP_LEVELS[Math.min(currentLevel + 1, VIP_LEVELS.length - 1)];
  const progress = current.maxPoints
    ? (Math.min(currentLevel * 1000, current.maxPoints - current.minPoints) / (current.maxPoints - current.minPoints)) * 100
    : 100;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBg, paddingTop: topPad + 10 }]}>
        <MaterialCommunityIcons name="crown" size={24} color={colors.gold} />
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>VIP Club</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === "web" ? 100 : 90 }]}>
        {/* Current level card */}
        <View style={[styles.currentCard, { backgroundColor: current.color + "22", borderColor: current.color + "66" }]}>
          <MaterialCommunityIcons name="crown" size={40} color={current.color} />
          <Text style={[styles.levelName, { color: current.color }]}>{current.name}</Text>
          <Text style={[styles.levelLabel, { color: colors.mutedForeground }]}>Current Level</Text>

          {/* Progress bar */}
          {current.maxPoints && (
            <View style={styles.progressContainer}>
              <View style={[styles.progressBg, { backgroundColor: colors.border }]}>
                <View style={[styles.progressFill, { width: `${progress}%` as any, backgroundColor: current.color }]} />
              </View>
              <Text style={[styles.progressText, { color: colors.mutedForeground }]}>
                {current.minPoints.toLocaleString()} / {current.maxPoints.toLocaleString()} pts
              </Text>
            </View>
          )}
        </View>

        {/* Perks */}
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>Current Perks</Text>
        {current.perks.map((perk, i) => (
          <View key={i} style={[styles.perkRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="check-circle" size={18} color={colors.success} />
            <Text style={[styles.perkText, { color: colors.foreground }]}>{perk}</Text>
          </View>
        ))}

        {/* All levels */}
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>All Levels</Text>
        {VIP_LEVELS.map((lvl) => (
          <View
            key={lvl.level}
            style={[
              styles.levelRow,
              { backgroundColor: colors.card, borderColor: lvl.level === currentLevel ? lvl.color : colors.border },
              lvl.level === currentLevel && { borderWidth: 2 },
            ]}
          >
            <MaterialCommunityIcons name="crown" size={28} color={lvl.color} />
            <View style={styles.levelInfo}>
              <Text style={[styles.levelRowName, { color: lvl.color }]}>{lvl.name}</Text>
              <Text style={[styles.levelPoints, { color: colors.mutedForeground }]}>
                {lvl.minPoints.toLocaleString()}+ pts
              </Text>
            </View>
            {lvl.level === currentLevel && (
              <View style={[styles.currentBadge, { backgroundColor: lvl.color }]}>
                <Text style={styles.currentBadgeText}>Current</Text>
              </View>
            )}
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
  headerTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  content: { padding: 16, gap: 12 },
  currentCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    marginBottom: 8,
    gap: 6,
  },
  levelName: { fontSize: 28, fontFamily: "Inter_700Bold" },
  levelLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
  progressContainer: { width: "100%", marginTop: 8, gap: 6 },
  progressBg: { height: 8, borderRadius: 4, width: "100%" },
  progressFill: { height: 8, borderRadius: 4 },
  progressText: { fontSize: 11, fontFamily: "Inter_500Medium", textAlign: "center" },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 4,
  },
  perkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  perkText: { fontSize: 14, fontFamily: "Inter_500Medium", flex: 1 },
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  levelInfo: { flex: 1 },
  levelRowName: { fontSize: 16, fontFamily: "Inter_700Bold" },
  levelPoints: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  currentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadgeText: { fontSize: 11, fontFamily: "Inter_700Bold", color: "#000" },
});
