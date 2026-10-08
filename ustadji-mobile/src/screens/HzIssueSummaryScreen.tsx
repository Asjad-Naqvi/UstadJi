import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { ArrowLeft, Edit3, CheckCircle, ShieldAlert, Sparkles, ChevronRight } from "lucide-react-native";
import { COLORS } from "../theme/theme";
import { HzButton, HzCard } from "../components/HzPrimitives";

export const HzIssueSummaryScreen: React.FC<{ onNavigate: (s: string) => void }> = ({
  onNavigate,
}) => {
  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate("issue_capture")}>
          <ArrowLeft size={22} color={COLORS.navy} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Yahan Hai Aapka Summary</Text>
          <Text style={styles.subtitle}>Here is what AI understood from your upload</Text>
        </View>
      </View>

      {/* SUMMARY CARD */}
      <HzCard style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <View style={styles.aiTag}>
            <Sparkles size={14} color={COLORS.green} />
            <Text style={styles.aiTagText}>AI Structured Assessment</Text>
          </View>
          <TouchableOpacity onPress={() => onNavigate("issue_capture")}>
            <Edit3 size={18} color={COLORS.navy} />
          </TouchableOpacity>
        </View>

        {/* CATEGORY & URGENCY */}
        <View style={styles.metaRow}>
          <View>
            <Text style={styles.metaLabel}>Service Category</Text>
            <View style={styles.navyTag}>
              <Text style={styles.navyTagText}>AC Repairing & Cooling</Text>
            </View>
          </View>

          <View>
            <Text style={styles.metaLabel}>Urgency</Text>
            <View style={styles.urgencyTag}>
              <Text style={styles.urgencyTagText}>HIGH (Today)</Text>
            </View>
          </View>
        </View>

        {/* ESTIMATED ISSUE */}
        <View style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>Estimated Issue</Text>
          <Text style={styles.fieldVal}>
            AC cooling drop caused by possible refrigerant gas leak or weak outdoor compressor capacitor.
          </Text>
        </View>

        {/* SUGGESTED SCOPE */}
        <View style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>Suggested Scope of Work</Text>
          <View style={styles.bulletRow}>
            <CheckCircle size={14} color={COLORS.green} />
            <Text style={styles.bulletText}>Pressure test & Gas top-up (R22/R410)</Text>
          </View>
          <View style={styles.bulletRow}>
            <CheckCircle size={14} color={COLORS.green} />
            <Text style={styles.bulletText}>Compressor electrical capacitor check</Text>
          </View>
          <View style={styles.bulletRow}>
            <CheckCircle size={14} color={COLORS.green} />
            <Text style={styles.bulletText}>Outdoor unit condenser cleaning</Text>
          </View>
        </View>

        {/* ESTIMATED COST */}
        <View style={styles.costBox}>
          <View>
            <Text style={styles.costLabel}>Estimated Cost Range</Text>
            <Text style={styles.costSub}>Labor + Parts inspection</Text>
          </View>
          <Text style={styles.costValue}>Rs. 1,500 - 2,500</Text>
        </View>
      </HzCard>

      {/* UPLOADED ATTACHMENT THUMBNAILS */}
      <Text style={styles.sectionTitle}>Uploaded Attachments</Text>
      <View style={styles.attachmentRow}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&auto=format&fit=crop&q=80",
          }}
          style={styles.attachThumb}
        />
        <View style={styles.voiceNotePill}>
          <Text style={styles.voiceText}>🎙️ Voice Note (0:14s)</Text>
        </View>
      </View>

      {/* ACTIONS */}
      <View style={styles.actionBlock}>
        <HzButton
          label="Confirm & Find Ustads"
          onPress={() => onNavigate("provider_results")}
        />

        <HzButton
          label="Edit Details"
          variant="secondary"
          onPress={() => onNavigate("issue_capture")}
        />
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.navy,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  summaryCard: {
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  aiTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(76, 175, 132, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aiTagText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.green,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  metaLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  navyTag: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  navyTagText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  urgencyTag: {
    backgroundColor: "rgba(22, 21, 51, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  urgencyTagText: {
    color: COLORS.navy,
    fontSize: 12,
    fontWeight: "700",
  },
  fieldBlock: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.navy,
    marginBottom: 4,
  },
  fieldVal: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  bulletText: {
    fontSize: 12,
    color: COLORS.navy,
  },
  costBox: {
    backgroundColor: COLORS.bg,
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  costLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.navy,
  },
  costSub: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  costValue: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.navy,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.navy,
    marginBottom: 10,
  },
  attachmentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  attachThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  voiceNotePill: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E8E3DB",
  },
  voiceText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.navy,
  },
  actionBlock: {
    gap: 10,
  },
});
