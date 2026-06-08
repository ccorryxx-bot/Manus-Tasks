import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

const SEGMENTS = [
  { label: "500", amount: 500, color: "#DC2626" },
  { label: "100", amount: 100, color: "#7C3AED" },
  { label: "2000", amount: 2000, color: "#059669" },
  { label: "50", amount: 50, color: "#D97706" },
  { label: "5000", amount: 5000, color: "#2563EB" },
  { label: "200", amount: 200, color: "#DB2777" },
  { label: "1000", amount: 1000, color: "#0891B2" },
  { label: "MISS", amount: 0, color: "#4B5563" },
];

export default function WheelScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { updateBalance } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<(typeof SEGMENTS)[0] | null>(null);
  const [canSpin, setCanSpin] = useState(true);
  const [spinCount, setSpinCount] = useState(0);
  const spinAnim = useRef(new Animated.Value(0)).current;
  const totalSpinRef = useRef(0);

  async function spinWheel() {
    if (spinning || !canSpin) return;
    setSpinning(true);
    setResult(null);

    const segmentIndex = Math.floor(Math.random() * SEGMENTS.length);
    const segmentAngle = 360 / SEGMENTS.length;
    const targetAngle = 360 * 5 + segmentIndex * segmentAngle;
    totalSpinRef.current += targetAngle;

    Animated.timing(spinAnim, {
      toValue: totalSpinRef.current,
      duration: 3000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(async () => {
      const won = SEGMENTS[segmentIndex];
      setResult(won);
      setSpinning(false);
      setSpinCount((c) => c + 1);
      if (spinCount >= 2) setCanSpin(false); // 3 spins per session
      if (won.amount > 0) {
        await updateBalance(won.amount);
      }
    });
  }

  const rotate = spinAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  const WHEEL_SIZE = 280;
  const segCount = SEGMENTS.length;
  const segAngle = 360 / segCount;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBg, paddingTop: topPad + 10 }]}>
        <MaterialCommunityIcons name="rotate-3d-variant" size={24} color={colors.gold} />
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Lucky Wheel</Text>
        <View style={[styles.spinsLeft, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.spinsText, { color: colors.gold }]}>{Math.max(0, 3 - spinCount)} Spins Left</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Pointer */}
        <View style={styles.pointerContainer}>
          <MaterialCommunityIcons name="menu-down" size={40} color={colors.gold} />
        </View>

        {/* Wheel image spinning */}
        <Animated.Image
          source={require("../../assets/images/lucky-wheel.png")}
          style={[styles.wheelImage, { transform: [{ rotate }] }]}
          resizeMode="contain"
        />

        {/* Wheel segments overlay */}
        <Animated.View style={{ position: "absolute" }}></Animated.View>

        {/* Wheel segments (hidden, image used instead) */}
        <Animated.View style={{ display: "none" }}>
          {SEGMENTS.map((seg, i) => {
            const rotation = i * segAngle;
            return (
              <View
                key={i}
                style={[
                  styles.segment,
                  {
                    width: WHEEL_SIZE / 2,
                    height: WHEEL_SIZE / 2,
                    backgroundColor: seg.color,
                    transform: [
                      { rotate: `${rotation}deg` },
                      { translateX: WHEEL_SIZE / 4 },
                    ],
                  },
                ]}
              >
                <Text
                  style={[
                    styles.segLabel,
                    {
                      transform: [
                        { rotate: `${segAngle / 2}deg` },
                      ],
                    },
                  ]}
                >
                  {seg.label}
                </Text>
              </View>
            );
          })}

          {/* Center */}
          <View style={[styles.wheelCenter, { backgroundColor: colors.background, borderColor: colors.gold }]}>
            <MaterialCommunityIcons name="star" size={24} color={colors.gold} />
          </View>
        </Animated.View>

        {/* Result */}
        {result && (
          <View style={[styles.resultCard, { backgroundColor: result.color + "22", borderColor: result.color }]}>
            {result.amount > 0 ? (
              <>
                <MaterialCommunityIcons name="star-circle" size={28} color={colors.gold} />
                <Text style={[styles.resultText, { color: colors.gold }]}>
                  +{result.amount.toLocaleString()} Coins!
                </Text>
              </>
            ) : (
              <>
                <MaterialCommunityIcons name="emoticon-sad" size={28} color={colors.mutedForeground} />
                <Text style={[styles.resultText, { color: colors.mutedForeground }]}>Better luck next time!</Text>
              </>
            )}
          </View>
        )}

        {/* Spin button */}
        <TouchableOpacity
          onPress={spinWheel}
          disabled={spinning || !canSpin}
          style={[
            styles.spinBtn,
            {
              backgroundColor: !canSpin ? colors.muted : spinning ? colors.border : colors.gold,
            },
          ]}
        >
          <MaterialCommunityIcons
            name="rotate-3d-variant"
            size={22}
            color={!canSpin || spinning ? colors.mutedForeground : "#000"}
          />
          <Text style={[styles.spinBtnText, { color: !canSpin || spinning ? colors.mutedForeground : "#000" }]}>
            {spinning ? "Spinning..." : !canSpin ? "No Spins Left" : "SPIN!"}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.hint, { color: colors.mutedForeground }]}>3 free spins per day</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 14,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.07)",
  },
  headerTitle: { fontSize: 20, fontFamily: "Inter_700Bold", flex: 1 },
  spinsLeft: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  spinsText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 20,
    paddingBottom: Platform.OS === "web" ? 100 : 90,
  },
  pointerContainer: {
    alignItems: "center",
    marginBottom: -20,
    zIndex: 10,
  },
  wheel: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 4,
    position: "relative",
  },
  segment: {
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "flex-end",
    justifyContent: "flex-start",
    paddingTop: 20,
    paddingRight: 10,
    transformOrigin: "0% 100%",
  },
  segLabel: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    color: "#FFF",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  wheelImage: {
    width: 280,
    height: 280,
  },
  wheelCenter: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    zIndex: 10,
  },
  resultCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    gap: 10,
    minWidth: 220,
    justifyContent: "center",
  },
  resultText: { fontSize: 20, fontFamily: "Inter_700Bold" },
  spinBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    gap: 10,
  },
  spinBtnText: { fontSize: 18, fontFamily: "Inter_700Bold" },
  hint: { fontSize: 12, fontFamily: "Inter_400Regular" },
});
