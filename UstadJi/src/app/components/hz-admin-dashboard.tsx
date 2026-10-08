import { useState } from "react";
import { Bell, Home, User, Settings } from "lucide-react";

const NAVY = "#161533";
const GREEN = "#4CAF84";
const BG = "#FAF8F5";
const BORDER = "#E8E3DB";
const ORANGE = "#FF6B35";
const GOLD = "#FFC107";

type Tab = "dashboard" | "users" | "disputes" | "settings";

const bookingHeights = [40, 50, 60, 55, 70, 65, 80];
const revenueHeights = [30, 45, 55, 50, 70, 60, 75];
const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

const disputes = [
  {
    id: "#D-2401",
    title: "Ahmed vs Usman",
    service: "Plumbing Service",
    time: "2 hours ago",
    status: "Under Review",
    statusBg: "#FFF3E0",
    statusColor: ORANGE,
  },
  {
    id: "#D-2402",
    title: "Sana vs Ali",
    service: "AC Repair",
    time: "5 hours ago",
    status: "Resolved",
    statusBg: "#E8F5E9",
    statusColor: GREEN,
  },
  {
    id: "#D-2403",
    title: "Hassan vs Raza",
    service: "Electrical",
    time: "1 day ago",
    status: "Escalated",
    statusBg: "#FFEBEE",
    statusColor: "#D32F2F",
  },
];

const statCards = [
  { icon: "👥", value: "1,234", label: "Total Users", trend: "+12%", trendColor: GREEN },
  { icon: "📋", value: "456", label: "Bookings", trend: "+8%", trendColor: GREEN },
  { icon: "⚠️", value: "23", label: "Disputes", trend: "+2%", trendColor: ORANGE },
  { icon: "💰", value: "PKR 124K", label: "Revenue", trend: "+15%", trendColor: GREEN },
  { icon: "⏳", value: "12", label: "Pending Reviews", trend: "0", trendColor: "#9B9B9B" },
];

const healthCells = [
  { iconVal: "🟢 Online", label: "API Status", sub: "100% uptime" },
  { iconVal: "⏱️ 0.8s", label: "Avg Response", sub: "2ms spike" },
  { iconVal: "🟢 98%", label: "Server Load", sub: "Normal" },
  { iconVal: "⚠️ 1,234", label: "Active Users", sub: "+12% growth" },
];

