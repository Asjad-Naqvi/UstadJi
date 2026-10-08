import React, { useState, useEffect } from "react";
import { Bell, Info, BarChart2, Home, User, ChevronLeft, FileText, Play, Pause, Video, X, Zap, Mic, Image as ImageIcon, MessageSquare, ChevronRight } from "lucide-react";
import type { ProviderJobPref } from "./hz-provider-job-preferences-screen";

const NAVY   = "#161533";
const GREEN  = "#4CAF84";
const BG     = "#FAF8F5";
const BORDER = "#E8E3DB";

/* ─── Match badge ─── */
const JOB_MATCH_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Near your preferred area": { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  "Higher-value booking":     { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0" },
  "Fits your availability":   { bg: "#F5F3FF", text: "#6D28D9", border: "#DDD6FE" },
  "Urgent request":           { bg: "#FFF1F2", text: "#9F1239", border: "#FECDD3" },
};

const MatchBadge: React.FC<{ label: string }> = ({ label }) => {
  const colors = JOB_MATCH_COLORS[label] ?? { bg: BG, text: "#555555", border: BORDER };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", height: "20px", paddingLeft: "8px", paddingRight: "8px", borderRadius: "10px", backgroundColor: colors.bg, border: `1px solid ${colors.border}`, fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: colors.text, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
};

type ProviderTab = "dashboard" | "inbox" | "profile";

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
  return { display: `${mm}:${ss}`, seconds };
}

const CountdownPill: React.FC<{ initialSeconds: number }> = ({ initialSeconds }) => {
  const { display, seconds } = useCountdown(initialSeconds);
  const isLow = seconds <= 300;
  return (
    <span role="timer" aria-live="polite" aria-label={`${display} remaining`}
      style={{ display: "inline-flex", alignItems: "center", height: "22px", paddingLeft: "8px", paddingRight: "8px", borderRadius: "11px", backgroundColor: isLow ? "#E8872A" : NAVY, fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 500, color: "#FFFFFF", whiteSpace: "nowrap", flexShrink: 0, transition: "background-color 0.4s ease", fontVariantNumeric: "tabular-nums" }}>
      {display} remaining
    </span>
  );
};

/* ─── Summary sheet media components ─── */
const PhotoThumb: React.FC = () => (
  <div style={{ width: "100%", height: "100px", borderRadius: "8px", background: "linear-gradient(155deg, #0d2137 0%, #1a3d5c 45%, #1d5a82 100%)", overflow: "hidden", position: "relative", flexShrink: 0 }}>
    <svg style={{ position: "absolute", top: "10px", left: "12px" }} width="70" height="50" viewBox="0 0 70 50" fill="none" aria-hidden="true">
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
      <button type="button" onClick={onToggle} aria-label={playing ? "Pause" : "Play"}
        style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: NAVY, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
        {playing ? <Pause size={11} color="#FFFFFF" /> : <Play size={11} color="#FFFFFF" style={{ marginLeft: "2px" }} />}
      </button>
      <svg width="90" height="20" viewBox="0 0 90 20" aria-hidden="true">
        {bars.map((h, i) => (
          <rect key={i} x={i * 6 + 2} y={(20 - h * 1.6) / 2} width="4" height={h * 1.6} rx="2" fill={playing && i < 5 ? GREEN : NAVY} opacity={0.5} />
        ))}
      </svg>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#9B9B9B", flexShrink: 0 }}>0:18</span>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#9B9B9B", flex: 1, fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        "Bhai, pani bohat zyada nikal raha hai…"
      </span>
    </div>
  );
};

