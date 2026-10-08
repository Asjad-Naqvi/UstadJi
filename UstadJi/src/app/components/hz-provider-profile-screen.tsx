import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Heart, User, Info, X } from "lucide-react";
import { HzButton } from "./hz-button";

const NAVY  = "#161533";
const GREEN = "#4CAF84";
const GOLD  = "#FFC107";
const BORDER = "#E8E3DB";

/* ── Small reusable pieces ── */

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h2
    style={{
      margin: 0,
      fontFamily: "Inter, sans-serif",
      fontSize: "16px",
      fontWeight: 600,
      lineHeight: "22px",
      color: "#1A1A1A",
    }}
  >
    {title}
  </h2>
);

const Divider: React.FC = () => (
  <div
    aria-hidden="true"
    style={{ height: "1px", backgroundColor: "#EFEFEF", width: "100%" }}
  />
);

const ServiceChip: React.FC<{ label: string }> = ({ label }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      height: "28px",
      paddingLeft: "8px",
      paddingRight: "8px",
      borderRadius: "16px",
      backgroundColor: "#FFF4E0",
      border: "1px solid #161533",
      fontFamily: "Inter, sans-serif",
      fontSize: "13px",
      fontWeight: 400,
      lineHeight: "18px",
      color: "#161533",
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </span>
);

const AreaChip: React.FC<{ label: string }> = ({ label }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      height: "28px",
      paddingLeft: "8px",
      paddingRight: "8px",
      borderRadius: "16px",
      backgroundColor: "#FFFFFF",
      border: "1px solid #E8E3DB",
      fontFamily: "Inter, sans-serif",
      fontSize: "13px",
      fontWeight: 400,
      lineHeight: "18px",
      color: "#1A1A1A",
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </span>
);

const SCHEDULE: { day: string; hours: string | null }[] = [
  { day: "Monday",    hours: "8:00 AM – 5:00 PM" },
  { day: "Tuesday",   hours: "8:00 AM – 5:00 PM" },
  { day: "Wednesday", hours: null },
  { day: "Thursday",  hours: "8:00 AM – 5:00 PM" },
  { day: "Friday",    hours: "8:00 AM – 2:00 PM" },
  { day: "Saturday",  hours: "9:00 AM – 3:00 PM" },
  { day: "Sunday",    hours: null },
];

const RATINGS: { label: string; score: number }[] = [
  { label: "Quality of Work", score: 4.9 },
  { label: "Punctuality",     score: 4.7 },
  { label: "Communication",   score: 4.8 },
  { label: "Value for Money", score: 4.6 },
];

const REVIEWS: { reviewer: string; date: string; text: string }[] = [
  {
    reviewer: "Asma Tariq",
    date: "3 days ago",
    text: "AC nay pehli baar mein theek kar diya. Bohat professional tha. Zaroor book karuungi.",
  },
  {
    reviewer: "Hamza Malik",
    date: "1 week ago",
    text: "On time, neat work, and reasonable price. Highly recommend for G-13 area.",
  },
];

/* ── Review card with expand/collapse ── */
const ReviewCard: React.FC<{ reviewer: string; date: string; text: string }> = ({
  reviewer,
  date,
  text,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (el) setOverflows(el.scrollHeight > el.clientHeight);
  }, [text]);

  return (
    <article
      role="listitem"
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.06)",
        border: "1px solid #E8E3DB",
        padding: "16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          aria-label="5 stars"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "13px",
            fontWeight: 500,
            lineHeight: "18px",
            color: "#161533",
          }}
        >
          ★★★★★
        </span>
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "11px",
            fontWeight: 400,
            lineHeight: "15px",
            color: "#9B9B9B",
          }}
        >
          {reviewer} · {date}
        </span>
      </div>

      <p
        ref={textRef}
        style={{
          margin: 0,
          marginTop: "8px",
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
          fontWeight: 400,
          lineHeight: "20px",
          color: "#1A1A1A",
          ...(expanded
            ? {}
            : {
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }),
        }}
      >
        {text}
      </p>

      {overflows && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            marginTop: "4px",
            fontFamily: "Inter, sans-serif",
            fontSize: "12px",
            fontWeight: 500,
            lineHeight: "16px",
            color: "#161533",
            cursor: "pointer",
            display: "block",
          }}
        >
          {expanded ? "Show less ↑" : "Read more ↓"}
        </button>
      )}
    </article>
  );
};

/* ── Main screen ── */
interface HzProviderProfileScreenProps {
  onBack?: () => void;
  onBook?: () => void;
}

