import React from "react";
import { ChevronLeft, Sparkles, Edit2 } from "lucide-react";

interface HzIssueSummaryProps {
  onBack?: () => void;
  onConfirm?: () => void;
  onViewMedia?: () => void;
}

export const HzIssueSummary: React.FC<HzIssueSummaryProps> = ({
  onBack,
  onConfirm,
  onViewMedia,
}) => {
  const scopeItems = [
    "• Refrigerant check",
    "• Compressor inspection",
    "• Filter cleaning",
  ];

  const cardRows = [
    {
      label: "Category",
      valueNode: (
        <span
          style={{
            backgroundColor: "#161533",
            color: "#FFFFFF",
            borderRadius: 12,
            padding: "2px 10px",
            fontFamily: "Inter, sans-serif",
            fontSize: 12,
            fontWeight: 500,
            display: "inline-block",
          }}
        >
          AC Repairing
        </span>
      ),
    },
    {
      label: "Urgency",
      valueNode: (
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            color: "#1A1A1A",
          }}
        >
          Medium
        </span>
      ),
    },
    {
      label: "Masla",
      valueNode: (
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            color: "#1A1A1A",
            lineHeight: "20px",
          }}
        >
          AC unit loud noise de raha hai aur thanda nahi kar raha
        </span>
      ),
    },
    {
      label: "Scope",
      valueNode: (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {scopeItems.map((item, i) => (
            <span
              key={i}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                color: "#555555",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FAF8F5",
        height: "100%",
        overflow: "hidden",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Status bar */}
      <div style={{ height: 24, flexShrink: 0, backgroundColor: "#FFFFFF" }} />

      {/* Header */}
      <div
        style={{
          height: 56,
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #EFEFEF",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 16,
          paddingRight: 16,
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            marginLeft: -8,
          }}
        >
          <ChevronLeft size={24} color="#161533" />
        </button>
        <div style={{ flex: 1, textAlign: "center" }}>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 17,
              fontWeight: 600,
              color: "#1A1A1A",
            }}
          >
            AI Summary
          </span>
        </div>
        <div style={{ width: 40 }} />
      </div>

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 16,
          paddingBottom: 32,
        }}
      >
        {/* AI badge chip */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            height: 28,
            paddingLeft: 12,
            paddingRight: 12,
            borderRadius: 14,
            backgroundColor: "#EEF0FA",
            border: "1px solid #C5CAE9",
            marginBottom: 12,
          }}
        >
          <Sparkles size={14} color="#161533" />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
              fontWeight: 500,
              color: "#161533",
            }}
          >
            AI Generated
          </span>
        </div>

        {/* Summary card */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            border: "1px solid #E8E3DB",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.07)",
            overflow: "hidden",
          }}
        >
          {cardRows.map((row, index) => (
            <div
              key={index}
              style={{
                paddingLeft: 16,
                paddingRight: 16,
                paddingTop: 12,
                paddingBottom: 12,
                borderBottom:
                  index < cardRows.length - 1 ? "1px solid #EFEFEF" : "none",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  width: 100,
                  flexShrink: 0,
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13,
                  color: "#9B9B9B",
                  paddingTop: 2,
                }}
              >
                {row.label}
              </div>
              <div
                style={{
                  flex: 1,
                  marginLeft: 8,
                }}
              >
                {row.valueNode}
              </div>
              <button
                type="button"
                style={{
                  padding: 4,
                  border: "none",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginLeft: 4,
                }}
              >
                <Edit2 size={16} color="#9B9B9B" />
              </button>
            </div>
          ))}
        </div>

        {/* Thumbnail strip */}
        <div style={{ marginTop: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                fontWeight: 500,
                color: "#1A1A1A",
              }}
            >
              Media (3)
            </span>
            <button
              type="button"
              onClick={onViewMedia}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                color: "#161533",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              View All →
            </button>
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              scrollbarWidth: "none",
            }}
          >
            {["#D8D0C4", "#C8C0B4", "#B8B0A4"].map((bg, i) => (
              <div
                key={i}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 8,
                  backgroundColor: bg,
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div
        style={{
          flexShrink: 0,
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid #EFEFEF",
          padding: "12px 16px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {/* Primary button */}
        <button
          type="button"
          onClick={onConfirm}
          style={{
            width: "100%",
            height: 56,
            borderRadius: 12,
            backgroundColor: "#161533",
            color: "#FFFFFF",
            border: "none",
            fontFamily: "Inter, sans-serif",
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Confirm &amp; Find Providers
        </button>

        {/* Secondary button */}
        <button
          type="button"
          onClick={onBack}
          style={{
            width: "100%",
            height: 56,
            borderRadius: 12,
            backgroundColor: "#FFFFFF",
            color: "#161533",
            border: "1px solid #161533",
            fontFamily: "Inter, sans-serif",
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Edit Details
        </button>
      </div>
    </div>
  );
};
