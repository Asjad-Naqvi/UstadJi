import React, { useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { COLORS } from "./src/theme/theme";
import { HzBottomNav, HzNavTabId } from "./src/components/HzBottomNav";
import { HzHomeScreen } from "./src/screens/HzHomeScreen";
import { HzAiBookingChatScreen } from "./src/screens/HzAiBookingChatScreen";
import { HzIssueCaptureScreen } from "./src/screens/HzIssueCaptureScreen";
import { HzIssueAnalyzingScreen } from "./src/screens/HzIssueAnalyzingScreen";
import { HzIssueSummaryScreen } from "./src/screens/HzIssueSummaryScreen";
import { HzAdminDashboardScreen } from "./src/screens/HzAdminDashboardScreen";
import { UserCheck, Shield, Sparkles, Calendar, User } from "lucide-react-native";
import { HzCard, HzButton } from "./src/components/HzPrimitives";

type UserRole = "consumer" | "provider" | "admin";

export default function App() {
  const [activeTab, setActiveTab] = useState<HzNavTabId>("home");
  const [currentScreen, setCurrentScreen] = useState<string>("home");
  const [role, setRole] = useState<UserRole>("consumer");

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen);
    if (screen === "home" || screen === "ai_chat" || screen === "explore" || screen === "bookings" || screen === "profile" || screen === "admin") {
      setActiveTab(screen as HzNavTabId);
    }
  };

  const handleTabChange = (tabId: HzNavTabId) => {
    setActiveTab(tabId);
    setCurrentScreen(tabId);
  };

  const renderContent = () => {
    switch (currentScreen) {
      case "home":
        return <HzHomeScreen onNavigate={handleNavigate} />;
      case "ai_chat":
        return <HzAiBookingChatScreen onNavigate={handleNavigate} />;
      case "issue_capture":
        return <HzIssueCaptureScreen onNavigate={handleNavigate} />;
      case "issue_analyzing":
        return <HzIssueAnalyzingScreen onNavigate={handleNavigate} />;
      case "issue_summary":
        return <HzIssueSummaryScreen onNavigate={handleNavigate} />;
      case "admin":
        return <HzAdminDashboardScreen onNavigate={handleNavigate} />;

      case "explore":
        return (
          <View style={styles.tabScreenContainer}>
            <Text style={styles.tabScreenTitle}>Explore Services & Ustads</Text>
            <HzCard style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.navy }}>🛠️ Plumber Services</Text>
              <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 4 }}>42 Ustads ready in Islamabad</Text>
              <HzButton label="Find Plumber via AI" style={{ marginTop: 10 }} onPress={() => handleNavigate("ai_chat")} />
            </HzCard>
            <HzCard style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.navy }}>⚡ Electrician Services</Text>
              <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 4 }}>58 Ustads online near F-7</Text>
              <HzButton label="Report Electrical Issue" style={{ marginTop: 10 }} onPress={() => handleNavigate("issue_capture")} />
            </HzCard>
          </View>
        );

      case "bookings":
        return (
          <View style={styles.tabScreenContainer}>
            <Text style={styles.tabScreenTitle}>My Active & Past Bookings</Text>
            <HzCard style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: COLORS.navy }}>AC Repair & Gas Top-up</Text>
                <Text style={{ fontSize: 12, fontWeight: "700", color: COLORS.green }}>EN ROUTE</Text>
              </View>
              <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 4 }}>Ustad Tariq Mehmood • Arriving in 15m</Text>
              <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
                <HzButton label="Track Ustads" style={{ flex: 1, height: 40 }} onPress={() => {}} />
                <HzButton label="Call" variant="secondary" style={{ width: 80, height: 40 }} onPress={() => {}} />
              </View>
            </HzCard>
          </View>
        );

      case "profile":
        return (
          <View style={styles.tabScreenContainer}>
            <Text style={styles.tabScreenTitle}>Customer Profile</Text>
            <HzCard style={{ alignItems: "center", paddingVertical: 20 }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.navy, alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                <Text style={{ fontSize: 24, color: "#FFFFFF", fontWeight: "700" }}>Z</Text>
              </View>
              <Text style={{ fontSize: 18, fontWeight: "700", color: COLORS.navy }}>Zain Khan</Text>
              <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }}>📍 Sector F-7/2, Islamabad</Text>
              <Text style={{ fontSize: 12, color: COLORS.green, fontWeight: "600", marginTop: 4 }}>✓ Verified Customer</Text>
            </HzCard>
          </View>
        );

      default:
        return <HzHomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpoStatusBar style="dark" />

      {/* TOP ROLE SWITCHER HEADER */}
      <View style={styles.topBar}>
        <Text style={styles.brandTitle}>UstadJi</Text>

        <View style={styles.roleToggleGroup}>
          <TouchableOpacity
            style={[styles.roleBtn, role === "consumer" && styles.roleBtnActive]}
            onPress={() => {
              setRole("consumer");
              handleNavigate("home");
            }}
          >
            <Text style={[styles.roleText, role === "consumer" && styles.roleTextActive]}>Consumer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleBtn, role === "admin" && styles.roleBtnActive]}
            onPress={() => {
              setRole("admin");
              handleNavigate("admin");
            }}
          >
            <Text style={[styles.roleText, role === "admin" && styles.roleTextActive]}>Admin</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MAIN SCREEN BODY */}
      <View style={styles.body}>{renderContent()}</View>

      {/* FIXED BOTTOM NAVIGATION BAR */}
      <HzBottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        userRole={role}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingTop: StatusBar.currentHeight || 0,
  },
  topBar: {
    height: 52,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E3DB",
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.navy,
    letterSpacing: -0.5,
  },
  roleToggleGroup: {
    flexDirection: "row",
    backgroundColor: COLORS.bg,
    padding: 3,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E3DB",
  },
  roleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  roleBtnActive: {
    backgroundColor: COLORS.navy,
  },
  roleText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.navy,
  },
  roleTextActive: {
    color: "#FFFFFF",
  },
  body: {
    flex: 1,
  },
  tabScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
    padding: 16,
  },
  tabScreenTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.navy,
    marginBottom: 16,
  },
});
