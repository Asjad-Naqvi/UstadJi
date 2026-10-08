import React, { useState } from "react";
import {
  MessageCircle,
  Heart,
  User,
  ChevronLeft,
  ChevronRight,
  Copy,
  Share2,
  Trophy,
  Users,
  Lock,
  CheckCircle,
} from "lucide-react";

type ChatTab = "chat" | "bookings" | "favourites" | "profile";

const NAVY = "#161533";
const NAVY_BG = "#EEEEF5";

/* ─── Shared sub-components ─── */

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

/* ─── Static data ─── */

const TIERS = [
  {
    id: "bronze",
    emoji: "🥉",
    name: "Bronze",
    tierColor: "#CD7F32",
    range: "0 – 999 pts",
    benefits: ["Earn reward points on every booking"],
  },
  {
    id: "silver",
    emoji: "🥈",
    name: "Silver",
    tierColor: "#A0A0A8",
    range: "1,000 – 2,499 pts",
    benefits: ["5% booking discount", "Priority customer support"],
  },
  {
    id: "gold",
    emoji: "🥇",
    name: "Gold",
    tierColor: "#C9961A",
    range: "2,500 – 4,999 pts",
    benefits: [
      "10% booking discount",
      "Exclusive seasonal promotions",
      "Early access to offers",
    ],
  },
  {
    id: "platinum",
    emoji: "💎",
    name: "Platinum",
    tierColor: "#5B6EAE",
    range: "5,000 + pts",
    benefits: [
      "20% booking discount",
      "Free booking vouchers",
      "VIP support",
      "Premium member badge",
    ],
  },
];

const ACHIEVEMENTS = [
  { id: "first",     emoji: "🎯", name: "First Booking",       earned: true  },
  { id: "loyal",     emoji: "⭐", name: "Loyal Customer",      earned: true  },
  { id: "ten",       emoji: "🏆", name: "10 Bookings",         earned: false },
  { id: "referral",  emoji: "👥", name: "Referral Champion",   earned: false },
  { id: "community", emoji: "❤️", name: "Community Supporter", earned: false },
  { id: "platinum",  emoji: "💎", name: "Platinum Member",     earned: false },
];

const STORE_ITEMS = [
  { id: "d10",  icon: "🎟️", name: "10% Discount Voucher",    desc: "Valid on any single booking",     points: 200 },
  { id: "d20",  icon: "🎫", name: "20% Discount Voucher",    desc: "Valid on any single booking",     points: 400 },
  { id: "free", icon: "🎁", name: "Free Booking Voucher",    desc: "One service, completely free",    points: 800 },
  { id: "fee",  icon: "✨", name: "Free Platform Fee",       desc: "Waive service fee, next booking", points: 150 },
  { id: "prio", icon: "⚡", name: "Priority Support",        desc: "Jump the queue for 30 days",      points: 100 },
];

const ACTIVITY = [
  { id: "a1", badge: "+100", label: "First Booking Completed",        time: "Today",      color: "#4CAF84" },
  { id: "a2", badge: "+200", label: "Friend Joined via Referral",     time: "2 days ago", color: "#4CAF84" },
  { id: "a3", badge: "Used", label: "10% Discount Voucher Redeemed",  time: "1 week ago", color: NAVY      },
  { id: "a4", badge: "🥉",   label: "Bronze Badge Earned",           time: "2 wks ago",  color: "#CD7F32" },
];

/* ─── Bottom nav tabs ─── */

const TABS: {
  id: ChatTab;
  Icon: React.FC<{ size: number; color: string; fill?: string }>;
  label: string;
}[] = [
  { id: "chat",       Icon: MessageCircle, label: "Chat"       },
  {
    id: "bookings",
    Icon: ({ size, color }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    label: "Bookings",
  },
  { id: "favourites", Icon: Heart, label: "Favourites" },
  { id: "profile",    Icon: User,  label: "Profile"    },
];

/* ─── Main component ─── */

interface HzRewardsHubScreenProps {
  onBack?: () => void;
  onTabChange?: (tab: ChatTab) => void;
  onBookNow?: () => void;
}

export const HzRewardsHubScreen: React.FC<HzRewardsHubScreenProps> = ({
  onBack,
  onTabChange,
  onBookNow,
}) => {
  const [copied, setCopied] = useState(false);

  const currentPoints = 750;
  const nextTierPoints = 1000;
  const progressPct = (currentPoints / nextTierPoints) * 100;
  const pointsToNext = nextTierPoints - currentPoints;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

        {/* Trophy badge — decorative right slot */}
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
          {/* Avatar + name + points row */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
                flexShrink: 0,
              }}
            >
              <User size={26} color="#FFFFFF" />
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
                Sana Malik
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
                🥉 Bronze Member
              </span>
            </div>

            {/* Points display */}
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
                750
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
                750 / 1,000
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
              { label: "Bookings",   value: "8"        },
              { label: "Saved",      value: "PKR 1.2K" },
              { label: "Referrals",  value: "2"        },
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
                  {/* Tier header row */}
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

                  {/* Benefits list */}
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
            3. ACHIEVEMENTS
        ════════════════════════════════════════ */}
        <div style={{ marginTop: "24px" }}>
          <SectionHeader title="Achievements" />
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
                  border: a.earned ? `1px solid rgba(22,21,51,0.15)` : "1px solid #E8E3DB",
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
              style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}
            >
              <Users size={20} color="rgba(255,255,255,0.75)" aria-hidden="true" />
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#FFFFFF",
                }}
              >
                Invite Friends, Earn Together
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
              Invite your friends to Ustaad G. When they complete their first booking using
              your referral code, both of you receive reward points and exclusive rewards.
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
                  SANA2025
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
              border: `1px solid rgba(22,21,51,0.12)`,
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
                  Book 2 more services or refer 1 friend to unlock Silver Membership
                  and receive a 5% Discount Voucher.
                </div>

                {/* CTA buttons */}
                <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={onBookNow}
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
                    Book Now
                  </button>
                  <button
                    type="button"
                    style={{
                      height: "34px",
                      paddingLeft: "16px",
                      paddingRight: "16px",
                      borderRadius: "8px",
                      backgroundColor: "#FFFFFF",
                      border: `1px solid rgba(22,21,51,0.2)`,
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: NAVY,
                      cursor: "pointer",
                    }}
                  >
                    Invite Friend
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
            {ACTIVITY.map((item, i) => (
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
                {/* Dot avatar */}
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
                    {item.badge === "+100" || item.badge === "+200" ? "+" : item.badge.slice(0, 1)}
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
            ))}
          </div>
        </div>

      </div>

      {/* ── Bottom navigation ── */}
      <nav
        aria-label="Main navigation"
        style={{
          height: "64px",
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid #EFEFEF",
          display: "flex",
          flexShrink: 0,
        }}
      >
        {TABS.map(({ id, Icon, label }) => {
          const isActive = id === "profile";
          const color = isActive ? NAVY : "#9B9B9B";
          return (
            <button
              key={id}
              type="button"
              aria-current={isActive ? "page" : undefined}
              aria-label={label}
              onClick={() => !isActive && onTabChange?.(id)}
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
                minWidth: "48px",
              }}
            >
              <Icon
                size={24}
                color={color}
                fill={isActive && id === "favourites" ? color : "none"}
                aria-hidden="true"
              />
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
    </div>
  );
};
