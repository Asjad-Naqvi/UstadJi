import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { ArrowLeft, CheckCircle2, Clock, Phone, MapPin, Mic, FileText, Check } from "lucide-react-native";
import { COLORS } from "../theme/theme";
import { HzButton, HzCard } from "../components/HzPrimitives";
import { api } from "../services/api";

interface HzProviderActiveJobScreenProps {
  onBack: () => void;
  onFinishJob: () => void;
  booking?: any;
}

export const HzProviderActiveJobScreen: React.FC<HzProviderActiveJobScreenProps> = ({
  onBack,
  onFinishJob,
  booking,
}) => {
  const [jobState, setJobState] = useState<"SCHEDULED" | "IN_PROGRESS" | "COMPLETED">(
    booking?.status === "COMPLETED"
      ? "COMPLETED"
      : booking?.status === "IN_PROGRESS"
      ? "IN_PROGRESS"
      : "SCHEDULED"
  );
  const [invoiceGenerated, setInvoiceGenerated] = useState(booking?.status === "COMPLETED");
  const [loading, setLoading] = useState(false);

  const bookingCode = booking?.bookingCode || "BK-1001";
  const serviceCat = booking?.serviceCategory || "Master Plumbing";
  const issueDesc = booking?.issueDescription || "Main water pipe valve leaking in kitchen";
  const customerName = booking?.customer?.fullName || "Zain Khan";
  const customerPhone = booking?.customer?.phone || "+92 300 5551234";

  const handleStartWork = async () => {
    try {
      setLoading(true);
      if (booking?.id && !booking.id.startsWith("sim-")) {
        await api.updateBookingStatus(booking.id, "IN_PROGRESS");
      }
      setJobState("IN_PROGRESS");
      Alert.alert("Status Updated ✓", "Job marked as IN PROGRESS. Customer has been notified.");
    } catch (e) {
      Alert.alert("Notice", (e as Error).message);
      setJobState("IN_PROGRESS");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteWork = async () => {
    try {
      setLoading(true);
      if (booking?.id && !booking.id.startsWith("sim-")) {
        await api.updateBookingStatus(booking.id, "COMPLETED");
      }
      setJobState("COMPLETED");
      setInvoiceGenerated(true);
      Alert.alert("Job Finished! 🎉", "Voice-to-Invoice generated. Receipt sent to customer.");
    } catch (e) {
      Alert.alert("Notice", (e as Error).message);
      setJobState("COMPLETED");
      setInvoiceGenerated(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={{ padding: 4 }}>
          <ArrowLeft size={22} color={COLORS.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Active Job Management</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ padding: 16, gap: 14 }}>
        {/* Status Tracker Card */}
        <HzCard style={styles.card}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={styles.code}>{bookingCode} • {serviceCat}</Text>
            <View
              style={[
                styles.badge,
                jobState === "SCHEDULED" && { backgroundColor: "rgba(76, 175, 132, 0.15)" },
                jobState === "IN_PROGRESS" && { backgroundColor: "rgba(22, 21, 51, 0.15)" },
                jobState === "COMPLETED" && { backgroundColor: "rgba(16, 185, 129, 0.2)" },
              ]}
            >
              <Text style={styles.badgeText}>{jobState}</Text>
            </View>
          </View>

          <Text style={styles.jobTitle}>{issueDesc}</Text>
          <Text style={styles.customerText}>Customer: {customerName} • {customerPhone}</Text>
          <Text style={styles.addressText}>📍 House 24, Street 12, Sector F-7/2, Islamabad</Text>

          {/* Stepper */}
          <View style={styles.stepperRow}>
            <View style={styles.step}>
              <View style={[styles.stepDot, { backgroundColor: COLORS.green }]}>
                <Check size={12} color="#FFFFFF" />
              </View>
              <Text style={styles.stepLabel}>Accepted</Text>
            </View>
            <View style={[styles.stepLine, { backgroundColor: jobState !== "SCHEDULED" ? COLORS.green : "#E8E3DB" }]} />
            <View style={styles.step}>
              <View style={[styles.stepDot, { backgroundColor: jobState !== "SCHEDULED" ? COLORS.green : "#E8E3DB" }]}>
                <Check size={12} color="#FFFFFF" />
              </View>
              <Text style={styles.stepLabel}>On Site</Text>
            </View>
            <View style={[styles.stepLine, { backgroundColor: jobState === "COMPLETED" ? COLORS.green : "#E8E3DB" }]} />
            <View style={styles.step}>
              <View style={[styles.stepDot, { backgroundColor: jobState === "COMPLETED" ? COLORS.green : "#E8E3DB" }]}>
                <Check size={12} color="#FFFFFF" />
              </View>
              <Text style={styles.stepLabel}>Completed</Text>
            </View>
          </View>
        </HzCard>

        {/* Action Controls */}
        <HzCard style={styles.card}>
          <Text style={styles.sectionHeading}>Job Progress Controls</Text>

          {jobState === "SCHEDULED" && (
            <HzButton
              label="Mark Arrived & Start Work (IN PROGRESS)"
              onPress={handleStartWork}
              style={{ marginTop: 10 }}
            />
          )}

          {jobState === "IN_PROGRESS" && (
            <View style={{ gap: 10, marginTop: 10 }}>
              <TouchableOpacity style={styles.voiceNoteBtn}>
                <Mic size={18} color="#FFFFFF" />
                <Text style={styles.voiceNoteText}>Record Work Voice Note (Whisper NLP)</Text>
              </TouchableOpacity>

              <HzButton
                label="Mark Job Finished & Generate Invoice"
                style={{ backgroundColor: COLORS.green }}
                onPress={handleCompleteWork}
              />
            </View>
          )}

          {jobState === "COMPLETED" && (
            <View style={{ gap: 10, marginTop: 10 }}>
              <View style={styles.completedNotice}>
                <CheckCircle2 size={20} color={COLORS.green} />
                <Text style={styles.completedNoticeText}>Job finished! Itemized invoice sent to customer.</Text>
              </View>

              <HzButton
                label="Return to Dashboard"
                onPress={onFinishJob}
              />
            </View>
          )}
        </HzCard>

        {/* Invoice Breakdown (M8 Pricing Engine) */}
        {invoiceGenerated && (
          <HzCard style={styles.invoiceCard}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <FileText size={18} color={COLORS.navy} />
              <Text style={styles.invoiceHeading}>Generated Invoice #INV-1001</Text>
            </View>

            <View style={styles.itemRow}>
              <Text style={styles.itemName}>Plumbing Diagnostic & Labor</Text>
              <Text style={styles.itemPrice}>PKR 800</Text>
            </View>
            <View style={styles.itemRow}>
              <Text style={styles.itemName}>High-Pressure Water Valve (1/2")</Text>
              <Text style={styles.itemPrice}>PKR 450</Text>
            </View>
            <View style={styles.itemRow}>
              <Text style={styles.itemName}>Teflon Tape & Sealant</Text>
              <Text style={styles.itemPrice}>PKR 120</Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Payable</Text>
              <Text style={styles.totalVal}>PKR 1,370</Text>
            </View>
          </HzCard>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F5",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E3DB",
    gap: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#161533",
  },
  content: {
    flex: 1,
  },
  card: {
    padding: 16,
  },
  code: {
    fontSize: 14,
    fontWeight: "700",
    color: "#161533",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#161533",
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 8,
  },
  customerText: {
    fontSize: 12,
    color: "#555555",
    marginTop: 4,
  },
  addressText: {
    fontSize: 12,
    color: "#9B9B9B",
    marginTop: 2,
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F5F3EF",
  },
  step: {
    alignItems: "center",
    gap: 4,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#161533",
  },
  stepLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 8,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: "#161533",
  },
  voiceNoteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#161533",
    paddingVertical: 12,
    borderRadius: 20,
  },
  voiceNoteText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  completedNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(76, 175, 132, 0.12)",
    padding: 12,
    borderRadius: 12,
  },
  completedNoticeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#161533",
  },
  invoiceCard: {
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  invoiceHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: "#161533",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#FAF8F5",
  },
  itemName: {
    fontSize: 13,
    color: "#555555",
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "600",
    color: "#161533",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E8E3DB",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#161533",
  },
  totalVal: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.green,
  },
});
