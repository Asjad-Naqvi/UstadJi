import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MessageCircle, Search, Clock, Heart, User, LayoutDashboard, Inbox, Shield } from "lucide-react-native";
import { COLORS } from "../theme/theme";

export type ConsumerTabId = "chat" | "explore" | "bookings" | "favourites" | "profile";
export type ProviderTabId = "dashboard" | "inbox" | "profile";

interface HzBottomNavProps {
  role: "consumer" | "provider" | "admin";
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const HzBottomNav: React.FC<HzBottomNavProps> = ({
  role,
  activeTab,
  onTabChange,
}) => {
  const consumerTabs = [
    { id: "chat", label: "Chat", Icon: MessageCircle },
    { id: "explore", label: "Explore", Icon: Search },
    { id: "bookings", label: "Bookings", Icon: Clock },
    { id: "favourites", label: "Favourites", Icon: Heart },
    { id: "profile", label: "Profile", Icon: User },
  ];

  const providerTabs = [
    { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
    { id: "inbox", label: "Inbox", Icon: Inbox },
    { id: "profile", label: "Profile", Icon: User },
  ];

  const adminTabs = [
    { id: "dashboard", label: "Overview", Icon: LayoutDashboard },
    { id: "profile", label: "Admin Profile", Icon: Shield },
  ];

  const tabs = role === "provider" ? providerTabs : role === "admin" ? adminTabs : consumerTabs;

  return (
    <View style={styles.container}>
      {tabs.map(({ id, label, Icon }) => {
        const isActive = id === activeTab;
        const color = isActive ? "#161533" : "#9B9B9B";

        return (
          <TouchableOpacity
            key={id}
            onPress={() => onTabChange(id)}
            activeOpacity={0.7}
            style={styles.tabButton}
          >
            <Icon size={22} color={color} />
            <Text
              style={[
                styles.label,
                { color, fontWeight: isActive ? "600" : "400" },
              ]}
            >
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
    borderTopColor: "#EFEFEF",
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
    fontSize: 10,
    fontFamily: "System",
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#161533",
    marginTop: 1,
  },
});
