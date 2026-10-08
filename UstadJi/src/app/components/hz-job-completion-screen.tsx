import React, { useEffect, useState } from "react";
import { HzButton } from "./hz-button";

const NAVY  = "#161533";
const GREEN = "#4CAF84";

/* ─── Animated checkmark ─── */
const AnimatedCheckmark: React.FC = () => {
  const [phase, setPhase] = useState<"idle" | "circle" | "check" | "done">("idle");

  useEffect(() => {
    /* Staggered entrance: circle first, then the tick */
    const t1 = setTimeout(() => setPhase("circle"), 80);
    const t2 = setTimeout(() => setPhase("check"),  480);
    const t3 = setTimeout(() => setPhase("done"),   900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        width: "96px",
        height: "96px",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {/* Outer glow ring */}
      <div
        style={{
          position: "absolute",
          inset: "-8px",
          borderRadius: "50%",
          backgroundColor: `${GREEN}14`,
          transform: phase === "idle" ? "scale(0)" : "scale(1)",
          transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      />

      {/* Circle */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          backgroundColor: GREEN,
          transform: phase === "idle" ? "scale(0)" : "scale(1)",
          transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      />

      {/* Checkmark SVG */}
      <svg
        viewBox="0 0 96 96"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: phase === "idle" || phase === "circle" ? 0 : 1,
          transition: "opacity 0.25s ease",
        }}
      >
        <polyline
          points="24,50 40,66 72,34"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 60,
            strokeDashoffset: phase === "check" || phase === "done" ? 0 : 60,
            transition: "stroke-dashoffset 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
          }}
        />
      </svg>
    </div>
  );
};

/* ─── Points badge ─── */
const PointsBadge: React.FC<{ show: boolean }> = ({ show }) => (
  <div
    aria-label="100 reward points earned"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      height: "36px",
      paddingLeft: "16px",
      paddingRight: "16px",
      borderRadius: "18px",
      backgroundColor: NAVY,
      opacity: show ? 1 : 0,
      transform: show ? "translateY(0) scale(1)" : "translateY(8px) scale(0.92)",
      transition: "opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
    }}
  >
    <span
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "13px",
        fontWeight: 700,
        color: "#FFFFFF",
        letterSpacing: "0.3px",
      }}
    >
      + 100 PTS
    </span>
    <span style={{ fontSize: "14px" }}>🏅</span>
  </div>
);

/* ─── Summary row ─── */
const SummaryRow: React.FC<{
  label: string;
  value: React.ReactNode;
  last?: boolean;
  valueColor?: string;
}> = ({ label, value, last, valueColor = "#1A1A1A" }) => (
  <div
    style={{
      minHeight: "36px",
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
        fontWeight: 500,
        color: valueColor,
        textAlign: "right",
      }}
    >
      {value}
    </span>
  </div>
);

/* ─── Props ─── */
interface HzJobCompletionScreenProps {
  onRateProvider?: () => void;
  onReturnHome?: () => void;
  onViewInvoice?: () => void;
  onSendInvoice?: () => void;
}

