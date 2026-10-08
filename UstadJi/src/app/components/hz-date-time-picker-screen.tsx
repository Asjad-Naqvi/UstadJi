import React, { useState } from "react";
import { ArrowLeft, Clock, CheckCircle, ChevronRight } from "lucide-react";

const NAVY = "#161533";
const GREEN = "#4CAF84";
const GREY = "#9B9B9B";
const BORDER = "#E8E3DB";
const BG = "#FAF8F5";

const TODAY = (() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
})();

const addDays = (base: Date, n: number): Date => {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
};

const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const formatDisplayDate = (d: Date): string =>
  `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;

const TIME_SLOTS = [
  { time: "10:00 AM", period: "Morning" },
  { time: "12:00 PM", period: "Noon"    },
  { time: "2:00 PM",  period: "Afternoon"},
  { time: "5:00 PM",  period: "Evening"  },
];

interface HzDateTimePickerProps {
  onBack?: () => void;
  onConfirm?: (date: string, time: string) => void;
}

export const HzDateTimePicker: React.FC<HzDateTimePickerProps> = ({
  onBack,
  onConfirm,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const datePills = Array.from({ length: 14 }, (_, i) => addDays(TODAY, i));
  const canContinue = selectedDate !== null && selectedTime !== null;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: BG,
        overflow: "hidden",
      }}
    >
      {/* Status bar */}
      <div
        aria-hidden="true"
        style={{ height: "24px", flexShrink: 0, backgroundColor: "#FFFFFF" }}
      />

      {/* Header */}
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
          <ArrowLeft size={24} color="#1A1A1A" />
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
          Select Date & Time
        </span>
        {/* Step indicator */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "4px",
              borderRadius: "2px",
              backgroundColor: NAVY,
            }}
          />
          <div
            style={{
              width: "20px",
              height: "4px",
              borderRadius: "2px",
              backgroundColor: "#E0E0E0",
            }}
          />
        </div>
      </header>

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          paddingLeft: "16px",
          paddingRight: "16px",
          paddingBottom: "24px",
        }}
      >
        {/* Provider mini-card */}
        <div
          style={{
            marginTop: "16px",
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            border: `1px solid ${BORDER}`,
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: "42px",
              height: "42px",
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
                fontSize: "14px",
                fontWeight: 700,
                color: NAVY,
              }}
            >
              AH
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "#1A1A1A",
              }}
            >
              Ali Hassan
            </div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                color: GREY,
                marginTop: "2px",
              }}
            >
              AC Repairing · G-13, Islamabad
            </div>
          </div>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              color: GREEN,
              backgroundColor: `${GREEN}18`,
              borderRadius: "6px",
              padding: "3px 8px",
              flexShrink: 0,
            }}
          >
            ✓ Verified
          </span>
        </div>

        {/* Separator */}
        <div
          style={{
            marginTop: "24px",
            marginBottom: "0",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              color: "#1A1A1A",
            }}
          >
            Select Date
          </span>
          <ChevronRight size={14} color={GREY} />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              color: selectedDate ? NAVY : GREY,
              fontWeight: selectedDate ? 500 : 400,
            }}
          >
            {selectedDate ? formatDisplayDate(selectedDate) : "Choose a day"}
          </span>
        </div>

        {/* Date pills — horizontal scroll */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            paddingBottom: "4px",
            marginTop: "12px",
            marginLeft: "-16px",
            marginRight: "-16px",
            paddingLeft: "16px",
            paddingRight: "16px",
            scrollbarWidth: "none",
          }}
        >
          {datePills.map((date, i) => {
            const active = selectedDate ? isSameDay(date, selectedDate) : false;
            const isToday = isSameDay(date, TODAY);
            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedDate(date)}
                aria-pressed={active}
                aria-label={`${isToday ? "Today" : DAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}`}
                style={{
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "58px",
                  height: "76px",
                  borderRadius: "14px",
                  backgroundColor: active ? NAVY : "#FFFFFF",
                  border: active ? `2px solid ${NAVY}` : `1px solid ${BORDER}`,
                  cursor: "pointer",
                  gap: "1px",
                  boxShadow: active
                    ? "0px 4px 12px rgba(22,21,51,0.25)"
                    : "0px 1px 4px rgba(0,0,0,0.06)",
                  transition: "all 0.15s ease",
                }}
              >
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "10px",
                    fontWeight: 600,
                    color: active ? "rgba(255,255,255,0.75)" : GREY,
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                  }}
                >
                  {isToday ? "Today" : DAYS[date.getDay()]}
                </span>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "22px",
                    fontWeight: 700,
                    color: active ? "#FFFFFF" : "#1A1A1A",
                    lineHeight: 1.1,
                  }}
                >
                  {date.getDate()}
                </span>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "10px",
                    fontWeight: 400,
                    color: active ? "rgba(255,255,255,0.65)" : GREY,
                  }}
                >
                  {MONTHS[date.getMonth()]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Time slots section */}
        <div style={{ marginTop: "28px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                fontWeight: 700,
                color: "#1A1A1A",
              }}
            >
              Available Time Slots
            </span>
            <ChevronRight size={14} color={GREY} />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "13px",
                color: selectedTime ? NAVY : GREY,
                fontWeight: selectedTime ? 500 : 400,
              }}
            >
              {selectedTime ?? "Choose a slot"}
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "10px",
            }}
          >
            {TIME_SLOTS.map((slot) => {
              const active = selectedTime === slot.time;
              return (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => setSelectedTime(slot.time)}
                  aria-pressed={active}
                  aria-label={`${slot.time} — ${slot.period}`}
                  style={{
                    height: "60px",
                    borderRadius: "12px",
                    backgroundColor: active ? NAVY : "#FFFFFF",
                    border: active ? `2px solid ${NAVY}` : `1px solid ${BORDER}`,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "2px",
                    boxShadow: active
                      ? "0px 4px 12px rgba(22,21,51,0.25)"
                      : "0px 1px 4px rgba(0,0,0,0.06)",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Clock
                      size={13}
                      color={active ? "rgba(255,255,255,0.75)" : GREY}
                      strokeWidth={2}
                    />
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "15px",
                        fontWeight: active ? 700 : 500,
                        color: active ? "#FFFFFF" : "#1A1A1A",
                      }}
                    >
                      {slot.time}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "11px",
                      fontWeight: 400,
                      color: active ? "rgba(255,255,255,0.65)" : GREY,
                    }}
                  >
                    {slot.period}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Provider availability note */}
        <div
          style={{
            marginTop: "20px",
            padding: "11px 14px",
            backgroundColor: `${GREEN}12`,
            borderRadius: "10px",
            border: `1px solid ${GREEN}30`,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CheckCircle size={15} color={GREEN} strokeWidth={2.5} />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              color: "#1A1A1A",
              lineHeight: "16px",
            }}
          >
            Ali Hassan is available on all listed dates and time slots.
          </span>
        </div>

        {/* Current selection summary */}
        {canContinue && (
          <div
            style={{
              marginTop: "14px",
              padding: "13px 16px",
              backgroundColor: "#EEEEF5",
              borderRadius: "10px",
              border: `1px solid rgba(22,21,51,0.1)`,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <CheckCircle size={16} color={NAVY} strokeWidth={2.5} />
            <div>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: NAVY,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "2px",
                }}
              >
                Your Selection
              </div>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1A1A1A",
                }}
              >
                {selectedDate ? formatDisplayDate(selectedDate) : ""} · {selectedTime}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pinned bottom CTA */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid #EFEFEF",
          padding: "12px 16px 20px",
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          disabled={!canContinue}
          onClick={() => {
            if (canContinue && selectedDate && selectedTime) {
              onConfirm?.(formatDisplayDate(selectedDate), selectedTime);
            }
          }}
          style={{
            width: "100%",
            height: "52px",
            borderRadius: "14px",
            backgroundColor: canContinue ? NAVY : "#D8D8D8",
            border: "none",
            fontFamily: "Inter, sans-serif",
            fontSize: "15px",
            fontWeight: 600,
            color: "#FFFFFF",
            cursor: canContinue ? "pointer" : "default",
            transition: "background-color 0.2s ease",
          }}
        >
          {canContinue ? "Continue to Confirmation →" : "Select Date & Time to Continue"}
        </button>
        <p
          style={{
            margin: "8px 0 0",
            fontFamily: "Inter, sans-serif",
            fontSize: "11px",
            color: GREY,
            textAlign: "center",
            lineHeight: "14px",
          }}
        >
          Step 1 of 2 — Date & Time Selection
        </p>
      </div>
    </div>
  );
};
