import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";

export type FilterId = "pp" | "jili" | "fishing" | "favorite";

const PP_LOGO   = "https://ik.imagekit.io/tdpebgueq/Home%20Page%20_icons_linces%20logo/a04d3bed-f475-42eb-9f35-4f9802068315.png?tr=f-auto,w-60,h-60";
const JILI_LOGO = "https://ik.imagekit.io/tdpebgueq/Home%20Page%20_icons_linces%20logo/40_N_JILI_LOGO.avif?tr=f-auto,w-60,h-60";

// Simple fish using basic shapes
function FishSvg({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path
        d="M8 12 C8 8 12 5 17 5 L21 5 L21 9 C21 14 17 17 12 17 C10 17 8 15 8 12 Z"
        fill={color}
        opacity={0.9}
      />
      <Path d="M3 8 L8 12 L3 16 Z" fill={color} />
      <Circle cx={16} cy={9} r={1.2} fill="rgba(0,0,0,0.5)" />
    </Svg>
  );
}

function HeartSvg({ color, filled }: { color: string; filled: boolean }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path
        d="M12 20 C12 20 3.5 14 3.5 8.5 C3.5 6 5.5 4 8 4 C9.8 4 11.3 5 12 6.5 C12.7 5 14.2 4 16 4 C18.5 4 20.5 6 20.5 8.5 C20.5 14 12 20 12 20 Z"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth={1.5}
      />
    </Svg>
  );
}

interface Props {
  activeFilter?: FilterId;
  onFilterChange?: (id: FilterId) => void;
}

// Order: PP, JILI, Fishing, Favorite(bottom/last)
const FILTERS: { id: FilterId; color: string }[] = [
  { id: "pp",       color: "#ff6600" },
  { id: "jili",     color: "#aa44ff" },
  { id: "fishing",  color: "#00aaff" },
  { id: "favorite", color: "#ff4488" },
];

export function FilterIconRow({ activeFilter = "pp", onFilterChange }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.pill}>
        {FILTERS.map(({ id, color }) => {
          const isActive = activeFilter === id;
          return (
            <TouchableOpacity
              key={id}
              style={[styles.btn, { backgroundColor: isActive ? color : "rgba(20,10,60,0.75)" }]}
              onPress={() => onFilterChange?.(id)}
              activeOpacity={0.75}
            >
              {id === "pp" && (
                <Image
                  source={{ uri: PP_LOGO }}
                  style={styles.logo}
                  resizeMode="contain"
                />
              )}
              {id === "jili" && (
                <Image
                  source={{ uri: JILI_LOGO }}
                  style={styles.logo}
                  resizeMode="contain"
                />
              )}
              {id === "fishing" && <FishSvg color="#ffffff" />}
              {id === "favorite" && <HeartSvg color="#ffffff" filled={isActive} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingVertical: 6, paddingHorizontal: 10 },
  pill: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "rgba(10,5,40,0.6)",
    borderRadius: 28,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  btn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: { width: 28, height: 28 },
});
