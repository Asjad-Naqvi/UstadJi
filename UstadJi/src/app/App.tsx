import React, { useState, useEffect, useRef } from "react";
import { HzHomeScreen } from "./components/hz-home-screen";
import { HzBottomNav, HzNavTabId } from "./components/hz-bottom-nav";
import { HzSplashScreen } from "./components/hz-splash-screen";
import { HzRegistrationScreen } from "./components/hz-registration-screen";
import { HzLoginScreen } from "./components/hz-login-screen";
import { HzRoleSelectionScreen } from "./components/hz-role-selection-screen";
import { HzProfileSetupScreen } from "./components/hz-profile-setup-screen";
import { HzProfileSetupStep2Screen } from "./components/hz-profile-setup-step2-screen";
import { HzProfileSetupStep3Screen } from "./components/hz-profile-setup-step3-screen";
import { HzChatScreen } from "./components/hz-chat-screen";
import { HzProviderResultsScreen } from "./components/hz-provider-results-screen";
import { HzProviderProfileScreen } from "./components/hz-provider-profile-screen";
import { HzBookingConfirmationScreen } from "./components/hz-booking-confirmation-screen";
import { HzAwaitingScreen } from "./components/hz-awaiting-screen";
import { HzBookingConfirmedScreen } from "./components/hz-booking-confirmed-screen";
import { HzActiveJobScreen } from "./components/hz-active-job-screen";
import { HzFeedbackScreen } from "./components/hz-feedback-screen";
import { HzBookingsScreen } from "./components/hz-bookings-screen";
import { HzFavouritesScreen } from "./components/hz-favourites-screen";
import { HzProfileScreen } from "./components/hz-profile-screen";
import { HzDisputeChatScreen } from "./components/hz-dispute-chat-screen";
import { HzDisputeStatusScreen } from "./components/hz-dispute-status-screen";
import { HzProviderOnboardingChat } from "./components/hz-provider-onboarding-chat";
import { HzProviderProfileSetup } from "./components/hz-provider-profile-setup";
import { HzProviderDashboard } from "./components/hz-provider-dashboard";
import { HzProviderInbox } from "./components/hz-provider-inbox";
import { HzProviderJobRequest } from "./components/hz-provider-job-request";
import { HzProviderActiveJob } from "./components/hz-provider-active-job";
import { HzProviderRateConsumer } from "./components/hz-provider-rate-consumer";
import { HzProviderPastJobs } from "./components/hz-provider-past-jobs";
import { HzProviderProfile } from "./components/hz-provider-profile";
import { HzProviderDisputeChat } from "./components/hz-provider-dispute-chat";
import { HzProviderDisputeStatus } from "./components/hz-provider-dispute-status";
import { HzRewardsHubScreen } from "./components/hz-rewards-hub-screen";
import { HzProviderRewardsHubScreen } from "./components/hz-provider-rewards-hub-screen";
import { HzWelcomeScreen } from "./components/hz-welcome-screen";
import { HzJobStatusScreen } from "./components/hz-job-status-screen";
import { HzJobCompletionScreen } from "./components/hz-job-completion-screen";
import { HzMyScheduleScreen } from "./components/hz-my-schedule-screen";
import { HzProviderInvoiceGeneration } from "./components/hz-provider-invoice-generation";
import { HzInvoicePreviewScreen } from "./components/hz-invoice-preview-screen";
import { HzInvoiceHistory } from "./components/hz-invoice-history";
import { HzCustomerInvoiceView } from "./components/hz-customer-invoice-view";
import { HzRankingExplanationScreen } from "./components/hz-ranking-explanation-screen";
import { HzHeatmapViewScreen } from "./components/hz-heatmap-view-screen";
import { HzDemandZoneDetailScreen } from "./components/hz-demand-zone-detail-screen";
import { HzAdminLoginScreen } from "./components/hz-admin-login";
import { HzAdminDashboard } from "./components/hz-admin-dashboard";
import { HzAdminUsersScreen } from "./components/hz-admin-users";
import { HzAdminDisputesScreen } from "./components/hz-admin-disputes";
import { HzAdminDisputeDetailScreen } from "./components/hz-admin-dispute-detail";
import { HzAdminAnalyticsScreen } from "./components/hz-admin-analytics";
import { HzAdminMonitoringScreen } from "./components/hz-admin-monitoring";
import { HzAdminSettingsScreen } from "./components/hz-admin-settings";
import { HzIssueCapture } from "./components/hz-issue-capture";
import { HzIssueAnalyzing } from "./components/hz-issue-analyzing";
import { HzIssueSummary } from "./components/hz-issue-summary";
import { HzMediaGallery } from "./components/hz-media-gallery";
import { HzProfileInsights } from "./components/hz-profile-insights";
import { HzProfileRecommendations } from "./components/hz-profile-recommendations";
import { HzProfileBeforeAfter } from "./components/hz-profile-before-after";
import { HzDateTimePicker } from "./components/hz-date-time-picker-screen";
import { HzDirectChatScreen } from "./components/hz-direct-chat-screen";
import { HzExploreScreen } from "./components/hz-explore-screen";
import { HzAIBookingChat } from "./components/hz-ai-booking-chat";
import { HzCustomerPreferencesScreen, type CustomerPref } from "./components/hz-customer-preferences-screen";
import { HzProviderJobPreferencesScreen, type ProviderJobPref } from "./components/hz-provider-job-preferences-screen";
import { HzProviderLanguageSelect, type BookingLanguage } from "./components/hz-provider-language-select";
import { HzRescheduleFlowScreen } from "./components/hz-reschedule-flow-screen";
import { HzRescheduleReceivedScreen } from "./components/hz-reschedule-received-screen";
import { HzCancelBookingScreen } from "./components/hz-cancel-booking-screen";
import { HzProviderCancelledNotice } from "./components/hz-provider-cancelled-notice";
import { HzHeading, HzBody } from "./components/hz-typography";
import { CalendarDays, Search, User, MessageCircle, Clock, Heart } from "lucide-react";

