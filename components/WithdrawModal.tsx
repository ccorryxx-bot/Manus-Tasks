import React, { useState } from "react";
import {
  Modal, View, Text, TouchableOpacity,
  TextInput, StyleSheet, Dimensions, Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width: SW, height: SH } = Dimensions.get("window");
// Rotated 90deg: modal width=SH, height=SW
const MW = SH;
const MH = SW;

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
  const [step,      setStep]      = useState(1);
  const [method,    setMethod]    = useState("wave");
  const [amount,    setAmount]    = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [attempts,  setAttempts]  = useState(0);

  const handleQuick = (pct: number) => {
    setAmount(Math.floor(balance * pct).toString());
  };

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
        {/* Rotated container */}
        <View style={[styles.rotated, { width: MW, height: MH }]}>
          <LinearGradient colors={["#0a0a2e","#0d1b4b"]} style={styles.fullFill}>

            {/* TOP BAR — payment method tabs */}
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

            {step === 1 && (
              <View style={styles.body}>
                {/* LEFT — Gold label */}
                <View style={styles.leftCol}>
                  <LinearGradient colors={["#d4a017","#8b6914"]} style={styles.goldBox}>
                    <Text style={styles.goldText}>ငွေထုတ်</Text>
                  </LinearGradient>
                </View>

                {/* MIDDLE — Account input */}
                <View style={styles.midCol}>
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
                  <Text style={styles.rangeText}>10,000 - 1,000,000</Text>
                  {/* Quick buttons */}
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

                {/* RIGHT — Amount input */}
                <View style={styles.rightCol}>
                  <Text style={styles.fieldLabel}>ပမာဏ</Text>
                  <View style={[styles.inputBox, styles.amountBox]}>
                    <TextInput
                      style={[styles.input, styles.amountInput]}
                      placeholder="0"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      value={amount}
                      onChangeText={setAmount}
                      keyboardType="numeric"
                    />
                  </View>
                  {/* Attempt counter */}
                  <Text style={styles.counterText}>{attempts}/3</Text>
                  <TouchableOpacity onPress={() => setAmount("")} style={styles.refreshBtn}>
                    <Text style={styles.refreshText}>↺</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {step === 2 && (
              <View style={styles.body}>
                {/* LEFT — Green confirm button */}
                <View style={styles.leftCol}>
                  <TouchableOpacity onPress={handleConfirm}>
                    <LinearGradient colors={["#22aa44","#116622"]} style={styles.goldBox}>
                      <Text style={styles.goldText}>ပြည်ပ{"\n"}ပြီးဆုံး</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                {/* MIDDLE — Steps */}
                <View style={styles.midCol}>
                  <TouchableOpacity style={styles.backRow} onPress={() => setStep(1)}>
                    <Text style={styles.backArrow}>◀</Text>
                  </TouchableOpacity>
                  <Text style={styles.fieldLabel}>အဆင့် ၁ | ၂ | ၃</Text>
                  <Text style={styles.confirmInfo}>နံပါတ်: {accountNo}</Text>
                  <Text style={styles.confirmInfo}>ပမာဏ: {Number(amount).toLocaleString()} ကျပ်</Text>
                </View>

                {/* RIGHT — Warning */}
                <View style={styles.rightCol}>
                  <Text style={styles.warningText}>
                    {METHODS.find(m=>m.id===method)?.label} ဖြင့်{"\n"}
                    ၃ ကြိမ်အောင်{"\n"}ငွေပေးချေပါ
                  </Text>
                  <Text style={styles.methodLabel}>
                    {METHODS.find(m=>m.id===method)?.label} နေ...
                  </Text>
                </View>
              </View>
            )}

            {/* BOTTOM — Next button */}
            {step === 1 && (
              <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                <LinearGradient colors={["#7722dd","#4411aa"]} style={styles.nextGrad}>
                  <Text style={styles.nextText}>ဆက်လက်ဆောင်ရွက်ရန်</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.85)",
    alignItems: "center", justifyContent: "center",
  },
  rotated: {
    transform: [{ rotate: "90deg" }],
  },
  fullFill: { flex: 1 },
  topBar: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.1)",
  },
  topTitle: { color: "#ffcc00", fontSize: 16, fontWeight: "800", marginRight: 12 },
  tabRow:   { flexDirection: "row", gap: 8, flex: 1 },
  tab: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 6, backgroundColor: "rgba(255,255,255,0.08)",
  },
  tabActive: { backgroundColor: "#4488ff" },
  tabText:   { color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: "600" },
  tabTextActive: { color: "#fff" },
  closeBtn:  { padding: 8 },
  closeText: { color: "rgba(255,255,255,0.5)", fontSize: 18 },

  body: { flex: 1, flexDirection: "row", padding: 16, gap: 12 },

  leftCol: { width: 90, alignItems: "center", justifyContent: "center" },
  goldBox: {
    width: 80, height: 140, borderRadius: 12,
    alignItems: "center", justifyContent: "center",
  },
  goldText: {
    color: "#fff", fontSize: 16, fontWeight: "900",
    textAlign: "center", textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset:{width:1,height:1}, textShadowRadius:4,
  },

  midCol: { flex: 1, justifyContent: "center", gap: 8 },
  rightCol: { width: 120, alignItems: "center", justifyContent: "center", gap: 10 },

  fieldLabel: { color: "rgba(255,255,255,0.6)", fontSize: 11, marginBottom: 4 },
  inputBox: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 8, borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10, paddingVertical: 2,
  },
  amountBox: { backgroundColor: "rgba(30,80,200,0.3)", borderColor: "#4488ff" },
  input: { color: "#fff", fontSize: 13, paddingVertical: 8 },
  amountInput: { fontSize: 22, fontWeight: "800", color: "#ffcc00", textAlign: "center" },
  rangeText: { color: "rgba(255,255,255,0.4)", fontSize: 10 },

  quickRow: { flexDirection: "row", gap: 6, marginTop: 4 },
  quickBtn: {
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6,
    backgroundColor: "rgba(100,200,255,0.15)",
    borderWidth: 1, borderColor: "rgba(100,200,255,0.3)",
  },
  clearBtn: { backgroundColor: "rgba(255,80,80,0.2)", borderColor: "rgba(255,80,80,0.4)" },
  quickText: { color: "#66ccff", fontSize: 11, fontWeight: "700" },

  counterText: { color: "#ffcc00", fontSize: 18, fontWeight: "800" },
  refreshBtn:  { padding: 8 },
  refreshText: { color: "rgba(255,255,255,0.6)", fontSize: 20 },

  nextBtn:  { marginHorizontal: 16, marginBottom: 12, borderRadius: 10, overflow: "hidden" },
  nextGrad: { paddingVertical: 12, alignItems: "center" },
  nextText: { color: "#fff", fontSize: 14, fontWeight: "800" },

  backRow:  { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  backArrow:{ color: "#4488ff", fontSize: 18, marginRight: 6 },
  confirmInfo: { color: "#fff", fontSize: 13, marginTop: 6 },
  warningText: { color: "#ffaa00", fontSize: 11, textAlign: "center", lineHeight: 18 },
  methodLabel: { color: "#66ccff", fontSize: 11, marginTop: 6 },
});
