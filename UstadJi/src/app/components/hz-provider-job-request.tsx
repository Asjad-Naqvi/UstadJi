import React, { useState, useEffect } from "react";
import { ArrowLeft, Clock, Play, Pause, FileText, MessageSquare, Image, Mic, Video, Headphones, Zap, X, ChevronRight } from "lucide-react";

/* ─── AI Booking components ─── */
const NAVY = "#161533";
const GREEN = "#4CAF84";
const BG = "#FAF8F5";
const BORDER = "#E8E3DB";


const ClearPhotoThumb: React.FC = () => (
  <div style={{ width: "100%", height: "90px", borderRadius: "8px", background: "linear-gradient(155deg, #0d2137 0%, #1a3d5c 45%, #1d5a82 100%)", overflow: "hidden", position: "relative" }}>
    <svg style={{ position: "absolute", top: "8px", left: "10px" }} width="70" height="50" viewBox="0 0 70 50" fill="none" aria-hidden="true">
      <rect x="4" y="20" width="48" height="10" rx="3" fill="#7BAFD4" />
      <rect x="42" y="20" width="10" height="26" rx="3" fill="#5A8FB8" />
      <ellipse cx="47" cy="47" rx="3" ry="4" fill="rgba(120,200,255,0.7)" />
    </svg>
    <div style={{ position: "absolute", bottom: "6px", right: "8px", backgroundColor: "rgba(0,0,0,0.5)", borderRadius: "4px", padding: "2px 6px" }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#FFFFFF", fontWeight: 500 }}>📷 Kitchen Sink</span>
    </div>
  </div>
);

const VoiceEntry: React.FC<{ playing: boolean; onToggle: () => void }> = ({ playing, onToggle }) => {
  const bars = [3, 5, 8, 6, 10, 7, 9, 5, 8, 6, 4, 7, 9, 5, 8];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: BG, borderRadius: "10px", padding: "10px 12px", border: `1px solid ${BORDER}` }}>
      <button type="button" onClick={onToggle} aria-label={playing ? "Pause" : "Play"} style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: NAVY, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
        {playing ? <Pause size={12} color="#FFFFFF" /> : <Play size={12} color="#FFFFFF" style={{ marginLeft: "2px" }} />}
      </button>
      <svg width="90" height="20" viewBox="0 0 90 20" aria-hidden="true">
        {bars.map((h, i) => (
          <rect key={i} x={i * 6 + 2} y={(20 - h * 1.6) / 2} width="4" height={h * 1.6} rx="2" fill={playing && i < 5 ? GREEN : NAVY} opacity={0.5} />
        ))}
      </svg>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#9B9B9B", flexShrink: 0 }}>0:18</span>
    </div>
  );
};

const VideoEntry: React.FC = () => (
  <div style={{ height: "70px", borderRadius: "8px", background: "linear-gradient(145deg, #0a1628 0%, #1a2a40 100%)", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Play size={13} color="#FFFFFF" style={{ marginLeft: "2px" }} aria-hidden="true" />
      </div>
    </div>
    <div style={{ position: "absolute", bottom: "6px", right: "8px", backgroundColor: "rgba(0,0,0,0.6)", borderRadius: "4px", padding: "2px 6px" }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "#FFFFFF" }}>0:12</span>
    </div>
    <div style={{ position: "absolute", top: "6px", left: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
      <Video size={10} color="rgba(255,255,255,0.6)" aria-hidden="true" />
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.6)" }}>Video</span>
    </div>
  </div>
);

/* ─── Countdown hook ─── */
function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [seconds]);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const mmDisplay = Math.floor(seconds / 60);
  const ssDisplay = seconds % 60;
  return { display: `${mm}:${ss}`, minutes: mmDisplay, secs: ssDisplay, seconds };
}

/* ─── Card shell ─── */
const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      backgroundColor: "#FFFFFF",
      borderRadius: "12px",
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.07)",
      border: "1px solid #E8E3DB",
      padding: "16px",
      ...style,
    }}
  >
    {children}
  </div>
);

