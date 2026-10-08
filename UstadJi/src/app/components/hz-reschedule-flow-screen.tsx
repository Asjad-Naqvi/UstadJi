import React, { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Clock, Sparkles, CheckCircle, XCircle, ChevronRight } from "lucide-react";

const NAVY   = "#161533";
const GREEN  = "#4CAF84";
const BG     = "#FAF8F5";
const BORDER = "#E8E3DB";

type RescheduleStep = "select" | "finding" | "suggestions" | "no-match";

interface TimeSlot {
  id: string;
  day: string;
  time: string;
  date: string;
  best?: boolean;
  reason?: string;
}

const SUGGESTED_SLOTS: TimeSlot[] = [
  { id: "slot-1", day: "Tomorrow",  time: "2:00 PM",  date: "Fri, 17 May" },
  { id: "slot-2", day: "Tomorrow",  time: "4:30 PM",  date: "Fri, 17 May", best: true, reason: "Works with both schedules" },
  { id: "slot-3", day: "Saturday",  time: "11:00 AM", date: "Sat, 18 May" },
];

const PREF_DATES = ["Tomorrow (Fri, 17 May)", "Saturday, 18 May", "Sunday, 19 May"];
const PREF_TIMES = ["Morning (8 AM – 12 PM)", "Afternoon (12 PM – 5 PM)", "Evening (5 PM – 9 PM)"];

export interface HzRescheduleFlowScreenProps {
  onBack?: () => void;
  onSendRequest?: () => void;
  onNoMatch?: () => void;
  initiator?: "customer" | "provider";
}

/* ─── Card ─── */
const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ backgroundColor: "#FFFFFF", borderRadius: "14px", border: `1px solid ${BORDER}`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", padding: "16px", ...style }}>
    {children}
  </div>
);

