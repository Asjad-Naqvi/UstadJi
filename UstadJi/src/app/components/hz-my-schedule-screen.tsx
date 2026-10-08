import React, { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  Plus,
  MessageCircle,
  Clock,
  Heart,
  User,
  MapPin,
  X,
  CheckCircle,
  MoreHorizontal,
  CalendarDays,
} from "lucide-react";
import { HzChip } from "./hz-chip";
import { HzButton } from "./hz-button";

/* ─── Design tokens ─── */
const NAVY = "#161533";
const NAVY_TINT = "#EEEEF5";
const GREEN = "#4CAF84";
const RED = "#E53935";
const GREY_TEXT = "#9B9B9B";
const BORDER = "#E8E3DB";
const CARD_SHADOW = "0px 2px 8px rgba(0,0,0,0.07)";

/* ─── Types ─── */
type FilterId = "all" | "upcoming" | "completed" | "cancelled";
type StatusId = "upcoming" | "confirmed" | "in-progress" | "completed" | "cancelled";
type ChatTab = "chat" | "bookings" | "favourites" | "profile";

interface Booking {
  id: string;
  date: Date;
  service: string;
  provider: string | null;
  providerInitials: string;
  time: string;
  address: string;
  status: StatusId;
  amount: string;
}

/* ─── Date helpers ─── */
const startOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const TODAY = startOfDay(new Date());

const addDays = (base: Date, n: number): Date => {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
};