const VideoThumb: React.FC = () => (
  <div style={{ height: "80px", borderRadius: "8px", background: "linear-gradient(145deg, #0a1628 0%, #1a2a40 100%)", position: "relative", overflow: "hidden" }}>
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

/* ─── Job Summary Bottom Sheet ─── */
const JobSummarySheet: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [voicePlaying, setVoicePlaying] = useState(false);

  const rows = [
    { label: "Service",  value: "Plumbing",                                          color: "#1A1A1A" },
    { label: "Problem",  value: "Continuous leak underneath kitchen sink",            color: "#D94F4F" },
    { label: "Urgency",  value: "Needs attention soon",                              color: "#E8872A" },
    { label: "Location", value: "Islamabad",                                         color: "#1A1A1A" },
    { label: "Date",     value: "Saturday, 18 May 2025",                             color: "#1A1A1A" },
    { label: "Time",     value: "9:00 AM",                                           color: "#1A1A1A" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} aria-hidden="true"
        style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", zIndex: 40 }} />

      {/* Sheet */}
      <div
        role="dialog"
        aria-label="Job Summary"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: "#FFFFFF",
          borderRadius: "20px 20px 0 0",
          maxHeight: "88%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Sheet handle */}
        <div style={{ paddingTop: "10px", paddingBottom: "4px", display: "flex", justifyContent: "center", flexShrink: 0 }}>
          <div style={{ width: "36px", height: "4px", borderRadius: "2px", backgroundColor: "#E0DDD8" }} />
        </div>

        {/* Navy header */}
        <div style={{ backgroundColor: NAVY, margin: "8px 16px 0", borderRadius: "12px", padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FileText size={14} color="#FFFFFF" aria-hidden="true" />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 600, color: "#FFFFFF", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              Service Request Summary
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "rgba(255,255,255,0.12)", borderRadius: "10px", paddingLeft: "8px", paddingRight: "8px", height: "22px" }}>
              <Zap size={10} color="#FFFFFF" aria-hidden="true" />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 500, color: "rgba(255,255,255,0.85)" }}>AI Generated</span>
            </div>
            <button type="button" onClick={onClose} aria-label="Close"
              style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.15)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
              <X size={13} color="#FFFFFF" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px 24px" }}>

          {/* Structured rows */}
          <div style={{ backgroundColor: "#FAFAF9", borderRadius: "10px", border: `1px solid ${BORDER}`, overflow: "hidden", marginBottom: "14px" }}>
            {rows.map(({ label, value, color }, i) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", padding: "9px 12px", borderBottom: i < rows.length - 1 ? "1px solid #F0EDE8" : "none" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9B9B9B", flexShrink: 0 }}>{label}</span>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 600, color, textAlign: "right" }}>{value}</span>
              </div>
            ))}
            {/* Details */}
            <div style={{ padding: "9px 12px", borderTop: "1px solid #F0EDE8" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9B9B9B", display: "block", marginBottom: "3px" }}>Details</span>
              <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#1A1A1A", lineHeight: "17px" }}>
                Continuous water leakage from the pipe connection underneath the kitchen sink. Water is collecting on the floor.
              </p>
            </div>
          </div>

          {/* Customer Inputs */}
          <p style={{ margin: "0 0 10px", fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 600, color: "#1A1A1A", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Customer Inputs
          </p>

          {/* Original text */}
          <div style={{ marginBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "6px" }}>
              <MessageSquare size={12} color="#9B9B9B" aria-hidden="true" />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.4px" }}>Description</span>
            </div>
            <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "13px", lineHeight: "19px", color: "#1A1A1A", fontStyle: "italic", backgroundColor: BG, padding: "10px 12px", borderRadius: "8px", border: `1px solid ${BORDER}` }}>
              "There is water leaking under my kitchen sink since this morning."
            </p>
          </div>

          {/* Photo */}
          <div style={{ marginBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "6px" }}>
              <ImageIcon size={12} color="#9B9B9B" aria-hidden="true" />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.4px" }}>Photo</span>
            </div>
            <PhotoThumb />
          </div>

          {/* Voice */}
          <div style={{ marginBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "6px" }}>
              <Mic size={12} color="#9B9B9B" aria-hidden="true" />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.4px" }}>Voice Message</span>
            </div>
            <VoiceEntry playing={voicePlaying} onToggle={() => setVoicePlaying((p) => !p)} />
          </div>

          {/* Video */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "6px" }}>
              <Video size={12} color="#9B9B9B" aria-hidden="true" />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.4px" }}>Video</span>
            </div>
            <VideoThumb />
          </div>
        </div>
      </div>
    </>
  );
};

/* ─── Decline reason sheet ─── */
const DECLINE_REASONS = [
  "Didn't match my skills",
  "Too far from my location",
  "Not available at this time",
  "Rate is too low",
  "Already have another job",
  "Other",
];

