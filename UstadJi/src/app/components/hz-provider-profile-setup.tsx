import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

const NAVY  = "#161533";
const BG    = "#FFFFFF";
const PAGE  = "#F7F7F8";
const BORDER = "#E2E2E6";
const MUTED  = "#9B9B9B";
const GREEN  = "#4CAF84";

/* ─── Progress strip ─── */
const StepStrip: React.FC<{ step: number; total: number }> = ({ step, total }) => (
  <div style={{ padding: "14px 20px 12px", backgroundColor: BG, borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 500, color: MUTED, whiteSpace: "nowrap", flexShrink: 0 }}>
        Step {step} of 9
      </span>
      <div style={{ flex: 1, height: "3px", borderRadius: "2px", backgroundColor: "#EBEBEB" }}
        role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={9}>
        <div style={{ width: `${(step / 9) * 100}%`, height: "100%", borderRadius: "2px", backgroundColor: NAVY }} />
      </div>
    </div>
  </div>
);

/* ─── Text input field ─── */
const Field: React.FC<{
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  hint?: string;
}> = ({ label, placeholder, value, onChange, type = "text", hint }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    <label style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#1A1A1A" }}>
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        height: "48px", borderRadius: "12px", border: `1.5px solid ${BORDER}`,
        backgroundColor: BG, padding: "0 14px", fontFamily: "Inter, sans-serif",
        fontSize: "14px", color: "#1A1A1A", outline: "none", boxSizing: "border-box", width: "100%",
      }}
    />
    {hint && <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "11px", color: MUTED }}>{hint}</p>}
  </div>
);