type AppScreen = "splash" | "welcome" | "register" | "role-select" | "profile-setup" | "profile-setup-2" | "profile-setup-3" | "customer-preferences" | "login" | "chat" | "ai-booking-chat" | "provider-job-preferences" | "provider-results" | "provider-profile" | "date-time-picker" | "booking-confirm" | "awaiting" | "booking-confirmed" | "job-status" | "job-completion" | "active-job" | "feedback" | "bookings" | "my-schedule" | "favourites" | "consumer-profile" | "dispute-chat" | "dispute-status" | "direct-chat" | "provider-language-select" | "provider-profile-setup" | "provider-onboarding" | "provider-dashboard" | "provider-inbox" | "provider-job-request" | "provider-active-job" | "provider-rate-consumer" | "provider-past-jobs" | "provider-settings" | "provider-dispute-chat" | "provider-dispute-status" | "rewards-hub" | "provider-rewards-hub" | "provider-invoice-generation" | "invoice-preview" | "invoice-history" | "customer-invoice-view" | "ranking-explanation" | "heatmap-view" | "demand-zone-detail" | "admin-login" | "admin-dashboard" | "admin-users" | "admin-disputes" | "admin-dispute-detail" | "admin-analytics" | "admin-monitoring" | "admin-settings" | "issue-capture" | "issue-analyzing" | "issue-summary" | "media-gallery" | "profile-insights" | "profile-recommendations" | "profile-before-after" | "reschedule-flow" | "reschedule-received" | "cancel-booking" | "provider-cancelled-notice" | "main";

/* ─── Placeholder screens for non-home tabs ─── */
const PlaceholderScreen: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}> = ({ icon, title, subtitle }) => (
  <div
    style={{
      flex: 1,
      backgroundColor: "#FAF8F5",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      padding: "32px",
    }}
  >
    <div style={{ color: "#E8E3DB" }}>{icon}</div>
    <HzHeading as="h1" style={{ textAlign: "center" }}>
      {title}
    </HzHeading>
    <HzBody style={{ color: "#9B9B9B", textAlign: "center" }}>{subtitle}</HzBody>
  </div>
);

/* ─── Android-style status bar ─── */
const StatusBar: React.FC = () => (
  <div
    aria-hidden="true"
    style={{
      height: "28px",
      backgroundColor: "#FFFFFF",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      paddingLeft: "16px",
      paddingRight: "16px",
      flexShrink: 0,
    }}
  >
    <span
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "12px",
        fontWeight: 600,
        color: "#1A1A1A",
      }}
    >
      9:41
    </span>
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      {/* Signal bars */}
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
        <rect x="0" y="8"  width="3" height="4" rx="1" fill="#1A1A1A" />
        <rect x="4" y="5"  width="3" height="7" rx="1" fill="#1A1A1A" />
        <rect x="8" y="2"  width="3" height="10" rx="1" fill="#1A1A1A" />
        <rect x="12" y="0" width="3" height="12" rx="1" fill="#1A1A1A" />
      </svg>
      {/* WiFi */}
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
        <path d="M8 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" fill="#1A1A1A" />
        <path d="M5.172 7.172a4 4 0 0 1 5.656 0" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M2.343 4.343a8 8 0 0 1 11.314 0" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {/* Battery */}
      <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
        <rect x="0.5" y="0.5" width="18" height="11" rx="2.5" stroke="#1A1A1A" />
        <rect x="2" y="2" width="14" height="8" rx="1.5" fill="#1A1A1A" />
        <path d="M19.5 4v4a1.5 1.5 0 0 0 0-4z" fill="#1A1A1A" />
      </svg>
    </div>
  </div>
);

/* ─── Explore screen wrapped with the consumer 5-tab nav ─── */
type ConsumerTab = "chat" | "explore" | "bookings" | "favourites" | "profile";

