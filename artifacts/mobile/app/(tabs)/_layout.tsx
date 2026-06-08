import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

export default function TabLayout() {
  const colors = useColors();
  const { unreadCount } = useApp();
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : colors.tabBg,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 0,
          height: isWeb ? 84 : 60,
          paddingBottom: isWeb ? 34 : 8,
          paddingTop: 6,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={90}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ) : isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.tabBg }]} />
          ) : null,
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "Inter_500Medium",
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "ဂိမ်းများ",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cards-playing" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="prizes"
        options={{
          title: "ဆုငွေ",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="gift" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="vip"
        options={{
          title: "VIP",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="crown" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="freelance"
        options={{
          title: "Freelance",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="briefcase" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color, focused }) => (
            <View>
              <MaterialCommunityIcons name="bell" size={24} color={color} />
              {unreadCount > 0 && (
                <View style={[styles.badge, { backgroundColor: "#EF4444" }]}>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="wheel"
        options={{
          title: "Wheel",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="rotate-3d-variant" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="service"
        options={{
          title: "ဝန်ဆောင်မှု",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="headset" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
