import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type FilterId = "pp" | "jili" | "fishing" | "favorite";

const FILTERS: {
  id: FilterId;
  label: string;
  icon: string;
  iconLib: "ionicons" | "mci";
  activeColor: string;
}[] = [
  {
    id: "pp",
    label: "Pragmatic",
    icon: "game-controller-outline",
    iconLib: "ionicons",
    activeColor: "#ff6600",
  },
  {
    id: "jili",
    label: "Jili",
    icon: "cards-playing-outline",
    iconLib: "mci",
    activeColor: "#aa44ff",
  },
  {
    id: "fishing",
    label: "Fishing",
    icon: "fish-outline",
    iconLib: "mci",
    activeColor: "#00aaff",
  },
  {
    id: "favorite",
    label: "Favorite",
    icon: "heart",
    iconLib: "ionicons",
    activeColor: "#ff4488",
  },
];

interface FilterIconRowProps {
  activeFilter?: FilterId;
  onFilterChange?: (id: FilterId) => void;
}

export function FilterIconRow({
  activeFilter = "pp",
  onFilterChange,
}: FilterIconRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.pill}>
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.id;
          return (
            <TouchableOpacity
              key={f.id}
              style={[
                styles.btn,
                {
                  backgroundColor: isActive
                    ? f.activeColor
                    : "rgba(20,10,60,0.75)",
                },
              ]}
              onPress={() => onFilterChange?.(f.id)}
              activeOpacity={0.75}
            >
              {f.iconLib === "ionicons" ? (
                <Ionicons name={f.icon as any} size={18} color="#fff" />
              ) : (
                <MaterialCommunityIcons
                  name={f.icon as any}
                  size={18}
                  color="#fff"
                />
              )}
              <Text style={styles.label}>{f.label}</Text>
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
    gap: 8,
    backgroundColor: "rgba(10,5,40,0.6)",
    borderRadius: 28,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
  },
  label: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
});
