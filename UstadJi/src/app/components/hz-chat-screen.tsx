import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ArrowUp,
  MessageCircle,
  Search,
  Clock,
  Heart,
  User,
  Mic,
  Camera,
  X,
  Check,
  Wrench,
  MapPin,
  Headphones,
} from "lucide-react";

/* ─── CSS keyframes for voice overlay ─── */
const VOICE_STYLES = `
  @keyframes vBar1 { 0%,100%{height:4px} 50%{height:18px} }
  @keyframes vBar2 { 0%,100%{height:8px} 50%{height:26px} }
  @keyframes vBar3 { 0%,100%{height:12px} 50%{height:22px} }
  @keyframes vBar4 { 0%,100%{height:6px} 50%{height:20px} }
  @keyframes vBar5 { 0%,100%{height:10px} 50%{height:24px} }
  @keyframes micGlow { 0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(22,21,51,0.3)} 50%{transform:scale(1.06);box-shadow:0 0 0 10px rgba(22,21,51,0)} }
`;

/* ─── Types ─── */
type ChatTab = "chat" | "explore" | "bookings" | "favourites" | "profile";
type ChatState = "empty" | "active";

/* ─── Thinking block ─── */
const ThinkingBlock: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const fullText =
    "Parsing consumer input... Detected: AC not working → HS-04 (AC Repairing). Severity signals: 'bilkul kaam nahi kar raha' → +1 complexity tier → Intermediate → Complex. Requested slot: tomorrow morning. Location: G-13...";

  return (
    <div style={{ backgroundColor: "#F0EDE8", borderRadius: "12px", borderLeft: "3px solid #161533", padding: "16px" }}>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-label="Toggle Ustaad G's reasoning panel"
        style={{ width: "100%", display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
      >
        <Sparkles size={16} color="#161533" aria-hidden="true" />
        <span style={{ flex: 1, fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 600, lineHeight: "16px", color: "#1A1A1A" }}>
          Ustaad G&apos;s Reasoning — Intent Extraction
        </span>
        {expanded ? <ChevronUp size={16} color="#9B9B9B" aria-hidden="true" /> : <ChevronDown size={16} color="#9B9B9B" aria-hidden="true" />}
      </button>
      <div style={{ marginTop: "8px" }}>
        <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 400, fontStyle: "italic", lineHeight: "18px", color: "#555555", display: expanded ? "block" : "-webkit-box", WebkitLineClamp: expanded ? undefined : 3, WebkitBoxOrient: expanded ? undefined : "vertical", overflow: expanded ? "visible" : "hidden" }}>
          {fullText}
        </p>
        {!expanded && (
          <button type="button" onClick={() => setExpanded(true)} style={{ background: "none", border: "none", padding: 0, marginTop: "4px", fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 500, color: "#161533", cursor: "pointer" }}>
            Show more ↓
          </button>
        )}
      </div>
    </div>
  );
};

/* ─── Clarification card ─── */
const ClarificationCard: React.FC = () => {
  const [selected, setSelected] = useState<"residential" | "commercial">("residential");
  return (
    <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E8E3DB", boxShadow: "0px 2px 8px rgba(0,0,0,0.06)", padding: "16px" }}>
      <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 500, lineHeight: "22px", color: "#1A1A1A" }}>
        Is this for residential or commercial use?
      </p>
      <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
        {([{ id: "residential", label: "Ghar (Residential)" }, { id: "commercial", label: "Office / Commercial" }] as const).map(({ id, label }) => {
          const isSelected = selected === id;
          return (
            <button key={id} type="button" role="radio" aria-checked={isSelected} onClick={() => setSelected(id)}
              style={{ width: "100%", height: "44px", borderRadius: "12px", backgroundColor: isSelected ? "#161533" : "#FFFFFF", border: isSelected ? "none" : "1px solid #E8E3DB", fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 500, lineHeight: "20px", color: isSelected ? "#FFFFFF" : "#1A1A1A", cursor: "pointer", transition: "background-color 0.15s ease" }}>
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ─── Agent bubble ─── */
const AgentBubble: React.FC<{ text: string; time?: string }> = ({ text, time }) => (
  <div style={{ display: "flex", justifyContent: "flex-start" }}>
    <div style={{ maxWidth: "280px", backgroundColor: "#FFFFFF", border: "1px solid #E8E3DB", boxShadow: "0px 1px 4px rgba(0,0,0,0.06)", borderRadius: "4px 18px 18px 18px", padding: "16px" }}>
      <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 400, lineHeight: "22px", color: "#1A1A1A" }}>{text}</p>
      {time && <p style={{ margin: 0, marginTop: "4px", fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 400, lineHeight: "15px", color: "#9B9B9B", textAlign: "right" }}>{time}</p>}
    </div>
  </div>
);

/* ─── Consumer bubble ─── */
const ConsumerBubble: React.FC<{ text: string; time?: string }> = ({ text, time }) => (
  <div style={{ display: "flex", justifyContent: "flex-end" }}>
    <div style={{ maxWidth: "280px", backgroundColor: "#161533", borderRadius: "18px 4px 18px 18px", padding: "16px" }}>
      <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 400, lineHeight: "22px", color: "#FFFFFF" }}>{text}</p>
      {time && <p style={{ margin: 0, marginTop: "4px", fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 400, lineHeight: "15px", color: "rgba(255,255,255,0.7)", textAlign: "right" }}>{time}</p>}
    </div>
  </div>
);

