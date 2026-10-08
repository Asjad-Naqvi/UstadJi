import React, { useState } from "react";
import { ArrowLeft, ChevronRight, FileText, Plus } from "lucide-react";
import { type InvoiceStatus } from "./hz-invoice-card";

const NAVY = "#161533";
const BORDER = "#E8E3DB";

/* ─── Types ─── */
type FilterId = "all" | "draft" | "sent" | "paid" | "overdue";

interface InvoiceListItem {
  id: string;
  number: string;
  date: string;
  customer: string;
  service: string;
  amount: number;
  status: InvoiceStatus;
}

/* ─── Status config ─── */
const STATUS_CFG: Record<InvoiceStatus, { label: string; bg: string; color: string }> = {
  draft:   { label: "Draft",   bg: "#F5F5F5", color: "#9B9B9B" },
  sent:    { label: "Sent",    bg: "#EEF5FF", color: "#0066CC" },
  paid:    { label: "Paid",    bg: "#E8F5E9", color: "#4CAF84" },
  overdue: { label: "Overdue", bg: "#FFEBEE", color: "#FF0000" },
};

/* ─── Mock data ─── */
const INVOICES: InvoiceListItem[] = [
  { id: "1", number: "INV-2026-001", date: "2026-08-06", customer: "Ahmed Khan",   service: "AC Repair",    amount: 5535,  status: "paid"    },
  { id: "2", number: "INV-2026-002", date: "2026-07-30", customer: "Sana Malik",   service: "AC Service",   amount: 3200,  status: "sent"    },
  { id: "3", number: "INV-2026-003", date: "2026-07-22", customer: "Ali Raza",     service: "AC Install",   amount: 12000, status: "overdue" },
  { id: "4", number: "INV-2026-004", date: "2026-07-15", customer: "Faiza Noor",   service: "AC Repair",    amount: 2800,  status: "draft"   },
  { id: "5", number: "INV-2026-005", date: "2026-07-10", customer: "Umar Farooq",  service: "AC Top-up",    amount: 1500,  status: "paid"    },
  { id: "6", number: "INV-2026-006", date: "2026-07-02", customer: "Hina Shahid",  service: "AC Service",   amount: 2200,  status: "paid"    },
];

/* ─── Stat card ─── */
const StatCard: React.FC<{
  value: string;
  label: string;
  color?: string;
}> = ({ value, label, color = NAVY }) => (
  <div
    style={{
      flexShrink: 0,
      width: "100px",
      backgroundColor: "#FFFFFF",
      borderRadius: "8px",
      border: `1px solid ${BORDER}`,
      padding: "12px",
      boxSizing: "border-box",
    }}
  >
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "14px",
        fontWeight: 700,
        color,
        lineHeight: "20px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {value}
    </div>
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "10px",
        color: "#9B9B9B",
        marginTop: "2px",
      }}
    >
      {label}
    </div>
  </div>
);

/* ─── Props ─── */
interface HzInvoiceHistoryProps {
  onBack?: () => void;
  onViewInvoice?: () => void;
  onNewInvoice?: () => void;
}

