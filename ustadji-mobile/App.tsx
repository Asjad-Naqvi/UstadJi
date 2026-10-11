import React, { useState } from "react";
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { COLORS } from "./src/theme/theme";
import { HzBottomNav } from "./src/components/HzBottomNav";
import { HzLoginScreen } from "./src/screens/HzLoginScreen";
import { HzRoleSelectionScreen } from "./src/screens/HzRoleSelectionScreen";
import { HzChatScreen } from "./src/screens/HzChatScreen";
import { HzHomeScreen } from "./src/screens/HzHomeScreen";
import { HzBookingScheduleScreen } from "./src/screens/HzBookingScheduleScreen";
import { HzAiBookingChatScreen } from "./src/screens/HzAiBookingChatScreen";
import { HzIssueCaptureScreen } from "./src/screens/HzIssueCaptureScreen";
import { HzIssueAnalyzingScreen } from "./src/screens/HzIssueAnalyzingScreen";
import { HzIssueSummaryScreen } from "./src/screens/HzIssueSummaryScreen";
import { HzProviderResultsScreen } from "./src/screens/HzProviderResultsScreen";
import { HzProviderProfileScreen } from "./src/screens/HzProviderProfileScreen";
import { HzDateTimePickerScreen } from "./src/screens/HzDateTimePickerScreen";
import { HzBookingConfirmationScreen } from "./src/screens/HzBookingConfirmationScreen";
import { HzAwaitingScreen } from "./src/screens/HzAwaitingScreen";
import { HzJobStatusScreen } from "./src/screens/HzJobStatusScreen";
import { HzCustomerInvoiceViewScreen } from "./src/screens/HzCustomerInvoiceViewScreen";
import { HzProviderDashboardScreen } from "./src/screens/HzProviderDashboardScreen";
import { HzProviderInboxScreen } from "./src/screens/HzProviderInboxScreen";
import { HzProviderActiveJobScreen } from "./src/screens/HzProviderActiveJobScreen";
import { HzAdminDashboardScreen } from "./src/screens/HzAdminDashboardScreen";
import { HzCard, HzButton } from "./src/components/HzPrimitives";
import { LogOut, Heart, User, Shield } from "lucide-react-native";

