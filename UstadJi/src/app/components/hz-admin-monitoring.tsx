import React, { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";

const NAVY = "#161533";
const GREEN = "#4CAF84";
const BG = "#FAF8F5";
const BORDER = "#E8E3DB";

const ALERTS = [
  {
    id: "a1",
    severity: "critical",
    title: "High CPU Usage Detected",
    desc: "Server CPU usage at 92%. Auto-scaling triggered.",
    time: "5 min ago",
    icon: "🔴",
    color: "#D32F2F",
    bg: "#FFEBEE",
  },
  {
    id: "a2",
    severity: "warning",
    title: "Suspicious Login Activity",
    desc: "25 failed login attempts from IP 192.168.1.45. Account temporarily blocked.",
    time: "15 min ago",
    icon: "🟡",
    color: "#FF6B35",
    bg: "#FFF3E0",
  },
  {
    id: "a3",
    severity: "info",
    title: "New Provider Registration",
    desc: "Usman Tariq (AC Technician) pending verification review.",
    time: "45 min ago",
    icon: "🔵",
    color: "#0066CC",
    bg: "#E3F2FD",
  },
  {
    id: "a4",
    severity: "info",
    title: "Daily Backup Completed",
    desc: "Database backup successful. 2.4GB backed up to cloud storage.",
    time: "1 hour ago",
    icon: "🔵",
    color: "#0066CC",
    bg: "#E3F2FD",
  },
  {
    id: "a5",
    severity: "warning",
    title: "High Dispute Volume",
    desc: "Disputes up 15% this week (23 open). Review recommended.",
    time: "2 hours ago",
    icon: "🟡",
    color: "#FF6B35",
    bg: "#FFF3E0",
  },
  {
    id: "a6",
    severity: "critical",
    title: "Payment Gateway Timeout",
    desc: "Stripe API response time exceeded 5s. 3 transactions may be affected.",
    time: "3 hours ago",
    icon: "🔴",
    color: "#D32F2F",
    bg: "#FFEBEE",
  },
];

const HEALTH_ITEMS = [
  { icon: "🟢", name: "API", stat: "100% uptime", sub: "0.8s avg response" },
  { icon: "💾", name: "Database", stat: "98% health", sub: "1.2s query time" },
  { icon: "⚡", name: "Server", stat: "45% load", sub: "2 active instances" },
  { icon: "📡", name: "Cache", stat: "85% hit rate", sub: "Redis 6.2" },
];

const FILTER_OPTIONS = ["all", "critical", "warning", "info", "resolved"] as const;

export function HzAdminMonitoringScreen({ onBack }: { onBack?: () => void }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set());

  const visibleAlerts = ALERTS.filter((a) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "resolved") return acknowledged.has(a.id);
    return a.severity === activeFilter;
  });

  const handleAcknowledge = (id: string) => {
    setAcknowledged((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleMarkAllRead = () => {
    setAcknowledged(new Set(ALERTS.map((a) => a.id)));
  };

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
      <div
        style={{
          height: 24,
          backgroundColor: "white",
          flexShrink: 0,
        }}
      />

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
          flexShrink: 0,
          gap: 8,
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 8px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ArrowLeft size={24} color="#1A1A1A" />
        </button>
        <span
          style={{
            flex: 1,
            fontSize: 17,
            fontWeight: 700,
            color: NAVY,
          }}
        >
          Monitoring Alerts
        </span>
        <span
          style={{
            backgroundColor: "#D32F2F",
            color: "white",
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 9px",
            borderRadius: 10,
            flexShrink: 0,
          }}
        >
          3 New
        </span>
        <button
          type="button"
          onClick={handleMarkAllRead}
          style={{
            background: "none",
            border: "none",
            fontSize: 12,
            color: NAVY,
            cursor: "pointer",
            marginLeft: 4,
          }}
        >
          Mark All Read
        </button>
      </div>

      {/* Filter chips */}
      <div
        style={{
          padding: "10px 16px",
          backgroundColor: "white",
          borderBottom: `1px solid ${BORDER}`,
          display: "flex",
          gap: 6,
          overflowX: "auto",
          scrollbarWidth: "none",
          flexShrink: 0,
        }}
      >
        {FILTER_OPTIONS.map((f) => {
          const isActive = activeFilter === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              style={{
                height: 26,
                borderRadius: 13,
                padding: "0 12px",
                fontSize: 11,
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                flexShrink: 0,
                backgroundColor: isActive ? NAVY : "#F5F5F5",
                color: isActive ? "white" : "#666666",
                textTransform: "capitalize",
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Alert count */}
      <div
        style={{
          padding: "8px 16px",
          backgroundColor: "white",
          borderBottom: `1px solid ${BORDER}`,
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 11, color: "#9B9B9B" }}>
          {visibleAlerts.length} alerts
        </span>
      </div>

      {/* Alert list + System Health (scrollable) */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Alert list */}
        <div
          style={{
            padding: "12px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {visibleAlerts.map((alert) => {
            const isAcknowledged = acknowledged.has(alert.id);
            return (
              <div
                key={alert.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: 10,
                  border: `1px solid ${BORDER}`,
                  overflow: "hidden",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  opacity: isAcknowledged ? 0.65 : 1,
                }}
              >
                {/* Top color strip */}
                <div style={{ height: 3, backgroundColor: alert.color }} />

                {/* Card body */}
                <div style={{ padding: 14 }}>
                  {/* Row 1: meta */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ fontSize: 16, marginRight: 6 }}>
                        {alert.icon}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 10,
                          backgroundColor: alert.bg,
                          color: alert.color,
                          textTransform: "capitalize",
                        }}
                      >
                        {alert.severity}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          color: "#9B9B9B",
                          marginLeft: 8,
                        }}
                      >
                        {alert.time}
                      </span>
                    </div>
                    {isAcknowledged && (
                      <span style={{ fontSize: 10, color: GREEN }}>
                        ✓ Acknowledged
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#1A1A1A",
                      marginBottom: 4,
                    }}
                  >
                    {alert.title}
                  </div>

                  {/* Description */}
                  <div
                    style={{
                      fontSize: 12,
                      color: "#666666",
                      lineHeight: "17px",
                      marginBottom: 10,
                    }}
                  >
                    {alert.desc}
                  </div>

                  {/* Divider */}
                  <div
                    style={{
                      height: 1,
                      backgroundColor: "#F5F5F5",
                      marginBottom: 10,
                    }}
                  />

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      style={{
                        flex: 1,
                        height: 30,
                        borderRadius: 6,
                        backgroundColor: "transparent",
                        border: `1px solid ${BORDER}`,
                        fontSize: 11,
                        color: NAVY,
                        cursor: "pointer",
                      }}
                    >
                      View Details →
                    </button>
                    {!isAcknowledged ? (
                      <button
                        type="button"
                        onClick={() => handleAcknowledge(alert.id)}
                        style={{
                          flex: 1,
                          height: 30,
                          borderRadius: 6,
                          backgroundColor: NAVY,
                          color: "white",
                          fontSize: 11,
                          fontWeight: 600,
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Acknowledge
                      </button>
                    ) : (
                      <button
                        type="button"
                        style={{
                          flex: 1,
                          height: 30,
                          borderRadius: 6,
                          backgroundColor: "#E8F5E9",
                          color: GREEN,
                          fontSize: 11,
                          fontWeight: 600,
                          border: "none",
                        }}
                      >
                        ✓ Done
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* System Health */}
        <div style={{ padding: "0 16px 24px" }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: NAVY,
              marginBottom: 10,
              marginTop: 4,
            }}
          >
            System Health
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {HEALTH_ITEMS.map((item) => (
              <div
                key={item.name}
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  border: `1px solid ${BORDER}`,
                  padding: "12px 10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#1A1A1A",
                    }}
                  >
                    {item.name}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: NAVY,
                    marginTop: 6,
                  }}
                >
                  {item.stat}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#9B9B9B",
                    marginTop: 2,
                  }}
                >
                  {item.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
