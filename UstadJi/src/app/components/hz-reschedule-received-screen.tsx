import React, { useState } from "react";
import { ArrowLeft, Clock, CheckCircle, Calendar } from "lucide-react";

const NAVY   = "#161533";
const GREEN  = "#4CAF84";
const BG     = "#FAF8F5";
const BORDER = "#E8E3DB";

type ReceivedStep = "received" | "confirmed";

interface TimeSlot {
  id: string;
  day: string;
  time: string;
  date: string;
  best?: boolean;
}

const SUGGESTED_SLOTS: TimeSlot[] = [
  { id: "slot-1", day: "Tomorrow",  time: "2:00 PM",  date: "Fri, 17 May" },
  { id: "slot-2", day: "Tomorrow",  time: "4:30 PM",  date: "Fri, 17 May", best: true },
  { id: "slot-3", day: "Saturday",  time: "11:00 AM", date: "Sat, 18 May" },
];

export interface HzRescheduleReceivedScreenProps {
  onBack?: () => void;
  onConfirmed?: () => void;
  onChooseAnother?: () => void;
  initiator?: "customer" | "provider"; // who SENT the request (this is the OTHER party receiving)
}

/* ─── Card ─── */
const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ backgroundColor: "#FFFFFF", borderRadius: "14px", border: `1px solid ${BORDER}`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", padding: "16px", ...style }}>
    {children}
  </div>
);

