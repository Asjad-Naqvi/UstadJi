import React, { useState } from "react";
import { ChevronLeft, Camera, Mic, X, Play, Plus } from "lucide-react";

interface HzMediaGalleryProps {
  onBack?: () => void;
  onAddMore?: () => void;
}

type MediaItem =
  | { id: string; type: "photo"; bg: string }
  | { id: string; type: "voice"; duration: string };

const FAKE_WAVEFORM_HEIGHTS = [8, 14, 10, 18, 12, 20, 8, 16, 10, 14];

export const HzMediaGallery: React.FC<HzMediaGalleryProps> = ({ onBack, onAddMore }) => {
  const [items, setItems] = useState<MediaItem[]>([
    { id: "1", type: "photo", bg: "#D8D0C4" },
    { id: "2", type: "photo", bg: "#C8C0B4" },
    { id: "3", type: "voice", duration: "0:14" },
    { id: "4", type: "photo", bg: "#B8B0A4" },
  ]);

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

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
          gap: 8,
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
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 17,
            fontWeight: 600,
            color: "#1A1A1A",
            flex: 1,
          }}
        >
          Uploaded Media
        </span>
        <div
          style={{
            backgroundColor: "#161533",
            color: "#FFFFFF",
            borderRadius: 12,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 3,
            paddingBottom: 3,
            fontFamily: "Inter, sans-serif",
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          {items.length}
        </div>
      </div>

      {/* Scrollable grid */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 16,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          {items.map((item) => {
            if (item.type === "photo") {
              return (
                <div
                  key={item.id}
                  style={{
                    position: "relative",
                    paddingBottom: "100%",
                    borderRadius: 10,
                    overflow: "hidden",
                    backgroundColor: item.bg,
                  }}
                >
                  {/* Camera icon centered */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Camera size={28} color="rgba(255,255,255,0.6)" />
                  </div>
                  {/* Photo tag */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 6,
                      left: 6,
                      backgroundColor: "rgba(22,21,51,0.6)",
                      color: "#FFFFFF",
                      fontFamily: "Inter, sans-serif",
                      fontSize: 9,
                      borderRadius: 4,
                      padding: "2px 6px",
                    }}
                  >
                    📷 Photo
                  </div>
                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      backgroundColor: "rgba(22,21,51,0.7)",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                    }}
                  >
                    <X size={12} color="white" />
                  </button>
                </div>
              );
            }

            if (item.type === "voice") {
              return (
                <div
                  key={item.id}
                  style={{
                    gridColumn: "1 / -1",
                    backgroundColor: "#FFFFFF",
                    borderRadius: 10,
                    border: "1px solid #E8E3DB",
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  {/* Mic icon container */}
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: "#F0EDE8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Mic size={20} color="#161533" />
                  </div>

                  {/* Waveform */}
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      height: 32,
                    }}
                  >
                    {FAKE_WAVEFORM_HEIGHTS.map((h, i) => (
                      <div
                        key={i}
                        style={{
                          width: 3,
                          height: h,
                          backgroundColor: "#E8E3DB",
                          borderRadius: 2,
                        }}
                      />
                    ))}
                  </div>

                  {/* Duration */}
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 12,
                      color: "#9B9B9B",
                      flexShrink: 0,
                    }}
                  >
                    {item.duration}
                  </span>

                  {/* Play button */}
                  <button
                    type="button"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      backgroundColor: "#161533",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      padding: 0,
                    }}
                  >
                    <Play size={16} color="white" />
                  </button>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      backgroundColor: "rgba(22,21,51,0.7)",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      padding: 0,
                    }}
                  >
                    <X size={12} color="white" />
                  </button>
                </div>
              );
            }

            return null;
          })}
        </div>

        {/* Add More button */}
        <button
          type="button"
          onClick={onAddMore}
          style={{
            marginTop: 16,
            width: "100%",
            height: 56,
            borderRadius: 12,
            border: "1px dashed #161533",
            backgroundColor: "transparent",
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            fontWeight: 500,
            color: "#161533",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxSizing: "border-box",
          }}
        >
          <Plus size={18} color="#161533" />
          Add More Media
        </button>
      </div>
    </div>
  );
};