/* ─── Step 1: Select preferred time ─── */
const SelectStep: React.FC<{ initiator: "customer" | "provider"; onSubmit: () => void }> = ({ initiator, onSubmit }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const canSubmit = selectedDate !== null && selectedTime !== null;
  const otherParty = initiator === "customer" ? "your Ustaad" : "the customer";

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 32px", display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Info banner */}
      <div style={{ borderRadius: "12px", backgroundColor: "#EEEEF5", border: `1px solid rgba(22,21,51,0.1)`, padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
        <div aria-hidden="true" style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: NAVY, flexShrink: 0, marginTop: "5px" }} />
        <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "13px", lineHeight: "18px", color: NAVY }}>
          Ustaad G AI will coordinate with {otherParty} to find an overlapping time.
        </p>
      </div>

      {/* Current booking */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <Calendar size={16} color="#9B9B9B" />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 500, color: "#9B9B9B", letterSpacing: "0.4px", textTransform: "uppercase" }}>Current Booking</span>
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 600, color: "#1A1A1A" }}>AC Service</div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#9B9B9B", marginTop: "2px" }}>Thursday, 16 May · 2:00 PM</div>
      </Card>

      {/* Date preference */}
      <section>
        <h3 style={{ margin: "0 0 10px", fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 600, color: "#1A1A1A" }}>Preferred date</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {PREF_DATES.map((d) => {
            const isSelected = selectedDate === d;
            return (
              <button key={d} type="button" onClick={() => setSelectedDate(d)}
                style={{ width: "100%", padding: "12px 14px", borderRadius: "12px", textAlign: "left", backgroundColor: isSelected ? NAVY : "#FFFFFF", border: `1.5px solid ${isSelected ? NAVY : BORDER}`, fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: isSelected ? 600 : 400, color: isSelected ? "#FFFFFF" : "#1A1A1A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {d}
                {isSelected && <CheckCircle size={16} color={GREEN} />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Time preference */}
      <section>
        <h3 style={{ margin: "0 0 10px", fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 600, color: "#1A1A1A" }}>Preferred time of day</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
          {PREF_TIMES.map((t) => {
            const isSelected = selectedTime === t;
            const shortLabel = t.split(" (")[0];
            return (
              <button key={t} type="button" onClick={() => setSelectedTime(t)}
                style={{ padding: "10px 6px", borderRadius: "10px", backgroundColor: isSelected ? NAVY : "#FFFFFF", border: `1.5px solid ${isSelected ? NAVY : BORDER}`, fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: isSelected ? 600 : 400, color: isSelected ? "#FFFFFF" : "#1A1A1A", cursor: "pointer", textAlign: "center", lineHeight: "16px" }}>
                {shortLabel}
              </button>
            );
          })}
        </div>
      </section>

      {/* Spacer */}
      <div style={{ flex: 1, minHeight: "8px" }} />

      {/* CTA */}
      <button type="button" onClick={onSubmit} disabled={!canSubmit}
        style={{ width: "100%", height: "52px", borderRadius: "14px", backgroundColor: canSubmit ? NAVY : "#E8E3DB", border: "none", fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 600, color: canSubmit ? "#FFFFFF" : "#9B9B9B", cursor: canSubmit ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
        <Sparkles size={17} color={canSubmit ? "#FFFFFF" : "#9B9B9B"} />
        Find Available Times
      </button>
    </div>
  );
};

/* ─── Step 2: AI Finding ─── */
const FindingStep: React.FC<{ initiator: "customer" | "provider"; onDone: () => void }> = ({ initiator, onDone }) => {
  const [dots, setDots] = useState(0);
  const otherParty = initiator === "customer" ? "your Ustaad" : "the customer";

  useEffect(() => {
    const dotInterval = setInterval(() => setDots((d) => (d + 1) % 4), 500);
    const advanceTimer = setTimeout(onDone, 2800);
    return () => { clearInterval(dotInterval); clearTimeout(advanceTimer); };
  }, [onDone]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", gap: "28px" }}>
      {/* Animated icon */}
      <div style={{ position: "relative", width: "80px", height: "80px" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", backgroundColor: "#EEEEF5", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Calendar size={36} color={NAVY} />
        </div>
        <div style={{ position: "absolute", inset: "-6px", borderRadius: "50%", border: `2px solid ${NAVY}`, borderTopColor: "transparent", animation: "spin 1.2s linear infinite" }} />
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ textAlign: "center", maxWidth: "260px" }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "18px", fontWeight: 700, color: "#1A1A1A", lineHeight: "26px" }}>
          Finding a time that works{"...".slice(0, dots)}
        </div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#9B9B9B", marginTop: "8px", lineHeight: "20px" }}>
          Ustaad G AI is checking availability for both you and {otherParty}.
        </div>
      </div>

      {/* Status chips */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "280px" }}>
        {[
          { label: "Checking your availability", done: true },
          { label: `Checking ${otherParty}'s schedule`, done: dots >= 2 },
          { label: "Finding overlapping windows", done: dots >= 3 },
        ].map(({ label, done }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "10px", backgroundColor: done ? "#F0FAF4" : "#FAFAFA", border: `1px solid ${done ? "#4CAF8440" : BORDER}` }}>
            <div style={{ width: "18px", height: "18px", borderRadius: "50%", backgroundColor: done ? GREEN : "#E8E3DB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {done && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              )}
            </div>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: done ? 500 : 400, color: done ? "#1A1A1A" : "#9B9B9B" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Step 3: Suggestions ─── */
const SuggestionsStep: React.FC<{ onSelectSlot: (slot: TimeSlot) => void; onNoMatch: () => void }> = ({ onSelectSlot, onNoMatch }) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 32px", display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Success banner */}
      <div style={{ borderRadius: "12px", backgroundColor: "#F0FAF4", border: `1px solid #4CAF8440`, padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
        <CheckCircle size={18} color={GREEN} style={{ flexShrink: 0, marginTop: "1px" }} />
        <div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, color: "#1A1A1A" }}>We found times that work for both of you</div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9B9B9B", marginTop: "2px" }}>Select a slot to send the reschedule request.</div>
        </div>
      </div>

      {/* Slot cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {SUGGESTED_SLOTS.map((slot) => {
          const isSelected = selected === slot.id;
          return (
            <button key={slot.id} type="button" onClick={() => setSelected(slot.id)}
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
                  {slot.date}{slot.reason ? ` · ${slot.reason}` : ""}
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

      {/* Confirm CTA */}
      <button type="button" disabled={!selected} onClick={() => { const s = SUGGESTED_SLOTS.find(s => s.id === selected); if (s) onSelectSlot(s); }}
        style={{ width: "100%", height: "52px", borderRadius: "14px", backgroundColor: selected ? NAVY : "#E8E3DB", border: "none", fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 600, color: selected ? "#FFFFFF" : "#9B9B9B", cursor: selected ? "pointer" : "default", marginTop: "4px" }}>
        Send Reschedule Request
      </button>

      {/* No-match demo */}
      <button type="button" onClick={onNoMatch}
        style={{ width: "100%", height: "40px", borderRadius: "10px", background: "none", border: `1px dashed #D8D8D8`, fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9B9B9B", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
        Simulate no-match scenario
        <ChevronRight size={12} color="#9B9B9B" />
      </button>
    </div>
  );
};

/* ─── Step 4: No Match ─── */
const NoMatchStep: React.FC<{ onSuggestNew: () => void; onCancel: () => void }> = ({ onSuggestNew, onCancel }) => (
  <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 32px", display: "flex", flexDirection: "column", gap: "16px" }}>
    {/* Error state */}
    <div style={{ textAlign: "center", padding: "32px 16px" }}>
      <div style={{ width: "72px", height: "72px", borderRadius: "50%", backgroundColor: "#FFF1F2", border: "1px solid #FECDD3", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
        <XCircle size={36} color="#E11D48" />
      </div>
      <h2 style={{ margin: "0 0 8px", fontFamily: "Inter, sans-serif", fontSize: "20px", fontWeight: 700, color: "#1A1A1A" }}>
        No overlapping time found
      </h2>
      <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: "20px", color: "#9B9B9B" }}>
        We couldn't find a time that works for both of you. Try suggesting another time or choosing a different date.
      </p>
    </div>

    {/* Status trail */}
    <div style={{ backgroundColor: "#FAFAFA", borderRadius: "12px", border: `1px solid ${BORDER}`, padding: "14px 16px" }}>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 500, color: "#9B9B9B", letterSpacing: "0.4px", textTransform: "uppercase", marginBottom: "10px" }}>What happened</div>
      {[
        { text: "You requested a reschedule", ok: true },
        { text: "AI checked available windows", ok: true },
        { text: "No matching slot found for both parties", ok: false },
      ].map(({ text, ok }) => (
        <div key={text} style={{ display: "flex", alignItems: "center", gap: "10px", paddingBottom: "8px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: ok ? GREEN : "#E11D48", flexShrink: 0 }} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: ok ? "#1A1A1A" : "#E11D48" }}>{text}</span>
        </div>
      ))}
    </div>

    {/* Actions */}
    <button type="button" onClick={onSuggestNew}
      style={{ width: "100%", height: "52px", borderRadius: "14px", backgroundColor: NAVY, border: "none", fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 600, color: "#FFFFFF", cursor: "pointer" }}>
      Suggest New Times
    </button>
    <button type="button" onClick={onSuggestNew}
      style={{ width: "100%", height: "48px", borderRadius: "14px", backgroundColor: "#FFFFFF", border: `1.5px solid ${BORDER}`, fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 500, color: "#1A1A1A", cursor: "pointer" }}>
      Choose Another Date
    </button>
    <div style={{ textAlign: "center" }}>
      <button type="button" onClick={onCancel}
        style={{ background: "none", border: "none", padding: "10px 24px", fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#E11D48", cursor: "pointer" }}>
        Cancel Booking
      </button>
    </div>
  </div>
);

/* ─── Main screen ─── */
export const HzRescheduleFlowScreen: React.FC<HzRescheduleFlowScreenProps> = ({
  onBack,
  onSendRequest,
  onNoMatch,
  initiator = "customer",
}) => {
  const [step, setStep] = useState<RescheduleStep>("select");
  const otherPartyLabel = initiator === "customer" ? "Ustaad" : "Customer";

  const titleMap: Record<RescheduleStep, string> = {
    "select": "Reschedule Booking",
    "finding": "Finding a Time",
    "suggestions": "Available Times",
    "no-match": "No Times Found",
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: BG, overflow: "hidden" }}>
      {/* Status bar */}
      <div aria-hidden="true" style={{ height: "24px", flexShrink: 0, backgroundColor: "#FFFFFF" }} />

      {/* Header */}
      <header style={{ height: "56px", backgroundColor: "#FFFFFF", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", paddingLeft: "4px", paddingRight: "16px", flexShrink: 0, position: "relative" }}>
        <button type="button" onClick={step === "select" ? onBack : () => setStep("select")} aria-label="Back"
          style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer" }}>
          <ArrowLeft size={22} color="#1A1A1A" />
        </button>
        <span style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: "17px", fontWeight: 600, color: "#1A1A1A", pointerEvents: "none" }}>
          {titleMap[step]}
        </span>
      </header>

      {/* Progress pills */}
      {(step === "select" || step === "suggestions") && (
        <div style={{ display: "flex", gap: "6px", padding: "10px 16px 0", flexShrink: 0 }}>
          {(["select", "finding", "suggestions"] as const).map((s, i) => {
            const stepIndex = { select: 0, finding: 1, suggestions: 2 };
            const currentIndex = stepIndex[step as keyof typeof stepIndex] ?? 0;
            const isDone = i < currentIndex;
            const isActive = s === step;
            return (
              <div key={s} style={{ flex: 1, height: "3px", borderRadius: "2px", backgroundColor: isDone || isActive ? NAVY : "#E8E3DB" }} />
            );
          })}
        </div>
      )}

      {/* Step content */}
      {step === "select" && (
        <SelectStep initiator={initiator} onSubmit={() => setStep("finding")} />
      )}
      {step === "finding" && (
        <FindingStep initiator={initiator} onDone={() => setStep("suggestions")} />
      )}
      {step === "suggestions" && (
        <SuggestionsStep
          onSelectSlot={() => onSendRequest?.()}
          onNoMatch={() => setStep("no-match")}
        />
      )}
      {step === "no-match" && (
        <NoMatchStep
          onSuggestNew={() => setStep("select")}
          onCancel={() => { onBack?.(); }}
        />
      )}
    </div>
  );
};
