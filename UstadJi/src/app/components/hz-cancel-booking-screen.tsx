import React, { useState } from "react";
import { ArrowLeft, AlertTriangle, CheckCircle, X } from "lucide-react";

const NAVY   = "#161533";
const GREEN  = "#4CAF84";
const BG     = "#FAF8F5";
const BORDER = "#E8E3DB";
const RED    = "#E11D48";

type CancelStep = "reasons" | "cancelled";

const CUSTOMER_REASONS = [
  "My plans have changed",
  "Found another provider",
  "Scheduling conflict",
  "Service no longer needed",
  "Price is too high",
  "Other reason",
];

const PROVIDER_REASONS = [
  "Emergency / personal situation",
  "Equipment issue or breakdown",
  "Travel conflict",
  "Overbooked by mistake",
  "Job scope changed unexpectedly",
  "Other reason",
];

export interface HzCancelBookingScreenProps {
  onBack?: () => void;
  onCancelled?: () => void;
  initiator?: "customer" | "provider";
}

/* ─── Card ─── */
const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ backgroundColor: "#FFFFFF", borderRadius: "14px", border: `1px solid ${BORDER}`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", padding: "16px", ...style }}>
    {children}
  </div>
);

/* ─── Reasons view ─── */
const ReasonsView: React.FC<{
  initiator: "customer" | "provider";
  onConfirm: () => void;
  onBack: () => void;
}> = ({ initiator, onConfirm, onBack }) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const reasons = initiator === "customer" ? CUSTOMER_REASONS : PROVIDER_REASONS;
  const otherParty = initiator === "customer" ? "your Ustaad" : "the customer";

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 32px", display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Warning banner */}
      <div style={{ borderRadius: "12px", backgroundColor: "#FFF1F2", border: "1px solid #FECDD3", padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
        <AlertTriangle size={18} color={RED} style={{ flexShrink: 0, marginTop: "1px" }} />
        <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "13px", lineHeight: "18px", color: "#881337" }}>
          {otherParty.charAt(0).toUpperCase() + otherParty.slice(1)} will be notified immediately. Frequent cancellations may affect your rating.
        </p>
      </div>

      {/* Booking info */}
      <Card>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 500, color: "#9B9B9B", letterSpacing: "0.4px", textTransform: "uppercase", marginBottom: "10px" }}>Booking to Cancel</div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 600, color: "#1A1A1A" }}>AC Service</div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#9B9B9B", marginTop: "2px" }}>Thursday, 16 May · 2:00 PM</div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#9B9B9B", marginTop: "2px" }}>
          {initiator === "customer" ? "Provider: Ali Hassan" : "Customer: Sana M."}
        </div>
      </Card>

      {/* Reason selection */}
      <div>
        <h3 style={{ margin: "0 0 10px", fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 600, color: "#1A1A1A" }}>Reason for cancellation</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {reasons.map((reason) => {
            const isSelected = selectedReason === reason;
            return (
              <button key={reason} type="button" onClick={() => setSelectedReason(reason)}
                style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", textAlign: "left", backgroundColor: isSelected ? "#FFF1F2" : "#FFFFFF", border: `1.5px solid ${isSelected ? RED : BORDER}`, fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: isSelected ? 500 : 400, color: isSelected ? RED : "#1A1A1A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {reason}
                {isSelected && (
                  <div style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: RED, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirm cancel */}
      <button type="button" disabled={!selectedReason} onClick={onConfirm}
        style={{ width: "100%", height: "52px", borderRadius: "14px", backgroundColor: selectedReason ? RED : "#E8E3DB", border: "none", fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 600, color: selectedReason ? "#FFFFFF" : "#9B9B9B", cursor: selectedReason ? "pointer" : "default", marginTop: "4px" }}>
        Cancel this Booking
      </button>
      <button type="button" onClick={onBack}
        style={{ width: "100%", height: "48px", borderRadius: "14px", backgroundColor: "#FFFFFF", border: `1.5px solid ${BORDER}`, fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 500, color: "#1A1A1A", cursor: "pointer" }}>
        Keep Booking
      </button>
    </div>
  );
};

/* ─── Cancelled view ─── */
const CancelledView: React.FC<{
  initiator: "customer" | "provider";
  onDone: () => void;
}> = ({ initiator, onDone }) => {
  const notifiedMsg = initiator === "customer"
    ? "Your Ustaad (Ali Hassan) has been notified of the cancellation."
    : "Sana M. (customer) has been notified of the cancellation.";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", gap: "24px" }}>
      {/* Icon */}
      <div style={{ width: "88px", height: "88px", borderRadius: "50%", backgroundColor: "#FFF1F2", border: "1px solid #FECDD3", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <X size={40} color={RED} />
      </div>

      <div style={{ textAlign: "center", maxWidth: "280px" }}>
        <h1 style={{ margin: "0 0 8px", fontFamily: "Inter, sans-serif", fontSize: "22px", fontWeight: 800, color: "#1A1A1A" }}>Booking Cancelled</h1>
        <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: "20px", color: "#9B9B9B" }}>
          {notifiedMsg}
        </p>
      </div>

      {/* Cancelled booking summary */}
      <div style={{ width: "100%", maxWidth: "320px", backgroundColor: "#FFFFFF", borderRadius: "14px", border: `1px solid #FECDD3`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 600, color: "#1A1A1A" }}>AC Service</span>
            <span style={{ padding: "3px 10px", borderRadius: "20px", backgroundColor: "#FFF1F2", fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 600, color: RED }}>Cancelled</span>
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#9B9B9B" }}>Thursday, 16 May · 2:00 PM</div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#9B9B9B", marginTop: "2px" }}>
            {initiator === "customer" ? "Provider: Ali Hassan" : "Customer: Sana M."}
          </div>
        </div>
        <div style={{ padding: "10px 16px", backgroundColor: "#FFF1F2", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: RED }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 500, color: "#881337" }}>
            {initiator === "customer" ? "Cancelled by customer" : "Cancelled by Ustaad"}
          </span>
        </div>
      </div>

      <button type="button" onClick={onDone}
        style={{ width: "100%", maxWidth: "320px", height: "52px", borderRadius: "14px", backgroundColor: NAVY, border: "none", fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 600, color: "#FFFFFF", cursor: "pointer" }}>
        Back to Home
      </button>
    </div>
  );
};

/* ─── Main screen ─── */
export const HzCancelBookingScreen: React.FC<HzCancelBookingScreenProps> = ({
  onBack,
  onCancelled,
  initiator = "customer",
}) => {
  const [step, setStep] = useState<CancelStep>("reasons");
  const title = step === "cancelled" ? "Booking Cancelled" : "Cancel Booking";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: BG, overflow: "hidden" }}>
      {/* Status bar */}
      <div aria-hidden="true" style={{ height: "24px", flexShrink: 0, backgroundColor: "#FFFFFF" }} />

      {/* Header */}
      <header style={{ height: "56px", backgroundColor: "#FFFFFF", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", paddingLeft: "4px", paddingRight: "16px", flexShrink: 0, position: "relative" }}>
        {step === "reasons" && (
          <button type="button" onClick={onBack} aria-label="Back"
            style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer" }}>
            <ArrowLeft size={22} color="#1A1A1A" />
          </button>
        )}
        <span style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: "17px", fontWeight: 600, color: step === "cancelled" ? RED : "#1A1A1A", pointerEvents: "none" }}>
          {title}
        </span>
      </header>

      {/* Content */}
      {step === "reasons" && (
        <ReasonsView
          initiator={initiator}
          onConfirm={() => setStep("cancelled")}
          onBack={() => onBack?.()}
        />
      )}
      {step === "cancelled" && (
        <CancelledView
          initiator={initiator}
          onDone={() => onCancelled?.()}
        />
      )}
    </div>
  );
};
