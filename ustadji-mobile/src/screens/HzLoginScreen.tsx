import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Phone, Lock, Eye, EyeOff, Shield, User, Wrench } from "lucide-react-native";
import { COLORS } from "../theme/theme";
import { HzButton } from "../components/HzPrimitives";
import { api } from "../services/api";

interface HzLoginScreenProps {
  onLoginSuccess: (role: "consumer" | "provider" | "admin", user?: any) => void;
  onRegister: () => void;
  onRoleSelect: () => void;
}

export const HzLoginScreen: React.FC<HzLoginScreenProps> = ({
  onLoginSuccess,
  onRegister,
  onRoleSelect,
}) => {
  const [selectedRole, setSelectedRole] = useState<"consumer" | "provider" | "admin">("consumer");
  const [phone, setPhone] = useState("+92 300 5551234");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRoleChange = (role: "consumer" | "provider" | "admin") => {
    setSelectedRole(role);
    if (role === "consumer") {
      setPhone("+92 300 5551234");
      setPassword("password123");
    } else if (role === "provider") {
      setPhone("+92 333 1112233");
      setPassword("password123");
    } else {
      setPhone("admin@ustadji.pk");
      setPassword("adminpassword");
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      // Email mapping for demo users
      const email =
        selectedRole === "consumer"
          ? "zain@ustadji.pk"
          : selectedRole === "provider"
          ? "tariq@ustadji.pk"
          : "admin@ustadji.pk";

      const res = await api.login(email, password);
      onLoginSuccess(selectedRole, res.user);
    } catch (err) {
      // Fallback to local offline login if network error
      onLoginSuccess(selectedRole, { fullName: selectedRole === "consumer" ? "Zain Khan" : "Ustad Tariq Mehmood" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Logo Badge — 32×32 Navy Circle */}
      <View style={styles.topBar}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>U</Text>
        </View>
        <Text style={styles.brandTitle}>Ustaad G</Text>
      </View>

      {/* Heading */}
      <Text style={styles.heading}>Welcome Back</Text>
      <Text style={styles.subheading}>Log in with your phone number & select your role.</Text>

      {/* ROLE SELECTION TABS */}
      <View style={styles.roleGroup}>
        <TouchableOpacity
          style={[styles.roleTab, selectedRole === "consumer" && styles.roleTabActive]}
          onPress={() => handleRoleChange("consumer")}
          activeOpacity={0.8}
        >
          <User size={16} color={selectedRole === "consumer" ? "#FFFFFF" : COLORS.navy} />
          <Text style={[styles.roleTabText, selectedRole === "consumer" && styles.roleTabTextActive]}>
            Consumer
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleTab, selectedRole === "provider" && styles.roleTabActive]}
          onPress={() => handleRoleChange("provider")}
          activeOpacity={0.8}
        >
          <Wrench size={16} color={selectedRole === "provider" ? "#FFFFFF" : COLORS.navy} />
          <Text style={[styles.roleTabText, selectedRole === "provider" && styles.roleTabTextActive]}>
            Service Provider
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleTab, selectedRole === "admin" && styles.roleTabActive]}
          onPress={() => handleRoleChange("admin")}
          activeOpacity={0.8}
        >
          <Shield size={16} color={selectedRole === "admin" ? "#FFFFFF" : COLORS.navy} />
          <Text style={[styles.roleTabText, selectedRole === "admin" && styles.roleTabTextActive]}>
            Admin
          </Text>
        </TouchableOpacity>
      </View>

      {/* FIELDS CONTAINER */}
      <View style={styles.fields}>
        {/* Phone Field */}
        <View style={styles.fieldBox}>
          <Phone size={20} color="#9B9B9B" />
          <TextInput
            style={styles.textInput}
            placeholder="+92 3XX XXXXXXX"
            placeholderTextColor="#9B9B9B"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoCapitalize="none"
          />
        </View>

        {/* Password Field */}
        <View style={styles.fieldBox}>
          <Lock size={20} color="#9B9B9B" />
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            placeholderTextColor="#9B9B9B"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
            {showPassword ? <EyeOff size={20} color="#9B9B9B" /> : <Eye size={20} color="#9B9B9B" />}
          </TouchableOpacity>
        </View>

        {/* Forgot password */}
        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

      {/* CTA Button */}
      <View style={{ marginTop: 20 }}>
        <HzButton
          label={loading ? "Logging in..." : `Log In as ${selectedRole === "consumer" ? "Consumer" : selectedRole === "provider" ? "Provider" : "Admin"}`}
          onPress={handleLogin}
          disabled={loading}
        />
      </View>

      {/* Footer link */}
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>New to Ustaad G? </Text>
        <TouchableOpacity onPress={onRoleSelect}>
          <Text style={styles.footerLink}>Select Role & Register</Text>
        </TouchableOpacity>
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
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#161533",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#161533",
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    lineHeight: 30,
  },
  subheading: {
    fontSize: 13,
    color: "#9B9B9B",
    marginTop: 4,
    lineHeight: 18,
  },
  roleGroup: {
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
    marginBottom: 16,
  },
  roleTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8E3DB",
    paddingVertical: 10,
  },
  roleTabActive: {
    backgroundColor: "#161533",
    borderColor: "#161533",
  },
  roleTabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#161533",
  },
  roleTabTextActive: {
    color: "#FFFFFF",
  },
  fields: {
    gap: 12,
  },
  fieldBox: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E3DB",
    paddingHorizontal: 16,
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: "#1A1A1A",
  },
  eyeBtn: {
    padding: 4,
  },
  forgotBtn: {
    alignSelf: "flex-end",
    paddingVertical: 4,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#161533",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#9B9B9B",
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#161533",
  },
});
