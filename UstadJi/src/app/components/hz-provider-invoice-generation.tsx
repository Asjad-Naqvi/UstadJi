import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Mic, Square, Play, X, Sparkles } from "lucide-react";

const NAVY = "#161533";
const BORDER = "#E8E3DB";
const BG = "#FAF8F5";

/* ─── Pulse keyframe injected once ─── */
const PULSE_STYLE = `
  @keyframes hz-mic-pulse {
    0%   { box-shadow: 0 0 0 0 rgba(22,21,51,0.35); }
    70%  { box-shadow: 0 0 0 14px rgba(22,21,51,0); }
    100% { box-shadow: 0 0 0 0 rgba(22,21,51,0); }
  }
  @keyframes hz-skeleton {
    0%   { opacity: 0.4; }
    50%  { opacity: 0.9; }
    100% { opacity: 0.4; }
  }
`;

/* ─── Waveform bars ─── */
const Waveform: React.FC<{ active: boolean }> = ({ active }) => {
  const [heights, setHeights] = useState<number[]>(Array(20).fill(8));

  useEffect(() => {
    if (!active) {
      setHeights(Array(20).fill(8));
      return;
    }
    const id = setInterval(() => {
      setHeights(Array(20).fill(0).map(() => Math.random() * 30 + 10));
    }, 120);
    return () => clearInterval(id);
  }, [active]);

  return (
    <div
      aria-hidden="true"
      style={{ display: "flex", alignItems: "center", gap: "4px", height: "40px" }}
    >
      {heights.map((h, i) => (
        <div
          key={i}
          style={{
            width: "4px",
            height: `${h}px`,
            borderRadius: "2px",
            backgroundColor: NAVY,
            opacity: active ? 1 : 0.3,
            transition: active ? "height 0.1s ease" : "none",
          }}
        />
      ))}
    </div>
  );
};

/* ─── Timer display ─── */
const formatTime = (s: number): string => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

/* ─── AI results card ─── */
const AIResultsCard: React.FC<{ analyzing: boolean }> = ({ analyzing }) => {
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    if (!analyzing) return;
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      setConfidence(Math.min(94, Math.round((elapsed / 2000) * 94)));
      if (elapsed >= 2000) clearInterval(id);
    }, 50);
    return () => clearInterval(id);
  }, [analyzing]);

  const DETAILS = [
    "Fixed bathroom pipe leak",
    "Replaced 2 PVC connectors",
    "Water pressure test",
  ];

  if (analyzing) {
    return (
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          border: `1px solid ${BORDER}`,
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "13px",
            color: "#9B9B9B",
            textAlign: "center",
          }}
        >
          AI is analyzing your description...
        </span>
        <div
          style={{
            height: "4px",
            borderRadius: "2px",
            backgroundColor: BORDER,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: "2px",
              backgroundColor: NAVY,
              animation: "hz-skeleton 1.4s ease infinite",
              width: "100%",
            }}
          />
        </div>
        {[80, 60, 90].map((w, i) => (
          <div
            key={i}
            style={{
              height: "12px",
              borderRadius: "6px",
              backgroundColor: "#E8E3DB",
              width: `${w}%`,
              animation: "hz-skeleton 1.4s ease infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: BG,
        borderRadius: "8px",
        border: `1px solid ${BORDER}`,
        padding: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 700,
            color: NAVY,
          }}
        >
          AI-Generated Invoice Summary
        </span>
        <button
          type="button"
          style={{
            background: "none",
            border: "none",
            fontFamily: "Inter, sans-serif",
            fontSize: "12px",
            color: NAVY,
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Edit
        </button>
      </div>

      <div style={{ height: "1px", backgroundColor: BORDER, marginBottom: "10px" }} />

      {[
        ["Service Type", "Plumbing Repair"],
        ["Duration",     "1.5 hours"],
      ].map(([label, val]) => (
        <div
          key={label}
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "13px",
            color: "#1A1A1A",
            marginBottom: "4px",
          }}
        >
          <span style={{ color: "#9B9B9B" }}>{label}: </span>
          {val}
        </div>
      ))}

      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "12px",
          fontWeight: 700,
          color: NAVY,
          marginTop: "8px",
          marginBottom: "4px",
        }}
      >
        Extracted Details:
      </div>

      {DETAILS.map((d) => (
        <div
          key={d}
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "12px",
            color: "#1A1A1A",
            marginBottom: "2px",
            paddingLeft: "8px",
          }}
        >
          • {d}
        </div>
      ))}

      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            height: "22px",
            paddingLeft: "10px",
            paddingRight: "10px",
            borderRadius: "11px",
            backgroundColor: "#4CAF84",
            fontFamily: "Inter, sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            color: "#FFFFFF",
          }}
        >
          AI Confidence: {confidence}%
        </span>
      </div>
    </div>
  );
};

