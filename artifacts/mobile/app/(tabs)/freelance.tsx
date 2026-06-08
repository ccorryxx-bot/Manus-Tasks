import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const TASKS = [
  { id: "1", title: "Share App Link", reward: 500, type: "share", completed: false, icon: "share-variant" },
  { id: "2", title: "Invite 3 Friends", reward: 3000, type: "referral", completed: false, icon: "account-multiple-plus" },
  { id: "3", title: "Play 10 Games", reward: 800, type: "play", completed: true, icon: "controller" },
  { id: "4", title: "Complete Profile", reward: 1000, type: "profile", completed: true, icon: "account-check" },
  { id: "5", title: "First Deposit", reward: 5000, type: "deposit", completed: false, icon: "bank-plus" },
  { id: "6", title: "Win 5 Times in a Row", reward: 2500, type: "streak", completed: false, icon: "fire" },
];

export default function FreelanceScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { balance, updateBalance } = useApp();
  const [tasks, setTasks] = useState(TASKS);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const totalEarned = tasks.filter((t) => t.completed).reduce((s, t) => s + t.reward, 0);
  const totalPending = tasks.filter((t) => !t.completed).reduce((s, t) => s + t.reward, 0);

  async function handleComplete(taskId: string) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.completed) return;
    await updateBalance(task.reward);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, completed: true } : t)));
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBg, paddingTop: topPad + 10 }]}>
        <MaterialCommunityIcons name="briefcase" size={24} color={colors.gold} />
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Freelance Tasks</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === "web" ? 100 : 90 }]}>
        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="check-circle" size={20} color={colors.success} />
            <Text style={[styles.statValue, { color: colors.success }]}>{totalEarned.toLocaleString()}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Earned</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="clock-outline" size={20} color={colors.gold} />
            <Text style={[styles.statValue, { color: colors.gold }]}>{totalPending.toLocaleString()}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Pending</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="wallet" size={20} color={colors.purple} />
            <Text style={[styles.statValue, { color: colors.purple }]}>{balance.toLocaleString()}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Balance</Text>
          </View>
        </View>

        {/* Tasks */}
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>Available Tasks</Text>
        {tasks.map((task) => (
          <View
            key={task.id}
            style={[
              styles.taskCard,
              { backgroundColor: colors.card, borderColor: task.completed ? colors.success + "55" : colors.border },
              task.completed && { opacity: 0.7 },
            ]}
          >
            <View style={[styles.taskIconBg, { backgroundColor: task.completed ? colors.success + "22" : colors.purple + "22" }]}>
              <MaterialCommunityIcons
                name={task.icon as any}
                size={22}
                color={task.completed ? colors.success : colors.purple}
              />
            </View>
            <View style={styles.taskInfo}>
              <Text style={[styles.taskTitle, { color: colors.foreground }]}>{task.title}</Text>
              <Text style={[styles.taskReward, { color: colors.gold }]}>+{task.reward.toLocaleString()} Coins</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleComplete(task.id)}
              style={[
                styles.taskBtn,
                task.completed
                  ? { backgroundColor: colors.success }
                  : { backgroundColor: colors.primary },
              ]}
            >
              {task.completed ? (
                <Feather name="check" size={16} color="#000" />
              ) : (
                <Text style={styles.taskBtnText}>Go</Text>
              )}
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
  headerTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  content: { padding: 16, gap: 12 },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 4 },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
  },
  statValue: { fontSize: 16, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 4,
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  taskIconBg: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  taskReward: { fontSize: 12, fontFamily: "Inter_500Medium", marginTop: 3 },
  taskBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  taskBtnText: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#000" },
});