/* ─── Received view ─── */
const ReceivedView: React.FC<{
  initiator: "customer" | "provider";
  selectedSlot: string | null;
  onSelectSlot: (id: string) => void;
  onConfirm: () => void;
  onChooseAnother: () => void;
}> = ({ initiator, selectedSlot, onSelectSlot, onConfirm, onChooseAnother }) => {
  const requesterLabel = initiator === "customer" ? "Customer" : "Your Ustaad (Ali Hassan)";
  const requestedByLabel = initiator === "customer" ? "Your customer has requested" : "Your Ustaad has requested";

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 32px", display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Request notice */}
      <div style={{ borderRadius: "12px", backgroundColor: "#FFF8EC", border: "1px solid #F59E0B40", padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Calendar size={18} color="#D97706" />
          </div>
          <div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, color: "#1A1A1A" }}>Reschedule Request</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#9B9B9B", marginTop: "2px", lineHeight: "18px" }}>
              {requestedByLabel} to move your AC Service from Thursday at 2:00 PM.
            </div>
          </div>
        </div>
      </div>

      {/* Booking info */}
      <Card>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 500, color: "#9B9B9B", letterSpacing: "0.4px", textTransform: "uppercase", marginBottom: "10px" }}>Booking</div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 600, color: "#1A1A1A" }}>AC Service</div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#9B9B9B", textDecoration: "line-through" }}>Thu, 16 May · 2:00 PM</div>
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true"><path d="M1 5h12M8 1l4 4-4 4" stroke="#9B9B9B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: NAVY }}>New time below</div>
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#9B9B9B", marginTop: "4px" }}>Requested by: {requesterLabel}</div>
      </Card>

      {/* Suggested slots */}
      <div>
        <h3 style={{ margin: "0 0 10px", fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 600, color: "#1A1A1A" }}>Select a new time</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {SUGGESTED_SLOTS.map((slot) => {
            const isSelected = selectedSlot === slot.id;
            return (
              <button key={slot.id} type="button" onClick={() => onSelectSlot(slot.id)}
                style={{ width: "100%", padding: "14px 16px", borderRadius: "14px", textAlign: "left", backgroundColor: isSelected ? NAVY : "#FFFFFF", border: `2px solid ${isSelected ? NAVY : slot.best ? GREEN : BORDER}`, cursor: "pointer", display: "flex", alignItems: "center", gap: "14px", transition: "all 0.15s ease" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: isSelected ? "rgba(255,255,255,0.12)" : slot.best ? "#F0FAF4" : BG, border: `1px solid ${isSelected ? "rgba(255,255,255,0.2)" : slot.best ? "#4CAF8440" : BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Clock size={20} color={isSelected ? "#FFFFFF" : slot.best ? GREEN : "#9B9B9B"} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 600, color: isSelected ? "#FFFFFF" : "#1A1A1A" }}>
                      {slot.day} · {slot.time}
                    </span>
                    {slot.best && (
                      <span style={{ padding: "2px 8px", borderRadius: "20px", backgroundColor: isSelected ? "rgba(76,175,132,0.25)" : GREEN, fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, color: isSelected ? GREEN : "#FFFFFF" }}>
                        Best match
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: isSelected ? "rgba(255,255,255,0.6)" : "#9B9B9B", marginTop: "2px" }}>
                    {slot.date}
                  </div>
                </div>
                {isSelected && (
                  <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: GREEN, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <button type="button" disabled={!selectedSlot} onClick={onConfirm}
        style={{ width: "100%", height: "52px", borderRadius: "14px", backgroundColor: selectedSlot ? NAVY : "#E8E3DB", border: "none", fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 600, color: selectedSlot ? "#FFFFFF" : "#9B9B9B", cursor: selectedSlot ? "pointer" : "default", marginTop: "4px" }}>
        Confirm New Time
      </button>
      <button type="button" onClick={onChooseAnother}
        style={{ width: "100%", height: "48px", borderRadius: "14px", backgroundColor: "#FFFFFF", border: `1.5px solid ${BORDER}`, fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 500, color: "#1A1A1A", cursor: "pointer" }}>
        Choose Another Time
      </button>
    </div>
  );
};

/* ─── Confirmed view ─── */
const ConfirmedView: React.FC<{ onDone: () => void }> = ({ onDone }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", gap: "24px" }}>
    {/* Success icon */}
    <div style={{ width: "88px", height: "88px", borderRadius: "50%", backgroundColor: "#F0FAF4", border: "1px solid #4CAF8440", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CheckCircle size={44} color={GREEN} />
    </div>

    <div style={{ textAlign: "center", maxWidth: "280px" }}>
      <h1 style={{ margin: "0 0 8px", fontFamily: "Inter, sans-serif", fontSize: "24px", fontWeight: 800, color: "#1A1A1A" }}>Booking Rescheduled</h1>
      <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: "20px", color: "#9B9B9B" }}>
        Confirmed by both you and the other party.
      </p>
    </div>

    {/* New booking details */}
    <div style={{ width: "100%", maxWidth: "320px", backgroundColor: "#FFFFFF", borderRadius: "16px", border: `1px solid ${BORDER}`, boxShadow: "0 2px 10px rgba(0,0,0,0.07)", overflow: "hidden" }}>
      <div style={{ padding: "16px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "18px", fontWeight: 700, color: "#1A1A1A" }}>AC Service</div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
          <div style={{ padding: "4px 10px", borderRadius: "20px", backgroundColor: "#F0FAF4", border: "1px solid #4CAF8440" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, color: GREEN }}>Tomorrow · 4:30 PM</span>
          </div>
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#9B9B9B", marginTop: "4px" }}>Fri, 17 May 2025</div>
      </div>
      <div style={{ padding: "12px 16px", backgroundColor: "#FAFAFA", display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: GREEN }} />
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 500, color: "#1A1A1A" }}>Confirmed by both customer and Ustaad</span>
      </div>
    </div>

    <button type="button" onClick={onDone}
      style={{ width: "100%", maxWidth: "320px", height: "52px", borderRadius: "14px", backgroundColor: NAVY, border: "none", fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 600, color: "#FFFFFF", cursor: "pointer" }}>
      Done
    </button>
  </div>
);

/* ─── Main screen ─── */
export const HzRescheduleReceivedScreen: React.FC<HzRescheduleReceivedScreenProps> = ({
  onBack,
  onConfirmed,
  onChooseAnother,
  initiator = "customer",
}) => {
  const [step, setStep] = useState<ReceivedStep>("received");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const title = step === "confirmed" ? "Rescheduled!" : "Reschedule Request";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: BG, overflow: "hidden" }}>
      {/* Status bar */}
      <div aria-hidden="true" style={{ height: "24px", flexShrink: 0, backgroundColor: "#FFFFFF" }} />

      {/* Header */}
      <header style={{ height: "56px", backgroundColor: "#FFFFFF", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", paddingLeft: "4px", paddingRight: "16px", flexShrink: 0, position: "relative" }}>
        {step === "received" && (
          <button type="button" onClick={onBack} aria-label="Back"
            style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer" }}>
            <ArrowLeft size={22} color="#1A1A1A" />
          </button>
        )}
        <span style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: "17px", fontWeight: 600, color: "#1A1A1A", pointerEvents: "none" }}>
          {title}
        </span>
      </header>

      {/* Content */}
      {step === "received" && (
        <ReceivedView
          initiator={initiator}
          selectedSlot={selectedSlot}
          onSelectSlot={setSelectedSlot}
          onConfirm={() => setStep("confirmed")}
          onChooseAnother={onChooseAnother || (() => onBack?.())}
        />
      )}
      {step === "confirmed" && (
        <ConfirmedView onDone={() => onConfirmed?.()} />
      )}
    </div>
  );
};
