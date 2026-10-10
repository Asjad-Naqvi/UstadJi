import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { ArrowLeft, Star, ShieldCheck, MapPin, Zap, Clock, Info } from "lucide-react-native";
import { COLORS } from "../theme/theme";
import { HzButton, HzCard } from "../components/HzPrimitives";

interface HzProviderResultsScreenProps {
  onBack: () => void;
  onViewProfile: (provider: any) => void;
  onBookProvider: (provider: any) => void;
}

const PROVIDERS = [
  {
    id: "18cc5f37-d760-4bdc-a2fe-f6d49c61d54b",
    name: "Ustad Tariq Mehmood",
    trade: "Master Plumber",
    rating: 4.9,
    reviews: 128,
    rate: 800,
    sector: "F-7/2, Islamabad (0.8 km)",
    experience: "12 yrs exp",
    preference: "MANUAL_APPROVAL",
    avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80",
    verified: true,
  },
  {
    id: "d3004a5f-d974-4d78-8e6c-698d524b5fd5",
    name: "Ustad Rashid Ali",
    trade: "HVAC & AC Expert",
    rating: 4.8,
    reviews: 94,
    rate: 1000,
    sector: "G-11/1, Islamabad (1.8 km)",
    experience: "9 yrs exp",
    preference: "AUTO_CONFIRM",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    verified: true,
  },
  {
    id: "5ff5cf77-26dd-4ed9-902c-3c4507bc0cec",
    name: "Ustad Bilal Ahmad",
    trade: "Master Electrician",
    rating: 4.9,
    reviews: 76,
    rate: 750,
    sector: "F-6, Islamabad (1.4 km)",
    experience: "7 yrs exp",
    preference: "MANUAL_APPROVAL",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    verified: true,
  },
];

export const HzProviderResultsScreen: React.FC<HzProviderResultsScreenProps> = ({
  onBack,
  onViewProfile,
  onBookProvider,
}) => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Top Rated", "Plumber", "AC Service", "Electrician"];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={{ padding: 4 }}>
          <ArrowLeft size={22} color={COLORS.navy} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Matched Ustads</Text>
          <Text style={styles.headerSubtitle}>Verified professionals in Islamabad</Text>
        </View>
      </View>

      {/* Filter Tags */}
      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Provider List */}
      <ScrollView style={styles.list} contentContainerStyle={{ padding: 16, gap: 14 }}>
        {/* Ranking explanation banner */}
        <View style={styles.rankingBanner}>
          <Info size={16} color={COLORS.navy} />
          <Text style={styles.rankingText}>
            Ranked based on proximity, response rate, and consumer reviews.
          </Text>
        </View>

        {PROVIDERS.map((p) => {
          const isAuto = p.preference === "AUTO_CONFIRM";

          return (
            <HzCard key={p.id} style={styles.pCard}>
              <View style={styles.pTop}>
                <Image source={{ uri: p.avatar }} style={styles.pAvatar} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Text style={styles.pName}>{p.name}</Text>
                    {p.verified && <ShieldCheck size={16} color={COLORS.green} />}
                  </View>
                  <Text style={styles.pTrade}>{p.trade} • {p.experience}</Text>
                  <View style={styles.metaRow}>
                    <Star size={14} color="#FFC107" fill="#FFC107" />
                    <Text style={styles.pRating}>{p.rating}</Text>
                    <Text style={styles.pReviews}>({p.reviews} reviews)</Text>
                  </View>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.pRate}>PKR {p.rate}</Text>
                  <Text style={styles.pRateUnit}>/ hour</Text>
                </View>
              </View>

              <View style={styles.locationRow}>
                <MapPin size={13} color="#9B9B9B" />
                <Text style={styles.locationText}>{p.sector}</Text>
                {isAuto ? (
                  <View style={styles.instantPill}>
                    <Zap size={11} color="#FFFFFF" />
                    <Text style={styles.instantText}>Instant Auto-Confirm</Text>
                  </View>
                ) : (
                  <View style={styles.manualPill}>
                    <Clock size={11} color="#FFFFFF" />
                    <Text style={styles.manualText}>30m Manual Approval</Text>
                  </View>
                )}
              </View>

              <View style={styles.btnRow}>
                <HzButton
                  label="View Profile"
                  variant="secondary"
                  style={{ flex: 1, height: 42 }}
                  onPress={() => onViewProfile(p)}
                />
                <HzButton
                  label="Book Now"
                  style={{ flex: 1, height: 42 }}
                  onPress={() => onBookProvider(p)}
                />
              </View>
            </HzCard>
          );
        })}

        <View style={{ height: 30 }} />
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
  headerSubtitle: {
    fontSize: 11,
    color: "#9B9B9B",
  },
  filterRow: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E3DB",
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#FAF8F5",
    borderWidth: 1,
    borderColor: "#E8E3DB",
  },
  filterChipActive: {
    backgroundColor: "#161533",
    borderColor: "#161533",
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#161533",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  list: {
    flex: 1,
  },
  rankingBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(22, 21, 51, 0.06)",
    padding: 10,
    borderRadius: 12,
  },
  rankingText: {
    flex: 1,
    fontSize: 11,
    color: "#161533",
  },
  pCard: {
    padding: 16,
  },
  pTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  pName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#161533",
  },
  pTrade: {
    fontSize: 12,
    color: "#9B9B9B",
    marginTop: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  pRating: {
    fontSize: 12,
    fontWeight: "700",
    color: "#161533",
  },
  pReviews: {
    fontSize: 11,
    color: "#9B9B9B",
  },
  pRate: {
    fontSize: 16,
    fontWeight: "800",
    color: "#161533",
  },
  pRateUnit: {
    fontSize: 10,
    color: "#9B9B9B",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F5F3EF",
    gap: 6,
  },
  locationText: {
    fontSize: 11,
    color: "#9B9B9B",
    flex: 1,
  },
  instantPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.green,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  instantText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  manualPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.orange,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  manualText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  btnRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
});
