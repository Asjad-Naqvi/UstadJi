import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";
import { Bell, Map, ChevronRight, Clock, DollarSign, CheckCircle2, TrendingUp, AlertCircle } from "lucide-react-native";
import { COLORS } from "../theme/theme";
import { HzButton, HzCard } from "../components/HzPrimitives";

interface HzProviderDashboardScreenProps {
  onViewJob: () => void;
  onViewInbox: () => void;
  onViewDemandMap: () => void;
}

export const HzProviderDashboardScreen: React.FC<HzProviderDashboardScreenProps> = ({
  onViewJob,
  onViewInbox,
  onViewDemandMap,
}) => {
  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Provider Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.providerName}>Ustad Tariq Mehmood</Text>
          <Text style={styles.providerTrade}>Master Plumber • Sector F-7, Islamabad</Text>
        </View>
        <TouchableOpacity style={styles.bellBtn} onPress={onViewInbox}>
          <Bell size={20} color={COLORS.navy} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* Your Status Toggle */}
      <HzCard style={styles.statusCard}>
        <View style={styles.statusRow}>
          <View>
            <Text style={styles.statusTitle}>Your Status</Text>
            <Text style={[styles.statusSubtitle, { color: isAvailable ? COLORS.green : "#9B9B9B" }]}>
              {isAvailable ? "Available for new bookings ✓" : "Unavailable (Hidden from consumers)"}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.statusTogglePill, { backgroundColor: isAvailable ? COLORS.green : "#9B9B9B" }]}
            onPress={() => setIsAvailable(!isAvailable)}
          >
            <Text style={styles.statusToggleText}>
              {isAvailable ? "Online ✓" : "Offline"}
            </Text>
          </TouchableOpacity>
        </View>
      </HzCard>

      {/* Stats Row */}
      <View style={styles.statsGrid}>
        <View style={styles.statTile}>
          <Text style={styles.statVal}>PKR 14,800</Text>
          <Text style={styles.statLabel}>Weekly Earnings</Text>
        </View>

        <View style={styles.statTile}>
          <Text style={styles.statVal}>18</Text>
          <Text style={styles.statLabel}>Completed Jobs</Text>
        </View>

        <View style={styles.statTile}>
          <Text style={[styles.statVal, { color: COLORS.green }]}>4.9 ★</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      {/* NEW REQUEST ALERT CARD (MODULE 5) */}
      <HzCard style={styles.alertCard} onPress={onViewInbox}>
        <View style={styles.alertHeader}>
          <View style={styles.newBadge}>
            <Clock size={12} color="#FFFFFF" />
            <Text style={styles.newBadgeText}>Action Required (30m Window)</Text>
          </View>
          <Text style={styles.timerCountdown}>24:18 left</Text>
        </View>
        <Text style={styles.alertTitle}>New Booking Request: Plumbing Leak</Text>
        <Text style={styles.alertDesc}>Zain Khan • House 24, Street 12, F-7/2 Islamabad</Text>
        <Text style={styles.alertPrice}>Estimated PKR 800 • Tomorrow at 10:00 AM</Text>

        <View style={styles.alertActionRow}>
          <Text style={styles.openInboxText}>Tap to Accept / Decline in Inbox →</Text>
        </View>
      </HzCard>

      {/* DEMAND HEATMAP BANNER */}
      <TouchableOpacity
        style={styles.heatmapBanner}
        activeOpacity={0.9}
        onPress={onViewDemandMap}
      >
        <View style={styles.heatmapContent}>
          <Map size={24} color="#FFFFFF" />
          <View style={{ flex: 1 }}>
            <Text style={styles.heatmapTitle}>High Demand Zones Active</Text>
            <Text style={styles.heatmapSub}>
              Sector F-7 and G-11 have surge demand for Plumbers (+15% higher rate).
            </Text>
          </View>
          <ChevronRight size={20} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      {/* ACTIVE JOB BANNER */}
      <HzCard style={{ marginTop: 14 }} onPress={onViewJob}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: COLORS.navy }}>Current Ongoing Job</Text>
          <Text style={{ fontSize: 11, fontWeight: "700", color: COLORS.navy, backgroundColor: "rgba(22, 21, 51, 0.1)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>
            IN PROGRESS
          </Text>
        </View>
        <Text style={{ fontSize: 13, color: "#1A1A1A", marginTop: 6, fontWeight: "600" }}>
          Main water pipe valve leaking in kitchen
        </Text>
        <Text style={{ fontSize: 12, color: "#9B9B9B", marginTop: 2 }}>
          Customer: Zain Khan • Sector F-7/2
        </Text>
        <HzButton
          label="Manage Job & Generate Invoice →"
          style={{ marginTop: 12, height: 42 }}
          onPress={onViewJob}
        />
      </HzCard>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F5",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  providerName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#161533",
  },
  providerTrade: {
    fontSize: 12,
    color: "#9B9B9B",
    marginTop: 2,
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E8E3DB",
  },
  notificationDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.orange,
  },
  statusCard: {
    marginBottom: 14,
    padding: 14,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#161533",
  },
  statusSubtitle: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: "500",
  },
  statusTogglePill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusToggleText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  statTile: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E8E3DB",
    alignItems: "center",
  },
  statVal: {
    fontSize: 15,
    fontWeight: "800",
    color: "#161533",
  },
  statLabel: {
    fontSize: 11,
    color: "#9B9B9B",
    marginTop: 3,
  },
  alertCard: {
    backgroundColor: "rgba(255, 107, 53, 0.08)",
    borderColor: COLORS.orange,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 16,
  },
  alertHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  newBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.orange,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  newBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  timerCountdown: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.orange,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#161533",
  },
  alertDesc: {
    fontSize: 12,
    color: "#555555",
    marginTop: 2,
  },
  alertPrice: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.navy,
    marginTop: 4,
  },
  alertActionRow: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 107, 53, 0.2)",
  },
  openInboxText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.orange,
  },
  heatmapBanner: {
    backgroundColor: "#161533",
    borderRadius: 16,
    padding: 16,
  },
  heatmapContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  heatmapTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  heatmapSub: {
    fontSize: 11,
    color: "#D1D5DB",
    marginTop: 2,
    lineHeight: 16,
  },
});
