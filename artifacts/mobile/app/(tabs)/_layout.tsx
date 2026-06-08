import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

type TabIconProps = {
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string;
  size?: number;
  bgColor?: string;
};

function TabIcon({ name, color, size = 22, bgColor }: TabIconProps) {
  if (bgColor) {
    return (
      <View style={[tabStyles.iconBubble, { backgroundColor: bgColor + "33", borderColor: bgColor + "55" }]}>
        <MaterialCommunityIcons name={name} size={size} color={color} />
      </View>
    );
  }
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
}

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
          backgroundColor: isIOS ? "transparent" : colors.tabBg ?? "#0D1035",
          borderTopWidth: 1,
          borderTopColor: "rgba(255,255,255,0.08)",
          elevation: 0,
          height: isWeb ? 84 : 64,
          paddingBottom: isWeb ? 34 : 10,
          paddingTop: 6,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} />
          ) : null,
        tabBarLabelStyle: {
          fontSize: 9,
          fontFamily: "Inter_500Medium",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "ဂိမ်းများ",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="cards-playing"
              color={color}
              bgColor={focused ? colors.gold : undefined}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="prizes"
        options={{
          title: "ဆုငွေ",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="gift"
              color={color}
              bgColor={focused ? "#F97316" : undefined}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="vip"
        options={{
          title: "VIP",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="crown"
              color={color}
              bgColor={focused ? "#FFD700" : undefined}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="freelance"
        options={{
          title: "Freelance",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="briefcase-check"
              color={color}
              bgColor={focused ? "#22C55E" : undefined}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notif",
          tabBarIcon: ({ color, focused }) => (
            <View>
              <TabIcon
                name="bell"
                color={color}
                bgColor={focused ? "#A855F7" : undefined}
              />
              {unreadCount > 0 && (
                <View style={tabStyles.notifDot} />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="wheel"
        options={{
          title: "Wheel",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="ferris-wheel"
              color={color}
              bgColor={focused ? "#EC4899" : undefined}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="service"
        options={{
          title: "ဝန်ဆောင်မှု",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name="headset"
              color={color}
              bgColor={focused ? "#60A5FA" : undefined}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const tabStyles = StyleSheet.create({
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  notifDot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: "#0D1035",
  },
});
