import React, { useEffect, useState } from "react";

const NAVY = "#1C1B33";
const BG = "#FAF8F5";

/* ─────────────────────────────────────────
   Flat 2D tool icon components
   Small decorative elements — opacity kept
   low in animations to stay subtle
───────────────────────────────────────── */

const WrenchIcon: React.FC = () => (
  <svg width="22" height="32" viewBox="0 0 22 32" fill="none" aria-hidden="true">
    {/* Left jaw arm */}
    <rect x="2" y="0" width="7" height="14" rx="3.5" fill={NAVY}/>
    {/* Right jaw arm */}
    <rect x="13" y="0" width="7" height="14" rx="3.5" fill={NAVY}/>
    {/* Jaw-to-handle bridge */}
    <rect x="2" y="11" width="18" height="5" fill={NAVY}/>
    {/* Handle */}
    <rect x="7.5" y="14" width="7" height="18" rx="3.5" fill={NAVY}/>
  </svg>
);

const ScrewdriverIcon: React.FC = () => (
  <svg width="12" height="38" viewBox="0 0 12 38" fill="none" aria-hidden="true">
    {/* Handle */}
    <rect x="0" y="0" width="12" height="16" rx="6" fill={NAVY}/>
    {/* Shaft */}
    <rect x="4" y="16" width="4" height="18" rx="2" fill={NAVY}/>
    {/* Flat-head tip */}
    <rect x="1" y="34" width="10" height="3.5" rx="1.5" fill={NAVY}/>
  </svg>
);

const HammerIcon: React.FC = () => (
  <svg width="36" height="20" viewBox="0 0 36 20" fill="none" aria-hidden="true">
    {/* Head */}
    <rect x="0" y="0" width="18" height="20" rx="4" fill={NAVY}/>
    {/* Handle */}
    <rect x="15" y="7" width="21" height="6" rx="3" fill={NAVY}/>
  </svg>
);

const NutIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    {/* Hexagon body */}
    <path d="M12 1.5 L20.66 6.25 L20.66 17.75 L12 22.5 L3.34 17.75 L3.34 6.25 Z" fill={NAVY}/>
    {/* Centre hole */}
    <circle cx="12" cy="12" r="4.5" fill={BG}/>
  </svg>
);

