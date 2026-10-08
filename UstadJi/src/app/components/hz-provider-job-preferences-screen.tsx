import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

const NAVY   = "#161533";
const GREEN  = "#4CAF84";
const BG     = "#FAF8F5";
const BORDER = "#E8E3DB";

export type ProviderJobPref = "near-me" | "higher-paying" | "fits-availability" | "urgent";

interface JobPrefOption {
  id: ProviderJobPref;
  emoji: string;
  label: string;
  desc: string;
}

const JOB_PREF_OPTIONS: JobPrefOption[] = [
  { id: "near-me",          emoji: "📍", label: "Jobs Near Me",                  desc: "Prioritise bookings in my area and nearby sectors"    },
  { id: "higher-paying",    emoji: "💰", label: "Higher-Paying Jobs",             desc: "Show me bookings with above-average earnings"         },
  { id: "fits-availability",emoji: "🕐", label: "Jobs That Fit My Availability",  desc: "Match bookings to my available time slots"            },
  { id: "urgent",           emoji: "🚨", label: "Urgent / Immediate Jobs",        desc: "I can respond quickly to same-day emergency requests" },
];

interface HzProviderJobPreferencesScreenProps {
  onBack?: () => void;
  onContinue: (jobPrefs: ProviderJobPref[]) => void;
}

export const HzProviderJobPreferencesScreen: React.FC<HzProviderJobPreferencesScreenProps> = ({
  onBack,
  onContinue,
}) => {
  const [selectedJobPrefs, setSelectedJobPrefs] = useState<ProviderJobPref[]>([]);

  const togglePref = (id: ProviderJobPref) => {
    setSelectedJobPrefs((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: BG, overflow: "hidden" }}>
      {/* Status bar */}
      <div aria-hidden="true" style={{ height: "24px", flexShrink: 0, backgroundColor: "#FFFFFF" }} />

      {/* Header */}
      <header style={{ height: "56px", backgroundColor: "#FFFFFF", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", paddingLeft: "4px", paddingRight: "16px", flexShrink: 0, position: "relative" }}>
        <button type="button" onClick={onBack} aria-label="Back"
          style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer" }}>
          <ArrowLeft size={22} color="#1A1A1A" aria-hidden="true" />
        </button>
        <span style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: "17px", fontWeight: 600, color: "#1A1A1A", pointerEvents: "none" }}>
          Job Preferences
        </span>
      </header>

      {/* Progress bar */}
      <div style={{ height: "3px", backgroundColor: "#F0EDE8", flexShrink: 0 }}>
        <div style={{ height: "100%", width: "100%", backgroundColor: NAVY, borderRadius: "2px" }} />
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: "28px" }}>

        {/* Section 1: Job type preferences */}
        <section>
          <h2 style={{ margin: "0 0 6px", fontFamily: "Inter, sans-serif", fontSize: "20px", fontWeight: 700, lineHeight: "28px", color: "#1A1A1A" }}>
            What kind of jobs would you prefer?
          </h2>
          <p style={{ margin: "0 0 16px", fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: "20px", color: "#9B9B9B" }}>
            Choose the types of bookings you'd like us to prioritise for you.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {JOB_PREF_OPTIONS.map(({ id, emoji, label, desc }) => {
              const isSelected = selectedJobPrefs.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => togglePref(id)}
                  aria-pressed={isSelected}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: "14px",
                    backgroundColor: isSelected ? NAVY : "#FFFFFF",
                    border: `1.5px solid ${isSelected ? NAVY : BORDER}`,
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: isSelected ? "rgba(255,255,255,0.15)" : BG, border: `1px solid ${isSelected ? "rgba(255,255,255,0.2)" : BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: "20px" }}>{emoji}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 600, color: isSelected ? "#FFFFFF" : "#1A1A1A", lineHeight: "22px" }}>
                      {label}
                    </div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: isSelected ? "rgba(255,255,255,0.65)" : "#9B9B9B", lineHeight: "16px", marginTop: "1px" }}>
                      {desc}
                    </div>
                  </div>
                  {isSelected && (
                    <div style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: GREEN, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="12" height="9" viewBox="0 0 12 9" fill="none" aria-hidden="true">
                        <path d="M1 4L4.5 7.5L11 1" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Bottom padding */}
        <div style={{ height: "8px" }} />
      </div>

      {/* Continue */}
      <div style={{ backgroundColor: "#FFFFFF", borderTop: `1px solid ${BORDER}`, padding: "14px 20px 20px", flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => onContinue(selectedJobPrefs)}
          style={{ width: "100%", height: "52px", borderRadius: "14px", backgroundColor: NAVY, border: "none", fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 600, color: "#FFFFFF", cursor: "pointer" }}
        >
          {selectedJobPrefs.length === 0 ? "Skip for now" : "Save Preferences"}
        </button>
      </div>
    </div>
  );
};
