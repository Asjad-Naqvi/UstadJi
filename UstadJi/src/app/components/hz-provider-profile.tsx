import React from "react";
import { User, ChevronRight, Home, Bell, Trophy, FileText, Sparkles } from "lucide-react";

/* ─── Types ─── */
type ProviderTab = "dashboard" | "inbox" | "profile";

/* ─── Stat tile ─── */
const StatTile: React.FC<{ value: string; label: string; last?: boolean }> = ({
  value,
  label,
  last,
}) => (
  <div
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "2px",
      borderRight: last ? "none" : "1px solid #EFEFEF",
    }}
  >
    <span
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "16px",
        fontWeight: 600,
        lineHeight: "22px",
        color: "#1A1A1A",
        textAlign: "center",
      }}
    >
      {value}
    </span>
    <span
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "12px",
        fontWeight: 400,
        lineHeight: "16px",
        color: "#9B9B9B",
        textAlign: "center",
      }}
    >
      {label}
    </span>
  </div>
);

/* ─── Section header ─── */
const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
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
);

/* ─── Chip ─── */
const Chip: React.FC<{ label: string; variant: "amber" | "outlined" }> = ({
  label,
  variant,
}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      height: "32px",
      paddingLeft: "12px",
      paddingRight: "12px",
      borderRadius: "16px",
      backgroundColor: variant === "amber" ? "#161533" : "#FFFFFF",
      border: variant === "amber" ? "none" : "1px solid #E8E3DB",
      fontFamily: "Inter, sans-serif",
      fontSize: "13px",
      fontWeight: 500,
      lineHeight: "18px",
      color: variant === "amber" ? "#FFFFFF" : "#1A1A1A",
      whiteSpace: "nowrap",
      flexShrink: 0,
    }}
  >
    {label}
  </span>
);

/* ─── Schedule row ─── */
const ScheduleRow: React.FC<{ day: string; hours: string; last?: boolean }> = ({
  day,
  hours,
  last,
}) => (
  <div
    style={{
      height: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: last ? "none" : "1px solid #EFEFEF",
    }}
  >
    <span
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "20px",
        color: "#9B9B9B",
        flexShrink: 0,
      }}
    >
      {day}
    </span>
    <span
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "20px",
        color: hours === "Unavailable" ? "#9B9B9B" : "#1A1A1A",
      }}
    >
      {hours}
    </span>
  </div>
);

/* ─── Account row ─── */
const AccountRow: React.FC<{ label: string; last?: boolean; icon?: React.ReactNode; onPress?: () => void }> = ({ label, last, icon, onPress }) => (
  <button
    type="button"
    onClick={onPress}
    style={{
      width: "100%",
      height: "48px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "none",
      border: "none",
      borderBottom: last ? "none" : "1px solid #EFEFEF",
      padding: 0,
      cursor: "pointer",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      {icon}
      <span
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
          fontWeight: 400,
          lineHeight: "20px",
          color: "#1A1A1A",
        }}
      >
        {label}
      </span>
    </div>
    <ChevronRight size={18} color="#9B9B9B" aria-hidden="true" />
  </button>
);

