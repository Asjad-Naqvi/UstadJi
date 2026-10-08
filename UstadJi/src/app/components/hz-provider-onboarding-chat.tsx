import React, { useState } from "react";

const NAVY = "#161533";
const BG = "#FFFFFF";
const BG_PAGE = "#F7F7F8";
const BORDER = "#E2E2E6";
const MUTED = "#9B9B9B";
const GREEN = "#4CAF84";

/* ─── Progress bar ─── */
const StepStrip: React.FC<{ step: number; total: number; stepName: string }> = ({ step, total, stepName }) => (
  <div style={{ paddingLeft: "20px", paddingRight: "20px", paddingTop: "14px", paddingBottom: "12px", backgroundColor: BG, borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 500, color: MUTED, whiteSpace: "nowrap", flexShrink: 0 }}>
        Step {step} of {total}
      </span>
      <div style={{ flex: 1, height: "3px", borderRadius: "2px", backgroundColor: "#EBEBEB" }}
        role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={total}>
        <div style={{ width: `${(step / total) * 100}%`, height: "100%", borderRadius: "2px", backgroundColor: NAVY }} />
      </div>
    </div>
  </div>
);

/* ─── Section label ─── */
const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
  <span style={{ display: "block", fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: "#ABABAB", marginBottom: "10px" }}>
    {label}
  </span>
);

/* ─── Service chip ─── */
const Chip: React.FC<{ label: string; selected: boolean; onToggle: () => void }> = ({ label, selected, onToggle }) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={selected}
    onClick={onToggle}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      height: "34px",
      paddingLeft: "14px",
      paddingRight: selected ? "10px" : "14px",
      borderRadius: "17px",
      border: selected ? `2px solid ${NAVY}` : `1.5px solid ${BORDER}`,
      backgroundColor: selected ? NAVY : BG,
      fontFamily: "Inter, sans-serif",
      fontSize: "13px",
      fontWeight: selected ? 600 : 400,
      color: selected ? "#FFFFFF" : "#2A2A2A",
      cursor: "pointer",
      whiteSpace: "nowrap",
      flexShrink: 0,
      transition: "background-color 0.1s, border-color 0.1s, color 0.1s",
    }}
  >
    {label}
    {selected && (
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
        <circle cx="6.5" cy="6.5" r="6.5" fill="rgba(255,255,255,0.22)" />
        <path d="M3.5 6.5 L5.5 8.5 L9.5 4.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  </button>
);

/* ─── Home Repair services ─── */
const HOME_REPAIR = [
  "Plumbing", "Electrical", "Carpentry", "AC & Cooling",
  "Painting", "Gas & Appliances", "CCTV Installation", "Door Lock Repair",
  "Ceiling Fan Repair", "Water Tank Installation",
];

/* ─── Cleaning services ─── */
const CLEANING = [
  "Home Cleaning", "Kitchen Cleaning", "Bathroom Cleaning", "Sofa Cleaning",
  "Carpet Cleaning", "Office Cleaning", "Window Cleaning", "Water Tank Cleaning",
];

/* ─── Main screen ─── */
interface HzProviderOnboardingChatProps {
  onBack?: () => void;
  onComplete?: () => void;
}

export const HzProviderOnboardingChat: React.FC<HzProviderOnboardingChatProps> = ({ onBack, onComplete }) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (s: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });

  const totalSelected = selected.size;
  const canContinue = totalSelected > 0;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: BG_PAGE, overflow: "hidden" }}>

      {/* Status bar */}
      <div aria-hidden="true" style={{ height: "24px", flexShrink: 0, backgroundColor: BG }} />

      {/* Header */}
      <header style={{ height: "56px", backgroundColor: BG, display: "flex", alignItems: "center", paddingLeft: "4px", paddingRight: "16px", flexShrink: 0, position: "relative" }}>
        {onBack && (
          <button type="button" onClick={onBack} aria-label="Go back"
            style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path d="M14 18L7 11L14 4" stroke="#1A1A1A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <span style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: "17px", fontWeight: 600, color: "#1A1A1A", pointerEvents: "none" }}>
          Provider Registration
        </span>
      </header>

      {/* Progress strip */}
      <StepStrip step={4} total={9} stepName="Services Offered" />

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px 32px" }}>

        {/* Page heading */}
        <h2 style={{ margin: "0 0 6px", fontFamily: "Inter, sans-serif", fontSize: "20px", fontWeight: 700, color: "#1A1A1A", lineHeight: "27px" }}>
          What services do you offer?
        </h2>
        <p style={{ margin: "0 0 24px", fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 400, color: MUTED, lineHeight: "20px" }}>
          Shukriya, Zain! Aap kaunsi services offer karte hain? Neeche se select karein.
        </p>

        {/* Home Repair card */}
        <div style={{ backgroundColor: BG, borderRadius: "14px", border: `1px solid ${BORDER}`, padding: "16px", marginBottom: "12px" }}>
          <SectionLabel label="Home Repair & Maintenance" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {HOME_REPAIR.map((s) => (
              <Chip key={s} label={s} selected={selected.has(s)} onToggle={() => toggle(s)} />
            ))}
          </div>
        </div>

        {/* Cleaning card */}
        <div style={{ backgroundColor: BG, borderRadius: "14px", border: `1px solid ${BORDER}`, padding: "16px", marginBottom: "12px" }}>
          <SectionLabel label="Cleaning Services" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {CLEANING.map((s) => (
              <Chip key={s} label={s} selected={selected.has(s)} onToggle={() => toggle(s)} />
            ))}
          </div>
        </div>

      </div>

      {/* Bottom action bar */}
      <div style={{ backgroundColor: BG, borderTop: `1px solid ${BORDER}`, padding: "12px 16px 20px", flexShrink: 0 }}>
        {/* Selection summary */}
        <div style={{ minHeight: "18px", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {!canContinue ? (
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: MUTED }}>
              Select or add at least one service
            </span>
          ) : (
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: GREEN, fontWeight: 500 }}>
              {totalSelected} service{totalSelected !== 1 ? "s" : ""} selected
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => canContinue && onComplete?.()}
          disabled={!canContinue}
          style={{
            width: "100%",
            height: "52px",
            borderRadius: "14px",
            border: "none",
            backgroundColor: canContinue ? NAVY : "#DDDDE4",
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            fontWeight: 600,
            color: canContinue ? "#FFFFFF" : "#AAAAAA",
            cursor: canContinue ? "pointer" : "default",
            transition: "background-color 0.15s",
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
