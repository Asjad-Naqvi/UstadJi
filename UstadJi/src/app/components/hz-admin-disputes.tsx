import React, { useState } from "react";
import { ArrowLeft, SlidersHorizontal, ChevronDown } from "lucide-react";

const NAVY = "#161533";
const GREEN = "#4CAF84";
const BG = "#FAF8F5";
const BORDER = "#E8E3DB";
const ORANGE = "#FF6B35";

const disputes = [
  { id: "D-2401", title: "Ahmed vs Usman",  service: "Plumbing Repair",  category: "Payment Dispute",  priority: "high",   status: "under-review", created: "2 hours ago"  },
  { id: "D-2402", title: "Sana vs Ali",     service: "AC Repair",         category: "Service Quality",  priority: "medium", status: "resolved",     created: "5 hours ago"  },
  { id: "D-2403", title: "Hassan vs Raza",  service: "Electrical",        category: "No-Show",          priority: "high",   status: "escalated",    created: "1 day ago"    },
  { id: "D-2404", title: "Bilal vs Tariq",  service: "Sofa Cleaning",     category: "Incomplete Work",  priority: "low",    status: "open",         created: "2 days ago"   },
  { id: "D-2405", title: "Nida vs Imran",   service: "Carpentry",         category: "Overcharging",     priority: "medium", status: "under-review", created: "3 days ago"   },
];

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  "open":         { bg: "#FFF3E0",  color: ORANGE,     label: "Open"         },
  "under-review": { bg: "#E3F2FD",  color: "#1565C0",  label: "Under Review" },
  "resolved":     { bg: "#E8F5E9",  color: GREEN,      label: "Resolved"     },
  "escalated":    { bg: "#FFEBEE",  color: "#D32F2F",  label: "Escalated"    },
};

const priorityConfig: Record<string, { color: string; label: string }> = {
  "high":   { color: "#D32F2F", label: "High ⚠️" },
  "medium": { color: ORANGE,    label: "Medium"   },
  "low":    { color: GREEN,     label: "Low"      },
};

interface HzAdminDisputesScreenProps {
  onBack?: () => void;
  onViewDetail?: () => void;
}

