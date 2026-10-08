import React, { useState, useMemo } from "react";
import { ArrowLeft, SlidersHorizontal, Info, ChevronDown, ChevronUp, X, ArrowUpDown, Check } from "lucide-react";
import type { CustomerPref } from "./hz-customer-preferences-screen";

const NAVY   = "#161533";
const GREEN  = "#4CAF84";
const GOLD   = "#FFC107";
const SILVER = "#C0C0C0";
const BG     = "#FAF8F5";
const BORDER = "#E8E3DB";

/* ─── Types ─── */
interface Provider {
  id: string;
  name: string;
  estimatedPrice: string;
  priceValue: number;
  services: string;
  sectors: string;
  rating: number;
  reviewCount: number;
  onTimePercent: number;
  availability: string;
  isRecommended?: boolean;
  rank: number;
  credibilityScore: number;
  experienceYears: number;
  jobCount: number;
  isVerified: boolean;
  responseTime: number;
}

type SortOption  = "credibility" | "distance" | "rating" | "price" | "experience" | "response";
type FilterId    = "all" | "verified" | "top-rated" | "near-me" | "experienced" | "price-low";

/* ─── Mock data ─── */
const PROVIDERS_BASE: Provider[] = [
  {
    id: "1",
    name: "Ali Hassan",
    estimatedPrice: "Est. PKR 2,800",
    priceValue: 2800,
    services: "AC Repairing · AC Installation",
    sectors: "G-10, G-11, G-13, G-14",
    rating: 4.9,
    reviewCount: 234,
    onTimePercent: 95,
    availability: "Available tomorrow 8am",
    isRecommended: true,
    rank: 1,
    credibilityScore: 96,
    experienceYears: 8,
    jobCount: 1234,
    isVerified: true,
    responseTime: 8,
  },
  {
    id: "2",
    name: "Usman Butt",
    estimatedPrice: "Est. PKR 2,400",
    priceValue: 2400,
    services: "AC Repairing",
    sectors: "G-13, F-7, F-8",
    rating: 4.8,
    reviewCount: 186,
    onTimePercent: 92,
    availability: "Available tomorrow 9am",
    rank: 2,
    credibilityScore: 92,
    experienceYears: 5,
    jobCount: 856,
    isVerified: true,
    responseTime: 12,
  },
  {
    id: "3",
    name: "Rizwan Ahmed",
    estimatedPrice: "Est. PKR 3,100",
    priceValue: 3100,
    services: "AC Repairing · AC General Service",
    sectors: "G-9, G-10, G-13",
    rating: 4.7,
    reviewCount: 143,
    onTimePercent: 89,
    availability: "Available tomorrow 7am",
    rank: 3,
    credibilityScore: 88,
    experienceYears: 6,
    jobCount: 723,
    isVerified: true,
    responseTime: 15,
  },
];

const SORT_OPTIONS: { id: SortOption; label: string; desc: string }[] = [
  { id: "credibility", label: "Credibility Score (Best)",       desc: "Highest rated and most reliable providers"   },
  { id: "distance",    label: "Distance (Nearest First)",       desc: "Providers closest to your location"          },
  { id: "rating",      label: "Rating (Highest First)",         desc: "Top rated providers in your area"            },
  { id: "price",       label: "Price (Low to High)",            desc: "Most affordable providers first"             },
  { id: "experience",  label: "Experience (Most Experienced)",  desc: "Providers with most years of experience"     },
  { id: "response",    label: "Response Time (Fastest)",        desc: "Quickest to respond to booking requests"     },
];

const FILTER_CHIPS: { id: FilterId; label: string }[] = [
  { id: "all",         label: "All"              },
  { id: "verified",    label: "Verified Only"    },
  { id: "top-rated",   label: "Top Rated"        },
  { id: "near-me",     label: "Near Me"          },
  { id: "experienced", label: "Experienced"      },
  { id: "price-low",   label: "Price: Low-High"  },
];

/* ─── Rank badge ─── */
const RankBadge: React.FC<{ rank: number; size?: "small" | "medium" }> = ({ rank, size = "medium" }) => {
  const dim = size === "small" ? 20 : 28;
  const fs  = size === "small" ? 9  : 12;
  const bg  = rank === 1 ? GOLD : rank <= 3 ? SILVER : rank <= 10 ? NAVY : "#9B9B9B";
  const shadow = rank === 1
    ? "0 2px 8px rgba(255,193,7,0.45)"
    : rank <= 3
      ? "0 2px 8px rgba(192,192,192,0.45)"
      : "none";

  return (
    <div
      title={`Ranked #${rank} in your area`}
      style={{
        width: `${dim}px`,
        height: `${dim}px`,
        borderRadius: "50%",
        backgroundColor: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: shadow,
      }}
    >
      {rank === 1 && size === "medium" ? (
        <span style={{ fontSize: "11px", lineHeight: 1 }}>👑</span>
      ) : (
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: `${fs}px`, fontWeight: 700, color: "#FFFFFF", lineHeight: 1 }}>
          {rank}
        </span>
      )}
    </div>
  );
};