/* ─────────────────────────────────────────
   Main splash screen
───────────────────────────────────────── */
export const HzSplashScreen: React.FC = () => {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setStarted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /* ── CSS keyframe animations injected inline ── */
  const keyframes = `
    @keyframes splash-wrench {
      0%   { opacity: 0;    transform: rotate(-28deg) translateY(10px); }
      18%  { opacity: 0.34; transform: rotate(-28deg) translateY(0px); }
      46%  { opacity: 0.34; transform: rotate(-28deg) translateY(-6px); }
      70%  { opacity: 0.34; transform: rotate(-28deg) translateY(2px); }
      88%  { opacity: 0;    transform: rotate(-28deg) translateY(-1px); }
      100% { opacity: 0;    transform: rotate(-28deg) translateY(-1px); }
    }
    @keyframes splash-screwdriver {
      0%   { opacity: 0;    transform: rotate(22deg) translateX(8px); }
      20%  { opacity: 0.30; transform: rotate(22deg) translateX(0px); }
      50%  { opacity: 0.30; transform: rotate(22deg) translateX(-5px); }
      74%  { opacity: 0.30; transform: rotate(22deg) translateX(2px); }
      90%  { opacity: 0;    transform: rotate(22deg) translateX(2px); }
      100% { opacity: 0;    transform: rotate(22deg) translateX(2px); }
    }
    @keyframes splash-hammer {
      0%   { opacity: 0;    transform: rotate(14deg) translateY(-9px); }
      24%  { opacity: 0.32; transform: rotate(14deg) translateY(0px); }
      54%  { opacity: 0.32; transform: rotate(14deg) translateY(-5px); }
      76%  { opacity: 0.32; transform: rotate(14deg) translateY(3px); }
      92%  { opacity: 0;    transform: rotate(14deg) translateY(3px); }
      100% { opacity: 0;    transform: rotate(14deg) translateY(3px); }
    }
    @keyframes splash-nut {
      0%   { opacity: 0;    transform: rotate(0deg); }
      22%  { opacity: 0.30; transform: rotate(-14deg); }
      54%  { opacity: 0.30; transform: rotate(20deg); }
      78%  { opacity: 0.30; transform: rotate(-6deg); }
      92%  { opacity: 0;    transform: rotate(-6deg); }
      100% { opacity: 0;    transform: rotate(-6deg); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>

      <div
        style={{
          flex: 1,
          backgroundColor: BG,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ──────────────────────────────────────
            Floating tool decorations
            Positioned around the logo, clear of
            all text. Opacity 0 until started.
        ────────────────────────────────────── */}

        {/* Wrench — upper-left of logo */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            /* Tool (22×32) centered at (50%−88px, 50%−113px) */
            top: "calc(50% - 129px)",
            left: "calc(50% - 99px)",
            opacity: 0,
            willChange: "opacity, transform",
            animation: started
              ? "splash-wrench 4.6s cubic-bezier(0.4,0,0.2,1) 0.3s forwards"
              : "none",
          }}
        >
          <WrenchIcon />
        </div>

        {/* Screwdriver — upper-right of logo */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            /* Tool (12×38) centered at (50%+82px, 50%−118px) */
            top: "calc(50% - 137px)",
            left: "calc(50% + 76px)",
            opacity: 0,
            willChange: "opacity, transform",
            animation: started
              ? "splash-screwdriver 4.4s cubic-bezier(0.4,0,0.2,1) 0.55s forwards"
              : "none",
          }}
        >
          <ScrewdriverIcon />
        </div>

        {/* Hammer — lower-left of logo */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            /* Tool (36×20) centered at (50%−102px, 50%−8px) */
            top: "calc(50% - 18px)",
            left: "calc(50% - 120px)",
            opacity: 0,
            willChange: "opacity, transform",
            animation: started
              ? "splash-hammer 4.5s cubic-bezier(0.4,0,0.2,1) 0.75s forwards"
              : "none",
          }}
        >
          <HammerIcon />
        </div>

        {/* Hex nut — lower-right of logo */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            /* Tool (24×24) centered at (50%+100px, 50%+2px) */
            top: "calc(50% - 10px)",
            left: "calc(50% + 88px)",
            opacity: 0,
            willChange: "opacity, transform",
            animation: started
              ? "splash-nut 4.4s cubic-bezier(0.4,0,0.2,1) 1.0s forwards"
              : "none",
          }}
        >
          <NutIcon />
        </div>

        {/* ──────────────────────────────────────
            Centre branding group
            Unchanged from original — only the
            logo gains a soft ambient shadow.
        ────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Logo mark */}
          <div
            aria-label="Ustaad G logo"
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "50%",
              backgroundColor: "#161533",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0px 8px 32px rgba(22,21,51,0.18)",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "44px",
                fontWeight: 700,
                lineHeight: 1,
                color: "#FFFFFF",
                letterSpacing: "-1px",
              }}
            >
              U
            </span>
          </div>

          {/* Wordmark */}
          <h1
            style={{
              margin: 0,
              marginTop: "16px",
              fontFamily: "Inter, sans-serif",
              fontSize: "32px",
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: 0,
              color: "#1A1A1A",
              textAlign: "center",
            }}
          >
            Ustaad G
          </h1>

          {/* Taglines */}
          <div
            style={{
              marginTop: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "20px",
                color: "#9B9B9B",
                textAlign: "center",
              }}
            >
              Your service, ready when you are.
            </p>
            <p
              dir="rtl"
              lang="ur"
              style={{
                margin: 0,
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "20px",
                color: "#9B9B9B",
                textAlign: "center",
              }}
            >
              حاضر ہے جب آپ کو ضرورت ہو۔
            </p>
          </div>

          {/* Loading progress bar — 5 s linear fill, unchanged */}
          <div
            aria-hidden="true"
            style={{
              marginTop: "32px",
              width: "160px",
              height: "3px",
              borderRadius: "2px",
              backgroundColor: "#E8E3DB",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: "2px",
                backgroundColor: "#161533",
                width: started ? "100%" : "0%",
                transition: started ? "width 5s linear" : "none",
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <p
          style={{
            position: "absolute",
            bottom: "32px",
            left: 0,
            right: 0,
            margin: 0,
            fontFamily: "Inter, sans-serif",
            fontSize: "11px",
            fontWeight: 400,
            lineHeight: "15px",
            color: "#9B9B9B",
            textAlign: "center",
          }}
        >
          © Ustaad G 2026
        </p>
      </div>
    </>
  );
};