export const HzProviderProfileScreen: React.FC<HzProviderProfileScreenProps> = ({
  onBack,
  onBook,
}) => {
  const [saved,           setSaved]           = useState(false);
  const [showRankingInfo, setShowRankingInfo] = useState(false);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FAF8F5",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Status bar — 24dp */}
      <div
        aria-hidden="true"
        style={{ height: "24px", flexShrink: 0, backgroundColor: "#FFFFFF" }}
      />

      {/* Top app bar */}
      <header
        style={{
          height: "56px",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #EFEFEF",
          display: "flex",
          alignItems: "center",
          paddingLeft: "4px",
          paddingRight: "4px",
          flexShrink: 0,
          position: "relative",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          style={{
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <ArrowLeft size={24} color="#1A1A1A" aria-hidden="true" />
        </button>

        <span
          style={{
            position: "absolute",
            left: "48px",
            right: "48px",
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
            fontSize: "17px",
            fontWeight: 600,
            lineHeight: "22px",
            color: "#1A1A1A",
            pointerEvents: "none",
          }}
        >
          Provider Profile
        </span>

        <button
          type="button"
          onClick={() => setSaved((v) => !v)}
          aria-label={saved ? "Remove from favourites" : "Save to favourites"}
          aria-pressed={saved}
          style={{
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            flexShrink: 0,
            marginLeft: "auto",
          }}
        >
          <Heart
            size={24}
            color={saved ? "#D94F4F" : "#9B9B9B"}
            fill={saved ? "#D94F4F" : "none"}
            aria-hidden="true"
          />
        </button>
      </header>

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          paddingLeft: "16px",
          paddingRight: "16px",
          paddingBottom: "32px",
        }}
      >
        {/* ── Profile header card ── */}
        <div
          style={{
            marginTop: "16px",
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.07)",
            border: "1px solid #E8E3DB",
            padding: "16px",
          }}
        >
          {/* Avatar + name */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              aria-label="Provider photo placeholder"
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: "#E8E3DB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <User size={28} color="#FFFFFF" aria-hidden="true" />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "20px",
                  fontWeight: 600,
                  lineHeight: "26px",
                  color: "#1A1A1A",
                }}
              >
                Ali Hassan
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  alignSelf: "flex-start",
                  height: "22px",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  borderRadius: "20px",
                  backgroundColor: "#4CAF84",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  fontWeight: 500,
                  lineHeight: "16px",
                  color: "#FFFFFF",
                }}
              >
                ✓ Ustaad G Verified
              </span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ marginTop: "12px", marginBottom: "12px" }}>
            <Divider />
          </div>

          {/* Stats row */}
          <div
            style={{ display: "flex", alignItems: "center" }}
            role="group"
            aria-label="Provider statistics"
          >
            {[
              { value: "4.8", label: "Rating"   },
              { value: "32",  label: "Reviews"  },
              { value: "94%", label: "On Time"  },
            ].map(({ value, label }, i, arr) => (
              <React.Fragment key={label}>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "2px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "20px",
                      fontWeight: 600,
                      lineHeight: "26px",
                      color: "#1A1A1A",
                    }}
                  >
                    {value}
                  </span>
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "11px",
                      fontWeight: 400,
                      lineHeight: "15px",
                      color: "#9B9B9B",
                    }}
                  >
                    {label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div
                    aria-hidden="true"
                    style={{ width: "1px", height: "32px", backgroundColor: "#EFEFEF" }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Divider */}
          <div style={{ marginTop: "12px", marginBottom: "12px" }}>
            <Divider />
          </div>

          {/* Member since */}
          <p
            style={{
              margin: 0,
              fontFamily: "Inter, sans-serif",
              fontSize: "11px",
              fontWeight: 400,
              lineHeight: "15px",
              color: "#9B9B9B",
              textAlign: "center",
            }}
          >
            Member since January 2025
          </p>
        </div>

        {/* ── Credibility Score Card ── */}
        <div
          style={{
            marginTop: "16px",
            backgroundColor: "#FAF8F5",
            borderRadius: "8px",
            border: `1px solid ${BORDER}`,
            padding: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, color: "#1A1A1A" }}>
              Credibility Score
            </span>
            <span style={{
              display: "inline-flex", alignItems: "center", height: "22px",
              padding: "0 10px", borderRadius: "11px",
              backgroundColor: `${GREEN}20`,
              fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, color: GREEN,
            }}>
              Top 3 Provider
            </span>
          </div>

          {/* Large score */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", marginBottom: "8px" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "42px", fontWeight: 700, color: NAVY, lineHeight: 1 }}>
              96
            </span>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "18px", fontWeight: 400, color: "#9B9B9B", marginBottom: "6px" }}>
              /100
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ height: "6px", backgroundColor: "#E8E3DB", borderRadius: "3px", overflow: "hidden", marginBottom: "12px" }}>
            <div style={{ width: "96%", height: "100%", backgroundColor: GREEN, borderRadius: "3px" }} />
          </div>

          {/* 2-col breakdown */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {[
              { label: "Verification",  value: "✓ Verified", color: GREEN },
              { label: "Experience",    value: "8 years",    color: "#1A1A1A" },
              { label: "Avg. Rating",   value: "★ 4.9",      color: "#FFC107" },
              { label: "On-Time",       value: "95%",        color: "#1A1A1A" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ backgroundColor: "#FFFFFF", borderRadius: "6px", padding: "8px 10px", border: "1px solid #EFEFEF" }}>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#9B9B9B" }}>{label}</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 700, color, marginTop: "2px" }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Rankings Card ── */}
        <div
          style={{
            marginTop: "16px",
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
            border: `1px solid ${BORDER}`,
            padding: "16px",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, color: "#1A1A1A" }}>
              Rankings
            </span>
            <button
              type="button"
              aria-label="How rankings work"
              onClick={() => setShowRankingInfo(true)}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", padding: 0 }}
            >
              <Info size={14} color="#9B9B9B" aria-hidden="true" />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#9B9B9B" }}>How it works</span>
            </button>
          </div>

          {/* Ranking rows */}
          {[
            { service: "AC Repairing",      rank: 1, area: "G-13" },
            { service: "AC Installation",   rank: 2, area: "G-13" },
            { service: "AC General Service",rank: 3, area: "G-10" },
          ].map(({ service, rank, area }) => {
            const bg = rank === 1 ? "#FFC107" : rank <= 3 ? "#C0C0C0" : NAVY;
            const shadow = rank === 1
              ? "0 2px 6px rgba(255,193,7,0.4)"
              : rank <= 3
                ? "0 2px 6px rgba(192,192,192,0.4)"
                : "none";
            return (
              <div
                key={service}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 0", borderBottom: "1px solid #F5F5F5",
                }}
              >
                <div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 500, color: "#1A1A1A" }}>
                    {service}
                  </div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#9B9B9B", marginTop: "1px" }}>
                    {area}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    backgroundColor: bg, display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: shadow,
                  }}>
                    {rank === 1
                      ? <span style={{ fontSize: "12px" }}>👑</span>
                      : <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 700, color: "#FFFFFF", lineHeight: 1 }}>{rank}</span>
                    }
                  </div>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#9B9B9B" }}>
                    #{rank} in area
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Services ── */}
        <div style={{ marginTop: "24px" }}>
          <SectionHeader title="Services Offered" />
          <div
            style={{
              marginTop: "8px",
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
            }}
            role="list"
            aria-label="Services offered"
          >
            {["AC Repairing", "AC Installation", "AC General Service", "AC Dismounting"].map(
              (s) => (
                <div key={s} role="listitem">
                  <ServiceChip label={s} />
                </div>
              )
            )}
          </div>
        </div>

        {/* ── Service Areas ── */}
        <div style={{ marginTop: "24px" }}>
          <SectionHeader title="Service Areas" />
          <div
            style={{
              marginTop: "8px",
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
            }}
            role="list"
            aria-label="Service areas"
          >
            {["G-10", "G-11", "G-13", "G-14", "F-7", "F-8"].map((a) => (
              <div key={a} role="listitem">
                <AreaChip label={a} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Schedule ── */}
        <div style={{ marginTop: "24px" }}>
          <SectionHeader title="Weekly Schedule" />
          <div
            style={{ marginTop: "8px" }}
            role="table"
            aria-label="Weekly availability schedule"
          >
            {SCHEDULE.map(({ day, hours }) => (
              <div
                key={day}
                role="row"
                style={{
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #EFEFEF",
                }}
              >
                <span
                  role="cell"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "20px",
                    color: "#1A1A1A",
                  }}
                >
                  {day}
                </span>
                <span
                  role="cell"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "20px",
                    color: hours ? "#1A1A1A" : "#9B9B9B",
                  }}
                >
                  {hours ?? "Unavailable"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Ratings Breakdown ── */}
        <div style={{ marginTop: "24px" }}>
          <SectionHeader title="Rating Breakdown" />
          <div style={{ marginTop: "8px" }} role="list" aria-label="Rating breakdown">
            {RATINGS.map(({ label, score }) => (
              <div
                key={label}
                role="listitem"
                style={{
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #EFEFEF",
                }}
              >
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "20px",
                    color: "#1A1A1A",
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "15px",
                    fontWeight: 600,
                    lineHeight: "20px",
                    color: "#1A1A1A",
                  }}
                >
                  {score.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Reviews ── */}
        <div style={{ marginTop: "24px" }}>
          <SectionHeader title="Recent Reviews" />
          <div
            style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "12px" }}
            role="list"
            aria-label="Recent reviews"
          >
            {REVIEWS.map(({ reviewer, date, text }) => (
              <ReviewCard key={reviewer} reviewer={reviewer} date={date} text={text} />
            ))}
          </div>
        </div>

        {/* ── Dispute count ── */}
        <p
          style={{
            margin: 0,
            marginTop: "24px",
            fontFamily: "Inter, sans-serif",
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "16px",
            color: "#4CAF84",
          }}
        >
          0 formal disputes
        </p>
      </div>

      {/* ── Pinned bottom CTA ── */}
      <div
        style={{
          height: "72px",
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid #EFEFEF",
          paddingLeft: "16px",
          paddingRight: "16px",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <HzButton variant="primary" fullWidth onClick={onBook}>
          Book Ali Hassan — Est. PKR 2,800
        </HzButton>
      </div>

      {/* ── How Rankings Work bottom sheet ── */}
      {showRankingInfo && (
        <>
          <div
            onClick={() => setShowRankingInfo(false)}
            style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.42)", zIndex: 20 }}
          />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            backgroundColor: "#FFFFFF",
            borderRadius: "16px 16px 0 0",
            zIndex: 21,
            maxHeight: "80%",
            display: "flex", flexDirection: "column",
          }}>
            {/* Drag handle */}
            <div style={{ display: "flex", justifyContent: "center", paddingTop: "12px", paddingBottom: "4px" }}>
              <div style={{ width: "36px", height: "4px", borderRadius: "2px", backgroundColor: BORDER }} />
            </div>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px 12px" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 700, color: NAVY }}>
                How Rankings Work
              </span>
              <button
                type="button"
                onClick={() => setShowRankingInfo(false)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", lineHeight: 1 }}
              >
                <X size={20} color="#9B9B9B" aria-hidden="true" />
              </button>
            </div>
            {/* Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 28px" }}>
              <p style={{ margin: 0, marginBottom: "16px", fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#666666", lineHeight: "19px" }}>
                Provider rankings are calculated automatically and updated in real-time based on four weighted factors:
              </p>
              {[
                { icon: "🏆", label: "Credibility Score",  weight: "60%", desc: "Combined metric from ratings, on-time rate, job completion, and customer feedback." },
                { icon: "✅", label: "Verification Status", weight: "20%", desc: "Ustaad G-verified providers with CNIC, skills testing, and background checks." },
                { icon: "🎓", label: "Experience",          weight: "15%", desc: "Years in service and total jobs completed on the platform." },
                { icon: "📍", label: "Distance",            weight: "5%",  desc: "Proximity to your requested service location for faster response." },
              ].map(({ icon, label, weight, desc }) => (
                <div
                  key={label}
                  style={{
                    display: "flex", gap: "12px", marginBottom: "14px",
                    padding: "12px", borderRadius: "10px",
                    backgroundColor: "#FAF8F5", border: `1px solid ${BORDER}`,
                  }}
                >
                  <span style={{ fontSize: "22px", lineHeight: 1, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, color: "#1A1A1A" }}>
                        {label}
                      </span>
                      <span style={{
                        display: "inline-block", height: "20px", padding: "0 8px",
                        borderRadius: "10px", backgroundColor: `${NAVY}10`,
                        fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 700, color: NAVY,
                        lineHeight: "20px",
                      }}>
                        {weight}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9B9B9B", lineHeight: "17px" }}>
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
              <div style={{
                marginTop: "4px", padding: "12px",
                borderRadius: "10px", backgroundColor: `${GREEN}15`, border: `1px solid ${GREEN}40`,
              }}>
                <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#1A1A1A", lineHeight: "17px" }}>
                  Rankings are refreshed every 24 hours. Providers can improve their ranking by completing jobs, maintaining high ratings, and staying verified.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
