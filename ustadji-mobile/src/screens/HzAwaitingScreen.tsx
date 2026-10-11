import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { ArrowLeft, Clock, CheckCircle2, X } from "lucide-react-native";
import { COLORS } from "../theme/theme";
import { HzButton } from "../components/HzPrimitives";
import { api } from "../services/api";

interface HzAwaitingScreenProps {
  onBack?: () => void;
  onCancel: () => void;
  onAccepted: () => void;
  booking?: any;
}

export const HzAwaitingScreen: React.FC<HzAwaitingScreenProps> = ({
  onBack,
  onCancel,
  onAccepted,
  booking,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(1795); // ~29:55
  const [loading, setLoading] = useState(false);

  const bookingCode = booking?.bookingCode || "";
  const providerName = booking?.provider?.fullName || "Service Provider";

  useEffect(() => {
    let pollInterval: any;

    if (booking?.id) {
      // Real-time polling every 3s to detect provider acceptance automatically
      pollInterval = setInterval(async () => {
        try {
          const fresh = await api.getBooking(booking.id);
          if (fresh.status === "SCHEDULED" || fresh.status === "IN_PROGRESS") {
            clearInterval(pollInterval);
            Alert.alert("Request Accepted! 🎉", `${providerName} accepted your booking request. Ustad is on the way!`);
            onAccepted();
          } else if (fresh.status === "REJECTED" || fresh.status === "EXPIRED" || fresh.status === "CANCELLED") {
            clearInterval(pollInterval);
            Alert.alert("Booking Update", `Your booking request was ${fresh.status.toLowerCase()} by provider.`);
            onCancel();
          }
        } catch (e) {
          console.warn("Polling booking status failed:", e);
        }
      }, 3000);
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(timer);
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [booking?.id]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeFormatted = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  return (
    <View style={styles.container}>
      {/* Top Header with Back Button */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={onBack || onCancel}
          style={styles.backBtn}
        >
          <ArrowLeft size={22} color={COLORS.navy} />
        </TouchableOpacity>
        <Text style={styles.topHeaderTitle}>Waiting for Confirmation</Text>
      </View>

      <View style={styles.body}>
        {/* Pulsing Timer Circle */}
        <View style={styles.pulseContainer}>
          <View style={styles.outerRing} />
          <View style={styles.innerCircle}>
            <Clock size={40} color="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.heading}>Awaiting Ustad Response</Text>
        <Text style={styles.subheading}>30-Minute Response Window Active ({bookingCode})</Text>

        {/* Countdown Timer */}
        <View style={styles.timerBox}>
          <Text style={styles.timerDigits}>{timeFormatted}</Text>
          <Text style={styles.timerLabel}>Time remaining for Ustad to accept</Text>
        </View>

        <Text style={styles.infoText}>
          {providerName} has been notified. You can exit this screen anytime — your order is saved under "My Orders" tab and will notify you when accepted!
        </Text>

        <View style={styles.btnStack}>
          <HzButton
            label="Back to My Orders"
            style={{ backgroundColor: COLORS.navy }}
            onPress={onBack || onCancel}
          />
          <HzButton
            label="Cancel Booking Request"
            variant="danger"
            onPress={onCancel}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F5",
  },
  topHeader: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E3DB",
    gap: 12,
  },
  backBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: "#FAF8F5",
    borderWidth: 1,
    borderColor: "#E8E3DB",
  },
  topHeaderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#161533",
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  pulseContainer: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  outerRing: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 107, 53, 0.15)",
  },
  innerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.orange,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#161533",
  },
  subheading: {
    fontSize: 13,
    color: "#9B9B9B",
    marginTop: 4,
  },
  timerBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#E8E3DB",
    alignItems: "center",
    marginVertical: 24,
  },
  timerDigits: {
    fontSize: 36,
    fontWeight: "800",
    color: COLORS.orange,
    letterSpacing: 2,
  },
  timerLabel: {
    fontSize: 11,
    color: "#9B9B9B",
    marginTop: 4,
  },
  infoText: {
    fontSize: 12,
    color: "#555555",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  btnStack: {
    width: "100%",
    gap: 10,
  },
});
