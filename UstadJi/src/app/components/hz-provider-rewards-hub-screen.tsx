import React, { useState } from "react";
import {
  User,
  Home,
  Bell,
  ChevronLeft,
  Copy,
  Share2,
  Trophy,
  Users,
  Lock,
  CheckCircle,
  Briefcase,
} from "lucide-react";

type ProviderTab = "dashboard" | "inbox" | "profile";

const NAVY = "#161533";
const NAVY_BG = "#EEEEF5";

/* ─── Section header ─── */
const SectionHeader: React.FC<{
  title: string;
  action?: { label: string; onPress?: () => void };
}> = ({ title, action }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <span
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "16px",
        fontWeight: 600,
        lineHeight: "22px",
        color: "#1A1A1A",
      }}
    >
      {title}
    </span>
    {action && (
      <button
        type="button"
        onClick={action.onPress}
        style={{
          background: "none",
          border: "none",
          padding: "4px",
          fontFamily: "Inter, sans-serif",
          fontSize: "13px",
          fontWeight: 500,
          color: NAVY,
          cursor: "pointer",
        }}
      >
        {action.label}
      </button>
    )}
  </div>
);

/* ─── Provider bottom nav ─── */
const ProviderBottomNav: React.FC<{
  active: ProviderTab;
  onChange: (t: ProviderTab) => void;
}> = ({ active, onChange }) => {
  const tabs: { id: ProviderTab; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "inbox",     label: "Inbox"     },
    { id: "profile",   label: "Profile"   },
  ];
  return (
    <nav
      aria-label="Provider navigation"
      style={{
        height: "64px",
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #EFEFEF",
        display: "flex",
        flexShrink: 0,
      }}
    >
      {tabs.map(({ id, label }) => {
        const isActive = id === active;
        const color = isActive ? NAVY : "#9B9B9B";
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-current={isActive ? "page" : undefined}
            aria-label={label}
            style={{
              flex: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {id === "dashboard" && <Home size={24} color={color} aria-hidden="true" />}
            {id === "inbox"     && <Bell size={24} color={color} aria-hidden="true" />}
            {id === "profile"   && <User size={24} color={color} aria-hidden="true" />}
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "11px",
                fontWeight: isActive ? 500 : 400,
                lineHeight: "15px",
                color,
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

/* ─── Static data ─── */

const TIERS = [
  {
    id: "bronze",
    emoji: "🥉",
    name: "Bronze",
    range: "0 – 999 pts",
    benefits: ["Earn reward points after every completed job"],
  },
  {
    id: "silver",
    emoji: "🥈",
    name: "Silver",
    range: "1,000 – 2,499 pts",
    benefits: ["Higher visibility in search results", "Faster support"],
  },
  {
    id: "gold",
    emoji: "🥇",
    name: "Gold",
    range: "2,500 – 4,999 pts",
    benefits: [
      "Featured Provider badge",
      "Priority job recommendations",
      "Access to exclusive campaigns",
    ],
  },
  {
    id: "platinum",
    emoji: "💎",
    name: "Platinum",
    range: "5,000 + pts",
    benefits: [
      "Reduced platform service fees",
      "Highest search priority",
      "Exclusive Platinum badge",
      "Early access to premium customers",
    ],
  },
];

const ACHIEVEMENTS = [
  { id: "first-job",    emoji: "🎯", name: "First Job",         earned: true  },
  { id: "verified",     emoji: "✅", name: "Verified Provider", earned: true  },
  { id: "five-star",    emoji: "⭐", name: "5-Star Rated",      earned: true  },
  { id: "fifty-jobs",   emoji: "🏆", name: "50 Jobs Done",      earned: false },
  { id: "fast",         emoji: "⚡", name: "Fast Responder",    earned: false },
  { id: "mentor",       emoji: "🎓", name: "Community Mentor",  earned: false },
  { id: "hundred-jobs", emoji: "💯", name: "100 Jobs Done",     earned: false },
  { id: "platinum-pro", emoji: "💎", name: "Platinum Provider", earned: false },
];

const STORE_ITEMS = [
  { id: "feature",   icon: "📌", name: "Featured Profile (7 Days)",  desc: "Appear at the top of search results",  points: 300 },
  { id: "fee",       icon: "✨", name: "Reduced Platform Fee",        desc: "Platform fee waived on next 3 jobs",  points: 200 },
  { id: "priority",  icon: "⚡", name: "Priority Job Matching",       desc: "Get first-look on new job requests",  points: 400 },
  { id: "boost",     icon: "🚀", name: "Promotional Boost",          desc: "Boost profile visibility for 14 days", points: 500 },
  { id: "badge",     icon: "🏅", name: "Premium Verification Badge", desc: "Stand out with a premium badge",       points: 600 },
];

const ACTIVITY = [
  { id: "a1", badge: "+80",   label: "Job Completed — AC Repair, G-10",   time: "Today",      color: "#4CAF84" },
  { id: "a2", badge: "+150",  label: "Received a 5-Star Review",           time: "Yesterday",  color: "#4CAF84" },
  { id: "a3", badge: "+200",  label: "Successful Provider Referral",       time: "3 days ago", color: "#4CAF84" },
  { id: "a4", badge: "Used",  label: "Redeemed Featured Profile Reward",   time: "1 week ago", color: NAVY      },
  { id: "a5", badge: "🥉",    label: "Bronze Badge Earned",               time: "2 wks ago",  color: "#CD7F32" },
];

/* ─── Main component ─── */

interface HzProviderRewardsHubScreenProps {
  onBack?: () => void;
  onGoToDashboard?: () => void;
  onGoToInbox?: () => void;
  onAcceptJobs?: () => void;
}

export const HzProviderRewardsHubScreen: React.FC<HzProviderRewardsHubScreenProps> = ({
  onBack,
  onGoToDashboard,
  onGoToInbox,
  onAcceptJobs,
}) => {
  const [copied, setCopied] = useState(false);

  const currentPoints = 820;
  const nextTierPoints = 1000;
  const progressPct = (currentPoints / nextTierPoints) * 100;
  const pointsToNext = nextTierPoints - currentPoints;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTabChange = (tab: ProviderTab) => {
    if (tab === "dashboard") onGoToDashboard?.();
    if (tab === "inbox")     onGoToInbox?.();
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FAF8F5",
        overflow: "hidden",
      }}
    >
      {/* Status bar spacer */}
      <div
        aria-hidden="true"
        style={{ height: "24px", flexShrink: 0, backgroundColor: "#FFFFFF" }}
      />

      {/* Top app bar */}
      <header
        style={{
          height: "56px",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #EFEFEF",
          display: "flex",
          alignItems: "center",
          paddingLeft: "16px",
          paddingRight: "16px",
          flexShrink: 0,
          position: "relative",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          style={{
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <ChevronLeft size={24} color="#1A1A1A" aria-hidden="true" />
        </button>

        <span
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
            fontSize: "17px",
            fontWeight: 600,
            lineHeight: "22px",
            color: "#1A1A1A",
            pointerEvents: "none",
          }}
        >
          Rewards Hub
        </span>

        <div
          aria-hidden="true"
          style={{
            marginLeft: "auto",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Trophy size={22} color={NAVY} />
        </div>
      </header>

      {/* ── Scrollable content ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          paddingLeft: "16px",
          paddingRight: "16px",
          paddingTop: "16px",
          paddingBottom: "32px",
        }}
      >

        {/* ════════════════════════════════════════
            1. REWARDS SUMMARY CARD
        ════════════════════════════════════════ */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.07)",
            border: "1px solid #E8E3DB",
            padding: "16px",
          }}
        >
          {/* Avatar + name + points */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Avatar with provider tool icon overlay */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                aria-hidden="true"
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  backgroundColor: "#E8E3DB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <User size={26} color="#FFFFFF" />
              </div>
              {/* Verified dot */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  bottom: "1px",
                  right: "1px",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "#4CAF84",
                  border: "2px solid #FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckCircle size={9} color="#FFFFFF" />
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#1A1A1A",
                }}
              >
                Usman Tariq
              </div>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "#9B9B9B",
                  marginTop: "1px",
                }}
              >
                AC Technician · G-10
              </div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: "22px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  borderRadius: "11px",
                  backgroundColor: "#CD7F32",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "#FFFFFF",
                  marginTop: "5px",
                }}
              >
                🥉 Bronze Provider
              </span>
            </div>

            {/* Points */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: NAVY,
                  lineHeight: 1,
                }}
              >
                820
              </div>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "11px",
                  fontWeight: 400,
                  color: "#9B9B9B",
                  marginTop: "3px",
                }}
              >
                points
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: "16px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "7px",
              }}
            >
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#9B9B9B",
                }}
              >
                Progress to Silver 🥈
              </span>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: NAVY,
                }}
              >
                820 / 1,000
              </span>
            </div>

            <div
              style={{
                height: "8px",
                backgroundColor: "#EFEFEF",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progressPct}%`,
                  height: "100%",
                  backgroundColor: NAVY,
                  borderRadius: "4px",
                }}
              />
            </div>

            <div
              style={{
                marginTop: "7px",
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                fontWeight: 400,
                color: "#9B9B9B",
              }}
            >
              Only{" "}
              <span style={{ color: NAVY, fontWeight: 600 }}>
                {pointsToNext} points
              </span>{" "}
              until Silver!
            </div>
          </div>

          {/* 3 quick stats */}
          <div
            style={{
              marginTop: "14px",
              paddingTop: "14px",
              borderTop: "1px solid #EFEFEF",
              display: "flex",
            }}
          >
            {[
              { label: "Jobs Done",  value: "24"   },
              { label: "Avg Rating", value: "4.9 ★" },
              { label: "Referrals",  value: "3"    },
            ].map((stat, i, arr) => (
              <div
                key={stat.label}
                style={{
                  flex: 1,
                  textAlign: "center",
                  borderRight: i < arr.length - 1 ? "1px solid #EFEFEF" : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "17px",
                    fontWeight: 700,
                    color: NAVY,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "11px",
                    fontWeight: 400,
                    color: "#9B9B9B",
                    marginTop: "2px",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════
            2. MEMBERSHIP TIERS
        ════════════════════════════════════════ */}
        <div style={{ marginTop: "24px" }}>
          <SectionHeader title="Membership Tiers" />
          <div
            style={{
              marginTop: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {TIERS.map((tier) => {
              const isCurrent = tier.id === "bronze";
              return (
                <div
                  key={tier.id}
                  style={{
                    backgroundColor: isCurrent ? NAVY : "#FFFFFF",
                    borderRadius: "12px",
                    border: isCurrent ? "none" : "1px solid #E8E3DB",
                    padding: "12px 14px",
                    boxShadow: isCurrent
                      ? "0px 4px 14px rgba(22,21,51,0.22)"
                      : "0px 1px 4px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Tier header */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "22px", lineHeight: 1 }}>{tier.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: isCurrent ? "#FFFFFF" : "#1A1A1A",
                          }}
                        >
                          {tier.name}
                        </span>
                        {isCurrent && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              height: "18px",
                              paddingLeft: "8px",
                              paddingRight: "8px",
                              borderRadius: "9px",
                              backgroundColor: "rgba(255,255,255,0.18)",
                              fontFamily: "Inter, sans-serif",
                              fontSize: "10px",
                              fontWeight: 500,
                              color: "#FFFFFF",
                            }}
                          >
                            Current
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "11px",
                          fontWeight: 400,
                          color: isCurrent ? "rgba(255,255,255,0.5)" : "#9B9B9B",
                          marginTop: "2px",
                        }}
                      >
                        {tier.range}
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div
                    style={{
                      marginTop: "9px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    {tier.benefits.map((b) => (
                      <div
                        key={b}
                        style={{ display: "flex", alignItems: "center", gap: "7px" }}
                      >
                        <div
                          style={{
                            width: "4px",
                            height: "4px",
                            borderRadius: "50%",
                            backgroundColor: isCurrent
                              ? "rgba(255,255,255,0.45)"
                              : "#9B9B9B",
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "12px",
                            fontWeight: 400,
                            color: isCurrent ? "rgba(255,255,255,0.82)" : "#1A1A1A",
                          }}
                        >
                          {b}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ════════════════════════════════════════
            3. ACHIEVEMENT BADGES
        ════════════════════════════════════════ */}
        <div style={{ marginTop: "24px" }}>
          <SectionHeader title="Achievement Badges" />
          <div
            style={{
              marginTop: "12px",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px",
            }}
          >
            {ACHIEVEMENTS.map((a) => (
              <div
                key={a.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  border: a.earned
                    ? "1px solid rgba(22,21,51,0.15)"
                    : "1px solid #E8E3DB",
                  padding: "12px 8px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "5px",
                  opacity: a.earned ? 1 : 0.42,
                  position: "relative",
                  boxShadow: a.earned
                    ? "0px 2px 8px rgba(22,21,51,0.08)"
                    : "0px 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                {!a.earned && (
                  <div style={{ position: "absolute", top: "7px", right: "7px" }}>
                    <Lock size={11} color="#9B9B9B" aria-hidden="true" />
                  </div>
                )}
                <span style={{ fontSize: "26px", lineHeight: 1 }}>{a.emoji}</span>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "11px",
                    fontWeight: a.earned ? 500 : 400,
                    color: a.earned ? "#1A1A1A" : "#9B9B9B",
                    textAlign: "center",
                    lineHeight: "14px",
                  }}
                >
                  {a.name}
                </span>
                {a.earned && (
                  <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                    <CheckCircle size={11} color="#4CAF84" aria-hidden="true" />
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "10px",
                        fontWeight: 400,
                        color: "#4CAF84",
                      }}
                    >
                      Earned
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════
            4. REWARDS STORE
        ════════════════════════════════════════ */}
        <div style={{ marginTop: "24px" }}>
          <SectionHeader title="Rewards Store" />
          <div
            style={{
              marginTop: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {STORE_ITEMS.map((item) => {
              const canRedeem = currentPoints >= item.points;
              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #E8E3DB",
                    padding: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    boxShadow: "0px 1px 4px rgba(0,0,0,0.04)",
                  }}
                >
                  <span style={{ fontSize: "28px", flexShrink: 0, lineHeight: 1 }}>
                    {item.icon}
                  </span>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#1A1A1A",
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#9B9B9B",
                        marginTop: "2px",
                      }}
                    >
                      {item.desc}
                    </div>
                    <div
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: NAVY,
                        marginTop: "5px",
                      }}
                    >
                      {item.points} pts
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!canRedeem}
                    style={{
                      flexShrink: 0,
                      height: "34px",
                      paddingLeft: "14px",
                      paddingRight: "14px",
                      borderRadius: "8px",
                      backgroundColor: canRedeem ? NAVY : "#F0F0F0",
                      border: "none",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: canRedeem ? "#FFFFFF" : "#9B9B9B",
                      cursor: canRedeem ? "pointer" : "not-allowed",
                    }}
                  >
                    {canRedeem ? "Redeem" : "Locked"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ════════════════════════════════════════
            5. INVITE & EARN
        ════════════════════════════════════════ */}
        <div style={{ marginTop: "24px" }}>
          <SectionHeader title="Invite & Earn" />
          <div
            style={{
              marginTop: "12px",
              backgroundColor: NAVY,
              borderRadius: "12px",
              padding: "16px",
              boxShadow: "0px 4px 16px rgba(22,21,51,0.22)",
            }}
          >
            {/* Heading */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <Briefcase size={20} color="rgba(255,255,255,0.75)" aria-hidden="true" />
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#FFFFFF",
                }}
              >
                Invite Professionals, Grow Together
              </span>
            </div>

            <p
              style={{
                margin: 0,
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                fontWeight: 400,
                color: "rgba(255,255,255,0.65)",
                lineHeight: "18px",
              }}
            >
              Invite skilled professionals to join Ustaad G. When they complete their first
              successful job using your referral code, both of you earn reward points and
              unlock exclusive provider benefits.
            </p>

            {/* Referral code block */}
            <div
              style={{
                marginTop: "14px",
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: "10px",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "10px",
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.5)",
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                  }}
                >
                  Your Code
                </div>
                <div
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    letterSpacing: "3px",
                    marginTop: "2px",
                  }}
                >
                  USMAN25
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  height: "36px",
                  paddingLeft: "14px",
                  paddingRight: "14px",
                  borderRadius: "8px",
                  backgroundColor: copied ? "#4CAF84" : "rgba(255,255,255,0.15)",
                  border: "none",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#FFFFFF",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                }}
              >
                <Copy size={14} aria-hidden="true" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* Share button */}
            <button
              type="button"
              style={{
                marginTop: "10px",
                width: "100%",
                height: "44px",
                borderRadius: "10px",
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.18)",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: "#FFFFFF",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxSizing: "border-box",
              }}
            >
              <Share2 size={16} aria-hidden="true" />
              Share Invite
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════
            6. NEXT GOAL
        ════════════════════════════════════════ */}
        <div style={{ marginTop: "24px" }}>
          <SectionHeader title="Your Next Goal" />
          <div
            style={{
              marginTop: "12px",
              backgroundColor: NAVY_BG,
              borderRadius: "12px",
              border: "1px solid rgba(22,21,51,0.12)",
              padding: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              {/* Icon block */}
              <div
                aria-hidden="true"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: NAVY,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Trophy size={20} color="#FFFFFF" />
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#1A1A1A",
                  }}
                >
                  Unlock Silver Membership
                </div>
                <div
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    fontWeight: 400,
                    color: "#9B9B9B",
                    marginTop: "5px",
                    lineHeight: "18px",
                  }}
                >
                  Complete 5 more jobs or successfully refer 1 new provider to unlock
                  Silver Membership and receive a Featured Profile reward.
                </div>

                {/* CTA buttons */}
                <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={onAcceptJobs}
                    style={{
                      height: "34px",
                      paddingLeft: "16px",
                      paddingRight: "16px",
                      borderRadius: "8px",
                      backgroundColor: NAVY,
                      border: "none",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#FFFFFF",
                      cursor: "pointer",
                    }}
                  >
                    Accept Jobs
                  </button>
                  <button
                    type="button"
                    style={{
                      height: "34px",
                      paddingLeft: "16px",
                      paddingRight: "16px",
                      borderRadius: "8px",
                      backgroundColor: "#FFFFFF",
                      border: "1px solid rgba(22,21,51,0.2)",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: NAVY,
                      cursor: "pointer",
                    }}
                  >
                    Invite Provider
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════
            7. RECENT ACTIVITY
        ════════════════════════════════════════ */}
        <div style={{ marginTop: "24px" }}>
          <SectionHeader title="Recent Activity" />
          <div
            style={{
              marginTop: "12px",
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              border: "1px solid #E8E3DB",
              boxShadow: "0px 2px 8px rgba(0,0,0,0.07)",
              overflow: "hidden",
            }}
          >
            {ACTIVITY.map((item, i) => {
              const isPoints = item.badge.startsWith("+");
              const dotChar = isPoints ? "+" : item.badge.slice(0, 1);
              return (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 14px",
                    borderBottom:
                      i < ACTIVITY.length - 1 ? "1px solid #EFEFEF" : "none",
                  }}
                >
                  {/* Badge avatar */}
                  <div
                    aria-hidden="true"
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      backgroundColor: `${item.color}18`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: item.color,
                      }}
                    >
                      {dotChar}
                    </span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#1A1A1A",
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "11px",
                        fontWeight: 400,
                        color: "#9B9B9B",
                        marginTop: "2px",
                      }}
                    >
                      {item.time}
                    </div>
                  </div>

                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: item.color,
                      flexShrink: 0,
                    }}
                  >
                    {item.badge}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── Provider bottom navigation ── */}
      <ProviderBottomNav active="profile" onChange={handleTabChange} />
    </div>
  );
};
