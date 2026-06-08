import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Circle,
  Defs,
  G,
  Line,
  Path,
  Svg,
} from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function AvatarIcon() {
  return (
    <Svg width={36} height={36} viewBox="0 0 36 36">
      <Circle cx={18} cy={18} r={17} fill="rgba(100,40,180,0.35)" stroke="#aa66ff" strokeWidth={1.5} />
      <Circle cx={18} cy={14} r={6} fill="rgba(255,255,255,0.7)" />
      <Path
        d="M6 30 Q6 22 18 22 Q30 22 30 30"
        fill="rgba(255,255,255,0.7)"
      />
    </Svg>
  );
}

function GoldCoinIcon() {
  return (
    <Svg width={30} height={30} viewBox="0 0 30 30">
      <Circle cx={15} cy={15} r={14} fill="#ffcc00" stroke="#cc9900" strokeWidth={1} />
      <Circle cx={15} cy={15} r={10} fill="#ffdd44" stroke="#cc9900" strokeWidth={0.5} />
      <Path
        d="M15 9 L15 21 M12 12 Q15 10 18 12 Q20 14 18 16 Q15 14 12 16 Q10 18 12 20 Q15 22 18 20"
        stroke="#996600"
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function RefreshIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path
        d="M20 12 A8 8 0 1 1 16 4.5"
        stroke="white"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M16 1 L16 6 L21 6"
        stroke="white"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function DecorativeDot() {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12">
      <Circle cx={6} cy={6} r={5} fill="rgba(255,255,255,0.35)" />
    </Svg>
  );
}

interface RightSidebarProps {
  coinCount?: number;
  onRefresh?: () => void;
}

export function RightSidebar({ coinCount = 9, onRefresh }: RightSidebarProps) {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 24 : insets.top;
  const bottomPad = Platform.OS === "web" ? 24 : insets.bottom;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: topPad + 6, paddingBottom: bottomPad + 8 },
      ]}
    >
      <TouchableOpacity activeOpacity={0.8} style={styles.item}>
        <AvatarIcon />
      </TouchableOpacity>

      <View style={styles.item}>
        <GoldCoinIcon />
      </View>

      <Text style={styles.coinCount}>{coinCount}</Text>

      <TouchableOpacity onPress={onRefresh} activeOpacity={0.7} style={styles.item}>
        <RefreshIcon />
      </TouchableOpacity>

      <View style={styles.spacer} />

      <View style={styles.item}>
        <DecorativeDot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    alignItems: "center",
    gap: 16,
    zIndex: 10,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
  },
  coinCount: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  spacer: {
    flex: 1,
  },
});
