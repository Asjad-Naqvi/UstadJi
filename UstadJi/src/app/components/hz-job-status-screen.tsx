import React, { useState } from "react";
import { ArrowLeft, User, Phone, ChevronRight, FileText } from "lucide-react";
import { HzButton } from "./hz-button";

/* ─── Step definitions ─── */
type StepId = "confirmed" | "en-route" | "in-progress" | "completed";

interface StepDef {
  id: StepId;
  label: string;
  shortLabel: string;
  description: string;
  eta: string;
}

const STEPS: StepDef[] = [
  {
    id: "confirmed",
    label: "Confirmed",
    shortLabel: "Confirmed",
    description: "Your booking has been accepted. Ali Hassan is preparing to head your way.",
    eta: "Arriving in ~25 min",
  },
  {
    id: "en-route",
    label: "En Route",
    shortLabel: "En Route",
    description: "Ali Hassan is on his way to your location in G-13.",
    eta: "Arriving in ~12 min",
  },
  {
    id: "in-progress",
    label: "In Progress",
    shortLabel: "In Progress",
    description: "Service is underway. Ali Hassan is actively working on your AC unit.",
    eta: "Estimated completion in ~45 min",
  },
  {
    id: "completed",
    label: "Completed",
    shortLabel: "Done ✓",
    description: "Job completed successfully. Please confirm and rate your experience.",
    eta: "Completed",
  },
];

const NAVY = "#161533";
const GREEN = "#4CAF84";

/* ─── Horizontal step tracker ─── */
const StepTracker: React.FC<{ currentIndex: number }> = ({ currentIndex }) => (
  <div
    role="status"
    aria-label={`Job status: ${STEPS[currentIndex].label}`}
    style={{
      backgroundColor: "#FFFFFF",
      borderBottom: "1px solid #EFEFEF",
      paddingLeft: "16px",
      paddingRight: "16px",
      paddingTop: "14px",
      paddingBottom: "14px",
      flexShrink: 0,
    }}
  >
    <div style={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
      {STEPS.map((step, i) => {
        const isDone    = i < currentIndex;
        const isActive  = i === currentIndex;
        const isPending = i > currentIndex;

        const dotColor  = isDone ? GREEN : isActive ? NAVY : "#E8E3DB";
        const lineColor = i < STEPS.length - 1
          ? (i < currentIndex ? GREEN : "#E8E3DB")
          : null;

        return (
          <React.Fragment key={step.id}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "5px",
                flexShrink: 0,
              }}
            >
              {/* Dot */}
              <div
                aria-hidden="true"
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  backgroundColor: (isDone || isActive) ? dotColor : "transparent",
                  border: `2px solid ${dotColor}`,
                  boxSizing: "border-box",
                  transition: "background-color 0.3s ease, border-color 0.3s ease",
                }}
              />
              {/* Label */}
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "10px",
                  fontWeight: isActive ? 700 : isDone ? 500 : 400,
                  lineHeight: "13px",
                  color: isDone ? GREEN : isActive ? NAVY : "#9B9B9B",
                  whiteSpace: "nowrap",
                  transition: "color 0.3s ease",
                }}
              >
                {step.shortLabel}
              </span>
            </div>

            {/* Connector line */}
            {lineColor !== null && (
              <div
                aria-hidden="true"
                style={{
                  flex: 1,
                  height: "2px",
                  backgroundColor: lineColor,
                  marginTop: "6px",
                  marginLeft: "2px",
                  marginRight: "2px",
                  transition: "background-color 0.4s ease",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  </div>
);

/* ─── Card shell ─── */
const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      backgroundColor: "#FFFFFF",
      borderRadius: "12px",
      boxShadow: "0px 2px 8px rgba(0,0,0,0.07)",
      border: "1px solid #E8E3DB",
      padding: "16px",
      ...style,
    }}
  >
    {children}
  </div>
);

/* ─── Detail row ─── */
const DetailRow: React.FC<{
  label: string;
  value: React.ReactNode;
  last?: boolean;
  valueColor?: string;
}> = ({ label, value, last, valueColor = "#1A1A1A" }) => (
  <div
    style={{
      minHeight: "36px",
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
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "20px",
        color: valueColor,
        textAlign: "right",
      }}
    >
      {value}
    </span>
  </div>
);

/* ─── Props ─── */
interface HzJobStatusScreenProps {
  onBack?: () => void;
  onReportIssue?: () => void;
  onJobComplete?: () => void;
  onViewInvoice?: () => void;
  onGenerateInvoice?: () => void;
  onMessageProvider?: () => void;
  onReschedule?: () => void;
  onCancel?: () => void;
  onProviderCancelled?: () => void;
  rescheduled?: boolean;
}

