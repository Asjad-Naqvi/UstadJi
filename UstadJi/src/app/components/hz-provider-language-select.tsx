import React, { useState } from "react";
import { Globe } from "lucide-react";

const NAVY  = "#161533";
const BG    = "#FFFFFF";
const PAGE  = "#F7F7F8";
const BORDER = "#E2E2E6";

export type BookingLanguage = "english" | "urdu" | "roman-urdu";

const LANGUAGES: { id: BookingLanguage; native: string; label: string; flag: string }[] = [
  { id: "english",    native: "English",    label: "English",    flag: "🇬🇧" },
  { id: "urdu",       native: "اردو",       label: "Urdu",       flag: "🇵🇰" },
  { id: "roman-urdu", native: "Roman Urdu", label: "Roman Urdu", flag: "🗣️" },
];

interface HzProviderLanguageSelectProps {
  onContinue: (language: BookingLanguage) => void;
}

export const HzProviderLanguageSelect: React.FC<HzProviderLanguageSelectProps> = ({ onContinue }) => {
  const [selected, setSelected] = useState<BookingLanguage>("english");

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: PAGE, overflow: "hidden" }}>

      {/* Status bar */}
      <div aria-hidden="true" style={{ height: "24px", flexShrink: 0, backgroundColor: BG }} />

      {/* Header */}
      <header style={{ height: "56px", backgroundColor: BG, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "17px", fontWeight: 600, color: "#1A1A1A" }}>
          Provider Registration
        </span>
      </header>

      {/* Progress strip — Step 0 visually, before Step 1 */}
      <div style={{ padding: "14px 20px 12px", backgroundColor: BG, borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 500, color: "#9B9B9B", whiteSpace: "nowrap", flexShrink: 0 }}>
            Step 1 of 9
          </span>
          <div style={{ flex: 1, height: "3px", borderRadius: "2px", backgroundColor: "#EBEBEB" }}
            role="progressbar" aria-valuenow={1} aria-valuemin={1} aria-valuemax={9}>
            <div style={{ width: "11%", height: "100%", borderRadius: "2px", backgroundColor: NAVY }} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "32px 20px", display: "flex", flexDirection: "column", gap: "24px" }}>

        {/* Heading */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", textAlign: "center" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "16px", backgroundColor: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Globe size={26} color="#FFFFFF" aria-hidden="true" />
          </div>
          <h2 style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "22px", fontWeight: 700, color: "#1A1A1A" }}>
            Choose Your Language
          </h2>
          <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#9B9B9B", lineHeight: "20px", maxWidth: "280px" }}>
            Booking details and AI summaries will be shown in your chosen language.
          </p>
        </div>

        {/* Language cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {LANGUAGES.map(({ id, native, label, flag }) => {
            const isSelected = selected === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelected(id)}
                aria-pressed={isSelected}
                style={{
                  width: "100%", padding: "16px 18px", borderRadius: "14px",
                  backgroundColor: isSelected ? NAVY : BG,
                  border: `1.5px solid ${isSelected ? NAVY : BORDER}`,
                  display: "flex", alignItems: "center", gap: "14px",
                  cursor: "pointer", textAlign: "left",
                  transition: "background-color 0.15s, border-color 0.15s",
                  boxSizing: "border-box",
                }}
              >
                <span style={{ fontSize: "26px", lineHeight: 1, flexShrink: 0 }}>{flag}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 700, color: isSelected ? "#FFFFFF" : "#1A1A1A" }}>
                    {native}
                  </div>
                  {native !== label && (
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: isSelected ? "rgba(255,255,255,0.6)" : "#9B9B9B", marginTop: "2px" }}>
                      {label}
                    </div>
                  )}
                </div>
                <div style={{
                  width: "22px", height: "22px", borderRadius: "50%",
                  border: `2px solid ${isSelected ? "#FFFFFF" : BORDER}`,
                  backgroundColor: isSelected ? "#4CAF84" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  transition: "all 0.15s",
                }}>
                  {isSelected && (
                    <svg width="11" height="8" viewBox="0 0 11 8" fill="none" aria-hidden="true">
                      <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ backgroundColor: BG, borderTop: `1px solid ${BORDER}`, padding: "12px 20px 20px", flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => onContinue(selected)}
          style={{
            width: "100%", height: "52px", borderRadius: "14px", border: "none",
            backgroundColor: NAVY, fontFamily: "Inter, sans-serif",
            fontSize: "16px", fontWeight: 600, color: "#FFFFFF", cursor: "pointer",
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
