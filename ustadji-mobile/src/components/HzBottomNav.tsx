import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Home, Search, CalendarDays, User, Bot, LayoutDashboard } from "lucide-react-native";
import { COLORS } from "../theme/theme";

export type HzNavTabId = "home" | "ai_chat" | "explore" | "bookings" | "profile" | "admin";

interface HzBottomNavProps {
  activeTab: HzNavTabId;
  onTabChange: (id: HzNavTabId) => void;
  userRole?: "consumer" | "provider" | "admin";
}

export const HzBottomNav: React.FC<HzBottomNavProps> = ({
  activeTab,
  onTabChange,
  userRole = "consumer",
}) => {
  const tabs = [
    { id: "home" as HzNavTabId, Icon: Home, label: "Home" },
    { id: "ai_chat" as HzNavTabId, Icon: Bot, label: "AI Agent" },
    { id: "explore" as HzNavTabId, Icon: Search, label: "Explore" },
    { id: "bookings" as HzNavTabId, Icon: CalendarDays, label: "Bookings" },
    { id: "profile" as HzNavTabId, Icon: User, label: "Profile" },
  ];

  if (userRole === "admin") {
    tabs[0] = { id: "admin" as HzNavTabId, Icon: LayoutDashboard, label: "Admin" };
  }

  return (
    <View style={styles.container}>
      {tabs.map(({ id, Icon, label }) => {
        const isActive = id === activeTab;
        const color = isActive ? COLORS.navy : "#9B9B9B";

        return (
          <TouchableOpacity
            key={id}
            onPress={() => onTabChange(id)}
            activeOpacity={0.7}
            style={styles.tabButton}
          >
            <Icon size={22} color={color} />
            <Text style={[styles.label, { color, fontWeight: isActive ? "600" : "400" }]}>
              {label}
            </Text>
            {isActive && <View style={styles.activeDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E8E3DB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  label: {
    fontSize: 11,
    fontFamily: "System",
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.navy,
    marginTop: 1,
  },
});
