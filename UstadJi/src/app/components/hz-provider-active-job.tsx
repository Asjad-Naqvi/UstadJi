import React, { useState } from "react";
import { ArrowLeft, MapPin, Phone, AlertCircle } from "lucide-react";

/* ─── Progress banner ─── */
type JobStep = "en-route" | "arrived" | "in-progress" | "completed";
type StepState = "done" | "active" | "pending";

const STEP_LABELS = ["Confirmed", "En Route", "Arrived", "In Progress", "Completed"];

const JOB_STEP_INDEX: Record<JobStep, number> = {
  "en-route":    1,
  "arrived":     2,
  "in-progress": 3,
  "completed":   4,
};

const JOB_STEP_LABEL: Record<JobStep, string> = {
  "en-route":    "En Route to Consumer",
  "arrived":     "Arrived at Consumer Location",
  "in-progress": "Job In Progress",
  "completed":   "Job Completed",
};

function stepState(labelIndex: number, activeIndex: number): StepState {
  if (labelIndex < activeIndex)  return "done";
  if (labelIndex === activeIndex) return "active";
  return "pending";
}

const dotColor = (s: StepState) => s === "done" ? "#4CAF84" : s === "active" ? "#161533" : "transparent";
const dotBorder = (s: StepState) => s === "pending" ? "2px solid #E8E3DB" : "none";

const StepNode: React.FC<{ label: string; state: StepState }> = ({ label, state }) => {
  const color = state === "done" ? "#4CAF84" : state === "active" ? "#161533" : "#E8E3DB";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", flexShrink: 0 }}>
      <div style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: dotColor(state), border: dotBorder(state), boxSizing: "border-box" }} />
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: state === "active" ? 600 : 400, lineHeight: "13px", color, whiteSpace: "nowrap" }}>
        {label}
      </span>
    </div>
  );
};

