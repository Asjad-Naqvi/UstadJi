import React, { useState, useEffect } from "react";
import { ArrowLeft, Layers, Info, RefreshCw, X, Check } from "lucide-react";

const NAVY   = "#161533";
const GREEN  = "#4CAF84";
const BG     = "#FAF8F5";
const BORDER = "#E8E3DB";

const HEAT_COLORS = {
  "very-high": "#D32F2F",
  "high":      "#FF6B35",
  "medium":    "#FFB347",
  "low":       "#FFF3CD",
} as const;

type Intensity = keyof typeof HEAT_COLORS;

/* ─── Mock data ─── */
interface CustomerRequest {
  id: string;
  name: string;
  rating: number;
  requestsToday: number;
  service: string;
  location: string;
  distance: number;
  urgency: boolean;
  timeRequired: string;
}

interface DemandZone {
  id: string;
  name: string;
  intensity: Intensity;
  requestCount: number;
  providers: number;
  services: { type: string; count: number }[];
  customers: CustomerRequest[];
  top: string;
  left: string;
  size: number;
}

const CUSTOMERS_G13: CustomerRequest[] = [
  { id: "c1", name: "Ahmed Khan",   rating: 4.8, requestsToday: 5, service: "AC Repair",  location: "Street 5, G-13",  distance: 2.5, urgency: true,  timeRequired: "Within 1 hour"  },
  { id: "c2", name: "Sara Ahmed",   rating: 4.6, requestsToday: 2, service: "Plumbing",   location: "Street 12, G-13", distance: 1.2, urgency: false, timeRequired: "Within 3 hours" },
  { id: "c3", name: "Bilal Hassan", rating: 4.5, requestsToday: 1, service: "Electrical", location: "Street 8, G-13",  distance: 3.8, urgency: true,  timeRequired: "Within 2 hours" },
  { id: "c4", name: "Fatima Malik", rating: 4.9, requestsToday: 3, service: "Cleaning",   location: "Street 2, G-13",  distance: 0.9, urgency: false, timeRequired: "Flexible"       },
];

const DEMAND_ZONES: DemandZone[] = [
  {
    id: "g13", name: "G-13", intensity: "high",   requestCount: 12, providers: 5,
    top: "45%", left: "56%", size: 130,
    services: [{ type: "AC Repair", count: 4 }, { type: "Plumbing", count: 3 }, { type: "Electrical", count: 2 }, { type: "Cleaning", count: 2 }, { type: "Carpentry", count: 1 }],
    customers: CUSTOMERS_G13,
  },
  {
    id: "f10", name: "F-10", intensity: "medium", requestCount: 8,  providers: 3,
    top: "26%", left: "30%", size: 100,
    services: [{ type: "Electrical", count: 3 }, { type: "Cleaning", count: 2 }, { type: "Plumbing", count: 2 }, { type: "AC Repair", count: 1 }],
    customers: [],
  },
  {
    id: "i8",  name: "I-8",  intensity: "medium", requestCount: 5,  providers: 2,
    top: "67%", left: "20%", size: 84,
    services: [{ type: "Plumbing", count: 2 }, { type: "Cleaning", count: 2 }, { type: "Carpentry", count: 1 }],
    customers: [],
  },
  {
    id: "g10", name: "G-10", intensity: "low",    requestCount: 3,  providers: 1,
    top: "73%", left: "69%", size: 68,
    services: [{ type: "AC Repair", count: 2 }, { type: "Plumbing", count: 1 }],
    customers: [],
  },
];

const SERVICE_FILTERS = ["All Services", "AC Repair", "Plumbing", "Electrical", "Cleaning", "Carpentry"];

const LEGEND_ITEMS = [
  { color: "#D32F2F", label: "Very High", range: "20+ requests" },
  { color: "#FF6B35", label: "High",      range: "10–19 requests" },
  { color: "#FFB347", label: "Medium",    range: "5–9 requests"   },
  { color: "#FFF3CD", label: "Low",       range: "1–4 requests",  textDark: true },
];

