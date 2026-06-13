import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image, StyleSheet, Text,
  TouchableOpacity, View,
} from "react-native";

interface GameCardProps {
  name: string;
  imageUri?: string;
  bgColors?: string[];
  players: number;
  badge?: "New!" | "Hot!" | null;
  featured?: boolean;
  liked?: boolean;
  onLike?: () => void;
  onPress?: () => void;
  cardWidth?: number;
  cardHeight?: number;
}

export function GameCard({
  name, imageUri, bgColors = ["#2d1b6b","#1a0a3d"],
  players, badge, featured = false,
  liked = false, onLike, onPress, cardWidth, cardHeight,
}: GameCardProps) {
  const W = cardWidth  ?? 160;
  const H = cardHeight ?? W; // Square by default

  const imgSize = Math.max(W, H) * 1.2;

  return (
    <TouchableOpacity
      style={[styles.card, {
        width: W,
        height: H,
        borderRadius: featured ? 16 : 18,
      }]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      {/* Image with 90deg rotation */}
      <View style={[StyleSheet.absoluteFill, {
        overflow: "hidden",
        borderRadius: featured ? 16 : 18,
      }]}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{
              width: imgSize,
              height: imgSize,
              position: "absolute",
              top: -(imgSize - H) / 2,
              left: -(imgSize - W) / 2,
              transform: [{ rotate: "90deg" }],
            }}
            resizeMode="cover"
          />
        ) : (
          <LinearGradient
            colors={bgColors as [string,string]}
            style={StyleSheet.absoluteFill}
            start={{ x:0,y:0 }} end={{ x:1,y:1 }}
          />
        )}
      </View>

      {/* NO dark overlay — clean image */}

      {/* Heart */}
      <TouchableOpacity
        style={styles.heartBtn}
        onPress={onLike}
        hitSlop={{ top:8,bottom:8,left:8,right:8 }}
      >
        <MaterialCommunityIcons
          name={liked ? "heart" : "heart-outline"}
          size={featured ? 22 : 18}
          color={liked ? "#ff4488" : "rgba(255,255,255,0.95)"}
        />
      </TouchableOpacity>

      {/* Badge */}
      {badge && (
        <View style={[styles.badge, {
          backgroundColor: badge==="Hot!" ? "#ff6600" : "#00cc44"
        }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}

      {/* Featured name */}
      {featured && (
        <View style={styles.featuredName}>
          <Text style={styles.featuredNameText} numberOfLines={1}>
            {name.toUpperCase()}
          </Text>
        </View>
      )}

      {/* Player count — small pill bottom right */}
      <View style={styles.playerPill}>
        <View style={styles.dot} />
        <Text style={styles.playerText}>{players}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "#0d0a2e",
  },
  heartBtn: {
    position: "absolute", top: 6, left: 6, zIndex: 10,
  },
  badge: {
    position: "absolute", top: 5, right: 5,
    paddingHorizontal: 5, paddingVertical: 2, borderRadius: 5,
    zIndex: 10,
  },
  badgeText: { color:"#fff", fontSize:9, fontWeight:"700" },
  featuredName: {
    position: "absolute", bottom: 28, left: 10, right: 10,
  },
  featuredNameText: {
    color: "#fff", fontSize: 20, fontWeight: "900",
    textShadowColor: "rgba(0,0,0,0.9)",
    textShadowOffset: { width:1, height:2 },
    textShadowRadius: 6,
    letterSpacing: 1.2,
  },
  playerPill: {
    position: "absolute", bottom: 5, right: 6,
    flexDirection: "row", alignItems: "center", gap: 3,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 8, zIndex: 10,
    transform: [{ rotate: "90deg" }],
  },
  dot: { width:5, height:5, borderRadius:3, backgroundColor:"#00cc44" },
  playerText: { color:"#fff", fontSize:10, fontWeight:"700" },
});
