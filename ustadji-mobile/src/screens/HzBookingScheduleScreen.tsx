import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  User,
  ArrowLeft,
  XCircle,
  Zap,
} from "lucide-react-native";
import { COLORS } from "../theme/theme";
import { HzButton, HzCard, HzChip } from "../components/HzPrimitives";
import { api } from "../services/api";

interface Slot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isLocked: boolean;
  reason?: string;
}

export const HzBookingScheduleScreen: React.FC<{ onNavigate: (s: string) => void }> = ({
  onNavigate,
}) => {
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load providers from backend
  useEffect(() => {
    loadProviders();
  }, []);

  // Load slots when provider or date changes
  useEffect(() => {
    if (selectedProvider) {
      loadSlots(selectedProvider.id, selectedDate);
    }
  }, [selectedProvider, selectedDate]);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const data = await api.getProviders();
      setProviders(data);
      if (data.length > 0) {
        setSelectedProvider(data[0]); // default to Ustad Tariq
      }
    } catch (err) {
      setErrorMsg("Failed to load providers from backend");
    } finally {
      setLoading(false);
    }
  };

  const loadSlots = async (providerId: string, date: string) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const data = await api.getAvailability(providerId, date);
      setSlots(data);
      setSelectedSlot(null);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async () => {
    if (!selectedProvider || !selectedSlot) return;

    try {
      setLoading(true);
      setErrorMsg(null);

      // Dummy customer Zain Khan ID
      const customerId = "1aaf561c-c519-49a1-8762-8a8fb540aa4b";

      const res = await api.createBooking({
        customerId,
        providerId: selectedProvider.id,
        serviceCategory: selectedProvider.providerProfile?.trade || "Home Service",
        issueDescription: "Scheduled repair booking via Module 5 Engine",
        appointmentDate: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        estimatedPrice: selectedProvider.providerProfile?.hourlyRate || 800,
      });

      setBookingSuccess(res);
      // Reload slots to reflect new lock & booking
      loadSlots(selectedProvider.id, selectedDate);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const dateOptions = [
    { label: "Tomorrow", val: new Date(Date.now() + 86400000).toISOString().split("T")[0] },
    { label: "In 2 Days", val: new Date(Date.now() + 172800000).toISOString().split("T")[0] },
    { label: "In 3 Days", val: new Date(Date.now() + 259200000).toISOString().split("T")[0] },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate("home")}>
          <ArrowLeft size={22} color={COLORS.navy} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>M5: Booking & Scheduling</Text>
          <Text style={styles.subtitle}>Real-time Availability, Slot Locking & Dispatch</Text>
        </View>
      </View>

      {/* SUCCESS CONFIRMATION BANNER */}
      {bookingSuccess && (
        <HzCard style={styles.successCard}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <CheckCircle size={24} color={COLORS.green} />
            <Text style={styles.successTitle}>
              {bookingSuccess.status === "SCHEDULED"
                ? "Booking Confirmed! (Instant)"
                : "Request Sent! (30-Min Window Active)"}
            </Text>
          </View>
          <Text style={styles.successText}>
            Booking Code: <Text style={{ fontWeight: "700" }}>{bookingSuccess.bookingCode}</Text>
          </Text>
          <Text style={styles.successText}>
            Status: <Text style={{ fontWeight: "700", color: bookingSuccess.status === "SCHEDULED" ? COLORS.green : COLORS.orange }}>
              {bookingSuccess.status}
            </Text>
          </Text>
          <Text style={styles.successText}>
            Appointment: {selectedDate} at {bookingSuccess.startTime} - {bookingSuccess.endTime}
          </Text>
          {bookingSuccess.acceptanceDeadline && (
            <Text style={styles.deadlineWarning}>
              ⏳ Provider 30-minute response timer started. Will automatically expire if unanswered.
            </Text>
          )}

          <HzButton
            label="Track In Bookings Tab"
            onPress={() => onNavigate("bookings")}
            style={{ marginTop: 12 }}
          />
        </HzCard>
      )}

      {/* ERROR MESSAGE */}
      {errorMsg && (
        <View style={styles.errorBox}>
          <AlertCircle size={18} color="#DC2626" />
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}

      {/* 1. SELECT PROVIDER */}
      <Text style={styles.sectionTitle}>1. Select Service Provider</Text>
      <View style={styles.providerRow}>
        {providers.map((p) => {
          const isSelected = selectedProvider?.id === p.id;
          const isAuto = p.providerProfile?.bookingPreference === "AUTO_CONFIRM";

          return (
            <TouchableOpacity
              key={p.id}
              style={[styles.providerCard, isSelected && styles.providerCardSelected]}
              onPress={() => setSelectedProvider(p)}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={[styles.pName, isSelected && { color: "#FFFFFF" }]}>{p.fullName}</Text>
                {isAuto ? (
                  <View style={styles.autoBadge}>
                    <Zap size={10} color="#FFFFFF" />
                    <Text style={styles.autoBadgeText}>Instant</Text>
                  </View>
                ) : (
                  <View style={styles.manualBadge}>
                    <Clock size={10} color="#FFFFFF" />
                    <Text style={styles.manualBadgeText}>30m Window</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.pTrade, isSelected && { color: "#E5E7EB" }]}>
                {p.providerProfile?.trade} • PKR {p.providerProfile?.hourlyRate}/hr
              </Text>
              <Text style={[styles.pBuffer, isSelected && { color: "#D1D5DB" }]}>
                Required buffer gap: {p.providerProfile?.bufferMinutes || 30} mins
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 2. SELECT DATE */}
      <Text style={styles.sectionTitle}>2. Select Appointment Date</Text>
      <View style={styles.dateRow}>
        {dateOptions.map((opt) => (
          <TouchableOpacity
            key={opt.val}
            style={[styles.dateChip, selectedDate === opt.val && styles.dateChipSelected]}
            onPress={() => setSelectedDate(opt.val)}
          >
            <Calendar size={14} color={selectedDate === opt.val ? "#FFFFFF" : COLORS.navy} />
            <Text style={[styles.dateText, selectedDate === opt.val && { color: "#FFFFFF" }]}>
              {opt.label} ({opt.val.slice(5)})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 3. TIME SLOTS (REAL-TIME AVAILABILITY & LOCKING) */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
        <Text style={styles.sectionTitle}>3. Real-Time Time Slots</Text>
        {loading && <ActivityIndicator size="small" color={COLORS.navy} />}
      </View>

      <Text style={styles.slotSubtitle}>
        Locks slot temporarily in Redis to prevent concurrent double-booking.
      </Text>

      <View style={styles.slotsGrid}>
        {slots.map((slot, i) => {
          const isSelected = selectedSlot?.startTime === slot.startTime;

          return (
            <TouchableOpacity
              key={i}
              disabled={!slot.isAvailable}
              style={[
                styles.slotBtn,
                !slot.isAvailable && styles.slotDisabled,
                isSelected && styles.slotSelected,
              ]}
              onPress={() => setSelectedSlot(slot)}
            >
              <Clock
                size={14}
                color={
                  isSelected
                    ? "#FFFFFF"
                    : !slot.isAvailable
                    ? COLORS.textMuted
                    : COLORS.navy
                }
              />
              <Text
                style={[
                  styles.slotTime,
                  isSelected && { color: "#FFFFFF" },
                  !slot.isAvailable && { color: COLORS.textMuted },
                ]}
              >
                {slot.startTime} - {slot.endTime}
              </Text>
              {!slot.isAvailable && (
                <Text style={styles.slotStatusLabel}>
                  {slot.isLocked ? "🔒 Locked" : "Booked"}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* SUBMIT BUTTON */}
      <View style={{ marginTop: 24 }}>
        <HzButton
          label={
            loading
              ? "Reserving Slot..."
              : selectedSlot
              ? `Reserve ${selectedSlot.startTime} & Confirm`
              : "Select an Available Time Slot"
          }
          disabled={!selectedSlot || loading}
          onPress={handleCreateBooking}
        />
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.navy,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  successCard: {
    backgroundColor: "rgba(76, 175, 132, 0.1)",
    borderColor: COLORS.green,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.navy,
  },
  successText: {
    fontSize: 13,
    color: COLORS.navy,
    marginTop: 3,
  },
  deadlineWarning: {
    fontSize: 11,
    color: COLORS.orange,
    marginTop: 8,
    fontWeight: "600",
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  errorText: {
    fontSize: 12,
    color: "#DC2626",
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.navy,
    marginBottom: 8,
    marginTop: 6,
  },
  providerRow: {
    gap: 8,
    marginBottom: 14,
  },
  providerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E8E3DB",
  },
  providerCardSelected: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy,
  },
  pName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.navy,
  },
  pTrade: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  pBuffer: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  autoBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.green,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  autoBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  manualBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.orange,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  manualBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  dateRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  dateChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8E3DB",
  },
  dateChipSelected: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.navy,
  },
  slotSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  slotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  slotBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E8E3DB",
    minWidth: "48%",
  },
  slotSelected: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy,
  },
  slotDisabled: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  slotTime: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.navy,
  },
  slotStatusLabel: {
    fontSize: 10,
    color: COLORS.orange,
    marginLeft: "auto",
  },
});
