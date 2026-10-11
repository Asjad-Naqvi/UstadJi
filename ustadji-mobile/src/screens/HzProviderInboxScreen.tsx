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
import { ArrowLeft, Clock, CheckCircle2, XCircle, MapPin, DollarSign } from "lucide-react-native";
import { COLORS } from "../theme/theme";
import { HzButton, HzCard } from "../components/HzPrimitives";
import { api } from "../services/api";

interface HzProviderInboxScreenProps {
  onBack: () => void;
  onJobAccepted: (booking?: any) => void;
  providerId?: string;
}

export const HzProviderInboxScreen: React.FC<HzProviderInboxScreenProps> = ({
  onBack,
  onJobAccepted,
  providerId = "1e1a0343-e483-47f4-bdb3-7e120017ce84", // Default Ustad Tariq
}) => {
  const [activeTab, setActiveTab] = useState<"requests" | "active">("requests");
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [activeBookings, setActiveBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchDataSilently();
    }, 4000);
    return () => clearInterval(interval);
  }, [activeTab, providerId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === "requests") {
        const data = await api.getBookings(undefined, providerId, "PENDING_ACCEPTANCE");
        setPendingRequests(data);
      } else {
        const scheduled = await api.getBookings(undefined, providerId, "SCHEDULED");
        const inProgress = await api.getBookings(undefined, providerId, "IN_PROGRESS");
        setActiveBookings([...inProgress, ...scheduled]);
      }
    } catch (e) {
      console.warn("Could not fetch provider bookings:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataSilently = async () => {
    try {
      if (activeTab === "requests") {
        const data = await api.getBookings(undefined, providerId, "PENDING_ACCEPTANCE");
        setPendingRequests(data);
      } else {
        const scheduled = await api.getBookings(undefined, providerId, "SCHEDULED");
        const inProgress = await api.getBookings(undefined, providerId, "IN_PROGRESS");
        setActiveBookings([...inProgress, ...scheduled]);
      }
    } catch (e) {
      // silent
    }
  };

  const handleAccept = async (booking: any) => {
    try {
      setLoading(true);
      await api.acceptBooking(booking.id, providerId);
      Alert.alert(
        "Job Accepted! 🎉",
        `Booking ${booking.bookingCode} confirmed. Status moved to SCHEDULED.`
      );
      fetchData();
      onJobAccepted(booking);
    } catch (e) {
      Alert.alert("Error", (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async (booking: any) => {
    try {
      setLoading(true);
      await api.rejectBooking(booking.id, providerId, "Provider unavailable");
      Alert.alert("Request Declined", "Slot released and customer informed.");
      fetchData();
    } catch (e) {
      Alert.alert("Error", (e as Error).message);
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
        <Text style={styles.headerTitle}>Job Requests & Inbox</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "requests" && styles.tabActive]}
          onPress={() => setActiveTab("requests")}
        >
          <Text style={[styles.tabText, activeTab === "requests" && styles.tabTextActive]}>
            Pending Requests ({pendingRequests.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "active" && styles.tabActive]}
          onPress={() => setActiveTab("active")}
        >
          <Text style={[styles.tabText, activeTab === "active" && styles.tabTextActive]}>
            Active / Scheduled Jobs ({activeBookings.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ padding: 16, gap: 14 }}>
        {loading && <ActivityIndicator size="small" color={COLORS.navy} style={{ marginVertical: 10 }} />}

        {activeTab === "requests" ? (
          pendingRequests.length > 0 ? (
            pendingRequests.map((req) => (
              <HzCard key={req.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardCode}>{req.bookingCode}</Text>
                  <View style={styles.timerBadge}>
                    <Clock size={12} color="#FFFFFF" />
                    <Text style={styles.timerText}>30m Window Active</Text>
                  </View>
                </View>

                <Text style={styles.issueText}>{req.issueDescription}</Text>
                <Text style={styles.customerText}>
                  Customer: {req.customer?.fullName || "Zain Khan"}
                </Text>

                <View style={styles.infoRow}>
                  <MapPin size={14} color="#9B9B9B" />
                  <Text style={styles.infoText}>Sector F-7/2, Islamabad</Text>
                </View>

                <View style={styles.infoRow}>
                  <Clock size={14} color="#9B9B9B" />
                  <Text style={styles.infoText}>
                    {String(req.appointmentDate).slice(0, 10)} at {req.startTime} - {req.endTime}
                  </Text>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Estimated Payment</Text>
                  <Text style={styles.priceVal}>PKR {req.estimatedPrice}</Text>
                </View>

                <View style={styles.btnRow}>
                  <HzButton
                    label="Decline"
                    variant="secondary"
                    style={{ flex: 1, height: 42 }}
                    onPress={() => handleDecline(req)}
                  />
                  <HzButton
                    label="Accept Request"
                    style={{ flex: 1, height: 42, backgroundColor: COLORS.green }}
                    onPress={() => handleAccept(req)}
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
        ) : activeBookings.length > 0 ? (
          activeBookings.map((b) => (
            <HzCard key={b.id} style={styles.card}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.cardCode}>{b.bookingCode} • {b.serviceCategory}</Text>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "700",
                    color: b.status === "IN_PROGRESS" ? COLORS.navy : COLORS.green,
                  }}
                >
                  {b.status}
                </Text>
              </View>
              <Text style={styles.customerText}>
                Customer: {b.customer?.fullName || "Zain Khan"}
              </Text>
              <Text style={{ fontSize: 12, color: "#161533", fontWeight: "600", marginTop: 4 }}>
                📅 {String(b.appointmentDate).slice(0, 10)} at {b.startTime} - {b.endTime}
              </Text>
              <HzButton
                label="Manage Job & Update Status →"
                style={{ marginTop: 12, height: 40 }}
                onPress={() => onJobAccepted(b)}
              />
            </HzCard>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Clock size={44} color="#9B9B9B" />
            <Text style={styles.emptyTitle}>No Active Jobs</Text>
            <Text style={styles.emptySubtitle}>You don't have any scheduled jobs currently.</Text>
          </View>
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