/* ─── Props ─── */
interface HzProviderInvoiceGenerationProps {
  onBack?: () => void;
  onGenerateInvoice?: () => void;
  onSaveDraft?: () => void;
}

/* ─── Main screen ─── */
export const HzProviderInvoiceGeneration: React.FC<HzProviderInvoiceGenerationProps> = ({
  onBack,
  onGenerateInvoice,
  onSaveDraft,
}) => {
  const [activeTab, setActiveTab] = useState<"voice" | "text">("voice");
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [textInput, setTextInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  /* Timer */
  useEffect(() => {
    if (!isRecording) return;
    const id = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(id);
  }, [isRecording]);

  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecording(true);
    } else {
      setDuration(0);
      setIsRecording(true);
      setHasRecording(false);
    }
  };

  const handleClearRecording = () => {
    setHasRecording(false);
    setDuration(0);
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setAnalyzed(false);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 2200);
  };

  const TEMPLATES = [
    "Plumbing Fix",
    "AC Repair",
    "Electrical",
    "Cleaning",
    "Carpentry",
  ];

  const TEMPLATE_TEXTS: Record<string, string> = {
    "Plumbing Fix":  "Fixed leaking pipe, replaced 2 connectors, charged 1 hour labor. Materials: PVC pipe 5ft.",
    "AC Repair":     "Installed new AC unit, 3 copper pipes, refrigerant top-up. Labor 2 hours.",
    "Electrical":    "Replaced faulty wiring in main panel, installed 3 new sockets, tested circuit breakers.",
    "Cleaning":      "Deep cleaned 3 rooms, sofa steam cleaning, carpet wash, bathroom sanitization.",
    "Carpentry":     "Custom shelf installation, 4 brackets, wood finishing. Labor 1.5 hours.",
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: BG,
        overflow: "hidden",
      }}
    >
      <style>{PULSE_STYLE}</style>

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
          Generate Invoice
        </span>
      </header>

      {/* Tab switcher */}
      <div
        style={{
          height: "60px",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #EFEFEF",
          display: "flex",
          alignItems: "center",
          paddingLeft: "16px",
          paddingRight: "16px",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        {(["voice", "text"] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                height: "40px",
                borderRadius: "20px",
                backgroundColor: isActive ? NAVY : "transparent",
                border: isActive ? "none" : `1px solid ${BORDER}`,
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: isActive ? "#FFFFFF" : NAVY,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {tab === "voice" ? "🎙 Voice" : "✏️ Text"}
            </button>
          );
        })}
      </div>

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          paddingLeft: "16px",
          paddingRight: "16px",
          paddingTop: "20px",
          paddingBottom: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {activeTab === "voice" ? (
          <>
            {/* Recording area */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
                paddingTop: "16px",
              }}
            >
              {/* Mic button */}
              <button
                type="button"
                onClick={handleRecord}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 40% 40%, #2A2960, ${NAVY})`,
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  animation: isRecording ? "hz-mic-pulse 1.5s infinite" : "none",
                  transition: "transform 0.15s ease",
                }}
              >
                {isRecording ? (
                  <Square size={28} color="#FFFFFF" fill="#FFFFFF" />
                ) : (
                  <Mic size={28} color="#FFFFFF" />
                )}
              </button>

              {/* Timer */}
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  color: "#9B9B9B",
                }}
              >
                {formatTime(duration)}
              </span>

              {/* Waveform */}
              <Waveform active={isRecording} />

              {/* Controls */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  type="button"
                  onClick={handleRecord}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    height: "36px",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    borderRadius: "18px",
                    backgroundColor: isRecording ? "#FF3B30" : NAVY,
                    border: "none",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#FFFFFF",
                    cursor: "pointer",
                  }}
                >
                  {isRecording ? (
                    <><Square size={12} fill="#FFFFFF" /> Stop</>
                  ) : (
                    <><Mic size={12} /> Record</>
                  )}
                </button>

                {hasRecording && (
                  <button
                    type="button"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      height: "36px",
                      paddingLeft: "16px",
                      paddingRight: "16px",
                      borderRadius: "18px",
                      backgroundColor: "#FFFFFF",
                      border: `1px solid ${BORDER}`,
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: NAVY,
                      cursor: "pointer",
                    }}
                  >
                    <Play size={12} color={NAVY} /> Playback
                  </button>
                )}
              </div>

              {hasRecording && (
                <button
                  type="button"
                  onClick={handleClearRecording}
                  style={{
                    background: "none",
                    border: "none",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    color: "#9B9B9B",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  Clear Recording
                </button>
              )}
            </div>

            {/* Instruction text */}
            <p
              style={{
                margin: 0,
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                color: "#666666",
                textAlign: "center",
                lineHeight: "20px",
              }}
            >
              Describe the work you performed, materials used, and any additional charges. You can speak in Urdu or English.
            </p>

            {/* Example prompt cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                "Fixed leaking pipe, replaced 2 connectors, charged 1 hour labor",
                "Installed new AC unit, 3 copper pipes, refrigerant top-up",
              ].map((example) => (
                <div
                  key={example}
                  style={{
                    backgroundColor: BG,
                    borderRadius: "8px",
                    border: `1px solid ${BORDER}`,
                    padding: "12px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                  }}
                >
                  <Mic size={14} color={NAVY} style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      color: "#1A1A1A",
                      lineHeight: "18px",
                    }}
                  >
                    {example}
                  </span>
                </div>
              ))}
            </div>

            {/* Analyze with AI (if recording exists) */}
            {hasRecording && (
              <>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  style={{
                    width: "100%",
                    height: "48px",
                    borderRadius: "8px",
                    backgroundColor: analyzing ? "#9B9B9B" : NAVY,
                    border: "none",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    cursor: analyzing ? "default" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <Sparkles size={16} color="#FFFFFF" />
                  Analyze with AI
                </button>

                {(analyzing || analyzed) && (
                  <AIResultsCard analyzing={analyzing} />
                )}
              </>
            )}
          </>
        ) : (
          <>
            {/* Text input area */}
            <div>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value.slice(0, 500))}
                placeholder="Describe the service, materials, and charges..."
                style={{
                  display: "block",
                  width: "100%",
                  height: "180px",
                  borderRadius: "8px",
                  border: `1px solid ${BORDER}`,
                  padding: "16px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  color: "#1A1A1A",
                  backgroundColor: "#FFFFFF",
                  resize: "none",
                  outline: "none",
                  boxSizing: "border-box",
                  lineHeight: "21px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "4px",
                }}
              >
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "11px",
                    color: "#9B9B9B",
                  }}
                >
                  {textInput.length}/500
                </span>
              </div>
            </div>

            {/* Quick templates */}
            <div>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  color: "#9B9B9B",
                  marginBottom: "8px",
                }}
              >
                Quick Templates
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  overflowX: "auto",
                  scrollbarWidth: "none",
                  paddingBottom: "4px",
                }}
              >
                {TEMPLATES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTextInput(TEMPLATE_TEXTS[t] ?? "")}
                    style={{
                      flexShrink: 0,
                      height: "32px",
                      paddingLeft: "14px",
                      paddingRight: "14px",
                      borderRadius: "16px",
                      backgroundColor: BG,
                      border: `1px solid ${BORDER}`,
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      color: "#1A1A1A",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Analyze button */}
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!textInput.trim() || analyzing}
              style={{
                width: "100%",
                height: "48px",
                borderRadius: "8px",
                backgroundColor: !textInput.trim() || analyzing ? "#D8D8D8" : NAVY,
                border: "none",
                fontFamily: "Inter, sans-serif",
                fontSize: "15px",
                fontWeight: 700,
                color: "#FFFFFF",
                cursor: !textInput.trim() || analyzing ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "4px",
              }}
            >
              <Sparkles size={16} color="#FFFFFF" />
              Analyze with AI
            </button>

            {/* AI results */}
            {(analyzing || analyzed) && (
              <AIResultsCard analyzing={analyzing} />
            )}
          </>
        )}
      </div>

      {/* Footer */}
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
          onClick={onGenerateInvoice}
          disabled={!analyzed}
          style={{
            width: "100%",
            height: "52px",
            borderRadius: "8px",
            backgroundColor: analyzed ? NAVY : "#D8D8D8",
            border: "none",
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            color: "#FFFFFF",
            cursor: analyzed ? "pointer" : "default",
            transition: "background-color 0.2s ease",
          }}
        >
          Generate Invoice
        </button>
        <button
          type="button"
          onClick={onSaveDraft}
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
          Save Draft
        </button>
      </div>
    </div>
  );
};
