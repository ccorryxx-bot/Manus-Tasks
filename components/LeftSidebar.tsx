import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const TR = "?tr=w-88,h-88,f-webp,e-trim";

const ITEMS = [
  { label: "ငွေထုတ်",      uri: `https://ik.imagekit.io/rbok01qam/Native%20App%20icons%20img/1780913025065.png${TR}`,    isRed: false },
  { label: "ဆုလာဘ်",       uri: `https://ik.imagekit.io/rbok01qam/Native%20App%20icons%20img/IMG_20260608_163859.png${TR}`, isRed: false },
  { label: "VIP",           uri: `https://ik.imagekit.io/rbok01qam/Native%20App%20icons%20img/1780913465345.png${TR}`,    isRed: false },
  { label: "ကံကောင်းခြင်း", uri: `https://ik.imagekit.io/rbok01qam/Native%20App%20icons%20img/1780913565941.png${TR}`,    isRed: false },
  { label: "အသိပေးချက်",   uri: `https://ik.imagekit.io/rbok01qam/Native%20App%20icons%20img/1780913673707.png${TR}`,    isRed: false },
  { label: "Lucky Wheel",   uri: `https://ik.imagekit.io/rbok01qam/Native%20App%20icons%20img/1780913783929.png${TR}`,    isRed: false },
  { label: "ငွေသွင်း",     uri: `https://ik.imagekit.io/rbok01qam/Native%20App%20icons%20img/1780913143971.png${TR}`,    isRed: true  },
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
      {/* space-evenly ဆိုတော့ buttons တွေ အကုန် ညီညီမျှမျှ ကြားဝေပေးမယ် */}
      <View style={styles.inner}>
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
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    width: 72,
    alignSelf: "stretch",
  },
  inner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",  // ← ဒါပဲ key fix
    paddingVertical: 8,
  },
  item: {
    width: 68,
    alignItems: "center",
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  itemActive: {
    backgroundColor: "rgba(110,30,190,0.5)",
    borderWidth: 1,
    borderColor: "#9933ff",
  },
  itemRed: {
    backgroundColor: "#cc0000",
    borderRadius: 12,
    width: 66,
    paddingVertical: 6,
  },
  icon: {
    width: 46,
    height: 46,
    backgroundColor: "transparent",
  },
  label: {
    color: "#fff",
    fontSize: 9,
    textAlign: "center",
    marginTop: 2,
    fontWeight: "600",
  },
});