const CONSUMER_TABS: { id: ConsumerTab; label: string; Icon: React.FC<{ size: number; color: string }> }[] = [
  { id: "chat",       label: "Chat",       Icon: ({ size, color }) => <MessageCircle size={size} color={color} /> },
  { id: "explore",    label: "Explore",    Icon: ({ size, color }) => <Search size={size} color={color} /> },
  { id: "bookings",   label: "Bookings",   Icon: ({ size, color }) => <Clock size={size} color={color} /> },
  { id: "favourites", label: "Favourites", Icon: ({ size, color }) => <Heart size={size} color={color} /> },
  { id: "profile",    label: "Profile",    Icon: ({ size, color }) => <User size={size} color={color} /> },
];

const ExploreWithNav: React.FC<{
  onSelectProvider?: () => void;
  onTabChange?: (tab: ConsumerTab) => void;
}> = ({ onSelectProvider, onTabChange }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
    <HzExploreScreen onSelectProvider={onSelectProvider} />
    <nav aria-label="Main navigation" style={{ height: "64px", backgroundColor: "#FFFFFF", borderTop: "1px solid #EFEFEF", display: "flex", flexShrink: 0 }}>
      {CONSUMER_TABS.map(({ id, label, Icon }) => {
        const isActive = id === "explore";
        const color = isActive ? "#161533" : "#9B9B9B";
        return (
          <button
            key={id}
            type="button"
            onClick={() => id !== "explore" && onTabChange?.(id)}
            aria-current={isActive ? "page" : undefined}
            aria-label={label}
            style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", backgroundColor: "transparent", border: "none", cursor: isActive ? "default" : "pointer", padding: 0, minWidth: "40px" }}
          >
            <Icon size={22} color={color} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: isActive ? 600 : 400, lineHeight: "14px", color }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  </div>
);

/* ─── Root App ─── */
export default function App() {
  const [appScreen, setAppScreen] = useState<AppScreen>("splash");
  const [activeTab, setActiveTab] = useState<HzNavTabId>("home");
  const [selectedBookingDate, setSelectedBookingDate] = useState("");
  const [selectedBookingTime, setSelectedBookingTime] = useState("");
  const [datePickerSource, setDatePickerSource] = useState<AppScreen>("provider-profile");
  const [providerProfileSource, setProviderProfileSource] = useState<AppScreen>("chat");
  const [directChatRole, setDirectChatRole] = useState<"consumer" | "provider">("consumer");
  const [directChatBack, setDirectChatBack] = useState<AppScreen>("job-status");
  const [aiBookingMode, setAiBookingMode] = useState(false);
  const [customerPrefs, setCustomerPrefs] = useState<CustomerPref[]>([]);
  const [providerJobPrefs, setProviderJobPrefs] = useState<ProviderJobPref[]>([]);
  const [providerBookingLanguage, setProviderBookingLanguage] = useState<BookingLanguage>("english");
  const [disputeSource, setDisputeSource] = useState<AppScreen>("job-status");
  const [rescheduleInitiator, setRescheduleInitiator] = useState<"customer" | "provider">("customer");
  const [rescheduleSource, setRescheduleSource] = useState<AppScreen>("job-status");
  const [bookingRescheduled, setBookingRescheduled] = useState(false);
  const [cancelInitiator, setCancelInitiator] = useState<"customer" | "provider">("customer");
  const [cancelSource, setCancelSource] = useState<AppScreen>("job-status");
  const [invoiceSource, setInvoiceSource] = useState<AppScreen>("bookings");
  const [invoiceHistorySource, setInvoiceHistorySource] = useState<AppScreen>("provider-settings");
  const [invoiceGenSource, setInvoiceGenSource] = useState<AppScreen>("provider-rate-consumer");
  const [scale, setScale] = useState(1);
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setAppScreen("welcome"), 5000);
    return () => clearTimeout(timer);
  }, []);

  /* Scale the 390×844 frame to always fit the preview container */
  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;
    const compute = () => {
      const { width, height } = el.getBoundingClientRect();
      const s = Math.min((width - 32) / 390, (height - 32) / 844, 1);
      setScale(Math.max(s, 0.3));
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return (
          <HzHomeScreen
            onSelectProvider={() => {
              setProviderProfileSource("main");
              setAppScreen("provider-profile");
            }}
          />
        );
      case "explore":
        return (
          <HzExploreScreen
            onSelectProvider={() => {
              setProviderProfileSource("main");
              setAppScreen("provider-profile");
            }}
          />
        );
      case "bookings":
        return (
          <PlaceholderScreen
            icon={<CalendarDays size={48} />}
            title="Your Bookings"
            subtitle="View upcoming and past service appointments here."
          />
        );
      case "profile":
        return (
          <PlaceholderScreen
            icon={<User size={48} />}
            title="Profile"
            subtitle="Manage your account, preferences, and payment methods."
          />
        );
      default:
        return <HzHomeScreen />;
    }
  };

  return (
    /* Outer shell — inherits parent dimensions from the Figma Make container */
    <div
      ref={shellRef}
      className="size-full"
      style={{
        backgroundColor: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Android phone frame — 390 × 844, scaled to fit */}
      <div
        style={{
          width: "390px",
          height: "844px",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          flexShrink: 0,
          backgroundColor: "#FFFFFF",
          borderRadius: "40px",
          boxShadow:
            "0 0 0 8px #1A1A1A, 0 32px 64px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
        }}
        role="main"
        aria-label="Ustaad G app preview"
      >
        {appScreen === "splash" ? (
          /* ── Splash: full-bleed, no chrome ── */
          <HzSplashScreen />
        ) : appScreen === "welcome" ? (
          <HzWelcomeScreen
            onGetStarted={() => setAppScreen("register")}
            onLogin={() => setAppScreen("login")}
            onSkip={() => setAppScreen("register")}
          />
        ) : appScreen === "register" ? (
          <HzRegistrationScreen
            onCreateAccount={() => setAppScreen("role-select")}
            onLogin={() => setAppScreen("login")}
          />
        ) : appScreen === "role-select" ? (
          <HzRoleSelectionScreen
            onSelect={(role) =>
              setAppScreen(role === "provider" ? "provider-language-select" : "profile-setup")
            }
          />
        ) : appScreen === "profile-setup" ? (
          <HzProfileSetupScreen
            onBack={() => setAppScreen("role-select")}
            onNext={() => setAppScreen("profile-setup-2")}
          />
        ) : appScreen === "profile-setup-2" ? (
          <HzProfileSetupStep2Screen
            onBack={() => setAppScreen("profile-setup")}
            onNext={() => setAppScreen("profile-setup-3")}
          />
        ) : appScreen === "profile-setup-3" ? (
          <HzProfileSetupStep3Screen
            onBack={() => setAppScreen("profile-setup-2")}
            onFinish={() => setAppScreen("customer-preferences")}
          />
        ) : appScreen === "customer-preferences" ? (
          <HzCustomerPreferencesScreen
            onBack={() => setAppScreen("profile-setup-3")}
            onContinue={(prefs) => {
              setCustomerPrefs(prefs);
              setAppScreen("chat");
            }}
          />
        ) : appScreen === "chat" ? (
          <HzChatScreen
            onViewResults={() => setAppScreen("job-status")}
            onFindProvider={() => setAppScreen("provider-results")}
            onViewInvoice={() => setAppScreen("customer-invoice-view")}
            onReportIssue={() => setAppScreen("issue-capture")}
            onNewAIBooking={() => setAppScreen("ai-booking-chat")}
            onTrackBooking={() => setAppScreen("job-status")}
            onTabChange={(tab) => {
              if (tab === "explore")    setAppScreen("explore");
              if (tab === "bookings")   setAppScreen("bookings");
              if (tab === "favourites") setAppScreen("favourites");
              if (tab === "profile")    setAppScreen("consumer-profile");
            }}
          />
        ) : appScreen === "ai-booking-chat" ? (
          <HzAIBookingChat
            onBack={() => setAppScreen("chat")}
            onComplete={() => {
              setAiBookingMode(true);
              setProviderProfileSource("main");
              setAppScreen("provider-results");
            }}
          />
        ) : appScreen === "explore" ? (
          <ExploreWithNav
            onSelectProvider={() => {
              setProviderProfileSource("explore");
              setAppScreen("provider-profile");
            }}
            onTabChange={(tab) => {
              if (tab === "chat")       setAppScreen("chat");
              if (tab === "bookings")   setAppScreen("bookings");
              if (tab === "favourites") setAppScreen("favourites");
              if (tab === "profile")    setAppScreen("consumer-profile");
            }}
          />
        ) : appScreen === "provider-results" ? (
          <HzProviderResultsScreen
            onBack={() => setAppScreen("chat")}
            onViewProfile={() => {
              setProviderProfileSource("provider-results");
              setAppScreen("provider-profile");
            }}
            onBookProvider={() => {
              setDatePickerSource("provider-results");
              setAppScreen("date-time-picker");
            }}
            onRankingExplanation={() => setAppScreen("ranking-explanation")}
            customerPrefs={customerPrefs}
          />
        ) : appScreen === "ranking-explanation" ? (
          <HzRankingExplanationScreen
            onBack={() => setAppScreen("provider-results")}
          />
        ) : appScreen === "provider-profile" ? (
          <HzProviderProfileScreen
            onBack={() => setAppScreen(providerProfileSource)}
            onBook={() => {
              setDatePickerSource("provider-profile");
              setAppScreen("date-time-picker");
            }}
          />
        ) : appScreen === "date-time-picker" ? (
          <HzDateTimePicker
            onBack={() => setAppScreen(datePickerSource)}
            onConfirm={(date, time) => {
              setSelectedBookingDate(date);
              setSelectedBookingTime(time);
              setAppScreen("booking-confirm");
            }}
          />
        ) : appScreen === "booking-confirm" ? (
          <HzBookingConfirmationScreen
            onBack={() => setAppScreen("date-time-picker")}
            onConfirm={() => setAppScreen("awaiting")}
            selectedDate={selectedBookingDate}
            selectedTime={selectedBookingTime}
          />
        ) : appScreen === "awaiting" ? (
          <HzAwaitingScreen
            onCancel={() => setAppScreen("chat")}
            onAccepted={() => setAppScreen("booking-confirmed")}
          />
        ) : appScreen === "booking-confirmed" ? (
          <HzBookingConfirmedScreen
            onViewJob={() => setAppScreen("job-status")}
            onBackToChat={() => setAppScreen("chat")}
            onMessageProvider={() => {
              setDirectChatRole("consumer");
              setDirectChatBack("booking-confirmed");
              setAppScreen("direct-chat");
            }}
          />
        ) : appScreen === "job-status" ? (
          <HzJobStatusScreen
            onBack={() => setAppScreen("chat")}
            onReportIssue={() => {
              setDisputeSource("job-status");
              setAppScreen("dispute-chat");
            }}
            onJobComplete={() => setAppScreen("job-completion")}
            onViewInvoice={() => {
              setInvoiceSource("job-status");
              setAppScreen("customer-invoice-view");
            }}
            onGenerateInvoice={() => {
              setInvoiceGenSource("job-status");
              setAppScreen("provider-invoice-generation");
            }}
            onMessageProvider={() => {
              setDirectChatRole("consumer");
              setDirectChatBack("job-status");
              setAppScreen("direct-chat");
            }}
            onReschedule={() => {
              setRescheduleInitiator("customer");
              setRescheduleSource("job-status");
              setAppScreen("reschedule-flow");
            }}
            onCancel={() => {
              setCancelInitiator("customer");
              setCancelSource("job-status");
              setAppScreen("cancel-booking");
            }}
            onProviderCancelled={() => setAppScreen("provider-cancelled-notice")}
            rescheduled={bookingRescheduled}
          />
        ) : appScreen === "job-completion" ? (
          <HzJobCompletionScreen
            onRateProvider={() => setAppScreen("feedback")}
            onReturnHome={() => setAppScreen("chat")}
            onViewInvoice={() => {
              setInvoiceSource("job-completion");
              setAppScreen("customer-invoice-view");
            }}
            onSendInvoice={() => setAppScreen("invoice-preview")}
          />
        ) : appScreen === "active-job" ? (
          <HzActiveJobScreen
            onBack={() => setAppScreen("job-status")}
            onReportIssue={() => {
              setDisputeSource("active-job");
              setAppScreen("dispute-chat");
            }}
            onJobComplete={() => setAppScreen("job-completion")}
          />
        ) : appScreen === "feedback" ? (
          <HzFeedbackScreen
            onSubmit={() => setAppScreen("chat")}
            onSkip={() => setAppScreen("chat")}
          />
        ) : appScreen === "bookings" ? (
          <HzBookingsScreen
            onBack={() => setAppScreen("chat")}
            onViewSchedule={() => setAppScreen("my-schedule")}
            onReschedule={() => {
              setRescheduleInitiator("customer");
              setRescheduleSource("bookings");
              setAppScreen("reschedule-flow");
            }}
            onViewInvoice={() => {
              setInvoiceSource("bookings");
              setAppScreen("customer-invoice-view");
            }}
            onTabChange={(tab) => {
              if (tab === "chat")       setAppScreen("chat");
              if (tab === "explore")    setAppScreen("explore");
              if (tab === "favourites") setAppScreen("favourites");
              if (tab === "profile")    setAppScreen("consumer-profile");
            }}
          />
        ) : appScreen === "my-schedule" ? (
          <HzMyScheduleScreen
            onBack={() => setAppScreen("bookings")}
            onBookService={() => setAppScreen("chat")}
            onReschedule={() => {
              setRescheduleInitiator("customer");
              setRescheduleSource("my-schedule");
              setAppScreen("reschedule-flow");
            }}
            onTabChange={(tab) => {
              if (tab === "chat")       setAppScreen("chat");
              if (tab === "explore")    setAppScreen("explore");
              if (tab === "bookings")   setAppScreen("bookings");
              if (tab === "favourites") setAppScreen("favourites");
              if (tab === "profile")    setAppScreen("consumer-profile");
            }}
          />
        ) : appScreen === "favourites" ? (
          <HzFavouritesScreen
            onBook={() => {
              setDatePickerSource("favourites");
              setAppScreen("date-time-picker");
            }}
            onViewProfile={() => {
              setProviderProfileSource("favourites");
              setAppScreen("provider-profile");
            }}
            onTabChange={(tab) => {
              if (tab === "chat")     setAppScreen("chat");
              if (tab === "explore")  setAppScreen("explore");
              if (tab === "bookings") setAppScreen("bookings");
              if (tab === "profile")  setAppScreen("consumer-profile");
            }}
          />
        ) : appScreen === "consumer-profile" ? (
          <HzProfileScreen
            onSignOut={() => setAppScreen("register")}
            onRewardsHub={() => setAppScreen("rewards-hub")}
            onTabChange={(tab) => {
              if (tab === "chat")       setAppScreen("chat");
              if (tab === "explore")    setAppScreen("explore");
              if (tab === "bookings")   setAppScreen("bookings");
              if (tab === "favourites") setAppScreen("favourites");
            }}
          />
        ) : appScreen === "rewards-hub" ? (
          <HzRewardsHubScreen
            onBack={() => setAppScreen("consumer-profile")}
            onBookNow={() => setAppScreen("chat")}
            onTabChange={(tab) => {
              if (tab === "chat")       setAppScreen("chat");
              if (tab === "explore")    setAppScreen("explore");
              if (tab === "bookings")   setAppScreen("bookings");
              if (tab === "favourites") setAppScreen("favourites");
            }}
          />
        ) : appScreen === "dispute-chat" ? (
          <HzDisputeChatScreen
            onBack={() => setAppScreen(disputeSource)}
            onSubmit={() => setAppScreen("dispute-status")}
          />
        ) : appScreen === "dispute-status" ? (
          <HzDisputeStatusScreen onBack={() => setAppScreen(disputeSource)} />
        ) : appScreen === "direct-chat" ? (
          <HzDirectChatScreen
            onBack={() => setAppScreen(directChatBack)}
            role={directChatRole}
          />
        ) : appScreen === "provider-language-select" ? (
          <HzProviderLanguageSelect
            onContinue={(lang) => {
              setProviderBookingLanguage(lang);
              setAppScreen("provider-profile-setup");
            }}
          />
        ) : appScreen === "provider-profile-setup" ? (
          <HzProviderProfileSetup
            onBack={() => setAppScreen("provider-language-select")}
            onComplete={() => setAppScreen("provider-onboarding")}
          />
        ) : appScreen === "provider-onboarding" ? (
          <HzProviderOnboardingChat
            onBack={() => setAppScreen("provider-profile-setup")}
            onComplete={() => setAppScreen("provider-job-preferences")}
          />
        ) : appScreen === "provider-job-preferences" ? (
          <HzProviderJobPreferencesScreen
            onBack={() => setAppScreen("provider-onboarding")}
            onContinue={(jobPrefs) => {
              setProviderJobPrefs(jobPrefs);
              setAppScreen("provider-dashboard");
            }}
          />
        ) : appScreen === "provider-dashboard" ? (
          <HzProviderDashboard
            onViewJob={() => setAppScreen("provider-active-job")}
            onViewInbox={() => setAppScreen("provider-inbox")}
            onViewPastJobs={() => setAppScreen("provider-past-jobs")}
            onViewProfile={() => setAppScreen("provider-settings")}
            onGenerateInvoice={() => {
              setInvoiceGenSource("provider-dashboard");
              setAppScreen("provider-invoice-generation");
            }}
            onInvoiceHistory={() => {
              setInvoiceHistorySource("provider-dashboard");
              setAppScreen("invoice-history");
            }}
            onViewDemandMap={() => setAppScreen("heatmap-view")}
          />
        ) : appScreen === "provider-inbox" ? (
          <HzProviderInbox
            onBack={() => setAppScreen("provider-dashboard")}
            onViewJobRequest={() => setAppScreen("provider-job-request")}
            onAcceptJob={() => setAppScreen("provider-active-job")}
            providerJobPrefs={providerJobPrefs}
          />
        ) : appScreen === "provider-job-request" ? (
          <HzProviderJobRequest
            onBack={() => setAppScreen("provider-inbox")}
            onAccept={() => setAppScreen("provider-active-job")}
            onDecline={() => setAppScreen("provider-inbox")}
            onMessageCustomer={() => {
              setDirectChatRole("provider");
              setDirectChatBack("provider-job-request");
              setAppScreen("direct-chat");
            }}
            aiBooking={aiBookingMode}
            preferredLanguage={providerBookingLanguage}
          />
        ) : appScreen === "provider-active-job" ? (
          <HzProviderActiveJob
            onBack={() => setAppScreen("provider-dashboard")}
            onMarkArrived={() => {}}
            onReportIssue={() => setAppScreen("provider-dispute-chat")}
            onJobComplete={() => setAppScreen("provider-rate-consumer")}
            onGenerateInvoice={() => {
              setInvoiceGenSource("provider-active-job");
              setAppScreen("provider-invoice-generation");
            }}
            onMessageCustomer={() => {
              setDirectChatRole("provider");
              setDirectChatBack("provider-active-job");
              setAppScreen("direct-chat");
            }}
            onReschedule={() => {
              setRescheduleInitiator("provider");
              setRescheduleSource("provider-active-job");
              setAppScreen("reschedule-flow");
            }}
            onCancel={() => {
              setCancelInitiator("provider");
              setCancelSource("provider-active-job");
              setAppScreen("cancel-booking");
            }}
            rescheduled={bookingRescheduled}
          />
        ) : appScreen === "provider-rate-consumer" ? (
          <HzProviderRateConsumer
            onBack={() => setAppScreen("provider-active-job")}
            onSubmit={() => {
              setInvoiceGenSource("provider-rate-consumer");
              setAppScreen("provider-invoice-generation");
            }}
            onSkip={() => {
              setInvoiceGenSource("provider-rate-consumer");
              setAppScreen("provider-invoice-generation");
            }}
            onNavigateToInvoice={() => {
              setInvoiceGenSource("provider-rate-consumer");
              setAppScreen("provider-invoice-generation");
            }}
          />
        ) : appScreen === "provider-past-jobs" ? (
          <HzProviderPastJobs
            onBack={() => setAppScreen("provider-dashboard")}
            onTabChange={(tab) => {
              if (tab === "dashboard") setAppScreen("provider-dashboard");
              if (tab === "inbox")     setAppScreen("provider-inbox");
              if (tab === "profile")   setAppScreen("provider-settings");
            }}
          />
        ) : appScreen === "provider-dispute-chat" ? (
          <HzProviderDisputeChat onBack={() => setAppScreen("provider-active-job")} onSubmit={() => setAppScreen("provider-dispute-status")} />
        ) : appScreen === "provider-dispute-status" ? (
          <HzProviderDisputeStatus onBack={() => setAppScreen("provider-active-job")} />
        ) : appScreen === "provider-settings" ? (
          <HzProviderProfile
            onSignOut={() => setAppScreen("register")}
            onUpdateProfile={() => setAppScreen("provider-onboarding")}
            onRewardsHub={() => setAppScreen("provider-rewards-hub")}
            onInvoiceHistory={() => {
              setInvoiceHistorySource("provider-settings");
              setAppScreen("invoice-history");
            }}
            onOptimizeProfile={() => setAppScreen("profile-insights")}
            onTabChange={(tab) => {
              if (tab === "dashboard") setAppScreen("provider-dashboard");
              if (tab === "inbox") setAppScreen("provider-inbox");
            }}
          />
        ) : appScreen === "provider-rewards-hub" ? (
          <HzProviderRewardsHubScreen
            onBack={() => setAppScreen("provider-settings")}
            onGoToDashboard={() => setAppScreen("provider-dashboard")}
            onGoToInbox={() => setAppScreen("provider-inbox")}
            onAcceptJobs={() => setAppScreen("provider-inbox")}
          />
        ) : appScreen === "provider-invoice-generation" ? (
          <HzProviderInvoiceGeneration
            onBack={() => setAppScreen(invoiceGenSource)}
            onGenerateInvoice={() => setAppScreen("invoice-preview")}
            onSaveDraft={() => setAppScreen("provider-dashboard")}
          />
        ) : appScreen === "invoice-preview" ? (
          <HzInvoicePreviewScreen
            onBack={() => setAppScreen("provider-invoice-generation")}
            onSent={() => setAppScreen("provider-dashboard")}
          />
        ) : appScreen === "invoice-history" ? (
          <HzInvoiceHistory
            onBack={() => setAppScreen(invoiceHistorySource)}
            onViewInvoice={() => setAppScreen("invoice-preview")}
            onNewInvoice={() => setAppScreen("provider-invoice-generation")}
          />
        ) : appScreen === "heatmap-view" ? (
          <HzHeatmapViewScreen
            onBack={() => setAppScreen("provider-dashboard")}
            onViewZoneDetail={() => setAppScreen("demand-zone-detail")}
            onAcceptJob={() => setAppScreen("provider-active-job")}
          />
        ) : appScreen === "demand-zone-detail" ? (
          <HzDemandZoneDetailScreen
            onBack={() => setAppScreen("heatmap-view")}
            onAcceptJob={() => setAppScreen("provider-active-job")}
          />
        ) : appScreen === "customer-invoice-view" ? (
          <HzCustomerInvoiceView
            onBack={() => setAppScreen(invoiceSource)}
            onAskQuestion={() => setAppScreen("chat")}
          />
        ) : appScreen === "login" ? (
          <HzLoginScreen
            onLogin={() => setAppScreen("chat")}
            onRegister={() => setAppScreen("register")}
            onForgotPassword={() => {}}
            onAdminLogin={() => setAppScreen("admin-login")}
          />
        ) : appScreen === "admin-login" ? (
          <HzAdminLoginScreen
            onLogin={() => setAppScreen("admin-dashboard")}
            onBackToUserLogin={() => setAppScreen("login")}
          />
        ) : appScreen === "admin-dashboard" ? (
          <HzAdminDashboard
            onViewUsers={() => setAppScreen("admin-users")}
            onViewDisputes={() => setAppScreen("admin-disputes")}
            onViewAnalytics={() => setAppScreen("admin-analytics")}
            onViewSettings={() => setAppScreen("admin-settings")}
            onViewMonitoring={() => setAppScreen("admin-monitoring")}
            onViewDisputeDetail={() => setAppScreen("admin-dispute-detail")}
          />
        ) : appScreen === "admin-users" ? (
          <HzAdminUsersScreen
            onBack={() => setAppScreen("admin-dashboard")}
          />
        ) : appScreen === "admin-disputes" ? (
          <HzAdminDisputesScreen
            onBack={() => setAppScreen("admin-dashboard")}
            onViewDetail={() => setAppScreen("admin-dispute-detail")}
          />
        ) : appScreen === "admin-dispute-detail" ? (
          <HzAdminDisputeDetailScreen
            onBack={() => setAppScreen("admin-disputes")}
            onResolved={() => setAppScreen("admin-disputes")}
          />
        ) : appScreen === "admin-analytics" ? (
          <HzAdminAnalyticsScreen
            onBack={() => setAppScreen("admin-dashboard")}
          />
        ) : appScreen === "admin-monitoring" ? (
          <HzAdminMonitoringScreen
            onBack={() => setAppScreen("admin-dashboard")}
          />
        ) : appScreen === "admin-settings" ? (
          <HzAdminSettingsScreen
            onBack={() => setAppScreen("admin-dashboard")}
            onSignOut={() => setAppScreen("login")}
          />
        ) : appScreen === "issue-capture" ? (
          <HzIssueCapture
            onBack={() => setAppScreen("chat")}
            onContinue={() => setAppScreen("issue-analyzing")}
          />
        ) : appScreen === "issue-analyzing" ? (
          <HzIssueAnalyzing
            onComplete={() => setAppScreen("issue-summary")}
          />
        ) : appScreen === "issue-summary" ? (
          <HzIssueSummary
            onBack={() => setAppScreen("issue-capture")}
            onConfirm={() => setAppScreen("provider-results")}
            onViewMedia={() => setAppScreen("media-gallery")}
          />
        ) : appScreen === "media-gallery" ? (
          <HzMediaGallery
            onBack={() => setAppScreen("issue-summary")}
            onAddMore={() => setAppScreen("issue-capture")}
          />
        ) : appScreen === "profile-insights" ? (
          <HzProfileInsights
            onBack={() => setAppScreen("provider-settings")}
            onSeeRecommendations={() => setAppScreen("profile-recommendations")}
          />
        ) : appScreen === "profile-recommendations" ? (
          <HzProfileRecommendations
            onBack={() => setAppScreen("profile-insights")}
            onPreview={() => setAppScreen("profile-before-after")}
          />
        ) : appScreen === "profile-before-after" ? (
          <HzProfileBeforeAfter
            onBack={() => setAppScreen("profile-recommendations")}
            onKeepCurrent={() => setAppScreen("profile-recommendations")}
            onUseSuggested={() => setAppScreen("provider-settings")}
          />
        ) : appScreen === "reschedule-flow" ? (
          <HzRescheduleFlowScreen
            onBack={() => setAppScreen(rescheduleSource)}
            onSendRequest={() => setAppScreen("reschedule-received")}
            initiator={rescheduleInitiator}
          />
        ) : appScreen === "reschedule-received" ? (
          <HzRescheduleReceivedScreen
            onBack={() => setAppScreen("reschedule-flow")}
            onConfirmed={() => {
              setBookingRescheduled(true);
              setAppScreen(rescheduleSource);
            }}
            onChooseAnother={() => setAppScreen("reschedule-flow")}
            initiator={rescheduleInitiator}
          />
        ) : appScreen === "cancel-booking" ? (
          <HzCancelBookingScreen
            onBack={() => setAppScreen(cancelSource)}
            onCancelled={() => {
              if (cancelInitiator === "customer") {
                setAppScreen("chat");
              } else {
                setAppScreen("provider-dashboard");
              }
            }}
            initiator={cancelInitiator}
          />
        ) : appScreen === "provider-cancelled-notice" ? (
          <HzProviderCancelledNotice
            onFindAlternatives={() => setAppScreen("provider-results")}
            onGoHome={() => setAppScreen("chat")}
          />
        ) : (
          <>
            {/* Dynamic Island / notch mock */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "10px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "120px",
                height: "34px",
                backgroundColor: "#1A1A1A",
                borderRadius: "20px",
                zIndex: 10,
              }}
            />

            {/* Status bar */}
            <StatusBar />

            {/* Notch spacer */}
            <div style={{ height: "16px", backgroundColor: "#FFFFFF", flexShrink: 0 }} />

            {/* Screen content */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {renderScreen()}
            </div>

            {/* Bottom navigation */}
            <HzBottomNav activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Android gesture bar */}
            <div
              aria-hidden="true"
              style={{
                height: "20px",
                backgroundColor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: "120px",
                  height: "4px",
                  borderRadius: "2px",
                  backgroundColor: "#1A1A1A",
                  opacity: 0.15,
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
