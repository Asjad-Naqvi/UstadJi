import React, { useState } from "react";
import { ArrowLeft, X, Check } from "lucide-react";

const NAVY   = "#161533";
const GREEN  = "#4CAF84";
const BG     = "#FAF8F5";
const BORDER = "#E8E3DB";

/* ─── Mock data (same customer pool as heatmap view) ─── */
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
  isNew?: boolean;
}

const ALL_CUSTOMERS: CustomerRequest[] = [
  { id: "c1", name: "Ahmed Khan",   rating: 4.8, requestsToday: 5, service: "AC Repair",   location: "Street 5, G-13",  distance: 2.5, urgency: true,  timeRequired: "Within 1 hour",  isNew: true },
  { id: "c2", name: "Sara Ahmed",   rating: 4.6, requestsToday: 2, service: "Plumbing",    location: "Street 12, G-13", distance: 1.2, urgency: false, timeRequired: "Within 3 hours", isNew: true },
  { id: "c3", name: "Bilal Hassan", rating: 4.5, requestsToday: 1, service: "Electrical",  location: "Street 8, G-13",  distance: 3.8, urgency: true,  timeRequired: "Within 2 hours", isNew: false },
  { id: "c4", name: "Fatima Malik", rating: 4.9, requestsToday: 3, service: "Cleaning",    location: "Street 2, G-13",  distance: 0.9, urgency: false, timeRequired: "Flexible",       isNew: true },
  { id: "c5", name: "Zafar Iqbal",  rating: 4.3, requestsToday: 1, service: "Carpentry",   location: "Street 19, G-13", distance: 4.2, urgency: false, timeRequired: "Within 4 hours", isNew: false },
];

const ZONE_SERVICES = [
  { type: "AC Repair",   count: 4 },
  { type: "Plumbing",    count: 3 },
  { type: "Electrical",  count: 2 },
  { type: "Cleaning",    count: 2 },
  { type: "Carpentry",   count: 1 },
];

