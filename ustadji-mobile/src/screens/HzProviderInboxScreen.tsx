import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { ArrowLeft, Clock, CheckCircle2, XCircle, MapPin, DollarSign } from "lucide-react-native";
import { COLORS } from "../theme/theme";
import { HzButton, HzCard } from "../components/HzPrimitives";
import { api } from "../services/api";

interface HzProviderInboxScreenProps {
  onBack: () => void;
  onJobAccepted: () => void;
}

export const HzProviderInboxScreen: React.FC<HzProviderInboxScreenProps> = ({
  onBack,
  onJobAccepted,
}) => {
  const [activeTab, setActiveTab] = useState<"requests" | "active">("requests");
  const [requests, setRequests] = useState([
    {
      id: "req-1",
      code: "BK-7204",
      customer: "Zain Khan",
      issue: "Main water pipe valve leaking in kitchen",
      sector: "House 24, Street 12, F-7/2 Islamabad",
      date: "Tomorrow",
      time: "10:00 AM - 11:00 AM",
      price: "PKR 800",
      minutesLeft: 22,
    },
  ]);

  const handleAccept = async (id: string) => {
    try {
      // Call backend accept endpoint if real booking ID
      setRequests((prev) => prev.filter((r) => r.id !== id));
      Alert.alert("Job Accepted! 🎉", "Booking status moved to SCHEDULED. Customer has been notified.");
      onJobAccepted();
    } catch (e) {
      Alert.alert("Error", (e as Error).message);
    }
  };

  const handleDecline = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    Alert.alert("Request Declined", "Slot released and customer informed.");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={{ padding: 4 }}>
          <ArrowLeft size={22} color={COLORS.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Requests & Inbox</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "requests" && styles.tabActive]}
          onPress={() => setActiveTab("requests")}
        >
          <Text style={[styles.tabText, activeTab === "requests" && styles.tabTextActive]}>
            Pending Requests ({requests.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "active" && styles.tabActive]}
          onPress={() => setActiveTab("active")}
        >
          <Text style={[styles.tabText, activeTab === "active" && styles.tabTextActive]}>
            Active / Scheduled Jobs
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ padding: 16, gap: 14 }}>
        {activeTab === "requests" ? (
          requests.length > 0 ? (
            requests.map((req) => (
              <HzCard key={req.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardCode}>{req.code}</Text>
                  <View style={styles.timerBadge}>
                    <Clock size={12} color="#FFFFFF" />
                    <Text style={styles.timerText}>{req.minutesLeft}m left to respond</Text>
                  </View>
                </View>

                <Text style={styles.issueText}>{req.issue}</Text>
                <Text style={styles.customerText}>Customer: {req.customer}</Text>

                <View style={styles.infoRow}>
                  <MapPin size={14} color="#9B9B9B" />
                  <Text style={styles.infoText}>{req.sector}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Clock size={14} color="#9B9B9B" />
                  <Text style={styles.infoText}>{req.date} at {req.time}</Text>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Estimated Payment</Text>
                  <Text style={styles.priceVal}>{req.price}</Text>
                </View>

                <View style={styles.btnRow}>
                  <HzButton
                    label="Decline"
                    variant="secondary"
                    style={{ flex: 1, height: 42 }}
                    onPress={() => handleDecline(req.id)}
                  />
                  <HzButton
                    label="Accept Request"
                    style={{ flex: 1, height: 42, backgroundColor: COLORS.green }}
                    onPress={() => handleAccept(req.id)}
                  />
                </View>
              </HzCard>
            ))
          ) : (
            <View style={styles.emptyState}>
              <CheckCircle2 size={44} color={COLORS.green} />
              <Text style={styles.emptyTitle}>All Caught Up!</Text>
              <Text style={styles.emptySubtitle}>No pending booking requests right now.</Text>
            </View>
          )
        ) : (
          <HzCard style={styles.card}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={styles.cardCode}>BK-1001 • Plumbing Service</Text>
              <Text style={{ fontSize: 11, fontWeight: "700", color: COLORS.green }}>SCHEDULED</Text>
            </View>
            <Text style={styles.customerText}>Customer: Zain Khan • F-7/2 Islamabad</Text>
            <Text style={{ fontSize: 12, color: "#161533", fontWeight: "600", marginTop: 4 }}>
              📅 Tomorrow at 10:00 AM - 11:00 AM
            </Text>
            <HzButton
              label="Open Active Job View →"
              style={{ marginTop: 12, height: 40 }}
              onPress={onJobAccepted}
            />
          </HzCard>
        )}
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
  tabsRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E3DB",
    gap: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#FAF8F5",
  },
  tabActive: {
    backgroundColor: "#161533",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#161533",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  card: {
    padding: 16,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardCode: {
    fontSize: 15,
    fontWeight: "700",
    color: "#161533",
  },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.orange,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  timerText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  issueText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  customerText: {
    fontSize: 12,
    color: "#9B9B9B",
    marginTop: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  infoText: {
    fontSize: 12,
    color: "#555555",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FAF8F5",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  priceLabel: {
    fontSize: 12,
    color: "#9B9B9B",
  },
  priceVal: {
    fontSize: 15,
    fontWeight: "800",
    color: "#161533",
  },
  btnRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#161533",
  },
  emptySubtitle: {
    fontSize: 12,
    color: "#9B9B9B",
  },
});