/* ─── Main screen ─── */
export const HzJobCompletionScreen: React.FC<HzJobCompletionScreenProps> = ({
  onRateProvider,
  onReturnHome,
  onViewInvoice,
  onSendInvoice,
}) => {
  const [showContent, setShowContent] = useState(false);
  const [showPoints, setShowPoints]   = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowContent(true), 700);
    const t2 = setTimeout(() => setShowPoints(true),  1100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

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
      {/* Status bar */}
      <div
        aria-hidden="true"
        style={{ height: "24px", flexShrink: 0, backgroundColor: "#FFFFFF" }}
      />

      {/* App bar */}
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
          Job Complete
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
          paddingTop: "32px",
          paddingBottom: "32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* ── Success hero ── */}
        <AnimatedCheckmark />

        <h1
          style={{
            margin: 0,
            marginTop: "20px",
            fontFamily: "Inter, sans-serif",
            fontSize: "24px",
            fontWeight: 700,
            lineHeight: "30px",
            color: "#1A1A1A",
            textAlign: "center",
            opacity: showContent ? 1 : 0,
            transform: showContent ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          Service Completed!
        </h1>

        <p
          style={{
            margin: 0,
            marginTop: "8px",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "21px",
            color: "#9B9B9B",
            textAlign: "center",
            maxWidth: "260px",
            opacity: showContent ? 1 : 0,
            transition: "opacity 0.4s ease 0.1s",
          }}
        >
          Ali Hassan has successfully completed your AC Repairing service.
        </p>

        {/* Points badge */}
        <div style={{ marginTop: "20px" }}>
          <PointsBadge show={showPoints} />
        </div>

        <p
          style={{
            margin: 0,
            marginTop: "8px",
            fontFamily: "Inter, sans-serif",
            fontSize: "12px",
            fontWeight: 400,
            color: "#9B9B9B",
            textAlign: "center",
            opacity: showPoints ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          Reward points added to your account 🎉
        </p>

        {/* ── Job summary card ── */}
        <div
          style={{
            width: "100%",
            marginTop: "28px",
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            border: "1px solid #E8E3DB",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.07)",
            padding: "16px",
            opacity: showContent ? 1 : 0,
            transform: showContent ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.4s ease 0.15s, transform 0.4s ease 0.15s",
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: "12px" }}>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: "#1A1A1A",
              }}
            >
              Job Summary
            </span>
          </div>

          <div
            aria-hidden="true"
            style={{ height: "1px", backgroundColor: "#EFEFEF", marginBottom: "4px" }}
          />

          <SummaryRow label="Service"    value="AC Repairing" />
          <SummaryRow label="Provider"   value="Ali Hassan" />
          <SummaryRow label="Location"   value="G-13 · House 12" />
          <SummaryRow label="Completed"  value="Sat, 18 May · 10:47 AM" />
          <SummaryRow
            label="Amount Paid"
            value="PKR 2,873"
            valueColor={NAVY}
            last
          />
        </div>

        {/* ── Tier progress nudge ── */}
        <div
          style={{
            width: "100%",
            marginTop: "14px",
            borderRadius: "12px",
            backgroundColor: "#EEEEF5",
            border: "1px solid rgba(22,21,51,0.1)",
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            opacity: showContent ? 1 : 0,
            transition: "opacity 0.4s ease 0.25s",
          }}
        >
          <span style={{ fontSize: "22px", flexShrink: 0 }}>🥉</span>
          <div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: NAVY,
              }}
            >
              850 pts total — only 150 to Silver!
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
              Check your Rewards Hub to track progress.
            </div>
          </div>
        </div>

        {/* ── Invoice summary card ── */}
        <div
          style={{
            width: "100%",
            marginTop: "14px",
            backgroundColor: "#FAF8F5",
            borderRadius: "12px",
            border: "1px solid #E8E3DB",
            padding: "16px",
            opacity: showContent ? 1 : 0,
            transition: "opacity 0.4s ease 0.35s",
          }}
        >
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              color: NAVY,
              marginBottom: "6px",
            }}
          >
            Invoice Generated
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                color: "#9B9B9B",
              }}
            >
              INV-2026-001
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "15px",
                fontWeight: 700,
                color: "#1A1A1A",
              }}
            >
              PKR 5,535
            </span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={onViewInvoice}
              style={{
                flex: 1,
                height: "40px",
                borderRadius: "8px",
                backgroundColor: NAVY,
                border: "none",
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                color: "#FFFFFF",
                cursor: "pointer",
              }}
            >
              View Full Invoice
            </button>
            <button
              type="button"
              onClick={onSendInvoice}
              style={{
                flex: 1,
                height: "40px",
                borderRadius: "8px",
                backgroundColor: "transparent",
                border: `1px solid ${NAVY}`,
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                color: NAVY,
                cursor: "pointer",
              }}
            >
              Send to Customer
            </button>
          </div>
        </div>

        {/* Bottom spacer so content clears the pinned bar */}
        <div style={{ height: "16px", flexShrink: 0 }} />
      </div>

      {/* ── Pinned action bar ── */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid #EFEFEF",
          padding: "12px 16px 20px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* Primary */}
        <HzButton variant="primary" fullWidth onClick={onRateProvider}>
          Rate & Review Ustad
        </HzButton>

        {/* Secondary */}
        <button
          type="button"
          onClick={onReturnHome}
          style={{
            width: "100%",
            height: "48px",
            borderRadius: "12px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E8E3DB",
            fontFamily: "Inter, sans-serif",
            fontSize: "15px",
            fontWeight: 500,
            color: "#1A1A1A",
            cursor: "pointer",
            boxSizing: "border-box",
          }}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};
