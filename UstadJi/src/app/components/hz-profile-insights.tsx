import React from "react";
import { ChevronLeft, Sparkles } from "lucide-react";

interface HzProfileInsightsProps {
  onBack?: () => void;
  onSeeRecommendations?: () => void;
}

export const HzProfileInsights: React.FC<HzProfileInsightsProps> = ({
  onBack,
  onSeeRecommendations,
}) => {
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
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
          }}
          onClick={onBack}
        >
          <ChevronLeft size={22} color="#161533" />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 17,
              fontWeight: 600,
              color: "#1A1A1A",
            }}
          >
            Performance Insights
          </span>
        </div>
        <div
          style={{
            background: "#F0EDE8",
            borderRadius: 12,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 3,
            paddingBottom: 3,
          }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 11,
              color: "#9B9B9B",
            }}
          >
            Last 30 Days
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
        {/* 3 stat cards in a row */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 16,
          }}
        >
          {/* Card 1 — Profile Views */}
          <div
            style={{
              flex: 1,
              background: "white",
              borderRadius: 12,
              border: "1px solid #E8E3DB",
              padding: "12px 10px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              boxShadow: "0px 2px 8px rgba(0,0,0,0.07)",
            }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: "#1A1A1A",
              }}
            >
              1,240
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 11,
                color: "#9B9B9B",
              }}
            >
              Profile Views
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 11,
                fontWeight: 500,
                color: "#4CAF84",
              }}
            >
              +18%
            </span>
          </div>

          {/* Card 2 — Booking Conversion */}
          <div
            style={{
              flex: 1,
              background: "white",
              borderRadius: 12,
              border: "1px solid #E8E3DB",
              padding: "12px 10px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              boxShadow: "0px 2px 8px rgba(0,0,0,0.07)",
            }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: "#1A1A1A",
              }}
            >
              31%
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 11,
                color: "#9B9B9B",
              }}
            >
              Conversion
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 11,
                fontWeight: 500,
                color: "#9B9B9B",
              }}
            >
              −4%
            </span>
          </div>

          {/* Card 3 — Response Time */}
          <div
            style={{
              flex: 1,
              background: "white",
              borderRadius: 12,
              border: "1px solid #E8E3DB",
              padding: "12px 10px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              boxShadow: "0px 2px 8px rgba(0,0,0,0.07)",
            }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: "#1A1A1A",
              }}
            >
              12 min
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 11,
                color: "#9B9B9B",
              }}
            >
              Avg Response
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 11,
                fontWeight: 500,
                color: "#161533",
                background: "#EEF0FA",
                borderRadius: 6,
                paddingLeft: 6,
                paddingRight: 6,
                paddingTop: 1,
                paddingBottom: 1,
                display: "inline-block",
                alignSelf: "flex-start",
              }}
            >
              Good
            </span>
          </div>
        </div>

        {/* Trend chart card */}
        <div
          style={{
            background: "white",
            borderRadius: 12,
            border: "1px solid #E8E3DB",
            padding: "16px",
            marginBottom: 16,
            boxShadow: "0px 2px 8px rgba(0,0,0,0.07)",
          }}
        >
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: "#1A1A1A",
              marginBottom: 12,
            }}
          >
            Profile Views — Last 30 Days
          </div>
          <svg
            viewBox="0 0 280 60"
            width="100%"
            height={60}
            style={{ display: "block" }}
          >
            <polygon
              points="0,50 40,40 80,35 120,30 160,38 200,25 240,20 280,22 280,60 0,60"
              fill="rgba(22,21,51,0.08)"
            />
            <polyline
              points="0,50 40,40 80,35 120,30 160,38 200,25 240,20 280,22"
              fill="none"
              stroke="#161533"
              strokeWidth={2}
              strokeLinejoin="round"
            />
            <circle cx={0} cy={50} r={3} fill="#161533" />
            <circle cx={70} cy={36} r={3} fill="#161533" />
            <circle cx={140} cy={34} r={3} fill="#161533" />
            <circle cx={210} cy={24} r={3} fill="#161533" />
            <circle cx={280} cy={22} r={3} fill="#161533" />
          </svg>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 4,
            }}
          >
            {["W1", "W2", "W3", "W4"].map((label) => (
              <span
                key={label}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 10,
                  color: "#9B9B9B",
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* AI Insight callout card */}
        <div
          style={{
            background: "#EEF0FA",
            borderRadius: 12,
            border: "1px solid #C5CAE9",
            padding: "14px 16px",
            display: "flex",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <div style={{ flexShrink: 0, marginTop: 2 }}>
            <Sparkles size={18} color="#161533" />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: "#161533",
                background: "#C5CAE9",
                display: "inline-block",
                paddingLeft: 6,
                paddingRight: 6,
                paddingTop: 1,
                paddingBottom: 1,
                borderRadius: 4,
                marginBottom: 4,
                alignSelf: "flex-start",
              }}
            >
              AI Insight
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                lineHeight: "20px",
                color: "#1A1A1A",
              }}
            >
              Aapka profile services mein strong hai, lekin bio incomplete hai.
              Providers jo bio likhte hain unhe 2.3x zyada bookings milti hain.
            </span>
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div
        style={{
          flexShrink: 0,
          background: "#FFFFFF",
          borderTop: "1px solid #EFEFEF",
          padding: "12px 16px 24px",
        }}
      >
        <button
          onClick={onSeeRecommendations}
          style={{
            width: "100%",
            height: 56,
            borderRadius: 12,
            background: "#161533",
            color: "white",
            fontFamily: "Inter, sans-serif",
            fontSize: 15,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          See Recommendations (4)
        </button>
      </div>
    </div>
  );
};