/* ─── Main screen ─── */
export const HzJobStatusScreen: React.FC<HzJobStatusScreenProps> = ({
  onBack,
  onReportIssue,
  onJobComplete,
  onViewInvoice,
  onGenerateInvoice,
  onMessageProvider,
  onReschedule,
  onCancel,
  onProviderCancelled,
  rescheduled,
}) => {
  const [stepIndex, setStepIndex] = useState(1); /* start at "En Route" for the demo */
  const [invoiceRequested, setInvoiceRequested] = useState(false);

  const currentStep = STEPS[stepIndex];
  const isCompleted = stepIndex === STEPS.length - 1;

  const advanceStep = () => {
    if (!isCompleted) setStepIndex((i) => i + 1);
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
      {/* Status bar */}
      <div
        aria-hidden="true"
        style={{ height: "24px", flexShrink: 0, backgroundColor: "#FFFFFF" }}
      />

      {/* App bar */}
      <header
        style={{
          height: "56px",
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
          Service in Progress
        </span>
      </header>

      {/* Step tracker banner */}
      <StepTracker currentIndex={stepIndex} />

      {/* Scrollable body */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          paddingLeft: "16px",
          paddingRight: "16px",
          paddingTop: "16px",
          paddingBottom: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {/* ── Live status card ── */}
        <div
          role="status"
          style={{
            borderRadius: "12px",
            backgroundColor: isCompleted ? "#F0FAF4" : "#EEEEF5",
            border: `1px solid ${isCompleted ? "#4CAF8440" : "rgba(22,21,51,0.12)"}`,
            padding: "14px 16px",
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
          }}
        >
          {/* Pulsing indicator */}
          <div
            aria-hidden="true"
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: isCompleted ? GREEN : NAVY,
              flexShrink: 0,
              marginTop: "5px",
              boxShadow: isCompleted
                ? `0 0 0 4px ${GREEN}28`
                : `0 0 0 4px ${NAVY}22`,
            }}
          />
          <div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: isCompleted ? GREEN : NAVY,
              }}
            >
              {currentStep.label}
            </div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 400,
                color: "#9B9B9B",
                marginTop: "4px",
                lineHeight: "18px",
              }}
            >
              {currentStep.description}
            </div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                fontWeight: 500,
                color: isCompleted ? GREEN : NAVY,
                marginTop: "6px",
              }}
            >
              {currentStep.eta}
            </div>
          </div>
        </div>

        {/* ── Provider card ── */}
        <Card>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "11px",
              fontWeight: 400,
              lineHeight: "15px",
              color: "#9B9B9B",
            }}
          >
            Your Ustad (Provider)
          </span>

          <div
            style={{
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            {/* Avatar */}
            <div
              aria-hidden="true"
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "50%",
                backgroundColor: "#E8E3DB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <User size={22} color="#FFFFFF" />
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#1A1A1A",
                }}
              >
                Ali Hassan
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "13px",
                    fontWeight: 400,
                    color: "#9B9B9B",
                  }}
                >
                  AC Technician
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    height: "18px",
                    paddingLeft: "8px",
                    paddingRight: "8px",
                    borderRadius: "9px",
                    backgroundColor: "#4CAF8420",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "11px",
                    fontWeight: 500,
                    color: GREEN,
                  }}
                >
                  ✓ Verified
                </span>
              </div>
            </div>

            {/* Call button */}
            <a
              href="tel:+923001234567"
              aria-label="Call Ali Hassan"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#EEEEF5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                textDecoration: "none",
              }}
            >
              <Phone size={20} color={NAVY} aria-hidden="true" />
            </a>
          </div>

          {/* Divider */}
          <div
            aria-hidden="true"
            style={{ height: "1px", backgroundColor: "#EFEFEF", margin: "12px 0" }}
          />

          <DetailRow
            label="Estimated Arrival"
            value={currentStep.eta}
            valueColor={NAVY}
          />
          <DetailRow
            label="Contact"
            value={
              <a
                href="tel:+923001234567"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: NAVY,
                  textDecoration: "none",
                }}
              >
                +92 300 1234567
              </a>
            }
            last
          />
        </Card>

        {/* ── Job details card ── */}
        <Card>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "11px",
              fontWeight: 400,
              lineHeight: "15px",
              color: "#9B9B9B",
            }}
          >
            Job Details
          </span>
          <div style={{ marginTop: "10px" }}>
            <DetailRow label="Service"   value="AC Repairing" />
            <DetailRow label="Location"  value="G-13 · House 12, Street 4" />
            <DetailRow
              label="Scheduled"
              value={
                rescheduled
                  ? <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>Tomorrow · 4:30 PM</span>
                      <span style={{ display: "inline-flex", alignItems: "center", height: "18px", padding: "0 7px", borderRadius: "9px", backgroundColor: "#F0FAF4", border: "1px solid #4CAF8440", fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "#4CAF84" }}>Rescheduled</span>
                    </span>
                  : "Sat, 18 May · 9:00 AM"
              }
            />
            <DetailRow label="Estimate"  value="PKR 2,873" last />
          </div>
        </Card>

        {/* ── Payment reminder ── */}
        <div
          role="note"
          style={{
            borderRadius: "12px",
            backgroundColor: "#FFF4E0",
            border: `1px solid rgba(22,21,51,0.15)`,
            padding: "14px 16px",
          }}
        >
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
            💵 Pay <strong>PKR 2,873</strong> directly to Ali Hassan in cash upon job completion.
          </p>
        </div>

        {/* ── Invoice status card ── */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <FileText size={16} color={NAVY} aria-hidden="true" />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, color: "#1A1A1A" }}>
              Invoice
            </span>
          </div>
          {invoiceRequested ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: "10px", padding: "12px 14px" }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <circle cx="9" cy="9" r="9" fill="#22C55E" />
                <path d="M5 9.5 L7.5 12 L13 6.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#15803D" }}>Request Sent!</p>
                <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#16A34A" }}>Ali Hassan will send your invoice shortly.</p>
              </div>
            </div>
          ) : isCompleted ? (
            <button
              type="button"
              onClick={onViewInvoice}
              style={{ width: "100%", height: "40px", borderRadius: "8px", backgroundColor: NAVY, border: "none", fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#FFFFFF", cursor: "pointer" }}
            >
              Get Invoice from Provider
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setInvoiceRequested(true)}
              style={{ width: "100%", height: "40px", borderRadius: "8px", backgroundColor: "transparent", border: `1.5px solid ${NAVY}`, fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: NAVY, cursor: "pointer" }}
            >
              Request Invoice from Provider
            </button>
          )}
        </Card>

        {/* ── Simulate step advancement (for demo) ── */}
        {!isCompleted && (
          <button
            type="button"
            onClick={advanceStep}
            style={{
              width: "100%",
              height: "44px",
              borderRadius: "10px",
              backgroundColor: "transparent",
              border: "1px dashed #D8D8D8",
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: 400,
              color: "#9B9B9B",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            Simulate Next Step
            <ChevronRight size={14} color="#9B9B9B" aria-hidden="true" />
          </button>
        )}

        {/* ── Message Provider ── */}
        <button
          type="button"
          onClick={onMessageProvider}
          style={{
            width: "100%",
            height: "48px",
            borderRadius: "12px",
            backgroundColor: "#EEEEF5",
            border: "1px solid rgba(22,21,51,0.12)",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            color: "#161533",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#161533" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Message Provider
        </button>

        {/* ── Reschedule & Cancel ── */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={onReschedule}
            style={{
              flex: 1,
              height: "44px",
              borderRadius: "12px",
              backgroundColor: "#FFFFFF",
              border: "1.5px solid #E8E3DB",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              color: "#1A1A1A",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Reschedule
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              height: "44px",
              borderRadius: "12px",
              backgroundColor: "#FFF1F2",
              border: "1.5px solid #FECDD3",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              color: "#E11D48",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            Cancel
          </button>
        </div>

        {/* ── Demo: simulate provider cancellation ── */}
        {onProviderCancelled && (
          <button
            type="button"
            onClick={onProviderCancelled}
            style={{
              width: "100%",
              height: "38px",
              borderRadius: "10px",
              background: "none",
              border: "1px dashed #D8D8D8",
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              color: "#9B9B9B",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            Simulate provider cancellation →
          </button>
        )}

        {/* ── Report issue ── */}
        <div style={{ textAlign: "center" }}>
          <button
            type="button"
            onClick={onReportIssue}
            style={{
              background: "none",
              border: "none",
              padding: "10px 24px",
              minHeight: "44px",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 400,
              color: "#9B9B9B",
              cursor: "pointer",
            }}
          >
            Report an Issue
          </button>
        </div>
      </div>

      {/* ── Pinned bottom CTA ── */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid #EFEFEF",
          padding: "12px 16px 16px",
          flexShrink: 0,
        }}
      >
        {isCompleted ? (
          <>
            <HzButton variant="primary" fullWidth onClick={onJobComplete}>
              Confirm Job Complete →
            </HzButton>
            <p
              style={{
                margin: 0,
                marginTop: "6px",
                fontFamily: "Inter, sans-serif",
                fontSize: "11px",
                fontWeight: 400,
                color: "#9B9B9B",
                textAlign: "center",
              }}
            >
              Tap to confirm and leave a review for Ali Hassan.
            </p>
          </>
        ) : (
          <>
            <div
              style={{
                width: "100%",
                height: "56px",
                borderRadius: "12px",
                backgroundColor: "#F0F0F0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "15px",
                  fontWeight: 500,
                  color: "#9B9B9B",
                }}
              >
                Waiting for job to complete…
              </span>
            </div>
            <p
              style={{
                margin: 0,
                marginTop: "6px",
                fontFamily: "Inter, sans-serif",
                fontSize: "11px",
                fontWeight: 400,
                color: "#9B9B9B",
                textAlign: "center",
              }}
            >
              Available once Ali Hassan marks the job done.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
