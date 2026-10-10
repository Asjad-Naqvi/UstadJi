import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { ArrowLeft, Clock, MapPin, ShieldCheck, CheckCircle, AlertCircle } from "lucide-react-native";
import { COLORS } from "../theme/theme";
import { HzButton, HzCard } from "../components/HzPrimitives";
import { api } from "../services/api";

interface HzBookingConfirmationScreenProps {
  onBack: () => void;
  onConfirm: (booking?: any) => void;
  selectedDate?: string;
  selectedTime?: string;
  selectedProvider?: any;
  currentUser?: any;
}

export const HzBookingConfirmationScreen: React.FC<HzBookingConfirmationScreenProps> = ({
  onBack,
  onConfirm,
  selectedDate = "Tomorrow",
  selectedTime = "10:00 AM - 11:00 AM",
  selectedProvider,
  currentUser,
}) => {
  const [loading, setLoading] = React.useState(false);

  const providerName = selectedProvider?.name || "Ustad Tariq Mehmood";
  const providerTrade = selectedProvider?.trade || "Master Plumber • 4.9 ★ (128 reviews)";
  const hourlyRate = selectedProvider?.rate || 800;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      // Valid fallback IDs from current database seed if not provided
      const customerId = currentUser?.id || "4d7638cf-0963-44c6-8937-1933101b9969"; // Zain Khan
      const providerId = selectedProvider?.id || "1e1a0343-e483-47f4-bdb3-7e120017ce84"; // Ustad Tariq

      // Parse appointment date
      let apptDateStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];
      if (selectedDate && selectedDate.includes("-") && selectedDate.length === 10) {
        apptDateStr = selectedDate;
      }

      // Parse 24h time strings from selectedTime (e.g. "10:00 AM - 11:00 AM" or "02:30 PM")
      let startTime = "10:00";
      let endTime = "11:00";

      if (selectedTime) {
        const parts = selectedTime.split("-").map((s) => s.trim());
        if (parts[0]) {
          const match = parts[0].match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)?/i);
          if (match) {
            let h = parseInt(match[1], 10);
            const m = match[2] || "00";
            const period = match[3] ? match[3].toUpperCase() : null;
            if (period === "PM" && h < 12) h += 12;
            if (period === "AM" && h === 12) h = 0;
            startTime = `${String(h).padStart(2, "0")}:${m}`;
            endTime = `${String(h + 1).padStart(2, "0")}:${m}`;
          }
        }
      }

      const res = await api.createBooking({
        customerId,
        providerId,
        serviceCategory: selectedProvider?.trade?.split("•")[0]?.trim() || "Plumbing",
        issueDescription: "Scheduled repair booking via App",
        appointmentDate: apptDateStr,
        startTime,
        endTime,
        estimatedPrice: hourlyRate,
      });

      onConfirm(res);
    } catch (e) {
      console.error("Booking Creation Failed:", e);
      Alert.alert("Booking Request Failed", (e as Error).message || "Could not connect to backend server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={{ padding: 4 }}>
          <ArrowLeft size={22} color={COLORS.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Confirmation</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ padding: 16, gap: 14 }}>
        {/* Provider Card */}
        <HzCard style={styles.card}>
          <Text style={styles.cardLabel}>Selected Service Provider</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
            <Text style={styles.providerName}>{providerName}</Text>
            <ShieldCheck size={16} color={COLORS.green} />
          </View>
          <Text style={styles.tradeText}>{providerTrade}</Text>
        </HzCard>

        {/* Appointment Details */}
        <HzCard style={styles.card}>
          <Text style={styles.cardLabel}>Appointment Schedule</Text>
          <View style={styles.detailRow}>
            <Clock size={16} color={COLORS.navy} />
            <Text style={styles.detailText}>{selectedDate} at {selectedTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <MapPin size={16} color={COLORS.navy} />
            <Text style={styles.detailText}>House 24, Street 12, Sector F-7/2, Islamabad</Text>
          </View>
        </HzCard>

        {/* 30-Minute Window Policy */}
        <View style={styles.policyBox}>
          <Clock size={18} color={COLORS.orange} />
          <View style={{ flex: 1 }}>
            <Text style={styles.policyTitle}>30-Minute Provider Response Policy</Text>
            <Text style={styles.policyDesc}>
              Ustad has a 30-minute window to accept. If unanswered, the reserved slot will be released automatically.
            </Text>
          </View>
        </View>

        {/* Price Breakdown */}
        <HzCard style={styles.card}>
          <Text style={styles.cardLabel}>Estimated Pricing</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceItem}>Hourly Diagnostic & Labor</Text>
            <Text style={styles.priceItemVal}>PKR {hourlyRate}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceItem}>Platform Booking Fee</Text>
            <Text style={styles.priceItemVal}>PKR 0 (Free)</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Estimated Total</Text>
            <Text style={styles.totalVal}>PKR {hourlyRate}</Text>
          </View>
        </HzCard>

        <View style={{ marginTop: 10 }}>
          <HzButton
            label={loading ? "Reserving Slot & Requesting (M5)..." : "Confirm & Request Booking (M5)"}
            disabled={loading}
            onPress={handleConfirm}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F5",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E3DB",
    gap: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#161533",
  },
  content: {
    flex: 1,
  },
  card: {
    padding: 16,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9B9B9B",
    textTransform: "uppercase",
  },
  providerName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#161533",
  },
  tradeText: {
    fontSize: 12,
    color: "#555555",
    marginTop: 2,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  detailText: {
    fontSize: 13,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  policyBox: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "rgba(255, 107, 53, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.3)",
    borderRadius: 14,
    padding: 14,
  },
  policyTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.orange,
  },
  policyDesc: {
    fontSize: 11,
    color: "#555555",
    marginTop: 2,
    lineHeight: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#FAF8F5",
  },
  priceItem: {
    fontSize: 13,
    color: "#555555",
  },
  priceItemVal: {
    fontSize: 13,
    fontWeight: "600",
    color: "#161533",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E8E3DB",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#161533",
  },
  totalVal: {
    fontSize: 18,
    fontWeight: "800",
    color: "#161533",
  },
});
