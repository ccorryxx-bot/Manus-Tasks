import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
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
  { id: "all", label: "ကစားပွဲ", icon: "cards-playing" },
  { id: "slots", label: "Slots", icon: "slot-machine" },
  { id: "live", label: "Live", icon: "video" },
  { id: "jackpot", label: "Jackpot", icon: "treasure-chest" },
  { id: "new", label: "New", icon: "star-shooting" },
];

const STATIC_GAMES: Game[] = [
  { id: "1", name: "African Buffalo", provider: "PG Soft", category: "slots", thumbnail_url: null, player_count: 313, is_new: false, is_hot: true, sort_order: 1, created_at: "" },
  { id: "2", name: "Fire Link", provider: "L&W", category: "slots", thumbnail_url: null, player_count: 490, is_new: false, is_hot: true, sort_order: 2, created_at: "" },
  { id: "3", name: "Lucky KOI", provider: "PG Soft", category: "slots", thumbnail_url: null, player_count: 380, is_new: true, is_hot: false, sort_order: 3, created_at: "" },
  { id: "4", name: "Prancing Pigs", provider: "PG Soft", category: "slots", thumbnail_url: null, player_count: 472, is_new: true, is_hot: false, sort_order: 4, created_at: "" },
  { id: "5", name: "Luxury Line", provider: "Bally", category: "slots", thumbnail_url: null, player_count: 307, is_new: false, is_hot: true, sort_order: 5, created_at: "" },
  { id: "6", name: "Treasure Hunt", provider: "IGT", category: "slots", thumbnail_url: null, player_count: 460, is_new: true, is_hot: false, sort_order: 6, created_at: "" },
  { id: "7", name: "Wild Coins", provider: "Aristocrat", category: "slots", thumbnail_url: null, player_count: 428, is_new: true, is_hot: false, sort_order: 7, created_at: "" },
  { id: "8", name: "Fortune Cat", provider: "PG Soft", category: "slots", thumbnail_url: null, player_count: 485, is_new: true, is_hot: false, sort_order: 8, created_at: "" },
  { id: "9", name: "Dragon Tiger", provider: "Evolution", category: "live", thumbnail_url: null, player_count: 892, is_new: false, is_hot: true, sort_order: 9, created_at: "" },
  { id: "10", name: "Baccarat Classic", provider: "Evolution", category: "live", thumbnail_url: null, player_count: 1240, is_new: false, is_hot: true, sort_order: 10, created_at: "" },
  { id: "11", name: "Mega Jackpot", provider: "IGT", category: "jackpot", thumbnail_url: null, player_count: 234, is_new: false, is_hot: true, sort_order: 11, created_at: "" },
  { id: "12", name: "Gold Rush", provider: "Aristocrat", category: "jackpot", thumbnail_url: null, player_count: 167, is_new: true, is_hot: false, sort_order: 12, created_at: "" },
];

export default function HomeScreen() {
  const colors = useColors();
  const [games, setGames] = useState<Game[]>(STATIC_GAMES);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchGames();
  }, []);

  async function fetchGames() {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("games")
        .select("*")
        .order("sort_order");
      if (data && data.length > 0) setGames(data as Game[]);
    } catch {
      // use static fallback
    } finally {
      setLoading(false);
    }
  }

  const filtered = selectedCategory === "all"
    ? games
    : selectedCategory === "new"
    ? games.filter((g) => g.is_new)
    : games.filter((g) => g.category === selectedCategory);

  const numColumns = 3;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <CasinoHeader />

      {/* Category filter */}
      <View style={[styles.categoryBar, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategory(cat.id)}
              style={[
                styles.catBtn,
                selectedCategory === cat.id && { backgroundColor: colors.purple },
                { borderColor: selectedCategory === cat.id ? colors.purple : colors.border },
              ]}
            >
              <MaterialCommunityIcons
                name={cat.icon as any}
                size={14}
                color={selectedCategory === cat.id ? "#FFF" : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.catLabel,
                  { color: selectedCategory === cat.id ? "#FFF" : colors.mutedForeground },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Games Grid */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.gold} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={[
            styles.gridContent,
            { paddingBottom: Platform.OS === "web" ? 100 : 90 },
          ]}
          columnWrapperStyle={styles.row}
          scrollEnabled={filtered.length > 0}
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialCommunityIcons name="cards-playing-outline" size={48} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                ဂိမ်းများ မတွေ့ပါ
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <GameCard game={item} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  categoryBar: {
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  categoryScroll: {
    paddingHorizontal: 12,
    gap: 8,
  },
  catBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    gap: 5,
  },
  catLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  gridContent: {
    padding: 10,
  },
  row: {
    gap: 8,
    marginBottom: 8,
  },
  cardWrapper: {
    flex: 1,
    maxWidth: "33%",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
