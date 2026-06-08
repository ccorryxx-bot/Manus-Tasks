import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GameCard } from "@/components/GameCard";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { supabase, type Game } from "@/lib/supabase";

const CATEGORIES = [
  { id: "all",     icon: "cards-playing",  label: "ကစားပွဲ" },
  { id: "slots",   icon: "slot-machine",   label: "Slots"   },
  { id: "live",    icon: "video",          label: "Live"    },
  { id: "jackpot", icon: "treasure-chest", label: "Jackpot" },
  { id: "new",     icon: "star-shooting",  label: "New"     },
];

const STATIC_GAMES: Game[] = [
  { id: "1",  name: "African Buffalo",  provider: "PG Soft",    category: "slots",   thumbnail_url: null, player_count: 313,  is_new: false, is_hot: true,  sort_order: 1,  created_at: "" },
  { id: "2",  name: "Fire Link",        provider: "L&W",        category: "slots",   thumbnail_url: null, player_count: 490,  is_new: false, is_hot: true,  sort_order: 2,  created_at: "" },
  { id: "3",  name: "Lucky KOI",        provider: "PG Soft",    category: "slots",   thumbnail_url: null, player_count: 380,  is_new: true,  is_hot: false, sort_order: 3,  created_at: "" },
  { id: "4",  name: "Prancing Pigs",    provider: "PG Soft",    category: "slots",   thumbnail_url: null, player_count: 472,  is_new: true,  is_hot: false, sort_order: 4,  created_at: "" },
  { id: "5",  name: "Luxury Line",      provider: "Bally",      category: "slots",   thumbnail_url: null, player_count: 307,  is_new: false, is_hot: true,  sort_order: 5,  created_at: "" },
  { id: "6",  name: "Treasure Hunt",    provider: "IGT",        category: "slots",   thumbnail_url: null, player_count: 460,  is_new: true,  is_hot: false, sort_order: 6,  created_at: "" },
  { id: "7",  name: "Wild Coins",       provider: "Aristocrat", category: "slots",   thumbnail_url: null, player_count: 428,  is_new: true,  is_hot: false, sort_order: 7,  created_at: "" },
  { id: "8",  name: "Fortune Cat",      provider: "PG Soft",    category: "slots",   thumbnail_url: null, player_count: 485,  is_new: true,  is_hot: false, sort_order: 8,  created_at: "" },
  { id: "9",  name: "Dragon Tiger",     provider: "Evolution",  category: "live",    thumbnail_url: null, player_count: 892,  is_new: false, is_hot: true,  sort_order: 9,  created_at: "" },
  { id: "10", name: "Baccarat Classic", provider: "Evolution",  category: "live",    thumbnail_url: null, player_count: 1240, is_new: false, is_hot: true,  sort_order: 10, created_at: "" },
  { id: "11", name: "Mega Jackpot",     provider: "IGT",        category: "jackpot", thumbnail_url: null, player_count: 234,  is_new: false, is_hot: true,  sort_order: 11, created_at: "" },
  { id: "12", name: "Gold Rush",        provider: "Aristocrat", category: "jackpot", thumbnail_url: null, player_count: 167,  is_new: true,  is_hot: false, sort_order: 12, created_at: "" },
];

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { profile, balance, refreshBalance } = useApp();
  const [games, setGames]           = useState<Game[]>(STATIC_GAMES);
  const [loading, setLoading]       = useState(false);
  const [category, setCategory]     = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const spinAnim = useRef(new Animated.Value(0)).current;

  // Layout constants for landscape
  const SIDEBAR    = 68;
  const COLS       = 2;
  const H_PAD      = 10;
  const GAP        = 8;
  const TOP_BAR_H  = 46 + 30;   // topBar + userStrip
  const BOT_BAR_H  = 50;
  const available  = width - SIDEBAR - H_PAD * 2 - GAP * (COLS - 1);
  const gridH      = height - TOP_BAR_H - BOT_BAR_H;
  // Show ~2.2 rows at once so user sees there's more below
  const CARD_H     = Math.max(90, Math.floor((gridH - GAP) / 2.2));
  const CARD_W     = Math.floor(available / COLS);

  useEffect(() => { fetchGames(); }, []);

  async function fetchGames() {
    try {
      const { data } = await supabase.from("games").select("*").order("sort_order");
      if (data && data.length > 0) setGames(data as Game[]);
    } catch { }
  }

  async function handleRefresh() {
    if (refreshing) return;
    setRefreshing(true);
    Animated.timing(spinAnim, { toValue: 1, duration: 700, useNativeDriver: true })
      .start(() => spinAnim.setValue(0));
    await refreshBalance();
    setRefreshing(false);
  }

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  const filtered = category === "all"   ? games
    : category === "new"                ? games.filter(g => g.is_new)
    : games.filter(g => g.category === category);

  const topPad = Platform.OS === "web" ? 0 : insets.top;

  const formatBal = (n: number) =>
    n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + "M" : n.toLocaleString();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>

      {/* ── Top compact bar ── */}
      <View style={[styles.topBar, { backgroundColor: colors.headerBg, paddingTop: topPad, borderBottomColor: colors.border }]}>

        {/* Left: category pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {CATEGORIES.map(cat => {
            const active = category === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setCategory(cat.id)}
                style={[
                  styles.catPill,
                  active
                    ? { backgroundColor: colors.purple }
                    : { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <MaterialCommunityIcons
                  name={cat.icon as any}
                  size={13}
                  color={active ? "#FFF" : colors.mutedForeground}
                />
                <Text style={[styles.catLabel, { color: active ? "#FFF" : colors.mutedForeground }]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Right: balance + avatar */}
        <View style={styles.rightBar}>
          <TouchableOpacity
            onPress={handleRefresh}
            style={[styles.balancePill, { backgroundColor: "rgba(255,215,0,0.12)", borderColor: "rgba(255,215,0,0.3)" }]}
          >
            <MaterialCommunityIcons name="gold" size={14} color={colors.gold} />
            <Text style={[styles.balText, { color: colors.gold }]}>{formatBal(balance)}</Text>
            {refreshing
              ? <ActivityIndicator size="small" color={colors.gold} style={{ marginLeft: 2 }} />
              : (
                <Animated.View style={{ transform: [{ rotate: spin }], marginLeft: 2 }}>
                  <Feather name="refresh-cw" size={11} color={colors.gold + "aa"} />
                </Animated.View>
              )
            }
          </TouchableOpacity>

          <TouchableOpacity style={[styles.avatar, { backgroundColor: colors.purple, borderColor: colors.gold + "55" }]}>
            <Feather name="user" size={16} color={colors.gold} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Username + VIP strip ── */}
      <View style={[styles.userStrip, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
        <Text style={[styles.username, { color: colors.mutedForeground }]}>
          {profile?.username ?? "Guest"}
        </Text>
        <View style={[styles.vipPill, { backgroundColor: colors.gold }]}>
          <MaterialCommunityIcons name="crown" size={9} color="#000" />
          <Text style={styles.vipTxt}>VIP {profile?.vip_level ?? 0}</Text>
        </View>
        {/* "သင်အတွက်" pill */}
        <TouchableOpacity style={[styles.forYouPill, { backgroundColor: colors.purple + "33", borderColor: colors.purple }]}>
          <Text style={[styles.forYouTxt, { color: colors.purple }]}>★ သင်အတွက်</Text>
        </TouchableOpacity>
      </View>

      {/* ── 2-column game grid ── */}
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.gold} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          numColumns={COLS}
          contentContainerStyle={{ padding: H_PAD, paddingBottom: 8, gap: GAP }}
          columnWrapperStyle={{ gap: GAP }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <GameCard game={item} cardWidth={CARD_W} cardHeight={CARD_H} />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialCommunityIcons name="cards-playing-outline" size={36} color={colors.mutedForeground} />
              <Text style={[styles.emptyTxt, { color: colors.mutedForeground }]}>ဂိမ်းများ မတွေ့ပါ</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen:    { flex: 1 },
  loading:   { flex: 1, alignItems: "center", justifyContent: "center" },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingBottom: 6,
    gap: 8,
    minHeight: 46,
  },
  catScroll:   { gap: 6, alignItems: "center" },
  catPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    gap: 4,
  },
  catLabel:    { fontSize: 11, fontFamily: "Inter_500Medium" },

  rightBar:    { flexDirection: "row", alignItems: "center", gap: 6 },
  balancePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    gap: 4,
  },
  balText:     { fontSize: 13, fontFamily: "Inter_700Bold" },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },

  userStrip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomWidth: 1,
    gap: 8,
  },
  username:    { fontSize: 11, fontFamily: "Inter_500Medium" },
  vipPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
    gap: 3,
  },
  vipTxt:      { fontSize: 9, fontFamily: "Inter_700Bold", color: "#000" },
  forYouPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  forYouTxt:   { fontSize: 10, fontFamily: "Inter_600SemiBold" },

  empty: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 10,
  },
  emptyTxt:    { fontSize: 14, fontFamily: "Inter_500Medium" },
});
