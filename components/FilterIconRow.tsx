import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColors";

type FilterId = "heart" | "ticket" | "news" | "fire";

const FILTERS: {
  id: FilterId;
  type: "ionicons" | "mci";
  name: string;
  activeColor: string;
}[] = [
  { id: "heart", type: "ionicons", name: "heart-outline", activeColor: "#ff4488" },
  { id: "ticket", type: "mci", name: "ticket-outline", activeColor: "#88aaff" },
  { id: "news", type: "ionicons", name: "newspaper-outline", activeColor: "#88ddff" },
  { id: "fire", type: "ionicons", name: "flame", activeColor: "#ff6600" },
];

interface FilterIconRowProps {
  activeFilter?: FilterId;
  onFilterChange?: (id: FilterId) => void;
}

export function FilterIconRow({
  activeFilter = "fire",
  onFilterChange,
}: FilterIconRowProps) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.iconBtn,
                isActive
                  ? { backgroundColor: filter.activeColor }
                  : { backgroundColor: "rgba(0,0,0,0.45)" },
              ]}
              onPress={() => onFilterChange?.(filter.id)}
              activeOpacity={0.75}
            >
              {filter.type === "ionicons" ? (
                <Ionicons
                  name={filter.name as any}
                  size={22}
                  color={isActive ? "#ffffff" : "rgba(255,255,255,0.8)"}
                />
              ) : (
                <MaterialCommunityIcons
                  name={filter.name as any}
                  size={22}
                  color={isActive ? "#ffffff" : "rgba(255,255,255,0.8)"}
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
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 12,
    marginHorizontal: 6,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
