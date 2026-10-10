import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { ArrowLeft, Clock, Phone, MapPin, CheckCircle2, RotateCcw, XCircle, FileText, AlertTriangle, ShieldAlert } from "lucide-react-native";
import { COLORS } from "../theme/theme";
import { HzButton, HzCard } from "../components/HzPrimitives";

import { api } from "../services/api";

interface HzJobStatusScreenProps {
  onBack: () => void;
  onReschedule: () => void;
  onViewInvoice: () => void;
  onCancel: () => void;
  booking?: any;
}

export const HzJobStatusScreen: React.FC<HzJobStatusScreenProps> = ({
  onBack,
  onReschedule,
  onViewInvoice,
  onCancel,
  booking,
}) => {
  const [jobPhase, setJobPhase] = useState<"SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "DISPUTED">(
    booking?.status || "SCHEDULED"
  );
  const [currentBookingData, setCurrentBookingData] = useState<any>(booking);
  const [loading, setLoading] = useState(false);
  const [disputeModalVisible, setDisputeModalVisible] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");

  React.useEffect(() => {
    if (booking?.id) {
      loadBooking();
    }
  }, [booking?.id]);

  const loadBooking = async () => {
    try {
      const data = await api.getBooking(booking.id);
      setCurrentBookingData(data);
      if (data.status) {
        setJobPhase(data.status);
      }
    } catch (e) {
      console.warn("Could not refresh booking:", e);
    }
  };

  const handleSetStatus = async (status: "IN_PROGRESS" | "COMPLETED", note?: string) => {
    if (!booking?.id) return;
    try {
      setLoading(true);
      await api.updateBookingStatus(
        booking.id,
        status,
        note || `Customer updated status to ${status}`,
        "CUSTOMER"
      );
      setJobPhase(status);
      Alert.alert(
        status === "COMPLETED" ? "Job Completed & Payment Released ✓" : "Status Updated ✓",
        status === "COMPLETED"
          ? "Thank you! The technician payout has been approved."
          : `Booking status updated to ${status}.`
      );
    } catch (e) {
      Alert.alert("Error Updating Status", (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleRaiseDispute = async () => {
    if (!booking?.id) return;
    if (!disputeReason.trim()) {
      Alert.alert("Reason Required", "Please describe why you are opening a dispute.");
      return;
    }
    try {
      setLoading(true);
      await api.updateBookingStatus(
        booking.id,
        "DISPUTED",
        disputeReason.trim(),
        "CUSTOMER"
      );
      setJobPhase("DISPUTED");
      setDisputeModalVisible(false);
      setDisputeReason("");
      Alert.alert("Dispute Filed ⚠️", "Our Support & Mediation Admin team will review your case and contact both parties.");
    } catch (e) {
      Alert.alert("Error Raising Dispute", (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const bookingCode = currentBookingData?.bookingCode || booking?.bookingCode || "Booking";
  const serviceCategory = currentBookingData?.serviceCategory || booking?.serviceCategory || "Service";
  const issueDescription = currentBookingData?.issueDescription || booking?.issueDescription || "Service Request";
  const providerName = currentBookingData?.provider?.fullName || booking?.provider?.fullName || "Assigned Technician";
  const providerPhone = currentBookingData?.provider?.phone || booking?.provider?.phone || "+92 300 0000000";
  const appointmentDate = currentBookingData?.appointmentDate ? String(currentBookingData.appointmentDate).slice(0, 10) : "Today";
  const startTime = currentBookingData?.startTime || "10:00";
  const endTime = currentBookingData?.endTime || "11:00";
  const cancellationReason = currentBookingData?.cancellationReason || booking?.cancellationReason;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={{ padding: 4 }}>
          <ArrowLeft size={22} color={COLORS.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Status & Tracking</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ padding: 16, gap: 14 }}>
        {/* Status Card */}
        <HzCard style={styles.card}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={styles.codeText}>{bookingCode} • {serviceCategory}</Text>
            <View
              style={[
                styles.statusBadge,
                jobPhase === "SCHEDULED" && { backgroundColor: "rgba(76, 175, 132, 0.15)" },
                jobPhase === "IN_PROGRESS" && { backgroundColor: "rgba(22, 21, 51, 0.15)" },
                jobPhase === "COMPLETED" && { backgroundColor: "rgba(16, 185, 129, 0.2)" },
                jobPhase === "DISPUTED" && { backgroundColor: "rgba(255, 107, 53, 0.15)" },
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  jobPhase === "DISPUTED" && { color: "#FF6B35" },
                ]}
              >
                {jobPhase}
              </Text>
            </View>
          </View>

          <Text style={styles.jobHeading}>{issueDescription}</Text>
          <Text style={styles.timeInfo}>📅 {appointmentDate} at {startTime} - {endTime}</Text>

          {/* Lifecycle Bar */}
          <View style={styles.phaseRow}>
            <View style={styles.phaseItem}>
              <View style={[styles.phaseDot, { backgroundColor: COLORS.green }]} />
              <Text style={styles.phaseLabel}>Confirmed</Text>
            </View>
            <View style={[styles.phaseLine, { backgroundColor: jobPhase !== "SCHEDULED" ? COLORS.green : "#E8E3DB" }]} />
            <View style={styles.phaseItem}>
              <View style={[styles.phaseDot, { backgroundColor: jobPhase !== "SCHEDULED" ? COLORS.green : "#E8E3DB" }]} />
              <Text style={styles.phaseLabel}>On Site</Text>
            </View>
            <View style={[styles.phaseLine, { backgroundColor: jobPhase === "COMPLETED" ? COLORS.green : "#E8E3DB" }]} />
            <View style={styles.phaseItem}>
              <View style={[styles.phaseDot, { backgroundColor: jobPhase === "COMPLETED" ? COLORS.green : "#E8E3DB" }]} />
              <Text style={styles.phaseLabel}>Finished</Text>
            </View>
          </View>
        </HzCard>

        {/* Dispute Banner if DISPUTED */}
        {jobPhase === "DISPUTED" && (
          <HzCard style={styles.disputeBannerCard}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <ShieldAlert size={26} color="#FF6B35" />
              <View style={{ flex: 1 }}>
                <Text style={styles.disputeTitle}>Dispute Opened — Under Admin Mediation</Text>
                <Text style={styles.disputeSub}>
                  {cancellationReason ? `Reason: "${cancellationReason}"` : "Issue reported by party."}
                </Text>
                <Text style={styles.disputeNote}>
                  Payment is held securely in escrow while UstadJi Admin reviews evidence and logs.
                </Text>
              </View>
            </View>
          </HzCard>
        )}

        {/* Assigned Provider Card */}
        <HzCard style={styles.card}>
          <Text style={styles.cardSectionLabel}>Assigned Technician</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
            <View>
              <Text style={styles.pName}>{providerName}</Text>
              <Text style={styles.pTrade}>{serviceCategory} Specialist</Text>
            </View>
            <TouchableOpacity
              style={styles.callBtn}
              onPress={() => Alert.alert("Calling Ustad", `Dialing ${providerPhone}...`)}
            >
              <Phone size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </HzCard>

        {/* Actions Stack */}
        <View style={{ gap: 10, marginTop: 10 }}>
          {jobPhase !== "COMPLETED" && jobPhase !== "DISPUTED" && (
            <>
              {jobPhase === "IN_PROGRESS" && (
                <HzButton
                  label={loading ? "Updating..." : "Confirm Job Completion & Release Payment ✓"}
                  style={{ backgroundColor: COLORS.green }}
                  disabled={loading}
                  onPress={() => handleSetStatus("COMPLETED", "Customer confirmed completion & released payment")}
                />
              )}

              {jobPhase === "SCHEDULED" && (
                <HzButton
                  label={loading ? "Updating..." : "Mark Provider Arrived (IN PROGRESS)"}
                  variant="secondary"
                  disabled={loading}
                  onPress={() => handleSetStatus("IN_PROGRESS")}
                />
              )}

              <HzButton
                label="Raise Dispute / Report Issue ⚠️"
                variant="danger"
                disabled={loading}
                onPress={() => setDisputeModalVisible(true)}
              />
            </>
          )}

          <HzButton
            label="View Itemized Invoice (M8)"
            onPress={onViewInvoice}
          />

          {jobPhase !== "DISPUTED" && jobPhase !== "COMPLETED" && (
            <View style={{ flexDirection: "row", gap: 10 }}>
              <HzButton
                label="Reschedule Slot"
                variant="secondary"
                style={{ flex: 1 }}
                onPress={onReschedule}
              />
              <HzButton
                label="Cancel Job"
                variant="danger"
                style={{ flex: 1 }}
                onPress={onCancel}
              />
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Dispute Modal */}
      <Modal
        visible={disputeModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDisputeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <AlertTriangle size={22} color="#FF6B35" />
              <Text style={styles.modalTitle}>File Dispute / Report Issue</Text>
            </View>
            <Text style={styles.modalSubtitle}>
              Please select or describe the issue encountered with this job:
            </Text>

            <View style={{ gap: 6, marginVertical: 10 }}>
              {["Work incomplete or poor quality", "Overcharging / Pricing dispute", "Provider no-show or severe delay", "Property damage or safety issue"].map((reason) => (
                <TouchableOpacity
                  key={reason}
                  style={[
                    styles.reasonChip,
                    disputeReason === reason && { backgroundColor: "rgba(255, 107, 53, 0.15)", borderColor: "#FF6B35" },
                  ]}
                  onPress={() => setDisputeReason(reason)}
                >
                  <Text style={[styles.reasonChipText, disputeReason === reason && { color: "#FF6B35", fontWeight: "700" }]}>
                    {reason}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.textInput}
              placeholder="Or write custom reason..."
              value={disputeReason}
              onChangeText={setDisputeReason}
              multiline
              numberOfLines={3}
            />

            <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
              <HzButton
                label="Cancel"
                variant="secondary"
                style={{ flex: 1 }}
                onPress={() => setDisputeModalVisible(false)}
              />
              <HzButton
                label={loading ? "Submitting..." : "Submit Dispute"}
                variant="danger"
                style={{ flex: 1 }}
                disabled={loading}
                onPress={handleRaiseDispute}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  codeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#161533",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#161533",
  },
  jobHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 8,
  },
  timeInfo: {
    fontSize: 12,
    color: "#555555",
    marginTop: 4,
  },
  phaseRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F5F3EF",
  },
  phaseItem: {
    alignItems: "center",
    gap: 4,
  },
  phaseDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  phaseLabel: {
    fontSize: 10,
    color: "#161533",
    fontWeight: "600",
  },
  phaseLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 8,
  },
  cardSectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9B9B9B",
    textTransform: "uppercase",
  },
  pName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#161533",
  },
  pTrade: {
    fontSize: 12,
    color: "#9B9B9B",
    marginTop: 2,
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
  },
  disputeBannerCard: {
    padding: 14,
    backgroundColor: "rgba(255, 107, 53, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.3)",
  },
  disputeTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FF6B35",
  },
  disputeSub: {
    fontSize: 12,
    color: "#161533",
    marginTop: 2,
    fontWeight: "600",
  },
  disputeNote: {
    fontSize: 11,
    color: "#666666",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#161533",
  },
  modalSubtitle: {
    fontSize: 12,
    color: "#666666",
  },
  reasonChip: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E8E3DB",
    backgroundColor: "#FAF8F5",
  },
  reasonChipText: {
    fontSize: 12,
    color: "#161533",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E8E3DB",
    borderRadius: 8,
    padding: 10,
    fontSize: 12,
    color: "#161533",
    backgroundColor: "#FAF8F5",
    textAlignVertical: "top",
    marginTop: 6,
  },
});