/* ─── Bottom nav ─── */
const BottomNav: React.FC<{ active: ProviderTab; onChange: (t: ProviderTab) => void }> = ({
  active,
  onChange,
}) => {
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
        const color = isActive ? "#161533" : "#9B9B9B";
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

/* ─── Main screen ─── */
interface HzProviderProfileProps {
  onSignOut?: () => void;
  onUpdateProfile?: () => void;
  onRewardsHub?: () => void;
  onTabChange?: (tab: ProviderTab) => void;
  onInvoiceHistory?: () => void;
  onOptimizeProfile?: () => void;
}

export const HzProviderProfile: React.FC<HzProviderProfileProps> = ({
  onSignOut,
  onUpdateProfile,
  onRewardsHub,
  onTabChange,
  onInvoiceHistory,
  onOptimizeProfile,
}) => (
  <div
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#FAF8F5",
      overflow: "hidden",
    }}
  >
    {/* Status bar */}
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
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "17px",
          fontWeight: 600,
          lineHeight: "22px",
          color: "#1A1A1A",
        }}
      >
        My Profile
      </span>
    </header>

    {/* Scrollable content */}
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
      {/* Profile header card */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.07)",
          border: "1px solid #E8E3DB",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Avatar */}
        <div
          aria-hidden="true"
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: "#E8E3DB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <User size={32} color="#FFFFFF" aria-hidden="true" />
        </div>

        {/* Name + badges */}
        <div
          style={{
            marginTop: "12px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "20px",
              fontWeight: 600,
              lineHeight: "26px",
              color: "#1A1A1A",
            }}
          >
            Zain Ul Abideen
          </span>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: "22px",
              paddingLeft: "10px",
              paddingRight: "10px",
              borderRadius: "11px",
              backgroundColor: "#4CAF84",
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              fontWeight: 500,
              lineHeight: "16px",
              color: "#FFFFFF",
            }}
          >
            ✓ Ustaad G Verified
          </span>

          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "20px",
              color: "#9B9B9B",
            }}
          >
            +92 300 9876543
          </span>

          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              fontWeight: 400,
              lineHeight: "16px",
              color: "#9B9B9B",
            }}
          >
            Member since March 2025
          </span>
        </div>

        {/* Stats row */}
        <div
          aria-hidden="true"
          style={{ width: "100%", height: "1px", backgroundColor: "#EFEFEF", margin: "12px 0" }}
        />
        <div style={{ display: "flex", width: "100%", alignItems: "stretch" }}>
          <StatTile value="42 Jobs" label="Completed" />
          <StatTile value="★ 4.8"   label="Rating"    />
          <StatTile value="94%"     label="On Time"   last />
        </div>
      </div>

      {/* Services offered */}
      <div style={{ marginTop: "24px" }}>
        <SectionHeader title="Services Offered" />
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {["AC Repairing", "AC General Service", "AC Installation"].map((s) => (
            <Chip key={s} label={s} variant="amber" />
          ))}
        </div>
      </div>

      {/* Service areas */}
      <div style={{ marginTop: "24px" }}>
        <SectionHeader title="Service Areas" />
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {["G-10", "G-11", "G-13", "G-14", "F-7"].map((a) => (
            <Chip key={a} label={a} variant="outlined" />
          ))}
        </div>
      </div>

      {/* Schedule */}
      <div style={{ marginTop: "24px" }}>
        <SectionHeader title="My Schedule" />
        <div style={{ marginTop: "12px" }}>
          {[
            { day: "Monday",    hours: "8:00 AM – 5:00 PM" },
            { day: "Tuesday",   hours: "8:00 AM – 5:00 PM" },
            { day: "Wednesday", hours: "8:00 AM – 5:00 PM" },
            { day: "Thursday",  hours: "8:00 AM – 5:00 PM" },
            { day: "Friday",    hours: "8:00 AM – 5:00 PM" },
            { day: "Saturday",  hours: "9:00 AM – 2:00 PM" },
            { day: "Sunday",    hours: "Unavailable"        },
          ].map(({ day, hours }, i, arr) => (
            <ScheduleRow key={day} day={day} hours={hours} last={i === arr.length - 1} />
          ))}
        </div>
      </div>

      {/* Update CTA */}
      <div style={{ marginTop: "24px" }}>
        <button
          type="button"
          onClick={onUpdateProfile}
          style={{
            display: "block",
            width: "100%",
            height: "56px",
            borderRadius: "12px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #161533",
            fontFamily: "Inter, sans-serif",
            fontSize: "15px",
            fontWeight: 500,
            lineHeight: "22px",
            color: "#161533",
            cursor: "pointer",
            boxSizing: "border-box",
          }}
        >
          Update My Profile / Skills →
        </button>
        <p
          style={{
            margin: 0,
            marginTop: "8px",
            fontFamily: "Inter, sans-serif",
            fontSize: "11px",
            fontWeight: 400,
            lineHeight: "15px",
            color: "#9B9B9B",
            textAlign: "center",
          }}
        >
          Opens the Ustaad G registration chat to update any field.
        </p>
      </div>

      {/* Rewards */}
      <div style={{ marginTop: "24px" }}>
        <SectionHeader title="Rewards" />
        <div style={{ marginTop: "12px" }}>
          <button
            type="button"
            onClick={onRewardsHub}
            style={{
              width: "100%",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "none",
              border: "none",
              borderBottom: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Trophy size={20} color="#161533" aria-hidden="true" />
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: "#1A1A1A",
                }}
              >
                Rewards Hub
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: "20px",
                  paddingLeft: "8px",
                  paddingRight: "8px",
                  borderRadius: "10px",
                  backgroundColor: "#161533",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "#FFFFFF",
                }}
              >
                820 pts
              </span>
              <ChevronRight size={18} color="#9B9B9B" aria-hidden="true" />
            </div>
          </button>
        </div>
      </div>

      {/* AI Tools */}
      <div style={{ marginTop: "24px" }}>
        <SectionHeader title="AI Tools" />
        <div
          style={{
            marginTop: "12px",
            backgroundColor: "#EEF0FA",
            borderRadius: "12px",
            border: "1px solid #C5CAE9",
            overflow: "hidden",
          }}
        >
          <AccountRow
            label="Optimize My Profile"
            icon={<Sparkles size={18} color="#161533" aria-hidden="true" />}
            onPress={onOptimizeProfile}
            last
          />
        </div>
        <p
          style={{
            margin: "6px 0 0",
            fontFamily: "Inter, sans-serif",
            fontSize: "11px",
            fontWeight: 400,
            lineHeight: "15px",
            color: "#9B9B9B",
          }}
        >
          AI se apna profile better banayein — zyada bookings pao.
        </p>
      </div>

      {/* Account */}
      <div style={{ marginTop: "24px" }}>
        <SectionHeader title="Account" />
        <div style={{ marginTop: "12px" }}>
          <AccountRow label="Privacy & Data" />
          <AccountRow
            label="Invoices"
            icon={<FileText size={18} color="#161533" aria-hidden="true" />}
            onPress={onInvoiceHistory}
          />
          <AccountRow label="About Ustaad G" last />
        </div>
      </div>

      {/* Sign out */}
      <button
        type="button"
        onClick={onSignOut}
        style={{
          display: "block",
          width: "100%",
          height: "48px",
          marginTop: "24px",
          borderRadius: "12px",
          backgroundColor: "#FFFFFF",
          border: "1px solid #D94F4F",
          fontFamily: "Inter, sans-serif",
          fontSize: "15px",
          fontWeight: 500,
          lineHeight: "22px",
          color: "#D94F4F",
          cursor: "pointer",
          boxSizing: "border-box",
        }}
      >
        Sign Out
      </button>

      {/* Version */}
      <p
        style={{
          margin: 0,
          marginTop: "12px",
          fontFamily: "Inter, sans-serif",
          fontSize: "11px",
          fontWeight: 400,
          lineHeight: "15px",
          color: "#9B9B9B",
          textAlign: "center",
        }}
      >
        Ustaad G v1.0.0 — Hackathon Build
      </p>
    </div>

    <BottomNav active="profile" onChange={(t) => onTabChange?.(t)} />
  </div>
);
