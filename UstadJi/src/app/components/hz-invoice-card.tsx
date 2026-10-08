import React, { useState } from "react";
import { CheckCircle } from "lucide-react";

/* ─── Types ─── */
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  bookingRef: string;
  providerName: string;
  providerTitle: string;
  providerPhone: string;
  customerName: string;
  customerAddress: string;
  customerCity: string;
  items: InvoiceItem[];
  subtotal: number;
  fee: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
}

/* ─── Defaults ─── */
export const DEFAULT_INVOICE: InvoiceData = {
  invoiceNumber: "INV-2026-001",
  date: "2026-08-06",
  bookingRef: "BK-1234",
  providerName: "Usman Tariq",
  providerTitle: "AC Technician",
  providerPhone: "555-1234",
  customerName: "Ahmed Khan",
  customerAddress: "123 Street, G-10",
  customerCity: "Islamabad, PK",
  items: [
    { id: "i1", description: "AC Repair Service",   quantity: 1, rate: 1500, amount: 1500 },
    { id: "i2", description: "Copper Pipe (10ft)",   quantity: 1, rate: 800,  amount: 800  },
    { id: "i3", description: "Refrigerant Top-up",   quantity: 1, rate: 1200, amount: 1200 },
    { id: "i4", description: "Labor (2 hrs)",         quantity: 2, rate: 500,  amount: 1000 },
  ],
  subtotal: 4500,
  fee: 450,
  tax: 585,
  total: 5535,
  status: "draft",
};

/* ─── Status config ─── */
const STATUS_CONFIG: Record<InvoiceStatus, { label: string; bg: string; color: string }> = {
  draft:   { label: "Draft",   bg: "#F5F5F5", color: "#9B9B9B" },
  sent:    { label: "Sent",    bg: "#EEF5FF", color: "#0066CC" },
  paid:    { label: "Paid",    bg: "#E8F5E9", color: "#4CAF84" },
  overdue: { label: "Overdue", bg: "#FFEBEE", color: "#FF0000" },
};

const NAVY = "#161533";
const BORDER = "#E8E3DB";

const fmt = (n: number) => `PKR ${n.toLocaleString()}`;

/* ─── Invoice card component ─── */
interface HzInvoiceCardProps {
  data: InvoiceData;
  isEditable?: boolean;
  onDataChange?: (data: InvoiceData) => void;
}

