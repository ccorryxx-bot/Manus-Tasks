import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { Game } from "@/lib/supabase";

const GAME_COLORS: Record<string, string[]> = {
  "African Buffalo": ["#1a4a1a", "#2d7a2d"],
  "Fire Link": ["#7a1a00", "#cc3300"],
  "Lucky KOI": ["#1a1a5e", "#cc0000"],
  "Prancing Pigs": ["#4a1a4a", "#8b2be2"],
  "Luxury Line": ["#1a3a5e", "#2a6aaa"],
  "Treasure Hunt": ["#3a2a0a", "#cc8800"],
  "Wild Coins": ["#0a3a1a", "#1a7a3a"],
  "Fortune Cat": ["#3a0a3a", "#882288"],
  "Dragon Tiger": ["#5e0000", "#cc0033"],
  "Baccarat Classic": ["#1a2a3a", "#2a4a6a"],
  "Mega Jackpot": ["#3a2a00", "#aa7700"],
  "Gold Rush": ["#2a1a00", "#996600"],
};

function getGameColors(name: string): string[] {
  return GAME_COLORS[name] ?? ["#1A1F50", "#252D70"];
}

type Props = {
  game: Game;
  onPress?: (game: Game) => void;
};

export function GameCard({ game, onPress }: Props) {
  const colors = useColors();
  const [liked, setLiked] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const [bgColors] = useState(() => getGameColors(game.name));

  function handlePressIn() {
    Animated.timing(scaleAnim, {
      toValue: 0.96,
      duration: 80,
      useNativeDriver: true,
    }).start();
  }

  function handlePressOut() {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }

  const initials = game.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={() => onPress?.(game)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        {/* Thumbnail */}
        <View style={[styles.thumbnail, { backgroundColor: bgColors[0] }]}>
          {/* Gradient overlay simulation */}
          <View style={[styles.gradientOverlay, { backgroundColor: bgColors[1] + "88" }]} />

          {/* Game name initials */}
          <Text style={styles.initials}>{initials}</Text>
          <Text style={styles.gameNameInCard} numberOfLines={2}>
            {game.name}
          </Text>

          {/* Player count badge */}
          <View style={styles.playerBadge}>
            <View style={styles.greenDot} />
            <Text style={styles.playerCount}>{game.player_count}</Text>
          </View>

          {/* New badge */}
          {game.is_new && (
            <View style={styles.newBadge}>
              <Text style={styles.newText}>New!</Text>
            </View>
          )}

          {/* Hot badge */}
          {game.is_hot && !game.is_new && (
            <View style={[styles.newBadge, { backgroundColor: "#EF4444" }]}>
              <Text style={styles.newText}>Hot</Text>
            </View>
          )}
        </View>

        {/* Like button */}
        <TouchableOpacity
          style={styles.likeBtn}
          onPress={() => setLiked(!liked)}
        >
          <MaterialCommunityIcons
            name={liked ? "heart" : "heart-outline"}
            size={16}
            color={liked ? "#EF4444" : colors.mutedForeground}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
  },
  thumbnail: {
    width: "100%",
    aspectRatio: 3 / 4,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  initials: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: "rgba(255,255,255,0.3)",
    position: "absolute",
    top: "30%",
  },
  gameNameInCard: {
    position: "absolute",
    bottom: 24,
    left: 6,
    right: 6,
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  playerBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 3,
  },
  greenDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#22C55E",
  },
  playerCount: {
    fontSize: 9,
    color: "#FFFFFF",
    fontFamily: "Inter_600SemiBold",
  },
  newBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "#F97316",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  newText: {
    fontSize: 9,
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
  },
  likeBtn: {
    position: "absolute",
    bottom: 6,
    right: 6,
    padding: 2,
  },
});
