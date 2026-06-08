import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

const ITEMS = [
  {
    label: "ငွေထုတ်",
    uri: "https://ik.imagekit.io/rbok01qam/Native%20App%20icons%20img/1780913025065.png?tr=w-88,h-88,f-webp",
    isRed: false,
  },
  {
    label: "ဆုလာဘ်",
    uri: "https://ik.imagekit.io/rbok01qam/Native%20App%20icons%20img/IMG_20260608_163859.png?tr=w-88,h-88,f-webp",
    isRed: false,
  },
  {
    label: "VIP",
    uri: "https://ik.imagekit.io/rbok01qam/Native%20App%20icons%20img/1780913465345.png?tr=w-88,h-88,f-webp",
    isRed: false,
  },
  {
    label: "ကံကောင်းခြင်း",
    uri: "https://ik.imagekit.io/rbok01qam/Native%20App%20icons%20img/1780913565941.png?tr=w-88,h-88,f-webp",
    isRed: false,
  },
  {
    label: "အသိပေးချက်",
    uri: "https://ik.imagekit.io/rbok01qam/Native%20App%20icons%20img/1780913673707.png?tr=w-88,h-88,f-webp",
    isRed: false,
  },
  {
    label: "Lucky Wheel",
    uri: "https://ik.imagekit.io/rbok01qam/Native%20App%20icons%20img/1780913783929.png?tr=w-88,h-88,f-webp",
    isRed: false,
  },
  {
    label: "ငွေသွင်း",
    uri: "https://ik.imagekit.io/rbok01qam/Native%20App%20icons%20img/1780913143971.png?tr=w-88,h-88,f-webp",
    isRed: true,
  },
] as const;

interface LeftSidebarProps {
  activeId?: string;
  onSelect?: (id: string) => void;
}

export function LeftSidebar({ activeId, onSelect }: LeftSidebarProps) {
  const [selected, setSelected] = useState(activeId ?? ITEMS[0].label);

  const handlePress = (label: string) => {
    setSelected(label);
    onSelect?.(label);
  };

  return (
    <LinearGradient
      colors={["#1a0a3d", "#0d1b4b"]}
      style={styles.gradient}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {ITEMS.map((item) => {
          const isActive = selected === item.label;

          return (
            <TouchableOpacity
              key={item.label}
              activeOpacity={0.75}
              onPress={() => handlePress(item.label)}
              style={[
                styles.item,
                isActive && !item.isRed && styles.itemActive,
                item.isRed && styles.itemRed,
              ]}
            >
              <Image
                source={{ uri: item.uri }}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.label} numberOfLines={2}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    width: 72,
    height: "100%",
    paddingTop: 10,
    alignItems: "center",
  },
  scroll: {
    alignItems: "center",
    paddingBottom: 12,
  },
  item: {
    width: 70,
    alignItems: "center",
    paddingVertical: 5,
    marginBottom: 4,
    backgroundColor: "transparent",
    borderRadius: 12,
  },
  itemActive: {
    backgroundColor: "rgba(110,30,190,0.5)",
    borderWidth: 1,
    borderColor: "#9933ff",
  },
  itemRed: {
    backgroundColor: "#cc0000",
    borderRadius: 12,
    width: 68,
    paddingVertical: 6,
  },
  icon: {
    width: 44,
    height: 44,
  },
  label: {
    color: "#fff",
    fontSize: 9,
    textAlign: "center",
    marginTop: 2,
  },
});
