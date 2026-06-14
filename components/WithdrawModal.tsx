import React, { useState, useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  Modal, View, Text, TouchableOpacity,
  TextInput, StyleSheet, Alert, useWindowDimensions, StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  visible: boolean;
  onClose: () => void;
  balance?: number;
}

const METHODS = [
  { id: "wave",   label: "Wave" },
  { id: "kbzpay", label: "KBZPay" },
];

export function WithdrawModal({ visible, onClose, balance = 10000 }: Props) {
  const { width: W, height: H } = useWindowDimensions();
  const [step,      setStep]      = useState(1);
  const [method,    setMethod]    = useState("wave");
  const [amount,    setAmount]    = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [attempts,  setAttempts]  = useState(0);

  useEffect(() => {
    if (visible) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
    } else {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, [visible]);

  const handleQuick = (pct: number) => setAmount(Math.floor(balance * pct).toString());

  const handleNext = () => {
    if (!accountNo) { Alert.alert("", "ငွေထုတ်နံပါတ် ထည့်ပါ"); return; }
    if (!amount || Number(amount) < 10000) { Alert.alert("", "အနည်းဆုံး ၁၀,၀၀၀ ကျပ်"); return; }
    setStep(2);
  };

  const handleConfirm = () => {
    setAttempts(a => a + 1);
    Alert.alert("✅", "တင်ပြပြီးပြီ");
    handleClose();
  };

  const handleClose = () => {
    setStep(1); setAmount(""); setAccountNo("");
    setMethod("wave"); setAttempts(0); onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <StatusBar hidden />
        <LinearGradient colors={["#0a0a2e","#0d1b4b"]} style={styles.container}>

          {/* TOP BAR */}
          <View style={styles.topBar}>
            <Text style={styles.topTitle}>ငွေထုတ်</Text>
            <View style={styles.tabRow}>
              {METHODS.map(m => (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.tab, method === m.id && styles.tabActive]}
                  onPress={() => setMethod(m.id)}
                >
                  <Text style={[styles.tabText, method === m.id && styles.tabTextActive]}>
                    {m.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* BODY */}
          {step === 1 && (
            <View style={styles.body}>
              {/* LEFT: Gold label */}
              <View style={styles.leftCol}>
                <LinearGradient colors={["#d4a017","#7a5010"]} style={styles.goldBox}>
                  <Text style={styles.goldText}>ငွေထုတ်</Text>
                </LinearGradient>
              </View>

              {/* CENTER: Account + quick amounts */}
              <View style={styles.centerCol}>
                <Text style={styles.fieldLabel}>ငွေထုတ်နံပါတ်</Text>
                <View style={styles.inputBox}>
                  <TextInput
                    style={styles.input}
                    placeholder="ဤနေရာကိုနှိ၍ ငွေထုတ်နံပါတ်ကိုထည့်ပါ"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    value={accountNo}
                    onChangeText={setAccountNo}
                    keyboardType="phone-pad"
                  />
                </View>
                <Text style={styles.rangeText}>ကန့်သတ်ချက် 10,000 – 1,000,000</Text>
                <View style={styles.quickRow}>
                  <TouchableOpacity style={styles.quickBtn} onPress={() => handleQuick(0.5)}>
                    <Text style={styles.quickText}>50%</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.quickBtn} onPress={() => handleQuick(1)}>
                    <Text style={styles.quickText}>100%</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.quickBtn, styles.clearBtn]} onPress={() => setAmount("")}>
                    <Text style={styles.quickText}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* RIGHT: Amount + counter */}
              <View style={styles.rightCol}>
                <Text style={styles.fieldLabel}>ပမာဏ</Text>
                <View style={[styles.inputBox, styles.amountBox]}>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="0"
                    placeholderTextColor="rgba(255,204,0,0.4)"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    textAlign="center"
                  />
                </View>
                <Text style={styles.counterText}>{attempts}/3</Text>
                <TouchableOpacity onPress={() => { setAmount(""); setAccountNo(""); }}>
                  <Text style={styles.refreshText}>↺</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.body}>
              <View style={styles.leftCol}>
                <TouchableOpacity onPress={handleConfirm}>
                  <LinearGradient colors={["#22aa44","#115522"]} style={styles.goldBox}>
                    <Text style={styles.goldText}>ပြည်ပ{"\n"}ပြီးဆုံး</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <View style={styles.centerCol}>
                <TouchableOpacity onPress={() => setStep(1)} style={styles.backRow}>
                  <Text style={styles.backText}>◀ ပြန်သွား</Text>
                </TouchableOpacity>
                <Text style={styles.confirmRow}>နည်းလမ်း: {METHODS.find(m=>m.id===method)?.label}</Text>
                <Text style={styles.confirmRow}>နံပါတ်: {accountNo}</Text>
                <Text style={styles.confirmRow}>ပမာဏ: {Number(amount).toLocaleString()} ကျပ်</Text>
              </View>

              <View style={styles.rightCol}>
                <Text style={styles.warnText}>
                  {METHODS.find(m=>m.id===method)?.label} ဖြင့်{"\n"}
                  ၃ ကြိမ်အောင်{"\n"}ငွေပေးချေပါ
                </Text>
              </View>
            </View>
          )}

          {/* BOTTOM BUTTON */}
          {step === 1 && (
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <LinearGradient colors={["#7722dd","#4411aa"]} style={styles.nextGrad}>
                <Text style={styles.nextText}>ဆက်လက်ဆောင်ရွက်ရန်</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "#050515",
    zIndex: 999,
  },
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  topTitle: { color: "#ffcc00", fontSize: 16, fontWeight: "800", marginRight: 16 },
  tabRow:   { flexDirection: "row", gap: 8, flex: 1 },
  tab: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 8, backgroundColor: "rgba(255,255,255,0.08)",
  },
  tabActive:     { backgroundColor: "#4488ff" },
  tabText:       { color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: "600" },
  tabTextActive: { color: "#fff" },
  closeBtn:  { padding: 8 },
  closeText: { color: "rgba(255,255,255,0.5)", fontSize: 20 },

  body: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },

  leftCol: { width: 110, alignItems: "center", justifyContent: "center" },
  goldBox: {
    width: 100, height: 120, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
  },
  goldText: {
    color: "#fff", fontSize: 18, fontWeight: "900", textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width:1, height:1 }, textShadowRadius: 4,
  },

  centerCol: { flex: 1, justifyContent: "center", gap: 10 },
  rightCol:  { width: 130, alignItems: "center", justifyContent: "center", gap: 12 },

  fieldLabel: { color: "rgba(255,255,255,0.6)", fontSize: 12, marginBottom: 2 },
  inputBox: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10, borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
  },
  amountBox: { backgroundColor: "rgba(30,80,200,0.3)", borderColor: "#4488ff", width: "100%" },
  input:       { color: "#fff", fontSize: 14, paddingVertical: 10 },
  amountInput: { color: "#ffcc00", fontSize: 24, fontWeight: "800", paddingVertical: 12 },
  rangeText:   { color: "rgba(255,255,255,0.4)", fontSize: 11 },
  quickRow:    { flexDirection: "row", gap: 8 },
  quickBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8,
    backgroundColor: "rgba(100,200,255,0.15)",
    borderWidth: 1, borderColor: "rgba(100,200,255,0.3)",
  },
  clearBtn:    { backgroundColor: "rgba(255,80,80,0.2)", borderColor: "rgba(255,80,80,0.4)" },
  quickText:   { color: "#66ccff", fontSize: 12, fontWeight: "700" },
  counterText: { color: "#ffcc00", fontSize: 20, fontWeight: "800" },
  refreshText: { color: "rgba(255,255,255,0.5)", fontSize: 24 },

  nextBtn:  { marginHorizontal: 20, marginBottom: 12, borderRadius: 12, overflow: "hidden" },
  nextGrad: { paddingVertical: 14, alignItems: "center" },
  nextText: { color: "#fff", fontSize: 15, fontWeight: "800" },

  backRow:    { flexDirection: "row", marginBottom: 8 },
  backText:   { color: "#4488ff", fontSize: 14 },
  confirmRow: { color: "#fff", fontSize: 14, marginTop: 6 },
  warnText:   { color: "#ffaa00", fontSize: 12, textAlign: "center", lineHeight: 20 },
});
