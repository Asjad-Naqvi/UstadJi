import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { ArrowLeft, Star, ShieldCheck, MapPin, Clock, Award, Phone } from "lucide-react-native";
import { COLORS } from "../theme/theme";
import { HzButton, HzCard } from "../components/HzPrimitives";

interface HzProviderProfileScreenProps {
  provider?: any;
  onBack: () => void;
  onBook: () => void;
}

export const HzProviderProfileScreen: React.FC<HzProviderProfileScreenProps> = ({
  provider,
  onBack,
  onBook,
}) => {
  const p = provider || {
    name: "Ustad Tariq Mehmood",
    trade: "Master Plumber",
    rating: 4.9,
    reviews: 128,
    rate: 800,
    sector: "Sector F-7 & F-8, Islamabad",
    experience: "12 years experience",
    avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200&auto=format&fit=crop&q=80",
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={{ padding: 4 }}>
          <ArrowLeft size={22} color={COLORS.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Provider Profile</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Profile Card */}
        <HzCard style={styles.profileCard}>
          <Image source={{ uri: p.avatar }} style={styles.avatar} />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 }}>
            <Text style={styles.name}>{p.name}</Text>
            <ShieldCheck size={18} color={COLORS.green} />
          </View>
          <Text style={styles.trade}>{p.trade} • {p.experience}</Text>

          <View style={styles.ratingBadge}>
            <Star size={16} color="#FFC107" fill="#FFC107" />
            <Text style={styles.ratingNum}>{p.rating}</Text>
            <Text style={styles.reviewsNum}>({p.reviews} verified reviews)</Text>
          </View>

          <View style={styles.rateBox}>
            <Text style={styles.rateLabel}>Hourly Base Rate</Text>
            <Text style={styles.rateVal}>PKR {p.rate} / hr</Text>
          </View>
        </HzCard>

        {/* Working Hours & Availability */}
        <HzCard>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Clock size={18} color={COLORS.navy} />
            <Text style={styles.sectionTitle}>Working Hours & Buffer Gaps</Text>
          </View>
          <Text style={styles.bodyText}>Monday – Saturday: 09:00 AM – 06:00 PM</Text>
          <Text style={styles.bodyTextSub}>Minimum 30-minute buffer gap between consecutive appointments.</Text>
        </HzCard>

        {/* Service Areas */}
        <HzCard>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <MapPin size={18} color={COLORS.navy} />
            <Text style={styles.sectionTitle}>Service Coverage Area</Text>
          </View>
          <Text style={styles.bodyText}>{p.sector || "F-6, F-7, F-8, G-9, Blue Area, Islamabad"}</Text>
        </HzCard>

        {/* Bio */}
        <HzCard>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Award size={18} color={COLORS.navy} />
            <Text style={styles.sectionTitle}>About Ustad</Text>
          </View>
          <Text style={styles.bodyText}>
            Specialized in sanitary fitting, water motor repairs, pipeline leakage diagnostics, and gas geyser installation. Verified CNIC and certified technician.
          </Text>
        </HzCard>

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.rateFooterLabel}>Total Estimate</Text>
          <Text style={styles.rateFooterVal}>PKR {p.rate}/hr</Text>
        </View>
        <HzButton
          label="Book Time Slot (M5) →"
          style={{ flex: 1 }}
          onPress={onBook}
        />
      </View>
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
  scroll: {
    flex: 1,
  },
  profileCard: {
    alignItems: "center",
    paddingVertical: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#161533",
  },
  trade: {
    fontSize: 13,
    color: "#9B9B9B",
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FAF8F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 10,
  },
  ratingNum: {
    fontSize: 13,
    fontWeight: "700",
    color: "#161533",
  },
  reviewsNum: {
    fontSize: 12,
    color: "#9B9B9B",
  },
  rateBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#FAF8F5",
    padding: 12,
    borderRadius: 12,
    marginTop: 14,
  },
  rateLabel: {
    fontSize: 12,
    color: "#9B9B9B",
  },
  rateVal: {
    fontSize: 16,
    fontWeight: "800",
    color: "#161533",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#161533",
  },
  bodyText: {
    fontSize: 13,
    color: "#1A1A1A",
    lineHeight: 18,
  },
  bodyTextSub: {
    fontSize: 12,
    color: "#9B9B9B",
    marginTop: 4,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E8E3DB",
  },
  rateFooterLabel: {
    fontSize: 11,
    color: "#9B9B9B",
  },
  rateFooterVal: {
    fontSize: 17,
    fontWeight: "800",
    color: "#161533",
  },
});
