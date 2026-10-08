import React, { useState } from "react";
import { ArrowLeft, Download, Share2, X, MessageCircle, Smartphone, Mail, Link } from "lucide-react";
import { HzInvoiceCard, DEFAULT_INVOICE, type InvoiceData } from "./hz-invoice-card";

const NAVY = "#161533";
const BORDER = "#E8E3DB";

/* ─── Send modal ─── */
const SendModal: React.FC<{ onClose: () => void; onSent: () => void }> = ({
  onClose,
  onSent,
}) => {
  const OPTIONS = [
    { icon: MessageCircle, label: "WhatsApp",  iconBg: "#25D366", iconColor: "#FFFFFF" },
    { icon: Smartphone,    label: "SMS",        iconBg: "#0066CC", iconColor: "#FFFFFF" },
    { icon: Mail,          label: "Email",      iconBg: "#F5F5F5", iconColor: "#666666" },
    { icon: Link,          label: "Copy Link",  iconBg: "#F5F5F5", iconColor: "#666666" },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 20,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          zIndex: 21,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 16px 12px",
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                color: "#1A1A1A",
              }}
            >
              Send Invoice to Customer
            </div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                color: "#9B9B9B",
                marginTop: "2px",
              }}
            >
              Ahmed Khan
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "#F5F5F5",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={16} color="#1A1A1A" />
          </button>
        </div>

        {/* Send options */}
        <div style={{ padding: "8px 0" }}>
          {OPTIONS.map(({ icon: Icon, label, iconBg, iconColor }) => (
            <button
              key={label}
              type="button"
              onClick={onSent}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "12px 16px",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  backgroundColor: iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={20} color={iconColor} />
              </div>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#1A1A1A",
                }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* Cancel */}
        <div style={{ padding: "8px 16px 16px" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: "100%",
              background: "none",
              border: "none",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              color: "#9B9B9B",
              cursor: "pointer",
              padding: "8px",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

/* ─── Props ─── */
interface HzInvoicePreviewScreenProps {
  onBack?: () => void;
  onViewInvoice?: () => void;
  onSent?: () => void;
}

/* ─── Main screen ─── */
export const HzInvoicePreviewScreen: React.FC<HzInvoicePreviewScreenProps> = ({
  onBack,
  onSent,
}) => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    ...DEFAULT_INVOICE,
    status: "draft",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSent = () => {
    setShowSendModal(false);
    setSent(true);
    setInvoiceData((d) => ({ ...d, status: "sent" }));
    onSent?.();
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FAF8F5",
        overflow: "hidden",
        position: "relative",
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
            right: "88px",
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            color: NAVY,
            pointerEvents: "none",
          }}
        >
          Invoice #{invoiceData.invoiceNumber}
        </span>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <button
            type="button"
            aria-label="Download invoice"
            style={{
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
          <button
            type="button"
            aria-label="Share invoice"
            style={{
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
            <Share2 size={20} color={NAVY} />
          </button>
        </div>
      </header>

      {/* Sent toast */}
      {sent && (
        <div
          style={{
            backgroundColor: "#4CAF84",
            padding: "10px 16px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "14px" }}>✓</span>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              color: "#FFFFFF",
            }}
          >
            Invoice sent to Ahmed Khan
          </span>
        </div>
      )}

      {/* Scrollable invoice card */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          paddingTop: "16px",
          paddingBottom: "16px",
        }}
      >
        <HzInvoiceCard
          data={invoiceData}
          isEditable={isEditing}
          onDataChange={setInvoiceData}
        />

        {/* Save/Cancel when editing */}
        {isEditing && (
          <div
            style={{
              margin: "12px 16px 0",
              display: "flex",
              gap: "8px",
            }}
          >
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              style={{
                flex: 1,
                height: "44px",
                borderRadius: "8px",
                backgroundColor: NAVY,
                border: "none",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 700,
                color: "#FFFFFF",
                cursor: "pointer",
              }}
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              style={{
                flex: 1,
                height: "44px",
                borderRadius: "8px",
                backgroundColor: "transparent",
                border: `1px solid ${BORDER}`,
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: "#1A1A1A",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Footer buttons */}
      {!isEditing && (
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
          <button
            type="button"
            onClick={() => setShowSendModal(true)}
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
            Send to Customer
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
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
            Edit Invoice
          </button>
          <button
            type="button"
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
            Download PDF
          </button>
        </div>
      )}

      {/* Send modal */}
      {showSendModal && (
        <SendModal
          onClose={() => setShowSendModal(false)}
          onSent={handleSent}
        />
      )}
    </div>
  );
};
