import React, { useState } from "react";
import { ArrowLeft, Star, MapPin, Banknote, Zap, Trophy } from "lucide-react";

const NAVY   = "#161533";
const GREEN  = "#4CAF84";
const BG     = "#FAF8F5";
const BORDER = "#E8E3DB";

export type CustomerPref = "best-rated" | "closest" | "best-value" | "available-soonest" | "most-jobs";

interface PrefOption {
  id: CustomerPref;
  emoji: string;
  label: string;
  desc: string;
  Icon: React.FC<{ size: number; color: string }>;
}

const OPTIONS: PrefOption[] = [
  { id: "best-rated",       emoji: "⭐", label: "Best Rated",          desc: "Providers with the highest customer ratings",      Icon: Star     },
  { id: "closest",          emoji: "📍", label: "Closest to Me",       desc: "Providers serving my exact neighbourhood",         Icon: MapPin   },
  { id: "best-value",       emoji: "💰", label: "Best Value",          desc: "High quality at a fair, affordable price",         Icon: Banknote },
  { id: "available-soonest",emoji: "⚡", label: "Available Soonest",   desc: "Providers who can come the fastest",               Icon: Zap      },
  { id: "most-jobs",        emoji: "🏆", label: "Most Jobs Completed", desc: "Experienced providers with a proven track record",  Icon: Trophy   },
];

interface HzCustomerPreferencesScreenProps {
  onBack?: () => void;
  onContinue: (prefs: CustomerPref[]) => void;
}

export const HzCustomerPreferencesScreen: React.FC<HzCustomerPreferencesScreenProps> = ({
  onBack,
  onContinue,
}) => {
  const [selected, setSelected] = useState<CustomerPref[]>([]);

  const toggle = (id: CustomerPref) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= 2) return prev; // max 2
      return [...prev, id];
    });
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
          Your Preferences
        </span>
      </header>

      {/* Progress bar — step 4 of 4 */}
      <div style={{ height: "3px", backgroundColor: "#F0EDE8", flexShrink: 0 }}>
        <div style={{ height: "100%", width: "100%", backgroundColor: NAVY, borderRadius: "2px" }} />
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px 0" }}>
        <h1 style={{ margin: "0 0 8px", fontFamily: "Inter, sans-serif", fontSize: "22px", fontWeight: 700, lineHeight: "30px", color: "#1A1A1A" }}>
          What matters most when choosing a provider?
        </h1>
        <p style={{ margin: "0 0 24px", fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: "20px", color: "#9B9B9B" }}>
          Choose up to 2 preferences so we can recommend providers that suit you.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingBottom: "24px" }}>
          {OPTIONS.map(({ id, emoji, label, desc, Icon }) => {
            const isSelected = selected.includes(id);
            const isDisabled = !isSelected && selected.length >= 2;
            return (
              <button
                key={id}
                type="button"
                onClick={() => !isDisabled && toggle(id)}
                aria-pressed={isSelected}
                disabled={isDisabled}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  backgroundColor: isSelected ? NAVY : "#FFFFFF",
                  border: `1.5px solid ${isSelected ? NAVY : isDisabled ? "#F0EDE8" : BORDER}`,
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  cursor: isDisabled ? "default" : "pointer",
                  opacity: isDisabled ? 0.45 : 1,
                  transition: "all 0.15s ease",
                  textAlign: "left",
                }}
              >
                {/* Icon square */}
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  backgroundColor: isSelected ? "rgba(255,255,255,0.15)" : BG,
                  border: `1px solid ${isSelected ? "rgba(255,255,255,0.2)" : BORDER}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: "20px" }}>{emoji}</span>
                </div>
                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 600, color: isSelected ? "#FFFFFF" : "#1A1A1A", lineHeight: "22px" }}>
                    {label}
                  </div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: isSelected ? "rgba(255,255,255,0.65)" : "#9B9B9B", lineHeight: "16px", marginTop: "1px" }}>
                    {desc}
                  </div>
                </div>
                {/* Checkmark */}
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
      </div>

      {/* Counter + Continue */}
      <div style={{ backgroundColor: "#FFFFFF", borderTop: `1px solid ${BORDER}`, padding: "14px 20px 20px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#9B9B9B" }}>
            {selected.length}/2 selected
          </span>
          {selected.length > 0 && (
            <button type="button" onClick={() => setSelected([])}
              style={{ background: "none", border: "none", fontFamily: "Inter, sans-serif", fontSize: "13px", color: NAVY, cursor: "pointer", padding: 0 }}>
              Clear
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => onContinue(selected)}
          style={{
            width: "100%",
            height: "52px",
            borderRadius: "14px",
            backgroundColor: NAVY,
            border: "none",
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            fontWeight: 600,
            color: "#FFFFFF",
            cursor: "pointer",
          }}
        >
          {selected.length === 0 ? "Skip for now" : "Continue"}
        </button>
      </div>
    </div>
  );
};
