import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Bot, Send, Mic, Sparkles, Star, ChevronRight, X, Check } from "lucide-react-native";
import { COLORS } from "../theme/theme";

interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  text: string;
  time: string;
  chips?: string[];
  providerCard?: {
    id: string;
    name: string;
    trade: string;
    rating: string;
    price: string;
    avatar: string;
  };
}

export const HzAiBookingChatScreen: React.FC<{ onNavigate: (s: string) => void }> = ({
  onNavigate,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "agent",
      text: "Assalam-o-Alaikum, Zain! Main aapka UstadJi AI assistant hoon. Aaj aapko kis kisam ki service chahiye?",
      time: "10:30 AM",
      chips: ["Plumber chahiye", "AC repair karwana hai", "Electrician book karo", "Report Issue (+ Photo/Voice)"],
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text,
      time: "10:31 AM",
    };

    let replyMsg: ChatMessage;

    if (text.toLowerCase().includes("plumb") || text.toLowerCase().includes("pipe") || text.toLowerCase().includes("leak")) {
      replyMsg = {
        id: (Date.now() + 1).toString(),
        sender: "agent",
        text: "Ji bilkul! Aap ke area F-7 mein 2 top-rated Plumbers available hain:",
        time: "10:31 AM",
        providerCard: {
          id: "p1",
          name: "Ustad Tariq Mehmood",
          trade: "Master Plumber (12 yrs exp)",
          rating: "4.9 ★ (128 reviews)",
          price: "Rs. 800/hr",
          avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80",
        },
        chips: ["Confirm Booking with Tariq", "Show 2nd Plumber", "Ask for Price Details"],
      };
    } else if (text.includes("Report Issue")) {
      onNavigate("issue_capture");
      return;
    } else {
      replyMsg = {
        id: (Date.now() + 1).toString(),
        sender: "agent",
        text: "Samajh gaya! Kya aap iss baare mein audio ya photo share karna chahenge taake hum exact pricing aur issue diagnose kar sakein?",
        time: "10:31 AM",
        chips: ["Upload Photo / Video", "Record Voice Note", "Direct Provider Match"],
      };
    }

    setMessages((prev) => [...prev, userMsg, replyMsg]);
    setInputText("");
  };

  return (
    <View style={styles.container}>
      {/* CHAT HEADER */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Bot size={22} color="#FFFFFF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.agentTitle}>UstadJi AI Agent</Text>
          <Text style={styles.agentStatus}>Online • Powered by LLaMA NLU</Text>
        </View>
      </View>

      {/* CHAT FEED */}
      <ScrollView style={styles.feed} showsVerticalScrollIndicator={false}>
        {messages.map((msg) => (
          <View key={msg.id} style={styles.msgWrapper}>
            {msg.sender === "agent" && (
              <View style={styles.smallAvatar}>
                <Bot size={14} color="#FFFFFF" />
              </View>
            )}

            <View style={{ flex: 1, alignItems: msg.sender === "user" ? "flex-end" : "flex-start" }}>
              <View
                style={[
                  styles.bubble,
                  msg.sender === "user" ? styles.userBubble : styles.agentBubble,
                ]}
              >
                <Text
                  style={[
                    styles.msgText,
                    msg.sender === "user" ? styles.userMsgText : styles.agentMsgText,
                  ]}
                >
                  {msg.text}
                </Text>

                {/* EMBEDDED PROVIDER CARD */}
                {msg.providerCard && (
                  <View style={styles.cardEmbed}>
                    <Image source={{ uri: msg.providerCard.avatar }} style={styles.cardAvatar} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardName}>{msg.providerCard.name}</Text>
                      <Text style={styles.cardTrade}>{msg.providerCard.trade}</Text>
                      <Text style={styles.cardRating}>{msg.providerCard.rating}</Text>
                      <Text style={styles.cardPrice}>{msg.providerCard.price}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.cardBtn}
                      onPress={() => onNavigate("provider_results")}
                    >
                      <Text style={styles.cardBtnText}>Select</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <Text style={styles.timeText}>{msg.time}</Text>

              {/* INTENT CHIPS */}
              {msg.chips && (
                <View style={styles.chipsRow}>
                  {msg.chips.map((chip, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.chipBtn}
                      onPress={() => handleSend(chip)}
                    >
                      <Text style={styles.chipText}>{chip}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* VOICE LISTENING OVERLAY */}
      {isListening && (
        <View style={styles.voiceOverlay}>
          <Text style={styles.voiceTitle}>Listening... (Urdu/English)</Text>
          <View style={styles.waveformRow}>
            <View style={[styles.waveBar, { height: 16 }]} />
            <View style={[styles.waveBar, { height: 28 }]} />
            <View style={[styles.waveBar, { height: 40 }]} />
            <View style={[styles.waveBar, { height: 20 }]} />
            <View style={[styles.waveBar, { height: 32 }]} />
          </View>
          <View style={styles.voiceControls}>
            <TouchableOpacity style={styles.voiceCancel} onPress={() => setIsListening(false)}>
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.voiceConfirm}
              onPress={() => {
                setIsListening(false);
                handleSend("Pani ka pipe leak ho raha hai kitchen mein");
              }}
            >
              <Check size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* INPUT BAR */}
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.micBtn} onPress={() => setIsListening(true)}>
          <Mic size={20} color={COLORS.navy} />
        </TouchableOpacity>

        <TextInput
          style={styles.inputField}
          placeholder="Type or record in Roman Urdu..."
          placeholderTextColor={COLORS.textMuted}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => handleSend()}
        />

        <TouchableOpacity style={styles.sendBtn} onPress={() => handleSend()}>
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