/* ─── Credibility bar ─── */
const CredibilityBar: React.FC<{ score: number }> = ({ score }) => {
  const fill = score > 80 ? GREEN : score >= 60 ? NAVY : "#FF6B35";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#9B9B9B", flexShrink: 0 }}>
        Credibility
      </span>
      <div style={{ flex: 1, height: "4px", backgroundColor: "#F0EDE8", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", backgroundColor: fill, borderRadius: "2px" }} />
      </div>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 700, color: NAVY, flexShrink: 0 }}>
        {score}/100
      </span>
    </div>
  );
};

/* ─── Preference badge helpers ─── */
const PREF_BADGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Highly Rated":         { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A" },
  "Near You":             { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  "Best Value":           { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0" },
  "Available Soonest":    { bg: "#F5F3FF", text: "#6D28D9", border: "#DDD6FE" },
  "Most Jobs Completed":  { bg: "#FFF1F2", text: "#9F1239", border: "#FECDD3" },
  "#1 Match":             { bg: NAVY,      text: "#FFFFFF", border: NAVY      },
};

function getPreferenceBadges(provider: Provider, prefs: CustomerPref[]): string[] {
  const badges: string[] = [];
  if (prefs.includes("best-rated")        && provider.rating >= 4.8)                 badges.push("Highly Rated");
  if (prefs.includes("closest")           && provider.sectors.includes("G-13"))      badges.push("Near You");
  if (prefs.includes("best-value")        && provider.priceValue <= 2500)            badges.push("Best Value");
  if (prefs.includes("available-soonest") && provider.responseTime <= 10)            badges.push("Available Soonest");
  if (prefs.includes("most-jobs")         && provider.jobCount >= 1000)              badges.push("Most Jobs Completed");
  return badges;
}

const PrefBadge: React.FC<{ label: string }> = ({ label }) => {
  const colors = PREF_BADGE_COLORS[label] ?? { bg: "#F0EDE8", text: "#555555", border: "#E8E3DB" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", height: "20px", paddingLeft: "8px", paddingRight: "8px", borderRadius: "10px", backgroundColor: colors.bg, border: `1px solid ${colors.border}`, fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: colors.text, whiteSpace: "nowrap", letterSpacing: "0.2px" }}>
      {label}
    </span>
  );
};

/* ─── Provider card ─── */
const ProviderCard: React.FC<{
  provider: Provider;
  onViewProfile?: () => void;
  onBook?: () => void;
  prefBadges?: string[];
}> = ({ provider, onViewProfile, onBook, prefBadges = [] }) => {
  const [expanded, setExpanded] = useState(false);

  const breakdown = [
    "✓ Verified Professional",
    `✓ ${provider.experienceYears} years experience`,
    `✓ ${provider.rating.toFixed(1)} average rating`,
    `✓ ${provider.onTimePercent}% on-time arrival`,
    `✓ ${Math.round(provider.jobCount / 15)} jobs this month`,
  ];

  return (
    <article
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        borderTop:    "1px solid #E8E3DB",
        borderRight:  "1px solid #E8E3DB",
        borderBottom: "1px solid #E8E3DB",
        borderLeft:   `4px solid ${GREEN}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Row 1: Avatar + name + rank */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
          <div
            style={{
              width: "48px", height: "48px", borderRadius: "50%",
              backgroundColor: "#E8E3DB",
              border: provider.isVerified ? `2px solid ${GREEN}` : "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "18px", fontWeight: 700, color: "#FFFFFF" }}>
              {provider.name[0]}
            </span>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 700, color: "#1A1A1A", lineHeight: "22px" }}>
              {provider.name}
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#666666", marginTop: "2px" }}>
              {provider.services}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
            <RankBadge rank={provider.rank} />
            <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: GREEN }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: GREEN }}>Available</span>
            </div>
          </div>
        </div>

        {/* Row 2: Credibility bar */}
        <CredibilityBar score={provider.credibilityScore} />

        {/* Row 3: Stats strip */}
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "5px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 700, color: "#1A1A1A" }}>
            {provider.rating.toFixed(1)}
          </span>
          <span style={{ fontSize: "12px", color: GOLD }}>{"★".repeat(Math.round(provider.rating))}</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9B9B9B" }}>
            ({provider.reviewCount})
          </span>
          <span style={{ color: "#D0CCC8", fontSize: "10px" }}>•</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#666666" }}>
            {provider.experienceYears} yrs exp.
          </span>
          <span style={{ color: "#D0CCC8", fontSize: "10px" }}>•</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#666666" }}>
            {provider.sectors.split(",")[0].trim()}
          </span>
        </div>

        {/* Row 3b: Preference match badges */}
        {prefBadges.length > 0 && (
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
            {provider.rank === 1 && prefBadges.length >= 2 && <PrefBadge label="#1 Match" />}
            {prefBadges.map((badge) => <PrefBadge key={badge} label={badge} />)}
          </div>
        )}

        {/* Row 4: Price + actions */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 700, color: NAVY }}>
            {provider.estimatedPrice}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              type="button"
              onClick={onViewProfile}
              style={{ background: "none", border: "none", fontFamily: "Inter, sans-serif", fontSize: "13px", color: NAVY, cursor: "pointer", padding: "4px 0" }}
            >
              View Profile →
            </button>
            <button
              type="button"
              onClick={onBook}
              style={{
                backgroundColor: NAVY, border: "none", color: "#FFFFFF",
                fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 600,
                padding: "6px 14px", borderRadius: "6px", cursor: "pointer",
              }}
            >
              Book
            </button>
          </div>
        </div>

        {/* Expand credibility breakdown */}
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          style={{
            display: "flex", alignItems: "center", gap: "4px",
            background: "none", border: "none", padding: 0, cursor: "pointer",
            fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#9B9B9B",
            alignSelf: "flex-start",
          }}
        >
          Credibility breakdown
          {expanded ? <ChevronUp size={11} color="#9B9B9B" /> : <ChevronDown size={11} color="#9B9B9B" />}
        </button>

        {expanded && (
          <div style={{ borderTop: "1px solid #F0EDE8", paddingTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {breakdown.map(item => (
              <span key={item} style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: GREEN }}>
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

/* ─── Map pin ─── */
const MapPin: React.FC<{
  rank: number;
  selected: boolean;
  onClick: () => void;
}> = ({ rank, selected, onClick }) => {
  const bg = rank === 1 ? GOLD : rank <= 3 ? SILVER : NAVY;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "36px", height: "36px", borderRadius: "50%",
        backgroundColor: bg,
        border: selected ? "3px solid #FFFFFF" : "2px solid rgba(255,255,255,0.75)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.35)",
        cursor: "pointer",
        transform: selected ? "scale(1.2)" : "scale(1)",
        transition: "transform 0.15s ease",
        outline: "none",
        position: "absolute",
      }}
    >
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 700, color: "#FFFFFF", lineHeight: 1 }}>
        {rank}
      </span>
    </button>
  );
};

/* ─── Map view ─── */
const PIN_POSITIONS: Record<string, { top: string; left: string }> = {
  "1": { top: "33%", left: "57%" },
  "2": { top: "58%", left: "27%" },
  "3": { top: "70%", left: "67%" },
};

const HEATMAP_ZONES = [
  { id: "G-13", label: "G-13",  top: "28%", left: "54%", size: 130, color: "#FF6B35", opacity: 0.35 },
  { id: "F-10", label: "F-10",  top: "12%", left: "26%", size: 100, color: "#FFB347", opacity: 0.28 },
  { id: "I-8",  label: "I-8",   top: "62%", left: "15%", size: 84,  color: "#FFB347", opacity: 0.28 },
  { id: "G-10", label: "G-10",  top: "68%", left: "66%", size: 68,  color: "#FFF3CD", opacity: 0.35 },
];

const LEGEND_ITEMS = [
  { color: "#D32F2F", label: "Very High" },
  { color: "#FF6B35", label: "High"      },
  { color: "#FFB347", label: "Medium"    },
  { color: "#FFF3CD", label: "Low",  border: "#E8E3DB" },
];

const MapView: React.FC<{
  providers: Provider[];
  onViewProfile?: () => void;
  onBook?: () => void;
}> = ({ providers, onViewProfile, onBook }) => {
  const [selectedId,   setSelectedId]   = useState<string | null>(null);
  const [showLayers,   setShowLayers]   = useState(false);
  const [showLegend,   setShowLegend]   = useState(false);
  const [showHeatmap,  setShowHeatmap]  = useState(true);
  const [showZones,    setShowZones]    = useState(true);
  const selected = providers.find(p => p.id === selectedId) ?? null;

  const BLOCKS = [
    { top: "10%", left: "8%",  w: "16%", h: "13%" },
    { top: "10%", left: "32%", w: "13%", h: "13%" },
    { top: "10%", left: "54%", w: "20%", h: "13%" },
    { top: "10%", left: "80%", w: "12%", h: "13%" },
    { top: "36%", left: "8%",  w: "13%", h: "9%"  },
    { top: "36%", left: "54%", w: "10%", h: "9%"  },
    { top: "36%", left: "72%", w: "18%", h: "9%"  },
    { top: "55%", left: "8%",  w: "14%", h: "10%" },
    { top: "55%", left: "32%", w: "10%", h: "10%" },
    { top: "55%", left: "72%", w: "14%", h: "10%" },
    { top: "74%", left: "8%",  w: "20%", h: "13%" },
    { top: "74%", left: "35%", w: "15%", h: "13%" },
    { top: "74%", left: "57%", w: "13%", h: "13%" },
    { top: "74%", left: "78%", w: "14%", h: "13%" },
  ];

  return (
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
      {/* Map background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundColor: "#E8EDDF",
        backgroundImage: [
          "linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px)",
        ].join(", "),
        backgroundSize: "44px 44px",
      }} />

      {/* Roads */}
      {[
        { style: { top: "50%",  left: 0, right: 0, height: "9px",  transform: "translateY(-50%)" } },
        { style: { left: "50%", top: 0, bottom: 0, width:  "9px",  transform: "translateX(-50%)" } },
        { style: { top: "29%",  left: 0, right: 0, height: "5px"                                 } },
        { style: { top: "72%",  left: 0, right: 0, height: "5px"                                 } },
        { style: { left: "28%", top: 0, bottom: 0, width:  "5px"                                 } },
        { style: { left: "70%", top: 0, bottom: 0, width:  "5px"                                 } },
      ].map((r, i) => (
        <div key={i} style={{ position: "absolute", backgroundColor: "rgba(255,255,255,0.75)", ...r.style }} />
      ))}

      {/* Building blocks */}
      {BLOCKS.map((b, i) => (
        <div key={i} style={{
          position: "absolute", top: b.top, left: b.left, width: b.w, height: b.h,
          backgroundColor: "#CAD4C4", borderRadius: "2px",
        }} />
      ))}

      {/* User location */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 3,
      }}>
        <div style={{
          width: "14px", height: "14px", borderRadius: "50%",
          backgroundColor: "#0066CC", border: "3px solid #FFFFFF",
          boxShadow: "0 0 0 6px rgba(0,102,204,0.18)",
        }} />
      </div>

      {/* Service radius */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "56%", height: "64%",
        borderRadius: "50%",
        border: `2px solid ${NAVY}`,
        backgroundColor: `${NAVY}0A`,
        zIndex: 1,
        pointerEvents: "none",
      }} />

      {/* Heatmap blobs */}
      {showHeatmap && HEATMAP_ZONES.map(z => (
        <div key={z.id} style={{
          position: "absolute",
          top: z.top, left: z.left,
          width: `${z.size}px`, height: `${z.size}px`,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${z.color} 0%, ${z.color}00 70%)`,
          opacity: z.opacity + 0.15,
          filter: "blur(6px)",
          pointerEvents: "none",
          zIndex: 2,
        }} />
      ))}

      {/* Zone labels */}
      {showZones && HEATMAP_ZONES.map(z => (
        <button key={`lbl-${z.id}`} type="button"
          onClick={() => {}}
          style={{
            position: "absolute",
            top: z.top, left: z.left,
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(22,21,51,0.82)",
            border: "none",
            borderRadius: "10px", padding: "3px 7px",
            fontFamily: "Inter, sans-serif", fontSize: "9px", fontWeight: 600, color: "#FFFFFF",
            cursor: "pointer",
            zIndex: 5,
            backdropFilter: "blur(2px)",
          }}
        >
          {z.label}
        </button>
      ))}

      {/* Cluster */}
      <div style={{
        position: "absolute", top: "17%", left: "14%",
        width: "32px", height: "32px", borderRadius: "50%",
        backgroundColor: NAVY,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        zIndex: 4,
      }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 700, color: "#FFFFFF" }}>+2</span>
      </div>

      {/* Provider pins */}
      {providers.map(p => {
        const pos = PIN_POSITIONS[p.id];
        if (!pos) return null;
        return (
          <div key={p.id} style={{ position: "absolute", top: pos.top, left: pos.left, transform: "translate(-50%,-50%)", zIndex: 4 }}>
            <MapPin
              rank={p.rank}
              selected={selectedId === p.id}
              onClick={() => setSelectedId(prev => prev === p.id ? null : p.id)}
            />
          </div>
        );
      })}

      {/* Pin popup */}
      {selected && (
        <>
          <div
            onClick={() => setSelectedId(null)}
            style={{ position: "absolute", inset: 0, zIndex: 8 }}
          />
          <div style={{
            position: "absolute",
            top: "10px", left: "12px", right: "12px",
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            boxShadow: "0 4px 18px rgba(0,0,0,0.18)",
            zIndex: 9,
            padding: "14px",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <RankBadge rank={selected.rank} />
                <div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 700, color: "#1A1A1A" }}>
                    {selected.name}
                  </div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#666666" }}>
                    {selected.services.split("·")[0].trim()}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); setSelectedId(null); }}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", lineHeight: 1 }}
              >
                <X size={18} color="#9B9B9B" />
              </button>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9B9B9B" }}>
                Credibility {selected.credibilityScore}/100 · ★ {selected.rating.toFixed(1)} ({selected.reviewCount} reviews)
              </span>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 700, color: NAVY, marginTop: "2px" }}>
                {selected.estimatedPrice}
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={onViewProfile}
                style={{
                  flex: 1, height: "36px", borderRadius: "6px",
                  backgroundColor: NAVY, border: "none",
                  fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#FFFFFF",
                  cursor: "pointer",
                }}
              >
                View Profile
              </button>
              <button
                type="button"
                onClick={onBook}
                style={{
                  flex: 1, height: "36px", borderRadius: "6px",
                  backgroundColor: "transparent", border: `1px solid ${NAVY}`,
                  fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: NAVY,
                  cursor: "pointer",
                }}
              >
                Book
              </button>
            </div>
          </div>
        </>
      )}

      {/* Layer toggle button (top right) */}
      {!selected && (
        <button type="button" onClick={() => setShowLayers(v => !v)}
          style={{
            position: "absolute", top: "10px", right: "10px",
            backgroundColor: "rgba(255,255,255,0.92)",
            border: "none", borderRadius: "8px",
            padding: "6px 10px",
            display: "flex", alignItems: "center", gap: "5px",
            fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, color: NAVY,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 6,
          }}>
          ◧ Layers
        </button>
      )}

      {/* Legend toggle (bottom right) */}
      <button type="button" onClick={() => setShowLegend(v => !v)}
        style={{
          position: "absolute", bottom: "12px", right: "10px",
          backgroundColor: "rgba(255,255,255,0.92)",
          border: "none", borderRadius: "8px",
          padding: "5px 10px",
          fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: NAVY,
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          zIndex: 6,
        }}>
        Legend
      </button>

      {/* Legend panel (bottom left) */}
      {showLegend && (
        <div style={{
          position: "absolute", bottom: "12px", left: "10px",
          backgroundColor: "rgba(255,255,255,0.95)",
          borderRadius: "8px", padding: "10px 12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          zIndex: 6,
        }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 700, color: NAVY, marginBottom: "6px" }}>
            Demand Intensity
          </div>
          {LEGEND_ITEMS.map(({ color, label, border }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
              <div style={{
                width: "12px", height: "12px", borderRadius: "50%",
                backgroundColor: color,
                border: border ? `1px solid ${border}` : "none",
                flexShrink: 0,
              }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#1A1A1A" }}>{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Layer selector sheet */}
      {showLayers && (
        <>
          <div onClick={() => setShowLayers(false)} style={{ position: "absolute", inset: 0, zIndex: 18 }} />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            backgroundColor: "#FFFFFF", borderRadius: "16px 16px 0 0",
            zIndex: 19, padding: "16px 16px 28px",
          }}>
            <div style={{ display: "flex", justifyContent: "center", paddingBottom: "10px" }}>
              <div style={{ width: "36px", height: "4px", borderRadius: "2px", backgroundColor: BORDER }} />
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 700, color: NAVY, marginBottom: "12px" }}>
              Map Layers
            </div>
            {[
              { label: "Demand Heatmap",  value: showHeatmap, setter: setShowHeatmap },
              { label: "Demand Zones",    value: showZones,   setter: setShowZones   },
            ].map(({ label, value, setter }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "10px", paddingBottom: "10px", borderBottom: "1px solid #F5F5F5" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#1A1A1A" }}>{label}</span>
                <button type="button" onClick={() => setter(v => !v)}
                  style={{
                    width: "44px", height: "24px", borderRadius: "12px",
                    backgroundColor: value ? NAVY : BORDER,
                    border: "none", cursor: "pointer", position: "relative",
                  }}>
                  <div style={{
                    position: "absolute", top: "2px",
                    left: value ? "22px" : "2px",
                    width: "20px", height: "20px",
                    borderRadius: "50%", backgroundColor: "#FFFFFF",
                    transition: "left 0.15s ease",
                  }} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/* ─── Sort sheet ─── */
const SortSheet: React.FC<{
  activeSort: SortOption;
  onSelect: (s: SortOption) => void;
  onClose: () => void;
}> = ({ activeSort, onSelect, onClose }) => {
  const [local, setLocal] = useState<SortOption>(activeSort);

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.42)", zIndex: 20 }}
      />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        backgroundColor: "#FFFFFF",
        borderRadius: "16px 16px 0 0",
        zIndex: 21,
        maxHeight: "75%",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "12px", paddingBottom: "4px" }}>
          <div style={{ width: "36px", height: "4px", borderRadius: "2px", backgroundColor: BORDER }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px 8px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 700, color: NAVY }}>
            Sort Providers By
          </span>
          <button type="button" onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", lineHeight: 1 }}>
            <X size={20} color="#9B9B9B" />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0 16px" }}>
          {SORT_OPTIONS.map(opt => {
            const active = local === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setLocal(opt.id)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: "12px",
                  padding: "14px 0", borderBottom: "1px solid #F5F5F5",
                  background: "none", border: "none", borderBottom: "1px solid #F5F5F5",
                  cursor: "pointer", textAlign: "left",
                }}
              >
                <div style={{
                  width: "20px", height: "20px", borderRadius: "50%",
                  backgroundColor: active ? NAVY : "transparent",
                  border: active ? "none" : `2px solid ${BORDER}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {active && <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#FFFFFF" }} />}
                </div>
                <div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: active ? 600 : 400, color: "#1A1A1A" }}>
                    {opt.label}
                  </div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#9B9B9B", marginTop: "1px" }}>
                    {opt.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ padding: "12px 16px 28px", borderTop: "1px solid #F5F5F5", display: "flex", flexDirection: "column", gap: "8px" }}>
          <button
            type="button"
            onClick={() => { onSelect(local); onClose(); }}
            style={{
              width: "100%", height: "48px", borderRadius: "10px",
              backgroundColor: NAVY, border: "none",
              fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 700, color: "#FFFFFF",
              cursor: "pointer",
            }}
          >
            Apply Sort
          </button>
          <button
            type="button"
            onClick={() => { setLocal("credibility"); onSelect("credibility"); onClose(); }}
            style={{ background: "none", border: "none", fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#9B9B9B", cursor: "pointer", padding: "4px" }}
          >
            Reset to Default
          </button>
        </div>
      </div>
    </>
  );
};

/* ─── Filter sheet ─── */
const FilterSheet: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [verified,   setVerified]   = useState(false);
  const [expLevel,   setExpLevel]   = useState<"entry" | "experienced" | "expert" | null>(null);
  const [availNow,   setAvailNow]   = useState(false);
  const [availToday, setAvailToday] = useState(false);
  const [minRating,  setMinRating]  = useState(3.0);
  const [credMin,    setCredMin]    = useState(60);

  const activeCount = [verified, expLevel !== null, availNow, availToday].filter(Boolean).length;

  const Toggle: React.FC<{ label: string; value: boolean; onChange: (v: boolean) => void }> = ({ label, value, onChange }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", paddingBottom: "12px" }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#1A1A1A" }}>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        style={{
          width: "44px", height: "24px", borderRadius: "12px",
          backgroundColor: value ? NAVY : BORDER,
          border: "none", cursor: "pointer", position: "relative",
        }}
      >
        <div style={{
          position: "absolute", top: "2px",
          left: value ? "22px" : "2px",
          width: "20px", height: "20px",
          borderRadius: "50%", backgroundColor: "#FFFFFF",
          transition: "left 0.15s ease",
        }} />
      </button>
    </div>
  );

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.42)", zIndex: 20 }}
      />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        backgroundColor: "#FFFFFF",
        borderRadius: "16px 16px 0 0",
        zIndex: 21,
        maxHeight: "85%",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "12px", paddingBottom: "4px" }}>
          <div style={{ width: "36px", height: "4px", borderRadius: "2px", backgroundColor: BORDER }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 700, color: NAVY }}>
            Filter Providers
          </span>
          <button
            type="button"
            onClick={() => { setVerified(false); setExpLevel(null); setAvailNow(false); setAvailToday(false); setMinRating(3.0); setCredMin(60); }}
            style={{ background: "none", border: "none", fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#9B9B9B", cursor: "pointer" }}
          >
            Clear All
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0 16px" }}>
          <div style={{ borderBottom: "1px solid #F5F5F5" }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#1A1A1A", paddingTop: "10px" }}>
              Verification Status
            </div>
            <Toggle label="Show Verified Only" value={verified} onChange={setVerified} />
          </div>

          <div style={{ borderBottom: "1px solid #F5F5F5", paddingTop: "12px", paddingBottom: "12px" }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#1A1A1A", marginBottom: "8px" }}>
              Experience Level
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {(["entry", "experienced", "expert"] as const).map(lv => {
                const labels = { entry: "Entry (0–2 yrs)", experienced: "3–5 yrs", expert: "Expert (5+)" };
                const active = expLevel === lv;
                return (
                  <button
                    key={lv}
                    type="button"
                    onClick={() => setExpLevel(expLevel === lv ? null : lv)}
                    style={{
                      flex: 1, height: "32px", borderRadius: "8px",
                      backgroundColor: active ? NAVY : "#F5F5F5",
                      border: "none",
                      fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 500,
                      color: active ? "#FFFFFF" : "#666666", cursor: "pointer",
                    }}
                  >
                    {labels[lv]}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ borderBottom: "1px solid #F5F5F5", paddingTop: "12px", paddingBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#1A1A1A" }}>
                Minimum Rating
              </span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 700, color: NAVY }}>
                {minRating.toFixed(1)} ★
              </span>
            </div>
            <input
              type="range" min="3" max="5" step="0.5"
              value={minRating}
              onChange={e => setMinRating(parseFloat(e.target.value))}
              style={{ width: "100%", accentColor: NAVY }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#9B9B9B" }}>3.0</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#9B9B9B" }}>5.0</span>
            </div>
          </div>

          <div style={{ borderBottom: "1px solid #F5F5F5", paddingTop: "12px", paddingBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#1A1A1A" }}>
                Min. Credibility Score
              </span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 700, color: NAVY }}>
                {credMin}
              </span>
            </div>
            <input
              type="range" min="0" max="100" step="5"
              value={credMin}
              onChange={e => setCredMin(parseInt(e.target.value))}
              style={{ width: "100%", accentColor: NAVY }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#9B9B9B" }}>0</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#9B9B9B" }}>100</span>
            </div>
          </div>

          <div style={{ paddingTop: "4px" }}>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#1A1A1A", paddingTop: "8px" }}>
              Availability
            </div>
            <Toggle label="Available Now"   value={availNow}   onChange={setAvailNow}   />
            <Toggle label="Available Today" value={availToday} onChange={setAvailToday} />
          </div>
        </div>

        <div style={{ padding: "12px 16px 28px", borderTop: "1px solid #F5F5F5" }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9B9B9B", marginBottom: "8px" }}>
            {activeCount > 0 ? `${activeCount} filter${activeCount > 1 ? "s" : ""} active` : "No filters active"}
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: "100%", height: "48px", borderRadius: "10px",
              backgroundColor: NAVY, border: "none",
              fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 700, color: "#FFFFFF",
              cursor: "pointer",
            }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};

/* ─── Ranking tooltip ─── */
const RankingTooltip: React.FC<{ onClose: () => void; onLearnMore?: () => void }> = ({ onClose, onLearnMore }) => (
  <>
    <div onClick={onClose} style={{ position: "absolute", inset: 0, zIndex: 15 }} />
    <div style={{
      position: "absolute",
      top: "98px", right: "14px",
      width: "240px",
      backgroundColor: "#FFFFFF",
      borderRadius: "10px",
      boxShadow: "0 4px 18px rgba(0,0,0,0.16)",
      zIndex: 16,
      padding: "14px",
    }}>
      <div style={{
        position: "absolute", top: "-6px", right: "22px",
        width: "12px", height: "12px",
        backgroundColor: "#FFFFFF",
        transform: "rotate(45deg)",
        boxShadow: "-2px -2px 4px rgba(0,0,0,0.06)",
      }} />
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 700, color: NAVY, marginBottom: "4px" }}>
        Ranked by Credibility
      </div>
      <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#666666", lineHeight: "16px" }}>
        Scores are based on verification status, experience, ratings, job success rate, and distance from your location.
      </p>
      <button
        type="button"
        onClick={() => { onClose(); onLearnMore?.(); }}
        style={{ background: "none", border: "none", fontFamily: "Inter, sans-serif", fontSize: "11px", color: NAVY, cursor: "pointer", padding: "6px 0 0", display: "block", fontWeight: 600 }}
      >
        Learn more →
      </button>
    </div>
  </>
);

/* ─── Empty state ─── */
const EmptyState: React.FC<{ onClear: () => void }> = ({ onClear }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 16px", gap: "12px" }}>
    <div style={{
      width: "64px", height: "64px", borderRadius: "20px",
      backgroundColor: "#EEEEF5",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "26px",
    }}>
      🔍
    </div>
    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 700, color: NAVY, textAlign: "center" }}>
      No providers match your filters
    </div>
    <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#9B9B9B", textAlign: "center", maxWidth: "240px" }}>
      Try adjusting your filters or expanding your search area.
    </p>
    <button
      type="button"
      onClick={onClear}
      style={{
        height: "44px", padding: "0 24px", borderRadius: "8px",
        backgroundColor: NAVY, border: "none",
        fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 700, color: "#FFFFFF",
        cursor: "pointer", marginTop: "4px",
      }}
    >
      Clear Filters
    </button>
  </div>
);

/* ─── Main screen ─── */
interface HzProviderResultsScreenProps {
  onBack?: () => void;
  onViewProfile?: () => void;
  onBookProvider?: () => void;
  onRankingExplanation?: () => void;
  customerPrefs?: CustomerPref[];
}

export const HzProviderResultsScreen: React.FC<HzProviderResultsScreenProps> = ({
  onBack,
  onViewProfile,
  onBookProvider,
  onRankingExplanation,
  customerPrefs = [],
}) => {
  const [activeTab,          setActiveTab]          = useState<"haazir" | "maps">("haazir");
  const [activeSort,         setActiveSort]         = useState<SortOption>("credibility");
  const [activeFilters,      setActiveFilters]      = useState<Set<FilterId>>(new Set(["all"]));
  const [showSortSheet,      setShowSortSheet]      = useState(false);
  const [showFilterSheet,    setShowFilterSheet]    = useState(false);
  const [showRankingTooltip, setShowRankingTooltip] = useState(false);

  const toggleFilter = (id: FilterId) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (id === "all") return new Set(["all"]);
      next.delete("all");
      if (next.has(id)) {
        next.delete(id);
        if (next.size === 0) next.add("all");
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const clearFilters = () => setActiveFilters(new Set(["all"]));
  const hasFilters   = !activeFilters.has("all");

  const sorted = useMemo(() => {
    return [...PROVIDERS_BASE].sort((a, b) => {
      switch (activeSort) {
        case "rating":     return b.rating - a.rating;
        case "price":      return a.priceValue - b.priceValue;
        case "experience": return b.experienceYears - a.experienceYears;
        case "response":   return a.responseTime - b.responseTime;
        default:           return a.rank - b.rank;
      }
    });
  }, [activeSort]);

  const filtered = useMemo(() => {
    if (activeFilters.has("all")) return sorted;
    return sorted.filter(p => {
      if (activeFilters.has("verified")    && !p.isVerified)               return false;
      if (activeFilters.has("top-rated")   && p.rating < 4.7)              return false;
      if (activeFilters.has("near-me")     && !p.sectors.includes("G-13")) return false;
      if (activeFilters.has("experienced") && p.experienceYears < 5)       return false;
      return true;
    });
  }, [sorted, activeFilters]);

  const sortLabel = SORT_OPTIONS.find(s => s.id === activeSort)?.label ?? "";

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      backgroundColor: BG, overflow: "hidden", position: "relative",
    }}>
      {/* Status bar */}
      <div aria-hidden="true" style={{ height: "24px", flexShrink: 0, backgroundColor: "#FFFFFF" }} />

      {/* App bar */}
      <header style={{
        height: "56px", backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #EFEFEF",
        display: "flex", alignItems: "center",
        paddingLeft: "4px", paddingRight: "4px",
        flexShrink: 0, position: "relative",
      }}>
        <button
          type="button" onClick={onBack} aria-label="Go back"
          style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}
        >
          <ArrowLeft size={24} color="#1A1A1A" aria-hidden="true" />
        </button>
        <span style={{
          position: "absolute", left: "48px", right: "48px",
          textAlign: "center", fontFamily: "Inter, sans-serif",
          fontSize: "15px", fontWeight: 600, color: "#1A1A1A",
          pointerEvents: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          AC Repair · G-13 · Tomorrow 9am
        </span>
        <button
          type="button"
          aria-label="Filter results"
          onClick={() => setShowFilterSheet(true)}
          style={{
            width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center",
            background: "none", border: "none", cursor: "pointer", flexShrink: 0, marginLeft: "auto",
            position: "relative",
          }}
        >
          <SlidersHorizontal size={22} color="#1A1A1A" aria-hidden="true" />
          {hasFilters && (
            <div style={{
              position: "absolute", top: "10px", right: "10px",
              width: "8px", height: "8px", borderRadius: "50%", backgroundColor: NAVY,
            }} />
          )}
        </button>
      </header>

      {/* Tabs */}
      <div role="tablist" aria-label="Provider source" style={{
        height: "48px", backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #EFEFEF",
        display: "flex", alignItems: "stretch",
        paddingLeft: "16px", paddingRight: "16px",
        flexShrink: 0,
      }}>
        {([ { id: "haazir", label: "Ustaad G Providers (3)" }, { id: "maps", label: "Google Maps (5)" } ] as const).map(({ id, label }) => {
          const active = activeTab === id;
          return (
            <button
              key={id} role="tab" aria-selected={active} type="button"
              onClick={() => setActiveTab(id)}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                background: "none", border: "none",
                borderBottom: active ? `3px solid ${NAVY}` : "3px solid transparent",
                cursor: "pointer", padding: 0,
                fontFamily: "Inter, sans-serif", fontSize: "13px",
                fontWeight: active ? 600 : 400, color: active ? "#1A1A1A" : "#9B9B9B",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Ustaad G tab sub-header: credibility label + filter strip */}
      {activeTab === "haazir" && (
        <>
          {/* "Ranked by Credibility" row */}
          <div style={{
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #F0EDE8",
            padding: "5px 16px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexShrink: 0,
          }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#9B9B9B" }}>
              Ranked by Credibility
            </span>
            <button
              type="button"
              aria-label="How ranking works"
              onClick={() => setShowRankingTooltip(v => !v)}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: "2px 0", lineHeight: 1 }}
            >
              <Info size={13} color="#9B9B9B" aria-hidden="true" />
            </button>
          </div>

          {/* Filter chip strip */}
          <div style={{
            height: "50px", backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #F0EDE8",
            display: "flex", alignItems: "center",
            paddingLeft: "12px", gap: "6px",
            overflowX: "auto", overflowY: "hidden",
            scrollbarWidth: "none",
            flexShrink: 0,
          }}>
            {/* Sort button */}
            <button
              type="button"
              onClick={() => setShowSortSheet(true)}
              style={{
                flexShrink: 0, height: "32px", padding: "0 10px",
                borderRadius: "16px",
                backgroundColor: "#EEEEF5", border: `1px solid ${NAVY}`,
                display: "flex", alignItems: "center", gap: "4px",
                fontFamily: "Inter, sans-serif", fontSize: "12px", color: NAVY,
                cursor: "pointer",
              }}
            >
              <ArrowUpDown size={12} color={NAVY} aria-hidden="true" />
              Sort
            </button>

            {FILTER_CHIPS.map(({ id, label }) => {
              const active = activeFilters.has(id);
              return (
                <button
                  key={id} type="button"
                  onClick={() => toggleFilter(id)}
                  style={{
                    flexShrink: 0, height: "32px", padding: "0 14px",
                    borderRadius: "16px",
                    backgroundColor: active ? NAVY : "#F5F5F5",
                    border: "none",
                    fontFamily: "Inter, sans-serif", fontSize: "12px",
                    color: active ? "#FFFFFF" : "#666666",
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              );
            })}

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                style={{
                  flexShrink: 0, height: "32px", padding: "0 10px",
                  borderRadius: "16px",
                  backgroundColor: "transparent", border: "1px solid #D94F4F",
                  display: "flex", alignItems: "center", gap: "3px",
                  fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#D94F4F",
                  cursor: "pointer",
                }}
              >
                <X size={10} color="#D94F4F" aria-hidden="true" />
                Clear
              </button>
            )}

            <span style={{ width: "8px", flexShrink: 0 }} />
          </div>
        </>
      )}

      {/* Content */}
      {activeTab === "haazir" ? (
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "0 16px 24px" }}>
          <p style={{ margin: 0, marginTop: "10px", fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#9B9B9B" }}>
            Showing {filtered.length} registered provider{filtered.length !== 1 ? "s" : ""}
            {activeSort !== "credibility" ? ` · Sorted by ${sortLabel}` : ""}
          </p>

          <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {filtered.length > 0 ? (
              filtered.map(p => (
                <ProviderCard
                  key={p.id}
                  provider={p}
                  onViewProfile={onViewProfile}
                  onBook={onBookProvider}
                  prefBadges={customerPrefs.length > 0 ? getPreferenceBadges(p, customerPrefs) : []}
                />
              ))
            ) : (
              <EmptyState onClear={clearFilters} />
            )}
          </div>

          {filtered.length > 0 && (
            <button
              type="button"
              style={{
                marginTop: "16px", width: "100%", height: "48px",
                borderRadius: "12px", backgroundColor: "#FFFFFF",
                border: `1px solid ${BORDER}`,
                fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#9B9B9B",
                cursor: "pointer",
              }}
            >
              Load more providers
            </button>
          )}
        </div>
      ) : (
        <MapView
          providers={PROVIDERS_BASE}
          onViewProfile={onViewProfile}
          onBook={onBookProvider}
        />
      )}

      {/* Overlays */}
      {showSortSheet && (
        <SortSheet
          activeSort={activeSort}
          onSelect={setActiveSort}
          onClose={() => setShowSortSheet(false)}
        />
      )}
      {showFilterSheet && (
        <FilterSheet onClose={() => setShowFilterSheet(false)} />
      )}
      {showRankingTooltip && (
        <RankingTooltip
          onClose={() => setShowRankingTooltip(false)}
          onLearnMore={() => { setShowRankingTooltip(false); onRankingExplanation?.(); }}
        />
      )}
    </div>
  );
};
