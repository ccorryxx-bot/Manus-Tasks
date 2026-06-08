import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";

export function LandscapeBottomBar() {
  const colors = useColors();

  return (
    <View style={[styles.bar, { backgroundColor: colors.headerBg, borderTopColor: colors.border }]}>
      <TouchableOpacity
        style={[styles.withdrawBtn, { backgroundColor: "#1E3A5F", borderColor: "#60A5FA55" }]}
        activeOpacity={0.75}
      >
        <MaterialCommunityIcons name="bank-transfer-out" size={16} color="#60A5FA" />
        <Text style={[styles.btnText, { color: "#93C5FD" }]}>ငွေထုတ်</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.depositBtn, { backgroundColor: "#DC2626" }]}
        activeOpacity={0.75}
      >
        <MaterialCommunityIcons name="bank-transfer-in" size={16} color="#FFFFFF" />
        <Text style={[styles.btnText, { color: "#FFF" }]}>ငွေသွင်း</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    bottom: 0,
    left: 68,
    right: 0,
    height: 50,
    flexDirection: "row",
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
    zIndex: 100,
  },
  withdrawBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    borderWidth: 1,
    gap: 6,
  },
  depositBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    gap: 6,
  },
  btnText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
});