const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const formatMonthYear = (date: Date): string => {
  const MONTHS = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

const formatShortDate = (date: Date): string => {
  const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${DAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`;
};

const getDaysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year: number, month: number): number =>
  new Date(year, month, 1).getDay();

/* ─── Mock booking data ─── */
const BOOKINGS: Booking[] = [
  {
    id: "b1",
    date: addDays(TODAY, 1),
    service: "AC Repairing",
    provider: "Ali Hassan",
    providerInitials: "AH",
    time: "9:00 AM",
    address: "G-13, Street 4, House 12",
    status: "upcoming",
    amount: "PKR 2,873",
  },
  {
    id: "b2",
    date: addDays(TODAY, 4),
    service: "Electrician",
    provider: "Zubair Ahmed",
    providerInitials: "ZA",
    time: "11:00 AM",
    address: "F-7, Blue Area, Islamabad",
    status: "confirmed",
    amount: "PKR 1,500",
  },
  {
    id: "b3",
    date: addDays(TODAY, -11),
    service: "Sofa Cleaning",
    provider: "Tariq Mehmood",
    providerInitials: "TM",
    time: "11:00 AM",
    address: "F-7/4, Islamabad",
    status: "completed",
    amount: "PKR 1,500",
  },
  {
    id: "b4",
    date: addDays(TODAY, 11),
    service: "Plumber",
    provider: "Bilal Chaudhry",
    providerInitials: "BC",
    time: "2:00 PM",
    address: "G-10, Islamabad",
    status: "upcoming",
    amount: "PKR 800",
  },
  {
    id: "b5",
    date: addDays(TODAY, -28),
    service: "Electrician",
    provider: null,
    providerInitials: "—",
    time: "10:00 AM",
    address: "G-11, Islamabad",
    status: "cancelled",
    amount: "PKR —",
  },
];

/* ─── Status config ─── */
const STATUS_CONFIG: Record<StatusId, { label: string; bg: string; color: string }> = {
  upcoming:    { label: "Upcoming",    bg: NAVY,     color: "#FFFFFF" },
  confirmed:   { label: "Confirmed",   bg: GREEN,    color: "#FFFFFF" },
  "in-progress": { label: "In Progress", bg: "#E8872A", color: "#FFFFFF" },
  completed:   { label: "Completed",   bg: `${GREEN}22`, color: GREEN },
  cancelled:   { label: "Cancelled",   bg: "#F5F5F5", color: GREY_TEXT },
};

/* ─── Filter config ─── */
const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all",       label: "All"       },
  { id: "upcoming",  label: "Upcoming"  },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

/* ─── Bottom nav ─── */
const TABS: { id: ChatTab; Icon: React.ElementType; label: string }[] = [
  { id: "chat",       Icon: MessageCircle, label: "Chat"       },
  { id: "bookings",   Icon: Clock,         label: "Bookings"   },
  { id: "favourites", Icon: Heart,         label: "Favourites" },
  { id: "profile",    Icon: User,          label: "Profile"    },
];

/* ─── Reschedule time slots ─── */
const TIME_SLOTS = [
  { time: "8:00 AM",  avail: false },
  { time: "9:00 AM",  avail: true  },
  { time: "10:00 AM", avail: true  },
  { time: "11:00 AM", avail: false },
  { time: "12:00 PM", avail: true  },
  { time: "1:00 PM",  avail: true  },
  { time: "2:00 PM",  avail: true  },
  { time: "3:00 PM",  avail: false },
  { time: "4:00 PM",  avail: true  },
  { time: "5:00 PM",  avail: true  },
  { time: "6:00 PM",  avail: false },
];

/* ─── Sub-components ─── */

const ProviderAvatar: React.FC<{ initials: string }> = ({ initials }) => (
  <div
    aria-hidden="true"
    style={{
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      backgroundColor: NAVY_TINT,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <span
      style={{
        fontFamily: "Inter, sans-serif",
        fontSize: "12px",
        fontWeight: 600,
        color: NAVY,
      }}
    >
      {initials}
    </span>
  </div>
);

const StatusPill: React.FC<{ status: StatusId }> = ({ status }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: "22px",
        paddingLeft: "8px",
        paddingRight: "8px",
        borderRadius: "11px",
        backgroundColor: cfg.bg,
        fontFamily: "Inter, sans-serif",
        fontSize: "11px",
        fontWeight: 600,
        color: cfg.color,
        whiteSpace: "nowrap",
      }}
    >
      {cfg.label}
    </span>
  );
};

const BookingCard: React.FC<{
  booking: Booking;
  onReschedule: (id: string) => void;
  onCancel: (id: string) => void;
}> = ({ booking, onReschedule, onCancel }) => {
  const canReschedule = booking.status === "upcoming" || booking.status === "confirmed";
  const canCancel = canReschedule;

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "12px",
        border: `1px solid ${BORDER}`,
        boxShadow: CARD_SHADOW,
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {/* Top row: service + status pill */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "15px",
            fontWeight: 600,
            color: "#1A1A1A",
            lineHeight: "20px",
          }}
        >
          {booking.service}
        </span>
        <StatusPill status={booking.status} />
      </div>

      {/* Provider row */}
      {booking.provider && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ProviderAvatar initials={booking.providerInitials} />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              color: "#1A1A1A",
            }}
          >
            {booking.provider}
          </span>
        </div>
      )}

      {/* Meta row: date + time */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <CalendarDays size={13} color={GREY_TEXT} strokeWidth={2} />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              color: GREY_TEXT,
            }}
          >
            {formatShortDate(booking.date)}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Clock size={13} color={GREY_TEXT} strokeWidth={2} />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              color: GREY_TEXT,
            }}
          >
            {booking.time}
          </span>
        </div>
      </div>

      {/* Address */}
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <MapPin size={13} color={GREY_TEXT} strokeWidth={2} />
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "12px",
            color: GREY_TEXT,
          }}
        >
          {booking.address}
        </span>
      </div>

      {/* Amount row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid #F0F0F0`,
          paddingTop: "10px",
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
          {booking.amount}
        </span>

        {/* Quick actions */}
        {canReschedule && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              type="button"
              onClick={() => onReschedule(booking.id)}
              style={{
                background: "none",
                border: `1px solid ${BORDER}`,
                borderRadius: "8px",
                height: "30px",
                paddingLeft: "10px",
                paddingRight: "10px",
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                fontWeight: 500,
                color: "#1A1A1A",
                cursor: "pointer",
              }}
            >
              Reschedule
            </button>
            <button
              type="button"
              onClick={() => onCancel(booking.id)}
              style={{
                background: "none",
                border: `1px solid ${BORDER}`,
                borderRadius: "8px",
                height: "30px",
                paddingLeft: "10px",
                paddingRight: "10px",
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                fontWeight: 500,
                color: RED,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        )}
        {booking.status === "completed" && (
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <CheckCircle size={14} color={GREEN} />
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                color: GREEN,
                fontWeight: 500,
              }}
            >
              Done
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Empty state ─── */
const EmptyState: React.FC<{ onBookService: () => void }> = ({ onBookService }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: "32px",
      paddingBottom: "32px",
      paddingLeft: "32px",
      paddingRight: "32px",
      gap: "16px",
    }}
  >
    {/* Illustration */}
    <div
      aria-hidden="true"
      style={{
        width: "80px",
        height: "80px",
        borderRadius: "24px",
        backgroundColor: NAVY_TINT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CalendarDays size={40} color={NAVY} strokeWidth={1.5} />
    </div>
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "16px",
          fontWeight: 600,
          color: "#1A1A1A",
          marginBottom: "6px",
        }}
      >
        No bookings scheduled
      </div>
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "13px",
          color: GREY_TEXT,
          lineHeight: "19px",
        }}
      >
        Book a service to see your upcoming appointments here.
      </div>
    </div>
    <button
      type="button"
      onClick={onBookService}
      style={{
        height: "40px",
        paddingLeft: "20px",
        paddingRight: "20px",
        borderRadius: "10px",
        backgroundColor: NAVY,
        border: "none",
        fontFamily: "Inter, sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        color: "#FFFFFF",
        cursor: "pointer",
      }}
    >
      Book a Service
    </button>
  </div>
);

