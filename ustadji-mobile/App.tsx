import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
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
import { HzBookingScheduleScreen } from "./src/screens/HzBookingScheduleScreen";
import { HzCard, HzButton } from "./src/components/HzPrimitives";
import { api } from "./src/services/api";
import { Calendar, Clock, CheckCircle2, RotateCcw, AlertTriangle } from "lucide-react-native";

type UserRole = "consumer" | "provider" | "admin";

export default function App() {
  const [activeTab, setActiveTab] = useState<HzNavTabId>("home");
  const [currentScreen, setCurrentScreen] = useState<string>("home");
  const [role, setRole] = useState<UserRole>("consumer");
  const [liveBookings, setLiveBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    if (currentScreen === "bookings") {
      fetchBookings();
    }
  }, [currentScreen]);

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const data = await api.getBookings();
      setLiveBookings(data);
    } catch (e) {
      console.warn("Failed to load bookings:", e);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen);
    if (
      screen === "home" ||
      screen === "ai_chat" ||
      screen === "explore" ||
      screen === "bookings" ||
      screen === "profile" ||
      screen === "admin"
    ) {
      setActiveTab(screen as HzNavTabId);
    }
  };

  const handleTabChange = (tabId: HzNavTabId) => {
    setActiveTab(tabId);
    setCurrentScreen(tabId);
  };

  const handleStatusChange = async (bookingId: string, status: "IN_PROGRESS" | "COMPLETED") => {
    try {
      await api.updateBookingStatus(bookingId, status);
      fetchBookings();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleAcceptBooking = async (bookingId: string, providerId: string) => {
    try {
      await api.acceptBooking(bookingId, providerId);
      fetchBookings();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const renderContent = () => {
    switch (currentScreen) {
      case "home":
        return <HzHomeScreen onNavigate={handleNavigate} />;
      case "schedule":
        return <HzBookingScheduleScreen onNavigate={handleNavigate} />;
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
          <ScrollView style={styles.tabScreenContainer}>
            <Text style={styles.tabScreenTitle}>Explore Services & Bookings</Text>
            <HzCard style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.navy }}>
                🛠️ Plumber Services (Ustad Tariq)
              </Text>
              <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 4 }}>
                Manual Approval • 30-min response window • PKR 800/hr
              </Text>
              <HzButton
                label="Check Slots & Schedule (M5)"
                style={{ marginTop: 10 }}
                onPress={() => handleNavigate("schedule")}
              />
            </HzCard>

            <HzCard style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.navy }}>
                ⚡ HVAC & AC Repair (Ustad Rashid)
              </Text>
              <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 4 }}>
                Instant Auto-Confirm • 30m Buffer Gap • PKR 1,000/hr
              </Text>
              <HzButton
                label="Instant Book AC Service"
                style={{ marginTop: 10 }}
                onPress={() => handleNavigate("schedule")}
              />
            </HzCard>
          </ScrollView>
        );

      case "bookings":
        return (
          <ScrollView style={styles.tabScreenContainer}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <Text style={styles.tabScreenTitle}>M5 Booking Lifecycle</Text>
              <TouchableOpacity onPress={fetchBookings}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: COLORS.navy }}>↻ Refresh</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.newBookingCta}
              onPress={() => handleNavigate("schedule")}
            >
              <Calendar size={18} color="#FFFFFF" />
              <Text style={styles.newBookingCtaText}>+ Create New Booking (Slot Lock Engine)</Text>
            </TouchableOpacity>

            {loadingBookings && <ActivityIndicator size="small" color={COLORS.navy} style={{ marginVertical: 10 }} />}

            {liveBookings.map((b) => {
              const isPending = b.status === "PENDING_ACCEPTANCE";
              const isScheduled = b.status === "SCHEDULED";
              const isInProgress = b.status === "IN_PROGRESS";
              const isCompleted = b.status === "COMPLETED";

              return (
                <HzCard key={b.id} style={{ marginBottom: 12 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontSize: 15, fontWeight: "700", color: COLORS.navy }}>
                      {b.bookingCode} • {b.serviceCategory}
                    </Text>
                    <View
                      style={[
                        styles.statusPill,
                        isPending && { backgroundColor: "rgba(255, 107, 53, 0.15)" },
                        isScheduled && { backgroundColor: "rgba(76, 175, 132, 0.15)" },
                        isInProgress && { backgroundColor: "rgba(22, 21, 51, 0.15)" },
                        isCompleted && { backgroundColor: "rgba(16, 185, 129, 0.2)" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          isPending && { color: COLORS.orange },
                          isScheduled && { color: COLORS.green },
                          isInProgress && { color: COLORS.navy },
                          isCompleted && { color: "#059669" },
                        ]}
                      >
                        {b.status}
                      </Text>
                    </View>
                  </View>

                  <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 4 }}>
                    Provider: {b.provider?.fullName || "Assigned Ustad"}
                  </Text>
                  <Text style={{ fontSize: 12, color: COLORS.navy, fontWeight: "600", marginTop: 2 }}>
                    📅 {String(b.appointmentDate).slice(0, 10)} at {b.startTime} - {b.endTime}
                  </Text>

                  {/* ACTION BUTTONS ACCORDING TO CURRENT STATUS */}
                  <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
                    {isPending && (
                      <HzButton
                        label="Provider Accept (30m window)"
                        style={{ flex: 1, height: 38 }}
                        onPress={() => handleAcceptBooking(b.id, b.providerId)}
                      />
                    )}
                    {isScheduled && (
                      <HzButton
                        label="Start Job (IN PROGRESS)"
                        style={{ flex: 1, height: 38 }}
                        onPress={() => handleStatusChange(b.id, "IN_PROGRESS")}
                      />
                    )}
                    {isInProgress && (
                      <HzButton
                        label="Complete Job (COMPLETED)"
                        style={{ flex: 1, height: 38, backgroundColor: COLORS.green }}
                        onPress={() => handleStatusChange(b.id, "COMPLETED")}
                      />
                    )}
                    <HzButton
                      label="Reschedule"
                      variant="secondary"
                      style={{ width: 100, height: 38 }}
                      onPress={() => handleNavigate("schedule")}
                    />
                  </View>
                </HzCard>
              );
            })}

            <View style={{ height: 40 }} />
          </ScrollView>
        );

      case "profile":
        return (
          <ScrollView style={styles.tabScreenContainer}>
            <Text style={styles.tabScreenTitle}>Active User Profile</Text>
            <HzCard style={{ alignItems: "center", paddingVertical: 20 }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: COLORS.navy,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                <Text style={{ fontSize: 24, color: "#FFFFFF", fontWeight: "700" }}>Z</Text>
              </View>
              <Text style={{ fontSize: 18, fontWeight: "700", color: COLORS.navy }}>Zain Khan</Text>
              <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }}>
                zain@ustadji.pk • Sector F-7/2, Islamabad
              </Text>
              <Text style={{ fontSize: 12, color: COLORS.green, fontWeight: "600", marginTop: 4 }}>
                ✓ Verified Customer Account
              </Text>
            </HzCard>
          </ScrollView>
        );

      default:
        return <HzHomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpoStatusBar style="dark" />

      {/* TOP HEADER */}
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

      {/* MAIN BODY */}
      <View style={styles.body}>{renderContent()}</View>

      {/* FIXED BOTTOM NAVIGATION */}
      <HzBottomNav activeTab={activeTab} onTabChange={handleTabChange} userRole={role} />
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
  },
  newBookingCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.navy,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 16,
    marginTop: 4,
  },
  newBookingCtaText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
});