const QUICK_FILTERS = [
  { id: "all",       label: "All", count: 12     },
  { id: "emergency", label: "Emergency", count: 4 },
  { id: "nearby",    label: "Nearby", count: 5    },
  { id: "urgent",    label: "Urgent", count: 3    },
];

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
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
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

          {/* Details */}
          <div style={{ backgroundColor: BG, borderRadius: "10px", border: `1px solid ${BORDER}`, padding: "12px", marginBottom: "14px" }}>
            {[
              { label: "Distance",      value: `${customer.distance} km`                    },
              { label: "Est. travel",   value: `${Math.round(customer.distance * 5)} mins`  },
              { label: "Service time",  value: customer.timeRequired                        },
              { label: "Est. earnings", value: "PKR 2,500", bold: true, color: GREEN       },
            ].map(({ label, value, bold, color }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#666666" }}>{label}</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: bold ? 700 : 400, color: color ?? "#1A1A1A" }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          <p style={{ margin: 0, marginBottom: "10px", fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#9B9B9B", lineHeight: "16px" }}>
            By accepting, you agree to travel to the customer's location and complete the service.
          </p>

          <button
            type="button"
            onClick={() => setAgreed(v => !v)}
            style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: "16px" }}
          >
            <div style={{
              width: "18px", height: "18px", borderRadius: "4px",
              backgroundColor: agreed ? NAVY : "#FFFFFF",
              border: agreed ? "none" : `1.5px solid ${BORDER}`,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              {agreed && <Check size={12} color="#FFFFFF" />}
            </div>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#1A1A1A" }}>
              I understand and agree
            </span>
          </button>

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
            style={{ width: "100%", background: "none", border: "none", fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#9B9B9B", cursor: "pointer", padding: "6px" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

/* ─── Customer card ─── */
const CustomerCard: React.FC<{
  customer: CustomerRequest;
  onAccept: () => void;
  onViewProfile?: () => void;
}> = ({ customer, onAccept, onViewProfile }) => (
  <div style={{
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    borderTop:    "1px solid #E8E3DB",
    borderRight:  "1px solid #E8E3DB",
    borderBottom: "1px solid #E8E3DB",
    borderLeft:   customer.isNew ? `4px solid ${NAVY}` : "1px solid #E8E3DB",
    padding: "14px",
    marginBottom: "10px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  }}>
    {/* Header */}
    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px" }}>
      <div style={{
        width: "48px", height: "48px", borderRadius: "50%",
        backgroundColor: "#E8E3DB",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "18px", fontWeight: 700, color: "#FFFFFF" }}>
          {customer.name[0]}
        </span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 700, color: "#1A1A1A" }}>
            {customer.name}
          </span>
          {customer.urgency && (
            <span style={{
              backgroundColor: "#FFE5D5", borderRadius: "6px", padding: "2px 8px",
              fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "#FF6B35",
            }}>
              ⚡ Emergency
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 700, color: NAVY }}>
            {customer.rating.toFixed(1)} ★
          </span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#9B9B9B" }}>
            · {customer.requestsToday} requests today
          </span>
          <span style={{
            backgroundColor: "#EEEEF5", borderRadius: "10px", padding: "1px 7px",
            fontFamily: "Inter, sans-serif", fontSize: "10px", color: NAVY,
          }}>
            {customer.requestsToday}×
          </span>
        </div>
      </div>
    </div>

    {/* Divider */}
    <div style={{ height: "1px", backgroundColor: "#F0EDE8", marginBottom: "10px" }} />

    {/* Detail rows */}
    <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#9B9B9B" }}>Service</span>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#1A1A1A" }}>{customer.service}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#9B9B9B" }}>Location</span>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#1A1A1A" }}>{customer.location}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#9B9B9B" }}>Distance</span>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#1A1A1A" }}>{customer.distance} km from you</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#9B9B9B" }}>Time needed</span>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#1A1A1A" }}>{customer.timeRequired}</span>
      </div>
    </div>

    {/* Divider */}
    <div style={{ height: "1px", backgroundColor: "#F0EDE8", marginBottom: "10px" }} />

    {/* Buttons */}
    <div style={{ display: "flex", gap: "8px" }}>
      <button
        type="button"
        onClick={onAccept}
        style={{
          flex: 1, height: "38px", borderRadius: "6px",
          backgroundColor: NAVY, border: "none",
          fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#FFFFFF",
          cursor: "pointer",
        }}
      >
        Accept Request
      </button>
      <button
        type="button"
        onClick={onViewProfile}
        style={{
          flex: 1, height: "38px", borderRadius: "6px",
          backgroundColor: "transparent", border: `1px solid ${BORDER}`,
          fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 500, color: "#1A1A1A",
          cursor: "pointer",
        }}
      >
        View Profile
      </button>
    </div>
  </div>
);

/* ─── Empty state ─── */
const EmptyState: React.FC = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 24px", gap: "12px" }}>
    <div style={{ fontSize: "42px", lineHeight: 1 }}>👤</div>
    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#666666", textAlign: "center" }}>
      No customers currently requesting in this area
    </div>
    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9B9B9B", textAlign: "center" }}>
      Check nearby areas or come back later
    </div>
    <button
      type="button"
      style={{
        height: "40px", padding: "0 20px", borderRadius: "8px",
        backgroundColor: "transparent", border: `1px solid ${NAVY}`,
        fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 700, color: NAVY,
        cursor: "pointer", marginTop: "4px",
      }}
    >
      View Nearby Areas →
    </button>
  </div>
);

/* ─── Props ─── */
interface HzDemandZoneDetailScreenProps {
  onBack?: () => void;
  onAcceptJob?: () => void;
}

/* ─── Main screen ─── */
export const HzDemandZoneDetailScreen: React.FC<HzDemandZoneDetailScreenProps> = ({
  onBack,
  onAcceptJob,
}) => {
  const [activeFilter,      setActiveFilter]      = useState("all");
  const [acceptingCustomer, setAcceptingCustomer] = useState<CustomerRequest | null>(null);

  const filtered = ALL_CUSTOMERS.filter(c => {
    if (activeFilter === "emergency") return c.urgency;
    if (activeFilter === "nearby")    return c.distance <= 2.0;
    if (activeFilter === "urgent")    return c.urgency || c.timeRequired.includes("1 hour") || c.timeRequired.includes("2 hours");
    return true;
  });

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: BG, overflow: "hidden", position: "relative" }}>
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
        <span style={{ flex: 1, fontFamily: "Inter, sans-serif", fontSize: "18px", fontWeight: 700, color: NAVY, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          G-13, Islamabad
        </span>
        <span style={{
          backgroundColor: "#FF6B35", borderRadius: "12px", padding: "4px 12px",
          fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 700, color: "#FFFFFF",
          flexShrink: 0,
        }}>
          High Demand
        </span>
      </header>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "0 16px 28px" }}>
        {/* Zone summary card */}
        <div style={{
          marginTop: "16px",
          backgroundColor: BG, borderRadius: "8px",
          border: `1px solid ${BORDER}`, padding: "16px",
        }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 700, color: NAVY, marginBottom: "4px" }}>
            🔥 12 active requests
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#666666", marginBottom: "3px" }}>
            5 providers currently in this area
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#9B9B9B", marginBottom: "12px" }}>
            Last updated: 2 min ago
          </div>
          {/* Demand intensity bar */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#9B9B9B" }}>Demand Intensity</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 700, color: "#FF6B35" }}>High (78%)</span>
            </div>
            <div style={{ height: "6px", backgroundColor: "#F0EDE8", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ width: "78%", height: "100%", background: "linear-gradient(90deg, #FFB347, #FF6B35)", borderRadius: "3px" }} />
            </div>
          </div>
        </div>

        {/* Service breakdown */}
        <div style={{ marginTop: "12px" }}>
          <div style={{ display: "flex", gap: "6px", overflowX: "auto", scrollbarWidth: "none", paddingBottom: "2px" }}>
            {ZONE_SERVICES.map(({ type, count }) => (
              <div key={type} style={{
                flexShrink: 0,
                backgroundColor: "#FFFFFF", border: `1px solid ${BORDER}`,
                borderRadius: "16px", padding: "6px 12px",
                display: "flex", alignItems: "center", gap: "5px",
              }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#1A1A1A" }}>{type}</span>
                <span style={{
                  backgroundColor: "#EEEEF5", borderRadius: "8px", padding: "1px 6px",
                  fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 700, color: NAVY,
                }}>
                  {count}
                </span>
              </div>
            ))}
            <span style={{ width: "4px", flexShrink: 0 }} />
          </div>
        </div>

        {/* Quick filters */}
        <div style={{ marginTop: "16px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {QUICK_FILTERS.map(({ id, label, count }) => {
            const active = activeFilter === id;
            return (
              <button key={id} type="button" onClick={() => setActiveFilter(id)}
                style={{
                  height: "28px", padding: "0 12px",
                  borderRadius: "14px",
                  backgroundColor: active ? NAVY : "#F5F5F5",
                  border: "none",
                  fontFamily: "Inter, sans-serif", fontSize: "12px",
                  color: active ? "#FFFFFF" : "#666666",
                  cursor: "pointer",
                }}>
                {label}: {count}
              </button>
            );
          })}
        </div>

        {/* Customer list */}
        <div style={{ marginTop: "14px" }}>
          {filtered.length > 0 ? (
            filtered.map(c => (
              <CustomerCard
                key={c.id}
                customer={c}
                onAccept={() => setAcceptingCustomer(c)}
                onViewProfile={() => {}}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      {/* Accept modal */}
      {acceptingCustomer && (
        <AcceptModal
          customer={acceptingCustomer}
          onConfirm={() => { setAcceptingCustomer(null); onAcceptJob?.(); }}
          onClose={() => setAcceptingCustomer(null)}
        />
      )}
    </div>
  );
};
