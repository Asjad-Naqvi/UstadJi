import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, Mic, Camera, Video, Send, Play, Pause,
  Check, Edit3, Zap, FileText, Headphones, Bot,
} from "lucide-react";

const NAVY = "#161533";
const GREEN = "#4CAF84";
const BG = "#FAF8F5";
const BORDER = "#E8E3DB";

type Language = "english" | "urdu" | "roman-urdu";

/* ─── Language picker ─── */
const LANGUAGES: { id: Language; label: string; sub: string }[] = [
  { id: "english",    label: "English",    sub: "Continue in English"    },
  { id: "urdu",       label: "اردو",        sub: "اردو میں جاری رکھیں"    },
  { id: "roman-urdu", label: "Roman Urdu", sub: "Roman Urdu mein jari rakhein" },
];

const LanguagePicker: React.FC<{ onSelect: (l: Language) => void }> = ({ onSelect }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: BG, overflow: "hidden" }}>
    <div aria-hidden="true" style={{ height: "24px", backgroundColor: "#FFFFFF", flexShrink: 0 }} />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", gap: "32px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "20px", backgroundColor: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Zap size={30} color="#FFFFFF" aria-hidden="true" />
        </div>
        <h2 style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "22px", fontWeight: 700, color: "#1A1A1A", textAlign: "center" }}>
          How would you like to communicate?
        </h2>
        <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#9B9B9B", textAlign: "center", lineHeight: "20px" }}>
          Choose your preferred language to get started
        </p>
      </div>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
        {LANGUAGES.map(({ id, label, sub }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            style={{ width: "100%", padding: "18px 20px", borderRadius: "14px", backgroundColor: "#FFFFFF", border: `1.5px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
          >
            <div style={{ textAlign: "left" }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "17px", fontWeight: 600, color: "#1A1A1A" }}>{label}</div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#9B9B9B", marginTop: "2px" }}>{sub}</div>
            </div>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
);

/* ─── Message bubbles ─── */
const AIAvatar: React.FC = () => (
  <div style={{ width: "28px", height: "28px", borderRadius: "8px", backgroundColor: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <Bot size={14} color="#FFFFFF" aria-hidden="true" />
  </div>
);

const AIBubble: React.FC<{ children: React.ReactNode; showAvatar?: boolean }> = ({ children, showAvatar = true }) => (
  <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", maxWidth: "85%" }}>
    {showAvatar ? <AIAvatar /> : <div style={{ width: "28px", flexShrink: 0 }} />}
    <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px 16px 16px 4px", border: `1px solid ${BORDER}`, padding: "10px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      {children}
    </div>
  </div>
);

const AIText: React.FC<{ text: string }> = ({ text }) => (
  <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: "20px", color: "#1A1A1A" }}>{text}</p>
);

const CustomerBubble: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "flex", justifyContent: "flex-end" }}>
    <div style={{ backgroundColor: NAVY, borderRadius: "16px 16px 4px 16px", padding: "10px 14px", maxWidth: "80%" }}>
      {children}
    </div>
  </div>
);

const CustomerText: React.FC<{ text: string }> = ({ text }) => (
  <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: "20px", color: "#FFFFFF" }}>{text}</p>
);

/* ─── Analyzing indicator ─── */
const AnalyzingBubble: React.FC<{ text?: string }> = ({ text = "Analyzing…" }) => (
  <AIBubble showAvatar={false}>
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ display: "flex", gap: "3px" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: NAVY, opacity: 0.4, animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
        ))}
      </div>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#9B9B9B" }}>{text}</span>
    </div>
  </AIBubble>
);

/* ─── Photo previews ─── */
const BlurryPhoto: React.FC = () => (
  <div style={{ width: "180px", height: "120px", borderRadius: "12px", background: "linear-gradient(135deg, #111 0%, #2a2a2a 50%, #111 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px", overflow: "hidden", position: "relative" }}>
    <div style={{ position: "absolute", inset: 0, backdropFilter: "blur(2px)", background: "rgba(0,0,0,0.4)" }} />
    <Camera size={26} color="rgba(255,255,255,0.25)" style={{ position: "relative", zIndex: 1 }} aria-hidden="true" />
    <span style={{ position: "relative", zIndex: 1, fontFamily: "Inter, sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>Photo</span>
  </div>
);

const ClearPhoto: React.FC = () => (
  <div style={{ width: "180px", height: "120px", borderRadius: "12px", background: "linear-gradient(155deg, #0d2137 0%, #1a3d5c 45%, #1d5a82 100%)", overflow: "hidden", position: "relative" }}>
    {/* Pipe illustration */}
    <svg style={{ position: "absolute", top: "12px", left: "12px" }} width="100" height="70" viewBox="0 0 100 70" fill="none" aria-hidden="true">
      <rect x="5" y="28" width="70" height="14" rx="4" fill="#7BAFD4" />
      <rect x="60" y="28" width="14" height="38" rx="4" fill="#5A8FB8" />
      <rect x="0" y="24" width="20" height="8" rx="3" fill="#9CC0D8" />
      <ellipse cx="67" cy="68" rx="4" ry="5" fill="rgba(120,200,255,0.7)" />
      <ellipse cx="73" cy="72" rx="3" ry="4" fill="rgba(120,200,255,0.5)" />
      <ellipse cx="63" cy="74" rx="2" ry="3" fill="rgba(120,200,255,0.4)" />
    </svg>
    {/* Water puddle */}
    <div style={{ position: "absolute", bottom: "8px", left: "50px", width: "50px", height: "8px", borderRadius: "50%", background: "rgba(100,180,255,0.35)" }} />
    {/* Label */}
    <div style={{ position: "absolute", bottom: "8px", right: "10px", backgroundColor: "rgba(0,0,0,0.5)", borderRadius: "6px", padding: "2px 8px" }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "#FFFFFF", fontWeight: 500 }}>📷 Kitchen Sink</span>
    </div>
  </div>
);

/* ─── Voice player ─── */
const VoicePlayer: React.FC<{ duration: string; transcript: string; isPlaying: boolean; onToggle: () => void; isCustomer?: boolean }> = ({
  duration, transcript, isPlaying, onToggle, isCustomer = true,
}) => {
  const bars = [3, 5, 8, 6, 10, 7, 9, 5, 8, 6, 4, 7, 9, 5, 8, 6, 3, 5, 7, 4];
  const bg = isCustomer ? NAVY : "#FFFFFF";
  const fgColor = isCustomer ? "#FFFFFF" : NAVY;
  const subColor = isCustomer ? "rgba(255,255,255,0.6)" : "#9B9B9B";
  const waveColor = isCustomer ? "rgba(255,255,255,0.6)" : NAVY;
  const waveActive = isCustomer ? "#FFFFFF" : GREEN;
  return (
    <div style={{ width: "220px", backgroundColor: bg, borderRadius: "14px", border: `1px solid ${isCustomer ? "transparent" : BORDER}`, padding: "12px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          type="button"
          onClick={onToggle}
          aria-label={isPlaying ? "Pause" : "Play"}
          style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: isCustomer ? "rgba(255,255,255,0.2)" : NAVY, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
        >
          {isPlaying ? <Pause size={14} color={isCustomer ? "#FFFFFF" : "#FFFFFF"} /> : <Play size={14} color={isCustomer ? "#FFFFFF" : "#FFFFFF"} style={{ marginLeft: "2px" }} />}
        </button>
        {/* Waveform */}
        <svg width="120" height="24" viewBox="0 0 120 24" aria-hidden="true">
          {bars.map((h, i) => (
            <rect key={i} x={i * 6 + 2} y={(24 - h * 2) / 2} width="4" height={h * 2} rx="2"
              fill={isPlaying && i < 8 ? waveActive : waveColor} opacity={0.8} />
          ))}
        </svg>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: subColor, flexShrink: 0 }}>{duration}</span>
      </div>
      {transcript && (
        <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "11px", fontStyle: "italic", color: subColor, lineHeight: "15px" }}>
          "{transcript}"
        </p>
      )}
    </div>
  );
};

/* ─── Video preview ─── */
const VideoPreview: React.FC<{ duration: string }> = ({ duration }) => (
  <div style={{ width: "180px", height: "120px", borderRadius: "12px", background: "linear-gradient(145deg, #0a1628 0%, #1a2a40 100%)", position: "relative", overflow: "hidden" }}>
    {/* Pipe scene tinted dark */}
    <svg style={{ position: "absolute", top: "10px", left: "10px", opacity: 0.4 }} width="90" height="60" viewBox="0 0 90 60" fill="none" aria-hidden="true">
      <rect x="5" y="24" width="60" height="12" rx="3" fill="#7BAFD4" />
      <rect x="52" y="24" width="12" height="32" rx="3" fill="#5A8FB8" />
    </svg>
    {/* Play button */}
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", border: "1.5px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Play size={18} color="#FFFFFF" style={{ marginLeft: "3px" }} aria-hidden="true" />
      </div>
    </div>
    {/* Duration badge */}
    <div style={{ position: "absolute", bottom: "8px", right: "8px", backgroundColor: "rgba(0,0,0,0.6)", borderRadius: "4px", padding: "2px 6px" }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "#FFFFFF" }}>{duration}</span>
    </div>
    {/* Video label */}
    <div style={{ position: "absolute", top: "8px", left: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
      <Video size={10} color="rgba(255,255,255,0.7)" aria-hidden="true" />
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", color: "rgba(255,255,255,0.7)" }}>Video</span>
    </div>
  </div>
);

/* ─── Summary card ─── */
const SummaryCard: React.FC = () => (
  <div style={{ backgroundColor: "#FFFFFF", borderRadius: "14px", border: `1.5px solid ${NAVY}`, overflow: "hidden" }}>
    <div style={{ backgroundColor: NAVY, padding: "10px 14px", display: "flex", alignItems: "center", gap: "8px" }}>
      <FileText size={14} color="#FFFFFF" aria-hidden="true" />
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 600, color: "#FFFFFF", letterSpacing: "0.5px", textTransform: "uppercase" }}>Service Request Summary</span>
    </div>
    <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
      {[
        { label: "Service",  value: "Plumbing" },
        { label: "Problem",  value: "Continuous leak underneath kitchen sink" },
        { label: "Urgency",  value: "Needs attention soon" },
        { label: "Location", value: "Islamabad" },
      ].map(({ label, value }) => (
        <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: "8px", paddingBottom: "6px", borderBottom: "1px solid #F0EDE8" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9B9B9B", flexShrink: 0 }}>{label}</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 600, color: "#1A1A1A", textAlign: "right" }}>{value}</span>
        </div>
      ))}
      <div style={{ paddingBottom: "6px", borderBottom: "1px solid #F0EDE8" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9B9B9B" }}>Details</span>
        <p style={{ margin: "3px 0 0", fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#1A1A1A", lineHeight: "16px" }}>
          Continuous water leakage from the pipe connection underneath the kitchen sink.
        </p>
      </div>
      <div>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9B9B9B" }}>Customer Inputs</span>
        <div style={{ display: "flex", gap: "6px", marginTop: "5px", flexWrap: "wrap" }}>
          {["💬 Text", "📷 Photo", "🎤 Voice", "🎥 Video"].map((label) => (
            <span key={label} style={{ display: "inline-flex", alignItems: "center", height: "22px", paddingLeft: "8px", paddingRight: "8px", borderRadius: "20px", backgroundColor: BG, border: `1px solid ${BORDER}`, fontFamily: "Inter, sans-serif", fontSize: "11px", color: "#555555" }}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ─── Input type pill ─── */
const InputPill: React.FC<{
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}> = ({ icon, label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", padding: "7px 10px", borderRadius: "10px", backgroundColor: active ? NAVY : "#FFFFFF", border: `1px solid ${active ? NAVY : BORDER}`, cursor: "pointer", flexShrink: 0, minWidth: "52px" }}
    aria-pressed={active}
  >
    <span style={{ color: active ? "#FFFFFF" : "#9B9B9B" }}>{icon}</span>
    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: active ? 600 : 400, color: active ? "#FFFFFF" : "#9B9B9B" }}>{label}</span>
  </button>
);

/* ─── Main component ─── */
interface HzAIBookingChatProps {
  onBack?: () => void;
  onComplete?: () => void;
}

export const HzAIBookingChat: React.FC<HzAIBookingChatProps> = ({ onBack, onComplete }) => {
  const [language, setLanguage] = useState<Language | null>(null);
  const [step, setStep] = useState(1);
  const [voicePlaying, setVoicePlaying] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  }, [step]);

  /* Auto-advance through AI analysis states — no Continue button needed */
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | null = null;
    if (step === 3)  t = setTimeout(() => setStep(4),  2500); // blurry photo analysis → error
    if (step === 5)  t = setTimeout(() => setStep(6),  2600); // clear photo analysis → AI response
    if (step === 8)  t = setTimeout(() => setStep(9),  2200); // voice processing → AI response
    if (step === 10) t = setTimeout(() => setStep(11), 3300); // video analysis → AI response
    if (step === 12) t = setTimeout(() => onComplete?.(), 2500); // "Finding Ustaads…" → provider results
    if (step === 13) t = setTimeout(() => onComplete?.(), 1800);
    return () => { if (t) clearTimeout(t); };
  }, [step, onComplete]);

  if (!language) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ height: "24px", backgroundColor: "#FFFFFF", flexShrink: 0 }} />
        <header style={{ height: "56px", backgroundColor: "#FFFFFF", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", paddingLeft: "4px", paddingRight: "16px", flexShrink: 0 }}>
          <button type="button" onClick={onBack} aria-label="Back" style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer" }}>
            <ArrowLeft size={22} color="#1A1A1A" aria-hidden="true" />
          </button>
          <span style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: "17px", fontWeight: 600, color: "#1A1A1A", pointerEvents: "none" }}>New Booking</span>
        </header>
        <LanguagePicker onSelect={(l) => { setLanguage(l); setStep(1); }} />
      </div>
    );
  }

  const langLabel = language === "urdu" ? "اردو" : language === "roman-urdu" ? "Roman Urdu" : "English";
  const advance = () => setStep((s) => Math.min(s + 1, 13));

  /* ─── Render conversation messages ─── */
  const renderMessages = () => {
    const items: React.ReactNode[] = [];

    /* Step 1: AI greeting */
    if (step >= 1) {
      items.push(
        <AIBubble key="ai-1">
          <AIText text="Hi! What do you need help with?" />
          <AIText text="Describe your problem in your own words. You can also send a photo, video, or voice message." />
        </AIBubble>
      );
    }

    /* Step 2: Customer text + AI asks for photo */
    if (step >= 2) {
      items.push(
        <CustomerBubble key="cust-text">
          <CustomerText text="There is water leaking under my kitchen sink since this morning." />
        </CustomerBubble>
      );
      items.push(
        <AIBubble key="ai-2" showAvatar={false}>
          <AIText text="Got it. Can you show me where the leak is coming from?" />
        </AIBubble>
      );
    }

    /* Step 3: Blurry photo + analyzing */
    if (step >= 3) {
      items.push(
        <CustomerBubble key="cust-blurry">
          <BlurryPhoto />
        </CustomerBubble>
      );
      items.push(<AnalyzingBubble key="analyzing-1" text="Analyzing your photo…" />);
    }

    /* Step 4: Photo error + action buttons */
    if (step >= 4) {
      items.push(
        <AIBubble key="ai-error">
          <AIText text="I couldn't clearly see the problem in this photo." />
        </AIBubble>
      );
      items.push(
        <AIBubble key="ai-recovery" showAvatar={false}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
            <button type="button" onClick={advance}
              style={{ height: "38px", borderRadius: "10px", backgroundColor: NAVY, border: "none", fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#FFFFFF", cursor: "pointer" }}>
              📷 Try Another Photo
            </button>
            <button type="button" onClick={() => setStep(7)}
              style={{ height: "38px", borderRadius: "10px", backgroundColor: "#FFFFFF", border: `1px solid ${BORDER}`, fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 500, color: "#555555", cursor: "pointer" }}>
              Continue with Description
            </button>
          </div>
        </AIBubble>
      );
    }

    /* Step 5: Clear photo + analyzing */
    if (step >= 5) {
      items.push(
        <CustomerBubble key="cust-clear">
          <ClearPhoto />
        </CustomerBubble>
      );
      items.push(<AnalyzingBubble key="analyzing-2" text="Analyzing your photo…" />);
    }

    /* Step 6: AI understood photo + follow-up */
    if (step >= 6) {
      items.push(
        <AIBubble key="ai-photo-ok">
          <AIText text="The image appears to show water leaking from the pipe connection underneath the kitchen sink." />
        </AIBubble>
      );
      items.push(
        <AIBubble key="ai-question" showAvatar={false}>
          <AIText text="Is the leak happening continuously?" />
        </AIBubble>
      );
    }

    /* Step 7: Customer yes */
    if (step >= 7) {
      items.push(
        <CustomerBubble key="cust-yes">
          <CustomerText text="Yes, it has been leaking continuously." />
        </CustomerBubble>
      );
    }

    /* Step 8: Voice message + analyzing */
    if (step >= 8) {
      items.push(
        <CustomerBubble key="cust-voice">
          <VoicePlayer
            duration="0:18"
            transcript="Bhai, pani bohat zyada nikal raha hai aur neeche floor bhi geela ho raha hai."
            isPlaying={voicePlaying}
            onToggle={() => setVoicePlaying((p) => !p)}
            isCustomer
          />
        </CustomerBubble>
      );
      items.push(<AnalyzingBubble key="analyzing-3" text="Processing voice message…" />);
    }

    /* Step 9: AI understood voice */
    if (step >= 9) {
      items.push(
        <AIBubble key="ai-voice-ok">
          <AIText text="I understand. The leak is significant and water is collecting on the floor." />
        </AIBubble>
      );
    }

    /* Step 10: Video + analyzing */
    if (step >= 10) {
      items.push(
        <CustomerBubble key="cust-video">
          <VideoPreview duration="0:12" />
        </CustomerBubble>
      );
      items.push(<AnalyzingBubble key="analyzing-4" text="Analyzing your video…" />);
    }

    /* Step 11: AI understood video + summary */
    if (step >= 11) {
      items.push(
        <AIBubble key="ai-video-ok">
          <AIText text="The video appears to show water continuously dripping from the pipe underneath the sink." />
        </AIBubble>
      );
      items.push(
        <AIBubble key="ai-summary" showAvatar={false}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <AIText text="I've combined all your inputs into a service request:" />
            <SummaryCard />
            <AIText text="Does this look right?" />
            <div style={{ display: "flex", gap: "8px" }}>
              <button type="button" onClick={advance}
                style={{ flex: 1, height: "38px", borderRadius: "10px", backgroundColor: NAVY, border: "none", fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <Check size={14} color="#FFFFFF" /> Looks Good
              </button>
              <button type="button"
                style={{ flex: 1, height: "38px", borderRadius: "10px", backgroundColor: "#FFFFFF", border: `1px solid ${BORDER}`, fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 500, color: "#555555", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <Edit3 size={13} color="#555555" /> Edit Details
              </button>
            </div>
          </div>
        </AIBubble>
      );
    }

    /* Step 12+: Confirmed + searching */
    if (step >= 12) {
      items.push(
        <CustomerBubble key="cust-confirmed">
          <CustomerText text="✓ Looks Good" />
        </CustomerBubble>
      );
      items.push(
        <AIBubble key="ai-searching">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ display: "flex", gap: "3px" }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: GREEN, animation: `pulse 1.0s ease-in-out ${i * 0.15}s infinite` }} />
              ))}
            </div>
            <AIText text="Finding the best Ustaads for your request…" />
          </div>
        </AIBubble>
      );
    }

    return items;
  };

  /* ─── Input area per step ─── */
  const renderInputArea = () => {
    const inputTypes = (
      <div style={{ display: "flex", gap: "8px", padding: "8px 16px 0", justifyContent: "center" }}>
        <InputPill icon={<Send size={14} />} label="Text"  active={step === 1 || step === 6} onClick={step <= 1 || step === 6 ? advance : undefined} />
        <InputPill icon={<Camera size={14} />} label="Photo" active={step === 2 || step === 4} onClick={step === 2 || step === 4 ? advance : undefined} />
        <InputPill icon={<Mic size={14} />} label="Voice" active={step === 7} onClick={step === 7 ? advance : undefined} />
        <InputPill icon={<Video size={14} />} label="Video" active={step === 9} onClick={step === 9 ? advance : undefined} />
      </div>
    );

    if (step === 1) {
      return (
        <div style={{ backgroundColor: "#FFFFFF", borderTop: `1px solid ${BORDER}`, paddingBottom: "16px", flexShrink: 0 }}>
          {inputTypes}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px 0" }}>
            <div style={{ flex: 1, backgroundColor: BG, border: `1.5px solid ${BORDER}`, borderRadius: "12px", padding: "10px 12px", fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#555555" }}>
              There is water leaking under my kitchen sink since this morning.
            </div>
            <button type="button" onClick={advance} aria-label="Send" style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: NAVY, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
              <Send size={16} color="#FFFFFF" aria-hidden="true" />
            </button>
          </div>
        </div>
      );
    }

    if (step === 6) {
      return (
        <div style={{ backgroundColor: "#FFFFFF", borderTop: `1px solid ${BORDER}`, paddingBottom: "16px", flexShrink: 0 }}>
          {inputTypes}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px 0" }}>
            <div style={{ flex: 1, backgroundColor: BG, border: `1.5px solid ${BORDER}`, borderRadius: "12px", padding: "10px 12px", fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#555555" }}>
              Yes, it has been leaking continuously.
            </div>
            <button type="button" onClick={advance} aria-label="Send" style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: NAVY, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
              <Send size={16} color="#FFFFFF" aria-hidden="true" />
            </button>
          </div>
        </div>
      );
    }

    if (step >= 2 && step <= 10 && step !== 3 && step !== 4 && step !== 5 && step !== 6 && step !== 8) {
      const hints: Record<number, string> = {
        2: "📷 Tap Photo to add your image",
        7: "🎤 Tap Voice to add a voice message",
        9: "🎥 Tap Video to add a short clip",
      };
      return (
        <div style={{ backgroundColor: "#FFFFFF", borderTop: `1px solid ${BORDER}`, paddingBottom: "16px", flexShrink: 0 }}>
          {inputTypes}
          {hints[step] && (
            <p style={{ margin: "6px 16px 0", fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9B9B9B", textAlign: "center" }}>
              {hints[step]}
            </p>
          )}
        </div>
      );
    }

    /* Analyzing states — passive indicator, auto-advances via useEffect */
    if (step === 3 || step === 5 || step === 8 || step === 10) {
      const label = step === 8 ? "Processing voice message…" : step === 10 ? "Analyzing your video…" : "Analyzing your photo…";
      return (
        <div style={{ backgroundColor: "#FFFFFF", borderTop: `1px solid ${BORDER}`, padding: "12px 16px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <div style={{ display: "flex", gap: "3px" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: NAVY, animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
            ))}
          </div>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#9B9B9B" }}>{label}</span>
        </div>
      );
    }

    if (step >= 12) {
      return (
        <div style={{ backgroundColor: "#FFFFFF", borderTop: `1px solid ${BORDER}`, padding: "16px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <div style={{ display: "flex", gap: "4px" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: GREEN }} />
            ))}
          </div>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#9B9B9B" }}>Matching you with providers…</span>
        </div>
      );
    }

    return (
      <div style={{ backgroundColor: "#FFFFFF", borderTop: `1px solid ${BORDER}`, padding: "8px 16px 16px", flexShrink: 0 }}>
        {inputTypes}
      </div>
    );
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: BG, overflow: "hidden" }}>
      {/* Status bar */}
      <div aria-hidden="true" style={{ height: "24px", backgroundColor: "#FFFFFF", flexShrink: 0 }} />

      {/* Header */}
      <header style={{ height: "56px", backgroundColor: "#FFFFFF", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", paddingLeft: "4px", paddingRight: "16px", flexShrink: 0, position: "relative" }}>
        <button type="button" onClick={onBack} aria-label="Back"
          style={{ width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer" }}>
          <ArrowLeft size={22} color="#1A1A1A" aria-hidden="true" />
        </button>
        <span style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: "17px", fontWeight: 600, color: "#1A1A1A", pointerEvents: "none" }}>
          New Booking
        </span>
        <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", height: "24px", paddingLeft: "10px", paddingRight: "10px", borderRadius: "12px", backgroundColor: BG, border: `1px solid ${BORDER}`, fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 500, color: "#555555", flexShrink: 0, whiteSpace: "nowrap" }}>
          {langLabel}
        </span>
      </header>

      {/* Messages */}
      <div ref={scrollRef}
        style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}
        role="log" aria-label="AI booking conversation" aria-live="polite">
        {renderMessages()}
        <div style={{ height: "8px" }} />
      </div>

      {/* Input area */}
      {renderInputArea()}

      {/* Pulse keyframe via style tag */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
