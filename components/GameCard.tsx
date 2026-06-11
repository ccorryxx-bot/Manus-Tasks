import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";

interface GameCardProps {
  name: string;
  imageUri: string;
  players: number;
  badge?: "New!" | "Hot!" | null;
  featured?: boolean;
  onPress?: () => void;
  cardWidth?: number;
  cardHeight?: number;
}

export function GameCard({
  name,
  imageUri,
  players,
  badge,
  featured = false,
  onPress,
  cardWidth,
  cardHeight,
}: GameCardProps) {
  const colors = useColors();
  const [liked, setLiked] = useState(false);
  const height = cardHeight ?? (featured ? 200 : 160);

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth, height, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      <Image
        source={{ uri: imageUri }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      <View style={styles.overlay} />

      <TouchableOpacity
        style={styles.heartBtn}
        onPress={() => setLiked((v) => !v)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <MaterialCommunityIcons
          name={liked ? "heart" : "heart-outline"}
          size={featured ? 22 : 18}
          color={liked ? "#ff4488" : "rgba(255,255,255,0.95)"}
        />
      </TouchableOpacity>

      {badge && (
        <View style={[styles.badge, { backgroundColor: badge === "Hot!" ? "#ff6600" : "#00cc44" }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}

      {featured && (
        <View style={styles.featuredNameWrap}>
          <Text style={styles.featuredName} numberOfLines={2}>
            {name.toUpperCase()}
          </Text>
        </View>
      )}

      <View style={styles.bottom}>
        <View style={styles.playerBadge}>
          <View style={[styles.dot, { backgroundColor: "#00cc44" }]} />
          <Text style={styles.playerText}>{players}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1.5,
    backgroundColor: "#1e1050",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  heartBtn: { position: "absolute", top: 7, left: 7 },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  featuredNameWrap: {
    position: "absolute",
    bottom: 28,
    left: 10,
    right: 60,
  },
  featuredName: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 1.5,
    textShadowColor: "rgba(0,0,0,0.9)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 6,
    lineHeight: 24,
  },
  bottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.38)",
  },
  playerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  playerText: { color: "#fff", fontSize: 11, fontWeight: "700" },
});
