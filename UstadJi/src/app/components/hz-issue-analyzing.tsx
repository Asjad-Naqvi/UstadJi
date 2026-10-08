import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

interface HzIssueAnalyzingProps {
  onComplete?: () => void;
}

export const HzIssueAnalyzing: React.FC<HzIssueAnalyzingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 400);
    const t2 = setTimeout(() => setStep(2), 1200);
    const t3 = setTimeout(() => setStep(3), 2000);
    const t4 = setTimeout(() => onComplete?.(), 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  const statusLines = [
    { minStep: 1, text: "Service type identify kar rahe hain..." },
    { minStep: 2, text: "Urgency level check ho rahi hai..." },
    { minStep: 3, text: "Nearest providers dhundh rahe hain..." },
  ];

  return (
    <>
      <style>{`
        @keyframes analyzePulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(22,21,51,0.3); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 12px rgba(22,21,51,0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dotSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
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
        <div style={{ height: 24, backgroundColor: "#FAF8F5" }} />

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 32px",
          }}
        >
          {/* Navy badge circle */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              backgroundColor: "#161533",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "analyzePulse 1.8s ease infinite",
              marginBottom: 20,
            }}
          >
            <Sparkles size={32} color="#FFFFFF" />
          </div>

          {/* Headline */}
          <h2
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 22,
              fontWeight: 700,
              color: "#1A1A1A",
              textAlign: "center",
              marginBottom: 4,
              marginTop: 0,
            }}
          >
            Samajh rahe hain...
          </h2>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              fontWeight: 400,
              color: "#9B9B9B",
              textAlign: "center",
              marginBottom: 28,
              marginTop: 0,
            }}
          >
            Understanding your issue
          </p>

          {/* Status lines */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              width: "100%",
            }}
          >
            {statusLines.map((line, index) =>
              step >= line.minStep ? (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    animation: "fadeSlideUp 0.4s ease forwards",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#4CAF84",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 14,
                      color: "#555555",
                    }}
                  >
                    {line.text}
                  </span>
                </div>
              ) : null
            )}
          </div>

          {/* CSS Spinner */}
          <div
            style={{
              marginTop: 32,
              width: 24,
              height: 24,
              borderRadius: "50%",
              border: "2px solid #E8E3DB",
              borderTop: "2px solid #161533",
              animation: "dotSpin 1s linear infinite",
            }}
          />
        </div>
      </div>
    </>
  );
};