/* ─── Intent chips ─── */
const INTENT_CHIPS = ["When will he arrive?", "Change address", "Track my booking", "Cancel booking"];
const IntentChips: React.FC = () => (
  <div style={{ display: "flex", gap: "8px", overflowX: "auto", scrollbarWidth: "none", paddingBottom: "2px", paddingLeft: "2px" }}>
    {INTENT_CHIPS.map((chip) => (
      <button key={chip} type="button"
        style={{ flexShrink: 0, height: "32px", paddingLeft: "12px", paddingRight: "12px", borderRadius: "16px", backgroundColor: "#FFFFFF", border: "1px solid #161533", fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 500, color: "#161533", cursor: "pointer", whiteSpace: "nowrap" }}>
        {chip}
      </button>
    ))}
  </div>
);

/* ─── Fallback bubble ─── */
const FallbackBubble: React.FC = () => (
  <div style={{ display: "flex", justifyContent: "flex-start" }}>
    <div style={{ maxWidth: "280px", backgroundColor: "#FFFFFF", border: "1px solid #E8E3DB", boxShadow: "0px 1px 4px rgba(0,0,0,0.06)", borderRadius: "4px 18px 18px 18px", padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "10px" }}>
        <Sparkles size={15} color="#161533" style={{ marginTop: "2px", flexShrink: 0 }} aria-hidden="true" />
        <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 400, lineHeight: "21px", color: "#1A1A1A" }}>
          Mujhe thori confusion hui — kya aap thora aur detail de sakte hain?
        </p>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button type="button"
          style={{ flex: 1, height: "34px", borderRadius: "8px", backgroundColor: "#161533", border: "none", fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 600, color: "#FFFFFF", cursor: "pointer" }}>
          Try Again
        </button>
        <button type="button"
          style={{ flex: 1, height: "34px", borderRadius: "8px", backgroundColor: "transparent", border: "1px solid #E8E3DB", fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 500, color: "#555555", cursor: "pointer" }}>
          Talk to a Human
        </button>
      </div>
    </div>
  </div>
);

/* ─── Suggestion card (empty state) ─── */
interface SuggestionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick?: () => void;
}
const SuggestionCard: React.FC<SuggestionCardProps> = ({ icon, title, subtitle, onClick }) => (
  <button type="button" onClick={onClick}
    style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", backgroundColor: "#FFFFFF", borderRadius: "14px", border: "1px solid #E8E3DB", boxShadow: "0px 1px 4px rgba(0,0,0,0.05)", padding: "14px 16px", cursor: "pointer", textAlign: "left", boxSizing: "border-box" }}>
    <div style={{ width: "42px", height: "42px", borderRadius: "11px", backgroundColor: "#F0EDE8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {icon}
    </div>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 600, color: "#1A1A1A", lineHeight: "20px" }}>{title}</span>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 400, color: "#9B9B9B", lineHeight: "18px" }}>{subtitle}</span>
    </div>
    <ChevronRight size={18} color="#C0BAB0" aria-hidden="true" />
  </button>
);

