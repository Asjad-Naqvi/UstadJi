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

const CONSUMER_PROFILES = [
  { name: "Zain Khan", phone: "+92 300 5551234", email: "zain@ustadji.pk", sector: "F-7/2" },
  { name: "Ayesha Malik", phone: "+92 300 5555678", email: "ayesha@ustadji.pk", sector: "G-11/1" },
  { name: "Hamza Abbasi", phone: "+92 300 5559900", email: "hamza@ustadji.pk", sector: "E-11/3" },
  { name: "Fatima Zahra", phone: "+92 300 5557788", email: "fatima@ustadji.pk", sector: "F-10/2" },
];

const PROVIDER_PROFILES = [
  { name: "Ustad Tariq Mehmood", trade: "Plumber (Manual 30m)", phone: "+92 333 1112233", email: "tariq@ustadji.pk" },
  { name: "Ustad Rashid Ali", trade: "HVAC (Auto-Confirm)", phone: "+92 333 4445566", email: "rashid@ustadji.pk" },
  { name: "Ustad Bilal Ahmad", trade: "Electrician (Manual 30m)", phone: "+92 333 7778899", email: "bilal@ustadji.pk" },
  { name: "Ustad Muhammad Aslam", trade: "Carpenter (Manual 30m)", phone: "+92 333 2221100", email: "aslam@ustadji.pk" },
  { name: "Ustad Noman Qureshi", trade: "Painter (Auto-Confirm)", phone: "+92 333 8884422", email: "noman@ustadji.pk" },
];

export const HzLoginScreen: React.FC<HzLoginScreenProps> = ({
  onLoginSuccess,
  onRegister,
  onRoleSelect,
}) => {
  const [selectedRole, setSelectedRole] = useState<"consumer" | "provider" | "admin">("consumer");
  const [selectedConsumerIndex, setSelectedConsumerIndex] = useState(0);
  const [selectedProviderIndex, setSelectedProviderIndex] = useState(0);
  const [phone, setPhone] = useState(CONSUMER_PROFILES[0].phone);
  const [password, setPassword] = useState("password123");
  const [currentEmail, setCurrentEmail] = useState(CONSUMER_PROFILES[0].email);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRoleChange = (role: "consumer" | "provider" | "admin") => {
    setSelectedRole(role);
    setErrorMsg(null);
    if (role === "consumer") {
      const p = CONSUMER_PROFILES[selectedConsumerIndex];
      setPhone(p.phone);
      setCurrentEmail(p.email);
      setPassword("password123");
    } else if (role === "provider") {
      const p = PROVIDER_PROFILES[selectedProviderIndex];
      setPhone(p.phone);
      setCurrentEmail(p.email);
      setPassword("password123");
    } else {
      setPhone("admin@ustadji.pk");
      setCurrentEmail("admin@ustadji.pk");
      setPassword("adminpassword");
    }
  };

  const handleSelectConsumer = (index: number) => {
    setSelectedConsumerIndex(index);
    const p = CONSUMER_PROFILES[index];
    setPhone(p.phone);
    setCurrentEmail(p.email);
    setPassword("password123");
  };

  const handleSelectProvider = (index: number) => {
    setSelectedProviderIndex(index);
    const p = PROVIDER_PROFILES[index];
    setPhone(p.phone);
    setCurrentEmail(p.email);
    setPassword("password123");
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      // Determine email to use
      let email = currentEmail;
      if (phone.includes("@")) {
        email = phone.trim();
      } else {
        // Find matching demo phone
        const cMatch = CONSUMER_PROFILES.find((c) => c.phone.replace(/\s+/g, "") === phone.replace(/\s+/g, ""));
        const pMatch = PROVIDER_PROFILES.find((p) => p.phone.replace(/\s+/g, "") === phone.replace(/\s+/g, ""));
        if (cMatch) email = cMatch.email;
        else if (pMatch) email = pMatch.email;
      }

      const res = await api.login(email, password);
      onLoginSuccess(selectedRole, res.user);
    } catch (err) {
      console.warn("API Login failed, falling back to simulated session:", err);
      // Fallback to local profile if offline
      const fallbackUser =
        selectedRole === "consumer"
          ? { id: "1aaf561c-c519-49a1-8762-8a8fb540aa4b", fullName: CONSUMER_PROFILES[selectedConsumerIndex].name, email: currentEmail, phone }
          : { id: "18cc5f37-d760-4bdc-a2fe-f6d49c61d54b", fullName: PROVIDER_PROFILES[selectedProviderIndex].name, email: currentEmail, phone };
      onLoginSuccess(selectedRole, fallbackUser);
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
      <Text style={styles.subheading}>Log in to test live simulated booking & scheduling.</Text>

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

      {/* QUICK DUMMY PROFILE PICKER CHIPS */}
      <View style={{ marginBottom: 14 }}>
        <Text style={{ fontSize: 11, fontWeight: "700", color: "#9B9B9B", textTransform: "uppercase", marginBottom: 6 }}>
          Quick Demo Profiles ({selectedRole === "consumer" ? "Consumers" : selectedRole === "provider" ? "Providers" : "Admin"})
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {selectedRole === "consumer" &&
            CONSUMER_PROFILES.map((c, i) => (
              <TouchableOpacity
                key={c.email}
                onPress={() => handleSelectConsumer(i)}
                style={[
                  styles.demoChip,
                  selectedConsumerIndex === i && styles.demoChipActive,
                ]}
              >
                <Text style={[styles.demoChipText, selectedConsumerIndex === i && styles.demoChipTextActive]}>
                  {c.name} ({c.sector})
                </Text>
              </TouchableOpacity>
            ))}

          {selectedRole === "provider" &&
            PROVIDER_PROFILES.map((p, i) => (
              <TouchableOpacity
                key={p.email}
                onPress={() => handleSelectProvider(i)}
                style={[
                  styles.demoChip,
                  selectedProviderIndex === i && styles.demoChipActive,
                ]}
              >
                <Text style={[styles.demoChipText, selectedProviderIndex === i && styles.demoChipTextActive]}>
                  {p.name.split(" ")[1]} • {p.trade.split(" ")[0]}
                </Text>
              </TouchableOpacity>
            ))}

          {selectedRole === "admin" && (
            <View style={[styles.demoChip, styles.demoChipActive]}>
              <Text style={styles.demoChipTextActive}>UstadJi Admin Portal</Text>
            </View>
          )}
        </ScrollView>
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
  demoChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E3DB",
  },
  demoChipActive: {
    backgroundColor: "#161533",
    borderColor: "#161533",
  },
  demoChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#161533",
  },
  demoChipTextActive: {
    color: "#FFFFFF",
  },
});
