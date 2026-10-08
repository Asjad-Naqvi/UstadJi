import React from "react";
import { Check, Bell } from "lucide-react";
import { HzButton } from "./hz-button";

/* ── Detail row ── */
const DetailRow: React.FC<{
  label: string;
  value: React.ReactNode;
  last?: boolean;
}> = ({ label, value, last }) => (
  <div
    style={{
      minHeight: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: last ? "none" : "1px solid #EFEFEF",
      gap: "12px",
      paddingTop: "2px",
      paddingBottom: "2px",
    }}
  >
    <span
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "13px",
        fontWeight: 400,
        lineHeight: "18px",
        color: "#9B9B9B",
        flexShrink: 0,
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "20px",
        color: "#1A1A1A",
        textAlign: "right",
      }}
    >
      {value}
    </span>
  </div>
);

/* ── Main screen ── */
interface HzBookingConfirmedScreenProps {
  onViewJob?: () => void;
  onBackToChat?: () => void;
  onMessageProvider?: () => void;
}

export const HzBookingConfirmedScreen: React.FC<HzBookingConfirmedScreenProps> = ({
  onViewJob,
  onBackToChat,
  onMessageProvider,
}) => (
  <div
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#FAF8F5",
      overflowY: "auto",
      overflowX: "hidden",
    }}
  >
    {/* Status bar — 24dp */}
    <div aria-hidden="true" style={{ height: "24px", flexShrink: 0 }} />

    {/* 24dp extra gap so content starts ~48dp from top */}
    <div style={{ height: "24px", flexShrink: 0 }} />

    {/* Scrollable content */}
    <div
      style={{
        paddingLeft: "16px",
        paddingRight: "16px",
        paddingBottom: "48px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Success icon */}
      <div
        aria-label="Booking confirmed"
        style={{
          width: "96px",
          height: "96px",
          borderRadius: "50%",
          backgroundColor: "#4CAF84",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Check size={48} color="#FFFFFF" strokeWidth={2.5} aria-hidden="true" />
      </div>

      {/* Heading */}
      <div style={{ marginTop: "24px", textAlign: "center" }}>
        <h1
          style={{
            margin: 0,
            fontFamily: "Inter, sans-serif",
            fontSize: "24px",
            fontWeight: 600,
            lineHeight: "30px",
            color: "#1A1A1A",
          }}
        >
          Booking Confirmed!
        </h1>
        <p
          style={{
            margin: 0,
            marginTop: "8px",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "20px",
            color: "#9B9B9B",
          }}
        >
          Ali Hassan has accepted your request.
        </p>
      </div>

      {/* Booking details card */}
      <div
        style={{
          marginTop: "24px",
          width: "100%",
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.07)",
          border: "1px solid #E8E3DB",
          padding: "16px",
        }}
      >
        {/* Card header */}
        <h2
          style={{
            margin: 0,
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: "22px",
            color: "#1A1A1A",
          }}
        >
          Your Booking
        </h2>
        <div
          aria-hidden="true"
          style={{ height: "1px", backgroundColor: "#EFEFEF", margin: "8px 0" }}
        />

        {/* Detail rows */}
        <DetailRow label="Service"    value="AC Repairing" />
        <DetailRow
          label="Provider"
          value={
            <span>
              Ali Hassan{" "}
              <span style={{ color: "#4CAF84", fontWeight: 500 }}>✓ Verified</span>
            </span>
          }
        />
        <DetailRow
          label="Contact"
          value={
            <a
              href="tel:+923001234567"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "20px",
                color: "#161533",
                textDecoration: "none",
              }}
            >
              +92 300 1234567
            </a>
          }
        />
        <DetailRow label="Location"   value="G-13, Islamabad" />
        <DetailRow
          label="Date & Time"
          value="Sat, 18 May 2025 · 9:00 AM"
          last
        />

        {/* Price summary */}
        <div
          aria-hidden="true"
          style={{ height: "2px", backgroundColor: "#EFEFEF", marginTop: "16px" }}
        />
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "15px",
              fontWeight: 600,
              lineHeight: "22px",
              color: "#1A1A1A",
            }}
          >
            Total Estimate
          </span>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "18px",
              fontWeight: 600,
              lineHeight: "24px",
              color: "#1A1A1A",
            }}
          >
            PKR 2,873
          </span>
        </div>
        <p
          style={{
            margin: 0,
            marginTop: "4px",
            fontFamily: "Inter, sans-serif",
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "16px",
            color: "#161533",
            textAlign: "right",
          }}
        >
          Bronze loyalty discount applied (− PKR 151)
        </p>
      </div>

      {/* Reminder note */}
      <div
        role="note"
        style={{
          marginTop: "16px",
          width: "100%",
          borderRadius: "12px",
          backgroundColor: "#FFF4E0",
          border: "1px solid #161533",
          padding: "16px",
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
          boxSizing: "border-box",
        }}
      >
        <Bell
          size={20}
          color="#161533"
          aria-hidden="true"
          style={{ flexShrink: 0, marginTop: "1px" }}
        />
        <p
          style={{
            margin: 0,
            fontFamily: "Inter, sans-serif",
            fontSize: "13px",
            fontWeight: 400,
            lineHeight: "18px",
            color: "#1A1A1A",
          }}
        >
          You'll receive a reminder 3 hours and 1 hour before the job.
        </p>
      </div>

      {/* Primary CTA */}
      <div style={{ marginTop: "24px", width: "100%" }}>
        <HzButton variant="primary" fullWidth onClick={onViewJob}>
          View Active Job
        </HzButton>
      </div>

      {/* Message Provider */}
      <button
        type="button"
        onClick={onMessageProvider}
        style={{
          marginTop: "10px",
          width: "100%",
          height: "48px",
          borderRadius: "12px",
          backgroundColor: "#EEEEF5",
          border: "1px solid rgba(22,21,51,0.12)",
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
          fontWeight: 600,
          color: "#161533",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#161533" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Message Provider
      </button>

      {/* Secondary link */}
      <button
        type="button"
        onClick={onBackToChat}
        style={{
          marginTop: "12px",
          background: "none",
          border: "none",
          padding: "12px 24px",
          minHeight: "48px",
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
          fontWeight: 500,
          lineHeight: "20px",
          color: "#161533",
          cursor: "pointer",
        }}
      >
        Back to Chat
      </button>
    </div>
  </div>
);
