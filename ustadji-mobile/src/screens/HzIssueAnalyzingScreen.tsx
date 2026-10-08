import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Bot, Sparkles, CheckCircle2 } from "lucide-react-native";
import { COLORS } from "../theme/theme";

export const HzIssueAnalyzingScreen: React.FC<{ onNavigate: (s: string) => void }> = ({
  onNavigate,
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const steps = [
    "Reading uploaded photo & audio...",
    "Analyzing damage with Claude Vision AI...",
    "Matching nearby verified Ustads in F-7...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 900);

    const timer = setTimeout(() => {
      onNavigate("issue_summary");
    }, 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.badgeContainer}>
        <View style={styles.pulseRing} />
        <View style={styles.navyBadge}>
          <Bot size={42} color="#FFFFFF" />
        </View>
      </View>

      <Text style={styles.heading}>Samajh rahe hain...</Text>
      <Text style={styles.subheading}>Understanding your issue with AI</Text>

      <View style={styles.stepsBox}>
        {steps.map((step, idx) => {
          const isDone = idx < stepIndex;
          const isCurrent = idx === stepIndex;

          return (
            <View key={idx} style={styles.stepRow}>
              {isDone ? (
                <CheckCircle2 size={18} color={COLORS.green} />
              ) : isCurrent ? (
                <ActivityIndicator size="small" color={COLORS.navy} />
              ) : (
                <View style={styles.dotPlaceholder} />
              )}
              <Text
                style={[
                  styles.stepText,
                  isCurrent && { fontWeight: "700", color: COLORS.navy },
                  isDone && { color: COLORS.green },
                ]}
              >
                {step}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  badgeContainer: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  pulseRing: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(22, 21, 51, 0.08)",
  },
  navyBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.navy,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.navy,
  },
  subheading: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 32,
  },
  stepsBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    width: "100%",
    borderWidth: 1,
    borderColor: "#E8E3DB",
    gap: 14,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dotPlaceholder: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
  },
  stepText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
});
