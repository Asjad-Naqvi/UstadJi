import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";
import { ArrowLeft, Bell, Map, ChevronRight, Clock, DollarSign, CheckCircle2, TrendingUp, AlertCircle } from "lucide-react-native";
import { COLORS } from "../theme/theme";
import { HzButton, HzCard } from "../components/HzPrimitives";

import { api } from "../services/api";

interface HzProviderDashboardScreenProps {
  onViewJob: (booking?: any) => void;
  onViewInbox: () => void;
  onViewDemandMap: () => void;
  onBack?: () => void;
  currentUser?: any;
}

export const HzProviderDashboardScreen: React.FC<HzProviderDashboardScreenProps> = ({
  onViewJob,
  onViewInbox,
  onViewDemandMap,
  onBack,
  currentUser,
}) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [activeJob, setActiveJob] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const providerId = currentUser?.id || "1e1a0343-e483-47f4-bdb3-7e120017ce84";
  const providerName = currentUser?.fullName || "Ustad Tariq Mehmood";

  React.useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => {
      fetchDashboardDataSilently();
    }, 4000);
    return () => clearInterval(interval);
  }, [providerId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const pending = await api.getBookings(undefined, providerId, "PENDING_ACCEPTANCE");
      setPendingRequests(pending);

      const inProgress = await api.getBookings(undefined, providerId, "IN_PROGRESS");
      const scheduled = await api.getBookings(undefined, providerId, "SCHEDULED");
      if (inProgress.length > 0) {
        setActiveJob(inProgress[0]);
      } else if (scheduled.length > 0) {
        setActiveJob(scheduled[0]);
      } else {
        setActiveJob(null);
      }
    } catch (e) {
      console.warn("Could not load provider dashboard data:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardDataSilently = async () => {
    try {
      const pending = await api.getBookings(undefined, providerId, "PENDING_ACCEPTANCE");
      setPendingRequests(pending);

      const inProgress = await api.getBookings(undefined, providerId, "IN_PROGRESS");
      const scheduled = await api.getBookings(undefined, providerId, "SCHEDULED");
      if (inProgress.length > 0) {
        setActiveJob(inProgress[0]);
      } else if (scheduled.length > 0) {
        setActiveJob(scheduled[0]);
      } else {
        setActiveJob(null);
      }
    } catch (e) {
      // silent
    }
  };

  const latestPending = pendingRequests[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Provider Header WITH BACK BUTTON */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <ArrowLeft size={22} color={COLORS.navy} />
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.providerName}>{providerName}</Text>
          <Text style={styles.providerTrade}>Verified Service Provider • Islamabad</Text>
        </View>
        <TouchableOpacity style={styles.bellBtn} onPress={onViewInbox}>
          <Bell size={20} color={COLORS.navy} />
          {pendingRequests.length > 0 && <View style={styles.notificationDot} />}
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
          <Text style={styles.statVal}>{pendingRequests.length}</Text>
          <Text style={styles.statLabel}>Pending Req</Text>
        </View>

        <View style={styles.statTile}>
          <Text style={styles.statVal}>{activeJob ? 1 : 0}</Text>
          <Text style={styles.statLabel}>Active Jobs</Text>
        </View>

        <View style={styles.statTile}>
          <Text style={[styles.statVal, { color: COLORS.green }]}>4.9 ★</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      {/* NEW REQUEST ALERT CARD (MODULE 5) */}
      {latestPending ? (
        <HzCard style={styles.alertCard} onPress={onViewInbox}>
          <View style={styles.alertHeader}>
            <View style={styles.newBadge}>
              <Clock size={12} color="#FFFFFF" />
              <Text style={styles.newBadgeText}>Action Required (30m Window)</Text>
            </View>
            <Text style={styles.timerCountdown}>{latestPending.bookingCode}</Text>
          </View>
          <Text style={styles.alertTitle}>New Request: {latestPending.serviceCategory}</Text>
          <Text style={styles.alertDesc}>
            Customer: {latestPending.customer?.fullName || "Consumer"} • {latestPending.issueDescription}
          </Text>
          <Text style={styles.alertPrice}>
            Estimated PKR {latestPending.estimatedPrice} • {String(latestPending.appointmentDate).slice(0, 10)} at {latestPending.startTime}
          </Text>

          <View style={styles.alertActionRow}>
            <Text style={styles.openInboxText}>Tap to Accept / Decline in Inbox →</Text>
          </View>
        </HzCard>
      ) : (
        <HzCard style={{ padding: 14, marginBottom: 14, backgroundColor: "#FFFFFF" }}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: "#161533" }}>No Pending Requests</Text>
          <Text style={{ fontSize: 11, color: "#9B9B9B", marginTop: 2 }}>You are all caught up!</Text>
        </HzCard>
      )}

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
              Sector F-7 and G-11 have high consumer demand.
            </Text>
          </View>
          <ChevronRight size={20} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      {/* ACTIVE JOB BANNER */}
      {activeJob && (
        <HzCard style={{ marginTop: 14 }} onPress={() => onViewJob(activeJob)}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: COLORS.navy }}>Current Ongoing Job ({activeJob.bookingCode})</Text>
            <Text style={{ fontSize: 11, fontWeight: "700", color: COLORS.navy, backgroundColor: "rgba(22, 21, 51, 0.1)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>
              {activeJob.status}
            </Text>
          </View>
          <Text style={{ fontSize: 13, color: "#1A1A1A", marginTop: 6, fontWeight: "600" }}>
            {activeJob.issueDescription}
          </Text>
          <Text style={{ fontSize: 12, color: "#9B9B9B", marginTop: 2 }}>
            Customer: {activeJob.customer?.fullName || "Consumer"} • {activeJob.serviceCategory}
          </Text>
          <HzButton
            label="Manage Job & Update Status →"
            style={{ marginTop: 12, height: 42 }}
            onPress={() => onViewJob(activeJob)}
          />
        </HzCard>
      )}

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
  backBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E3DB",
    marginRight: 8,
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
