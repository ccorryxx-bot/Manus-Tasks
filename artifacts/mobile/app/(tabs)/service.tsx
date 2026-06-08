import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const FAQ = [
  { q: "How to deposit?", a: "Go to the home screen and tap 'ငွေသွင်း'. Follow the on-screen instructions to complete your deposit." },
  { q: "How to withdraw?", a: "Go to the home screen and tap 'ငွေထုတ်'. Minimum withdrawal is 1,000 coins." },
  { q: "What is VIP?", a: "VIP is our loyalty program. The more you play, the higher your VIP level and the better your rewards." },
  { q: "How to spin the wheel?", a: "Navigate to the Wheel tab. You get 3 free spins per day. Results are randomized." },
  { q: "Are my winnings real?", a: "This is a virtual casino for entertainment. All coins are virtual and have no real monetary value." },
];

export default function ServiceScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  function handleSend() {
    if (!message.trim()) return;
    setSent(true);
    setMessage("");
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.headerBg, paddingTop: topPad + 10 }]}>
        <MaterialCommunityIcons name="headset" size={24} color={colors.gold} />
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>ဝန်ဆောင်မှု</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: Platform.OS === "web" ? 100 : 90 }]}>
        {/* Contact Options */}
        <View style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.contactTitle, { color: colors.foreground }]}>Contact Us</Text>
          <View style={styles.contactRow}>
            <TouchableOpacity style={[styles.contactBtn, { backgroundColor: "#25D366" + "22", borderColor: "#25D366" + "55" }]}>
              <MaterialCommunityIcons name="whatsapp" size={22} color="#25D366" />
              <Text style={[styles.contactBtnText, { color: "#25D366" }]}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.contactBtn, { backgroundColor: "#2AABEE" + "22", borderColor: "#2AABEE" + "55" }]}>
              <MaterialCommunityIcons name="telegram" size={22} color="#2AABEE" />
              <Text style={[styles.contactBtnText, { color: "#2AABEE" }]}>Telegram</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.contactBtn, { backgroundColor: colors.purple + "22", borderColor: colors.purple + "55" }]}>
              <MaterialCommunityIcons name="chat" size={22} color={colors.purple} />
              <Text style={[styles.contactBtnText, { color: colors.purple }]}>Live Chat</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.onlineIndicator, { backgroundColor: colors.success + "22" }]}>
            <View style={[styles.greenDot, { backgroundColor: colors.success }]} />
            <Text style={[styles.onlineText, { color: colors.success }]}>Support agents online 24/7</Text>
          </View>
        </View>

        {/* Send Message */}
        <View style={[styles.messageCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Send a Message</Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type your message..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={4}
            style={[styles.input, { backgroundColor: colors.secondary, color: colors.foreground, borderColor: colors.border }]}
          />
          {sent && (
            <View style={[styles.sentBanner, { backgroundColor: colors.success + "22" }]}>
              <Feather name="check-circle" size={16} color={colors.success} />
              <Text style={[styles.sentText, { color: colors.success }]}>Message sent! We'll reply within 1 hour.</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={handleSend}
            style={[styles.sendBtn, { backgroundColor: colors.gold }]}
          >
            <Feather name="send" size={16} color="#000" />
            <Text style={styles.sendBtnText}>Send Message</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ */}
        <Text style={[styles.faqTitle, { color: colors.mutedForeground }]}>Frequently Asked Questions</Text>
        {FAQ.map((item, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setExpandedFaq(expandedFaq === i ? null : i)}
            style={[styles.faqItem, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={styles.faqHeader}>
              <Text style={[styles.faqQ, { color: colors.foreground }]}>{item.q}</Text>
              <MaterialCommunityIcons
                name={expandedFaq === i ? "chevron-up" : "chevron-down"}
                size={20}
                color={colors.mutedForeground}
              />
            </View>
            {expandedFaq === i && (
              <Text style={[styles.faqA, { color: colors.mutedForeground }]}>{item.a}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  headerTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  content: { padding: 16, gap: 14 },
  contactCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  contactTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  contactRow: { flexDirection: "row", gap: 10 },
  contactBtn: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  contactBtnText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  onlineIndicator: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    gap: 8,
  },
  greenDot: { width: 8, height: 8, borderRadius: 4 },
  onlineText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  messageCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  input: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    minHeight: 100,
    textAlignVertical: "top",
  },
  sentBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    gap: 8,
  },
  sentText: { fontSize: 13, fontFamily: "Inter_500Medium", flex: 1 },
  sendBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 14,
    gap: 8,
  },
  sendBtnText: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#000" },
  faqTitle: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  faqItem: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    gap: 8,
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  faqQ: { fontSize: 14, fontFamily: "Inter_600SemiBold", flex: 1, paddingRight: 8 },
  faqA: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
});