const ProgressBanner: React.FC<{ jobStep: JobStep }> = ({ jobStep }) => {
  const activeIndex = JOB_STEP_INDEX[jobStep];
  return (
    <div role="status" aria-label={`Job status: ${JOB_STEP_LABEL[jobStep]}`}
      style={{ backgroundColor: "#FFF8EC", borderBottom: "1px solid #161533", paddingLeft: "16px", paddingRight: "16px", paddingTop: "12px", paddingBottom: "10px", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
        {STEP_LABELS.map((label, i) => {
          const state = stepState(i, activeIndex);
          return (
            <React.Fragment key={label}>
              <StepNode label={label} state={state} />
              {i < STEP_LABELS.length - 1 && (
                <div aria-hidden="true"
                  style={{ flex: 1, height: "2px", backgroundColor: i < activeIndex ? "#4CAF84" : "#E8E3DB", marginTop: "6px" }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <p style={{ margin: 0, marginTop: "8px", fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 500, lineHeight: "18px", color: "#161533" }}>
        Currently: {JOB_STEP_LABEL[jobStep]}
      </p>
    </div>
  );
};

/* ─── Card shell ─── */
const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      backgroundColor: "#FFFFFF",
      borderRadius: "12px",
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.07)",
      border: "1px solid #E8E3DB",
      padding: "16px",
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
  valueBold?: boolean;
}> = ({ label, value, last, valueColor = "#1A1A1A", valueBold }) => (
  <div
    style={{
      height: "36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: last ? "none" : "1px solid #EFEFEF",
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
        flexShrink: 0,
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "14px",
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

/* ─── Status action button ─── */
const StatusButton: React.FC<{
  label: string;
  variant: "primary" | "disabled" | "secondary" | "warning";
  icon?: React.ReactNode;
  onPress?: () => void;
}> = ({ label, variant, icon, onPress }) => {
  const styles: Record<string, React.CSSProperties> = {
    primary:  { backgroundColor: "#161533", border: "none",                    color: "#FFFFFF", fontWeight: 600, cursor: "pointer"  },
    disabled: { backgroundColor: "#FFFFFF", border: "1px solid #E8E3DB",       color: "#CECECE", fontWeight: 400, cursor: "default"   },
    secondary:{ backgroundColor: "#FFFFFF", border: "1px solid #E8E3DB",       color: "#555555", fontWeight: 500, cursor: "pointer"   },
    warning:  { backgroundColor: "#FFF4EC", border: "1px solid #F4A056",       color: "#C0550A", fontWeight: 600, cursor: "pointer"   },
  };

  return (
    <button
      type="button"
      onClick={variant !== "disabled" ? onPress : undefined}
      disabled={variant === "disabled"}
      aria-disabled={variant === "disabled"}
      style={{ width: "100%", height: "48px", borderRadius: "12px", fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: "20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", ...styles[variant] }}
    >
      {icon}
      {label}
    </button>
  );
};

/* ─── Main screen ─── */
interface HzProviderActiveJobProps {
  onBack?: () => void;
  onMarkArrived?: () => void;
  onReportIssue?: () => void;
  onJobComplete?: () => void;
  onGenerateInvoice?: () => void;
  onMessageCustomer?: () => void;
  onReschedule?: () => void;
  onCancel?: () => void;
  rescheduled?: boolean;
}

export const HzProviderActiveJob: React.FC<HzProviderActiveJobProps> = ({
  onBack,
  onMarkArrived,
  onReportIssue,
  onJobComplete,
  onGenerateInvoice,
  onMessageCustomer,
  onReschedule,
  onCancel,
  rescheduled,
}) => {
  const [jobStep, setJobStep] = useState<JobStep>("en-route");

  const handleMarkArrived = () => {
    setJobStep("arrived");
    onMarkArrived?.();
  };

  const handleMarkCompleted = () => {
    setJobStep("completed");
    onJobComplete?.();
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

    {/* Top app bar */}
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
        Active Job
      </span>
    </header>

    {/* Progress banner */}
    <ProgressBanner jobStep={jobStep} />

    {/* Scrollable content */}
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
        gap: "16px",
      }}
    >
      {/* Address reveal card */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "15px",
              fontWeight: 600,
              lineHeight: "22px",
              color: "#1A1A1A",
            }}
          >
            Consumer Address
          </span>
          <a
            href="https://maps.google.com/?q=House+12+Street+4+G-13+Islamabad"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              lineHeight: "18px",
              color: "#161533",
              textDecoration: "none",
            }}
          >
            Tap for Maps
          </a>
        </div>

        <div style={{ marginTop: "8px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
          <MapPin size={20} color="#161533" aria-hidden="true" style={{ flexShrink: 0, marginTop: "2px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "15px",
                fontWeight: 400,
                lineHeight: "22px",
                color: "#1A1A1A",
              }}
            >
              House 12, Street 4, G-13/1, Islamabad
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                fontWeight: 400,
                lineHeight: "18px",
                color: "#9B9B9B",
              }}
            >
              G-13, Islamabad
            </span>
          </div>
        </div>

        <p
          style={{
            margin: 0,
            marginTop: "8px",
            fontFamily: "Inter, sans-serif",
            fontSize: "11px",
            fontWeight: 400,
            fontStyle: "italic",
            lineHeight: "15px",
            color: "#9B9B9B",
          }}
        >
          Address revealed because you accepted this job.
        </p>
      </Card>

      {/* Job details card */}
      <Card>
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "15px",
            fontWeight: 600,
            lineHeight: "22px",
            color: "#1A1A1A",
          }}
        >
          Job Details
        </span>
        <div
          aria-hidden="true"
          style={{ height: "1px", backgroundColor: "#EFEFEF", margin: "8px 0" }}
        />
        <DetailRow label="Service"       value="AC Repairing" />
        <DetailRow label="Consumer"      value="Sana M." />
        <DetailRow label="Scheduled" value={
          rescheduled
            ? <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>Tomorrow · 4:30 PM</span>
                <span style={{ display: "inline-flex", alignItems: "center", height: "18px", padding: "0 7px", borderRadius: "9px", backgroundColor: "#F0FAF4", border: "1px solid #4CAF8440", fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: 600, color: "#4CAF84" }}>Rescheduled</span>
              </span>
            : "Sat 18 May · 9:00 AM"
        } />
        <DetailRow
          label="Your Earnings"
          value="PKR 2,800"
          valueColor="#4CAF84"
          valueBold
          last
        />
      </Card>

      {/* Status update card */}
      <Card>
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "15px",
            fontWeight: 600,
            lineHeight: "22px",
            color: "#1A1A1A",
          }}
        >
          Update Job Status
        </span>
        <div style={{ marginTop: "8px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <StatusButton
            label={jobStep === "arrived" || jobStep === "completed" ? "✓ Arrived" : "Mark as Arrived"}
            variant={jobStep === "arrived" || jobStep === "completed" ? "disabled" : "primary"}
            onPress={handleMarkArrived}
          />
          <StatusButton
            label="Mark as Completed"
            variant={jobStep === "arrived" ? "primary" : "disabled"}
            onPress={handleMarkCompleted}
          />
          <StatusButton label="Generate Invoice"  variant="primary"   onPress={onGenerateInvoice} />
          <StatusButton
            label="Report Issue"
            variant="warning"
            icon={<AlertCircle size={14} color="#C0550A" aria-hidden="true" />}
            onPress={onReportIssue}
          />
        </div>
        {/* Message Customer */}
        <button
          type="button"
          onClick={onMessageCustomer}
          style={{
            marginTop: "10px",
            width: "100%",
            height: "44px",
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#161533" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Message Customer
        </button>

        {/* Reschedule & Cancel */}
        <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={onReschedule}
            style={{
              flex: 1,
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "#FFFFFF",
              border: "1.5px solid #E8E3DB",
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              color: "#1A1A1A",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "#FFF1F2",
              border: "1.5px solid #FECDD3",
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              color: "#E11D48",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            Cancel
          </button>
        </div>
      </Card>

      {/* Consumer contact card */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Phone size={20} color="#161533" aria-hidden="true" />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              fontWeight: 400,
              lineHeight: "16px",
              color: "#9B9B9B",
            }}
          >
            Consumer Contact (post-accept)
          </span>
        </div>
        <div
          style={{
            marginTop: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "15px",
              fontWeight: 600,
              lineHeight: "22px",
              color: "#1A1A1A",
            }}
          >
            +92 321 4567890
          </span>
          <a
            href="tel:+923214567890"
            aria-label="Call consumer"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#FFF4E0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <Phone size={20} color="#161533" aria-hidden="true" />
          </a>
        </div>
      </Card>
    </div>
  </div>
  );
};
