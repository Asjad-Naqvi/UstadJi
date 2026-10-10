import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { ArrowLeft, Clock, Phone, MapPin, CheckCircle2, RotateCcw, XCircle, FileText } from "lucide-react-native";
import { COLORS } from "../theme/theme";
import { HzButton, HzCard } from "../components/HzPrimitives";

interface HzJobStatusScreenProps {
  onBack: () => void;
  onReschedule: () => void;
  onViewInvoice: () => void;
  onCancel: () => void;
}

export const HzJobStatusScreen: React.FC<HzJobStatusScreenProps> = ({
  onBack,
  onReschedule,
  onViewInvoice,
  onCancel,
}) => {
  const [jobPhase, setJobPhase] = useState<"SCHEDULED" | "IN_PROGRESS" | "COMPLETED">("SCHEDULED");

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
            <Text style={styles.codeText}>BK-1001 • Master Plumbing</Text>
            <View
              style={[
                styles.statusBadge,
                jobPhase === "SCHEDULED" && { backgroundColor: "rgba(76, 175, 132, 0.15)" },
                jobPhase === "IN_PROGRESS" && { backgroundColor: "rgba(22, 21, 51, 0.15)" },
                jobPhase === "COMPLETED" && { backgroundColor: "rgba(16, 185, 129, 0.2)" },
              ]}
            >
              <Text style={styles.statusBadgeText}>{jobPhase}</Text>
            </View>
          </View>

          <Text style={styles.jobHeading}>Main water pipe valve leaking in kitchen</Text>
          <Text style={styles.timeInfo}>📅 Tomorrow at 10:00 AM - 11:00 AM</Text>

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

        {/* Assigned Provider Card */}
        <HzCard style={styles.card}>
          <Text style={styles.cardSectionLabel}>Assigned Technician</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
            <View>
              <Text style={styles.pName}>Ustad Tariq Mehmood</Text>
              <Text style={styles.pTrade}>Master Plumber • 4.9 ★ (128 reviews)</Text>
            </View>
            <TouchableOpacity
              style={styles.callBtn}
              onPress={() => Alert.alert("Calling Ustad", "Dialing +92 333 1112233...")}
            >
              <Phone size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </HzCard>

        {/* Actions Stack */}
        <View style={{ gap: 10, marginTop: 10 }}>
          <HzButton
            label="Simulate Provider Arrived (IN PROGRESS)"
            variant="secondary"
            onPress={() => setJobPhase("IN_PROGRESS")}
          />

          <HzButton
            label="Simulate Work Finished (COMPLETED)"
            style={{ backgroundColor: COLORS.green }}
            onPress={() => setJobPhase("COMPLETED")}
          />

          <HzButton
            label="View Itemized Invoice (M8)"
            onPress={onViewInvoice}
          />

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
        </View>

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
});
