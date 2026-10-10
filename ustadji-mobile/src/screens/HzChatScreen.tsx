import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  Mic,
  Camera,
  Wrench,
  Search,
  Clock,
  Headphones,
} from "lucide-react-native";
import { COLORS } from "../theme/theme";
import { HzButton, HzCard } from "../components/HzPrimitives";

interface HzChatScreenProps {
  onFindProvider: () => void;
  onReportIssue: () => void;
  onTrackBooking: () => void;
  onNewAIBooking: () => void;
}

export const HzChatScreen: React.FC<HzChatScreenProps> = ({
  onFindProvider,
  onReportIssue,
  onTrackBooking,
  onNewAIBooking,
}) => {
  const [reasoningExpanded, setReasoningExpanded] = useState(false);
  const [selectedUse, setSelectedUse] = useState<"residential" | "commercial">("residential");
  const [messages, setMessages] = useState<Array<{ sender: "user" | "agent"; text: string }>>([
    {
      sender: "agent",
      text: "Assalam-o-Alaikum! Main Ustaad G hoon. Mujhe batayein aapko kis service ki zaroorat hai, ya niche diye gaye options mein se select karein.",
    },
  ]);
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (!inputText.trim()) return;
    const userText = inputText;
    setInputText("");
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userText },
      {
        sender: "agent",
        text: `Theek hai! Main samajh gaya: "${userText}". Aapke area F-7 ke verified Ustads ko check kiya ja raha hai.`,
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>U</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.brandTitle}>Ustaad G</Text>
          <Text style={styles.brandSubtitle}>AI Home Services Assistant</Text>
        </View>
      </View>

      <ScrollView style={styles.chatFeed} contentContainerStyle={styles.feedContent}>
        {/* Thinking Block (Ustaad G Reasoning) */}
        <View style={styles.reasoningBox}>
          <TouchableOpacity
            style={styles.reasoningHeader}
            onPress={() => setReasoningExpanded(!reasoningExpanded)}
            activeOpacity={0.8}
          >
            <Sparkles size={16} color={COLORS.navy} />
            <Text style={styles.reasoningTitle}>Ustaad G's Reasoning — Intent Extraction</Text>
            {reasoningExpanded ? (
              <ChevronUp size={16} color="#9B9B9B" />
            ) : (
              <ChevronDown size={16} color="#9B9B9B" />
            )}
          </TouchableOpacity>
          <Text
            numberOfLines={reasoningExpanded ? undefined : 2}
            style={styles.reasoningText}
          >
            Parsing consumer request... Detected category: Plumbing / AC Service. Location: Islamabad Sector F-7. Checking provider availability and buffer windows.
          </Text>
        </View>

        {/* Suggestion Cards Stack */}
        <Text style={styles.sectionLabel}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          <TouchableOpacity
            style={styles.quickCard}
            onPress={onFindProvider}
            activeOpacity={0.8}
          >
            <Search size={20} color={COLORS.navy} />
            <Text style={styles.quickTitle}>Find & Book Ustad</Text>
            <Text style={styles.quickSubtitle}>Browse verified technicians</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={onReportIssue}
            activeOpacity={0.8}
          >
            <Camera size={20} color={COLORS.navy} />
            <Text style={styles.quickTitle}>Report Issue (+ Photo/Audio)</Text>
            <Text style={styles.quickSubtitle}>Multimodal diagnosis</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={onTrackBooking}
            activeOpacity={0.8}
          >
            <Clock size={20} color={COLORS.navy} />
            <Text style={styles.quickTitle}>Track My Booking</Text>
            <Text style={styles.quickSubtitle}>View job & arrival status</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickCard}
            onPress={onNewAIBooking}
            activeOpacity={0.8}
          >
            <Sparkles size={20} color={COLORS.navy} />
            <Text style={styles.quickTitle}>AI Booking Agent</Text>
            <Text style={styles.quickSubtitle}>Conversational booking</Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        {messages.map((m, idx) => (
          <View
            key={idx}
            style={[
              styles.bubble,
              m.sender === "user" ? styles.userBubble : styles.agentBubble,
            ]}
          >
            <Text
              style={[
                styles.bubbleText,
                m.sender === "user" ? styles.userBubbleText : styles.agentBubbleText,
              ]}
            >
              {m.text}
            </Text>
          </View>
        ))}

        {/* Clarification Card */}
        <View style={styles.clarifyCard}>
          <Text style={styles.clarifyTitle}>Is this for residential or commercial use?</Text>
          <View style={styles.clarifyBtns}>
            <TouchableOpacity
              style={[
                styles.clarifyBtn,
                selectedUse === "residential" && styles.clarifyBtnActive,
              ]}
              onPress={() => setSelectedUse("residential")}
            >
              <Text
                style={[
                  styles.clarifyBtnText,
                  selectedUse === "residential" && styles.clarifyBtnTextActive,
                ]}
              >
                Ghar (Residential)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.clarifyBtn,
                selectedUse === "commercial" && styles.clarifyBtnActive,
              ]}
              onPress={() => setSelectedUse("commercial")}
            >
              <Text
                style={[
                  styles.clarifyBtnText,
                  selectedUse === "commercial" && styles.clarifyBtnTextActive,
                ]}
              >
                Office / Commercial
              </Text>
            </TouchableOpacity>
          </View>

          <HzButton
            label="View Matched Providers →"
            onPress={onFindProvider}
            style={{ marginTop: 12, height: 44 }}
          />
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Bottom Input Bar */}
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.actionIconBtn} onPress={onReportIssue}>
          <Camera size={20} color={COLORS.navy} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionIconBtn}>
          <Mic size={20} color={COLORS.navy} />
        </TouchableOpacity>

        <TextInput
          style={styles.inputField}
          placeholder="Type in Roman Urdu or English..."
          placeholderTextColor="#9B9B9B"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
        />

        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <ArrowUp size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F5",
  },
  topBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E3DB",
    gap: 12,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#161533",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#161533",
  },
  brandSubtitle: {
    fontSize: 11,
    color: "#9B9B9B",
  },
  chatFeed: {
    flex: 1,
  },
  feedContent: {
    padding: 16,
    gap: 12,
  },
  reasoningBox: {
    backgroundColor: "#F0EDE8",
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#161533",
    padding: 12,
    marginBottom: 8,
  },
  reasoningHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  reasoningTitle: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  reasoningText: {
    fontSize: 12,
    color: "#555555",
    fontStyle: "italic",
    marginTop: 6,
    lineHeight: 18,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9B9B9B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },
  quickCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E8E3DB",
    gap: 4,
  },
  quickTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#161533",
    marginTop: 6,
  },
  quickSubtitle: {
    fontSize: 11,
    color: "#9B9B9B",
  },
  bubble: {
    maxWidth: "85%",
    borderRadius: 16,
    padding: 14,
  },
  agentBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E3DB",
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#161533",
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  agentBubbleText: {
    color: "#1A1A1A",
  },
  userBubbleText: {
    color: "#FFFFFF",
  },
  clarifyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8E3DB",
    marginTop: 8,
  },
  clarifyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 10,
  },
  clarifyBtns: {
    gap: 8,
  },
  clarifyBtn: {
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E8E3DB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  clarifyBtnActive: {
    backgroundColor: "#161533",
    borderColor: "#161533",
  },
  clarifyBtnText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  clarifyBtnTextActive: {
    color: "#FFFFFF",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#E8E3DB",
    gap: 8,
  },
  actionIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FAF8F5",
    alignItems: "center",
    justifyContent: "center",
  },
  inputField: {
    flex: 1,
    height: 42,
    backgroundColor: "#FAF8F5",
    borderRadius: 21,
    paddingHorizontal: 16,
    fontSize: 13,
    color: "#1A1A1A",
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#161533",
    alignItems: "center",
    justifyContent: "center",
  },
});