/* ─── Main screen ─── */
export const HzInvoiceHistory: React.FC<HzInvoiceHistoryProps> = ({
  onBack,
  onViewInvoice,
  onNewInvoice,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");

  const FILTERS: { id: FilterId; label: string }[] = [
    { id: "all",     label: "All"     },
    { id: "draft",   label: "Draft"   },
    { id: "sent",    label: "Sent"    },
    { id: "paid",    label: "Paid"    },
    { id: "overdue", label: "Overdue" },
  ];

  const filtered = activeFilter === "all"
    ? INVOICES
    : INVOICES.filter((inv) => inv.status === activeFilter);

  const totalRevenue = INVOICES.filter((i) => i.status === "paid")
    .reduce((s, i) => s + i.amount, 0);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FAF8F5",
        overflow: "hidden",
      }}
    >
      {/* Status bar */}
      <div aria-hidden="true" style={{ height: "24px", flexShrink: 0, backgroundColor: "#FFFFFF" }} />

      {/* Header */}
      <header
        style={{
          height: "60px",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #EFEFEF",
          display: "flex",
          alignItems: "center",
          paddingLeft: "4px",
          paddingRight: "16px",
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
          }}
        >
          <ArrowLeft size={22} color="#1A1A1A" />
        </button>

        <span
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
            fontSize: "18px",
            fontWeight: 700,
            color: NAVY,
            pointerEvents: "none",
          }}
        >
          Invoices
        </span>

        <button
          type="button"
          onClick={onNewInvoice}
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            background: "none",
            border: "none",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 700,
            color: NAVY,
            cursor: "pointer",
          }}
        >
          <Plus size={16} color={NAVY} />
          New
        </button>
      </header>

      {/* Filter chips */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          paddingLeft: "16px",
          paddingRight: "16px",
          paddingTop: "10px",
          paddingBottom: "10px",
          overflowX: "auto",
          flexShrink: 0,
          scrollbarWidth: "none",
          backgroundColor: "#FFFFFF",
          borderBottom: `1px solid #F0F0F0`,
        }}
      >
        {FILTERS.map(({ id, label }) => {
          const isActive = activeFilter === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveFilter(id)}
              style={{
                flexShrink: 0,
                height: "30px",
                paddingLeft: "14px",
                paddingRight: "14px",
                borderRadius: "15px",
                backgroundColor: isActive ? NAVY : "#F5F5F5",
                border: "none",
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                color: isActive ? "#FFFFFF" : "#666666",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Scrollable body */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          paddingBottom: "24px",
        }}
      >
        {/* Stats strip */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            overflowX: "auto",
            scrollbarWidth: "none",
            padding: "12px 16px",
          }}
        >
          <StatCard value="47"                              label="Total Invoices" />
          <StatCard value={`PKR ${(totalRevenue / 1000).toFixed(0)}K`} label="Revenue" />
          <StatCard value="12"                              label="Sent" />
          <StatCard value="3"                               label="Pending"  color="#FF6B35" />
          <StatCard value="32"                              label="Paid"     color="#4CAF84" />
        </div>

        {/* Invoice list */}
        <div
          style={{
            paddingLeft: "16px",
            paddingRight: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "0px",
          }}
        >
          {filtered.length === 0 ? (
            /* Empty state */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "48px",
                paddingBottom: "48px",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "20px",
                  backgroundColor: "#EEEEF5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FileText size={32} color={NAVY} />
              </div>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: NAVY,
                }}
              >
                No invoices yet
              </div>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  color: "#9B9B9B",
                }}
              >
                Generate your first invoice
              </div>
              <button
                type="button"
                onClick={onNewInvoice}
                style={{
                  height: "44px",
                  paddingLeft: "24px",
                  paddingRight: "24px",
                  borderRadius: "8px",
                  backgroundColor: NAVY,
                  border: "none",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  cursor: "pointer",
                  marginTop: "4px",
                }}
              >
                Create Invoice
              </button>
            </div>
          ) : (
            filtered.map((inv, i) => {
              const cfg = STATUS_CFG[inv.status];
              const isLast = i === filtered.length - 1;
              return (
                <button
                  key={inv.id}
                  type="button"
                  onClick={onViewInvoice}
                  style={{
                    width: "100%",
                    backgroundColor: "#FFFFFF",
                    borderRadius: i === 0 ? "10px 10px 0 0" : isLast ? "0 0 10px 10px" : "0",
                    padding: "14px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    cursor: "pointer",
                    textAlign: "left",
                    border: `1px solid ${BORDER}`,
                    borderTop: i === 0 ? `1px solid ${BORDER}` : "none",
                    boxSizing: "border-box",
                  }}
                >
                  {/* Top row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: NAVY,
                      }}
                    >
                      {inv.number}
                    </span>
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: NAVY,
                      }}
                    >
                      PKR {inv.amount.toLocaleString()}
                    </span>
                  </div>

                  {/* Mid row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "12px",
                        color: "#9B9B9B",
                      }}
                    >
                      {inv.date}
                    </span>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        height: "20px",
                        paddingLeft: "8px",
                        paddingRight: "8px",
                        borderRadius: "10px",
                        backgroundColor: cfg.bg,
                        fontFamily: "Inter, sans-serif",
                        fontSize: "10px",
                        fontWeight: 700,
                        color: cfg.color,
                      }}
                    >
                      {cfg.label}
                    </span>
                  </div>

                  {/* Bottom row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "12px",
                        color: "#666666",
                      }}
                    >
                      {inv.customer} — {inv.service}
                    </span>
                    <ChevronRight size={16} color="#9B9B9B" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
