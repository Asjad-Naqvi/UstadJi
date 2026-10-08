import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from "react-native";
import { COLORS, SHADOWS } from "../theme/theme";

// --- BUTTON ---
interface HzButtonProps {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const HzButton: React.FC<HzButtonProps> = ({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const getBgColor = () => {
    if (disabled) return "#D1D5DB";
    if (variant === "primary") return COLORS.navy;
    if (variant === "danger") return "#DC2626";
    if (variant === "secondary") return "#FFFFFF";
    return "transparent";
  };

  const getTextColor = () => {
    if (disabled) return "#9CA3AF";
    if (variant === "primary" || variant === "danger") return "#FFFFFF";
    return COLORS.navy;
  };

  const getBorderColor = () => {
    if (variant === "secondary") return COLORS.navy;
    return "transparent";
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor: getBgColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === "secondary" ? 1.5 : 0,
        },
        style,
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.buttonText, { color: getTextColor() }, textStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// --- CARD ---
interface HzCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}

export const HzCard: React.FC<HzCardProps> = ({ children, style, onPress }) => {
  const content = <View style={[styles.card, SHADOWS.card, style]}>{children}</View>;
  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
};

// --- CHIP / TAG ---
interface HzChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const HzChip: React.FC<HzChipProps> = ({
  label,
  selected = false,
  onPress,
  style,
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[
      styles.chip,
      selected ? styles.chipSelected : styles.chipUnselected,
      style,
    ]}
  >
    <Text
      style={[
        styles.chipText,
        selected ? styles.chipTextSelected : styles.chipTextUnselected,
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

// --- INPUT ---
interface HzInputProps extends TextInputProps {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export const HzInput: React.FC<HzInputProps> = ({
  label,
  icon,
  error,
  style,
  ...props
}) => (
  <View style={styles.inputWrapper}>
    {label && <Text style={styles.inputLabel}>{label}</Text>}
    <View style={[styles.inputContainer, error ? styles.inputError : null]}>
      {icon && <View style={styles.inputIcon}>{icon}</View>}
      <TextInput
        placeholderTextColor={COLORS.textMuted}
        style={[styles.textInput, style]}
        {...props}
      />
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 26,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 8,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  iconContainer: {
    marginRight: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8E3DB",
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E8E3DB",
    alignSelf: "flex-start",
  },
  chipSelected: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy,
  },
  chipUnselected: {
    backgroundColor: "#FFFFFF",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500",
  },
  chipTextSelected: {
    color: "#FFFFFF",
  },
  chipTextUnselected: {
    color: COLORS.navy,
  },
  inputWrapper: {
    width: "100%",
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.navy,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E3DB",
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  inputError: {
    borderColor: "#DC2626",
  },
  errorText: {
    fontSize: 12,
    color: "#DC2626",
    marginTop: 4,
  },
});