/* ─── Toggle chip ─── */
const Chip: React.FC<{ label: string; selected: boolean; onToggle: () => void }> = ({ label, selected, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    style={{
      height: "34px", paddingLeft: "14px", paddingRight: "14px", borderRadius: "17px",
      border: selected ? `2px solid ${NAVY}` : `1.5px solid ${BORDER}`,
      backgroundColor: selected ? NAVY : BG,
      fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: selected ? 600 : 400,
      color: selected ? "#FFFFFF" : "#2A2A2A", cursor: "pointer", whiteSpace: "nowrap",
      transition: "background-color 0.1s, border-color 0.1s",
    }}
  >
    {label}
  </button>
);

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = ["Morning (6am–12pm)", "Afternoon (12pm–5pm)", "Evening (5pm–9pm)", "Night (9pm–12am)"];
const CITIES = ["Islamabad", "Rawalpindi", "Lahore", "Karachi", "Faisalabad", "Peshawar", "Quetta", "Multan"];

type InternalStep = 1 | 2 | 3;

interface HzProviderProfileSetupProps {
  onBack?: () => void;
  onComplete?: () => void;
}

export const HzProviderProfileSetup: React.FC<HzProviderProfileSetupProps> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState<InternalStep>(1);

  /* Step 1 */
  const [name, setName]   = useState("");
  const [phone, setPhone] = useState("");

  /* Step 2 */
  const [city, setCity]   = useState("");
  const [area, setArea]   = useState("");

  /* Step 3 */
  const [days, setDays]   = useState<Set<string>>(new Set());
  const [slots, setSlots] = useState<Set<string>>(new Set());

  const toggleSet = (s: string, set: Set<string>, setter: (v: Set<string>) => void) => {
    const next = new Set(set);
    next.has(s) ? next.delete(s) : next.add(s);
    setter(next);
  };

  const canNext1 = true;
  const canNext2 = true;
  const canNext3 = true;

  const handleNext = () => {
    if (step === 1 && canNext1) setStep(2);
    else if (step === 2 && canNext2) setStep(3);
    else if (step === 3 && canNext3) onComplete?.();
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as InternalStep);
    else onBack?.();
  };

  const stepNumber = step; // Steps 1–3 of 9
  const canContinue = step === 1 ? canNext1 : step === 2 ? canNext2 : canNext3;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: PAGE, overflow: "hidden" }}>

      {/* Status bar */}
      <div aria-hidden="true" style={{ height: "24px", flexShrink: 0, backgroundColor: BG }} />

      {/* Header */}
      <header style={{ height: "56px", backgroundColor: BG, display: "flex", alignItems: "center", paddingLeft: "4px", paddingRight: "16px", flexShrink: 0, position: "relative" }}>
        <button type="button" onClick={handleBack} aria-label="Go back"
          style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
          <ArrowLeft size={22} color="#1A1A1A" />
        </button>
        <span style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: "17px", fontWeight: 600, color: "#1A1A1A", pointerEvents: "none" }}>
          Provider Registration
        </span>
      </header>

      <StepStrip step={stepNumber} total={9} />

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px 32px", display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* ── Step 1: Name & Phone ── */}
        {step === 1 && (
          <>
            <div>
              <h2 style={{ margin: "0 0 6px", fontFamily: "Inter, sans-serif", fontSize: "20px", fontWeight: 700, color: "#1A1A1A" }}>
                Your Basic Info
              </h2>
              <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "14px", color: MUTED }}>
                Apna naam aur WhatsApp number darj karein.
              </p>
            </div>
            <div style={{ backgroundColor: BG, borderRadius: "14px", border: `1px solid ${BORDER}`, padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <Field label="Full Name" placeholder="e.g. Zain Ahmed" value={name} onChange={setName} hint="As it will appear on your provider profile." />
              <Field label="WhatsApp Number" placeholder="+92 3xx xxxxxxx" value={phone} onChange={setPhone} type="tel" hint="Customers may contact you on this number." />
            </div>
          </>
        )}

        {/* ── Step 2: Location ── */}
        {step === 2 && (
          <>
            <div>
              <h2 style={{ margin: "0 0 6px", fontFamily: "Inter, sans-serif", fontSize: "20px", fontWeight: 700, color: "#1A1A1A" }}>
                Your Location
              </h2>
              <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "14px", color: MUTED }}>
                Aap kahan service dete hain? Yeh aapke job matches mein use hoga.
              </p>
            </div>

            {/* City chips */}
            <div style={{ backgroundColor: BG, borderRadius: "14px", border: `1px solid ${BORDER}`, padding: "16px" }}>
              <p style={{ margin: "0 0 12px", fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#1A1A1A" }}>Select City</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {CITIES.map((c) => (
                  <Chip key={c} label={c} selected={city === c} onToggle={() => setCity(city === c ? "" : c)} />
                ))}
              </div>
            </div>

            {/* Area/Sector input */}
            <div style={{ backgroundColor: BG, borderRadius: "14px", border: `1px solid ${BORDER}`, padding: "16px" }}>
              <Field
                label="Area / Sector (Optional)"
                placeholder="e.g. G-13, DHA Phase 5, Gulshan-e-Iqbal"
                value={area}
                onChange={setArea}
                hint="Helps match you with nearby jobs."
              />
            </div>
          </>
        )}

        {/* ── Step 3: Preferred Working Time ── */}
        {step === 3 && (
          <>
            <div>
              <h2 style={{ margin: "0 0 6px", fontFamily: "Inter, sans-serif", fontSize: "20px", fontWeight: 700, color: "#1A1A1A" }}>
                Preferred Working Hours
              </h2>
              <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "14px", color: MUTED }}>
                Kaunse din aur waqt aap available rehte hain?
              </p>
            </div>

            {/* Days */}
            <div style={{ backgroundColor: BG, borderRadius: "14px", border: `1px solid ${BORDER}`, padding: "16px" }}>
              <p style={{ margin: "0 0 12px", fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#1A1A1A" }}>Available Days</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {DAYS.map((d) => (
                  <Chip key={d} label={d} selected={days.has(d)} onToggle={() => toggleSet(d, days, setDays)} />
                ))}
              </div>
            </div>

            {/* Time slots */}
            <div style={{ backgroundColor: BG, borderRadius: "14px", border: `1px solid ${BORDER}`, padding: "16px" }}>
              <p style={{ margin: "0 0 12px", fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#1A1A1A" }}>Preferred Time Slots</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {SLOTS.map((s) => (
                  <Chip key={s} label={s} selected={slots.has(s)} onToggle={() => toggleSet(s, slots, setSlots)} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom bar */}
      <div style={{ backgroundColor: BG, borderTop: `1px solid ${BORDER}`, padding: "12px 16px 20px", flexShrink: 0 }}>
        {step === 3 && (
          <p style={{ margin: "0 0 8px", textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: "12px", color: canContinue ? GREEN : MUTED, fontWeight: 500 }}>
            {canContinue
              ? `${days.size} day${days.size !== 1 ? "s" : ""} · ${slots.size} time slot${slots.size !== 1 ? "s" : ""} selected`
              : "Select at least one day and one time slot"}
          </p>
        )}
        <button
          type="button"
          onClick={handleNext}
          disabled={!canContinue}
          style={{
            width: "100%", height: "52px", borderRadius: "14px", border: "none",
            backgroundColor: canContinue ? NAVY : "#DDDDE4",
            fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 600,
            color: canContinue ? "#FFFFFF" : "#AAAAAA",
            cursor: canContinue ? "pointer" : "default",
            transition: "background-color 0.15s",
          }}
        >
          {step === 3 ? "Continue to Services" : "Continue"}
        </button>
      </div>
    </div>
  );
};
