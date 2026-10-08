import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
} from "react-native";
import { Camera, Video, Mic, ArrowLeft, Trash2, CheckCircle2 } from "lucide-react-native";
import { COLORS } from "../theme/theme";
import { HzButton, HzCard } from "../components/HzPrimitives";

export const HzIssueCaptureScreen: React.FC<{ onNavigate: (s: string) => void }> = ({
  onNavigate,
}) => {
  const [uploads, setUploads] = useState<string[]>([
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&auto=format&fit=crop&q=80",
  ]);
  const [notes, setNotes] = useState("");

  const addPhoto = () => {
    setUploads((prev) => [
      ...prev,
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&auto=format&fit=crop&q=80",
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate("home")}>
          <ArrowLeft size={22} color={COLORS.navy} />
        </TouchableOpacity>
        <Text style={styles.title}>Describe the Issue</Text>
      </View>

      <Text style={styles.subtitle}>
        Photo, video ya voice note — jo aapke liye aasan ho upload karein.
      </Text>

      {/* THREE CAPTURE OPTION CARDS */}
      <View style={styles.optionsGrid}>
        <TouchableOpacity style={styles.optionCard} onPress={addPhoto}>
          <View style={styles.iconBox}>
            <Camera size={26} color={COLORS.navy} />
          </View>
          <Text style={styles.optionTitle}>Take Photo</Text>
          <Text style={styles.optionDesc}>Capture water leak or broken part</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={addPhoto}>
          <View style={styles.iconBox}>
            <Video size={26} color={COLORS.navy} />
          </View>
          <Text style={styles.optionTitle}>Record Video</Text>
          <Text style={styles.optionDesc}>10s video of AC noise or sparking</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={addPhoto}>
          <View style={styles.iconBox}>
            <Mic size={26} color={COLORS.navy} />
          </View>
          <Text style={styles.optionTitle}>Voice Note</Text>
          <Text style={styles.optionDesc}>Speak in Roman Urdu or English</Text>
        </TouchableOpacity>
      </View>

      {/* UPLOADED PREVIEWS STRIP */}
      {uploads.length > 0 && (
        <View style={styles.previewsSection}>
          <Text style={styles.sectionLabel}>Uploaded Media ({uploads.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbRow}>
            {uploads.map((url, i) => (
              <View key={i} style={styles.thumbContainer}>
                <Image source={{ uri: url }} style={styles.thumb} />
                <TouchableOpacity
                  style={styles.removeBadge}
                  onPress={() => setUploads((prev) => prev.filter((_, idx) => idx !== i))}
                >
                  <Trash2 size={12} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* OPTIONAL NOTES INPUT */}
      <View style={styles.notesSection}>
        <Text style={styles.sectionLabel}>Add More Detail (Optional)</Text>
        <TextInput
          style={styles.notesInput}
          multiline
          numberOfLines={3}
          placeholder="e.g. AC compressor makes buzzing sound since morning..."
          placeholderTextColor={COLORS.textMuted}
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      {/* CONTINUE BUTTON */}
      <HzButton
        label="Analyze Issue with AI"
        disabled={uploads.length === 0 && !notes}
        onPress={() => onNavigate("issue_analyzing")}
        style={{ marginTop: 12 }}
      />

      <Text style={styles.helperFooter}>
        💡 Aap jitni ziada detail denge, humara Vision & Audio AI utna accurate estimate banayega.
      </Text>

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
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.navy,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  optionsGrid: {
    gap: 12,
    marginBottom: 20,
  },
  optionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8E3DB",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.navy,
  },
  optionDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  previewsSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.navy,
    marginBottom: 8,
  },
  thumbRow: {
    flexDirection: "row",
  },
  thumbContainer: {
    position: "relative",
    marginRight: 10,
  },
  thumb: {
    width: 80,
    height: 80,
    borderRadius: 14,
  },
  removeBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#DC2626",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  notesSection: {
    marginBottom: 20,
  },
  notesInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E8E3DB",
    fontSize: 13,
    color: COLORS.navy,
    textAlignVertical: "top",
    minHeight: 80,
  },
  helperFooter: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 16,
  },
});
