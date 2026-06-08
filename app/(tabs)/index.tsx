import React, { useState, useCallback } from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { CasinoHeader } from "@/components/CasinoHeader";
import { GameCard } from "@/components/GameCard";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightFilter } from "@/components/RightFilter";
import { useColors } from "@/hooks/useColors";

const SIDEBAR_WIDTH = 62;
const RIGHT_FILTER_WIDTH = 62;
const CARD_GAP = 6;

type BadgeType = "New" | "Hot" | null;

const GAMES = [
  {
    id: "1",
    name: "African Buffalo",
    image: require("@/assets/images/game-african-buffalo.png"),
    players: 315,
    badge: null as BadgeType,
    featured: true,
  },
  {
    id: "2",
    name: "Fury Link",
    image: require("@/assets/images/game-fury-link.png"),
    players: 307,
    badge: null as BadgeType,
  },
  {
    id: "3",
    name: "African Legend",
    image: require("@/assets/images/game-african-buffalo.png"),
    players: 318,
    badge: null as BadgeType,
  },
  {
    id: "4",
    name: "China Street",
    image: require("@/assets/images/game-china-street.png"),
    players: 460,
    badge: "New" as BadgeType,
  },
  {
    id: "5",
    name: "Fire Link",
    image: require("@/assets/images/game-fire-link.png"),
    players: 490,
    badge: "Hot" as BadgeType,
  },
  {
    id: "6",
    name: "Lucky KOI",
    image: require("@/assets/images/game-lucky-koi.png"),
    players: 380,
    badge: "New" as BadgeType,
  },
  {
    id: "7",
    name: "Prancing Pigs",
    image: require("@/assets/images/game-prancing-pigs.png"),
    players: 472,
    badge: "New" as BadgeType,
  },
  {
    id: "8",
    name: "Platinum Streak",
    image: require("@/assets/images/game-china-street.png"),
    players: 485,
    badge: "New" as BadgeType,
  },
  {
    id: "9",
    name: "Fire Link 2",
    image: require("@/assets/images/game-fire-link.png"),
    players: 312,
    badge: "Hot" as BadgeType,
  },
  {
    id: "10",
    name: "Lucky Pigs",
    image: require("@/assets/images/game-prancing-pigs.png"),
    players: 228,
    badge: "New" as BadgeType,
  },
];

const CATEGORY_CHIPS = ["All", "Popular", "New", "Hot", "VIP"];

export default function LobbyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const isLandscape = screenWidth > screenHeight;
  const MAIN_WIDTH = screenWidth - SIDEBAR_WIDTH - RIGHT_FILTER_WIDTH;
  const COLUMNS = isLandscape ? 3 : 2;
  const CARD_WIDTH = (MAIN_WIDTH - CARD_GAP * (COLUMNS + 1)) / COLUMNS;
  const FEATURED_HEIGHT = isLandscape ? screenHeight * 0.52 : 180;
  const CARD_HEIGHT = isLandscape ? screenHeight * 0.42 : 140;

  const [activeNav, setActiveNav] = useState("home");
  const [activeFilter, setActiveFilter] = useState("slots");
  const [activeChip, setActiveChip] = useState("All");
  const [balance] = useState(10000);

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const featuredGame = GAMES.find((g) => g.featured);
  const gridGames = GAMES.filter((g) => !g.featured);

  const handleNavSelect = useCallback((id: string) => {
    Haptics.selectionAsync();
    setActiveNav(id);
  }, []);

  const handleFilterSelect = useCallback((id: string) => {
    Haptics.selectionAsync();
    setActiveFilter(id);
  }, []);

  const handleChipSelect = useCallback((chip: string) => {
    Haptics.selectionAsync();
    setActiveChip(chip);
  }, []);

  const handleGamePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const pairedGames: (typeof gridGames)[number][][] = [];
  for (let i = 0; i < gridGames.length; i += COLUMNS) {
    pairedGames.push(gridGames.slice(i, i + COLUMNS));
  }

  const renderGameRow = useCallback(
    ({ item }: { item: (typeof gridGames)[number][] }) => (
      <View style={styles.gameRow}>
        {item.map((game) => (
          <GameCard
            key={game.id}
            name={game.name}
            image={game.image}
            players={game.players}
            badge={game.badge}
            cardWidth={CARD_WIDTH}
            cardHeight={CARD_HEIGHT}
            onPress={handleGamePress}
          />
        ))}
        {item.length < COLUMNS &&
          Array.from({ length: COLUMNS - item.length }).map((_, i) => (
            <View key={`empty-${i}`} style={{ width: CARD_WIDTH }} />
          ))}
      </View>
    ),
    [CARD_WIDTH, CARD_HEIGHT, COLUMNS, handleGamePress],
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <CasinoHeader
        balance={balance}
        onNotificationPress={() => {}}
        onProfilePress={() => {}}
      />

      <View style={styles.body}>
        <LeftSidebar activeId={activeNav} onSelect={handleNavSelect} />

        <View style={styles.mainContent}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: bottomPad + 8 },
            ]}
          >
            {featuredGame && (
              <View style={[styles.featuredWrapper, { paddingHorizontal: CARD_GAP }]}>
                <GameCard
                  name={featuredGame.name}
                  image={featuredGame.image}
                  players={featuredGame.players}
                  badge={featuredGame.badge}
                  featured
                  cardWidth={MAIN_WIDTH - CARD_GAP * 2}
                  cardHeight={FEATURED_HEIGHT}
                  onPress={handleGamePress}
                />
              </View>
            )}

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipsRow}
              contentContainerStyle={[
                styles.chipsContent,
                { paddingHorizontal: CARD_GAP },
              ]}
            >
              {CATEGORY_CHIPS.map((chip) => {
                const isActive = activeChip === chip;
                return (
                  <TouchableOpacity
                    key={chip}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isActive
                          ? colors.accent
                          : colors.surface,
                        borderColor: isActive ? colors.accent : colors.border,
                      },
                    ]}
                    onPress={() => handleChipSelect(chip)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: isActive ? "#fff" : colors.mutedForeground,
                          fontFamily: isActive
                            ? "Inter_600SemiBold"
                            : "Inter_400Regular",
                        },
                      ]}
                    >
                      {chip}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <FlatList
              data={pairedGames}
              renderItem={renderGameRow}
              keyExtractor={(_, i) => String(i)}
              scrollEnabled={false}
              contentContainerStyle={[
                styles.gridContent,
                { paddingHorizontal: CARD_GAP },
              ]}
            />
          </ScrollView>
        </View>

        <RightFilter
          activeFilter={activeFilter}
          onFilterSelect={handleFilterSelect}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  body: {
    flex: 1,
    flexDirection: "row",
  },
  mainContent: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 6,
  },
  featuredWrapper: {
    marginBottom: 8,
  },
  chipsRow: {
    marginBottom: 8,
  },
  chipsContent: {
    gap: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
  },
  gridContent: {
    gap: CARD_GAP,
  },
  gameRow: {
    flexDirection: "row",
    gap: CARD_GAP,
  },
});
