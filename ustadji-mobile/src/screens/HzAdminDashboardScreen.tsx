import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  Settings,
  TrendingUp,
  Activity,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Bell,
} from "lucide-react-native";
import { COLORS } from "../theme/theme";
import { HzCard, HzButton } from "../components/HzPrimitives";
import { api } from "../services/api";

type AdminTab = "dashboard" | "users" | "disputes" | "monitoring";

export const HzAdminDashboardScreen: React.FC<{ onNavigate: (s: string) => void }> = ({
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [disputesList, setDisputesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDisputes();
  }, []);

  const loadDisputes = async () => {
    try {
      setLoading(true);
      const data = await api.getBookings(undefined, undefined, "DISPUTED");
      setDisputesList(data || []);
    } catch (e) {
      console.warn("Error loading disputed bookings:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminResolve = async (bookingId: string, resolution: "COMPLETED" | "CANCELLED") => {
    try {
      setLoading(true);
      const note = resolution === "COMPLETED"
        ? "Admin Resolution: Dispute settled in favor of Provider (Payout released)"
        : "Admin Resolution: Dispute settled in favor of Customer (Refund issued)";

      await api.updateBookingStatus(bookingId, resolution, note, "ADMIN");
      Alert.alert(
        "Dispute Resolved ✓",
        resolution === "COMPLETED"
          ? "Case closed: Payout released to provider."
          : "Case closed: Customer refunded & booking cancelled."
      );
      loadDisputes();
    } catch (e) {
      Alert.alert("Error Resolving Dispute", (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { title: "Total Bookings", val: "1,420", change: "+14.2%", icon: TrendingUp, color: COLORS.green },
    { title: "Active Disputes", val: String(disputesList.length), change: "Requires review", icon: ShieldAlert, color: COLORS.orange },
    { title: "Ustads Online", val: "84 Ustads", change: "Islamabad / Rwp", icon: Users, color: COLORS.navy },
    { title: "Today Revenue", val: "PKR 148.5K", change: "+18%", icon: DollarSign, color: COLORS.green },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* ADMIN HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Admin Operations Center</Text>
          <Text style={styles.subtitle}>UstadJi Platform Control & Mediation Hub</Text>
        </View>
        <TouchableOpacity style={styles.headerIconCircle} onPress={loadDisputes}>
          <Bell size={18} color={COLORS.navy} />
        </TouchableOpacity>
      </View>

      {/* ADMIN SUB-NAV */}
      <View style={styles.tabNav}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "dashboard" && styles.tabBtnActive]}
          onPress={() => setActiveTab("dashboard")}
        >
          <LayoutDashboard size={16} color={activeTab === "dashboard" ? "#FFFFFF" : COLORS.navy} />
          <Text style={[styles.tabText, activeTab === "dashboard" && styles.tabTextActive]}>
            Overview
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "disputes" && styles.tabBtnActive]}
          onPress={() => setActiveTab("disputes")}
        >
          <ShieldAlert size={16} color={activeTab === "disputes" ? "#FFFFFF" : COLORS.navy} />
          <Text style={[styles.tabText, activeTab === "disputes" && styles.tabTextActive]}>
            Disputes ({disputesList.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "monitoring" && styles.tabBtnActive]}
          onPress={() => setActiveTab("monitoring")}
        >
          <Activity size={16} color={activeTab === "monitoring" ? "#FFFFFF" : COLORS.navy} />
          <Text style={[styles.tabText, activeTab === "monitoring" && styles.tabTextActive]}>
            Monitoring
          </Text>
        </TouchableOpacity>
      </View>

      {/* STAT CARDS GRID */}
      <View style={styles.statsGrid}>
        {stats.map((st, i) => {
          const Icon = st.icon;
          return (
            <HzCard key={i} style={styles.statCard}>
              <View style={styles.statHeader}>
                <Text style={styles.statTitle}>{st.title}</Text>
                <Icon size={18} color={st.color} />
              </View>
              <Text style={styles.statVal}>{st.val}</Text>
              <Text style={[styles.statChange, { color: st.color }]}>{st.change}</Text>
            </HzCard>
          );
        })}
      </View>

      {/* DISPUTES SECTION */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Active Disputes Requiring Admin Resolution ({disputesList.length})
        </Text>
        <TouchableOpacity onPress={loadDisputes}>
          <Text style={styles.seeAll}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {disputesList.length === 0 ? (
        <HzCard style={styles.disputeCard}>
          <Text style={{ fontSize: 13, color: "#666666", textAlign: "center", paddingVertical: 10 }}>
            🎉 No open disputes! All bookings are running smoothly.
          </Text>
        </HzCard>
      ) : (
        disputesList.map((dsp) => (
          <HzCard key={dsp.id} style={styles.disputeCard}>
            <View style={styles.disputeHeader}>
              <Text style={styles.disputeId}>{dsp.bookingCode || dsp.id.slice(0, 8)} • {dsp.serviceCategory}</Text>
              <View style={styles.openBadge}>
                <Text style={styles.openBadgeText}>DISPUTED</Text>
              </View>
            </View>

            <Text style={styles.disputeUsers}>
              👤 Customer: {dsp.customer?.fullName || dsp.customerId}
            </Text>
            <Text style={styles.disputeUsers}>
              🛠️ Provider: {dsp.provider?.fullName || dsp.providerId}
            </Text>
            <Text style={styles.disputeIssue}>
              Reason: {dsp.cancellationReason || "Dispute logged via mobile app"}
            </Text>

            {dsp.statusHistory && dsp.statusHistory.length > 0 && (
              <Text style={{ fontSize: 11, color: "#888888", marginTop: 4 }}>
                Last changed by: {dsp.statusHistory[0].changedBy} ({new Date(dsp.statusHistory[0].createdAt).toLocaleTimeString()})
              </Text>
            )}

            <View style={{ gap: 8, marginTop: 12 }}>
              <HzButton
                label="Resolve: Release Payout to Provider"
                style={{ backgroundColor: COLORS.green }}
                onPress={() => handleAdminResolve(dsp.id, "COMPLETED")}
              />
              <HzButton
                label="Resolve: Issue Full Refund & Cancel"
                variant="danger"
                onPress={() => handleAdminResolve(dsp.id, "CANCELLED")}
              />
            </View>
          </HzCard>
        ))
      )}

      {/* AI SYSTEM HEALTH MONITOR */}
      <HzCard style={styles.healthCard}>
        <View style={styles.healthHeader}>
          <Activity size={20} color={COLORS.navy} />
          <Text style={styles.healthTitle}>Platform Health</Text>
          <View style={styles.healthyPill}>
            <Text style={styles.healthyPillText}>100% Operational</Text>
          </View>
        </View>

        <View style={styles.serviceRow}>
          <Text style={styles.serviceName}>Dispute Settlement Engine</Text>
          <Text style={styles.serviceMeta}>Escrow lock active</Text>
        </View>
        <View style={styles.serviceRow}>
          <Text style={styles.serviceName}>NestJS Backend API</Text>
          <Text style={styles.serviceMeta}>Port 4000 • Connected</Text>
        </View>
      </HzCard>

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
    justifyContent: "space-between",
    alignItems: "center",
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
  headerIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E8E3DB",
  },
  tabNav: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  tabBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8E3DB",
  },
  tabBtnActive: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.navy,
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    width: "48%",
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  statTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  statVal: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.navy,
  },
  statChange: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },
  healthCard: {
    marginTop: 16,
    marginBottom: 20,
    gap: 10,
  },
  healthHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  healthTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.navy,
  },
  healthyPill: {
    marginLeft: "auto",
    backgroundColor: "rgba(76, 175, 132, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  healthyPillText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.green,
  },
  serviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.bg,
  },
  serviceName: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.navy,
  },
  serviceMeta: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.navy,
  },
  seeAll: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.navy,
  },
  disputeCard: {
    marginBottom: 12,
    padding: 14,
  },
  disputeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  disputeId: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.navy,
  },
  openBadge: {
    backgroundColor: "rgba(255, 107, 53, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  openBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.orange,
  },
  disputeUsers: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.navy,
    marginBottom: 4,
  },
  disputeIssue: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
});
