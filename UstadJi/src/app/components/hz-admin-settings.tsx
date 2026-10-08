import React, { useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";

const NAVY = "#161533";
const BORDER = "#E8E3DB";

interface SettingRowProps {
  label: string;
  value?: string;
  isToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: () => void;
  isLink?: boolean;
  isLast?: boolean;
}

function SettingRow({
  label,
  value,
  isToggle,
  toggleValue,
  onToggle,
  isLink,
  isLast,
}: SettingRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "13px 16px",
        borderBottom: isLast ? "none" : "1px solid #F5F5F5",
      }}
    >
      <span style={{ fontSize: 14, color: "#1A1A1A" }}>{label}</span>
      {isToggle ? (
        <button
          type="button"
          onClick={onToggle}
          style={{
            width: 44,
            height: 24,
            borderRadius: 12,
            backgroundColor: toggleValue ? NAVY : BORDER,
            position: "relative",
            border: "none",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 2,
              left: toggleValue ? 22 : 2,
              width: 20,
              height: 20,
              borderRadius: "50%",
              backgroundColor: "white",
              transition: "left 0.15s ease",
              display: "block",
            }}
          />
        </button>
      ) : isLink ? (
        <span style={{ fontSize: 14, color: NAVY }}>→</span>
      ) : (
        <span style={{ fontSize: 13, color: "#9B9B9B" }}>{value}</span>
      )}
    </div>
  );
}

interface SettingsSectionProps {
  title: string;
  emoji: string;
  children: React.ReactNode;
}

function SettingsSection({ title, emoji, children }: SettingsSectionProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          paddingLeft: 16,
          paddingBottom: 6,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: "#9B9B9B" }}>
          {emoji} {title}
        </span>
      </div>
      <div
        style={{
          borderRadius: 10,
          border: `1px solid ${BORDER}`,
          overflow: "hidden",
          backgroundColor: "white",
          marginLeft: 16,
          marginRight: 16,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function HzAdminSettingsScreen({
  onBack,
  onSignOut,
}: {
  onBack?: () => void;
  onSignOut?: () => void;
}) {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [twoFA, setTwoFA] = useState(true);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 390,
        height: 844,
        fontFamily: "Inter, sans-serif",
        backgroundColor: "#FAF8F5",
        overflow: "hidden",
      }}
    >
      {/* Status bar */}
      <div
        style={{
          height: 24,
          backgroundColor: "white",
          flexShrink: 0,
        }}
      />

      {/* Header */}
      <div
        style={{
          height: 56,
          backgroundColor: "white",
          borderBottom: "1px solid #EFEFEF",
          display: "flex",
          alignItems: "center",
          paddingLeft: 4,
          paddingRight: 16,
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px 8px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ArrowLeft size={24} color="#1A1A1A" />
        </button>
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: NAVY,
            flex: 1,
          }}
        >
          Settings
        </span>
      </div>

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 0 32px",
        }}
      >
        {/* General */}
        <SettingsSection emoji="⚙️" title="General">
          <SettingRow label="Platform Name" value="Ustaad G" />
          <SettingRow label="Timezone" value="Pakistan (GMT+5)" />
          <SettingRow label="Language" value="English" isLast />
        </SettingsSection>

        {/* User Management */}
        <SettingsSection emoji="👥" title="User Management">
          <SettingRow label="User Registration" value="Open" />
          <SettingRow label="Provider Approval" value="Manual" />
          <SettingRow label="Verification Required" value="Yes" isLast />
        </SettingsSection>

        {/* Platform Fees */}
        <SettingsSection emoji="💰" title="Platform Fees">
          <SettingRow label="Service Fee" value="10%" />
          <SettingRow label="Provider Commission" value="85%" />
          <SettingRow label="Tax Rate" value="13%" isLast />
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection emoji="🔔" title="Notifications">
          <SettingRow
            label="Email Alerts"
            isToggle
            toggleValue={emailAlerts}
            onToggle={() => setEmailAlerts((v) => !v)}
          />
          <SettingRow
            label="SMS Alerts"
            isToggle
            toggleValue={smsAlerts}
            onToggle={() => setSmsAlerts((v) => !v)}
          />
          <SettingRow
            label="Push Notifications"
            isToggle
            toggleValue={pushNotifs}
            onToggle={() => setPushNotifs((v) => !v)}
            isLast
          />
        </SettingsSection>

        {/* Security */}
        <SettingsSection emoji="🔒" title="Security">
          <SettingRow
            label="Two-Factor Auth (2FA)"
            isToggle
            toggleValue={twoFA}
            onToggle={() => setTwoFA((v) => !v)}
          />
          <SettingRow label="Session Timeout" value="30 minutes" />
          <SettingRow label="IP Whitelist" isLink isLast />
        </SettingsSection>

        {/* Admin Accounts */}
        <SettingsSection emoji="👤" title="Admin Accounts">
          <SettingRow label="Sana (Admin)" value="Active" />
          <SettingRow label="Ali (Admin)" value="Active" />
          <SettingRow label="Add Admin →" isLink isLast />
        </SettingsSection>

        {/* Sign Out */}
        <div style={{ marginLeft: 16, marginRight: 16, marginTop: 8 }}>
          <button
            type="button"
            onClick={onSignOut}
            style={{
              width: "100%",
              height: 48,
              borderRadius: 10,
              backgroundColor: "#FFEBEE",
              border: "none",
              color: "#D32F2F",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
