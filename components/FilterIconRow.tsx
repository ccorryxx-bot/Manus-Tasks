import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";

export type FilterId = "pp" | "jili" | "fishing" | "favorite";

const PP_LOGO   = "https://ik.imagekit.io/tdpebgueq/Home%20Page%20_icons_linces%20logo/a04d3bed-f475-42eb-9f35-4f9802068315.png?tr=f-auto";
const JILI_LOGO = "https://ik.imagekit.io/tdpebgueq/Home%20Page%20_icons_linces%20logo/40_N_JILI_LOGO.avif?tr=f-auto";

function FishIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M2 12C2 12 6 6 12 6C18 6 22 12 22 12C22 12 18 18 12 18C6 18 2 12 2 12Z" stroke={color} strokeWidth={1.8} fill="none"/>
      <Circle cx={15} cy={11} r={1.2} fill={color}/>
      <Path d="M2 12C0 10 0 8 2 7" stroke={color} strokeWidth={1.8} strokeLinecap="round"/>
      <Path d="M2 12C0 14 0 16 2 17" stroke={color} strokeWidth={1.8} strokeLinecap="round"/>
    </Svg>
  );
}

function HeartIcon({ color, filled }: { color: string; filled: boolean }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path
        d="M12 21C12 21 3 14 3 8.5C3 6 5 4 7.5 4C9.24 4 10.91 5 12 6.5C13.09 5 14.76 4 16.5 4C19 4 21 6 21 8.5C21 14 12 21 12 21Z"
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth={1.8}
      />
    </Svg>
  );
}

interface Props {
  activeFilter?: FilterId;
  onFilterChange?: (id: FilterId) => void;
}

export function FilterIconRow({ activeFilter = "pp", onFilterChange }: Props) {
  const filters: FilterId[] = ["pp", "jili", "fishing", "favorite"];

  const getActiveColor = (id: FilterId) => {
    if (id === "pp")       return "#ff6600";
    if (id === "jili")     return "#aa44ff";
    if (id === "fishing")  return "#00aaff";
    return "#ff4488";
  };

  return (
    <View style={styles.container}>
      <View style={styles.pill}>
        {filters.map((id) => {
          const isActive = activeFilter === id;
          const activeColor = getActiveColor(id);

          return (
            <TouchableOpacity
              key={id}
              style={[
                styles.btn,
                { backgroundColor: isActive ? activeColor : "rgba(20,10,60,0.75)" },
              ]}
              onPress={() => onFilterChange?.(id)}
              activeOpacity={0.75}
            >
              {id === "pp" && (
                <Image source={{ uri: PP_LOGO }} style={styles.logo} resizeMode="contain"/>
              )}
              {id === "jili" && (
                <Image source={{ uri: JILI_LOGO }} style={styles.logo} resizeMode="contain"/>
              )}
              {id === "fishing" && (
                <FishIcon color="#ffffff" />
              )}
              {id === "favorite" && (
                <HeartIcon color="#ffffff" filled={isActive} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  pill: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "rgba(10,5,40,0.6)",
    borderRadius: 28,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  btn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 32,
    height: 32,
  },
});
