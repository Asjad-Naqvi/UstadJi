import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, Mic, Send, Square, X, Play, Pause, Globe, Phone, MoreVertical,
} from "lucide-react";

/* ─── Design tokens ─── */
const NAVY    = "#161533";
const GREEN   = "#4CAF84";
const GREY    = "#9B9B9B";
const BORDER  = "#E8E3DB";
const CHAT_BG = "#F2F0EC";
const RED_DOT = "#E53935";

/* ─── CSS keyframes for recording waveform ─── */
const RECORD_STYLES = `
  @keyframes recBar1 { 0%,100%{height:6px}  50%{height:22px} }
  @keyframes recBar2 { 0%,100%{height:12px} 50%{height:34px} }
  @keyframes recBar3 { 0%,100%{height:20px} 50%{height:44px} }
  @keyframes recBar4 { 0%,100%{height:10px} 50%{height:30px} }
  @keyframes recBar5 { 0%,100%{height:8px}  50%{height:24px} }
  @keyframes recPulse { 0%,100%{opacity:1}  50%{opacity:0.2} }
`;

/* ─── Types ─── */
type MessageType = "text" | "voice";

interface VoiceTranslation {
  fromLang: string;
  toLang: string;
  translatedText: string;
}

interface Message {
  id: string;
  sender: "consumer" | "provider";
  type: MessageType;
  text?: string;
  voiceDuration?: string;
  translation?: VoiceTranslation;
  timestamp: string;
}

/* ─── Waveform visual (static bars for voice bubbles) ─── */
const BAR_HEIGHTS = [5, 9, 15, 22, 18, 26, 20, 14, 24, 17, 11, 19, 13, 8, 11];

const WaveformBars: React.FC<{ bright?: boolean }> = ({ bright }) => (
  <div
    aria-hidden="true"
    style={{ display: "flex", alignItems: "center", gap: "2.5px", height: "22px" }}
  >
    {BAR_HEIGHTS.map((h, i) => (
      <div
        key={i}
        style={{
          width: "2.5px",
          height: `${h}px`,
          borderRadius: "2px",
          backgroundColor: bright ? "rgba(255,255,255,0.75)" : GREY,
          flexShrink: 0,
        }}
      />
    ))}
  </div>
);

/* ─── Mock conversation data ─── */
const INITIAL_MESSAGES: Message[] = [
  {
    id: "m1",
    sender: "provider",
    type: "text",
    text: "Assalam-o-Alaikum! Booking confirm ho gayi. Kal subah 9 baje aa raha hoon. ✓",
    timestamp: "Yesterday · 8:45 PM",
  },
  {
    id: "m2",
    sender: "consumer",
    type: "text",
    text: "Perfect! AC unit lounge mein hai. Gate code 1234 hai — guard ko bata dena.",
    timestamp: "Yesterday · 8:47 PM",
  },
  {
    id: "m3",
    sender: "provider",
    type: "voice",
    voiceDuration: "0:08",
    translation: {
      fromLang: "Urdu",
      toLang: "English",
      translatedText: "Understood! I will bring all necessary tools and spare parts. No need to worry.",
    },
    timestamp: "Yesterday · 8:50 PM",
  },
  {
    id: "m4",
    sender: "consumer",
    type: "text",
    text: "If replacement parts are needed, budget is PKR 3,000 max. Please confirm before buying.",
    timestamp: "Yesterday · 8:52 PM",
  },
  {
    id: "m5",
    sender: "consumer",
    type: "voice",
    voiceDuration: "0:05",
    translation: {
      fromLang: "English",
      toLang: "Urdu",
      translatedText: "Theek hai, kal subah dekhte hain. Shukriya! 🙏",
    },
    timestamp: "Yesterday · 8:53 PM",
  },
  {
    id: "m6",
    sender: "provider",
    type: "text",
    text: "Bilkul! Main exactly 9 baje pohonch jaunga. Koi fikar nahi. 🔧",
    timestamp: "Today · 8:58 AM",
  },
];

/* ─── Props ─── */
interface HzDirectChatScreenProps {
  onBack?: () => void;
  role?: "consumer" | "provider";
}

