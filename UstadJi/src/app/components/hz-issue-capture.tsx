import React, { useState } from "react";
import { ChevronLeft, Camera, Film, Mic, X, Plus } from "lucide-react";

interface HzIssueCaptureProps {
  onBack?: () => void;
  onContinue?: () => void;
}

export const HzIssueCapture: React.FC<HzIssueCaptureProps> = ({ onBack, onContinue }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState("");

  const toggleOption = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const isEnabled = selected.length > 0 || detail.trim() !== "";

  const options = [
    {
      id: "photo",
      icon: <Camera size={22} color="#161533" />,
      title: "Take Photo",
      subtitle: "Masla ki photo lein",
    },
    {
      id: "video",
      icon: <Film size={22} color="#161533" />,
      title: "Record Video",
      subtitle: "Short video record karein",
    },
    {
      id: "voice",
      icon: <Mic size={22} color="#161533" />,
      title: "Voice Note",
      subtitle: "Bol kar batayein",
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
            Describe the Issue
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
        {/* Subtitle */}
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            color: "#9B9B9B",
            margin: 0,
          }}
        >
          Photo, video ya voice — jo aasan ho
        </p>

        {/* Option cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginTop: 16,
          }}
        >
          {options.map((opt) => {
            const isSelected = selected.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggleOption(opt.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  backgroundColor: isSelected ? "#EEF0FA" : "#FFFFFF",
                  borderRadius: 12,
                  border: isSelected ? "2px solid #161533" : "1px solid #E8E3DB",
                  padding: "14px 16px",
                  cursor: "pointer",
                  textAlign: "left",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    backgroundColor: "#F0EDE8",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {opt.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#1A1A1A",
                    }}
                  >
                    {opt.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 13,
                      color: "#9B9B9B",
                      marginTop: 2,
                    }}
                  >
                    {opt.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Thumbnail strip */}
        <div style={{ marginTop: 16 }}>
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
              fontWeight: 500,
              color: "#9B9B9B",
              marginBottom: 8,
            }}
          >
            Added Media
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              scrollbarWidth: "none",
            }}
          >
            {/* Thumbnail 1 */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 8,
                  backgroundColor: "#E8E3DB",
                }}
              />
              <button
                type="button"
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: "#161533",
                  position: "absolute",
                  top: -4,
                  right: -4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <X size={8} color="white" />
              </button>
            </div>

            {/* Thumbnail 2 */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 8,
                  backgroundColor: "#E8E3DB",
                }}
              />
              <button
                type="button"
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: "#161533",
                  position: "absolute",
                  top: -4,
                  right: -4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <X size={8} color="white" />
              </button>
            </div>

            {/* Add more ghost button */}
            <button
              type="button"
              style={{
                width: 60,
                height: 60,
                borderRadius: 8,
                border: "1px dashed #E8E3DB",
                backgroundColor: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <Plus size={20} color="#9B9B9B" />
            </button>
          </div>
        </div>

        {/* Text area */}
        <div style={{ marginTop: 16 }}>
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              fontWeight: 500,
              color: "#1A1A1A",
              marginBottom: 8,
            }}
          >
            Aur detail?
          </div>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="Masle ki aur detail likhein (optional)"
            style={{
              width: "100%",
              minHeight: 80,
              borderRadius: 10,
              border: "1px solid #E8E3DB",
              padding: "12px 14px",
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              color: "#1A1A1A",
              resize: "none",
              outline: "none",
              boxSizing: "border-box",
              backgroundColor: "#FFFFFF",
            }}
          />
        </div>
      </div>

      {/* Bottom action bar */}
      <div
        style={{
          flexShrink: 0,
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid #EFEFEF",
          padding: "12px 16px 24px",
        }}
      >
        <button
          type="button"
          disabled={!isEnabled}
          onClick={isEnabled ? onContinue : undefined}
          style={{
            width: "100%",
            height: 56,
            borderRadius: 12,
            backgroundColor: isEnabled ? "#161533" : "#E8E3DB",
            color: isEnabled ? "#FFFFFF" : "#9B9B9B",
            cursor: isEnabled ? "pointer" : "not-allowed",
            border: "none",
            fontFamily: "Inter, sans-serif",
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          Continue
        </button>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 11,
            color: "#9B9B9B",
            textAlign: "center",
            marginTop: 8,
            marginBottom: 0,
          }}
        >
          Aap jitni detail denge, utni behtareen AI understanding hogi
        </p>
      </div>
    </div>
  );
};