export function HzAdminDisputesScreen({ onBack, onViewDetail }: HzAdminDisputesScreenProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeSort, setActiveSort] = useState("newest");

  const filterChips = ["All", "Open", "Under Review", "Resolved", "Escalated"];
  const sortChips = ["Newest", "Oldest", "Priority"];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        backgroundColor: BG,
        overflow: "hidden",
        flex: 1,
        fontFamily: "Inter, sans-serif",
        width: 390,
        height: 844,
      }}
    >
      {/* Status bar */}
      <div style={{ height: 24, backgroundColor: "white", flexShrink: 0 }} />

      {/* Header */}
      <div
        style={{
          height: 56,
          backgroundColor: "white",
          borderBottom: "1px solid #EFEFEF",
          display: "flex",
          alignItems: "center",
          paddingLeft: 4,
          paddingRight: 12,
          gap: 8,
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: "0 8px" }}
        >
          <ArrowLeft size={20} color={NAVY} />
        </button>
        <span style={{ flex: 1, fontSize: 18, fontWeight: 700, color: NAVY }}>
          Dispute Management
        </span>
        <span
          style={{
            backgroundColor: ORANGE,
            color: "white",
            fontSize: 11,
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: 12,
            flexShrink: 0,
          }}
        >
          23 Open
        </span>
        <button
          type="button"
          style={{
            backgroundColor: "#F0EEF8",
            width: 32,
            height: 32,
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: "pointer",
          }}
        >
          <SlidersHorizontal size={20} color={NAVY} />
        </button>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "12px 16px",
          backgroundColor: "white",
          borderBottom: `1px solid ${BORDER}`,
          flexShrink: 0,
        }}
      >
        {[
          { emoji: "⚠️", num: 23, label: "Open" },
          { emoji: "🔄", num: 12, label: "Under Review" },
          { emoji: "✅", num: 8,  label: "Resolved" },
          { emoji: "🔴", num: 3,  label: "Escalated" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              flex: 1,
              borderRadius: 8,
              border: `1px solid ${BORDER}`,
              padding: "8px 6px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 14 }}>{stat.emoji}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginTop: 3 }}>{stat.num}</div>
            <div style={{ fontSize: 9, color: "#9B9B9B", marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filter + Sort row */}
      <div
        style={{
          padding: "10px 16px",
          backgroundColor: "white",
          borderBottom: `1px solid ${BORDER}`,
          flexShrink: 0,
        }}
      >
        {/* Filter chips */}
        <div
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {filterChips.map((chip) => {
            const key = chip.toLowerCase().replace(" ", "-");
            const isActive = activeFilter === key;
            return (
              <button
                key={chip}
                type="button"
                onClick={() => setActiveFilter(key)}
                style={{
                  height: 26,
                  borderRadius: 13,
                  padding: "0 12px",
                  fontSize: 11,
                  backgroundColor: isActive ? NAVY : "#F5F5F5",
                  color: isActive ? "white" : "#666666",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {chip}
              </button>
            );
          })}
        </div>

        {/* Sort chips */}
        <div style={{ marginTop: 8, display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#9B9B9B", marginRight: 6 }}>Sort:</span>
          <div style={{ display: "flex", gap: 6 }}>
            {sortChips.map((chip) => {
              const key = chip.toLowerCase();
              const isActive = activeSort === key;
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setActiveSort(key)}
                  style={{
                    height: 26,
                    borderRadius: 13,
                    padding: "0 12px",
                    fontSize: 11,
                    backgroundColor: isActive ? NAVY : "#F5F5F5",
                    color: isActive ? "white" : "#666666",
                    border: "none",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dispute list */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {disputes.map((dispute) => {
          const sc = statusConfig[dispute.status];
          const pc = priorityConfig[dispute.priority];
          return (
            <div
              key={dispute.id}
              style={{
                backgroundColor: "white",
                borderRadius: 10,
                border: `1px solid ${BORDER}`,
                padding: 14,
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              {/* Row 1 */}
              <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>
                ⚠️ #{dispute.id} · {dispute.title}
              </div>
              {/* Row 2 */}
              <div style={{ fontSize: 12, color: "#666666", marginTop: 4 }}>
                {dispute.service}
              </div>
              {/* Row 3 */}
              <div style={{ fontSize: 11, color: "#9B9B9B", marginTop: 3 }}>
                Category: {dispute.category}
              </div>

              {/* Divider */}
              <div style={{ marginTop: 10, marginBottom: 10, height: 1, backgroundColor: "#F0EDE8" }} />

              {/* Info row */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: pc.color }}>
                  Priority: {pc.label}
                </span>
                <span style={{ fontSize: 11, color: "#9B9B9B" }}>
                  🕐 {dispute.created}
                </span>
              </div>

              {/* Status row */}
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    borderRadius: 12,
                    padding: "3px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    backgroundColor: sc.bg,
                    color: sc.color,
                  }}
                >
                  {sc.label}
                </span>
              </div>

              {/* Action buttons */}
              <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
                <button
                  type="button"
                  onClick={onViewDetail}
                  style={{
                    flex: 1,
                    height: 32,
                    borderRadius: 6,
                    backgroundColor: "transparent",
                    border: `1px solid ${NAVY}`,
                    fontSize: 12,
                    fontWeight: 600,
                    color: NAVY,
                    cursor: "pointer",
                  }}
                >
                  View Details →
                </button>
                {dispute.status !== "resolved" && (
                  <button
                    type="button"
                    style={{
                      flex: 1,
                      height: 32,
                      borderRadius: 6,
                      backgroundColor: GREEN,
                      border: "none",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Resolve
                  </button>
                )}
                {dispute.status !== "escalated" && (
                  <button
                    type="button"
                    style={{
                      flex: 1,
                      height: 32,
                      borderRadius: 6,
                      backgroundColor: "#D32F2F",
                      border: "none",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Escalate
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