/* ─── Calendar grid ─── */
const CalendarGrid: React.FC<{
  currentMonth: Date;
  today: Date;
  selectedDate: Date | null;
  bookedDates: Date[];
  onSelectDate: (date: Date) => void;
}> = ({ currentMonth, today, selectedDate, bookedDates, onSelectDate }) => {
  const year  = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth  = getDaysInMonth(year, month);
  const firstDayOfWk = getFirstDayOfMonth(year, month);

  /* Build flat cell array: null = padding, number = day */
  const cells: (number | null)[] = [
    ...Array(firstDayOfWk).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const DAY_NAMES = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div style={{ paddingLeft: "8px", paddingRight: "8px" }}>
      {/* Day name headers */}
      <div style={{ display: "flex", marginBottom: "4px" }}>
        {DAY_NAMES.map((name, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              textAlign: "center",
              fontFamily: "Inter, sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              color: GREY_TEXT,
              lineHeight: "24px",
            }}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Week rows */}
      {weeks.map((week, wi) => (
        <div key={wi} style={{ display: "flex" }}>
          {week.map((day, di) => {
            if (day === null) {
              return <div key={di} style={{ flex: 1, height: "36px" }} />;
            }

            const cellDate = new Date(year, month, day);
            const isToday    = isSameDay(cellDate, today);
            const isSelected = selectedDate ? isSameDay(cellDate, selectedDate) : false;
            const hasBooking = bookedDates.some((d) => isSameDay(d, cellDate));
            const isHighlighted = isToday || isSelected;

            return (
              <button
                key={di}
                type="button"
                onClick={() => onSelectDate(cellDate)}
                style={{
                  flex: 1,
                  height: "36px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2px",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: isHighlighted ? NAVY : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "13px",
                      fontWeight: isHighlighted ? 700 : 400,
                      color: isHighlighted ? "#FFFFFF" : "#1A1A1A",
                      lineHeight: 1,
                    }}
                  >
                    {day}
                  </span>
                </div>
                {/* Booking dot indicator */}
                {hasBooking && (
                  <div
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      backgroundColor: isHighlighted ? "rgba(255,255,255,0.7)" : NAVY,
                      flexShrink: 0,
                    }}
                  />
                )}
                {!hasBooking && (
                  <div style={{ width: "5px", height: "5px", flexShrink: 0 }} />
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/* ─── Reschedule bottom sheet ─── */
const RescheduleSheet: React.FC<{
  visible: boolean;
  bookingId: string | null;
  bookings: Booking[];
  onConfirm: (id: string, date: Date, time: string) => void;
  onClose: () => void;
}> = ({ visible, bookingId, bookings, onConfirm, onClose }) => {
  const booking = bookings.find((b) => b.id === bookingId);
  const [sheetDate, setSheetDate] = useState<Date>(addDays(TODAY, 1));
  const [sheetTime, setSheetTime] = useState<string | null>(null);

  /* Date pills: today + next 6 days */
  const datePills = Array.from({ length: 7 }, (_, i) => addDays(TODAY, i));

  const PILL_DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const PILL_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return (
    <>
      {/* Backdrop */}
      {visible && (
        <div
          onClick={onClose}
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 20,
          }}
        />
      )}

      {/* Sheet */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#FFFFFF",
          borderRadius: "20px 20px 0 0",
          zIndex: 21,
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "72%",
          overflow: "hidden",
        }}
      >
        {/* Handle */}
        <div
          aria-hidden="true"
          style={{
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "36px",
              height: "4px",
              borderRadius: "2px",
              backgroundColor: "#E0E0E0",
            }}
          />
        </div>

        {/* Sheet header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: "20px",
            paddingRight: "16px",
            paddingBottom: "16px",
            flexShrink: 0,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                color: "#1A1A1A",
              }}
            >
              Reschedule Booking
            </div>
            {booking && (
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  color: GREY_TEXT,
                  marginTop: "2px",
                }}
              >
                {booking.service}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "#F5F5F5",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={16} color="#1A1A1A" />
          </button>
        </div>

        {/* Scrollable sheet body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingBottom: "12px",
          }}
        >
          {/* Date section */}
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              color: "#1A1A1A",
              marginBottom: "10px",
            }}
          >
            Select Date
          </div>

          {/* Horizontal date pills */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              paddingBottom: "4px",
              marginBottom: "20px",
              scrollbarWidth: "none",
            }}
          >
            {datePills.map((date, i) => {
              const active = isSameDay(date, sheetDate);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSheetDate(date)}
                  style={{
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "52px",
                    height: "60px",
                    borderRadius: "12px",
                    backgroundColor: active ? NAVY : "#F7F7F7",
                    border: active ? "none" : `1px solid ${BORDER}`,
                    cursor: "pointer",
                    gap: "2px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "10px",
                      fontWeight: 500,
                      color: active ? "rgba(255,255,255,0.7)" : GREY_TEXT,
                    }}
                  >
                    {PILL_DAYS[date.getDay()]}
                  </span>
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "17px",
                      fontWeight: 700,
                      color: active ? "#FFFFFF" : "#1A1A1A",
                    }}
                  >
                    {date.getDate()}
                  </span>
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "10px",
                      fontWeight: 400,
                      color: active ? "rgba(255,255,255,0.7)" : GREY_TEXT,
                    }}
                  >
                    {PILL_MONTHS[date.getMonth()]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Time section */}
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              color: "#1A1A1A",
              marginBottom: "10px",
            }}
          >
            Select Time
          </div>

          {/* Time slot grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px",
              marginBottom: "24px",
            }}
          >
            {TIME_SLOTS.map((slot) => {
              const isActive = sheetTime === slot.time;
              return (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.avail}
                  onClick={() => slot.avail && setSheetTime(slot.time)}
                  style={{
                    height: "36px",
                    borderRadius: "8px",
                    backgroundColor: !slot.avail
                      ? "#F5F5F5"
                      : isActive
                      ? NAVY
                      : "#FFFFFF",
                    border: !slot.avail
                      ? "1px solid #EFEFEF"
                      : isActive
                      ? "none"
                      : `1px solid ${BORDER}`,
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    fontWeight: isActive ? 600 : 400,
                    color: !slot.avail
                      ? "#CFCFCF"
                      : isActive
                      ? "#FFFFFF"
                      : "#1A1A1A",
                    cursor: slot.avail ? "pointer" : "default",
                    textDecoration: !slot.avail ? "line-through" : "none",
                  }}
                >
                  {slot.time}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sheet actions */}
        <div
          style={{
            padding: "12px 20px 24px",
            borderTop: `1px solid ${BORDER}`,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <button
            type="button"
            disabled={!sheetTime}
            onClick={() => {
              if (bookingId && sheetTime) {
                onConfirm(bookingId, sheetDate, sheetTime);
              }
            }}
            style={{
              width: "100%",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: sheetTime ? NAVY : "#D8D8D8",
              border: "none",
              fontFamily: "Inter, sans-serif",
              fontSize: "15px",
              fontWeight: 600,
              color: sheetTime ? "#FFFFFF" : "#FFFFFF",
              cursor: sheetTime ? "pointer" : "default",
              transition: "background-color 0.2s ease",
            }}
          >
            Confirm Reschedule
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: "100%",
              height: "44px",
              borderRadius: "12px",
              backgroundColor: "transparent",
              border: `1px solid ${BORDER}`,
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 500,
              color: "#1A1A1A",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

/* ─── Props ─── */
interface HzMyScheduleScreenProps {
  onBack?: () => void;
  onBookService?: () => void;
  onTabChange?: (tab: ChatTab) => void;
  onReschedule?: () => void;
}

/* ─── Main screen ─── */
export const HzMyScheduleScreen: React.FC<HzMyScheduleScreenProps> = ({
  onBack,
  onBookService,
  onTabChange,
  onReschedule,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const d = new Date(TODAY);
    d.setDate(1);
    return d;
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(BOOKINGS);
  const [showToast, setShowToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Dates with bookings — for calendar dot indicators */
  const bookedDates = bookings.map((b) => b.date);

  /* Nearest upcoming booking for the reminder card */
  const nextBooking = bookings
    .filter((b) => b.status === "upcoming" || b.status === "confirmed")
    .sort((a, b) => a.date.getTime() - b.date.getTime())[0];

  /* Filtered bookings */
  const visibleBookings = bookings.filter((b) => {
    const dateMatch = selectedDate ? isSameDay(b.date, selectedDate) : true;
    const filterMatch =
      activeFilter === "all"
        ? true
        : activeFilter === "upcoming"
        ? b.status === "upcoming" || b.status === "confirmed" || b.status === "in-progress"
        : b.status === activeFilter;
    return dateMatch && filterMatch;
  });

  const handleSelectDate = (date: Date) => {
    if (selectedDate && isSameDay(date, selectedDate)) {
      setSelectedDate(null); // tap again to deselect
    } else {
      setSelectedDate(date);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  };

  const handleReschedule = (id: string) => {
    if (onReschedule) {
      onReschedule();
    } else {
      setRescheduleId(id);
      setShowReschedule(true);
    }
  };

  const handleRescheduleConfirm = (id: string, date: Date, time: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, date, time, status: "upcoming" as StatusId } : b
      )
    );
    setShowReschedule(false);
    setRescheduleId(null);
    setShowToast(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setShowToast(false), 2500);
  };

  const handleCancel = (id: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: "cancelled" as StatusId } : b
      )
    );
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FAF8F5",
        overflow: "hidden",
        position: "relative",
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
          borderBottom: `1px solid #EFEFEF`,
          display: "flex",
          alignItems: "center",
          paddingLeft: "16px",
          paddingRight: "16px",
          flexShrink: 0,
          gap: "12px",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
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
          <ChevronLeft size={20} color="#1A1A1A" />
        </button>

        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "17px",
            fontWeight: 600,
            color: "#1A1A1A",
            flex: 1,
          }}
        >
          My Schedule
        </span>

        <CalendarDays size={22} color={NAVY} strokeWidth={1.75} />
      </header>

      {/* Calendar section */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderBottom: `1px solid ${BORDER}`,
          paddingTop: "12px",
          paddingBottom: "12px",
          flexShrink: 0,
        }}
      >
        {/* Month navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: "16px",
            paddingRight: "16px",
            marginBottom: "8px",
          }}
        >
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="Previous month"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "#F5F5F5",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ChevronLeft size={16} color="#1A1A1A" />
          </button>

          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "#1A1A1A",
            }}
          >
            {formatMonthYear(currentMonth)}
          </span>

          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Next month"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "#F5F5F5",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ChevronRight size={16} color="#1A1A1A" />
          </button>
        </div>

        <CalendarGrid
          currentMonth={currentMonth}
          today={TODAY}
          selectedDate={selectedDate}
          bookedDates={bookedDates}
          onSelectDate={handleSelectDate}
        />
      </div>

      {/* Filter chips */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          paddingLeft: "16px",
          paddingRight: "16px",
          paddingTop: "12px",
          paddingBottom: "12px",
          overflowX: "auto",
          flexShrink: 0,
          scrollbarWidth: "none",
        }}
      >
        {FILTERS.map(({ id, label }) => (
          <HzChip
            key={id}
            selected={activeFilter === id}
            onClick={() => setActiveFilter(id)}
          >
            {label}
          </HzChip>
        ))}
        {selectedDate && (
          <button
            type="button"
            onClick={() => setSelectedDate(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              height: "32px",
              paddingLeft: "10px",
              paddingRight: "10px",
              borderRadius: "16px",
              backgroundColor: `${NAVY}14`,
              border: "none",
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              color: NAVY,
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            <X size={12} color={NAVY} />
            {formatShortDate(selectedDate)}
          </button>
        )}
      </div>

      {/* Scrollable content area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          paddingLeft: "16px",
          paddingRight: "16px",
          paddingBottom: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {/* Reminder card — show only when no date filter and there's a next booking */}
        {!selectedDate && nextBooking && activeFilter !== "completed" && activeFilter !== "cancelled" && (
          <div
            style={{
              backgroundColor: NAVY_TINT,
              borderRadius: "12px",
              border: `1px solid rgba(22,21,51,0.1)`,
              padding: "14px",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: NAVY,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Bell size={18} color="#FFFFFF" strokeWidth={2} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: NAVY,
                  marginBottom: "2px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Next Appointment
              </div>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#1A1A1A",
                  lineHeight: "18px",
                }}
              >
                {nextBooking.service} — {formatShortDate(nextBooking.date)} at {nextBooking.time}
              </div>
            </div>
            <button
              type="button"
              style={{
                flexShrink: 0,
                height: "28px",
                paddingLeft: "10px",
                paddingRight: "10px",
                borderRadius: "8px",
                backgroundColor: NAVY,
                border: "none",
                fontFamily: "Inter, sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                color: "#FFFFFF",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              + Calendar
            </button>
          </div>
        )}

        {/* Bookings list or empty state */}
        {visibleBookings.length === 0 ? (
          <EmptyState onBookService={onBookService ?? (() => {})} />
        ) : (
          visibleBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onReschedule={handleReschedule}
              onCancel={handleCancel}
            />
          ))
        )}
      </div>

      {/* Bottom nav */}
      <nav
        aria-label="Main navigation"
        style={{
          height: "64px",
          backgroundColor: "#FFFFFF",
          borderTop: `1px solid ${BORDER}`,
          display: "flex",
          flexShrink: 0,
        }}
      >
        {TABS.map(({ id, Icon, label }) => {
          const isActive = id === "bookings";
          return (
            <button
              key={id}
              type="button"
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              onClick={() => onTabChange?.(id)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <Icon
                size={22}
                color={isActive ? NAVY : GREY_TEXT}
                strokeWidth={isActive ? 2.2 : 1.75}
              />
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "10px",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? NAVY : GREY_TEXT,
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* FAB */}
      <button
        type="button"
        onClick={onBookService}
        aria-label="Book a service"
        style={{
          position: "absolute",
          bottom: "80px",
          right: "16px",
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          backgroundColor: NAVY,
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0px 4px 16px rgba(22,21,51,0.3)",
          zIndex: 5,
        }}
      >
        <Plus size={24} color="#FFFFFF" strokeWidth={2.5} />
      </button>

      {/* Success toast */}
      {showToast && (
        <div
          aria-live="polite"
          style={{
            position: "absolute",
            bottom: "80px",
            left: "16px",
            right: "16px",
            backgroundColor: GREEN,
            borderRadius: "12px",
            padding: "13px 16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            zIndex: 30,
            boxShadow: "0px 4px 16px rgba(76,175,132,0.35)",
          }}
        >
          <CheckCircle size={18} color="#FFFFFF" strokeWidth={2.5} />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              color: "#FFFFFF",
            }}
          >
            Booking rescheduled successfully
          </span>
        </div>
      )}

      {/* Reschedule bottom sheet */}
      <RescheduleSheet
        visible={showReschedule}
        bookingId={rescheduleId}
        bookings={bookings}
        onConfirm={handleRescheduleConfirm}
        onClose={() => {
          setShowReschedule(false);
          setRescheduleId(null);
        }}
      />
    </div>
  );
};
