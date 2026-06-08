import { Tabs } from "expo-router";
import React from "react";
import { LandscapeBottomBar } from "@/components/LandscapeBottomBar";
import { LandscapeNav } from "@/components/LandscapeNav";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={() => (
        <>
          <LandscapeNav />
          <LandscapeBottomBar />
        </>
      )}
      screenOptions={{
        headerShown: false,
        contentStyle: {
          paddingLeft: 68,
          paddingBottom: 50,
        },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="prizes" />
      <Tabs.Screen name="vip" />
      <Tabs.Screen name="freelance" />
      <Tabs.Screen name="notifications" />
      <Tabs.Screen name="wheel" />
      <Tabs.Screen name="service" />
    </Tabs>
  );
}
