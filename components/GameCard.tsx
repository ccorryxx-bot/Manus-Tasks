import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Image, StyleSheet, Text,
  TouchableOpacity, View,
} from "react-native";
import { useColors } from "@/hooks/useColors";

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
  const colors = useColors();
  const height = cardHeight ?? (featured ? 190 : 130);

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth, height, borderColor: "rgba(255,255,255,0.12)" }]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      {/* Background image or gradient */}
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={StyleSheet.absoluteFill} resizeMode="cover"/>
      ) : (
        <LinearGradient
          colors={bgColors as [string,string]}
          style={StyleSheet.absoluteFill}
          start={{ x:0, y:0 }} end={{ x:1, y:1 }}
        />
      )}

      {/* Glassmorphism overlay */}
      <View style={styles.glassOverlay} />

      {/* Bottom glass bar */}
      <View style={styles.glassBottom}>
        <View style={styles.playerRow}>
          <View style={styles.dot} />
          <Text style={styles.playerText}>{players}</Text>
        </View>
      </View>

      {/* Heart */}
      <TouchableOpacity
        style={styles.heartBtn}
        onPress={onLike}
        hitSlop={{ top:8, bottom:8, left:8, right:8 }}
      >
        <MaterialCommunityIcons
          name={liked ? "heart" : "heart-outline"}
          size={featured ? 22 : 16}
          color={liked ? "#ff4488" : "rgba(255,255,255,0.9)"}
        />
      </TouchableOpacity>

      {/* Badge */}
      {badge && (
        <View style={[styles.badge, { backgroundColor: badge==="Hot!" ? "#ff6600" : "#00cc44" }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}

      {/* Game name */}
      <View style={[styles.nameWrap, featured && styles.nameWrapFeatured]}>
        <Text style={[styles.gameName, featured && styles.gameNameFeatured]} numberOfLines={2}>
          {name.toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    backgroundColor: "#1e1050",
  },
  // Glassmorphism: subtle white overlay + blur simulation
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  glassBottom: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    height: 28,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    justifyContent: "flex-end",
  },
  heartBtn: { position:"absolute", top:6, left:6, zIndex:10 },
  badge: {
    position:"absolute", top:5, right:5,
    paddingHorizontal:5, paddingVertical:2, borderRadius:5,
  },
  badgeText: { color:"#fff", fontSize:9, fontWeight:"700" },
  nameWrap: { position:"absolute", bottom:30, left:7, right:7 },
  nameWrapFeatured: { bottom:34, left:12, right:60 },
  gameName: { color:"rgba(255,255,255,0.55)", fontSize:9, fontWeight:"600" },
  gameNameFeatured: {
    color:"#fff", fontSize:20, fontWeight:"900",
    letterSpacing:1.5, lineHeight:24,
    textShadowColor:"rgba(0,0,0,0.9)",
    textShadowOffset:{width:1,height:2},
    textShadowRadius:6,
  },
  playerRow: { flexDirection:"row", alignItems:"center", gap:4 },
  dot: { width:6, height:6, borderRadius:3, backgroundColor:"#00cc44" },
  playerText: { color:"#fff", fontSize:10, fontWeight:"700" },
});
