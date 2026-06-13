import React, { useState } from "react";
import {
  Modal, View, Text, TouchableOpacity,
  TextInput, StyleSheet, ScrollView, Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  visible: boolean;
  onClose: () => void;
  balance?: number;
}

const PAYMENT_METHODS = [
  { id: "wave",   label: "Wave" },
  { id: "kbzpay", label: "KBZPay" },
  { id: "cbpay",  label: "CB Pay" },
];

const QUICK_AMOUNTS = [
  { label: "50%",  value: 0.5 },
  { label: "100%", value: 1.0 },
];

export function WithdrawModal({ visible, onClose, balance = 10000 }: Props) {
  const [step, setStep]           = useState(1);
  const [method, setMethod]       = useState("wave");
  const [amount, setAmount]       = useState("");
  const [accountNo, setAccountNo] = useState("");

  const handleQuick = (pct: number) => {
    setAmount(Math.floor(balance * pct).toString());
  };

  const handleNext = () => {
    if (!amount || Number(amount) < 1000) {
      Alert.alert("", "အနည်းဆုံး ၁,၀၀၀ ကျပ် ထည့်ပါ");
      return;
    }
    if (!accountNo) {
      Alert.alert("", "ငွေထုတ်နံပါတ် ထည့်ပါ");
      return;
    }
    setStep(2);
  };

  const handleConfirm = () => {
    Alert.alert("✅ တင်ပြီးပြီ", "ငွေထုတ်မှု လုပ်ဆောင်နေသည်");
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setAmount("");
    setAccountNo("");
    setMethod("wave");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <LinearGradient
          colors={["#1a0a3d","#0d1b4b"]}
          style={styles.sheet}
        >
          {/* Header */}
          <View style={styles.header}>
            {step === 2 && (
              <TouchableOpacity onPress={() => setStep(1)} style={styles.backBtn}>
                <Text style={styles.backText}>←</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.title}>ငွေထုတ်</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Step indicator */}
          <View style={styles.steps}>
            {[1, 2].map(s => (
              <View key={s} style={styles.stepRow}>
                <View style={[styles.stepDot, step >= s && styles.stepDotActive]}>
                  <Text style={styles.stepNum}>{s}</Text>
                </View>
                {s < 2 && <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />}
              </View>
            ))}
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>

            {step === 1 && (
              <>
                {/* Payment method */}
                <Text style={styles.label}>ငွေပေးချေမှု နည်းလမ်း</Text>
                <View style={styles.methodRow}>
                  {PAYMENT_METHODS.map(m => (
                    <TouchableOpacity
                      key={m.id}
                      style={[styles.methodBtn, method === m.id && styles.methodBtnActive]}
                      onPress={() => setMethod(m.id)}
                    >
                      <Text style={[styles.methodLabel, method === m.id && styles.methodLabelActive]}>
                        {m.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Account number */}
                <Text style={styles.label}>ငွေထုတ်နံပါတ်</Text>
                <TouchableOpacity style={styles.inputBox} activeOpacity={1}>
                  <TextInput
                    style={styles.input}
                    placeholder="ဤနေရာကိုနှိ၍ ငွေထုတ်နံပါတ်ကိုထည့်ပါ"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={accountNo}
                    onChangeText={setAccountNo}
                    keyboardType="phone-pad"
                  />
                </TouchableOpacity>

                {/* Amount */}
                <Text style={styles.label}>
                  ငွေပမာဏ
                  <Text style={styles.balanceHint}>  (လက်ကျန်: {balance.toLocaleString()} ကျပ်)</Text>
                </Text>
                <View style={styles.inputBox}>
                  <TextInput
                    style={styles.input}
                    placeholder="10,000 - 1,000,000"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                  />
                </View>

                {/* Quick amounts */}
                <View style={styles.quickRow}>
                  {QUICK_AMOUNTS.map(q => (
                    <TouchableOpacity
                      key={q.label}
                      style={styles.quickBtn}
                      onPress={() => handleQuick(q.value)}
                    >
                      <Text style={styles.quickLabel}>{q.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                  <LinearGradient colors={["#7722dd","#4411aa"]} style={styles.nextGrad}>
                    <Text style={styles.nextText}>ဆက်လက်ဆောင်ရွက်ရန်</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}

            {step === 2 && (
              <>
                <View style={styles.confirmCard}>
                  <Text style={styles.confirmTitle}>အတည်ပြုချက်</Text>

                  <View style={styles.confirmRow}>
                    <Text style={styles.confirmKey}>နည်းလမ်း</Text>
                    <Text style={styles.confirmVal}>
                      {PAYMENT_METHODS.find(m => m.id === method)?.label}
                    </Text>
                  </View>
                  <View style={styles.confirmRow}>
                    <Text style={styles.confirmKey}>နံပါတ်</Text>
                    <Text style={styles.confirmVal}>{accountNo}</Text>
                  </View>
                  <View style={styles.confirmRow}>
                    <Text style={styles.confirmKey}>ပမာဏ</Text>
                    <Text style={[styles.confirmVal, styles.confirmAmount]}>
                      {Number(amount).toLocaleString()} ကျပ်
                    </Text>
                  </View>

                  <Text style={styles.warningText}>
                    Wave ဖြင့် ၃ ကြိမ်အောင် ငွေပေးချေပါ
                  </Text>
                </View>

                <TouchableOpacity style={styles.nextBtn} onPress={handleConfirm}>
                  <LinearGradient colors={["#22aa44","#118833"]} style={styles.nextGrad}>
                    <Text style={styles.nextText}>ပြည့်စုံသည် / တင်ပြမည်</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}

          </ScrollView>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: "90%", paddingBottom: 30,
  },
  header: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12,
  },
  title: { flex: 1, color: "#fff", fontSize: 18, fontWeight: "800", textAlign: "center" },
  backBtn: { padding: 8 },
  backText: { color: "#fff", fontSize: 20 },
  closeBtn: { padding: 8 },
  closeText: { color: "rgba(255,255,255,0.6)", fontSize: 18 },
  steps: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 16 },
  stepRow: { flexDirection: "row", alignItems: "center" },
  stepDot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
  },
  stepDotActive: { backgroundColor: "#7722dd" },
  stepNum: { color: "#fff", fontSize: 12, fontWeight: "700" },
  stepLine: { width: 40, height: 2, backgroundColor: "rgba(255,255,255,0.2)", marginHorizontal: 4 },
  stepLineActive: { backgroundColor: "#7722dd" },
  body: { paddingHorizontal: 20, paddingBottom: 20 },
  label: { color: "rgba(255,255,255,0.7)", fontSize: 12, marginBottom: 8, marginTop: 16 },
  balanceHint: { color: "#9933ff", fontSize: 11 },
  methodRow: { flexDirection: "row", gap: 8 },
  methodBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
  },
  methodBtnActive: { backgroundColor: "rgba(119,34,221,0.4)", borderColor: "#9933ff" },
  methodLabel: { color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: "600" },
  methodLabelActive: { color: "#fff" },
  inputBox: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10, borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 14, paddingVertical: 4,
  },
  input: { color: "#fff", fontSize: 14, paddingVertical: 10 },
  quickRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  quickBtn: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8,
    backgroundColor: "rgba(100,200,255,0.15)",
    borderWidth: 1, borderColor: "rgba(100,200,255,0.3)",
  },
  quickLabel: { color: "#66ccff", fontSize: 12, fontWeight: "700" },
  nextBtn: { marginTop: 24, borderRadius: 14, overflow: "hidden" },
  nextGrad: { paddingVertical: 14, alignItems: "center" },
  nextText: { color: "#fff", fontSize: 15, fontWeight: "800" },
  confirmCard: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 16, padding: 20, marginTop: 8,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
  },
  confirmTitle: { color: "#fff", fontSize: 16, fontWeight: "800", marginBottom: 16, textAlign: "center" },
  confirmRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.08)" },
  confirmKey: { color: "rgba(255,255,255,0.6)", fontSize: 13 },
  confirmVal: { color: "#fff", fontSize: 13, fontWeight: "600" },
  confirmAmount: { color: "#ffcc00", fontSize: 15, fontWeight: "800" },
  warningText: { color: "#ffaa00", fontSize: 11, marginTop: 14, textAlign: "center" },
});
