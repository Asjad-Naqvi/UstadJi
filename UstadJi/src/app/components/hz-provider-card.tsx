import React from "react";
import { MapPin, ShieldCheck, Star, Briefcase, Clock } from "lucide-react";

const NAVY = "#161533";
const GREEN = "#4CAF84";
const BG = "#FAF8F5";
const BORDER = "#E8E3DB";

type AvailabilityStatus = "available" | "busy" | "scheduled";

const AVAIL: Record<AvailabilityStatus, { label: string; color: string; bg: string }> = {
  available: { label: "Available Today", color: "#4CAF84", bg: "rgba(76,175,132,0.10)" },
  busy:      { label: "Busy",            color: "#D94F4F", bg: "rgba(217,79,79,0.10)"  },
  scheduled: { label: "By Appointment", color: "#E8872A", bg: "rgba(232,135,42,0.10)" },
};

const AVATAR_COLORS = [
  "#161533", "#2D6A4F", "#1D3557", "#5C4033",
  "#4A1942", "#1B4332", "#374151", "#7C3626",
];

export interface HzProviderCardData {
  id: string;
  name: string;
  initials: string;
  serviceType: string;
  services: string[];
  rating: number;
  reviewCount: number;
  completedJobs: number;
  experience: string;
  location: string;
  responseTime: string;
  price: string;
  availability: AvailabilityStatus;
}

interface HzProviderCardProps extends HzProviderCardData {
  onSelect?: () => void;
}

export const HzProviderCard: React.FC<HzProviderCardProps> = ({
  id,
  name,
  initials,
  serviceType,
  services,
  rating,
  reviewCount,
  completedJobs,
  experience,
  location,
  responseTime,
  price,
  availability,
  onSelect,
}) => {
  const avail = AVAIL[availability];
  const avatarColor = AVATAR_COLORS[parseInt(id, 10) % AVATAR_COLORS.length];

  return (
    <article
      onClick={onSelect}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        border: `1px solid ${BORDER}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        padding: "16px",
        cursor: onSelect ? "pointer" : "default",
      }}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={onSelect ? (e) => e.key === "Enter" && onSelect() : undefined}
      aria-label={`View profile of ${name}, ${serviceType}`}
    >
      {/* Top row: avatar + name + availability */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <div
          aria-hidden="true"
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "14px",
            backgroundColor: avatarColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "17px", fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.5px" }}>
            {initials}
          </span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
            {/* Name + verified */}
            <div style={{ display: "flex", alignItems: "center", gap: "5px", minWidth: 0 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 700, lineHeight: "22px", color: "#1A1A1A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {name}
              </span>
              <span aria-label="Ustaad G Verified" style={{ display: "inline-flex", alignItems: "center", gap: "2px", flexShrink: 0 }}>
                <ShieldCheck size={14} color={GREEN} aria-hidden="true" />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, color: GREEN, lineHeight: 1 }}>Verified</span>
              </span>
            </div>
            {/* Availability pill */}
            <span style={{ display: "inline-flex", alignItems: "center", height: "22px", paddingLeft: "8px", paddingRight: "8px", borderRadius: "6px", backgroundColor: avail.bg, fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: avail.color, whiteSpace: "nowrap", flexShrink: 0 }}>
              {avail.label}
            </span>
          </div>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 500, lineHeight: "18px", color: "#555555" }}>
            {serviceType}
          </span>
        </div>
      </div>

      {/* Service chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
        {services.slice(0, 4).map((s) => (
          <span key={s} style={{ display: "inline-flex", alignItems: "center", height: "24px", paddingLeft: "8px", paddingRight: "8px", borderRadius: "20px", backgroundColor: BG, border: `1px solid ${BORDER}`, fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#555555", whiteSpace: "nowrap" }}>
            {s}
          </span>
        ))}
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
          <Star size={12} color="#FFC107" fill="#FFC107" aria-hidden="true" />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 600, color: "#1A1A1A" }}>{rating.toFixed(1)}</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#9B9B9B" }}>({reviewCount})</span>
        </div>
        <span aria-hidden="true" style={{ color: BORDER }}>·</span>
        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
          <Briefcase size={11} color="#9B9B9B" aria-hidden="true" />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9B9B9B" }}>{completedJobs} jobs</span>
        </div>
        <span aria-hidden="true" style={{ color: BORDER }}>·</span>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9B9B9B" }}>{experience}</span>
      </div>

      {/* Location + response time */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "5px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
          <MapPin size={11} color="#9B9B9B" aria-hidden="true" />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9B9B9B" }}>{location}</span>
        </div>
        <span aria-hidden="true" style={{ color: BORDER }}>·</span>
        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
          <Clock size={11} color="#9B9B9B" aria-hidden="true" />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9B9B9B" }}>Responds {responseTime}</span>
        </div>
      </div>

      {/* Divider */}
      <div aria-hidden="true" style={{ height: "1px", backgroundColor: "#F0EDE8", margin: "12px 0" }} />

      {/* Price + CTA */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#9B9B9B", display: "block", lineHeight: "14px" }}>Starting from</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "18px", fontWeight: 700, color: "#1A1A1A", lineHeight: "24px" }}>{price}</span>
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
          aria-label={`View profile of ${name}`}
          style={{ height: "38px", paddingLeft: "20px", paddingRight: "20px", borderRadius: "10px", backgroundColor: NAVY, color: "#FFFFFF", border: "none", fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center" }}
        >
          View Profile
        </button>
      </div>
    </article>
  );
};
