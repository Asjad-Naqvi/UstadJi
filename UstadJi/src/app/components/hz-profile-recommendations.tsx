import React, { useState } from "react";
import { ChevronLeft, Sparkles } from "lucide-react";

interface HzProfileRecommendationsProps {
  onBack?: () => void;
  onPreview?: () => void;
}

const RECS = [
  {
    id: "bio",
    impact: "High Impact",
    impactStyle: "filled",
    title: "Add a Bio",
    titleUrdu: "Profile bio likhen",
    desc: "Ek professional bio likhein — 2.3x zyada bookings milti hain. Aapka bio abhi empty hai.",
    action: "Preview",
  },
  {
    id: "photo",
    impact: "High Impact",
    impactStyle: "filled",
    title: "Add a Profile Photo",
    titleUrdu: "Photo upload karen",
    desc: "Profile photo wale providers ko 40% zyada clicks milte hain — abhi koi photo nahi hai.",
    action: "Preview",
  },
  {
    id: "services",
    impact: "Quick Win",
    impactStyle: "outlined",
    title: "List More Services",
    titleUrdu: "Zyada services add karen",
    desc: "5+ services list karne se search mein visibility kaafi behtar hoti hai.",
    action: "Apply",
  },
  {
    id: "instant",
    impact: "Optional",
    impactStyle: "ghost",
    title: "Enable Instant Booking",
    titleUrdu: "Fori booking on karen",
    desc: "Instant booking wale providers ko 60% zyada confirmed jobs milte hain.",
    action: "Apply",
  },
];

export const HzProfileRecommendations: React.FC<
  HzProfileRecommendationsProps
> = ({ onBack, onPreview }) => {
  const [dismissed, setDismissed] = useState<string[]>([]);

  const activeRecs = RECS.filter((rec) => !dismissed.includes(rec.id));

  const getImpactTagStyle = (
    impactStyle: string
  ): React.CSSProperties => {
    if (impactStyle === "filled") {
      return {
        background: "#161533",
        color: "white",
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 3,
        paddingBottom: 3,
        fontFamily: "Inter, sans-serif",
        fontSize: 11,
        fontWeight: 600,
        display: "inline-block",
      };
    }
    if (impactStyle === "outlined") {
      return {
        background: "transparent",
        border: "1px solid #161533",
        color: "#161533",
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 3,
        paddingBottom: 3,
        fontFamily: "Inter, sans-serif",
        fontSize: 11,
        fontWeight: 600,
        display: "inline-block",
      };
    }
    // ghost
    return {
      background: "transparent",
      border: "1px solid #E8E3DB",
      color: "#9B9B9B",
      borderRadius: 10,
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 3,
      paddingBottom: 3,
      fontFamily: "Inter, sans-serif",
      fontSize: 11,
      fontWeight: 600,
      display: "inline-block",
    };
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
          gap: 8,
        }}
      >
        <div
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          onClick={onBack}
        >
          <ChevronLeft size={22} color="#161533" />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 17,
              fontWeight: 600,
              color: "#1A1A1A",
            }}
          >
            Recommendations
          </span>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
              color: "#9B9B9B",
            }}
          >
            {activeRecs.length} suggestion{activeRecs.length !== 1 ? "s" : ""}
          </span>
        </div>
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
        {activeRecs.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 80,
              gap: 12,
            }}
          >
            <Sparkles size={40} color="#9B9B9B" />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 16,
                fontWeight: 600,
                color: "#1A1A1A",
                textAlign: "center",
              }}
            >
              Sab suggestions apply ho gayi!
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                color: "#9B9B9B",
                textAlign: "center",
                maxWidth: 240,
                lineHeight: "20px",
              }}
            >
              Aapka profile ab fully optimized hai. Zyada bookings aane wali
              hain!
            </span>
          </div>
        ) : (
          activeRecs.map((rec) => (
            <div
              key={rec.id}
              style={{
                background: "white",
                borderRadius: 12,
                border: "1px solid #E8E3DB",
                padding: "14px 16px",
                marginBottom: 10,
                boxShadow: "0px 2px 8px rgba(0,0,0,0.07)",
              }}
            >
              {/* Impact tag */}
              <span style={getImpactTagStyle(rec.impactStyle)}>
                {rec.impact}
              </span>

              {/* Title */}
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#1A1A1A",
                  marginTop: 8,
                }}
              >
                {rec.title}
              </div>

              {/* Subtitle in Roman Urdu */}
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  color: "#9B9B9B",
                  fontStyle: "italic",
                  marginTop: 2,
                  marginBottom: 8,
                }}
              >
                {rec.titleUrdu}
              </div>

              {/* Description */}
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  color: "#555555",
                  lineHeight: "20px",
                  marginBottom: 12,
                }}
              >
                {rec.desc}
              </div>

              {/* Button row */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <button
                  onClick={() =>
                    setDismissed((prev) => [...prev, rec.id])
                  }
                  style={{
                    flex: 0,
                    border: "none",
                    background: "transparent",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 13,
                    color: "#9B9B9B",
                    padding: "6px 0",
                    cursor: "pointer",
                  }}
                >
                  Dismiss
                </button>
                <button
                  onClick={() => onPreview?.()}
                  style={{
                    flex: 1,
                    height: 36,
                    borderRadius: 8,
                    background: "#161533",
                    color: "white",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  {rec.action}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
