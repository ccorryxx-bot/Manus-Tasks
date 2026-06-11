import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import {
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
import { useColors } from "@/hooks/useColors";

const H_PAD = 6;
const COL_GAP = 10;
const ROW_GAP = 10;

type BadgeType = "New!" | "Hot!" | null;
type FilterId = "heart" | "ticket" | "news" | "fire";

const GAMES = [
  { id: "1", name: "African Buffalo", bgColors: ["#8B4513","#3d1a00"], players: 315, badge: null as BadgeType, featured: true },
  { id: "2", name: "Fury Link",        bgColors: ["#1a1a6b","#0a0a3d"], players: 307, badge: null as BadgeType },
  { id: "3", name: "African Legend",   bgColors: ["#6b3d00","#3d1a00"], players: 318, badge: null as BadgeType },
  { id: "4", name: "China Street",     bgColors: ["#8b0000","#3d0000"], players: 460, badge: "New!" as BadgeType },
  { id: "5", name: "Fire Link",        bgColors: ["#cc4400","#6b1a00"], players: 490, badge: "New!" as BadgeType },
  { id: "6", name: "Lucky KOI",        bgColors: ["#006b3d","#003d1a"], players: 380, badge: "New!" as BadgeType },
  { id: "7", name: "Prancing Pigs",    bgColors: ["#8b006b","#3d002d"], players: 472, badge: "New!" as BadgeType },
  { id: "8", name: "Platinum Streak",  bgColors: ["#2d2d6b","#1a1a3d"], players: 485, badge: "New!" as BadgeType },
  { id: "9", name: "Fire Link 2",      bgColors: ["#cc2200","#6b0000"], players: 312, badge: "Hot!" as BadgeType },
  { id: "10", name: "Lucky Pigs",      bgColors: ["#6b4400","#3d2200"], players: 228, badge: "New!" as BadgeType },
];

function BokehLayer() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[bokeh.circle, { top: "10%", left: "15%", width: 120, height: 120, backgroundColor: "rgba(120,40,220,0.28)" }]} />
      <View style={[bokeh.circle, { top: "35%", right: "5%", width: 90,  height: 90,  backgroundColor: "rgba(40,80,200,0.22)" }]} />
      <View style={[bokeh.circle, { top: "60%", left: "30%", width: 140, height: 140, backgroundColor: "rgba(90,20,180,0.2)" }]} />
      <View style={[bokeh.circle, { bottom: "10%", right: "20%", width: 80, height: 80, backgroundColor: "rgba(50,100,220,0.25)" }]} />
    </View>
  );
}
const bokeh = StyleSheet.create({ circle: { position: "absolute", borderRadius: 999 } });

export default function LobbyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const isLandscape = screenWidth > screenHeight;
  const SIDEBAR_LEFT  = isLandscape ? 0 : 72;
  const SIDEBAR_RIGHT = isLandscape ? 0 : 40;
  const contentWidth  = screenWidth - SIDEBAR_LEFT - SIDEBAR_RIGHT;
  const COLUMNS       = isLandscape ? 3 : 2;
  const cardWidth     = (contentWidth - H_PAD * 2 - COL_GAP * (COLUMNS - 1)) / COLUMNS;
  const heroHeight    = isLandscape ? 160 : 200;

  const [activeNav, setActiveNav]       = useState("ငွေထုတ်");
  const [activeFilter, setActiveFilter] = useState<FilterId>("fire");

  const featuredGame = GAMES.find((g) => g.featured)!;
  const gridGames    = GAMES.filter((g) => !g.featured);

  const pairs: (typeof gridGames)[] = [];
  for (let i = 0; i < gridGames.length; i += COLUMNS) pairs.push(gridGames.slice(i, i + COLUMNS));

  const renderPair = useCallback(
    ({ item }: { item: typeof gridGames }) => (
      <View style={[styles.pair, { gap: COL_GAP }]}>
        {item.map((game) => (
          <GameCard
            key={game.id}
            name={game.name}
            bgColors={game.bgColors}
            players={game.players}
            badge={game.badge}
            cardWidth={cardWidth}
            cardHeight={isLandscape ? 130 : 160}
          />
        ))}
        {item.length < COLUMNS &&
          Array.from({ length: COLUMNS - item.length }).map((_, i) => (
            <View key={`empty-${i}`} style={{ width: cardWidth }} />
          ))}
      </View>
    ),
    [cardWidth, isLandscape, COLUMNS],
  );

  const topPad    = Platform.OS === "web" ? 0 : insets.top;
  const bottomPad = Platform.OS === "web" ? 0 : insets.bottom;

  return (
    <View style={styles.root}>
      <StatusBar hidden style="light" />
      <LinearGradient colors={["#1a0a3d","#0d1b4b"]} start={{ x:0.3,y:0 }} end={{ x:0.7,y:1 }} style={StyleSheet.absoluteFill} />
      <BokehLayer />

      <View style={[styles.frame, { paddingTop: topPad, paddingBottom: bottomPad }]}>
        {!isLandscape && <LeftSidebar activeId={activeNav} onSelect={setActiveNav} />}

        <View style={styles.main}>
          <View style={styles.stickyTop}>
            <FilterIconRow activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            {!isLandscape && (
              <TouchableOpacity style={styles.categoryPill} activeOpacity={0.8}>
                <Text style={styles.categoryText}>သင်အတွက်</Text>
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={[{ key: "hero" }, ...pairs.map((p, i) => ({ key: String(i), pair: p }))]}
            keyExtractor={(item) => item.key}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scrollContent, { paddingHorizontal: H_PAD, gap: ROW_GAP }]}
            renderItem={({ item }) => {
              if (item.key === "hero") {
                return (
                  <GameCard
                    name={featuredGame.name}
                    bgColors={featuredGame.bgColors}
                    players={featuredGame.players}
                    badge={featuredGame.badge}
                    featured
                    cardWidth={contentWidth - H_PAD * 2}
                    cardHeight={heroHeight}
                  />
                );
              }
              return renderPair({ item: item.pair! });
            }}
          />
        </View>

        {!isLandscape && <RightSidebar onRefresh={() => {}} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root:        { flex: 1, backgroundColor: "#1a0a3d" },
  frame:       { flex: 1, flexDirection: "row" },
  main:        { flex: 1 },
  stickyTop:   { zIndex: 20 },
  scrollContent: { paddingTop: 4, paddingBottom: 12 },
  pair:        { flexDirection: "row" },
  categoryPill: {
    alignSelf: "center",
    borderWidth: 1.5,
    borderColor: "#4499ff",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 6,
    marginBottom: 8,
  },
  categoryText: { fontSize: 13, fontWeight: "600", color: "#4499ff" },
});