export default function App() {
  // App opens directly to the Login page as requested
  const [currentScreen, setCurrentScreen] = useState<string>("login");
  const [userRole, setUserRole] = useState<"consumer" | "provider" | "admin">("consumer");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("explore");

  // Flow State
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [bookingDate, setBookingDate] = useState("Tomorrow");
  const [bookingTime, setBookingTime] = useState("10:00 AM - 11:00 AM");
  const [currentBooking, setCurrentBooking] = useState<any>(null);

  const handleLoginSuccess = (role: "consumer" | "provider" | "admin", user?: any) => {
    setUserRole(role);
    setCurrentUser(user);
    if (role === "consumer") {
      setActiveTab("explore");
      setCurrentScreen("main");
    } else if (role === "provider") {
      setActiveTab("dashboard");
      setCurrentScreen("main");
    } else {
      setCurrentScreen("admin");
    }
  };

  const handleSignOut = () => {
    setCurrentScreen("login");
    setCurrentUser(null);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "login":
        return (
          <HzLoginScreen
            onLoginSuccess={handleLoginSuccess}
            onRegister={() => setCurrentScreen("role-select")}
            onRoleSelect={() => setCurrentScreen("role-select")}
          />
        );

      case "role-select":
        return (
          <HzRoleSelectionScreen
            onSelect={(role) => {
              setUserRole(role);
              handleLoginSuccess(role);
            }}
            onBack={() => setCurrentScreen("login")}
          />
        );

      case "admin":
        return (
          <View style={{ flex: 1 }}>
            <View style={styles.adminTopBar}>
              <Text style={styles.adminTitle}>Admin Portal</Text>
              <TouchableOpacity onPress={handleSignOut} style={styles.signOutBtn}>
                <LogOut size={16} color="#DC2626" />
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
            <HzAdminDashboardScreen onNavigate={(s) => setCurrentScreen("login")} />
          </View>
        );

      // CONSUMER & PROVIDER SUB-FLOW SCREENS (Full Screen Flow)
      case "chat":
        return (
          <HzChatScreen
            onFindProvider={() => setCurrentScreen("provider-results")}
            onReportIssue={() => setCurrentScreen("issue-capture")}
            onTrackBooking={() => setCurrentScreen("job-status")}
            onNewAIBooking={() => setCurrentScreen("ai-booking-chat")}
          />
        );

      case "ai-booking-chat":
        return (
          <HzAiBookingChatScreen
            onNavigate={(s) => {
              if (s === "home") setCurrentScreen("main");
              else if (s === "issue_capture") setCurrentScreen("issue-capture");
              else setCurrentScreen("provider-results");
            }}
          />
        );

      case "issue-capture":
        return (
          <HzIssueCaptureScreen
            onNavigate={(s) => {
              if (s === "home") setCurrentScreen("main");
              else setCurrentScreen("issue-analyzing");
            }}
          />
        );

      case "issue-analyzing":
        return (
          <HzIssueAnalyzingScreen
            onNavigate={() => setCurrentScreen("issue-summary")}
          />
        );

      case "issue-summary":
        return (
          <HzIssueSummaryScreen
            onNavigate={(s) => {
              if (s === "issue_capture") setCurrentScreen("issue-capture");
              else setCurrentScreen("provider-results");
            }}
          />
        );

      case "provider-results":
        return (
          <HzProviderResultsScreen
            onBack={() => setCurrentScreen("main")}
            onViewProfile={(p) => {
              setSelectedProvider(p);
              setCurrentScreen("provider-profile");
            }}
            onBookProvider={(p) => {
              setSelectedProvider(p);
              setCurrentScreen("date-time-picker");
            }}
          />
        );

      case "provider-profile":
        return (
          <HzProviderProfileScreen
            provider={selectedProvider}
            onBack={() => setCurrentScreen("provider-results")}
            onBook={() => setCurrentScreen("date-time-picker")}
          />
        );

      case "date-time-picker":
        return (
          <HzDateTimePickerScreen
            onBack={() => setCurrentScreen("provider-results")}
            onConfirm={(d, t) => {
              setBookingDate(d);
              setBookingTime(t);
              setCurrentScreen("booking-confirm");
            }}
          />
        );

      case "booking-confirm":
        return (
          <HzBookingConfirmationScreen
            selectedDate={bookingDate}
            selectedTime={bookingTime}
            selectedProvider={selectedProvider}
            currentUser={currentUser}
            onBack={() => setCurrentScreen("date-time-picker")}
            onConfirm={(b) => {
              setCurrentBooking(b);
              if (b?.status === "SCHEDULED") {
                setCurrentScreen("job-status");
              } else {
                setCurrentScreen("awaiting");
              }
            }}
          />
        );

      case "awaiting":
        return (
          <HzAwaitingScreen
            booking={currentBooking}
            onBack={() => {
              setActiveTab("bookings");
              setCurrentScreen("main");
            }}
            onCancel={() => {
              setActiveTab("bookings");
              setCurrentScreen("main");
            }}
            onAccepted={() => setCurrentScreen("job-status")}
          />
        );

      case "job-status":
        return (
          <HzJobStatusScreen
            booking={currentBooking}
            onBack={() => setCurrentScreen("main")}
            onReschedule={() => setCurrentScreen("date-time-picker")}
            onViewInvoice={() => setCurrentScreen("invoice-view")}
            onCancel={() => setCurrentScreen("main")}
          />
        );

      case "invoice-view":
        return (
          <HzCustomerInvoiceViewScreen
            booking={currentBooking}
            onBack={() => setCurrentScreen("job-status")}
            onDone={() => setCurrentScreen("main")}
          />
        );

      case "provider-active-job":
        return (
          <HzProviderActiveJobScreen
            booking={currentBooking}
            onBack={() => setCurrentScreen("main")}
            onFinishJob={() => setCurrentScreen("main")}
          />
        );

      // MAIN TAB NAVIGATION (CONSUMER & PROVIDER)
      case "main":
      default:
        return (
          <View style={{ flex: 1 }}>
            {/* Consumer Tab Views */}
            {userRole === "consumer" && (
              <>
                {activeTab === "explore" && (
                  <HzHomeScreen
                    onBack={() => setCurrentScreen("login")}
                    onNavigate={(screen) => {
                      if (screen === "ai_chat") setCurrentScreen("chat");
                      else if (screen === "issue_capture") setCurrentScreen("issue-capture");
                      else if (screen === "explore") setCurrentScreen("provider-results");
                      else if (screen === "provider_profile") setCurrentScreen("provider-results");
                      else if (screen === "role_selection") setCurrentScreen("login");
                    }}
                  />
                )}
                {activeTab === "chat" && (
                  <HzChatScreen
                    onFindProvider={() => setCurrentScreen("provider-results")}
                    onReportIssue={() => setCurrentScreen("issue-capture")}
                    onTrackBooking={() => setCurrentScreen("job-status")}
                    onNewAIBooking={() => setCurrentScreen("ai-booking-chat")}
                  />
                )}
                {activeTab === "bookings" && (
                  <HzBookingScheduleScreen
                    currentUser={currentUser}
                    onNavigate={(screen) => {
                      if (screen === "home" || screen === "explore") setActiveTab("explore");
                      else if (screen === "bookings") setActiveTab("bookings");
                      else setCurrentScreen(screen);
                    }}
                    onSelectBooking={(b, screenName) => {
                      if (b) setCurrentBooking(b);
                      setCurrentScreen(screenName);
                    }}
                  />
                )}
                {activeTab === "favourites" && (
                  <ScrollView style={styles.tabContent}>
                    <Text style={styles.tabHeading}>Saved Favourite Ustads</Text>
                    <HzCard style={{ padding: 16 }}>
                      <Text style={{ fontSize: 15, fontWeight: "700", color: "#161533" }}>
                        Ustad Tariq Mehmood
                      </Text>
                      <Text style={{ fontSize: 12, color: "#9B9B9B", marginTop: 2 }}>
                        Master Plumber • 4.9 ★ • F-7/2 Islamabad
                      </Text>
                      <HzButton
                        label="Book Again"
                        style={{ marginTop: 12, height: 40 }}
                        onPress={() => setCurrentScreen("provider-results")}
                      />
                    </HzCard>
                  </ScrollView>
                )}
                {activeTab === "profile" && (
                  <ScrollView style={styles.tabContent}>
                    <Text style={styles.tabHeading}>Consumer Profile</Text>
                    <HzCard style={styles.profileCard}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {currentUser?.fullName ? currentUser.fullName.charAt(0) : "Z"}
                        </Text>
                      </View>
                      <Text style={styles.profileName}>{currentUser?.fullName || "Zain Khan"}</Text>
                      <Text style={styles.profileMeta}>{currentUser?.email || "zain@ustadji.pk"} • {currentUser?.phone || "+92 300 5551234"}</Text>
                      <Text style={styles.profileSector}>📍 Sector F-7/2, Islamabad</Text>

                      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                        <LogOut size={16} color="#DC2626" />
                        <Text style={styles.signOutButtonText}>Sign Out (Back to Login)</Text>
                      </TouchableOpacity>
                    </HzCard>
                  </ScrollView>
                )}
              </>
            )}

            {/* Provider Tab Views */}
            {userRole === "provider" && (
              <>
                {activeTab === "dashboard" && (
                  <HzProviderDashboardScreen
                    currentUser={currentUser}
                    onBack={() => setCurrentScreen("login")}
                    onViewJob={(b) => {
                      if (b) setCurrentBooking(b);
                      setCurrentScreen("provider-active-job");
                    }}
                    onViewInbox={() => setActiveTab("inbox")}
                    onViewDemandMap={() => {}}
                  />
                )}
                {activeTab === "inbox" && (
                  <HzProviderInboxScreen
                    providerId={currentUser?.id || "1e1a0343-e483-47f4-bdb3-7e120017ce84"}
                    onBack={() => setActiveTab("dashboard")}
                    onJobAccepted={(b) => {
                      if (b) setCurrentBooking(b);
                      setCurrentScreen("provider-active-job");
                    }}
                  />
                )}
                {activeTab === "profile" && (
                  <ScrollView style={styles.tabContent}>
                    <Text style={styles.tabHeading}>Service Provider Profile</Text>
                    <HzCard style={styles.profileCard}>
                      <View style={[styles.avatar, { backgroundColor: COLORS.navy }]}>
                        <Text style={styles.avatarText}>T</Text>
                      </View>
                      <Text style={styles.profileName}>Ustad Tariq Mehmood</Text>
                      <Text style={styles.profileMeta}>Master Plumber • 12 yrs exp</Text>
                      <Text style={styles.profileSector}>PKR 800/hr • Verified CNIC ✓</Text>

                      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                        <LogOut size={16} color="#DC2626" />
                        <Text style={styles.signOutButtonText}>Sign Out (Back to Login)</Text>
                      </TouchableOpacity>
                    </HzCard>
                  </ScrollView>
                )}
              </>
            )}

            {/* Fixed Bottom Navigation */}
            <HzBottomNav
              role={userRole}
              activeTab={activeTab}
              onTabChange={(tab) => setActiveTab(tab)}
            />
          </View>
        );
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <ExpoStatusBar style="dark" />
        {renderScreen()}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAF8F5",
    paddingTop: StatusBar.currentHeight || 0,
  },
  adminTopBar: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E3DB",
  },
  adminTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#161533",
  },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  signOutText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#DC2626",
  },
  tabContent: {
    flex: 1,
    backgroundColor: "#FAF8F5",
    padding: 16,
  },
  tabHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#161533",
    marginBottom: 16,
  },
  profileCard: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 6,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#161533",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#161533",
  },
  profileMeta: {
    fontSize: 13,
    color: "#9B9B9B",
  },
  profileSector: {
    fontSize: 13,
    color: COLORS.green,
    fontWeight: "600",
    marginTop: 4,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  signOutButtonText: {
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "600",
  },
});
