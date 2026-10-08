import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

const NAVY = "#161533";
const GREEN = "#4CAF84";
const BG = "#FAF8F5";
const BORDER = "#E8E3DB";
const ORANGE = "#FF6B35";
const GOLD = "#FFC107";

type Period = "week" | "month" | "quarter" | "year";

const PERIOD_TABS: { label: string; key: Period }[] = [
  { label: "Today", key: "week" },
  { label: "This Week", key: "week" },
  { label: "This Month", key: "month" },
  { label: "This Quarter", key: "quarter" },
  { label: "This Year", key: "year" },
];

const METRICS = [
  { value: "1,234",    label: "Users",       trend: "+12%",  trendColor: GREEN      },
  { value: "PKR 124K", label: "Revenue",     trend: "+15%",  trendColor: GREEN      },
  { value: "98%",      label: "Satisfact.",  trend: "+2%",   trendColor: GREEN      },
  { value: "456",      label: "Bookings",    trend: "+8%",   trendColor: GREEN      },
  { value: "23",       label: "Disputes",    trend: "+2%",   trendColor: ORANGE     },
  { value: "12",       label: "New Today",   trend: "today", trendColor: "#9B9B9B"  },
];

const MONTHS = ["J", "F", "M", "A", "M", "J"];

const CATEGORIES = [
  { label: "Plumbing",   pct: 45, color: "#0066CC" },
  { label: "Electrical", pct: 30, color: NAVY       },
  { label: "AC Repair",  pct: 15, color: GREEN      },
  { label: "Cleaning",   pct: 10, color: ORANGE     },
  { label: "Carpentry",  pct: 5,  color: "#9B4DCA"  },
];

const PROVIDERS = [
  { name: "Usman Tariq", rating: 4.9, jobs: 456 },
  { name: "Ali Hassan",  rating: 4.8, jobs: 302 },
  { name: "Ahmed Khan",  rating: 4.7, jobs: 187 },
  { name: "Sana Malik",  rating: 4.6, jobs: 143 },
  { name: "Raza Ali",    rating: 4.5, jobs: 98  },
];

const DISPUTE_VALS = [4, 6, 5, 3];
const DISPUTE_MAX = 8;
const DISPUTE_HEIGHT = 60;

interface LineChartProps {
  data: number[];
  stroke: string;
  fill: string;
  dotFill: string;
}

function LineChart({ data, stroke, fill, dotFill }: LineChartProps) {
  const chartWidth = 320;
  const chartHeight = 80;
  const maxVal = 100;
  const count = data.length;

  const xPositions = data.map((_, i) =>
    count === 1 ? chartWidth / 2 : (i / (count - 1)) * chartWidth
  );
  const yPositions = data.map((v) => chartHeight - (v / maxVal) * chartHeight);

  const polylinePoints = xPositions
    .map((x, i) => `${x},${yPositions[i]}`)
    .join(" ");

  const areaPoints =
    `${xPositions[0]},${chartHeight} ` +
    xPositions.map((x, i) => `${x},${yPositions[i]}`).join(" ") +
    ` ${xPositions[xPositions.length - 1]},${chartHeight}`;

  return (
    <div style={{ position: "relative", height: chartHeight, marginBottom: 8 }}>
      {[0, 33, 66].map((pct, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: "#F5F5F5",
            bottom: `${pct}%`,
          }}
        />
      ))}
      <svg
        width="100%"
        height={`${chartHeight}px`}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        preserveAspectRatio="none"
        style={{ overflow: "visible", display: "block" }}
      >
        <polygon points={areaPoints} fill={fill} />
        <polyline
          points={polylinePoints}
          fill="none"
          stroke={stroke}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {xPositions.map((cx, i) => (
          <circle key={i} cx={cx} cy={yPositions[i]} r={3} fill={dotFill} />
        ))}
      </svg>
    </div>
  );
}

