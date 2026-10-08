import React from "react";
import { UserX, Search } from "lucide-react";

const NAVY   = "#161533";
const GREEN  = "#4CAF84";
const BG     = "#FAF8F5";
const BORDER = "#E8E3DB";

export interface HzProviderCancelledNoticeProps {
  onFindAlternatives?: () => void;
  onGoHome?: () => void;
}

export const HzProviderCancelledNotice: React.FC<HzProviderCancelledNoticeProps> = ({
  onFindAlternatives,
  onGoHome,
}) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: BG, overflow: "hidden" }}>
    {/* Status bar */}
    <div aria-hidden="true" style={{ height: "24px", flexShrink: 0, backgroundColor: "#FFFFFF" }} />

    {/* Header */}
    <header style={{ height: "56px", backgroundColor: "#FFFFFF", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: "16px", paddingRight: "16px", flexShrink: 0 }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "17px", fontWeight: 600, color: "#1A1A1A" }}>
        Booking Update
      </span>
    </header>

    {/* Content */}
    <div style={{ flex: 1, overflowY: "auto", padding: "32px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
      {/* Icon */}
      <div style={{ width: "96px", height: "96px", borderRadius: "50%", backgroundColor: "#FFF8EC", border: "1px solid #FDE68A", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <UserX size={46} color="#D97706" />
      </div>

      {/* Message */}
      <div style={{ textAlign: "center", maxWidth: "290px" }}>
        <h1 style={{ margin: "0 0 10px", fontFamily: "Inter, sans-serif", fontSize: "22px", fontWeight: 800, color: "#1A1A1A", lineHeight: "30px" }}>
          Your Ustaad is no longer available
        </h1>
        <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: "20px", color: "#9B9B9B" }}>
          Ali Hassan has cancelled your AC Service booking for Thursday at 2:00 PM. We're sorry for the inconvenience.
        </p>
      </div>

      {/* Cancelled booking card */}
      <div style={{ width: "100%", backgroundColor: "#FFFFFF", borderRadius: "14px", border: `1px solid ${BORDER}`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 600, color: "#1A1A1A" }}>AC Service</span>
            <span style={{ padding: "3px 10px", borderRadius: "20px", backgroundColor: "#FFF8EC", fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 600, color: "#D97706" }}>Provider Cancelled</span>
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#9B9B9B" }}>Thursday, 16 May · 2:00 PM</div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#9B9B9B", marginTop: "2px" }}>Provider: Ali Hassan</div>
        </div>
        <div style={{ padding: "10px 16px", backgroundColor: "#FFF8EC", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#D97706" }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 500, color: "#92400E" }}>Cancelled by Ustaad</span>
        </div>
      </div>

      {/* Help offer */}
      <div style={{ width: "100%", borderRadius: "14px", backgroundColor: "#EEEEF5", border: `1px solid rgba(22,21,51,0.1)`, padding: "16px" }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, color: NAVY, marginBottom: "6px" }}>
          We can help you find another Ustaad
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", lineHeight: "18px", color: "#6B6B6B" }}>
          We've found verified AC technicians near you who are available around your original time. One has been pre-matched to your preferences.
        </div>
      </div>

      {/* CTAs */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
        <button type="button" onClick={onFindAlternatives}
          style={{ width: "100%", height: "54px", borderRadius: "14px", backgroundColor: NAVY, border: "none", fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 600, color: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <Search size={18} color="#FFFFFF" />
          Find Alternative Ustaad
        </button>
        <button type="button" onClick={onGoHome}
          style={{ width: "100%", height: "48px", borderRadius: "14px", backgroundColor: "#FFFFFF", border: `1.5px solid ${BORDER}`, fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 500, color: "#1A1A1A", cursor: "pointer" }}>
          Back to Home
        </button>
      </div>
    </div>
  </div>
);
