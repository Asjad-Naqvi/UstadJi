import React, { useState, useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { HzButton } from "./hz-button";

const NAVY = "#1C1B33";
const NAVY_TINT = "#EEEEF5";
const GREEN = "#4CAF84";

/* ─────────────────────────────────────────────────────────────
   Illustration 1 — Tell Us What You Need
   Three input method boxes (Text · Voice · Photo) → Request bar
───────────────────────────────────────────────────────────── */
const IllustrationTellUs: React.FC = () => (
  <svg viewBox="0 0 260 120" width="100%" height="120" fill="none" aria-hidden="true">

    {/* ── Input method box 1: Text ── */}
    <rect x="8" y="8" width="72" height="56" rx="10" fill="white" stroke="#E8E3DB" strokeWidth="1"/>
    {/* Speech bubble */}
    <path d="M30 21 Q30 18 33 18 L55 18 Q58 18 58 21 L58 29 Q58 32 55 32 L46 32 L42 36 L42 32 L33 32 Q30 32 30 29 Z" fill={NAVY}/>
    <line x1="34" y1="23" x2="54" y2="23" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="34" y1="28" x2="48" y2="28" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <text x="44" y="52" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="500" fill={NAVY}>Text</text>

    {/* ── Input method box 2: Voice ── */}
    <rect x="94" y="8" width="72" height="56" rx="10" fill="white" stroke="#E8E3DB" strokeWidth="1"/>
    {/* Mic capsule */}
    <rect x="126" y="15" width="8" height="14" rx="4" fill={NAVY}/>
    {/* Mic arc */}
    <path d="M121 25 C121 33 139 33 139 25" stroke={NAVY} strokeWidth="2" fill="none" strokeLinecap="round"/>
    {/* Stand + base */}
    <line x1="130" y1="33" x2="130" y2="36" stroke={NAVY} strokeWidth="2" strokeLinecap="round"/>
    <line x1="126" y1="36" x2="134" y2="36" stroke={NAVY} strokeWidth="2" strokeLinecap="round"/>
    {/* Waveform bars */}
    <line x1="108" y1="23" x2="108" y2="29" stroke={GREEN} strokeWidth="2" strokeLinecap="round"/>
    <line x1="112" y1="20" x2="112" y2="32" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="116" y1="22" x2="116" y2="30" stroke={GREEN} strokeWidth="2" strokeLinecap="round"/>
    <line x1="144" y1="23" x2="144" y2="29" stroke={GREEN} strokeWidth="2" strokeLinecap="round"/>
    <line x1="148" y1="20" x2="148" y2="32" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="152" y1="22" x2="152" y2="30" stroke={GREEN} strokeWidth="2" strokeLinecap="round"/>
    <text x="130" y="52" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="500" fill={NAVY}>Voice</text>

    {/* ── Input method box 3: Photo ── */}
    <rect x="180" y="8" width="72" height="56" rx="10" fill="white" stroke="#E8E3DB" strokeWidth="1"/>
    {/* Camera body */}
    <rect x="204" y="17" width="24" height="18" rx="4" fill={NAVY}/>
    {/* Lens */}
    <circle cx="216" cy="26" r="5.5" fill={NAVY_TINT}/>
    <circle cx="216" cy="26" r="3" fill={NAVY}/>
    {/* Flash bump */}
    <rect x="225" y="14" width="6" height="5" rx="2" fill={NAVY}/>
    <text x="216" y="52" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="500" fill={NAVY}>Photo</text>

    {/* ── Downward arrow ── */}
    <line x1="130" y1="67" x2="130" y2="75" stroke="#C8C8D8" strokeWidth="2" strokeLinecap="round"/>
    <polygon points="124,73 130,81 136,73" fill="#C8C8D8"/>

    {/* ── Request created bar ── */}
    <rect x="20" y="84" width="220" height="30" rx="12" fill={NAVY}/>
    <circle cx="42" cy="99" r="9" fill={GREEN}/>
    <path d="M37 99 L41 103 L48 96" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <text x="142" y="103" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="600" fill="white">Request Created</text>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   Illustration 2 — Find the Right Ustaad
   Service need (left) → matched provider profile (right)
───────────────────────────────────────────────────────────── */
const IllustrationFindUstaad: React.FC = () => (
  <svg viewBox="0 0 260 120" width="100%" height="120" fill="none" aria-hidden="true">

    {/* ── Left: Service need card ── */}
    <rect x="8" y="18" width="98" height="84" rx="12" fill={NAVY_TINT}/>
    {/* Service icon circle */}
    <circle cx="57" cy="52" r="20" fill={NAVY}/>
    {/* White wrench inside circle */}
    <rect x="51" y="41" width="4" height="10" rx="2" fill="white"/>
    <rect x="57" y="41" width="4" height="10" rx="2" fill="white"/>
    <rect x="51" y="48" width="10" height="4" rx="1" fill="white"/>
    <rect x="54" y="51" width="5" height="12" rx="2.5" fill="white"/>
    {/* Text placeholder bars */}
    <rect x="18" y="80" width="78" height="5" rx="2.5" fill="#DDDDE8"/>
    <rect x="26" y="89" width="62" height="4" rx="2" fill="#E4E4EC"/>

    {/* ── Center: connection arrow + match spark ── */}
    <line x1="111" y1="60" x2="138" y2="60" stroke="#C4C4D4" strokeWidth="2" strokeLinecap="round"/>
    <polygon points="134,54 142,60 134,66" fill="#C4C4D4"/>
    {/* Green spark */}
    <circle cx="124" cy="50" r="8" fill={GREEN}/>
    <path d="M124 44 L125.5 48.5 L130 48.5 L126.5 51 L128 55.5 L124 53 L120 55.5 L121.5 51 L118 48.5 L122.5 48.5 Z" fill="white"/>

    {/* ── Right: Matched provider card ── */}
    <rect x="152" y="10" width="100" height="100" rx="12" fill={NAVY}/>
    {/* Avatar */}
    <circle cx="202" cy="36" r="17" fill="rgba(255,255,255,0.12)"/>
    <text x="202" y="41" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="15" fontWeight="700" fill="white">A</text>
    {/* Name bar */}
    <rect x="164" y="60" width="76" height="5" rx="2.5" fill="rgba(255,255,255,0.22)"/>
    {/* Specialty bar */}
    <rect x="172" y="69" width="60" height="4" rx="2" fill="rgba(255,255,255,0.14)"/>
    {/* Stars */}
    <text x="202" y="84" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="12" fill={GREEN}>★★★★★</text>
    {/* Best match badge */}
    <rect x="164" y="92" width="76" height="14" rx="7" fill={GREEN}/>
    <text x="202" y="102" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="600" fill="white">Best Match</text>
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   Illustration 3 — Find Work That Fits You
   Three-step provider journey: requests → manage → reputation
───────────────────────────────────────────────────────────── */
const IllustrationFindWork: React.FC = () => (
  <svg viewBox="0 0 260 120" width="100%" height="120" fill="none" aria-hidden="true">

    {/* ── Step circles ── */}
    <circle cx="42" cy="55" r="26" fill={NAVY}/>
    <circle cx="130" cy="55" r="26" fill={NAVY}/>
    <circle cx="218" cy="55" r="26" fill={NAVY}/>

    {/* ── Step 1: Document / Job Requests ── */}
    {/* Document shape (white) */}
    <rect x="34" y="44" width="16" height="20" rx="2" fill="white"/>
    {/* Document fold (top-right corner) */}
    <polygon points="46,44 50,44 50,48" fill={NAVY}/>
    <path d="M46 44 L46 48 L50 48" stroke="white" strokeWidth="1" fill="none"/>
    {/* Content lines */}
    <rect x="36" y="50" width="9" height="1.5" rx="0.75" fill={NAVY} opacity="0.25"/>
    <rect x="36" y="53" width="7" height="1.5" rx="0.75" fill={NAVY} opacity="0.25"/>
    <rect x="36" y="56" width="5" height="1.5" rx="0.75" fill={NAVY} opacity="0.25"/>

    {/* ── Step 2: Wrench / Manage Work ── */}
    {/* Wrench (white) */}
    <rect x="125" y="44" width="4" height="10" rx="2" fill="white"/>
    <rect x="131" y="44" width="4" height="10" rx="2" fill="white"/>
    <rect x="124" y="51" width="12" height="4" rx="1" fill="white"/>
    <rect x="127" y="54" width="6" height="14" rx="3" fill="white"/>

    {/* ── Step 3: Star / Build Ratings ── */}
    {/* 5-point star path (green inside navy circle) */}
    <path d="M218 40 L220 47 L227 47 L221.5 51 L223.5 58 L218 54 L212.5 58 L214.5 51 L209 47 L216 47 Z" fill={GREEN}/>

    {/* ── Step badges ── */}
    <circle cx="62" cy="34" r="9" fill={GREEN}/>
    <text x="62" y="38" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" fill="white">1</text>
    <circle cx="150" cy="34" r="9" fill={GREEN}/>
    <text x="150" y="38" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" fill="white">2</text>
    <circle cx="238" cy="34" r="9" fill={GREEN}/>
    <text x="238" y="38" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" fill="white">3</text>

    {/* ── Arrows between steps ── */}
    <line x1="70" y1="55" x2="98" y2="55" stroke="#C8C8D8" strokeWidth="2" strokeLinecap="round"/>
    <polygon points="94,49 102,55 94,61" fill="#C8C8D8"/>
    <line x1="158" y1="55" x2="186" y2="55" stroke="#C8C8D8" strokeWidth="2" strokeLinecap="round"/>
    <polygon points="182,49 190,55 182,61" fill="#C8C8D8"/>

    {/* ── Labels ── */}
    <text x="42" y="99" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="500" fill={NAVY}>Job Requests</text>
    <text x="130" y="99" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="500" fill={NAVY}>Manage Jobs</text>
    <text x="218" y="99" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="9" fontWeight="500" fill={NAVY}>Build Ratings</text>
  </svg>
);

/* ─── Card data ─── */
interface CardData {
  id: string;
  Illustration: React.FC;
  title: string;
  body: string;
}

const CARDS: CardData[] = [
  {
    id: "tell-us",
    Illustration: IllustrationTellUs,
    title: "Tell Us What You Need",
    body: "Describe your problem with text, voice, or a photo.",
  },
  {
    id: "find-ustaad",
    Illustration: IllustrationFindUstaad,
    title: "Find the Right Ustaad",
    body: "Get matched with trusted professionals based on your needs.",
  },
  {
    id: "find-work",
    Illustration: IllustrationFindWork,
    title: "Find Work That Fits You",
    body: "Receive relevant service requests, manage your jobs, and build your reputation.",
  },
];

/* ─── Props ─── */
interface HzWelcomeScreenProps {
  onGetStarted?: () => void;
  onLogin?: () => void;
  onSkip?: () => void;
}

/* ─── Main component ─── */
export const HzWelcomeScreen: React.FC<HzWelcomeScreenProps> = ({
  onGetStarted,
  onLogin,
  onSkip,
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Auto-advance every 2000 ms — reset on manual interaction */
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % CARDS.length);
    }, 2000);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (index: number) => {
    setActiveCard(Math.max(0, Math.min(CARDS.length - 1, index)));
    startTimer();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 32) {
      goTo(activeCard + (dx < 0 ? 1 : -1));
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FAF8F5",
        overflow: "hidden",
      }}
    >
      {/* Status bar spacer */}
      <div aria-hidden="true" style={{ height: "24px", flexShrink: 0, backgroundColor: "#FAF8F5" }} />

      {/* Top bar — logo left, Skip right */}
      <div
        style={{
          height: "56px",
          display: "flex",
          alignItems: "center",
          paddingLeft: "16px",
          paddingRight: "16px",
          flexShrink: 0,
        }}
      >
        <div
          aria-label="Ustaad G"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: NAVY,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            aria-hidden="true"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 600, lineHeight: 1, color: "#FFFFFF" }}
          >
            U
          </span>
        </div>
        <span
          style={{
            marginLeft: "8px",
            fontFamily: "Inter, sans-serif",
            fontSize: "17px",
            fontWeight: 600,
            lineHeight: 1,
            color: "#1A1A1A",
          }}
        >
          Ustaad G
        </span>
        <button
          type="button"
          onClick={onSkip}
          aria-label="Skip onboarding"
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            padding: "8px 4px",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            lineHeight: "20px",
            color: "#9B9B9B",
            cursor: "pointer",
          }}
        >
          Skip
        </button>
      </div>

      {/* ── Hero section ── */}
      <div style={{ paddingLeft: "24px", paddingRight: "24px", paddingTop: "24px", flexShrink: 0 }}>
        {/* Large logo mark */}
        <div
          aria-hidden="true"
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            backgroundColor: NAVY,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
            boxShadow: "0px 8px 24px rgba(28, 27, 51, 0.22)",
          }}
        >
          <span
            style={{ fontFamily: "Inter, sans-serif", fontSize: "32px", fontWeight: 600, lineHeight: 1, color: "#FFFFFF" }}
          >
            U
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            margin: 0,
            fontFamily: "Inter, sans-serif",
            fontSize: "28px",
            fontWeight: 700,
            lineHeight: "34px",
            color: "#1A1A1A",
            letterSpacing: "-0.3px",
          }}
        >
          Your Expert,{"\n"}
          <span style={{ color: NAVY }}>At Your Door.</span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            margin: 0,
            marginTop: "10px",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "21px",
            color: "#9B9B9B",
          }}
        >
          Connecting customers with trusted professionals through AI-powered booking.
        </p>
      </div>

      {/* ── Feature card carousel ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingTop: "24px",
          paddingBottom: "8px",
          minHeight: 0,
        }}
      >
        {/* Slide track */}
        <div
          style={{ overflow: "hidden", flexShrink: 0 }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          role="region"
          aria-label="Feature highlights"
          aria-roledescription="carousel"
        >
          <div
            style={{
              display: "flex",
              transform: `translateX(calc(-${activeCard * 100}% - ${activeCard * 16}px))`,
              transition: "transform 0.3s cubic-bezier(0.42, 0, 0.58, 1)",
            }}
          >
            {CARDS.map((card, idx) => (
              <div
                key={card.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`Feature ${idx + 1} of ${CARDS.length}: ${card.title}`}
                style={{
                  minWidth: "calc(100% - 48px)",
                  marginLeft: idx === 0 ? "24px" : "16px",
                  marginRight: idx === CARDS.length - 1 ? "24px" : 0,
                  backgroundColor: "#FFFFFF",
                  borderRadius: "16px",
                  border: "1px solid #EEEEF0",
                  boxShadow: "0px 2px 8px rgba(28, 27, 51, 0.06), 0px 8px 24px rgba(28, 27, 51, 0.04)",
                  padding: "20px 20px 18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  boxSizing: "border-box",
                }}
              >
                {/* Illustration */}
                <div aria-hidden="true" style={{ width: "100%", overflow: "hidden", borderRadius: "8px" }}>
                  <card.Illustration />
                </div>

                {/* Text */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <h2
                    style={{
                      margin: 0,
                      fontFamily: "Inter, sans-serif",
                      fontSize: "16px",
                      fontWeight: 700,
                      lineHeight: "22px",
                      color: "#1A1A1A",
                      letterSpacing: "-0.15px",
                    }}
                  >
                    {card.title}
                  </h2>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      fontWeight: 400,
                      lineHeight: "20px",
                      color: "#9B9B9B",
                    }}
                  >
                    {card.body}
                  </p>
                </div>

                {/* Swipe hint */}
                {idx < CARDS.length - 1 && (
                  <div
                    aria-hidden="true"
                    style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}
                  >
                    <span
                      style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 400, color: "#C8C8C8" }}
                    >
                      Swipe for more
                    </span>
                    <ArrowRight size={12} color="#C8C8C8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pagination dots */}
        <div
          role="tablist"
          aria-label="Feature slides"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "7px",
            marginTop: "20px",
            flexShrink: 0,
          }}
        >
          {CARDS.map((card, idx) => (
            <button
              key={card.id}
              type="button"
              role="tab"
              aria-selected={idx === activeCard}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => goTo(idx)}
              style={{
                width: idx === activeCard ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                backgroundColor: idx === activeCard ? NAVY : "#D8D8D8",
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "width 0.3s cubic-bezier(0.42, 0, 0.58, 1), background-color 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Bottom CTA area ── */}
      <div
        style={{
          paddingLeft: "24px",
          paddingRight: "24px",
          paddingBottom: "32px",
          paddingTop: "8px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <HzButton
          variant="primary"
          fullWidth
          onClick={onGetStarted}
          style={{
            backgroundColor: NAVY,
            boxShadow: "0px 4px 16px rgba(28, 27, 51, 0.28), 0px 1px 3px rgba(28, 27, 51, 0.12)",
          }}
        >
          Get Started
        </HzButton>

        <p
          style={{
            margin: 0,
            marginTop: "16px",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "20px",
            color: "#9B9B9B",
            textAlign: "center",
          }}
        >
          Already have an account?{" "}
          <button
            type="button"
            onClick={onLogin}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: "20px",
              color: NAVY,
              cursor: "pointer",
            }}
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};
