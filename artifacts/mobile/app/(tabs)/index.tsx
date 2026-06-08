import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CasinoHeader } from "@/components/CasinoHeader";
import { GameCard } from "@/components/GameCard";
import { useColors } from "@/hooks/useColors";
import { supabase, type Game } from "@/lib/supabase";

const CATEGORIES = [
  { id: "all",      icon: "cards-playing",   label: "ကစားပွဲ" },
  { id: "slots",    icon: "slot-machine",     label: "Slots"   },
  { id: "live",     icon: "video",            label: "Live"    },
  { id: "jackpot",  icon: "treasure-chest",   label: "Jackpot" },
  { id: "new",      icon: "star-shooting",    label: "New"     },
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

function GameRow({ title, games, showFeatured }: { title: string; games: Game[]; showFeatured?: boolean }) {
  const colors = useColors();
  if (games.length === 0) return null;
  return (
    <View style={styles.rowSection}>
      <Text style={[styles.rowTitle, { color: colors.gold }]}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rowScroll}
      >
        {games.map((g, idx) => (
          <View key={g.id} style={{ marginRight: 10 }}>
            <GameCard game={g} featured={showFeatured && idx === 0} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const [games, setGames] = useState<Game[]>(STATIC_GAMES);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => { fetchGames(); }, []);

  async function fetchGames() {
    setLoading(true);
    try {
      const { data } = await supabase.from("games").select("*").order("sort_order");
      if (data && data.length > 0) setGames(data as Game[]);
    } catch { }
    finally { setLoading(false); }
  }

  const filtered = selectedCategory === "all"
    ? games
    : selectedCategory === "new"
      ? games.filter((g) => g.is_new)
      : games.filter((g) => g.category === selectedCategory);

  const hotGames  = filtered.filter((g) => g.is_hot);
  const newGames  = filtered.filter((g) => g.is_new);
  const liveGames = filtered.filter((g) => g.category === "live");
  const otherGames = filtered.filter((g) => !g.is_hot && !g.is_new);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <CasinoHeader />

      {/* Body: left sidebar + main scroll */}
      <View style={styles.body}>

        {/* Left category sidebar */}
        <View style={[styles.sidebar, { backgroundColor: colors.headerBg, borderRightColor: colors.border }]}>
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.sidebarBtn,
                  active && { backgroundColor: colors.purple + "33" },
                ]}
              >
                <View style={[styles.sidebarIconWrap, active && { backgroundColor: colors.purple }]}>
                  <MaterialCommunityIcons
                    name={cat.icon as any}
                    size={20}
                    color={active ? "#FFF" : colors.mutedForeground}
                  />
                </View>
                <Text
                  style={[
                    styles.sidebarLabel,
                    { color: active ? colors.gold : colors.mutedForeground },
                  ]}
                  numberOfLines={1}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Main game rows */}
        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={colors.gold} />
          </View>
        ) : (
          <ScrollView
            style={styles.mainScroll}
            contentContainerStyle={{
              paddingTop: 12,
              paddingBottom: Platform.OS === "web" ? 100 : 90,
            }}
            showsVerticalScrollIndicator={false}
          >
            {hotGames.length > 0 && (
              <GameRow title="🔥 Hot Games" games={hotGames} showFeatured />
            )}
            {newGames.length > 0 && (
              <GameRow title="✨ New Games" games={newGames} />
            )}
            {liveGames.length > 0 && (
              <GameRow title="🎥 Live Casino" games={liveGames} />
            )}
            {otherGames.length > 0 && (
              <GameRow title="🎮 All Games" games={otherGames} />
            )}
            {filtered.length === 0 && (
              <View style={styles.empty}>
                <MaterialCommunityIcons name="cards-playing-outline" size={48} color={colors.mutedForeground} />
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                  ဂိမ်းများ မတွေ့ပါ
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:       { flex: 1 },
  body:         { flex: 1, flexDirection: "row" },

  sidebar: {
    width: 68,
    borderRightWidth: 1,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: "center",
    gap: 4,
  },
  sidebarBtn: {
    width: "90%",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
    gap: 5,
  },
  sidebarIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sidebarLabel: {
    fontSize: 9,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },

  mainScroll:   { flex: 1 },
  loadingWrap:  { flex: 1, alignItems: "center", justifyContent: "center" },

  rowSection: {
    marginBottom: 20,
  },
  rowTitle: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    paddingHorizontal: 12,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  rowScroll: {
    paddingHorizontal: 12,
  },

  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
});