/* ─── Main component ─── */
export const HzDirectChatScreen: React.FC<HzDirectChatScreenProps> = ({
  onBack,
  role = "consumer",
}) => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText]     = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordSecs, setRecordSecs]   = useState(0);
  const [playingId, setPlayingId]     = useState<string | null>(null);
  const listRef  = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const myRole        = role === "provider" ? "provider" : "consumer";
  const partnerName   = role === "provider" ? "Zain Ahmed"              : "Ali Hassan";
  const partnerInit   = role === "provider" ? "ZA"                      : "AH";
  const partnerSub    = role === "provider" ? "Consumer · AC Repairing"  : "AC Repairing Specialist";

  /* Auto-scroll to bottom */
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  /* Recording timer */
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setRecordSecs((s) => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordSecs(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

  const fmtTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const sendText = () => {
    const t = inputText.trim();
    if (!t) return;
    setMessages((p) => [
      ...p,
      { id: `m${Date.now()}`, sender: myRole, type: "text", text: t, timestamp: "Now" },
    ]);
    setInputText("");
  };

  const stopRecording = () => {
    const duration = fmtTime(Math.max(recordSecs, 1));
    setMessages((p) => [
      ...p,
      {
        id: `m${Date.now()}`,
        sender: myRole,
        type: "voice",
        voiceDuration: duration,
        timestamp: "Now",
      },
    ]);
    setIsRecording(false);
  };

  /* ── Bubble renderer ── */
  const renderBubble = (msg: Message, idx: number) => {
    const isMine   = msg.sender === myRole;
    const isPlaying = playingId === msg.id;

    /* "Today" date-separator injection */
    const prev = messages[idx - 1];
    const showToday =
      msg.timestamp.startsWith("Today") &&
      (!prev || !prev.timestamp.startsWith("Today"));

    return (
      <React.Fragment key={msg.id}>
        {showToday && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              margin: "4px 0 16px",
            }}
          >
            <div style={{ flex: 1, height: "1px", backgroundColor: "#DDD9D3" }} />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "10px",
                fontWeight: 600,
                color: GREY,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Today
            </span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#DDD9D3" }} />
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: isMine ? "flex-end" : "flex-start",
            gap: "3px",
            marginBottom: "12px",
          }}
        >
          {msg.type === "text" ? (
            /* Text bubble */
            <div
              style={{
                maxWidth: "76%",
                backgroundColor: isMine ? NAVY : "#FFFFFF",
                borderRadius: isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                padding: "10px 14px",
                boxShadow: "0px 1px 4px rgba(0,0,0,0.08)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: "20px",
                  color: isMine ? "#FFFFFF" : "#1A1A1A",
                }}
              >
                {msg.text}
              </p>
            </div>
          ) : (
            /* Voice bubble + optional translation card */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isMine ? "flex-end" : "flex-start",
                gap: "5px",
              }}
            >
              <div
                style={{
                  backgroundColor: isMine ? NAVY : "#FFFFFF",
                  borderRadius: isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow: "0px 1px 4px rgba(0,0,0,0.08)",
                  minWidth: "168px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setPlayingId((p) => (p === msg.id ? null : msg.id))}
                  aria-label={isPlaying ? "Pause" : "Play voice message"}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: isMine ? "rgba(255,255,255,0.15)" : "#EEEEF5",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  {isPlaying ? (
                    <Pause size={13} color={isMine ? "#FFF" : NAVY} fill={isMine ? "#FFF" : NAVY} />
                  ) : (
                    <Play size={13} color={isMine ? "#FFF" : NAVY} fill={isMine ? "#FFF" : NAVY} />
                  )}
                </button>
                <WaveformBars bright={isMine} />
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: isMine ? "rgba(255,255,255,0.7)" : GREY,
                    flexShrink: 0,
                  }}
                >
                  {msg.voiceDuration}
                </span>
              </div>

              {/* Translation card */}
              {msg.translation && (
                <div
                  style={{
                    maxWidth: "248px",
                    backgroundColor: "#F7F5F1",
                    borderRadius: "10px",
                    border: `1px solid ${BORDER}`,
                    padding: "8px 12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Globe size={12} color={GREEN} strokeWidth={2.5} />
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "10px",
                        fontWeight: 700,
                        color: GREEN,
                        letterSpacing: "0.3px",
                      }}
                    >
                      {msg.translation.fromLang} → {msg.translation.toLang}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      lineHeight: "16px",
                      color: "#444",
                      fontStyle: "italic",
                    }}
                  >
                    "{msg.translation.translatedText}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Timestamp */}
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "10px",
              color: GREY,
              paddingLeft: isMine ? 0 : "2px",
              paddingRight: isMine ? "2px" : 0,
            }}
          >
            {msg.timestamp}
          </span>
        </div>
      </React.Fragment>
    );
  };

  /* ── Layout ── */
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: CHAT_BG,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{RECORD_STYLES}</style>

      {/* Status bar */}
      <div
        aria-hidden="true"
        style={{ height: "24px", flexShrink: 0, backgroundColor: "#FFFFFF" }}
      />

      {/* Header */}
      <header
        style={{
          height: "64px",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #EFEFEF",
          display: "flex",
          alignItems: "center",
          paddingLeft: "4px",
          paddingRight: "12px",
          gap: "6px",
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          style={{
            width: "44px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <ArrowLeft size={22} color="#1A1A1A" />
        </button>

        {/* Avatar */}
        <div
          aria-hidden="true"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#EEEEF5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              color: NAVY,
            }}
          >
            {partnerInit}
          </span>
        </div>

        {/* Name + status */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "15px",
              fontWeight: 700,
              color: "#1A1A1A",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {partnerName}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              marginTop: "1px",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: GREEN,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "11px",
                color: GREY,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {partnerSub}
            </span>
          </div>
        </div>

        <button
          type="button"
          aria-label="Voice call"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "#F5F5F5",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <Phone size={16} color="#1A1A1A" />
        </button>
        <button
          type="button"
          aria-label="More options"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "#F5F5F5",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <MoreVertical size={16} color="#1A1A1A" />
        </button>
      </header>

      {/* Booking context banner */}
      <div
        style={{
          backgroundColor: "#EEEEF5",
          borderBottom: "1px solid rgba(22,21,51,0.08)",
          padding: "7px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: NAVY,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            color: NAVY,
            textAlign: "center",
          }}
        >
          Booking #USJ-24891 · AC Repairing · Sat, 18 May · 9:00 AM
        </span>
      </div>

      {/* Message list */}
      <div
        ref={listRef}
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Yesterday separator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          <div style={{ flex: 1, height: "1px", backgroundColor: "#DDD9D3" }} />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "10px",
              fontWeight: 600,
              color: GREY,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Yesterday
          </span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#DDD9D3" }} />
        </div>

        {messages.map((msg, i) => renderBubble(msg, i))}

        {/* Translation badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            marginTop: "8px",
          }}
        >
          <Globe size={11} color={GREY} />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "10px",
              color: GREY,
              textAlign: "center",
            }}
          >
            Ustaad G auto-translates voice messages across languages
          </span>
        </div>
      </div>

      {/* Input bar (shown when NOT recording) */}
      {!isRecording && (
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderTop: "1px solid #EFEFEF",
            padding: "10px 12px 16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          {/* Text input pill */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              backgroundColor: "#F5F5F5",
              borderRadius: "22px",
              border: "1px solid #EFEFEF",
              paddingLeft: "16px",
              paddingRight: "10px",
              height: "44px",
            }}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendText()}
              placeholder="Type a message..."
              aria-label="Message input"
              style={{
                flex: 1,
                background: "none",
                border: "none",
                outline: "none",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                color: "#1A1A1A",
                minWidth: 0,
              }}
            />
          </div>

          {/* Send OR Mic — swap based on whether text is typed */}
          {inputText.trim() ? (
            <button
              type="button"
              onClick={sendText}
              aria-label="Send message"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: NAVY,
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <Send size={18} color="#FFFFFF" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsRecording(true)}
              aria-label="Record voice message"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: NAVY,
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <Mic size={18} color="#FFFFFF" />
            </button>
          )}
        </div>
      )}

      {/* Recording overlay (replaces input bar) */}
      {isRecording && (
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderTop: "1px solid #EFEFEF",
            padding: "14px 16px 20px",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {/* Status row: red dot + "Recording" + timer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: RED_DOT,
                animation: "recPulse 1s ease-in-out infinite",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                color: "#1A1A1A",
              }}
            >
              Recording...
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 400,
                color: GREY,
                minWidth: "34px",
              }}
            >
              {fmtTime(recordSecs)}
            </span>
          </div>

          {/* Animated waveform bars */}
          <div
            aria-hidden="true"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              height: "52px",
            }}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                style={{
                  width: "5px",
                  borderRadius: "3px",
                  backgroundColor: NAVY,
                  animation: `recBar${i} ${0.38 + i * 0.07}s ease-in-out infinite`,
                  animationDelay: `${(i - 1) * 0.06}s`,
                }}
              />
            ))}
          </div>

          {/* Cancel + Stop & Send */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={() => setIsRecording(false)}
              aria-label="Cancel recording"
              style={{
                flex: 1,
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "transparent",
                border: "1px solid #D8D8D8",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                color: GREY,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <X size={14} color={GREY} />
              Cancel
            </button>
            <button
              type="button"
              onClick={stopRecording}
              aria-label="Stop recording and send"
              style={{
                flex: 2,
                height: "44px",
                borderRadius: "12px",
                backgroundColor: NAVY,
                border: "none",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "#FFFFFF",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <Square size={13} color="#FFFFFF" fill="#FFFFFF" />
              Stop &amp; Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
