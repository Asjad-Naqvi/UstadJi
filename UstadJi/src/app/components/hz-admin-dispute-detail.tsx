import React, { useState } from "react";
import { ArrowLeft, X, Check, MessageCircle, FileText } from "lucide-react";

const NAVY = "#161533";
const GREEN = "#4CAF84";
const BG = "#FAF8F5";
const BORDER = "#E8E3DB";
const ORANGE = "#FF6B35";

type ResolutionOption = "customer" | "provider" | "partial" | "cancel" | null;

const timelineItems = [
  { icon: "✅", color: GREEN,      title: "Submitted by Ahmed",  desc: "Provider didn't complete the job",   time: "2 hours ago" },
  { icon: "🟡", color: ORANGE,     title: "Assigned to Admin",   desc: "Admin Sana assigned to this case",   time: "1 hour ago"  },
  { icon: "💬", color: NAVY,       title: "Provider Response",   desc: 'Usman: "Customer refused to pay"',   time: "30 min ago"  },
  { icon: "⏳", color: "#9B9B9B",  title: "Under Review",        desc: "Admin is reviewing evidence",        time: "10 min ago"  },
];

const resolutionOptions: { id: ResolutionOption; label: string }[] = [
  { id: "customer", label: "Customer wins (full refund)"  },
  { id: "provider", label: "Provider wins (full payment)" },
  { id: "partial",  label: "Partial refund (50/50)"       },
  { id: "cancel",   label: "Cancel booking"               },
];

interface HzAdminDisputeDetailScreenProps {
  onBack?: () => void;
  onResolved?: () => void;
}

