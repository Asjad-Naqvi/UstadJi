import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

const NAVY  = "#161533";
const BG    = "#FFFFFF";
const PAGE  = "#F7F7F8";
const BORDER = "#E8E3DB";
const MUTED  = "#9B9B9B";
const ACCENT_BG  = "#EEF2FF";
const ACCENT_BORDER = "#C7D2FE";

/* ─── 1–10 row selector ─── */
const ScoreSelector: React.FC<{
  label: string;
  question?: string;
  score: number;
  onChange: (n: number) => void;
}> = ({ label, question, score, onChange }) => (
  <div style={{ paddingTop: "16px", paddingBottom: "16px", borderBottom: `1px solid ${BORDER}` }}>
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: question ? "2px" : "10px" }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, color: "#1A1A1A" }}>
        {label}
      </span>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 700, color: score > 0 ? NAVY : MUTED, minWidth: "36px", textAlign: "right" }}>
        {score > 0 ? `${score} / 10` : "—"}
      </span>
    </div>
    {question && (
      <p style={{ margin: "0 0 10px", fontFamily: "Inter, sans-serif", fontSize: "12px", color: MUTED }}>
        {question}
      </p>
    )}
    <div role="radiogroup" aria-label={`${label} score`}
      style={{ display: "flex", gap: "6px" }}>
      {Array.from({ length: 10 }, (_, i) => {
        const v = i + 1;
        const sel = v === score;
        const filled = v <= score;
        return (
          <button key={v} type="button" role="radio" aria-checked={sel}
            aria-label={`${v}`} onClick={() => onChange(v)}
            style={{
              flex: 1, height: "32px", borderRadius: "6px", border: "none", padding: 0, cursor: "pointer",
              backgroundColor: sel ? NAVY : filled ? "#C7CDDE" : "#EBEBEB",
              fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: sel ? 700 : 400,
              color: filled ? "#FFFFFF" : "#9B9B9B",
              transform: sel ? "scaleY(1.08)" : "scaleY(1)",
              transition: "background-color 0.1s, transform 0.1s",
            }}>
            {v}
          </button>
        );
      })}
    </div>
  </div>
);

/* ─── Props ─── */
interface HzProviderRateConsumerProps {
  onBack?: () => void;
  onSubmit?: () => void;
  onSkip?: () => void;
  onNavigateToInvoice?: () => void;
}

export const HzProviderRateConsumer: React.FC<HzProviderRateConsumerProps> = ({
  onBack,
  onSubmit,
  onSkip,
  onNavigateToInvoice,
}) => {
  const [scores, setScores] = useState({ punctuality: 0, behaviour: 0, instructions: 0, payment: 0 });
  const [note, setNote] = useState("");

  const set = (k: keyof typeof scores) => (v: number) => setScores(p => ({ ...p, [k]: v }));

  const rated = Object.values(scores).filter(v => v > 0);
  const average = rated.length > 0
    ? rated.reduce((a, b) => a + b, 0) / rated.length
    : null;

  const allRated = rated.length === 4;
  const handlePrimary = onNavigateToInvoice ?? onSubmit;

  const DIMENSIONS: { key: keyof typeof scores; label: string; question: string }[] = [
    { key: "punctuality",  label: "Punctuality",         question: "Was the consumer on time?" },
    { key: "behaviour",    label: "Behaviour",            question: "Were they respectful and cooperative?" },
    { key: "instructions", label: "Clear Instructions",  question: "Did they explain the job clearly?" },
    { key: "payment",      label: "Payment Promptness",  question: "Was payment made promptly?" },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: PAGE, overflow: "hidden" }}>

      {/* Status bar */}
      <div aria-hidden="true" style={{ height: "24px", flexShrink: 0, backgroundColor: BG }} />

      {/* Header */}
      <header style={{ height: "56px", backgroundColor: BG, borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", paddingLeft: "4px", paddingRight: "16px", flexShrink: 0, position: "relative" }}>
        <button type="button" onClick={onBack ?? onSkip} aria-label="Go back"
          style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
          <ArrowLeft size={22} color="#1A1A1A" aria-hidden="true" />
        </button>
        <span style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: "17px", fontWeight: 600, color: "#1A1A1A", pointerEvents: "none" }}>
          Rate This Consumer
        </span>
        <button type="button" onClick={onSkip} aria-label="Skip rating"
          style={{ marginLeft: "auto", background: "none", border: "none", padding: "8px 0", fontFamily: "Inter, sans-serif", fontSize: "14px", color: MUTED, cursor: "pointer", flexShrink: 0 }}>
          Skip
        </button>
      </header>

      {/* Scroll area */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "24px 16px 32px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Page heading */}
        <div>
          <h1 style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "22px", fontWeight: 700, color: "#1A1A1A" }}>
            How was Sana?
          </h1>
          <p style={{ margin: "6px 0 0", fontFamily: "Inter, sans-serif", fontSize: "14px", color: MUTED }}>
            Rate the consumer to help future providers.
          </p>
        </div>

        {/* Rating card */}
        <div style={{ backgroundColor: BG, borderRadius: "14px", border: `1px solid ${BORDER}`, padding: "0 16px", overflow: "hidden" }}>
          {DIMENSIONS.map(({ key, label, question }, i) => (
            <div key={key} style={{ borderBottom: i < 3 ? `1px solid #F0EDE8` : "none" }}>
              <ScoreSelector
                label={label}
                question={question}
                score={scores[key]}
                onChange={set(key)}
              />
            </div>
          ))}
        </div>

        {/* Score summary */}
        {average !== null && (
          <div style={{ backgroundColor: ACCENT_BG, borderRadius: "12px", border: `1px solid ${ACCENT_BORDER}`, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 500, color: NAVY }}>
              Consumer Score
            </span>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "20px", fontWeight: 700, color: NAVY }}>
              {average.toFixed(1)}<span style={{ fontSize: "13px", fontWeight: 400, color: "#6B7280" }}> / 10</span>
            </span>
          </div>
        )}

        {/* Private note */}
        <div style={{ backgroundColor: BG, borderRadius: "14px", border: `1px solid ${BORDER}`, padding: "16px" }}>
          <p style={{ margin: "0 0 4px", fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, color: "#1A1A1A" }}>
            Leave a note for other providers
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 400, color: MUTED }}> (Optional)</span>
          </p>
          <p style={{ margin: "0 0 10px", fontFamily: "Inter, sans-serif", fontSize: "12px", color: MUTED }}>
            Visible only to future Ustaad G providers.
          </p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write a short note about the consumer..."
            aria-label="Note for other providers"
            style={{
              display: "block", width: "100%", height: "96px", borderRadius: "10px",
              backgroundColor: PAGE, border: `1.5px solid ${BORDER}`,
              padding: "12px 14px", fontFamily: "Inter, sans-serif", fontSize: "14px",
              lineHeight: "20px", color: "#1A1A1A", resize: "none", outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button type="button" onClick={handlePrimary}
            style={{
              width: "100%", height: "52px", borderRadius: "14px", border: "none",
              backgroundColor: NAVY, fontFamily: "Inter, sans-serif", fontSize: "15px",
              fontWeight: 600, color: BG, cursor: "pointer",
            }}>
            Submit Review &amp; Generate Invoice
          </button>
          <button type="button" onClick={onBack ?? onSkip}
            style={{
              width: "100%", height: "40px", background: "none", border: "none",
              fontFamily: "Inter, sans-serif", fontSize: "14px", color: MUTED,
              cursor: "pointer",
            }}>
            Back to Job Details
          </button>
        </div>
      </div>
    </div>
  );
};
