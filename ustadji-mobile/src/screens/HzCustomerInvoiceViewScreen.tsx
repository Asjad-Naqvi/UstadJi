import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { ArrowLeft, FileText, CheckCircle2, Star, ShieldCheck } from "lucide-react-native";
import { COLORS } from "../theme/theme";
import { HzButton, HzCard } from "../components/HzPrimitives";

interface HzCustomerInvoiceViewScreenProps {
  onBack: () => void;
  onDone: () => void;
}

export const HzCustomerInvoiceViewScreen: React.FC<HzCustomerInvoiceViewScreenProps> = ({
  onBack,
  onDone,
}) => {
  const [rating, setRating] = useState(5);
  const [rated, setRated] = useState(false);

  const handleSubmitRating = () => {
    setRated(true);
    Alert.alert("Shukriya! ⭐", "Your 5-star review has been recorded for Ustad Tariq.");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={{ padding: 4 }}>
          <ArrowLeft size={22} color={COLORS.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invoice & Receipt</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ padding: 16, gap: 14 }}>
        {/* Invoice Card */}
        <HzCard style={styles.card}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
              <Text style={styles.invCode}>Invoice #INV-1001</Text>
              <Text style={styles.invDate}>Completed Today • 11:30 AM</Text>
            </View>
            <View style={styles.paidBadge}>
              <CheckCircle2 size={14} color={COLORS.green} />
              <Text style={styles.paidText}>PAID</Text>
            </View>
          </View>

          <View style={styles.providerRow}>
            <Text style={styles.pName}>Ustad Tariq Mehmood</Text>
            <Text style={styles.pTrade}>Master Plumber</Text>
          </View>

          <View style={styles.divider} />

          {/* Line items */}
          <Text style={styles.breakdownHeading}>Itemized Breakdown (M8 Engine)</Text>

          <View style={styles.lineItem}>
            <Text style={styles.itemTitle}>Diagnostic & Labor (1 hr)</Text>
            <Text style={styles.itemPrice}>PKR 800</Text>
          </View>

          <View style={styles.lineItem}>
            <Text style={styles.itemTitle}>High-Pressure Water Valve (1/2")</Text>
            <Text style={styles.itemPrice}>PKR 450</Text>
          </View>

          <View style={styles.lineItem}>
            <Text style={styles.itemTitle}>Teflon Sealant & Thread Tape</Text>
            <Text style={styles.itemPrice}>PKR 120</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>PKR 1,370</Text>
          </View>
        </HzCard>

        {/* Rating Card */}
        <HzCard style={styles.card}>
          <Text style={styles.rateHeading}>Rate Your Experience</Text>
          <Text style={styles.rateSub}>How was Ustad Tariq's plumbing service?</Text>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Star
                  size={32}
                  color={star <= rating ? "#FFC107" : "#E8E3DB"}
                  fill={star <= rating ? "#FFC107" : "transparent"}
                />
              </TouchableOpacity>
            ))}
          </View>

          <HzButton
            label={rated ? "Review Submitted ✓" : "Submit Rating & Review"}
            disabled={rated}
            onPress={handleSubmitRating}
            style={{ marginTop: 14 }}
          />
        </HzCard>

        <HzButton
          label="Return to Home Screen"
          variant="secondary"
          onPress={onDone}
        />

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
  invCode: {
    fontSize: 15,
    fontWeight: "700",
    color: "#161533",
  },
  invDate: {
    fontSize: 11,
    color: "#9B9B9B",
    marginTop: 2,
  },
  paidBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(76, 175, 132, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paidText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.green,
  },
  providerRow: {
    marginTop: 12,
  },
  pName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  pTrade: {
    fontSize: 12,
    color: "#9B9B9B",
  },
  divider: {
    height: 1,
    backgroundColor: "#F5F3EF",
    marginVertical: 12,
  },
  breakdownHeading: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9B9B9B",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  lineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  itemTitle: {
    fontSize: 13,
    color: "#555555",
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "600",
    color: "#161533",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#161533",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.green,
  },
  rateHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: "#161533",
    textAlign: "center",
  },
  rateSub: {
    fontSize: 12,
    color: "#9B9B9B",
    textAlign: "center",
    marginTop: 2,
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 14,
  },
});
