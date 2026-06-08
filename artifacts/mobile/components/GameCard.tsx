import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { Game } from "@/lib/supabase";

const GAME_IMAGES: Record<string, any> = {
  "African Buffalo": require("../assets/images/game-buffalo.png"),
  "Lucky KOI": require("../assets/images/game-koi.png"),
  "Dragon Tiger": require("../assets/images/game-dragon.png"),
};

const GAME_COLORS: Record<string, string> = {
  "African Buffalo": "#1a4a1a",
  "Fire Link": "#7a1a00",
  "Lucky KOI": "#1a1a5e",
  "Prancing Pigs": "#4a1a4a",
  "Luxury Line": "#1a3a5e",
  "Treasure Hunt": "#3a2a0a",
  "Wild Coins": "#0a3a1a",
  "Fortune Cat": "#3a0a3a",
  "Dragon Tiger": "#5e0000",
  "Baccarat Classic": "#1a2a3a",
  "Mega Jackpot": "#3a2a00",
  "Gold Rush": "#2a1a00",
};

const GAME_ACCENT: Record<string, string> = {
  "African Buffalo": "#2d7a2d",
  "Fire Link": "#cc3300",
  "Lucky KOI": "#cc0000",
  "Prancing Pigs": "#8b2be2",
  "Luxury Line": "#2a6aaa",
  "Treasure Hunt": "#cc8800",
  "Wild Coins": "#1a7a3a",
  "Fortune Cat": "#882288",
  "Dragon Tiger": "#cc0033",
  "Baccarat Classic": "#2a4a6a",
  "Mega Jackpot": "#aa7700",
  "Gold Rush": "#996600",
};

type Props = {
  game: Game;
  featured?: boolean;
  onPress?: (game: Game) => void;
};

export function GameCard({ game, featured = false, onPress }: Props) {
  const colors = useColors();
  const [liked, setLiked] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const bg = GAME_COLORS[game.name] ?? "#1A1F50";
  const accent = GAME_ACCENT[game.name] ?? "#252D70";

  const initials = game.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  function handlePressIn() {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true, speed: 30 }).start();
  }
  function handlePressOut() {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 20 }).start();
  }

  const cardW = featured ? 180 : 130;
  const cardH = featured ? 220 : 160;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={() => onPress?.(game)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[
          styles.card,
          {
            width: cardW,
            height: cardH,
            backgroundColor: bg,
            borderColor: featured ? colors.gold + "60" : colors.border,
            borderWidth: featured ? 1.5 : 1,
          },
        ]}
      >
        {/* Background image or gradient */}
        {GAME_IMAGES[game.name] ? (
          <Image
            source={GAME_IMAGES[game.name]}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.colorBg, { backgroundColor: accent + "55" }]} />
        )}

        {/* Dark overlay at bottom for text readability */}
        <View style={styles.bottomOverlay} />

        {/* Initials for cards without images */}
        {!GAME_IMAGES[game.name] && (
          <Text style={[styles.initials, featured && styles.initialsLarge]}>{initials}</Text>
        )}

        {/* Hot/New badge — top left */}
        {(game.is_new || game.is_hot) && (
          <View style={[styles.badge, { backgroundColor: game.is_new ? "#F97316" : "#EF4444" }]}>
            <Text style={styles.badgeText}>{game.is_new ? "New!" : "Hot"}</Text>
          </View>
        )}

        {/* Player count — top right */}
        <View style={styles.playerBadge}>
          <View style={styles.greenDot} />
          <Text style={styles.playerCount}>{game.player_count}</Text>
        </View>

        {/* Game name — bottom */}
        <View style={styles.nameRow}>
          <Text style={[styles.gameName, featured && styles.gameNameLarge]} numberOfLines={2}>
            {game.name}
          </Text>
        </View>

        {/* Like button */}
        <TouchableOpacity
          style={styles.likeBtn}
          onPress={(e) => { e.stopPropagation?.(); setLiked(!liked); }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialCommunityIcons
            name={liked ? "heart" : "heart-outline"}
            size={featured ? 20 : 16}
            color={liked ? "#EF4444" : "rgba(255,255,255,0.7)"}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  colorBg: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  initials: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    color: "rgba(255,255,255,0.25)",
  },
  initialsLarge: {
    fontSize: 44,
  },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 9,
    color: "#FFF",
    fontFamily: "Inter_700Bold",
  },
  playerBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
  },
  greenDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#22C55E",
  },
  playerCount: {
    fontSize: 9,
    color: "#FFF",
    fontFamily: "Inter_600SemiBold",
  },
  nameRow: {
    position: "absolute",
    bottom: 24,
    left: 8,
    right: 8,
  },
  gameName: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.9)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  gameNameLarge: {
    fontSize: 15,
  },
  likeBtn: {
    position: "absolute",
    bottom: 6,
    right: 8,
  },
});