function MiniBarChart({ heights, color }: { heights: number[]; color: string }) {
  const maxH = Math.max(...heights);
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "3px",
          height: "60px",
        }}
      >
        {heights.map((h, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              borderRadius: "2px 2px 0 0",
              backgroundColor: color,
              minHeight: "4px",
              height: `${(h / maxH) * 60}px`,
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", gap: "3px", marginTop: "4px" }}>
        {dayLabels.map((d, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              fontSize: "8px",
              color: "#9B9B9B",
              textAlign: "center",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}

export function HzAdminDashboard({
  onViewUsers,
  onViewDisputes,
  onViewAnalytics,
  onViewSettings,
  onViewMonitoring,
  onViewDisputeDetail,
}: {
  onViewUsers?: () => void;
  onViewDisputes?: () => void;
  onViewAnalytics?: () => void;
  onViewSettings?: () => void;
  onViewMonitoring?: () => void;
  onViewDisputeDetail?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [activeTimeChip, setActiveTimeChip] = useState<string>("Today");

  const timeChips = ["Today", "Week", "Month", "Year"];

  const navTabs: { key: Tab; label: string; icon: React.ReactNode; onClick?: () => void }[] = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: <Home size={20} />,
    },
    {
      key: "users",
      label: "Users",
      icon: <User size={20} />,
      onClick: onViewUsers,
    },
    {
      key: "disputes",
      label: "Disputes",
      icon: <span style={{ fontSize: "20px" }}>⚠️</span>,
      onClick: onViewDisputes,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <Settings size={20} />,
      onClick: onViewSettings,
    },
  ];

  return (
    <div
      style={{
        width: "390px",
        height: "844px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
        backgroundColor: BG,
      }}
    >
      {/* Status bar */}
      <div aria-hidden style={{ height: "24px", backgroundColor: "#FFFFFF", flexShrink: 0 }} />

      {/* Header */}
      <div
        style={{
          height: "64px",
          backgroundColor: "#FFFFFF",
          borderBottom: `1px solid #EFEFEF`,
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: NAVY,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "14px",
              fontFamily: "Inter, sans-serif",
              flexShrink: 0,
            }}
          >
            U
          </div>
          <span
            style={{
              fontSize: "17px",
              fontWeight: 600,
              color: NAVY,
              fontFamily: "Inter, sans-serif",
            }}
          >
            Ustaad G Admin
          </span>
          <span
            style={{
              backgroundColor: ORANGE,
              color: "#FFFFFF",
              fontSize: "10px",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "10px",
              marginLeft: "8px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Admin Panel
          </span>
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Bell */}
          <button
            type="button"
            style={{
              position: "relative",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              color: NAVY,
            }}
          >
            <Bell size={22} color={NAVY} />
            <span
              style={{
                position: "absolute",
                top: "0px",
                right: "0px",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "#D32F2F",
                color: "#FFFFFF",
                fontSize: "9px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Inter, sans-serif",
              }}
            >
              3
            </span>
          </button>

          {/* Avatar */}
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: NAVY,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontSize: "13px",
              fontWeight: 700,
              fontFamily: "Inter, sans-serif",
              flexShrink: 0,
            }}
          >
            SA
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          paddingBottom: "24px",
        }}
      >
        {/* A. Stats row */}
        <div style={{ marginTop: "16px" }}>
          <div
            style={{
              paddingLeft: "16px",
              paddingRight: "16px",
              fontSize: "11px",
              color: "#9B9B9B",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
            }}
          >
            Today's Overview
          </div>
          <div
            style={{
              marginTop: "8px",
              display: "flex",
              gap: "10px",
              overflowX: "auto",
              scrollbarWidth: "none",
              paddingLeft: "16px",
              paddingRight: "16px",
            }}
          >
            {statCards.map((card, i) => (
              <div
                key={i}
                style={{
                  width: "140px",
                  flexShrink: 0,
                  backgroundColor: "#FFFFFF",
                  borderRadius: "10px",
                  border: `1px solid ${BORDER}`,
                  padding: "14px",
                  boxSizing: "border-box",
                }}
              >
                <div style={{ fontSize: "20px" }}>{card.icon}</div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: NAVY,
                    marginTop: "6px",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {card.value}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "#9B9B9B",
                    marginTop: "2px",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {card.label}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: card.trendColor,
                    marginTop: "4px",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {card.trend}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* B. Quick Actions */}
        <div style={{ marginTop: "20px", paddingLeft: "16px", paddingRight: "16px" }}>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#1A1A1A",
              marginBottom: "10px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Quick Actions
          </div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              scrollbarWidth: "none",
            }}
          >
            {[
              { label: "👤 Manage Users", onClick: onViewUsers },
              { label: "📋 View Bookings", onClick: undefined },
              { label: "⚠️ Disputes", onClick: onViewDisputes },
              { label: "📊 Analytics", onClick: onViewAnalytics },
              { label: "⚙️ Settings", onClick: onViewSettings },
            ].map((action, i) => (
              <button
                key={i}
                type="button"
                onClick={action.onClick}
                style={{
                  height: "36px",
                  padding: "0 14px",
                  borderRadius: "18px",
                  backgroundColor: "#F0EEF8",
                  border: "none",
                  fontSize: "12px",
                  color: NAVY,
                  cursor: "pointer",
                  flexShrink: 0,
                  fontFamily: "Inter, sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* C. Recent Disputes */}
        <div style={{ marginTop: "24px", paddingLeft: "16px", paddingRight: "16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <span
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: NAVY,
                fontFamily: "Inter, sans-serif",
              }}
            >
              Recent Disputes
            </span>
            <button
              type="button"
              onClick={onViewDisputes}
              style={{
                fontSize: "13px",
                color: NAVY,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
              }}
            >
              View All →
            </button>
          </div>

          {disputes.map((d, i) => (
            <div
              key={i}
              style={{
                marginBottom: "10px",
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                border: `1px solid ${BORDER}`,
                padding: "14px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: NAVY,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                ⚠️ {d.id} · {d.title}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#666666",
                  marginTop: "3px",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {d.service} · {d.time}
              </div>
              <div
                style={{
                  marginTop: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    borderRadius: "12px",
                    padding: "3px 10px",
                    fontSize: "11px",
                    fontWeight: 700,
                    backgroundColor: d.statusBg,
                    color: d.statusColor,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {d.status}
                </span>
                <button
                  type="button"
                  onClick={onViewDisputeDetail}
                  style={{
                    fontSize: "12px",
                    color: NAVY,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  View Ticket →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* D. Platform Analytics */}
        <div style={{ marginTop: "24px", paddingLeft: "16px", paddingRight: "16px" }}>
          <div
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: NAVY,
              fontFamily: "Inter, sans-serif",
            }}
          >
            Platform Analytics
          </div>
          <div
            style={{
              display: "flex",
              gap: "6px",
              marginTop: "8px",
            }}
          >
            {timeChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setActiveTimeChip(chip)}
                style={{
                  height: "26px",
                  borderRadius: "13px",
                  padding: "0 12px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontFamily: "Inter, sans-serif",
                  backgroundColor: activeTimeChip === chip ? NAVY : "#F5F5F5",
                  color: activeTimeChip === chip ? "#FFFFFF" : "#666666",
                  fontWeight: activeTimeChip === chip ? 600 : 400,
                }}
              >
                {chip}
              </button>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginTop: "12px",
            }}
          >
            {/* Bookings chart */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                border: `1px solid ${BORDER}`,
                padding: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: NAVY,
                  marginBottom: "8px",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                📈 Bookings
              </div>
              <MiniBarChart heights={bookingHeights} color={NAVY} />
            </div>

            {/* Revenue chart */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                border: `1px solid ${BORDER}`,
                padding: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: NAVY,
                  marginBottom: "8px",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                💰 Revenue
              </div>
              <MiniBarChart heights={revenueHeights} color={GREEN} />
            </div>
          </div>
        </div>

        {/* E. Platform Health */}
        <div style={{ marginTop: "24px", paddingLeft: "16px", paddingRight: "16px" }}>
          <div
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: NAVY,
              marginBottom: "12px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Platform Health
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            {healthCells.map((cell, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "8px",
                  border: `1px solid ${BORDER}`,
                  padding: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: NAVY,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {cell.iconVal}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#1A1A1A",
                    marginTop: "4px",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {cell.label}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: "#9B9B9B",
                    marginTop: "2px",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {cell.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div
        style={{
          height: "64px",
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid #EFEFEF",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        {navTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => {
              setActiveTab(tab.key);
              tab.onClick?.();
            }}
            style={{
              flex: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: activeTab === tab.key ? NAVY : "#9B9B9B",
              fontFamily: "Inter, sans-serif",
            }}
          >
            <span
              style={{
                color: activeTab === tab.key ? NAVY : "#9B9B9B",
                display: "flex",
                alignItems: "center",
              }}
            >
              {tab.icon}
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: activeTab === tab.key ? 600 : 400,
                color: activeTab === tab.key ? NAVY : "#9B9B9B",
              }}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
