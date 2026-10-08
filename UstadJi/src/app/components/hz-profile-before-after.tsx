import React, { useState, useEffect } from "react";
import { ChevronLeft, User, Check } from "lucide-react";

interface HzProfileBeforeAfterProps {
  onBack?: () => void;
  onKeepCurrent?: () => void;
  onUseSuggested?: () => void;
}

export const HzProfileBeforeAfter: React.FC<HzProfileBeforeAfterProps> = ({
  onBack,
  onKeepCurrent,
  onUseSuggested,
}) => {
  const [view, setView] = useState<"current" | "suggested">("current");
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (accepted) {
      const timer = setTimeout(() => {
        onUseSuggested?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [accepted, onUseSuggested]);

  const serviceChipCurrent: React.CSSProperties = {
    background: "#F0EDE8",
    color: "#555555",
    borderRadius: 12,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 4,
    paddingBottom: 4,
    fontFamily: "Inter, sans-serif",
    fontSize: 12,
    fontWeight: 500,
  };

  const serviceChipSuggested: React.CSSProperties = {
    background: "#161533",
    color: "white",
    borderRadius: 12,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 4,
    paddingBottom: 4,
    fontFamily: "Inter, sans-serif",
    fontSize: 12,
    fontWeight: 500,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#FAF8F5",
        height: "100%",
        overflow: "hidden",
        fontFamily: "Inter, sans-serif",
        width: 375,
        position: "relative",
      }}
    >
      {/* Status bar */}
      <div style={{ height: 24, background: "white" }} />

      {/* Header */}
      <div
        style={{
          height: 56,
          background: "white",
          borderBottom: "1px solid #EFEFEF",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        <div
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          onClick={onBack}
        >
          <ChevronLeft size={22} color="#161533" />
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 17,
              fontWeight: 600,
              color: "#1A1A1A",
            }}
          >
            Preview Change
          </span>
        </div>
        {/* Placeholder to balance header */}
        <div style={{ width: 40 }} />
      </div>

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 16,
          paddingBottom: 32,
        }}
      >
        {/* Segmented toggle */}
        <div
          style={{
            display: "flex",
            background: "#F0EDE8",
            borderRadius: 12,
            padding: 3,
            marginBottom: 16,
          }}
        >
          <button
            onClick={() => setView("current")}
            style={{
              flex: 1,
              height: 36,
              borderRadius: 10,
              background: view === "current" ? "#161533" : "transparent",
              color: view === "current" ? "white" : "#9B9B9B",
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              fontWeight: view === "current" ? 600 : 400,
              border: "none",
              cursor: "pointer",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            Current
          </button>
          <button
            onClick={() => setView("suggested")}
            style={{
              flex: 1,
              height: 36,
              borderRadius: 10,
              background: view === "suggested" ? "#161533" : "transparent",
              color: view === "suggested" ? "white" : "#9B9B9B",
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              fontWeight: view === "suggested" ? 600 : 400,
              border: "none",
              cursor: "pointer",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            Suggested
          </button>
        </div>

        {/* Preview card */}
        <div
          style={{
            background: "white",
            borderRadius: 16,
            border: "1px solid #E8E3DB",
            padding: "16px",
            marginBottom: 16,
            boxShadow: "0px 2px 8px rgba(0,0,0,0.07)",
          }}
        >
          {view === "current" ? (
            <>
              {/* Avatar — empty gray circle */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "#E8E3DB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <User size={28} color="#FFFFFF" />
              </div>

              {/* Name */}
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#1A1A1A",
                  marginTop: 8,
                }}
              >
                Zain Ul Abideen
              </div>

              {/* Bio section */}
              <div
                style={{
                  background: "#FAF8F5",
                  borderRadius: 8,
                  padding: 12,
                  marginTop: 12,
                }}
              >
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 13,
                    color: "#9B9B9B",
                    fontStyle: "italic",
                  }}
                >
                  Bio nahi likhi gayi — add karein
                </span>
              </div>

              {/* Services */}
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  marginTop: 12,
                  flexWrap: "wrap",
                }}
              >
                <span style={serviceChipCurrent}>AC Repairing</span>
                <span style={serviceChipCurrent}>AC Service</span>
              </div>
            </>
          ) : (
            <>
              {/* Avatar — navy circle with initials */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "#161533",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  ZA
                </span>
              </div>

              {/* Name + badge */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 8,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 18,
                    fontWeight: 600,
                    color: "#1A1A1A",
                  }}
                >
                  Zain Ul Abideen
                </span>
                <span
                  style={{
                    background: "#4CAF84",
                    color: "white",
                    borderRadius: 12,
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 3,
                    paddingBottom: 3,
                    fontFamily: "Inter, sans-serif",
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                >
                  ✓ Profile Complete
                </span>
              </div>

              {/* Bio section */}
              <div
                style={{
                  background: "#EEF0FA",
                  borderRadius: 8,
                  padding: 12,
                  marginTop: 12,
                }}
              >
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 13,
                    color: "#1A1A1A",
                    lineHeight: "20px",
                  }}
                >
                  10+ saal ka tajurba rakhne wala certified AC technician. G-10
                  se G-14 tak service. 42 satisfied customers. Fori response
                  guaranteed.
                </span>
              </div>

              {/* Services */}
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  marginTop: 12,
                  flexWrap: "wrap",
                }}
              >
                <span style={serviceChipSuggested}>AC Repairing</span>
                <span style={serviceChipSuggested}>AC Installation</span>
                <span style={serviceChipSuggested}>AC Service</span>
                <span style={serviceChipSuggested}>AC Gas</span>
              </div>
            </>
          )}
        </div>

        {/* "What changed" chips row — only when suggested */}
        {view === "suggested" && (
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                color: "#9B9B9B",
                marginBottom: 6,
              }}
            >
              Changes:
            </div>
            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
              }}
            >
              {["✓ Bio added", "✓ Photo added", "✓ 2 services added"].map(
                (chip) => (
                  <span
                    key={chip}
                    style={{
                      background: "#E8F5E9",
                      color: "#2E7D32",
                      borderRadius: 12,
                      paddingLeft: 10,
                      paddingRight: 10,
                      paddingTop: 4,
                      paddingBottom: 4,
                      fontFamily: "Inter, sans-serif",
                      fontSize: 11,
                      fontWeight: 500,
                    }}
                  >
                    {chip}
                  </span>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation toast */}
      {accepted && (
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 16,
            right: 16,
            background: "#161533",
            borderRadius: 12,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Check size={18} color="#4CAF84" />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              fontWeight: 500,
              color: "white",
            }}
          >
            Suggested version apply ho gayi! ✦
          </span>
        </div>
      )}

      {/* Bottom action bar */}
      <div
        style={{
          flexShrink: 0,
          background: "#FFFFFF",
          borderTop: "1px solid #EFEFEF",
          padding: "12px 16px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <button
          onClick={() => setAccepted(true)}
          style={{
            width: "100%",
            height: 56,
            borderRadius: 12,
            background: accepted ? "#4CAF84" : "#161533",
            color: "white",
            fontFamily: "Inter, sans-serif",
            fontSize: 15,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
        >
          {accepted ? "✓ Applied!" : "Use Suggested Version"}
        </button>
        <button
          onClick={onKeepCurrent}
          style={{
            width: "100%",
            height: 56,
            borderRadius: 12,
            background: "white",
            border: "1px solid #161533",
            color: "#161533",
            fontFamily: "Inter, sans-serif",
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Keep Current
        </button>
      </div>
    </div>
  );
};
