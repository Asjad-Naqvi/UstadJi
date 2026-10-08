import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
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

type AdminTab = "dashboard" | "users" | "disputes" | "monitoring";

export const HzAdminDashboardScreen: React.FC<{ onNavigate: (s: string) => void }> = ({
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  const stats = [
    { title: "Total Bookings", val: "1,420", change: "+14.2%", icon: TrendingUp, color: COLORS.green },
    { title: "Active Disputes", val: "3", change: "Requires review", icon: ShieldAlert, color: COLORS.orange },
    { title: "Ustads Online", val: "84 Ustads", change: "Islamabad / Rwp", icon: Users, color: COLORS.navy },
    { title: "Today Revenue", val: "PKR 148.5K", change: "+18%", icon: DollarSign, color: COLORS.green },
  ];

  const recentDisputes = [
    {
      id: "DSP-104",
      user: "Zain Khan",
      provider: "Ustad Tariq",
      issue: "Price mismatch on AC Capacitor",
      status: "OPEN",
      time: "12 mins ago",
    },
    {
      id: "DSP-103",
      user: "Bilal Ahmad",
      provider: "Ustad Rashid",
      issue: "Arrival delay > 45 mins",
      status: "UNDER REVIEW",
      time: "1 hr ago",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* ADMIN HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Admin Operations Center</Text>
          <Text style={styles.subtitle}>UstadJi Platform Control & AI Governance</Text>
        </View>
        <View style={styles.headerIconCircle}>
          <Bell size={18} color={COLORS.navy} />
        </View>
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
          style={[styles.tabBtn, activeTab === "monitoring" && styles.tabBtnActive]}
          onPress={() => setActiveTab("monitoring")}
        >
          <Activity size={16} color={activeTab === "monitoring" ? "#FFFFFF" : COLORS.navy} />
          <Text style={[styles.tabText, activeTab === "monitoring" && styles.tabTextActive]}>
            Monitoring
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "disputes" && styles.tabBtnActive]}
          onPress={() => setActiveTab("disputes")}
        >
          <ShieldAlert size={16} color={activeTab === "disputes" ? "#FFFFFF" : COLORS.navy} />
          <Text style={[styles.tabText, activeTab === "disputes" && styles.tabTextActive]}>
            Disputes (3)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "users" && styles.tabBtnActive]}
          onPress={() => setActiveTab("users")}
        >
          <Users size={16} color={activeTab === "users" ? "#FFFFFF" : COLORS.navy} />
          <Text style={[styles.tabText, activeTab === "users" && styles.tabTextActive]}>
            Users
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

      {/* AI SYSTEM HEALTH MONITOR */}
      <HzCard style={styles.healthCard}>
        <View style={styles.healthHeader}>
          <Activity size={20} color={COLORS.navy} />
          <Text style={styles.healthTitle}>AI Microservices Health</Text>
          <View style={styles.healthyPill}>
            <Text style={styles.healthyPillText}>All Systems Operational</Text>
          </View>
        </View>

        <View style={styles.serviceRow}>
          <Text style={styles.serviceName}>Claude Sonnet Vision AI</Text>
          <Text style={styles.serviceMeta}>142ms latency • 99.8% precision</Text>
        </View>

        <View style={styles.serviceRow}>
          <Text style={styles.serviceName}>Whisper Voice Transcription</Text>
          <Text style={styles.serviceMeta}>Urdu/English switcher active</Text>
        </View>

        <View style={styles.serviceRow}>
          <Text style={styles.serviceName}>Groq LLaMA NLU Agent</Text>
          <Text style={styles.serviceMeta}>85 requests/min • 0 failures</Text>
        </View>
      </HzCard>

      {/* DISPUTES SECTION */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Active Disputes requiring Admin Action</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {recentDisputes.map((dsp) => (
        <HzCard key={dsp.id} style={styles.disputeCard}>
          <View style={styles.disputeHeader}>
            <Text style={styles.disputeId}>{dsp.id}</Text>
            <View style={styles.openBadge}>
              <Text style={styles.openBadgeText}>{dsp.status}</Text>
            </View>
          </View>

          <Text style={styles.disputeUsers}>
            {dsp.user} (Customer) ↔ {dsp.provider} (Provider)
          </Text>
          <Text style={styles.disputeIssue}>Issue: {dsp.issue}</Text>
          <Text style={styles.disputeTime}>{dsp.time}</Text>

          <View style={styles.disputeActions}>
            <TouchableOpacity style={styles.resolveBtn}>
              <Text style={styles.resolveBtnText}>Open Case & Chat</Text>
            </TouchableOpacity>
          </View>
        </HzCard>
      ))}

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
  disputeTime: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginBottom: 10,
  },
  disputeActions: {
    flexDirection: "row",
  },
  resolveBtn: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  resolveBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
});
