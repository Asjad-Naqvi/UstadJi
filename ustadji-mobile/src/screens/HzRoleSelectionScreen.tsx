import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { ShoppingBag, Wrench, ChevronRight, ArrowLeft } from "lucide-react-native";
import { COLORS } from "../theme/theme";
import { HzButton } from "../components/HzPrimitives";

interface HzRoleSelectionScreenProps {
  onSelect: (role: "consumer" | "provider") => void;
  onBack: () => void;
}

export const HzRoleSelectionScreen: React.FC<HzRoleSelectionScreenProps> = ({
  onSelect,
  onBack,
}) => {
  const [selected, setSelected] = useState<"consumer" | "provider" | null>(null);

  const CARDS = [
    {
      id: "consumer" as const,
      Icon: ShoppingBag,
      title: "I need a service",
      description: "Find trusted providers for home and cleaning services in Islamabad.",
    },
    {
      id: "provider" as const,
      Icon: Wrench,
      title: "I offer services",
      description: "Register as a provider and receive job requests from consumers.",
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top back & logo mark */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} style={{ padding: 4 }}>
          <ArrowLeft size={22} color={COLORS.navy} />
        </TouchableOpacity>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>U</Text>
        </View>
      </View>

      <Text style={styles.heading}>Let's get started</Text>
      <Text style={styles.subheading}>How will you be using Ustaad G?</Text>

      {/* Role Cards */}
      <View style={styles.cardsList}>
        {CARDS.map(({ id, Icon, title, description }) => {
          const isSelected = selected === id;
          return (
            <TouchableOpacity
              key={id}
              activeOpacity={0.85}
              onPress={() => setSelected(id)}
              style={[
                styles.card,
                isSelected ? styles.cardSelected : styles.cardUnselected,
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconCircle, isSelected && { backgroundColor: "#FFFFFF" }]}>
                  <Icon size={24} color={isSelected ? COLORS.navy : COLORS.navy} />
                </View>
                <ChevronRight size={20} color={isSelected ? "#FFFFFF" : "#9B9B9B"} />
              </View>

              <Text style={[styles.cardTitle, isSelected && { color: "#FFFFFF" }]}>{title}</Text>
              <Text style={[styles.cardDesc, isSelected && { color: "#E5E7EB" }]}>{description}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ marginTop: 32 }}>
        <HzButton
          label="Continue"
          disabled={!selected}
          onPress={() => {
            if (selected) onSelect(selected);
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F5",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logoBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#161533",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    lineHeight: 30,
  },
  subheading: {
    fontSize: 14,
    color: "#9B9B9B",
    marginTop: 4,
    lineHeight: 20,
  },
  cardsList: {
    gap: 14,
    marginTop: 24,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    minHeight: 150,
  },
  cardUnselected: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E3DB",
  },
  cardSelected: {
    backgroundColor: "#161533",
    borderWidth: 2,
    borderColor: "#161533",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F5F3EF",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  cardDesc: {
    fontSize: 13,
    color: "#9B9B9B",
    marginTop: 6,
    lineHeight: 18,
  },
});