const DeclineSheet: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <>
      <div onClick={onCancel} aria-hidden="true"
        style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", zIndex: 40 }} />
      <div role="dialog" aria-label="Decline job — select reason"
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 50, backgroundColor: "#FFFFFF", borderRadius: "20px 20px 0 0", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ paddingTop: "10px", paddingBottom: "2px", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "36px", height: "4px", borderRadius: "2px", backgroundColor: "#E0DDD8" }} />
        </div>
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
        <div style={{ padding: "10px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {DECLINE_REASONS.map((reason) => {
            const isSelected = selected === reason;
            return (
              <button key={reason} type="button" onClick={() => setSelected(reason)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: "12px", cursor: "pointer", backgroundColor: isSelected ? "#EEEEF5" : "#FAF8F5", border: isSelected ? `1.5px solid ${NAVY}` : "1.5px solid transparent", fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: isSelected ? 600 : 400, color: isSelected ? NAVY : "#1A1A1A", textAlign: "left", transition: "border-color 0.12s, background-color 0.12s" }}>
                {reason}
                <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${isSelected ? NAVY : "#CECECE"}`, backgroundColor: isSelected ? NAVY : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.12s" }}>
                  {isSelected && <div style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#FFFFFF" }} />}
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ padding: "8px 16px 24px" }}>
          <button type="button" onClick={() => selected && onConfirm()} disabled={!selected}
            style={{ width: "100%", height: "52px", borderRadius: "14px", border: "none", cursor: selected ? "pointer" : "default", backgroundColor: selected ? "#D94F4F" : "#E8E3DB", fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 600, color: selected ? "#FFFFFF" : "#AAAAAA", transition: "background-color 0.15s" }}>
            Confirm Decline
          </button>
        </div>
      </div>
    </>
  );
};

/* ─── Job request card ─── */
interface JobRequestCardProps {
  service: string;
  location: string;
  datetime: string;
  earn: string;
  consumerRating: string;
  countdownSeconds: number;
  matchBadges?: string[];
  hasAISummary?: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
  onPress?: () => void;
  onViewSummary?: () => void;
}

const JobRequestCard: React.FC<JobRequestCardProps> = ({
  service, location, datetime, earn, consumerRating, countdownSeconds,
  matchBadges = [], hasAISummary, onAccept, onDecline, onPress, onViewSummary,
}) => (
  <div
    role="article"
    aria-label={`Job request: ${service}`}
    onClick={onPress}
    style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", boxShadow: "0px 2px 10px rgba(0,0,0,0.09)", border: "1px solid #E8E3DB", borderLeft: "4px solid #161533", padding: "16px", cursor: "pointer" }}
  >
    {/* Top row */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 600, color: NAVY }}>New Job Request</span>
      <CountdownPill initialSeconds={countdownSeconds} />
    </div>

    {/* Service */}
    <p style={{ margin: "8px 0 0", fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 600, color: "#1A1A1A" }}>{service}</p>

    {/* Location + time */}
    <p style={{ margin: "4px 0 0", fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#9B9B9B" }}>{location} · {datetime}</p>

    {/* Earnings */}
    <p style={{ margin: "4px 0 0", display: "flex", alignItems: "baseline", gap: "4px", flexWrap: "wrap" }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 500, color: GREEN }}>Est. earn: {earn}</span>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9B9B9B" }}>(Ustaad G subsidy incl.)</span>
    </p>

    {/* Consumer rating */}
    <p style={{ margin: "4px 0 0", fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9B9B9B" }}>Consumer Rating: {consumerRating}</p>

    {/* View Job Summary link — AI bookings only */}
    {hasAISummary && (
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onViewSummary?.(); }}
        style={{ marginTop: "8px", display: "inline-flex", alignItems: "center", gap: "5px", background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 500, color: NAVY, textDecoration: "underline", textDecorationColor: "rgba(22,21,51,0.3)", textUnderlineOffset: "2px" }}
      >
        <FileText size={13} color={NAVY} aria-hidden="true" />
        View Job Summary
      </button>
    )}

    {/* Match badges */}
    {matchBadges.length > 0 && (
      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginTop: "8px" }}>
        {matchBadges.map((badge) => <MatchBadge key={badge} label={badge} />)}
      </div>
    )}

    {/* Divider + action buttons */}
    <div aria-hidden="true" style={{ height: "1px", backgroundColor: "#EFEFEF", marginTop: "12px" }} />
    <div style={{ marginTop: "12px", display: "flex", gap: "12px" }}>
      <button type="button" onClick={(e) => { e.stopPropagation(); onAccept?.(); }}
        style={{ flex: 1, height: "48px", borderRadius: "12px", backgroundColor: NAVY, border: "none", fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, color: "#FFFFFF", cursor: "pointer" }}>
        Accept
      </button>
      <button type="button" onClick={(e) => { e.stopPropagation(); onDecline?.(); }}
        style={{ flex: 1, height: "48px", borderRadius: "12px", backgroundColor: "#FFFFFF", border: "1px solid #D94F4F", fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 500, color: "#D94F4F", cursor: "pointer" }}>
        Decline
      </button>
    </div>
  </div>
);

/* ─── Section header ─── */
const SectionHeader: React.FC<{ title: string; badge?: number }> = ({ title, badge }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 600, color: "#1A1A1A" }}>{title}</span>
    {badge != null && (
      <span aria-label={`${badge} new`}
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "20px", height: "20px", borderRadius: "50%", backgroundColor: NAVY, fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, color: "#FFFFFF" }}>
        {badge}
      </span>
    )}
  </div>
);

/* ─── General notification row ─── */
const NotifRow: React.FC<{ icon: React.ReactNode; text: string; time: string; unread?: boolean; last?: boolean }> = ({ icon, text, time, unread, last }) => (
  <div style={{ minHeight: "56px", display: "flex", alignItems: "center", gap: "12px", backgroundColor: unread ? "#FFF9F4" : "#FFFFFF", borderBottom: last ? "none" : "1px solid #EFEFEF", paddingTop: "8px", paddingBottom: "8px", paddingLeft: "16px", paddingRight: "16px" }}>
    <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>{icon}</span>
    <span style={{ flex: 1, fontFamily: "Inter, sans-serif", fontSize: "14px", color: unread ? "#1A1A1A" : "#9B9B9B" }}>{text}</span>
    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#9B9B9B", flexShrink: 0 }}>{time}</span>
  </div>
);

/* ─── Bottom nav ─── */
const ProviderBottomNav: React.FC<{ active: ProviderTab; onChange: (tab: ProviderTab) => void }> = ({ active, onChange }) => {
  const tabs: { id: ProviderTab; label: string; badge?: number }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "inbox",     label: "Inbox",    badge: 2 },
    { id: "profile",   label: "Profile" },
  ];
  return (
    <nav aria-label="Provider navigation" style={{ height: "64px", backgroundColor: "#FFFFFF", borderTop: "1px solid #EFEFEF", display: "flex", flexShrink: 0 }}>
      {tabs.map(({ id, label, badge }) => {
        const isActive = id === active;
        const color = isActive ? NAVY : "#9B9B9B";
        return (
          <button key={id} type="button" onClick={() => onChange(id)} aria-current={isActive ? "page" : undefined} aria-label={label}
            style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", backgroundColor: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
            <div style={{ position: "relative", display: "inline-flex" }}>
              {id === "dashboard" && <Home size={24} color={color} aria-hidden="true" />}
              {id === "inbox"     && <Bell size={24} color={color} aria-hidden="true" />}
              {id === "profile"   && <User size={24} color={color} aria-hidden="true" />}
              {badge != null && (
                <span aria-hidden="true" style={{ position: "absolute", top: "-4px", right: "-6px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: NAVY, fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {badge}
                </span>
              )}
            </div>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: isActive ? 500 : 400, color }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
};

/* ─── Badge helper ─── */
function getJobMatchBadges(
  job: { isNearby: boolean; isHighValue: boolean; fitsAvailability: boolean; isUrgent: boolean },
  prefs: ProviderJobPref[]
): string[] {
  const badges: string[] = [];
  if (prefs.includes("near-me")           && job.isNearby)         badges.push("Near your preferred area");
  if (prefs.includes("higher-paying")     && job.isHighValue)      badges.push("Higher-value booking");
  if (prefs.includes("fits-availability") && job.fitsAvailability) badges.push("Fits your availability");
  if (prefs.includes("urgent")            && job.isUrgent)         badges.push("Urgent request");
  return badges;
}

/* ─── Main screen ─── */
interface HzProviderInboxProps {
  onBack?: () => void;
  onViewJobRequest?: () => void;
  onAcceptJob?: () => void;
  providerJobPrefs?: ProviderJobPref[];
}

export const HzProviderInbox: React.FC<HzProviderInboxProps> = ({ onBack, onViewJobRequest, onAcceptJob, providerJobPrefs = [] }) => {
  const [activeTab, setActiveTab] = useState<ProviderTab>("inbox");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [declineTarget, setDeclineTarget] = useState<string | null>(null);
  const [declined, setDeclined] = useState<Set<string>>(new Set());

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: BG, overflow: "hidden", position: "relative" }}>
      {/* Status bar */}
      <div aria-hidden="true" style={{ height: "24px", flexShrink: 0, backgroundColor: "#FFFFFF" }} />

      {/* Top app bar */}
      <header style={{ height: "56px", backgroundColor: "#FFFFFF", borderBottom: "1px solid #EFEFEF", display: "flex", alignItems: "center", paddingLeft: "16px", paddingRight: "16px", flexShrink: 0, position: "relative" }}>
        <button type="button" onClick={onBack} aria-label="Back"
          style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
          <ChevronLeft size={24} color="#1A1A1A" aria-hidden="true" />
        </button>
        <span style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: "17px", fontWeight: 600, color: "#1A1A1A", pointerEvents: "none" }}>
          Inbox
        </span>
        <button type="button"
          style={{ marginLeft: "auto", background: "none", border: "none", padding: "4px", fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 500, color: NAVY, cursor: "pointer", whiteSpace: "nowrap" }}>
          Mark all read
        </button>
      </header>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingBottom: "24px" }}>
        {/* New Job Requests */}
        {(() => {
          const jobs = [
            { id: "AC Repairing",  service: "AC Repairing",  location: "G-13, Islamabad", datetime: "Tomorrow 9:00 AM",    earn: "PKR 2,873", consumerRating: "★ 4.7", countdownSeconds: 683, hasAISummary: true,  isNearby: true,  isHighValue: true,  fitsAvailability: true,  isUrgent: false },
            { id: "Sofa Cleaning", service: "Sofa Cleaning", location: "F-7, Islamabad",  datetime: "Mon 20 May · 11 AM", earn: "PKR 1,500", consumerRating: "★ 4.9", countdownSeconds: 291, hasAISummary: false, isNearby: false, isHighValue: false, fitsAvailability: true,  isUrgent: true  },
          ].filter(j => !declined.has(j.id));

          return (
            <div style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "16px" }}>
              <SectionHeader title="New Job Requests" badge={jobs.length > 0 ? jobs.length : undefined} />
              {jobs.length === 0 ? (
                <p style={{ marginTop: "16px", fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#9B9B9B", textAlign: "center" }}>
                  No new job requests.
                </p>
              ) : (
                <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {jobs.map(j => (
                    <JobRequestCard
                      key={j.id}
                      service={j.service}
                      location={j.location}
                      datetime={j.datetime}
                      earn={j.earn}
                      consumerRating={j.consumerRating}
                      countdownSeconds={j.countdownSeconds}
                      hasAISummary={j.hasAISummary}
                      matchBadges={getJobMatchBadges({ isNearby: j.isNearby, isHighValue: j.isHighValue, fitsAvailability: j.fitsAvailability, isUrgent: j.isUrgent }, providerJobPrefs)}
                      onAccept={onAcceptJob}
                      onDecline={() => setDeclineTarget(j.id)}
                      onPress={onViewJobRequest}
                      onViewSummary={j.hasAISummary ? () => setSummaryOpen(true) : undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* Other Notifications */}
        <div style={{ paddingLeft: "16px", paddingRight: "16px", marginTop: "24px" }}>
          <SectionHeader title="Other Notifications" />
        </div>
        <div style={{ marginTop: "12px" }}>
          <NotifRow icon={<Bell size={20} color={NAVY} aria-hidden="true" />} text="Consumer Sana Malik left you a 4.8 rating." time="2h ago" unread />
          <NotifRow icon={<Info size={20} color="#9B9B9B" aria-hidden="true" />} text="Your availability for Sunday has been updated." time="Yesterday" />
          <NotifRow icon={<BarChart2 size={20} color="#9B9B9B" aria-hidden="true" />} text="Ustaad G Advisor: High AC Repair demand in G-10 this weekend." time="2d ago" last />
        </div>
      </div>

      {/* Bottom navigation */}
      <ProviderBottomNav active={activeTab} onChange={setActiveTab} />

      {/* Job Summary Sheet */}
      {summaryOpen && <JobSummarySheet onClose={() => setSummaryOpen(false)} />}

      {/* Decline Sheet */}
      {declineTarget && (
        <DeclineSheet
          onCancel={() => setDeclineTarget(null)}
          onConfirm={() => {
            setDeclined(prev => new Set([...prev, declineTarget]));
            setDeclineTarget(null);
          }}
        />
      )}
    </div>
  );
};