export const HzInvoiceCard: React.FC<HzInvoiceCardProps> = ({
  data,
  isEditable = false,
  onDataChange,
}) => {
  const statusCfg = STATUS_CONFIG[data.status];

  const updateItem = (id: string, field: keyof InvoiceItem, val: string) => {
    const items = data.items.map((item) => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: field === "description" ? val : Number(val) || 0 };
      updated.amount = updated.quantity * updated.rate;
      return updated;
    });
    const subtotal = items.reduce((s, i) => s + i.amount, 0);
    const fee = Math.round(subtotal * 0.1);
    const tax = Math.round(subtotal * 0.13);
    onDataChange?.({ ...data, items, subtotal, fee, tax, total: subtotal + fee + tax });
  };

  const removeItem = (id: string) => {
    const items = data.items.filter((i) => i.id !== id);
    const subtotal = items.reduce((s, i) => s + i.amount, 0);
    const fee = Math.round(subtotal * 0.1);
    const tax = Math.round(subtotal * 0.13);
    onDataChange?.({ ...data, items, subtotal, fee, tax, total: subtotal + fee + tax });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: `i${Date.now()}`,
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    onDataChange?.({ ...data, items: [...data.items, newItem] });
  };

  const fieldStyle: React.CSSProperties = {
    border: `1px solid ${BORDER}`,
    borderRadius: "4px",
    padding: "2px 4px",
    fontFamily: "Inter, sans-serif",
    fontSize: "12px",
    color: "#1A1A1A",
    backgroundColor: "#FFFFFF",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        margin: "0 16px",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      {/* Invoice header */}
      <div
        style={{
          padding: "20px 16px 12px",
          textAlign: "center",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        {/* Logo wordmark */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "8px",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: NAVY,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "10px",
                fontWeight: 700,
                color: "#FFFFFF",
              }}
            >
              U
            </span>
          </div>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              color: NAVY,
            }}
          >
            Ustaad G
          </span>
        </div>
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "20px",
            fontWeight: 700,
            color: NAVY,
            letterSpacing: "2px",
          }}
        >
          INVOICE
        </div>
      </div>

      {/* Metadata row */}
      <div
        style={{
          padding: "12px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {[
            ["Invoice #:", data.invoiceNumber],
            ["Date:", data.date],
            ["Booking #:", data.bookingRef],
          ].map(([label, val]) => (
            <span
              key={label}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "11px",
                color: "#666666",
              }}
            >
              <span style={{ color: "#9B9B9B" }}>{label} </span>
              {val}
            </span>
          ))}
        </div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            height: "24px",
            paddingLeft: "10px",
            paddingRight: "10px",
            borderRadius: "12px",
            backgroundColor: statusCfg.bg,
            fontFamily: "Inter, sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            color: statusCfg.color,
          }}
        >
          {statusCfg.label}
        </span>
      </div>

      {/* From / To */}
      <div
        style={{
          padding: "12px 16px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        {[
          {
            label: "From",
            name: data.providerName,
            sub1: data.providerTitle,
            sub2: data.providerPhone,
          },
          {
            label: "To",
            name: data.customerName,
            sub1: data.customerAddress,
            sub2: data.customerCity,
          },
        ].map(({ label, name, sub1, sub2 }) => (
          <div key={label}>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "10px",
                fontWeight: 700,
                color: "#9B9B9B",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "4px",
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                color: "#1A1A1A",
              }}
            >
              {name}
            </div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "11px",
                color: "#666666",
                lineHeight: "16px",
              }}
            >
              {sub1}
              <br />
              {sub2}
            </div>
          </div>
        ))}
      </div>

      {/* Items table */}
      <div style={{ borderBottom: `1px solid ${BORDER}` }}>
        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 32px 56px 56px",
            gap: "4px",
            backgroundColor: "#FAF8F5",
            padding: "6px 12px",
          }}
        >
          {["DESCRIPTION", "QTY", "RATE", "AMOUNT"].map((h, i) => (
            <span
              key={h}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "10px",
                fontWeight: 700,
                color: "#666666",
                textAlign: i === 0 ? "left" : "right",
              }}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Item rows */}
        {data.items.map((item) => (
          <div
            key={item.id}
            style={{
              display: "grid",
              gridTemplateColumns: isEditable ? "1fr 32px 56px 56px 24px" : "1fr 32px 56px 56px",
              gap: "4px",
              padding: "7px 12px",
              borderBottom: `1px solid #F5F5F5`,
              alignItems: "center",
            }}
          >
            {isEditable ? (
              <>
                <input
                  value={item.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  style={{ ...fieldStyle, width: "100%" }}
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                  style={{ ...fieldStyle, width: "100%", textAlign: "right" }}
                />
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) => updateItem(item.id, "rate", e.target.value)}
                  style={{ ...fieldStyle, width: "100%", textAlign: "right" }}
                />
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    color: "#1A1A1A",
                    textAlign: "right",
                  }}
                >
                  {item.amount.toLocaleString()}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#D94F4F",
                    cursor: "pointer",
                    padding: 0,
                    fontSize: "14px",
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </>
            ) : (
              <>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    color: "#1A1A1A",
                  }}
                >
                  {item.description}
                </span>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    color: "#1A1A1A",
                    textAlign: "right",
                  }}
                >
                  {item.quantity}
                </span>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    color: "#1A1A1A",
                    textAlign: "right",
                  }}
                >
                  {item.rate.toLocaleString()}
                </span>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    color: "#1A1A1A",
                    textAlign: "right",
                  }}
                >
                  {item.amount.toLocaleString()}
                </span>
              </>
            )}
          </div>
        ))}

        {/* Add item row (edit mode) */}
        {isEditable && (
          <button
            type="button"
            onClick={addItem}
            style={{
              display: "block",
              width: "100%",
              padding: "8px 12px",
              background: "none",
              border: "none",
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              color: NAVY,
              fontWeight: 600,
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            + Add Item
          </button>
        )}
      </div>

      {/* Summary */}
      <div style={{ padding: "10px 16px", borderBottom: `1px solid ${BORDER}` }}>
        {[
          { label: "Subtotal:",          value: fmt(data.subtotal), bold: false },
          { label: "Service Fee (10%):", value: fmt(data.fee),      bold: false },
          { label: "Tax (GST 13%):",     value: fmt(data.tax),      bold: false },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "4px",
            }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                color: "#666666",
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                color: "#1A1A1A",
              }}
            >
              {value}
            </span>
          </div>
        ))}

        <div
          aria-hidden="true"
          style={{ height: "1px", backgroundColor: BORDER, margin: "8px 0" }}
        />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "15px",
              fontWeight: 700,
              color: NAVY,
            }}
          >
            GRAND TOTAL:
          </span>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "15px",
              fontWeight: 700,
              color: NAVY,
            }}
          >
            {fmt(data.total)}
          </span>
        </div>
      </div>

      {/* Terms */}
      <div style={{ padding: "10px 16px", borderBottom: `1px solid ${BORDER}` }}>
        <p
          style={{
            margin: 0,
            fontFamily: "Inter, sans-serif",
            fontSize: "10px",
            color: "#9B9B9B",
            lineHeight: "15px",
          }}
        >
          Terms: Service completed. 7-day warranty. Payment due upon receipt.
        </p>
      </div>

      {/* Signature lines */}
      <div
        style={{
          padding: "12px 16px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        {["Provider Signature", "Customer Signature"].map((label) => (
          <div key={label}>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "10px",
                color: "#9B9B9B",
                marginBottom: "8px",
              }}
            >
              {label}
            </div>
            <div
              style={{
                borderBottom: "1px dashed #E8E3DB",
                height: "24px",
              }}
            />
          </div>
        ))}
      </div>

      {/* AI badge */}
      <div
        style={{
          padding: "10px 16px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            height: "22px",
            paddingLeft: "10px",
            paddingRight: "10px",
            borderRadius: "11px",
            backgroundColor: "#EEEEF5",
            fontFamily: "Inter, sans-serif",
            fontSize: "10px",
            fontWeight: 700,
            color: NAVY,
          }}
        >
          <CheckCircle size={11} color={NAVY} />
          AI-Generated
        </span>
      </div>
    </div>
  );
};
