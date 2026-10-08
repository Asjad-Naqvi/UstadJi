import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  Search,
  Wrench,
  Zap,
  Wind,
  Sparkles,
  Hammer,
  Tv,
  Star,
  ShieldCheck,
  ChevronRight,
  Camera,
  Mic,
  Bot,
} from "lucide-react-native";
import { COLORS } from "../theme/theme";
import { HzCard, HzButton } from "../components/HzPrimitives";

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

const CATEGORIES = [
  { id: "plumbing", name: "Plumbing", icon: Wrench, count: "42 Ustads" },
  { id: "electrician", name: "Electrician", icon: Zap, count: "58 Ustads" },
  { id: "ac", name: "AC Repair", icon: Wind, count: "31 Ustads" },
  { id: "cleaning", name: "Cleaning", icon: Sparkles, count: "29 Ustads" },
  { id: "carpenter", name: "Carpentry", icon: Hammer, count: "19 Ustads" },
  { id: "appliances", name: "Appliance", icon: Tv, count: "25 Ustads" },
];

const FEATURED_USTADS = [
  {
    id: "1",
    name: "Ustad Tariq Mehmood",
    trade: "Master Plumber",
    rating: "4.9",
    reviews: "128",
    price: "Rs. 800/hr",
    sector: "F-8, Islamabad",
    avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80",
    verified: true,
  },
  {
    id: "2",
    name: "Ustad Rashid Ali",
    trade: "HVAC & AC Expert",
    rating: "4.8",
    reviews: "94",
    price: "Rs. 1,000/hr",
    sector: "G-11, Islamabad",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    verified: true,
  },
];

export const HzHomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingText}>Assalam-o-Alaikum, Zain! 👋</Text>
          <Text style={styles.locationText}>📍 F-7/2, Islamabad</Text>
        </View>
        <TouchableOpacity
          style={styles.aiBadge}
          onPress={() => onNavigate("ai_chat")}
        >
          <Bot size={20} color="#FFFFFF" />
          <Text style={styles.aiBadgeText}>AI Assistant</Text>
        </TouchableOpacity>
      </View>

      {/* AI ISSUE REPORT HERO BANNER */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onNavigate("issue_capture")}
        style={styles.heroBanner}
      >
        <View style={styles.heroContent}>
          <View style={styles.heroHeader}>
            <Text style={styles.heroTag}>⚡ AI Multimodal Diagnosis</Text>
          </View>
          <Text style={styles.heroTitle}>Koi masla hai home services mein?</Text>
          <Text style={styles.heroSubtitle}>
            Photo, Video ya Voice note bhejen — UstadJi AI issue diagnose karke behtareen Ustad dhoond dega.
          </Text>

          <View style={styles.heroActions}>
            <View style={styles.mediaPill}>
              <Camera size={16} color={COLORS.navy} />
              <Text style={styles.mediaPillText}>Photo</Text>
            </View>
            <View style={styles.mediaPill}>
              <Mic size={16} color={COLORS.navy} />
              <Text style={styles.mediaPillText}>Voice</Text>
            </View>
            <View style={styles.heroCta}>
              <Text style={styles.heroCtaText}>Start Diagnosis</Text>
              <ChevronRight size={16} color="#FFFFFF" />
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* SEARCH BAR */}
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => onNavigate("explore")}
        activeOpacity={0.8}
      >
        <Search size={20} color={COLORS.textMuted} />
        <Text style={styles.searchPlaceholder}>Search "Plumber", "AC Service", "Electrician"...</Text>
      </TouchableOpacity>

      {/* CATEGORIES */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Service Categories</Text>
        <TouchableOpacity onPress={() => onNavigate("explore")}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoryGrid}>
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryCard}
              onPress={() => onNavigate("explore")}
              activeOpacity={0.8}
            >
              <View style={styles.iconCircle}>
                <Icon size={22} color={COLORS.navy} />
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
              <Text style={styles.categoryCount}>{cat.count}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* FEATURED USTADS */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Top Verified Ustads</Text>
        <TouchableOpacity onPress={() => onNavigate("explore")}>
          <Text style={styles.seeAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {FEATURED_USTADS.map((ustad) => (
        <HzCard
          key={ustad.id}
          style={styles.ustadCard}
          onPress={() => onNavigate("provider_profile")}
        >
          <View style={styles.ustadRow}>
            <Image source={{ uri: ustad.avatar }} style={styles.ustadAvatar} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Text style={styles.ustadName}>{ustad.name}</Text>
                {ustad.verified && <ShieldCheck size={16} color={COLORS.green} />}
              </View>
              <Text style={styles.ustadTrade}>{ustad.trade} • {ustad.sector}</Text>

              <View style={styles.ratingRow}>
                <Star size={14} color={COLORS.gold} fill={COLORS.gold} />
                <Text style={styles.ratingText}>{ustad.rating}</Text>
                <Text style={styles.reviewsText}>({ustad.reviews} reviews)</Text>
              </View>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.ustadPrice}>{ustad.price}</Text>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => onNavigate("ai_chat")}
              >
                <Text style={styles.bookButtonText}>Book</Text>
              </TouchableOpacity>
            </View>
          </View>
        </HzCard>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.navy,
  },
  locationText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.navy,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  aiBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  heroBanner: {
    backgroundColor: COLORS.navy,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    elevation: 4,
  },
  heroContent: {
    gap: 8,
  },
  heroHeader: {
    flexDirection: "row",
  },
  heroTag: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.green,
    backgroundColor: "rgba(76, 175, 132, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 24,
  },
  heroSubtitle: {
    fontSize: 12,
    color: "#D1D5DB",
    lineHeight: 18,
  },
  heroActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  mediaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  mediaPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.navy,
  },
  heroCta: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.green,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  heroCtaText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: "#E8E3DB",
    marginBottom: 20,
    gap: 10,
  },
  searchPlaceholder: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.navy,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.navy,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  categoryCard: {
    width: "31%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8E3DB",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.bg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.navy,
  },
  categoryCount: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  ustadCard: {
    marginBottom: 12,
  },
  ustadRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ustadAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  ustadName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.navy,
  },
  ustadTrade: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.navy,
  },
  reviewsText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  ustadPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.navy,
    marginBottom: 6,
  },
  bookButton: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
});