const LAYER_OPTIONS = [
  { id: "heatmap",   label: "Heatmap",       defaultOn: true  },
  { id: "providers", label: "Providers",     defaultOn: true  },
  { id: "zones",     label: "Demand Zones",  defaultOn: true  },
  { id: "traffic",   label: "Traffic",       defaultOn: false },
] as const;

const MAP_BLOCKS = [
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
  { top: "74%", left: "8%",  w: "20%", h: "12%" },
  { top: "74%", left: "35%", w: "15%", h: "12%" },
  { top: "74%", left: "57%", w: "13%", h: "12%" },
  { top: "74%", left: "78%", w: "14%", h: "12%" },
];

/* ─── Customer request card ─── */
const CustomerCard: React.FC<{
  customer: CustomerRequest;
  isNew?: boolean;
  onAccept: () => void;
  compact?: boolean;
}> = ({ customer, isNew = true, onAccept, compact = false }) => (
  <div style={{
    backgroundColor: "#FFFFFF",
    borderRadius: "10px",
    borderTop:    "1px solid #E8E3DB",
    borderRight:  "1px solid #E8E3DB",
    borderBottom: "1px solid #E8E3DB",
    borderLeft:   isNew ? `4px solid ${NAVY}` : "1px solid #E8E3DB",
    padding: compact ? "10px 12px" : "14px",
    marginBottom: "8px",
  }}>
    {/* Header row */}
    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
      {/* Avatar */}
      <div style={{
        width: compact ? "32px" : "40px",
        height: compact ? "32px" : "40px",
        borderRadius: "50%",
        backgroundColor: "#E8E3DB",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: compact ? "13px" : "16px", fontWeight: 700, color: "#FFFFFF" }}>
          {customer.name[0]}
        </span>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "4px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 700, color: "#1A1A1A" }}>
            {customer.name}
          </span>
          <span style={{
            backgroundColor: "#EEEEF5", borderRadius: "10px", padding: "2px 8px",
            fontFamily: "Inter, sans-serif", fontSize: "10px", color: NAVY,
          }}>
            {customer.requestsToday} today
          </span>
        </div>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#666666" }}>
          ★ {customer.rating.toFixed(1)} · {customer.requestsToday} requests today
        </span>
      </div>
    </div>

    {/* Details */}
    <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "3px", paddingLeft: compact ? "0" : "0" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#1A1A1A" }}>
          {customer.service}
        </span>
        {customer.urgency && (
          <span style={{
            backgroundColor: "#FFE5D5", borderRadius: "6px", padding: "1px 8px",
            fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "#FF6B35",
          }}>
            ⚡ Emergency
          </span>
        )}
      </div>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#666666" }}>
        📍 {customer.location}
      </span>
      <div style={{ display: "flex", gap: "12px" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#666666" }}>
          🚶 {customer.distance} km away
        </span>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#666666" }}>
          ⏱ {customer.timeRequired}
        </span>
      </div>
    </div>

    {/* Actions */}
    <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
      <button
        type="button"
        onClick={onAccept}
        style={{
          flex: 1, height: "36px", borderRadius: "6px",
          backgroundColor: NAVY, border: "none",
          fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#FFFFFF",
          cursor: "pointer",
        }}
      >
        Accept Request
      </button>
      <button
        type="button"
        style={{
          flex: 1, height: "36px", borderRadius: "6px",
          backgroundColor: "transparent", border: `1px solid ${BORDER}`,
          fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 500, color: "#1A1A1A",
          cursor: "pointer",
        }}
      >
        View Details
      </button>
    </div>
  </div>
);

/* ─── Accept modal ─── */
const AcceptModal: React.FC<{
  customer: CustomerRequest;
  onConfirm: () => void;
  onClose: () => void;
}> = ({ customer, onConfirm, onClose }) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 30 }}
      />
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90%",
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        zIndex: 31,
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "18px", fontWeight: 700, color: NAVY }}>
            Accept Request
          </span>
          <button type="button" onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", lineHeight: 1 }}>
            <X size={20} color="#9B9B9B" />
          </button>
        </div>

        <div style={{ padding: "16px 20px 24px" }}>
          {/* Customer summary */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{
              width: "60px", height: "60px", borderRadius: "50%",
              backgroundColor: "#E8E3DB",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "24px", fontWeight: 700, color: "#FFFFFF" }}>
                {customer.name[0]}
              </span>
            </div>
            <div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 700, color: "#1A1A1A" }}>
                {customer.name}
              </div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#666666" }}>
                {customer.service}
              </div>
              {customer.urgency && (
                <span style={{
                  display: "inline-block", marginTop: "3px",
                  backgroundColor: "#FFE5D5", borderRadius: "6px", padding: "2px 8px",
                  fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "#FF6B35",
                }}>
                  ⚡ Emergency
                </span>
              )}
            </div>
          </div>

          {/* Details card */}
          <div style={{
            backgroundColor: BG, borderRadius: "10px",
            border: `1px solid ${BORDER}`, padding: "12px", marginBottom: "14px",
          }}>
            {[
              { label: "Distance",        value: `${customer.distance} km` },
              { label: "Est. travel",     value: `${Math.round(customer.distance * 5)} mins`   },
              { label: "Service time",    value: customer.timeRequired },
              { label: "Est. earnings",   value: "PKR 2,500", bold: true, color: GREEN },
            ].map(({ label, value, bold, color }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#666666" }}>{label}</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: bold ? 700 : 400, color: color ?? "#1A1A1A" }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Agreement */}
          <p style={{ margin: 0, marginBottom: "10px", fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#9B9B9B", lineHeight: "16px" }}>
            By accepting, you agree to travel to the customer's location and complete the service.
          </p>

          <button
            type="button"
            onClick={() => setAgreed(v => !v)}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: "16px",
            }}
          >
            <div style={{
              width: "18px", height: "18px", borderRadius: "4px",
              backgroundColor: agreed ? NAVY : "#FFFFFF",
              border: agreed ? "none" : `1.5px solid ${BORDER}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              {agreed && <Check size={12} color="#FFFFFF" />}
            </div>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#1A1A1A" }}>
              I understand and agree
            </span>
          </button>

          {/* Buttons */}
          <button
            type="button"
            onClick={() => { if (agreed) onConfirm(); }}
            style={{
              width: "100%", height: "48px", borderRadius: "8px",
              backgroundColor: agreed ? NAVY : "#D0CCC8",
              border: "none",
              fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 700, color: "#FFFFFF",
              cursor: agreed ? "pointer" : "not-allowed", marginBottom: "8px",
            }}
          >
            Accept & Navigate →
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: "100%", background: "none", border: "none",
              fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#9B9B9B",
              cursor: "pointer", padding: "6px",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

/* ─── Zone detail bottom sheet ─── */
const ZoneDetailSheet: React.FC<{
  zone: DemandZone;
  onClose: () => void;
  onViewAll: () => void;
  onAcceptCustomer: (c: CustomerRequest) => void;
}> = ({ zone, onClose, onViewAll, onAcceptCustomer }) => {
  const intensityLabel = {
    "very-high": "Very High Demand",
    "high":      "High Demand",
    "medium":    "Medium Demand",
    "low":       "Low Demand",
  }[zone.intensity];

  const badgeBg = {
    "very-high": "#D32F2F",
    "high":      "#FF6B35",
    "medium":    "#FFB347",
    "low":       "#856404",
  }[zone.intensity];

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.3)", zIndex: 20 }}
      />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        backgroundColor: "#FFFFFF",
        borderRadius: "16px 16px 0 0",
        zIndex: 21,
        maxHeight: "55%",
        display: "flex", flexDirection: "column",
      }}>
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "10px", paddingBottom: "2px" }}>
          <div style={{ width: "36px", height: "4px", borderRadius: "2px", backgroundColor: BORDER }} />
        </div>

        {/* Header */}
        <div style={{ padding: "10px 16px 8px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 700, color: NAVY }}>
                {zone.name}, Islamabad
              </span>
              <span style={{
                backgroundColor: badgeBg, borderRadius: "12px", padding: "3px 10px",
                fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, color: "#FFFFFF",
              }}>
                {intensityLabel}
              </span>
            </div>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#666666" }}>
              {zone.requestCount} customers need service
            </span>
          </div>
          <button type="button" onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", lineHeight: 1 }}>
            <X size={18} color="#9B9B9B" />
          </button>
        </div>

        {/* Customer cards */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 16px" }}>
          {zone.customers.slice(0, 2).map(c => (
            <CustomerCard key={c.id} customer={c} compact onAccept={() => onAcceptCustomer(c)} />
          ))}
          {zone.customers.length === 0 && (
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#9B9B9B", textAlign: "center", paddingTop: "16px" }}>
              No detailed customer info available for this zone.
            </p>
          )}
        </div>

        {/* View all button */}
        <div style={{ padding: "10px 16px 24px", borderTop: "1px solid #F5F5F5" }}>
          <button
            type="button"
            onClick={onViewAll}
            style={{
              width: "100%", height: "44px", borderRadius: "10px",
              backgroundColor: NAVY, border: "none",
              fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 700, color: "#FFFFFF",
              cursor: "pointer",
            }}
          >
            View All {zone.requestCount} Requests →
          </button>
        </div>
      </div>
    </>
  );
};

/* ─── Layer selector ─── */
const LayerSelector: React.FC<{
  layers: Record<string, boolean>;
  onToggle: (id: string) => void;
  onClose: () => void;
}> = ({ layers, onToggle, onClose }) => (
  <>
    <div onClick={onClose}
      style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 20 }} />
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      backgroundColor: "#FFFFFF",
      borderRadius: "16px 16px 0 0",
      zIndex: 21,
    }}>
      <div style={{ display: "flex", justifyContent: "center", paddingTop: "12px", paddingBottom: "4px" }}>
        <div style={{ width: "36px", height: "4px", borderRadius: "2px", backgroundColor: BORDER }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px 12px" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 700, color: NAVY }}>
          Map Layers
        </span>
        <button type="button" onClick={onClose}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", lineHeight: 1 }}>
          <X size={20} color="#9B9B9B" />
        </button>
      </div>
      <div style={{ padding: "0 16px" }}>
        {LAYER_OPTIONS.map(({ id, label }) => (
          <div key={id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", paddingBottom: "12px", borderBottom: "1px solid #F5F5F5" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#1A1A1A" }}>{label}</span>
            <button
              type="button"
              onClick={() => onToggle(id)}
              style={{
                width: "44px", height: "24px", borderRadius: "12px",
                backgroundColor: layers[id] ? NAVY : BORDER,
                border: "none", cursor: "pointer", position: "relative",
              }}
            >
              <div style={{
                position: "absolute", top: "2px",
                left: layers[id] ? "22px" : "2px",
                width: "20px", height: "20px",
                borderRadius: "50%", backgroundColor: "#FFFFFF",
                transition: "left 0.15s ease",
              }} />
            </button>
          </div>
        ))}
      </div>
      <div style={{ padding: "12px 16px 28px" }}>
        <button type="button" onClick={onClose}
          style={{
            width: "100%", height: "44px", borderRadius: "8px",
            backgroundColor: NAVY, border: "none",
            fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 700, color: "#FFFFFF",
            cursor: "pointer",
          }}>
          Apply
        </button>
      </div>
    </div>
  </>
);

/* ─── Legend panel ─── */
const LegendPanel: React.FC<{ visible: boolean; onToggle: () => void }> = ({ visible, onToggle }) => (
  <div style={{
    position: "absolute", bottom: "12px", left: "12px", zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    padding: "12px",
    maxWidth: "160px",
  }}>
    {visible && (
      <>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 700, color: NAVY, marginBottom: "8px" }}>
          Demand Level
        </div>
        {LEGEND_ITEMS.map(({ color, label, range, textDark }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
            <div style={{ width: "14px", height: "14px", borderRadius: "3px", backgroundColor: color, flexShrink: 0, border: textDark ? "1px solid #D0C070" : "none" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#1A1A1A", lineHeight: "13px" }}>{label}</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#9B9B9B", lineHeight: "12px" }}>{range}</div>
            </div>
          </div>
        ))}
      </>
    )}
    <button
      type="button"
      onClick={onToggle}
      style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: "3px" }}
    >
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#9B9B9B" }}>
        {visible ? "▼ Hide" : "▲ Show Legend"}
      </span>
    </button>
  </div>
);

/* ─── Props ─── */
interface HzHeatmapViewScreenProps {
  onBack?: () => void;
  onViewZoneDetail?: (zoneId: string) => void;
  onAcceptJob?: () => void;
}

/* ─── Main screen ─── */
export const HzHeatmapViewScreen: React.FC<HzHeatmapViewScreenProps> = ({
  onBack,
  onViewZoneDetail,
  onAcceptJob,
}) => {
  const [activeFilter,     setActiveFilter]     = useState("All Services");
  const [selectedZoneId,   setSelectedZoneId]   = useState<string | null>(null);
  const [showLayerSheet,   setShowLayerSheet]   = useState(false);
  const [showLegend,       setShowLegend]       = useState(true);
  const [acceptingCustomer, setAcceptingCustomer] = useState<CustomerRequest | null>(null);
  const [refreshing,       setRefreshing]       = useState(false);
  const [layers, setLayers] = useState<Record<string, boolean>>({
    heatmap: true, providers: true, zones: true, traffic: false,
  });

  const selectedZone = DEMAND_ZONES.find(z => z.id === selectedZoneId) ?? null;

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const toggleLayer = (id: string) => setLayers(prev => ({ ...prev, [id]: !prev[id] }));

  const totalRequests = DEMAND_ZONES.reduce((s, z) => s + z.requestCount, 0);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: BG, overflow: "hidden", position: "relative" }}>
      <style>{`
        @keyframes demandPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1);   opacity: 1; }
          50%       { transform: translate(-50%, -50%) scale(1.06); opacity: 0.85; }
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Status bar */}
      <div aria-hidden="true" style={{ height: "24px", flexShrink: 0, backgroundColor: "#FFFFFF" }} />

      {/* App bar */}
      <header style={{
        height: "56px", backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #EFEFEF",
        display: "flex", alignItems: "center",
        paddingLeft: "4px", paddingRight: "12px",
        flexShrink: 0,
      }}>
        <button type="button" onClick={onBack} aria-label="Go back"
          style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
          <ArrowLeft size={24} color="#1A1A1A" aria-hidden="true" />
        </button>

        <span style={{ flex: 1, fontFamily: "Inter, sans-serif", fontSize: "18px", fontWeight: 700, color: NAVY }}>
          Demand Map
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Live badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%",
              backgroundColor: GREEN,
              animation: "livePulse 1.5s ease-in-out infinite",
            }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 700, color: GREEN }}>
              Live
            </span>
          </div>

          {/* Refresh */}
          <button type="button" onClick={handleRefresh} aria-label="Refresh demand data"
            style={{
              width: "36px", height: "36px", borderRadius: "8px",
              backgroundColor: "#F5F5F5", border: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}>
            <RefreshCw size={16} color="#666666"
              style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }}
              aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Service filter chips */}
      <div style={{
        height: "48px", backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #F0EDE8",
        display: "flex", alignItems: "center",
        paddingLeft: "12px", gap: "6px",
        overflowX: "auto", overflowY: "hidden",
        scrollbarWidth: "none", flexShrink: 0,
      }}>
        {SERVICE_FILTERS.map(f => {
          const active = activeFilter === f;
          return (
            <button key={f} type="button" onClick={() => setActiveFilter(f)}
              style={{
                flexShrink: 0, height: "32px", padding: "0 16px",
                borderRadius: "16px",
                backgroundColor: active ? NAVY : "#F5F5F5",
                border: "none",
                fontFamily: "Inter, sans-serif", fontSize: "12px",
                color: active ? "#FFFFFF" : "#666666",
                cursor: "pointer",
              }}>
              {f}
            </button>
          );
        })}
        <span style={{ width: "8px", flexShrink: 0 }} />
      </div>

      {/* Map area */}
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
          { top: "50%",  left: 0, right: 0, height: "9px",  transform: "translateY(-50%)" },
          { left: "50%", top: 0, bottom: 0, width:  "9px",  transform: "translateX(-50%)" },
          { top: "29%",  left: 0, right: 0, height: "5px"  },
          { top: "72%",  left: 0, right: 0, height: "5px"  },
          { left: "28%", top: 0, bottom: 0, width:  "5px"  },
          { left: "70%", top: 0, bottom: 0, width:  "5px"  },
        ].map((r, i) => (
          <div key={i} style={{ position: "absolute", backgroundColor: "rgba(255,255,255,0.75)", ...r }} />
        ))}

        {/* Building blocks */}
        {MAP_BLOCKS.map((b, i) => (
          <div key={i} style={{ position: "absolute", top: b.top, left: b.left, width: b.w, height: b.h, backgroundColor: "#CAD4C4", borderRadius: "2px" }} />
        ))}

        {/* Heatmap zone blobs */}
        {layers.heatmap && DEMAND_ZONES.map(zone => (
          <div key={`blob-${zone.id}`} style={{
            position: "absolute",
            top: zone.top, left: zone.left,
            width: `${zone.size}px`, height: `${zone.size}px`,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${HEAT_COLORS[zone.intensity]}C0 0%, ${HEAT_COLORS[zone.intensity]}70 45%, ${HEAT_COLORS[zone.intensity]}28 70%, transparent 100%)`,
            filter: "blur(8px)",
            zIndex: 2,
            pointerEvents: "none",
            animation: zone.intensity === "high" || zone.intensity === "very-high"
              ? "demandPulse 2.5s ease-in-out infinite"
              : "none",
          }} />
        ))}

        {/* Zone labels */}
        {layers.zones && DEMAND_ZONES.map(zone => (
          <button
            key={`label-${zone.id}`}
            type="button"
            onClick={() => setSelectedZoneId(zone.id)}
            style={{
              position: "absolute",
              top: zone.top, left: zone.left,
              transform: `translate(-50%, -50%) translateY(${zone.size / 2 + 8}px)`,
              backgroundColor: `${NAVY}E0`,
              border: selectedZoneId === zone.id ? `2px solid ${HEAT_COLORS[zone.intensity]}` : "none",
              borderRadius: "8px",
              padding: "5px 10px",
              cursor: "pointer",
              zIndex: 4,
              display: "flex", flexDirection: "column", alignItems: "center",
            }}
          >
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 700, color: "#FFFFFF", whiteSpace: "nowrap" }}>
              {zone.name} {zone.intensity === "high" ? "🔥" : zone.intensity === "very-high" ? "🔥🔥" : ""}
            </span>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", color: "rgba(255,255,255,0.75)" }}>
              {zone.requestCount} requests
            </span>
          </button>
        ))}

        {/* Provider "You are here" dot */}
        {layers.providers && (
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)", zIndex: 5,
          }}>
            <div style={{
              width: "14px", height: "14px", borderRadius: "50%",
              backgroundColor: "#0066CC", border: "3px solid #FFFFFF",
              boxShadow: "0 0 0 6px rgba(0,102,204,0.18)",
            }} />
            <span style={{
              position: "absolute", top: "18px", left: "50%", transform: "translateX(-50%)",
              fontFamily: "Inter, sans-serif", fontSize: "9px", color: NAVY,
              whiteSpace: "nowrap",
              backgroundColor: "rgba(255,255,255,0.85)",
              padding: "2px 5px", borderRadius: "4px",
            }}>
              You are here
            </span>
          </div>
        )}

        {/* Layer toggle button (top right) */}
        <button
          type="button"
          onClick={() => setShowLayerSheet(true)}
          aria-label="Map layers"
          style={{
            position: "absolute", top: "12px", right: "12px",
            width: "40px", height: "40px", borderRadius: "8px",
            backgroundColor: "#FFFFFF", border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", zIndex: 6,
          }}>
          <Layers size={18} color={NAVY} aria-hidden="true" />
        </button>

        {/* Legend toggle button (bottom right) */}
        <button
          type="button"
          onClick={() => setShowLegend(v => !v)}
          aria-label="Toggle legend"
          style={{
            position: "absolute", bottom: "12px", right: "12px",
            width: "40px", height: "40px", borderRadius: "8px",
            backgroundColor: "#FFFFFF", border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", zIndex: 6,
          }}>
          <Info size={18} color={NAVY} aria-hidden="true" />
        </button>

        {/* Legend panel */}
        <LegendPanel visible={showLegend} onToggle={() => setShowLegend(v => !v)} />

        {/* Zone detail bottom sheet */}
        {selectedZone && !acceptingCustomer && (
          <ZoneDetailSheet
            zone={selectedZone}
            onClose={() => setSelectedZoneId(null)}
            onViewAll={() => { setSelectedZoneId(null); onViewZoneDetail?.(selectedZone.id); }}
            onAcceptCustomer={c => setAcceptingCustomer(c)}
          />
        )}

        {/* Layer selector */}
        {showLayerSheet && (
          <LayerSelector
            layers={layers}
            onToggle={toggleLayer}
            onClose={() => setShowLayerSheet(false)}
          />
        )}

        {/* Accept modal */}
        {acceptingCustomer && (
          <AcceptModal
            customer={acceptingCustomer}
            onConfirm={() => { setAcceptingCustomer(null); onAcceptJob?.(); }}
            onClose={() => setAcceptingCustomer(null)}
          />
        )}
      </div>

      {/* Stats bar */}
      <div style={{
        backgroundColor: "#FFFFFF", borderTop: "1px solid #F0EDE8",
        display: "flex", padding: "10px 12px", gap: "8px",
        flexShrink: 0,
      }}>
        {[
          { icon: "📊", value: totalRequests, label: "Total Requests", color: NAVY           },
          { icon: "🔥", value: DEMAND_ZONES.filter(z => z.intensity === "high" || z.intensity === "very-high").length,   label: "High Areas",    color: "#D32F2F" },
          { icon: "🟠", value: DEMAND_ZONES.filter(z => z.intensity === "medium").length, label: "Medium Areas",  color: "#FFB347" },
          { icon: "🟡", value: DEMAND_ZONES.filter(z => z.intensity === "low").length,    label: "Low Areas",     color: "#856404" },
        ].map(({ icon, value, label, color }) => (
          <div key={label} style={{
            flex: 1, backgroundColor: "#FFFFFF",
            border: `1px solid ${BORDER}`,
            borderRadius: "6px", padding: "6px 4px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
          }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 700, color }}>
              {value}
            </span>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#9B9B9B", textAlign: "center" }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
