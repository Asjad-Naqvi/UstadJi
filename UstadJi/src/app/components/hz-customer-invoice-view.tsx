import React, { useState } from "react";
import { ArrowLeft, Download, AlertCircle, CheckCircle } from "lucide-react";
import { HzInvoiceCard, DEFAULT_INVOICE } from "./hz-invoice-card";

const NAVY = "#161533";
const GREEN = "#4CAF84";

/* ─── Props ─── */
interface HzCustomerInvoiceViewProps {
  onBack?: () => void;
  onAskQuestion?: () => void;
}

/* ─── Main screen ─── */
export const HzCustomerInvoiceView: React.FC<HzCustomerInvoiceViewProps> = ({
  onBack,
  onAskQuestion,
}) => {
  const [isPaid, setIsPaid] = useState(false);

  const invoiceData = { ...DEFAULT_INVOICE, status: isPaid ? ("paid" as const) : ("sent" as const) };

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
            right: "48px",
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            color: NAVY,
            pointerEvents: "none",
          }}
        >
          Invoice #INV-2026-001
        </span>

        <button
          type="button"
          aria-label="Download invoice"
          style={{
            marginLeft: "auto",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <Download size={20} color={NAVY} />
        </button>
      </header>

      {/* Payment status banner */}
      <div
        role="status"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "0 16px",
          height: "50px",
          backgroundColor: isPaid ? GREEN : "#FFF3CD",
          flexShrink: 0,
        }}
      >
        {isPaid ? (
          <CheckCircle size={18} color="#FFFFFF" />
        ) : (
          <AlertCircle size={18} color="#856404" />
        )}
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 700,
            color: isPaid ? "#FFFFFF" : "#856404",
          }}
        >
          {isPaid ? "Payment Confirmed" : "Payment Due"}
        </span>
        {!isPaid && (
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              color: "#856404",
              marginLeft: "auto",
            }}
          >
            PKR 5,535
          </span>
        )}
      </div>

      {/* Scrollable invoice */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          paddingTop: "16px",
          paddingBottom: "16px",
        }}
      >
        <HzInvoiceCard data={invoiceData} isEditable={false} />
      </div>

      {/* Footer actions */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid #EFEFEF",
          padding: "12px 16px 20px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {isPaid ? (
          <>
            <button
              type="button"
              style={{
                width: "100%",
                height: "52px",
                borderRadius: "8px",
                backgroundColor: NAVY,
                border: "none",
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                color: "#FFFFFF",
                cursor: "pointer",
              }}
            >
              Download Invoice
            </button>
            <button
              type="button"
              onClick={onAskQuestion}
              style={{
                background: "none",
                border: "none",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                color: "#9B9B9B",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              Ask Question
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setIsPaid(true)}
              style={{
                width: "100%",
                height: "52px",
                borderRadius: "8px",
                backgroundColor: GREEN,
                border: "none",
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                color: "#FFFFFF",
                cursor: "pointer",
              }}
            >
              Pay Now — PKR 5,535
            </button>
            <button
              type="button"
              style={{
                width: "100%",
                height: "48px",
                borderRadius: "8px",
                backgroundColor: "transparent",
                border: `1px solid ${NAVY}`,
                fontFamily: "Inter, sans-serif",
                fontSize: "15px",
                fontWeight: 700,
                color: NAVY,
                cursor: "pointer",
              }}
            >
              Download Invoice
            </button>
            <button
              type="button"
              onClick={onAskQuestion}
              style={{
                background: "none",
                border: "none",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                color: "#9B9B9B",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              Ask Question
            </button>
          </>
        )}
      </div>
    </div>
  );
};
