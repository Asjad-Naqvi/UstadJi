import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ArrowLeft, Clock, MapPin, ShieldCheck, CheckCircle, AlertCircle } from "lucide-react-native";
import { COLORS } from "../theme/theme";
import { HzButton, HzCard } from "../components/HzPrimitives";

interface HzBookingConfirmationScreenProps {
  onBack: () => void;
  onConfirm: () => void;
  selectedDate?: string;
  selectedTime?: string;
}

export const HzBookingConfirmationScreen: React.FC<HzBookingConfirmationScreenProps> = ({
  onBack,
  onConfirm,
  selectedDate = "Tomorrow",
  selectedTime = "10:00 AM - 11:00 AM",
}) => {
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
            <Text style={styles.providerName}>Ustad Tariq Mehmood</Text>
            <ShieldCheck size={16} color={COLORS.green} />
          </View>
          <Text style={styles.tradeText}>Master Plumber • 4.9 ★ (128 reviews)</Text>
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
            <Text style={styles.priceItemVal}>PKR 800</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceItem}>Platform Booking Fee</Text>
            <Text style={styles.priceItemVal}>PKR 0 (Free)</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Estimated Total</Text>
            <Text style={styles.totalVal}>PKR 800</Text>
          </View>
        </HzCard>

        <View style={{ marginTop: 10 }}>
          <HzButton
            label="Confirm & Request Booking (M5)"
            onPress={onConfirm}
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