export function HzAdminDisputeDetailScreen({ onBack, onResolved }: HzAdminDisputeDetailScreenProps) {
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState<ResolutionOption>(null);
  const [notes, setNotes] = useState("");

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
          #D-2401
        </span>
        <span
          style={{
            backgroundColor: "#FFF3E0",
            color: ORANGE,
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: 12,
          }}
        >
          Under Review
        </span>
      </div>

      {/* Actions bar */}
      <div
        style={{
          padding: "8px 16px",
          backgroundColor: "white",
          borderBottom: `1px solid ${BORDER}`,
          flexShrink: 0,
          display: "flex",
          gap: 8,
        }}
      >
        <button
          type="button"
          onClick={() => setShowResolveModal(true)}
          style={{
            flex: 1,
            height: 36,
            borderRadius: 8,
            backgroundColor: GREEN,
            color: "white",
            fontSize: 13,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          ✅ Resolve
        </button>
        <button
          type="button"
          style={{
            flex: 1,
            height: 36,
            borderRadius: 8,
            backgroundColor: "#D32F2F",
            color: "white",
            fontSize: 13,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          🚨 Escalate
        </button>
        <button
          type="button"
          onClick={onBack}
          style={{
            flex: 1,
            height: 36,
            borderRadius: 8,
            backgroundColor: "#F5F5F5",
            color: "#1A1A1A",
            fontSize: 13,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          ✕ Close
        </button>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 32px" }}>

        {/* Overview card */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            border: `1px solid ${BORDER}`,
            padding: 16,
            marginBottom: 14,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A" }}>Ahmed vs Usman</div>
          <div style={{ fontSize: 14, color: "#666666", marginTop: 4 }}>Plumbing Repair</div>
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
            }}
          >
            {[
              { label: "Category", value: "Payment Dispute",   valueStyle: {} },
              { label: "Priority", value: "High",              valueStyle: { color: "#D32F2F", fontWeight: 700 } },
              { label: "Created",  value: "2 hours ago",       valueStyle: {} },
              { label: "Updated",  value: "10 min ago",        valueStyle: {} },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ fontSize: 10, color: "#9B9B9B" }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginTop: 2, ...item.valueStyle }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            border: `1px solid ${BORDER}`,
            padding: 16,
            marginBottom: 14,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 14 }}>
            🕐 Dispute Timeline
          </div>
          {timelineItems.map((item, index) => {
            const isLast = index === timelineItems.length - 1;
            return (
              <div key={index} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                {/* Left: icon + line */}
                <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      backgroundColor: `${item.color}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{item.icon}</span>
                  </div>
                  {!isLast && (
                    <div
                      style={{
                        width: 2,
                        flex: 1,
                        minHeight: 14,
                        backgroundColor: "#F0EDE8",
                        marginTop: 2,
                      }}
                    />
                  )}
                </div>
                {/* Right: text */}
                <div style={{ paddingBottom: isLast ? 0 : 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: "#666666", marginTop: 2 }}>{item.desc}</div>
                  <div style={{ fontSize: 10, color: "#9B9B9B", marginTop: 2 }}>{item.time}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Evidence section */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            border: `1px solid ${BORDER}`,
            padding: 16,
            marginBottom: 14,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 12 }}>
            📎 Evidence
          </div>
          {[
            { label: "📷 Photos (3)",            subtitle: "3 images attached",          action: "View →",           amount: null },
            { label: "💬 Chat History",           subtitle: "Full conversation log",       action: "View Full Chat →", amount: null },
            { label: "📄 Invoice #INV-2026-001",  subtitle: "Service invoice",             action: "View →",           amount: "PKR 5,535" },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                marginBottom: 8,
                backgroundColor: BG,
                borderRadius: 8,
                border: `1px solid ${BORDER}`,
                padding: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>
                  {item.label}
                  {item.amount && (
                    <span style={{ fontSize: 12, color: "#666666", fontWeight: 400, marginLeft: 8 }}>
                      {item.amount}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: "#9B9B9B", marginTop: 2 }}>{item.subtitle}</div>
              </div>
              <button
                type="button"
                style={{
                  fontSize: 12,
                  color: NAVY,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {item.action}
              </button>
            </div>
          ))}
        </div>

        {/* Admin actions */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 14,
          }}
        >
          {["💬 Message Parties", "📝 Add Notes"].map((label) => (
            <button
              key={label}
              type="button"
              style={{
                flex: 1,
                minWidth: 140,
                height: 40,
                borderRadius: 8,
                backgroundColor: "#E8EAF6",
                color: NAVY,
                border: "none",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Resolve Modal */}
      {showResolveModal && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 30,
            }}
            onClick={() => setShowResolveModal(false)}
          />

          {/* Modal card */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "88%",
              backgroundColor: "white",
              borderRadius: 16,
              zIndex: 31,
              overflow: "hidden",
            }}
          >
            {/* Modal header */}
            <div
              style={{
                padding: "16px 16px 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>Resolve Dispute</span>
              <button
                type="button"
                onClick={() => setShowResolveModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
              >
                <X size={20} color="#9B9B9B" />
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 12 }}>
                Select Resolution:
              </div>

              {resolutionOptions.map((option) => {
                const isSelected = selectedResolution === option.id;
                return (
                  <div
                    key={option.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 10,
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedResolution(option.id)}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        border: `2px solid ${isSelected ? NAVY : BORDER}`,
                        backgroundColor: isSelected ? NAVY : "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {isSelected && (
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: "white",
                          }}
                        />
                      )}
                    </div>
                    <span style={{ fontSize: 14, color: "#1A1A1A" }}>{option.label}</span>
                  </div>
                );
              })}

              {/* Divider */}
              <div style={{ height: 1, backgroundColor: "#F0EDE8", marginTop: 8, marginBottom: 12 }} />

              {/* Notes */}
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 6 }}>Notes:</div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add resolution notes..."
                style={{
                  width: "100%",
                  height: 72,
                  borderRadius: 8,
                  border: `1px solid ${BORDER}`,
                  padding: 10,
                  fontSize: 13,
                  fontFamily: "Inter, sans-serif",
                  outline: "none",
                  resize: "none",
                  boxSizing: "border-box",
                }}
              />

              {/* Bottom buttons */}
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedResolution) {
                      setShowResolveModal(false);
                      onResolved?.();
                    }
                  }}
                  style={{
                    flex: 1,
                    height: 44,
                    borderRadius: 8,
                    backgroundColor: selectedResolution ? NAVY : "#D0CCC8",
                    color: "white",
                    border: "none",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: selectedResolution ? "pointer" : "not-allowed",
                  }}
                >
                  Confirm Resolution
                </button>
                <button
                  type="button"
                  onClick={() => setShowResolveModal(false)}
                  style={{
                    flex: 1,
                    height: 44,
                    borderRadius: 8,
                    backgroundColor: "transparent",
                    border: `1px solid ${BORDER}`,
                    fontSize: 14,
                    color: "#666666",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
