import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ArrowLeft, Clock, Calendar } from "lucide-react-native";
import { COLORS } from "../theme/theme";
import { HzButton } from "../components/HzPrimitives";

interface HzDateTimePickerScreenProps {
  onBack: () => void;
  onConfirm: (date: string, time: string) => void;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const HzDateTimePickerScreen: React.FC<HzDateTimePickerScreenProps> = ({
  onBack,
  onConfirm,
}) => {
  const [selectedDateIdx, setSelectedDateIdx] = useState(1); // Default tomorrow
  const [selectedSlot, setSelectedSlot] = useState<string>("10:00 AM");

  const dates = Array.from({ length: 10 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      day: DAYS[d.getDay()],
      dateNum: d.getDate(),
      month: MONTHS[d.getMonth()],
      iso: d.toISOString().split("T")[0],
    };
  });

  const timeSlots = [
    { time: "09:00 AM", period: "Morning", available: true },
    { time: "10:00 AM", period: "Morning", available: true },
    { time: "11:30 AM", period: "Morning", available: true },
    { time: "01:00 PM", period: "Afternoon", available: false, reason: "30m buffer gap" },
    { time: "02:30 PM", period: "Afternoon", available: true },
    { time: "04:00 PM", period: "Evening", available: true },
    { time: "05:30 PM", period: "Evening", available: true },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={{ padding: 4 }}>
          <ArrowLeft size={22} color={COLORS.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Date & Time</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ padding: 16 }}>
        {/* Date Selector */}
        <Text style={styles.sectionHeading}>Choose Appointment Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
          {dates.map((d, idx) => {
            const isSelected = selectedDateIdx === idx;
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.datePill, isSelected && styles.datePillSelected]}
                onPress={() => setSelectedDateIdx(idx)}
              >
                <Text style={[styles.dayLabel, isSelected && { color: "#FFFFFF" }]}>{d.day}</Text>
                <Text style={[styles.dateNum, isSelected && { color: "#FFFFFF" }]}>{d.dateNum}</Text>
                <Text style={[styles.monthLabel, isSelected && { color: "#E5E7EB" }]}>{d.month}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Time Slots */}
        <Text style={[styles.sectionHeading, { marginTop: 24 }]}>Available Time Slots</Text>
        <Text style={styles.slotNote}>
          Filtered in real-time according to Ustad's working hours and 30-min buffer gap.
        </Text>

        <View style={styles.slotsGrid}>
          {timeSlots.map((slot, idx) => {
            const isSelected = selectedSlot === slot.time;
            return (
              <TouchableOpacity
                key={idx}
                disabled={!slot.available}
                style={[
                  styles.slotCard,
                  !slot.available && styles.slotDisabled,
                  isSelected && styles.slotSelected,
                ]}
                onPress={() => setSelectedSlot(slot.time)}
              >
                <Clock
                  size={16}
                  color={isSelected ? "#FFFFFF" : !slot.available ? "#9B9B9B" : COLORS.navy}
                />
                <Text
                  style={[
                    styles.slotTimeText,
                    isSelected && { color: "#FFFFFF" },
                    !slot.available && { color: "#9B9B9B" },
                  ]}
                >
                  {slot.time}
                </Text>
                <Text
                  style={[
                    styles.slotPeriodText,
                    isSelected && { color: "#E5E7EB" },
                    !slot.available && { color: COLORS.orange },
                  ]}
                >
                  {slot.available ? slot.period : "Booked"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Continue Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.summaryDateLabel}>Selected Slot</Text>
          <Text style={styles.summaryDateVal}>
            {dates[selectedDateIdx].day}, {dates[selectedDateIdx].dateNum} {dates[selectedDateIdx].month} • {selectedSlot}
          </Text>
        </View>
        <HzButton
          label="Continue →"
          style={{ flex: 1 }}
          onPress={() => onConfirm(dates[selectedDateIdx].iso, selectedSlot)}
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
  content: {
    flex: 1,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: "700",
    color: "#161533",
    marginBottom: 10,
  },
  dateRow: {
    gap: 10,
  },
  datePill: {
    width: 64,
    height: 84,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E3DB",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  datePillSelected: {
    backgroundColor: "#161533",
    borderColor: "#161533",
  },
  dayLabel: {
    fontSize: 11,
    color: "#9B9B9B",
    fontWeight: "500",
  },
  dateNum: {
    fontSize: 18,
    fontWeight: "800",
    color: "#161533",
  },
  monthLabel: {
    fontSize: 10,
    color: "#9B9B9B",
  },
  slotNote: {
    fontSize: 11,
    color: "#9B9B9B",
    marginBottom: 12,
  },
  slotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  slotCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E8E3DB",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  slotSelected: {
    backgroundColor: "#161533",
    borderColor: "#161533",
  },
  slotDisabled: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  slotTimeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#161533",
  },
  slotPeriodText: {
    fontSize: 10,
    color: "#9B9B9B",
    marginLeft: "auto",
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E8E3DB",
  },
  summaryDateLabel: {
    fontSize: 10,
    color: "#9B9B9B",
  },
  summaryDateVal: {
    fontSize: 12,
    fontWeight: "700",
    color: "#161533",
  },
});
