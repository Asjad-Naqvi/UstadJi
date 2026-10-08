import { ArrowLeft } from "lucide-react";

const NAVY = "#161533";
const GREEN = "#4CAF84";
const BG = "#FAF8F5";
const BORDER = "#E8E3DB";
const ORANGE = "#FF6B35";
const GOLD = "#FFC107";

export function HzAdminLoginScreen({
  onLogin,
  onBackToUserLogin,
}: {
  onLogin?: () => void;
  onBackToUserLogin?: () => void;
}) {
  const labelStyle: React.CSSProperties = {
    fontSize: "11px",
    color: "#9B9B9B",
    fontWeight: 500,
    marginBottom: "4px",
    display: "block",
    fontFamily: "Inter, sans-serif",
  };

  const inputStyle: React.CSSProperties = {
    height: "48px",
    borderRadius: "8px",
    border: `1px solid ${BORDER}`,
    padding: "0 14px",
    fontSize: "15px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "Inter, sans-serif",
    backgroundColor: "#FFFFFF",
  };

  const fieldWrapStyle: React.CSSProperties = {
    marginBottom: "16px",
  };

  return (
    <div
      style={{
        width: "390px",
        height: "844px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
        backgroundColor: BG,
      }}
    >
      {/* Status bar */}
      <div aria-hidden style={{ height: "24px", backgroundColor: "#FFFFFF", flexShrink: 0 }} />

      {/* Header */}
      <div
        style={{
          height: "56px",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #EFEFEF",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          flexShrink: 0,
          position: "relative",
        }}
      >
        <button
          type="button"
          onClick={onBackToUserLogin}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            color: NAVY,
          }}
        >
          <ArrowLeft size={22} color={NAVY} />
        </button>
        <span
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "17px",
            fontWeight: 600,
            color: NAVY,
            fontFamily: "Inter, sans-serif",
          }}
        >
          Admin Login
        </span>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px",
          backgroundColor: BG,
        }}
      >
        {/* Navy card */}
        <div
          style={{
            backgroundColor: NAVY,
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: "36px" }}>🛡️</span>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#FFFFFF",
              marginTop: "10px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Admin Access Only
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.75)",
              marginTop: "6px",
              fontFamily: "Inter, sans-serif",
              lineHeight: "18px",
            }}
          >
            This portal is restricted to authorized administrators
          </div>
        </div>

        {/* Form */}
        <div style={{ marginTop: "24px" }}>
          <div style={fieldWrapStyle}>
            <label style={labelStyle}>Admin Email</label>
            <input
              type="email"
              placeholder="admin@ustadji.com"
              style={inputStyle}
            />
          </div>

          <div style={fieldWrapStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              style={inputStyle}
            />
          </div>

          <div style={fieldWrapStyle}>
            <label style={labelStyle}>2FA Code (if enabled)</label>
            <input
              type="text"
              placeholder="000000"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Login button */}
        <button
          type="button"
          onClick={onLogin}
          style={{
            height: "52px",
            width: "100%",
            marginTop: "24px",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: 700,
            backgroundColor: NAVY,
            color: "#FFFFFF",
            border: "none",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Login to Admin Panel
        </button>

        {/* Back link */}
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <button
            type="button"
            onClick={onBackToUserLogin}
            style={{
              color: "#9B9B9B",
              fontSize: "13px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
            }}
          >
            ← Back to User Login
          </button>
        </div>

        {/* Warning note */}
        <div
          style={{
            marginTop: "32px",
            padding: "12px",
            borderRadius: "8px",
            backgroundColor: "#FFF3CD",
            border: "1px solid #FFB347",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "11px",
              color: "#856404",
              lineHeight: "16px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            ⚠️ All admin actions are logged and audited. Unauthorized access is
            strictly prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}
