import React from "react";
import { ArrowLeft } from "lucide-react";

const NAVY  = "#161533";
const GREEN = "#4CAF84";
const BG    = "#FAF8F5";
const BORDER = "#E8E3DB";

interface HzRankingExplanationScreenProps {
  onBack?: () => void;
}

const FACTORS = [
  {
    icon: "🏆",
    label: "Credibility Score",
    weight: 60,
    color: GREEN,
    description: "The core metric combining ratings, on-time arrival rate, job completion rate, and customer feedback over the provider's lifetime.",
    bullets: [
      "Average customer rating (out of 5 stars)",
      "On-time arrival percentage",
      "Job completion without cancellation",
      "Positive feedback & repeat customers",
    ],
  },
  {
    icon: "✅",
    label: "Verification Status",
    weight: 20,
    color: "#0066CC",
    description: "Ustaad G Verified providers have undergone full background checks, CNIC verification, skills testing, and safety screening.",
    bullets: [
      "Government ID (CNIC) verification",
      "Skills assessment test passed",
      "Background and conduct check",
      "Professional tools inspection",
    ],
  },
  {
    icon: "🎓",
    label: "Experience",
    weight: 15,
    color: "#E07A00",
    description: "Accumulated experience on and off the platform, measured in years and total jobs successfully completed.",
    bullets: [
      "Total years of professional experience",
      "Number of jobs completed on Ustaad G",
      "Range of services offered",
      "Continued professional development",
    ],
  },
  {
    icon: "📍",
    label: "Distance",
    weight: 5,
    color: "#9B4DCA",
    description: "Providers closer to your requested service location are ranked higher for faster response and lower travel costs.",
    bullets: [
      "Distance from your service address",
      "Familiarity with your neighbourhood",
      "Travel time estimate",
    ],
  },
];

export const HzRankingExplanationScreen: React.FC<HzRankingExplanationScreenProps> = ({ onBack }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: BG, overflow: "hidden" }}>
    {/* Status bar */}
    <div aria-hidden="true" style={{ height: "24px", flexShrink: 0, backgroundColor: "#FFFFFF" }} />

    {/* App bar */}
    <header style={{
      height: "56px", backgroundColor: "#FFFFFF",
      borderBottom: "1px solid #EFEFEF",
      display: "flex", alignItems: "center",
      paddingLeft: "4px", paddingRight: "16px",
      flexShrink: 0, position: "relative",
    }}>
      <button
        type="button"
        onClick={onBack}
        aria-label="Go back"
        style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}
      >
        <ArrowLeft size={24} color="#1A1A1A" aria-hidden="true" />
      </button>
      <span style={{
        position: "absolute", left: "48px", right: "16px",
        fontFamily: "Inter, sans-serif", fontSize: "17px", fontWeight: 600, color: "#1A1A1A",
        pointerEvents: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        textAlign: "center",
      }}>
        How Providers Are Ranked
      </span>
    </header>

    {/* Scrollable content */}
    <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "0 16px 32px" }}>
      {/* Hero intro */}
      <div style={{
        marginTop: "16px",
        backgroundColor: NAVY,
        borderRadius: "12px",
        padding: "20px 16px",
        color: "#FFFFFF",
      }}>
        <div style={{ fontSize: "28px", marginBottom: "8px" }}>⭐</div>
        <h1 style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "18px", fontWeight: 700, lineHeight: "24px", color: "#FFFFFF" }}>
          Ranked by Credibility
        </h1>
        <p style={{ margin: 0, marginTop: "8px", fontFamily: "Inter, sans-serif", fontSize: "13px", lineHeight: "19px", color: "rgba(255,255,255,0.75)" }}>
          Ustaad G ranks providers using a transparent, data-driven system so you always see the most reliable professionals at the top.
        </p>
      </div>

      {/* Score bar overview */}
      <div style={{
        marginTop: "16px",
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        border: `1px solid ${BORDER}`,
        padding: "16px",
      }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#1A1A1A", marginBottom: "12px" }}>
          Score Breakdown
        </div>
        {FACTORS.map(({ label, weight, color }) => (
          <div key={label} style={{ marginBottom: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#1A1A1A" }}>{label}</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 700, color }}>{weight}%</span>
            </div>
            <div style={{ height: "6px", backgroundColor: "#F0EDE8", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ width: `${weight}%`, height: "100%", backgroundColor: color, borderRadius: "3px" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Factor cards */}
      {FACTORS.map(({ icon, label, weight, color, description, bullets }) => (
        <div
          key={label}
          style={{
            marginTop: "12px",
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            border: `1px solid ${BORDER}`,
            overflow: "hidden",
          }}
        >
          {/* Card header strip */}
          <div style={{
            height: "4px",
            backgroundColor: color,
          }} />
          <div style={{ padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ fontSize: "24px", lineHeight: 1 }}>{icon}</span>
              <div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 700, color: "#1A1A1A" }}>
                  {label}
                </div>
                <div style={{
                  display: "inline-block", height: "20px", padding: "0 8px",
                  borderRadius: "10px", marginTop: "2px",
                  backgroundColor: `${color}18`,
                  fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 700, color,
                  lineHeight: "20px",
                }}>
                  Weighted {weight}%
                </div>
              </div>
            </div>

            <p style={{ margin: 0, marginBottom: "10px", fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#666666", lineHeight: "19px" }}>
              {description}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {bullets.map(b => (
                <div key={b} style={{ display: "flex", alignItems: "flex-start", gap: "7px" }}>
                  <div style={{
                    width: "16px", height: "16px", borderRadius: "50%",
                    backgroundColor: `${color}20`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: "1px",
                  }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: color }} />
                  </div>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#1A1A1A", lineHeight: "18px" }}>
                    {b}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Rank badge legend */}
      <div style={{
        marginTop: "16px",
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        border: `1px solid ${BORDER}`,
        padding: "16px",
      }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#1A1A1A", marginBottom: "12px" }}>
          Rank Badge Guide
        </div>
        {[
          { bg: "#FFC107", icon: "👑", label: "Rank #1",    desc: "Top provider in your area"    },
          { bg: "#C0C0C0", rank: "2", label: "Rank #2–3",  desc: "Silver tier — top 3"           },
          { bg: NAVY,      rank: "7", label: "Rank #4–10", desc: "Navy tier — top 10"             },
          { bg: "#9B9B9B", rank: "12", label: "Rank #11+", desc: "Available in your area"        },
        ].map(({ bg, icon, rank, label, desc }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              backgroundColor: bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              boxShadow: bg === "#FFC107" ? "0 2px 8px rgba(255,193,7,0.4)" : bg === "#C0C0C0" ? "0 2px 8px rgba(192,192,192,0.4)" : "none",
            }}>
              {icon
                ? <span style={{ fontSize: "14px" }}>{icon}</span>
                : <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 700, color: "#FFFFFF", lineHeight: 1 }}>{rank}</span>
              }
            </div>
            <div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#1A1A1A" }}>{label}</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#9B9B9B" }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Update cadence info box */}
      <div style={{
        marginTop: "12px",
        padding: "14px 16px",
        borderRadius: "10px",
        backgroundColor: `${GREEN}15`,
        border: `1px solid ${GREEN}40`,
      }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#1A1A1A", marginBottom: "4px" }}>
          🔄 Live Ranking Updates
        </div>
        <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#1A1A1A", lineHeight: "17px" }}>
          Rankings are refreshed every 24 hours. Providers can improve their rank by completing jobs, maintaining high ratings, and staying verified on the platform.
        </p>
      </div>
    </div>
  </div>
);