/* ─── Card heading ─── */
const CardHeading: React.FC<{ title: string }> = ({ title }) => (
  <>
    <span
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "16px",
        fontWeight: 600,
        lineHeight: "22px",
        color: "#1A1A1A",
      }}
    >
      {title}
    </span>
    <div
      aria-hidden="true"
      style={{ height: "1px", backgroundColor: "#EFEFEF", margin: "8px 0" }}
    />
  </>
);

/* ─── Detail row ─── */
const DetailRow: React.FC<{
  label: string;
  value: React.ReactNode;
  last?: boolean;
  valueColor?: string;
  valueBold?: boolean;
}> = ({ label, value, last, valueColor = "#1A1A1A", valueBold }) => (
  <div
    style={{
      minHeight: "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: last ? "none" : "1px solid #EFEFEF",
      gap: "12px",
      paddingTop: "2px",
      paddingBottom: "2px",
    }}
  >
    <span
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "13px",
        fontWeight: 400,
        lineHeight: "18px",
        color: "#9B9B9B",
        flexShrink: 0,
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: valueBold ? "15px" : "14px",
        fontWeight: valueBold ? 600 : 400,
        lineHeight: "20px",
        color: valueColor,
        textAlign: "right",
      }}
    >
      {value}
    </span>
  </div>
);

/* ─── Decline reason sheet ─── */
const DECLINE_REASONS = [
  "Didn't match my skills",
  "Too far from my location",
  "Not available at this time",
  "Rate is too low",
  "Already have another job",
  "Other",
];

