import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Clock, CheckCircle2, X } from "lucide-react-native";
import { COLORS } from "../theme/theme";
import { HzButton } from "../components/HzPrimitives";

interface HzAwaitingScreenProps {
  onCancel: () => void;
  onAccepted: () => void;
}

export const HzAwaitingScreen: React.FC<HzAwaitingScreenProps> = ({
  onCancel,
  onAccepted,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(1795); // ~29:55

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeFormatted = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  return (
    <View style={styles.container}>
      {/* Pulsing Timer Circle */}
      <View style={styles.pulseContainer}>
        <View style={styles.outerRing} />
        <View style={styles.innerCircle}>
          <Clock size={40} color="#FFFFFF" />
        </View>
      </View>

      <Text style={styles.heading}>Awaiting Confirmation</Text>
      <Text style={styles.subheading}>30-Minute Response Window Active</Text>

      {/* Countdown Timer */}
      <View style={styles.timerBox}>
        <Text style={styles.timerDigits}>{timeFormatted}</Text>
        <Text style={styles.timerLabel}>Time remaining for Ustad to accept</Text>
      </View>

      <Text style={styles.infoText}>
        Ustad Tariq has been notified via push notification. Your selected time slot is locked in the scheduling engine.
      </Text>

      <View style={styles.btnStack}>
        <HzButton
          label="Simulate Provider Acceptance ✓"
          style={{ backgroundColor: COLORS.green }}
          onPress={onAccepted}
        />

        <HzButton
          label="Cancel Request"
          variant="secondary"
          onPress={onCancel}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F5",
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
