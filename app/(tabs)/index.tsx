import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FilterIconRow } from "@/components/FilterIconRow";
import { GameCard } from "@/components/GameCard";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { supabase, Game } from "@/lib/supabase";
import { useColors } from "@/hooks/useColors";

const H_PAD = 6;
const COL_GAP = 10;
const ROW_GAP = 10;
const PAGE_SIZE = 20;

type FilterId = "heart" | "ticket" | "news" | "fire";

// Fallback colors per provider
const PROVIDER_COLORS: Record<string, string[]> = {
  pg:   ["#8B4513", "#3d1a00"],
  pp:   ["#1a1a6b", "#0a0a3d"],
  jili: ["#006b3d", "#003d1a"],
  jdb:  ["#6b3d00", "#3d1a00"],
};

function BokehLayer() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[b.c, { top:"10%", left:"15%", width:120, height:120, backgroundColor:"rgba(120,40,220,0.28)" }]} />
      <View style={[b.c, { top:"35%", right:"5%", width:90,  height:90,  backgroundColor:"rgba(40,80,200,0.22)" }]} />
      <View style={[b.c, { top:"60%", left:"30%", width:140, height:140, backgroundColor:"rgba(90,20,180,0.2)" }]} />
      <View style={[b.c, { bottom:"10%", right:"20%", width:80, height:80, backgroundColor:"rgba(50,100,220,0.25)" }]} />
    </View>
  );
}
const b = StyleSheet.create({ c: { position:"absolute", borderRadius:999 } });

export default function LobbyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width: W, height: H } = useWindowDimensions();

  const isLandscape    = W > H;
  const SIDEBAR_LEFT   = isLandscape ? 0 : 72;
  const SIDEBAR_RIGHT  = isLandscape ? 0 : 40;
  const contentWidth   = W - SIDEBAR_LEFT - SIDEBAR_RIGHT;
  const COLUMNS        = isLandscape ? 3 : 2;
  const cardWidth      = (contentWidth - H_PAD * 2 - COL_GAP * (COLUMNS - 1)) / COLUMNS;
  const heroHeight     = isLandscape ? 160 : 200;

  const [activeNav, setActiveNav]       = useState("ငွေထုတ်");
  const [activeFilter, setActiveFilter] = useState<FilterId>("fire");
  const [games, setGames]               = useState<Game[]>([]);
  const [page, setPage]                 = useState(0);
  const [loading, setLoading]           = useState(false);
  const [hasMore, setHasMore]           = useState(true);

  const fetchGames = useCallback(async (pageNum: number) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .order("sort_order", { ascending: true })
        .range(pageNum * PAGE_SIZE, (pageNum + 1) * PAGE_SIZE - 1);

      if (error) throw error;
      if (!data || data.length < PAGE_SIZE) setHasMore(false);
      setGames((prev) => pageNum === 0 ? data ?? [] : [...prev, ...(data ?? [])]);
      setPage(pageNum + 1);
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  useEffect(() => { fetchGames(0); }, []);

  const featuredGame = games[0];
  const gridGames    = games.slice(1);

  const pairs: Game[][] = [];
  for (let i = 0; i < gridGames.length; i += COLUMNS)
    pairs.push(gridGames.slice(i, i + COLUMNS));

  const renderPair = useCallback(
    ({ item }: { item: Game[] }) => (
      <View style={[styles.pair, { gap: COL_GAP }]}>
        {item.map((game) => (
          <GameCard
            key={game.id}
            name={game.name}
            imageUri={game.thumbnail_url}
            bgColors={PROVIDER_COLORS[game.provider] ?? ["#2d1b6b","#1a0a3d"]}
            players={game.player_count}
            badge={game.is_hot ? "Hot!" : game.is_new ? "New!" : null}
            cardWidth={cardWidth}
            cardHeight={isLandscape ? 130 : 160}
          />
        ))}
        {item.length < COLUMNS &&
          Array.from({ length: COLUMNS - item.length }).map((_, i) => (
            <View key={`e${i}`} style={{ width: cardWidth }} />
          ))}
      </View>
    ),
    [cardWidth, isLandscape, COLUMNS],
  );

  const topPad    = Platform.OS === "web" ? 0 : insets.top;
  const bottomPad = Platform.OS === "web" ? 0 : insets.bottom;

  const listData = [
    { key: "hero" },
    ...pairs.map((p, i) => ({ key: String(i), pair: p })),
  ];

  return (
    <View style={styles.root}>
      <StatusBar hidden style="light" />
      <LinearGradient colors={["#1a0a3d","#0d1b4b"]} start={{x:0.3,y:0}} end={{x:0.7,y:1}} style={StyleSheet.absoluteFill} />
      <BokehLayer />

      <View style={[styles.frame, { paddingTop: topPad, paddingBottom: bottomPad }]}>
        {!isLandscape && <LeftSidebar activeId={activeNav} onSelect={setActiveNav} />}

        <View style={styles.main}>
          <View style={styles.stickyTop}>
            <FilterIconRow activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            {!isLandscape && (
              <TouchableOpacity style={styles.pill} activeOpacity={0.8}>
                <Text style={styles.pillText}>သင်အတွက်</Text>
              </TouchableOpacity>
            )}
          </View>

          {games.length === 0 && loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#9933ff" />
            </View>
          ) : (
            <FlatList
              data={listData}
              keyExtractor={(item) => item.key}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[styles.scroll, { paddingHorizontal: H_PAD, gap: ROW_GAP }]}
              onEndReached={() => fetchGames(page)}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                loading ? <ActivityIndicator color="#9933ff" style={{ marginVertical: 12 }} /> : null
              }
              renderItem={({ item }) => {
                if (item.key === "hero") {
                  if (!featuredGame) return null;
                  return (
                    <GameCard
                      name={featuredGame.name}
                      imageUri={featuredGame.thumbnail_url}
                      bgColors={PROVIDER_COLORS[featuredGame.provider] ?? ["#2d1b6b","#1a0a3d"]}
                      players={featuredGame.player_count}
                      badge={featuredGame.is_hot ? "Hot!" : featuredGame.is_new ? "New!" : null}
                      featured
                      cardWidth={contentWidth - H_PAD * 2}
                      cardHeight={heroHeight}
                    />
                  );
                }
                return renderPair({ item: item.pair! });
              }}
            />
          )}
        </View>

        {!isLandscape && <RightSidebar onRefresh={() => { setHasMore(true); fetchGames(0); }} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: "#1a0a3d" },
  frame:  { flex: 1, flexDirection: "row" },
  main:   { flex: 1 },
  stickyTop: { zIndex: 20 },
  scroll: { paddingTop: 4, paddingBottom: 12 },
  pair:   { flexDirection: "row" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  pill: {
    alignSelf: "center",
    borderWidth: 1.5,
    borderColor: "#4499ff",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 6,
    marginBottom: 8,
  },
  pillText: { fontSize: 13, fontWeight: "600", color: "#4499ff" },
});