const DeclineSheet: React.FC<{ onConfirm: (reason: string) => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
      {/* Backdrop */}
      <div onClick={onCancel} aria-hidden="true"
        style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", zIndex: 40 }} />

      {/* Sheet */}
      <div role="dialog" aria-label="Decline job — select reason"
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 50, backgroundColor: "#FFFFFF", borderRadius: "20px 20px 0 0", display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Handle */}
        <div style={{ paddingTop: "10px", paddingBottom: "2px", display: "flex", justifyContent: "center", flexShrink: 0 }}>
          <div style={{ width: "36px", height: "4px", borderRadius: "2px", backgroundColor: "#E0DDD8" }} />
        </div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 4px" }}>
          <div>
            <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "17px", fontWeight: 600, color: "#1A1A1A" }}>Decline Job</p>
            <p style={{ margin: "2px 0 0", fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#9B9B9B" }}>Please tell us why you're declining</p>
          </div>
          <button type="button" onClick={onCancel} aria-label="Close"
            style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#F0EDE8", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={15} color="#555555" aria-hidden="true" />
          </button>
        </div>

        {/* Reasons */}
        <div style={{ padding: "10px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {DECLINE_REASONS.map((reason) => {
            const isSelected = selected === reason;
            return (
              <button key={reason} type="button" onClick={() => setSelected(reason)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 14px", borderRadius: "12px", cursor: "pointer",
                  backgroundColor: isSelected ? "#EEEEF5" : "#FAF8F5",
                  border: isSelected ? `1.5px solid ${NAVY}` : "1.5px solid transparent",
                  fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? NAVY : "#1A1A1A", textAlign: "left",
                  transition: "border-color 0.12s, background-color 0.12s",
                }}>
                {reason}
                <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${isSelected ? NAVY : "#CECECE"}`, backgroundColor: isSelected ? NAVY : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.12s" }}>
                  {isSelected && <div style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#FFFFFF" }} />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Confirm button */}
        <div style={{ padding: "8px 16px 24px" }}>
          <button type="button" onClick={() => selected && onConfirm(selected)} disabled={!selected}
            style={{
              width: "100%", height: "52px", borderRadius: "14px", border: "none", cursor: selected ? "pointer" : "default",
              backgroundColor: selected ? "#D94F4F" : "#E8E3DB",
              fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 600,
              color: selected ? "#FFFFFF" : "#AAAAAA",
              transition: "background-color 0.15s",
            }}>
            Confirm Decline
          </button>
        </div>
      </div>
    </>
  );
};

/* ─── Main screen ─── */
interface HzProviderJobRequestProps {
  onBack?: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
  onMessageCustomer?: () => void;
  aiBooking?: boolean;
  preferredLanguage?: "english" | "urdu" | "roman-urdu";
}

export const HzProviderJobRequest: React.FC<HzProviderJobRequestProps> = ({
  onBack,
  onAccept,
  onDecline,
  onMessageCustomer,
  aiBooking = false,
  preferredLanguage = "english",
}) => {
  const { display, minutes, secs, seconds } = useCountdown(683);
  const isLow = seconds <= 300;
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [summaryAudioPlaying, setSummaryAudioPlaying] = useState(false);
  const [showDeclineSheet, setShowDeclineSheet] = useState(false);

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
      <div
        aria-hidden="true"
        style={{ height: "24px", flexShrink: 0, backgroundColor: "#FFFFFF" }}
      />

      {/* Top app bar */}
      <header
        style={{
          height: "56px",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #EFEFEF",
          display: "flex",
          alignItems: "center",
          paddingLeft: "4px",
          paddingRight: "12px",
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
            flexShrink: 0,
          }}
        >
          <ArrowLeft size={24} color="#1A1A1A" aria-hidden="true" />
        </button>

        <span
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
            fontSize: "17px",
            fontWeight: 600,
            lineHeight: "22px",
            color: "#1A1A1A",
            pointerEvents: "none",
          }}
        >
          Job Request
        </span>

        {/* Countdown pill */}
        <span
          role="timer"
          aria-live="polite"
          aria-label={`${display} remaining`}
          style={{
            marginLeft: "auto",
            display: "inline-flex",
            alignItems: "center",
            height: "26px",
            paddingLeft: "10px",
            paddingRight: "10px",
            borderRadius: "13px",
            backgroundColor: isLow ? "#E8872A" : "#161533",
            fontFamily: "Inter, sans-serif",
            fontSize: "12px",
            fontWeight: 500,
            lineHeight: "16px",
            color: "#FFFFFF",
            whiteSpace: "nowrap",
            fontVariantNumeric: "tabular-nums",
            transition: "background-color 0.4s ease",
            flexShrink: 0,
          }}
        >
          {display} remaining
        </span>
      </header>

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          paddingLeft: "16px",
          paddingRight: "16px",
          paddingTop: "16px",
          paddingBottom: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* ── AI Booking: Structured Service Request Summary ── */}
        {aiBooking ? (
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "14px", border: `1.5px solid ${NAVY}`, overflow: "hidden", boxShadow: "0px 2px 10px rgba(22,21,51,0.10)" }}>
            {/* Navy header */}
            <div style={{ backgroundColor: NAVY, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FileText size={14} color="#FFFFFF" aria-hidden="true" />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 600, color: "#FFFFFF", letterSpacing: "0.5px", textTransform: "uppercase" }}>Service Request Summary</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", backgroundColor: "rgba(255,255,255,0.12)", borderRadius: "10px", paddingLeft: "8px", paddingRight: "8px", height: "22px" }}>
                <Zap size={10} color="#FFFFFF" aria-hidden="true" />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 500, color: "rgba(255,255,255,0.85)" }}>AI Generated</span>
              </div>
            </div>

            {/* Summary rows */}
            <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                { label: "Service",  value: "Plumbing" },
                { label: "Problem",  value: "Continuous leak underneath kitchen sink" },
                { label: "Urgency",  value: "Needs attention soon" },
                { label: "Location", value: "Islamabad" },
                { label: "Date",     value: "Saturday, 18 May 2025" },
                { label: "Time",     value: "9:00 AM" },
              ].map(({ label, value }, i, arr) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", paddingTop: "8px", paddingBottom: "8px", borderBottom: i < arr.length - 1 ? "1px solid #F0EDE8" : "none" }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9B9B9B", flexShrink: 0 }}>{label}</span>
                  <span style={{
                    fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 600, color:
                      label === "Problem" ? "#D94F4F" : label === "Urgency" ? "#E8872A" : "#1A1A1A",
                    textAlign: "right",
                  }}>{value}</span>
                </div>
              ))}

              {/* Details paragraph */}
              <div style={{ paddingTop: "8px", paddingBottom: "8px", borderBottom: "1px solid #F0EDE8" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9B9B9B" }}>Details</span>
                <p style={{ margin: "3px 0 0", fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#1A1A1A", lineHeight: "17px" }}>
                  Continuous water leakage from the pipe connection underneath the kitchen sink. Water is collecting on the floor.
                </p>
              </div>

              {/* Customer Inputs */}
              <div style={{ paddingTop: "8px" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9B9B9B" }}>Customer Inputs</span>
                <div style={{ display: "flex", gap: "6px", marginTop: "6px", flexWrap: "wrap" }}>
                  {["💬 Text", "📷 Photo", "🎤 Voice", "🎥 Video"].map((label) => (
                    <span key={label} style={{ display: "inline-flex", alignItems: "center", height: "22px", paddingLeft: "8px", paddingRight: "8px", borderRadius: "20px", backgroundColor: BG, border: `1px solid ${BORDER}`, fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#555555" }}>{label}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Listen button */}
            <div style={{ borderTop: "1px solid #F0EDE8", padding: "10px 14px", display: "flex", gap: "8px" }}>
              <button type="button" onClick={() => setSummaryAudioPlaying((p) => !p)}
                style={{ flex: 1, height: "34px", borderRadius: "8px", backgroundColor: summaryAudioPlaying ? NAVY : BG, border: `1px solid ${summaryAudioPlaying ? NAVY : BORDER}`, fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 500, color: summaryAudioPlaying ? "#FFFFFF" : "#1A1A1A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                {summaryAudioPlaying ? <Pause size={12} color="#FFFFFF" /> : <Headphones size={12} color={NAVY} />}
                {summaryAudioPlaying ? "Pause" : "Listen to Summary"} · 0:28
              </button>
            </div>
            {summaryAudioPlaying && (
              <div style={{ margin: "0 14px 12px", padding: "10px 12px", backgroundColor: NAVY, borderRadius: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
                <button type="button" onClick={() => setSummaryAudioPlaying(false)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                  <Pause size={14} color="#FFFFFF" aria-hidden="true" />
                </button>
                <div style={{ flex: 1, height: "3px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "2px" }}>
                  <div style={{ width: "35%", height: "100%", backgroundColor: GREEN, borderRadius: "2px" }} />
                </div>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.7)", flexShrink: 0 }}>0:10 / 0:28</span>
              </div>
            )}
          </div>
        ) : (
          /* ── Standard (non-AI) job details ── */
          <Card>
            <CardHeading title="Job Details" />
            <DetailRow label="Service" value="AC Repairing" />
            <DetailRow
              label="Complexity"
              value={
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  Complex
                  <span aria-hidden="true" style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#161533", flexShrink: 0 }} />
                </span>
              }
            />
            <DetailRow label="Sector"          value="G-13, Islamabad" />
            <DetailRow label="Date"            value="Saturday, 18 May 2025" />
            <DetailRow label="Time"            value="9:00 AM" />
            <DetailRow label="Consumer Rating" value="★ 4.7 (12 bookings)" last />
          </Card>
        )}

        {/* Original Customer Inputs — only shown for AI bookings */}
        {aiBooking && (
          <Card>
            <CardHeading title="Original Customer Inputs" />
            {/* Text */}
            <div style={{ paddingBottom: "12px", borderBottom: "1px solid #F0EDE8", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                <MessageSquare size={13} color="#9B9B9B" aria-hidden="true" />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.5px" }}>Original Description</span>
              </div>
              <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "13px", lineHeight: "19px", color: "#1A1A1A", fontStyle: "italic" }}>
                "There is water leaking under my kitchen sink since this morning."
              </p>
            </div>
            {/* Photo */}
            <div style={{ paddingBottom: "12px", borderBottom: "1px solid #F0EDE8", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                <Image size={13} color="#9B9B9B" aria-hidden="true" />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.5px" }}>Customer Photo</span>
              </div>
              <ClearPhotoThumb />
            </div>
            {/* Voice */}
            <div style={{ paddingBottom: "12px", borderBottom: "1px solid #F0EDE8", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                <Mic size={13} color="#9B9B9B" aria-hidden="true" />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.5px" }}>Original Voice Message</span>
              </div>
              <VoiceEntry playing={voicePlaying} onToggle={() => setVoicePlaying((p) => !p)} />
              <p style={{ margin: "6px 0 0", fontFamily: "Inter, sans-serif", fontSize: "11px", fontStyle: "italic", color: "#9B9B9B", lineHeight: "15px" }}>
                "Bhai, pani bohat zyada nikal raha hai aur neeche floor bhi geela ho raha hai."
              </p>
            </div>
            {/* Video */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                <Video size={13} color="#9B9B9B" aria-hidden="true" />
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.5px" }}>Customer Video</span>
              </div>
              <VideoEntry />
            </div>
          </Card>
        )}

        {/* Pricing breakdown card */}
        <Card>
          <CardHeading title="Your Earnings" />
          <DetailRow label="Your Base Rate"         value="PKR 2,800" />
          <DetailRow label="Complexity Adjustment"  value="+ PKR 0" />
          <DetailRow label="Your Earnings"          value="PKR 2,800" valueBold last />

          <div
            aria-hidden="true"
            style={{ height: "2px", backgroundColor: "#EFEFEF", margin: "8px 0" }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 400,
                lineHeight: "18px",
                color: "#9B9B9B",
                flex: 1,
              }}
            >
              Ustaad G Subsidy (covers consumer discount)
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "20px",
                color: "#4CAF84",
                flexShrink: 0,
              }}
            >
              + PKR 151
            </span>
          </div>

          <p
            style={{
              margin: 0,
              marginTop: "4px",
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              fontWeight: 400,
              fontStyle: "italic",
              lineHeight: "16px",
              color: "#9B9B9B",
            }}
          >
            Your total payout: PKR 2,800. Consumer pays PKR 2,873.
          </p>
        </Card>

        {/* Consumer info card */}
        <Card>
          <CardHeading title="Consumer Info" />
          <DetailRow label="Name"            value="Sana M." />
          <DetailRow label="Flags / Disputes" value="None" valueColor="#4CAF84" last />
          <p
            style={{
              margin: 0,
              marginTop: "8px",
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              fontWeight: 400,
              fontStyle: "italic",
              lineHeight: "16px",
              color: "#9B9B9B",
            }}
          >
            Full address revealed only after you accept.
          </p>
        </Card>

        {/* Countdown reminder banner */}
        <div
          role="note"
          style={{
            backgroundColor: "#FFF4E0",
            border: "1px solid #161533",
            borderRadius: "12px",
            padding: "16px",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <Clock
            size={20}
            color="#161533"
            aria-hidden="true"
            style={{ flexShrink: 0, marginTop: "1px" }}
          />
          <p
            style={{
              margin: 0,
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: 400,
              lineHeight: "18px",
              color: "#1A1A1A",
            }}
          >
            You have {minutes} minute{minutes !== 1 ? "s" : ""} {secs} second{secs !== 1 ? "s" : ""} to respond. Auto-declines if no action.
          </p>
        </div>
      </div>

      {/* Bottom action bar */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid #EFEFEF",
          padding: "10px 16px 14px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="button"
            onClick={onAccept}
            style={{
              flex: 2,
              height: "52px",
              borderRadius: "12px",
              backgroundColor: "#161533",
              border: "none",
              fontFamily: "Inter, sans-serif",
              fontSize: "15px",
              fontWeight: 600,
              color: "#FFFFFF",
              cursor: "pointer",
            }}
          >
            Accept Job
          </button>
          <button
            type="button"
            onClick={() => setShowDeclineSheet(true)}
            style={{
              flex: 1,
              height: "52px",
              borderRadius: "12px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #D94F4F",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              color: "#D94F4F",
              cursor: "pointer",
            }}
          >
            Decline
          </button>
        </div>
        <button
          type="button"
          onClick={onMessageCustomer}
          style={{
            width: "100%",
            height: "42px",
            borderRadius: "10px",
            backgroundColor: "#EEEEF5",
            border: "1px solid rgba(22,21,51,0.12)",
            fontFamily: "Inter, sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            color: "#161533",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "7px",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#161533" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Message Customer
        </button>
      </div>

      {/* Decline reason sheet */}
      {showDeclineSheet && (
        <DeclineSheet
          onCancel={() => setShowDeclineSheet(false)}
          onConfirm={() => {
            setShowDeclineSheet(false);
            onDecline?.();
          }}
        />
      )}
    </div>
  );
};
