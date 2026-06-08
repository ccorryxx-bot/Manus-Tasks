import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColors";

interface GameCardProps {
  name: string;
  image: ImageSourcePropType;
  players: number;
  badge?: "New!" | "Hot!" | null;
  featured?: boolean;
  onPress?: () => void;
  cardWidth?: number;
  cardHeight?: number;
}

export function GameCard({
  name,
  image,
  players,
  badge,
  featured = false,
  onPress,
  cardWidth,
  cardHeight,
}: GameCardProps) {
  const colors = useColors();
  const [liked, setLiked] = useState(false);

  const defaultHeight = featured ? 200 : 160;
  const height = cardHeight ?? defaultHeight;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          width: cardWidth,
          height,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      <Image source={image} style={StyleSheet.absoluteFill} resizeMode="cover" />

      <View style={styles.overlay} />

      <TouchableOpacity
        style={styles.heartBtn}
        onPress={() => setLiked((v) => !v)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <MaterialCommunityIcons
          name={liked ? "heart" : "heart-outline"}
          size={featured ? 24 : 18}
          color={liked ? "#ff4488" : "rgba(255,255,255,0.9)"}
        />
      </TouchableOpacity>

      {badge && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor:
                badge === "Hot!" ? colors.badgeHot : colors.badgeNew,
            },
          ]}
        >
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}

      <View style={styles.bottom}>
        <View style={styles.playerBadge}>
          <View style={[styles.dot, { backgroundColor: colors.onlineGreen }]} />
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
    borderWidth: 2,
    backgroundColor: "#1e1050",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.12)",
  },
  heartBtn: {
    position: "absolute",
    top: 7,
    left: 7,
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  bottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 6,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  playerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  playerText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
});
