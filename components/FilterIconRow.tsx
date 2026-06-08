import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type FilterId = "heart" | "ticket" | "news" | "fire";

const FILTERS: {
  id: FilterId;
  type: "ionicons" | "mci";
  name: string;
  activeColor: string;
  inactiveBg: string;
}[] = [
  {
    id: "heart",
    type: "ionicons",
    name: "heart-outline",
    activeColor: "#ff4488",
    inactiveBg: "rgba(20,10,60,0.75)",
  },
  {
    id: "ticket",
    type: "mci",
    name: "ticket-outline",
    activeColor: "#88aaff",
    inactiveBg: "rgba(20,10,60,0.75)",
  },
  {
    id: "news",
    type: "ionicons",
    name: "newspaper-outline",
    activeColor: "#88ddff",
    inactiveBg: "rgba(20,10,60,0.75)",
  },
  {
    id: "fire",
    type: "ionicons",
    name: "flame",
    activeColor: "#ff6600",
    inactiveBg: "rgba(20,10,60,0.75)",
  },
];

interface FilterIconRowProps {
  activeFilter?: FilterId;
  onFilterChange?: (id: FilterId) => void;
}

export function FilterIconRow({
  activeFilter = "fire",
  onFilterChange,
}: FilterIconRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.pill}>
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.iconBtn,
                { backgroundColor: isActive ? filter.activeColor : filter.inactiveBg },
              ]}
              onPress={() => onFilterChange?.(filter.id)}
              activeOpacity={0.75}
            >
              {filter.type === "ionicons" ? (
                <Ionicons
                  name={filter.name as any}
                  size={20}
                  color="#ffffff"
                />
              ) : (
                <MaterialCommunityIcons
                  name={filter.name as any}
                  size={20}
                  color="#ffffff"
                />
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
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
