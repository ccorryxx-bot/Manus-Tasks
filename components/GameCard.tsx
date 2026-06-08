import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColors";

const { width } = Dimensions.get("window");

interface GameCardProps {
  name: string;
  image: ImageSourcePropType;
  players: number;
  badge?: "New" | "Hot" | null;
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

  const height = cardHeight ?? (featured ? 180 : 140);

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
      activeOpacity={0.85}
    >
      <Image source={image} style={styles.image} resizeMode="cover" />

      <View style={styles.overlay} />

      {badge && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor:
                badge === "Hot" ? colors.badgeHot : colors.badgeNew,
            },
          ]}
        >
          <Text style={styles.badgeText}>{badge}!</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.heartBtn}
        onPress={() => setLiked((v) => !v)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <MaterialCommunityIcons
          name={liked ? "heart" : "heart-outline"}
          size={14}
          color={liked ? colors.badgeHot : "rgba(255,255,255,0.7)"}
        />
      </TouchableOpacity>

      <View style={styles.bottom}>
        <Text style={styles.gameName} numberOfLines={1}>
          {name}
        </Text>
        <View
          style={[
            styles.playerBadge,
            { backgroundColor: colors.playerCount },
          ]}
        >
          <View
            style={[styles.dot, { backgroundColor: colors.onlineGreen }]}
          />
          <Text style={styles.playerText}>{players}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 0.5,
    backgroundColor: "#131D3C",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  badge: {
    position: "absolute",
    top: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontFamily: "Inter_700Bold",
  },
  heartBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  bottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  gameName: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    flex: 1,
    marginRight: 4,
  },
  playerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 8,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  playerText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Inter_500Medium",
  },
});