export function HzAdminAnalyticsScreen({ onBack }: { onBack?: () => void }) {
  const [activePeriod, setActivePeriod] = useState<Period>("month");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        backgroundColor: BG,
        overflow: "hidden",
        flex: 1,
        width: 390,
        height: 844,
        fontFamily: "Inter, sans-serif",
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
          paddingRight: 16,
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
            padding: 8,
            display: "flex",
            alignItems: "center",
          }}
        >
          <ArrowLeft size={24} color="#1A1A1A" />
        </button>
        <span style={{ fontSize: 18, fontWeight: 700, color: NAVY, flex: 1 }}>
          Analytics
        </span>
        <button
          type="button"
          style={{
            height: 32,
            padding: "0 12px",
            borderRadius: 6,
            backgroundColor: "#F0EEF8",
            border: "none",
            fontSize: 13,
            color: NAVY,
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Jan 2026 ▼
        </button>
      </div>

      {/* Period tabs */}
      <div
        style={{
          padding: "0 16px",
          height: 44,
          backgroundColor: "white",
          borderBottom: `1px solid ${BORDER}`,
          display: "flex",
          gap: 6,
          alignItems: "center",
          overflowX: "auto",
          scrollbarWidth: "none",
          flexShrink: 0,
        }}
      >
        {PERIOD_TABS.map((tab, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActivePeriod(tab.key)}
            style={{
              height: 28,
              padding: "0 14px",
              borderRadius: 14,
              fontSize: 12,
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              flexShrink: 0,
              fontFamily: "Inter, sans-serif",
              backgroundColor:
                activePeriod === tab.key ? NAVY : "transparent",
              color: activePeriod === tab.key ? "white" : NAVY,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 16px 32px",
        }}
      >
        {/* Key Metrics Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
            marginBottom: 20,
          }}
        >
          {METRICS.map((m, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "white",
                borderRadius: 8,
                border: `1px solid ${BORDER}`,
                padding: "10px 8px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>
                {m.value}
              </div>
              <div style={{ fontSize: 9, color: "#9B9B9B", marginTop: 2 }}>
                {m.label}
              </div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  color: m.trendColor,
                  marginTop: 3,
                }}
              >
                {m.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Overview */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            border: `1px solid ${BORDER}`,
            padding: "14px 14px 10px",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: NAVY,
              marginBottom: 12,
            }}
          >
            💰 Revenue Overview
          </div>
          <LineChart
            data={[60, 45, 80, 70, 100, 90]}
            stroke="#0066CC"
            fill="rgba(0,102,204,0.1)"
            dotFill="#0066CC"
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 4,
            }}
          >
            {MONTHS.map((m, i) => (
              <span key={i} style={{ fontSize: 9, color: "#9B9B9B" }}>
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* User Growth */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            border: `1px solid ${BORDER}`,
            padding: "14px 14px 10px",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: NAVY,
              marginBottom: 12,
            }}
          >
            👥 User Growth
          </div>
          <LineChart
            data={[40, 55, 65, 50, 80, 75]}
            stroke={GREEN}
            fill="rgba(76,175,132,0.1)"
            dotFill={GREEN}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 4,
            }}
          >
            {MONTHS.map((m, i) => (
              <span key={i} style={{ fontSize: 9, color: "#9B9B9B" }}>
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Service Category Distribution */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            border: `1px solid ${BORDER}`,
            padding: "14px 14px 12px",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: NAVY,
              marginBottom: 12,
            }}
          >
            🔧 Service Categories
          </div>
          {CATEGORIES.map((cat, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 3,
                }}
              >
                <span style={{ fontSize: 11, color: "#1A1A1A" }}>
                  {cat.label}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: cat.color,
                  }}
                >
                  {cat.pct}%
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "#F0EDE8",
                }}
              >
                <div
                  style={{
                    width: `${cat.pct}%`,
                    height: "100%",
                    borderRadius: 3,
                    backgroundColor: cat.color,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Top Providers */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            border: `1px solid ${BORDER}`,
            padding: "14px 14px 12px",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: NAVY,
              marginBottom: 12,
            }}
          >
            ⭐ Top Providers
          </div>
          {PROVIDERS.map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: "#F0EEF8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: NAVY,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <span
                style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}
              >
                {p.name}
              </span>
              <div
                style={{
                  width: 60,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: "#F0EDE8",
                }}
              >
                <div
                  style={{
                    width: `${(p.rating / 5) * 100}%`,
                    height: "100%",
                    borderRadius: 2,
                    backgroundColor: GOLD,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#1A1A1A",
                  marginLeft: 6,
                  minWidth: 28,
                }}
              >
                {p.rating} ★
              </span>
            </div>
          ))}
        </div>

        {/* Disputes Trend */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            border: `1px solid ${BORDER}`,
            padding: "14px 14px 10px",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: NAVY,
              marginBottom: 12,
            }}
          >
            ⚠️ Disputes Trend
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
              height: DISPUTE_HEIGHT,
              marginBottom: 4,
            }}
          >
            {DISPUTE_VALS.map((val, i) => {
              const barH = Math.max((val / DISPUTE_MAX) * DISPUTE_HEIGHT, 4);
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: ORANGE,
                      textAlign: "center",
                      marginBottom: 2,
                    }}
                  >
                    {val}
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: barH,
                      borderRadius: "2px 2px 0 0",
                      backgroundColor: ORANGE,
                      minHeight: 4,
                      position: "relative",
                    }}
                  />
                </div>
              );
            })}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            {["W1", "W2", "W3", "W4"].map((w, i) => (
              <span key={i} style={{ fontSize: 9, color: "#9B9B9B" }}>
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
