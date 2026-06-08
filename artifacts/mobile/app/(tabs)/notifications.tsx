import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const MOCK_NOTIFS = [
  { id: "1", title: "Welcome Bonus!", message: "You received 10,000 welcome coins. Start playing now!", type: "bonus", is_read: false, created_at: "2 mins ago", icon: "gift" },
  { id: "2", title: "VIP Level Up", message: "Congratulations! You've reached Silver VIP level.", type: "vip", is_read: false, created_at: "1 hour ago", icon: "crown" },
  { id: "3", title: "Deposit Successful", message: "Your deposit of 5,000 coins was processed successfully.", type: "transaction", is_read: true, created_at: "3 hours ago", icon: "check-circle" },
  { id: "4", title: "Daily Reward Ready", message: "Your daily login bonus is waiting. Claim it now!", type: "daily", is_read: true, created_at: "Yesterday", icon: "calendar-check" },
  { id: "5", title: "Lucky Wheel Spin", message: "Your free daily wheel spin is available!", type: "wheel", is_read: false, created_at: "Yesterday", icon: "rotate-3d-variant" },
  { id: "6", title: "Tournament Alert", message: "A new tournament has started. Join now for a chance to win 100,000 coins!", type: "tournament", is_read: true, created_at: "2 days ago", icon: "trophy" },
];

const TYPE_COLORS: Record<string, string> = {
  bonus: "#FFD700",
  vip: "#A855F7",
  transaction: "#22C55E",
  daily: "#F97316",
  wheel: "#60A5FA",
  tournament: "#EF4444",
};

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setUnreadCount } = useApp();
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const unread = notifs.filter((n) => !n.is_read).length;

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }

  function markRead(id: string) {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    const newUnread = notifs.filter((n) => !n.is_read && n.id !== id).length;
    setUnreadCount(newUnread);
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBg, paddingTop: topPad + 10 }]}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="bell" size={24} color={colors.gold} />
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Notifications</Text>
          {unread > 0 && (
            <View style={[styles.badge, { backgroundColor: "#EF4444" }]}>
              <Text style={styles.badgeText}>{unread}</Text>
            </View>
          )}
        </View>
        {unread > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={[styles.markAll, { color: colors.purple }]}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === "web" ? 100 : 90 }]}>
        {notifs.map((notif) => (
          <TouchableOpacity
            key={notif.id}
            onPress={() => markRead(notif.id)}
            style={[
              styles.notifCard,
              {
                backgroundColor: notif.is_read ? colors.card : colors.card,
                borderColor: notif.is_read ? colors.border : (TYPE_COLORS[notif.type] ?? colors.purple) + "66",
                borderLeftWidth: notif.is_read ? 1 : 3,
                borderLeftColor: notif.is_read ? colors.border : (TYPE_COLORS[notif.type] ?? colors.purple),
              },
            ]}
          >
            <View
              style={[
                styles.notifIcon,
                { backgroundColor: (TYPE_COLORS[notif.type] ?? colors.purple) + "22" },
              ]}
            >
              <MaterialCommunityIcons
                name={notif.icon as any}
                size={22}
                color={TYPE_COLORS[notif.type] ?? colors.purple}
              />
            </View>
            <View style={styles.notifBody}>
              <View style={styles.notifTop}>
                <Text style={[styles.notifTitle, { color: notif.is_read ? colors.mutedForeground : colors.foreground }]}>
                  {notif.title}
                </Text>
                {!notif.is_read && <View style={[styles.dot, { backgroundColor: "#60A5FA" }]} />}
              </View>
              <Text style={[styles.notifMsg, { color: colors.mutedForeground }]} numberOfLines={2}>
                {notif.message}
              </Text>
              <Text style={[styles.notifTime, { color: colors.mutedForeground }]}>{notif.created_at}</Text>
            </View>
          </TouchableOpacity>
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.07)",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  badgeText: { fontSize: 11, fontFamily: "Inter_700Bold", color: "#FFF" },
  markAll: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  content: { padding: 16, gap: 10 },
  notifCard: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  notifIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  notifBody: { flex: 1 },
  notifTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  notifTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4, marginLeft: 6 },
  notifMsg: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
  notifTime: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 4 },
});