/* ─── Voice overlay ─── */
const VoiceOverlay: React.FC<{ onCancel: () => void; onSend: () => void }> = ({ onCancel, onSend }) => (
  <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(22,21,51,0.55)", display: "flex", alignItems: "flex-end", zIndex: 100 }}>
    <div style={{ width: "100%", backgroundColor: "#FFFFFF", borderRadius: "20px 20px 0 0", padding: "20px 24px 40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "36px", height: "4px", backgroundColor: "#E8E3DB", borderRadius: "2px", marginBottom: "20px" }} />
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 500, color: "#9B9B9B", marginBottom: "18px" }}>
        Bol rahe hain — sunna ja raha hai...
      </span>
      {/* Waveform */}
      <div style={{ display: "flex", alignItems: "center", gap: "5px", height: "32px", marginBottom: "22px" }}>
        {[
          { anim: "vBar1 0.7s ease infinite" },
          { anim: "vBar2 0.7s ease infinite 0.1s" },
          { anim: "vBar3 0.7s ease infinite 0.2s" },
          { anim: "vBar4 0.7s ease infinite 0.05s" },
          { anim: "vBar5 0.7s ease infinite 0.15s" },
          { anim: "vBar2 0.7s ease infinite 0.25s" },
          { anim: "vBar3 0.7s ease infinite 0.35s" },
          { anim: "vBar1 0.7s ease infinite 0.45s" },
        ].map(({ anim }, i) => (
          <div key={i} style={{ width: "4px", backgroundColor: "#161533", borderRadius: "2px", animation: anim }} />
        ))}
      </div>
      {/* Pulsing mic */}
      <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#161533", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "22px", animation: "micGlow 1.4s ease infinite" }}>
        <Mic size={28} color="#FFFFFF" aria-hidden="true" />
      </div>
      {/* Cancel / Confirm */}
      <div style={{ display: "flex", gap: "48px" }}>
        <button type="button" onClick={onCancel} aria-label="Cancel voice input"
          style={{ width: "52px", height: "52px", borderRadius: "50%", backgroundColor: "#F0EDE8", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <X size={22} color="#9B9B9B" aria-hidden="true" />
        </button>
        <button type="button" onClick={onSend} aria-label="Send voice message"
          style={{ width: "52px", height: "52px", borderRadius: "50%", backgroundColor: "#4CAF84", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Check size={22} color="#FFFFFF" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
);

/* ─── Re-initiate search card ─── */
interface ReinitiateCardProps {
  onFindProvider?: () => void;
  onCancelSearch?: () => void;
}

const ReinitiateCard: React.FC<ReinitiateCardProps> = ({ onFindProvider, onCancelSearch }) => (
  <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E8E3DB", boxShadow: "0px 2px 8px rgba(0,0,0,0.07)", padding: "16px" }}>
    <span style={{ display: "inline-block", backgroundColor: "#E8872A", borderRadius: "16px", padding: "3px 10px", fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 500, lineHeight: "18px", color: "#FFFFFF" }}>
      Provider Declined
    </span>
    <p style={{ margin: 0, marginTop: "8px", fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 600, lineHeight: "22px", color: "#1A1A1A" }}>
      Looking for another provider?
    </p>
    <div style={{ marginTop: "12px" }}>
      {[{ label: "Service", value: "AC Repairing" }, { label: "Location", value: "G-13, Islamabad" }, { label: "Date & Time", value: "Sat 18 May · 9:00 AM" }].map(({ label, value }, i, arr) => (
        <div key={label} style={{ height: "36px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: i < arr.length - 1 ? "1px solid #EFEFEF" : "none" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 400, lineHeight: "18px", color: "#9B9B9B" }}>{label}</span>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 400, lineHeight: "20px", color: "#1A1A1A" }}>{value}</span>
        </div>
      ))}
    </div>
    <p style={{ margin: 0, marginTop: "12px", fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 400, fontStyle: "italic", lineHeight: "18px", color: "#9B9B9B" }}>
      Usman Butt declined this request. He has been excluded from this search.
    </p>
    <div style={{ marginTop: "14px" }}>
      <p style={{ margin: 0, marginBottom: "8px", fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 500, color: "#9B9B9B" }}>Top 3 providers near you</p>
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", scrollbarWidth: "none", paddingBottom: "2px" }}>
        {[
          { name: "Ali Hassan", rank: 1, score: 96, rating: 4.9, badgeBg: "#FFC107", icon: "👑" },
          { name: "Usman Butt", rank: 2, score: 92, rating: 4.8, badgeBg: "#C0C0C0", icon: null },
          { name: "Rizwan Ahmed", rank: 3, score: 88, rating: 4.7, badgeBg: "#C0C0C0", icon: null },
        ].map(({ name, rank, score, rating, badgeBg, icon }) => (
          <button key={name} type="button" onClick={onFindProvider}
            style={{ flexShrink: 0, width: "100px", padding: "10px 8px", borderRadius: "10px", backgroundColor: "#FAF8F5", border: "1px solid #E8E3DB", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", cursor: "pointer", textAlign: "center" }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#E8E3DB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 700, color: "#FFFFFF" }}>{name[0]}</span>
              </div>
              <div style={{ position: "absolute", top: "-4px", right: "-6px", width: "18px", height: "18px", borderRadius: "50%", backgroundColor: badgeBg, display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #FFFFFF" }}>
                {icon ? <span style={{ fontSize: "8px" }}>{icon}</span> : <span style={{ fontFamily: "Inter, sans-serif", fontSize: "8px", fontWeight: 700, color: "#FFFFFF", lineHeight: 1 }}>{rank}</span>}
              </div>
            </div>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "#1A1A1A", lineHeight: "13px" }}>{name.split(" ")[0]}</span>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#9B9B9B" }}>{score}/100 · ★{rating}</span>
          </button>
        ))}
      </div>
    </div>
    <button type="button" onClick={onFindProvider}
      style={{ display: "block", width: "100%", height: "48px", marginTop: "12px", borderRadius: "12px", backgroundColor: "#161533", border: "none", fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, lineHeight: "20px", color: "#FFFFFF", cursor: "pointer" }}>
      Find Another Provider
    </button>
    <div style={{ marginTop: "8px", textAlign: "center" }}>
      <button type="button" onClick={onCancelSearch}
        style={{ background: "none", border: "none", padding: "4px", fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 400, lineHeight: "18px", color: "#9B9B9B", cursor: "pointer" }}>
        Cancel and start a new search
      </button>
    </div>
  </div>
);

/* ─── Invoice suggestion card ─── */
const InvoiceSuggestionCard: React.FC<{ onViewInvoice?: () => void; onAskQuestion?: () => void }> = ({ onViewInvoice, onAskQuestion }) => (
  <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E8E3DB", boxShadow: "0px 2px 8px rgba(0,0,0,0.06)", padding: "16px" }}>
    <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 600, lineHeight: "22px", color: "#1A1A1A" }}>
      Service is complete! Your invoice is ready.
    </p>
    <p style={{ margin: 0, marginTop: "4px", fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 400, lineHeight: "18px", color: "#9B9B9B" }}>
      INV-2026-001 · PKR 5,535 has been sent by Ali Hassan.
    </p>
    <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
      <button type="button" onClick={onViewInvoice}
        style={{ flex: 1, height: "40px", borderRadius: "8px", backgroundColor: "#161533", border: "none", fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 700, color: "#FFFFFF", cursor: "pointer" }}>
        Get Invoice from Provider
      </button>
      <button type="button" onClick={onAskQuestion}
        style={{ flex: 1, height: "40px", borderRadius: "8px", backgroundColor: "transparent", border: "1px solid #161533", fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 700, color: "#161533", cursor: "pointer" }}>
        Ask Question
      </button>
    </div>
  </div>
);

/* ─── Main screen ─── */
interface HzChatScreenProps {
  onTabChange?: (tab: ChatTab) => void;
  onViewResults?: () => void;
  onFindProvider?: () => void;
  onViewInvoice?: () => void;
  onReportIssue?: () => void;
  onNewAIBooking?: () => void;
  onTrackBooking?: () => void;
}

export const HzChatScreen: React.FC<HzChatScreenProps> = ({ onTabChange, onViewResults, onFindProvider, onViewInvoice, onReportIssue, onNewAIBooking, onTrackBooking }) => {
  const [activeTab, setActiveTab] = useState<ChatTab>("chat");
  const [thinkingOn, setThinkingOn] = useState(false);
  const [message, setMessage] = useState("");
  const [chatState, setChatState] = useState<ChatState>("empty");
  const [showVoice, setShowVoice] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  const handleTab = (tab: ChatTab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  const handleSuggestion = (title: string) => {
    if (title === "Report an Issue") {
      onReportIssue?.();
    } else {
      setChatState("active");
    }
  };

  const TABS: { id: ChatTab; Icon: React.FC<{ size: number; color: string }>; label: string }[] = [
    { id: "chat",       Icon: MessageCircle, label: "Chat"       },
    { id: "explore",    Icon: Search,        label: "Explore"    },
    { id: "bookings",   Icon: Clock,         label: "Bookings"   },
    { id: "favourites", Icon: Heart,         label: "Favourites" },
    { id: "profile",    Icon: User,          label: "Profile"    },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#FAF8F5", overflow: "hidden", position: "relative" }}>
      <style>{VOICE_STYLES}</style>

      {/* Status bar */}
      <div aria-hidden="true" style={{ height: "24px", flexShrink: 0, backgroundColor: "#FFFFFF" }} />

      {/* Top app bar */}
      <header style={{ height: "56px", backgroundColor: "#FFFFFF", borderBottom: "1px solid #EFEFEF", display: "flex", alignItems: "center", paddingLeft: "16px", paddingRight: "16px", flexShrink: 0, justifyContent: "space-between" }}>
        {/* Left: logo + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div aria-hidden="true" style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#161533", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 600, color: "#FFFFFF", lineHeight: 1 }}>U</span>
          </div>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "17px", fontWeight: 600, lineHeight: "22px", color: "#1A1A1A" }}>Ustaad G</span>
        </div>
        {/* Right: new chat toggle + thinking toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button type="button" onClick={() => setChatState(chatState === "empty" ? "active" : "empty")}
            style={{ height: "28px", paddingLeft: "10px", paddingRight: "10px", borderRadius: "14px", border: "1px solid #E8E3DB", backgroundColor: "transparent", fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 500, color: "#9B9B9B", cursor: "pointer", whiteSpace: "nowrap" }}>
            {chatState === "active" ? "New Chat" : "View Chat"}
          </button>
          <button type="button" onClick={() => setThinkingOn((v) => !v)} aria-pressed={thinkingOn}
            style={{ width: "80px", height: "32px", borderRadius: "16px", backgroundColor: thinkingOn ? "#FFF3DC" : "#E8E3DB", border: thinkingOn ? "1px solid #161533" : "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background-color 0.15s ease", gap: "4px", padding: "0 10px" }}>
            {thinkingOn && <Sparkles size={11} color="#161533" aria-hidden="true" />}
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 500, lineHeight: "16px", color: thinkingOn ? "#161533" : "#9B9B9B", whiteSpace: "nowrap" }}>
              {thinkingOn ? "Thinking On" : "Thinking Off"}
            </span>
          </button>
        </div>
      </header>

      {/* Active booking banner — active state only */}
      {chatState === "active" && (
        <div role="status" aria-label="Active job: AC Repair with Ali Hassan"
          style={{ height: "48px", backgroundColor: "#FFF8EC", borderLeft: "4px solid #161533", display: "flex", alignItems: "center", paddingLeft: "16px", paddingRight: "16px", flexShrink: 0, justifyContent: "space-between" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 500, lineHeight: "18px", color: "#1A1A1A" }}>Active Job · AC Repair · Ali Hassan</span>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button type="button" onClick={onViewInvoice}
              style={{ background: "none", border: "none", padding: "4px 0", fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 500, lineHeight: "18px", color: "#4CAF84", cursor: "pointer", minHeight: "32px", whiteSpace: "nowrap" }}>
              View Invoice
            </button>
            <button type="button" onClick={onViewResults}
              style={{ background: "none", border: "none", padding: "4px 0", fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 500, lineHeight: "18px", color: "#161533", cursor: "pointer", minHeight: "32px" }}>
              View →
            </button>
          </div>
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {chatState === "empty" ? (
        <div style={{ flex: 1, overflowY: "auto", paddingLeft: "16px", paddingRight: "16px", paddingTop: "36px", paddingBottom: "16px" }}>
          {/* Greeting header */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "28px" }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#161533", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "26px", fontWeight: 700, color: "#FFFFFF", lineHeight: 1 }}>U</span>
            </div>
            <h2 style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "20px", fontWeight: 700, color: "#1A1A1A", lineHeight: "28px", textAlign: "center" }}>
              Assalam-o-Alaikum, Zain!
            </h2>
            <p style={{ margin: "6px 0 0", fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 400, color: "#9B9B9B", lineHeight: "20px", textAlign: "center" }}>
              Main aapki kis tarah madad kar sakta hoon?
            </p>
          </div>
          {/* Suggestion cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <SuggestionCard icon={<Wrench size={20} color="#161533" />} title="Book a Service" subtitle="AC, plumbing, electrical ya kuch bhi" onClick={() => onNewAIBooking ? onNewAIBooking() : handleSuggestion("Book a Service")} />
            <SuggestionCard icon={<MapPin size={20} color="#161533" />} title="Track My Booking" subtitle="Active booking ka status check karein" onClick={() => onTrackBooking ? onTrackBooking() : handleSuggestion("Track My Booking")} />
            <SuggestionCard icon={<Camera size={20} color="#161533" />} title="Report an Issue" subtitle="Photo ya description se issue batayein" onClick={() => handleSuggestion("Report an Issue")} />
            <SuggestionCard icon={<Headphones size={20} color="#161533" />} title="Talk to Support" subtitle="Koi bhi sawal ya complaint" onClick={() => handleSuggestion("Talk to Support")} />
          </div>
        </div>
      ) : (
        /* ── ACTIVE STATE ── */
        <div ref={scrollRef}
          style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingLeft: "16px", paddingRight: "16px", paddingTop: "12px", paddingBottom: "12px", display: "flex", flexDirection: "column", gap: "12px" }}
          role="log" aria-label="Chat messages" aria-live="polite">

          <AgentBubble text="Assalam o Alaikum! Main Ustaad G hoon. Aapko kaunsi service chahiye? Bas batayein — Urdu mein, English mein, ya jis tarah chaahein." time="2:14 PM" />
          <ConsumerBubble text="AC bilkul kaam nahi kar raha, kal subah G-13 mein technician chahiye" time="2:15 PM" />
          {thinkingOn && <ThinkingBlock />}
          <AgentBubble text="Samajh gaya! Lagta hai aapka AC completely band hai. Main aapke liye G-13 mein best AC technician dhundh raha hoon. Ek cheez confirm karein:" />
          <ClarificationCard />
          <IntentChips />
          <ConsumerBubble text="Ghar ke liye hai." time="2:16 PM" />
          <AgentBubble text="G-13 mein AC technician mil gaya — Usman Butt. Booking request bhej diya hai." time="2:16 PM" />
          <ReinitiateCard onFindProvider={onFindProvider} onCancelSearch={() => {}} />
          <FallbackBubble />
          <InvoiceSuggestionCard onViewInvoice={onViewInvoice} onAskQuestion={() => {}} />
        </div>
      )}

      {/* Chat input bar */}
      <div style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid #EFEFEF", display: "flex", alignItems: "center", paddingLeft: "10px", paddingRight: "10px", paddingTop: "8px", paddingBottom: "10px", gap: "8px", flexShrink: 0 }}>
        {/* Camera / issue button */}
        <button type="button" onClick={onReportIssue} aria-label="Report issue with photo"
          style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#F0EDE8", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <Camera size={17} color="#161533" aria-hidden="true" />
        </button>
        {/* Input pill */}
        <div style={{ flex: 1, height: "40px", backgroundColor: "#F0EDE8", borderRadius: "20px", display: "flex", alignItems: "center", paddingLeft: "14px", paddingRight: "8px", gap: "6px" }}>
          <input type="text" placeholder="Message Ustaad G..." value={message} onChange={(e) => setMessage(e.target.value)} aria-label="Type a message"
            style={{ flex: 1, border: "none", outline: "none", backgroundColor: "transparent", fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 400, lineHeight: "22px", color: "#1A1A1A", minWidth: 0 }} />
          <button type="button" onClick={() => setShowVoice(true)} aria-label="Use voice input"
            style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#FFFFFF", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <Mic size={14} color="#9B9B9B" aria-hidden="true" />
          </button>
        </div>
        {/* Send button */}
        <button type="button" aria-label="Send message"
          style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#161533", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <ArrowUp size={20} color="#FFFFFF" aria-hidden="true" />
        </button>
      </div>

      {/* Bottom navigation */}
      <nav aria-label="Main navigation" style={{ height: "64px", backgroundColor: "#FFFFFF", borderTop: "1px solid #EFEFEF", display: "flex", flexShrink: 0 }}>
        {TABS.map(({ id, Icon, label }) => {
          const isActive = id === activeTab;
          const color = isActive ? "#161533" : "#9B9B9B";
          return (
            <button key={id} type="button" onClick={() => handleTab(id)} aria-current={isActive ? "page" : undefined} aria-label={label}
              style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", backgroundColor: "transparent", border: "none", cursor: "pointer", padding: 0, minWidth: "48px" }}>
              <Icon size={24} color={color} aria-hidden="true" />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: isActive ? 500 : 400, lineHeight: "15px", color }}>
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Voice listening overlay */}
      {showVoice && (
        <VoiceOverlay
          onCancel={() => setShowVoice(false)}
          onSend={() => setShowVoice(false)}
        />
      )}
    </div>
  );
};
