import React, { useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Bot, Send } from 'lucide-react-native';
import { COLORS } from '../theme/theme';
import { useAgentConversation } from '../components/AgentChatProvider';

export const HzAiBookingChatScreen: React.FC<{ user?: any; onNavigate: (s: string) => void }> = ({
  user,
  onNavigate,
}) => {
  const { messages, inputText, setInputText, result, loading, error, act, send, newChat } = useAgentConversation();
  const feed = useRef<React.ComponentRef<typeof ScrollView>>(null);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Bot size={24} color={COLORS.navy} />
        <View style={{ flex: 1 }}>
          <Text style={styles.agentTitle}>UstadJi AI Agent</Text>
          <Text style={styles.agentStatus}>Local Ollama · Experimental Roman Urdu</Text>
        </View>
        <TouchableOpacity accessibilityLabel="Start new chat" disabled={loading} onPress={newChat}>
          <Text>New chat</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onNavigate("home")}>
          <Text>Back</Text>
        </TouchableOpacity>
      </View>
      <ScrollView ref={feed} style={styles.feed} onContentSizeChange={() => feed.current?.scrollToEnd({ animated: true })}>
        {messages.map((m) => (
          <View
            key={m.id}
            style={[
              styles.bubble,
              m.sender === "user" ? styles.userBubble : styles.agentBubble,
              { alignSelf: m.sender === "user" ? "flex-end" : "flex-start", marginBottom: 12 },
            ]}
          >
            <Text style={[styles.msgText, m.sender === "user" ? styles.userMsgText : styles.agentMsgText]}>
              {m.text}
            </Text>
          </View>
        ))}
        {!!error && <Text accessibilityRole="alert" style={{ color: "#B42318", padding: 10 }}>{error}</Text>}
        {result?.simulated && <Text style={{ padding: 10, color: COLORS.navy }}>Test mode — sirf simulated booking; ustad ko request nahi jayegi.</Text>}
        {loading && <ActivityIndicator accessibilityLabel="Agent jawab tayyar kar raha hai" />}
        {!loading && !result?.booking && result?.providers.map((p) => (
          <TouchableOpacity key={p.id} style={[styles.chipBtn, { marginBottom: 8 }]} onPress={() => void act({ providerId: p.id }, p.name + " select karein")}>
            <Text style={styles.cardName}>{p.name} — {p.trade}</Text>
            <Text>Estimated hourly rate: PKR {p.estimatedHourlyRate} (final invoice alag ho sakti hai)</Text>
          </TouchableOpacity>
        ))}
        {!loading && !result?.booking && result?.slots.map((s) => (
          <TouchableOpacity key={s.startTime} style={[styles.chipBtn, { marginBottom: 8 }]} onPress={() => void act(s, s.startTime + " se " + s.endTime + " select karein")}>
            <Text>{s.startTime}–{s.endTime}</Text>
          </TouchableOpacity>
        ))}
        {!loading && result?.summary && !result.booking && (
          <View style={styles.cardEmbed}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardName}>Booking details — saved address par visit</Text>
              <Text>{result.summary}</Text>
              <TouchableOpacity
                disabled={!result.writesEnabled}
                style={[styles.chipBtn, { marginTop: 12, opacity: result.writesEnabled ? 1 : 0.5 }]}
                onPress={() => void act({ confirm: true }, result.simulated ? "Test booking confirm karein" : "In details par booking request bhejein")}
              >
                <Text>{result.writesEnabled ? (result.simulated ? "Confirm test booking" : "Confirm request") : "Preview only — booking writes disabled"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {!!result?.booking && <Text style={styles.cardName}>{result.booking.bookingCode} · {result.booking.status}</Text>}
      </ScrollView>
      <View style={styles.inputBar}>
        <TextInput
          accessibilityLabel="Roman Urdu booking message"
          editable={!loading && !result?.booking}
          style={styles.inputField}
          placeholder="Roman Urdu mein likhein; date YYYY-MM-DD"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={send}
        />
        <TouchableOpacity
          accessibilityLabel="Send message"
          disabled={loading || !!result?.booking}
          style={styles.sendBtn}
          onPress={send}
        >
          <Send size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E3DB",
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  agentTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.navy,
  },
  agentStatus: {
    fontSize: 11,
    color: COLORS.green,
    marginTop: 2,
  },
  feed: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  msgWrapper: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  smallAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.navy,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: "85%",
  },
  agentBubble: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E3DB",
  },
  userBubble: {
    backgroundColor: COLORS.navy,
  },
  msgText: {
    fontSize: 14,
    lineHeight: 20,
  },
  agentMsgText: {
    color: COLORS.navy,
  },
  userMsgText: {
    color: "#FFFFFF",
  },
  timeText: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
    marginHorizontal: 4,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  chipBtn: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: COLORS.navy,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 12,
    color: COLORS.navy,
    fontWeight: "500",
  },
  cardEmbed: {
    marginTop: 10,
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#E8E3DB",
  },
  cardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  cardName: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.navy,
  },
  cardTrade: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  cardRating: {
    fontSize: 11,
    color: COLORS.navy,
    fontWeight: "600",
  },
  cardPrice: {
    fontSize: 11,
    color: COLORS.navy,
    fontWeight: "700",
  },
  cardBtn: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  cardBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  voiceOverlay: {
    backgroundColor: COLORS.navy,
    padding: 16,
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 8,
    alignItems: "center",
  },
  voiceTitle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 10,
  },
  waveformRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  waveBar: {
    width: 4,
    backgroundColor: COLORS.green,
    borderRadius: 2,
  },
  voiceControls: {
    flexDirection: "row",
    gap: 20,
  },
  voiceCancel: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  voiceConfirm: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#E8E3DB",
    gap: 8,
  },
  micBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  inputField: {
    flex: 1,
    height: 40,
    backgroundColor: COLORS.bg,
    borderRadius: 20,
    paddingHorizontal: 14,
    fontSize: 13,
    color: COLORS.navy,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.navy,
    alignItems: "center",
    justifyContent: "center",
  },
});
