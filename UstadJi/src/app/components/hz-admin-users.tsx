import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  Edit2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const NAVY = "#161533";
const GREEN = "#4CAF84";
const BG = "#FAF8F5";
const BORDER = "#E8E3DB";
const ORANGE = "#FF6B35";

type UserStatus = "active" | "pending" | "suspended" | "inactive";
type UserType = "customer" | "provider";
type FilterKey = "all" | "providers" | "customers" | "verified" | "suspended" | "new";

interface User {
  id: string;
  name: string;
  initials: string;
  type: UserType;
  status: UserStatus;
  bookings: number;
  joined: string;
}

const MOCK_USERS: User[] = [
  { id: "u1", name: "Ahmed Khan",   initials: "AK", type: "customer",  status: "active",    bookings: 23,  joined: "Jan 15, 2026" },
  { id: "u2", name: "Usman Tariq",  initials: "UT", type: "provider",  status: "pending",   bookings: 456, joined: "Jan 10, 2026" },
  { id: "u3", name: "Sana Malik",   initials: "SM", type: "customer",  status: "suspended", bookings: 12,  joined: "Jan 5, 2026" },
  { id: "u4", name: "Ali Hassan",   initials: "AH", type: "provider",  status: "active",    bookings: 187, joined: "Dec 20, 2025" },
  { id: "u5", name: "Fatima Zahra", initials: "FZ", type: "customer",  status: "active",    bookings: 8,   joined: "Dec 15, 2025" },
  { id: "u6", name: "Raza Ahmed",   initials: "RA", type: "provider",  status: "active",    bookings: 302, joined: "Dec 10, 2025" },
  { id: "u7", name: "Bilal Khan",   initials: "BK", type: "customer",  status: "inactive",  bookings: 2,   joined: "Nov 30, 2025" },
  { id: "u8", name: "Nida Malik",   initials: "NM", type: "customer",  status: "active",    bookings: 31,  joined: "Nov 25, 2025" },
];

const STATUS_CONFIG: Record<UserStatus, { bg: string; color: string; label: string }> = {
  active:    { bg: "#E8F5E9", color: GREEN,     label: "Active" },
  pending:   { bg: "#FFF3E0", color: ORANGE,    label: "Pending" },
  suspended: { bg: "#FFEBEE", color: "#D32F2F", label: "Suspended" },
  inactive:  { bg: "#F5F5F5", color: "#9B9B9B", label: "Inactive" },
};

const FILTER_CONFIG: Record<FilterKey, string> = {
  all:       "All: 1,234",
  providers: "Providers: 456",
  customers: "Customers: 778",
  verified:  "Verified: 234",
  suspended: "Suspended: 12",
  new:       "New: 67",
};

const FILTER_KEYS = Object.keys(FILTER_CONFIG) as FilterKey[];

export function HzAdminUsersScreen({
  onBack,
  onViewUser,
}: {
  onBack?: () => void;
  onViewUser?: () => void;
}) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  const filteredUsers = MOCK_USERS.filter((user) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      user.name.toLowerCase().includes(query) ||
      `${user.name.split(" ")[0].toLowerCase()}@gmail.com`.includes(query);

    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "providers" && user.type === "provider") ||
      (activeFilter === "customers" && user.type === "customer") ||
      (activeFilter === "verified" && user.status === "active") ||
      (activeFilter === "suspended" && user.status === "suspended") ||
      (activeFilter === "new" && user.status === "active");

    return matchesSearch && matchesFilter;
  });

  const toggleActionMenu = (userId: string) => {
    setShowActionMenu((prev) => (prev === userId ? null : userId));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        backgroundColor: BG,
        overflow: "hidden",
        flex: 1,
        width: 390,
        height: 844,
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* 1. Status bar placeholder */}
      <div
        style={{
          height: 24,
          backgroundColor: "white",
          flexShrink: 0,
        }}
      />

      {/* 2. Header */}
      <div
        style={{
          height: 56,
          backgroundColor: "white",
          borderBottom: "1px solid #EFEFEF",
          display: "flex",
          alignItems: "center",
          paddingLeft: 4,
          paddingRight: 12,
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <ArrowLeft size={24} color="#1A1A1A" />
        </button>
        <span
          style={{
            flex: 1,
            fontSize: 18,
            fontWeight: 700,
            color: NAVY,
            fontFamily: "Inter, sans-serif",
          }}
        >
          User Management
        </span>
        <button
          type="button"
          style={{
            height: 32,
            padding: "0 14px",
            borderRadius: 6,
            backgroundColor: NAVY,
            color: "white",
            fontSize: 12,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Add User
        </button>
      </div>

      {/* 3. Search bar */}
      <div
        style={{
          padding: "10px 16px",
          backgroundColor: "white",
          borderBottom: `1px solid ${BORDER}`,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#F5F5F5",
            borderRadius: 8,
            padding: "0 12px",
            height: 40,
          }}
        >
          <Search size={16} color="#9B9B9B" style={{ marginRight: 8, flexShrink: 0 }} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name, email, phone..."
            style={{
              flex: 1,
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
              fontSize: 14,
              color: "#1A1A1A",
              fontFamily: "Inter, sans-serif",
            }}
          />
        </div>
      </div>

      {/* 4. Filter chips */}
      <div
        style={{
          paddingLeft: 12,
          paddingRight: 12,
          paddingTop: 10,
          paddingBottom: 10,
          backgroundColor: "white",
          borderBottom: `1px solid ${BORDER}`,
          display: "flex",
          gap: 6,
          overflowX: "auto",
          scrollbarWidth: "none",
          flexShrink: 0,
        }}
      >
        {FILTER_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveFilter(key)}
            style={{
              height: 28,
              borderRadius: 14,
              padding: "0 12px",
              fontSize: 11,
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              flexShrink: 0,
              backgroundColor: activeFilter === key ? NAVY : "#F5F5F5",
              color: activeFilter === key ? "white" : "#666666",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {FILTER_CONFIG[key]}
          </button>
        ))}
      </div>

      {/* 5. Summary line */}
      <div
        style={{
          padding: "8px 16px",
          backgroundColor: "white",
          borderBottom: `1px solid ${BORDER}`,
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 11, color: "#9B9B9B", fontFamily: "Inter, sans-serif" }}>
          Showing 1–8 of 1,234 users
        </span>
      </div>

      {/* 6. Table header */}
      <div
        style={{
          display: "flex",
          backgroundColor: "#FAF8F5",
          borderBottom: `1px solid ${BORDER}`,
          padding: "8px 16px",
          flexShrink: 0,
          gap: 8,
        }}
      >
        <span style={{ flex: 2,   fontSize: 11, fontWeight: 600, color: "#9B9B9B", fontFamily: "Inter, sans-serif" }}>User</span>
        <span style={{ flex: 1.5, fontSize: 11, fontWeight: 600, color: "#9B9B9B", fontFamily: "Inter, sans-serif" }}>Type</span>
        <span style={{ flex: 1.5, fontSize: 11, fontWeight: 600, color: "#9B9B9B", fontFamily: "Inter, sans-serif" }}>Status</span>
        <span style={{ flex: 1,   fontSize: 11, fontWeight: 600, color: "#9B9B9B", fontFamily: "Inter, sans-serif" }}>Bookings</span>
        <span style={{ flex: 1,   fontSize: 11, fontWeight: 600, color: "#9B9B9B", fontFamily: "Inter, sans-serif" }}>Actions</span>
      </div>

      {/* 7. Scrollable user list */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {filteredUsers.map((user) => {
          const statusCfg = STATUS_CONFIG[user.status];
          const firstName = user.name.split(" ")[0].toLowerCase();
          const email = `${firstName}@gmail.com`;
          const isMenuOpen = showActionMenu === user.id;

          return (
            <div
              key={user.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 16px",
                gap: 8,
                backgroundColor: "white",
                borderBottom: "1px solid #F5F5F5",
                position: "relative",
              }}
            >
              {/* User col */}
              <div style={{ flex: 2, display: "flex", alignItems: "center", minWidth: 0 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: NAVY,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 8,
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700, color: "white", fontFamily: "Inter, sans-serif" }}>
                    {user.initials}
                  </span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#1A1A1A",
                      fontFamily: "Inter, sans-serif",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {user.name}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#9B9B9B",
                      fontFamily: "Inter, sans-serif",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {email}
                  </div>
                </div>
              </div>

              {/* Type col */}
              <div style={{ flex: 1.5, display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: 10,
                    padding: "2px 8px",
                    borderRadius: 10,
                    fontFamily: "Inter, sans-serif",
                    backgroundColor: user.type === "provider" ? "#E8EAF6" : "#F5F5F5",
                    color: user.type === "provider" ? NAVY : "#666666",
                  }}
                >
                  {user.type === "provider" ? "Provider" : "Customer"}
                </span>
              </div>

              {/* Status col */}
              <div style={{ flex: 1.5, display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: 10,
                    backgroundColor: statusCfg.bg,
                    color: statusCfg.color,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {statusCfg.label}
                </span>
              </div>

              {/* Bookings col */}
              <div
                style={{
                  flex: 1,
                  fontSize: 12,
                  color: "#1A1A1A",
                  textAlign: "center",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {user.bookings}
              </div>

              {/* Actions col */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  gap: 6,
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={onViewUser}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    backgroundColor: "#F5F5F5",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Edit2 size={13} color={NAVY} />
                </button>
                <button
                  type="button"
                  onClick={() => toggleActionMenu(user.id)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    backgroundColor: "#F5F5F5",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MoreVertical size={13} color="#9B9B9B" />
                </button>
              </div>

              {/* Action dropdown */}
              {isMenuOpen && (
                <>
                  <div
                    onClick={() => setShowActionMenu(null)}
                    style={{
                      position: "fixed",
                      inset: 0,
                      zIndex: 19,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      right: 16,
                      top: "100%",
                      zIndex: 20,
                      backgroundColor: "white",
                      borderRadius: 8,
                      border: `1px solid ${BORDER}`,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                      width: 160,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      onClick={() => { onViewUser?.(); setShowActionMenu(null); }}
                      style={{
                        padding: "10px 14px",
                        fontSize: 13,
                        color: "#1A1A1A",
                        borderBottom: "1px solid #F5F5F5",
                        cursor: "pointer",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      View Profile
                    </div>
                    <div
                      onClick={() => setShowActionMenu(null)}
                      style={{
                        padding: "10px 14px",
                        fontSize: 13,
                        color: "#1A1A1A",
                        borderBottom: "1px solid #F5F5F5",
                        cursor: "pointer",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      Edit User
                    </div>
                    {user.type === "provider" && (
                      <div
                        onClick={() => setShowActionMenu(null)}
                        style={{
                          padding: "10px 14px",
                          fontSize: 13,
                          color: "#1A1A1A",
                          borderBottom: "1px solid #F5F5F5",
                          cursor: "pointer",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        Verify Provider
                      </div>
                    )}
                    <div
                      onClick={() => setShowActionMenu(null)}
                      style={{
                        padding: "10px 14px",
                        fontSize: 13,
                        color: "#D32F2F",
                        cursor: "pointer",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      Suspend User
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* 8. Pagination footer */}
      <div
        style={{
          height: 56,
          backgroundColor: "white",
          borderTop: `1px solid ${BORDER}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 16,
          paddingRight: 16,
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          style={{
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <ChevronLeft size={16} color="#9B9B9B" />
        </button>

        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {[1, 2, 3].map((page) => (
            <div
              key={page}
              style={{
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 4,
                fontSize: 12,
                fontFamily: "Inter, sans-serif",
                backgroundColor: page === 1 ? NAVY : "transparent",
                color: page === 1 ? "white" : "#9B9B9B",
                cursor: "pointer",
              }}
            >
              {page}
            </div>
          ))}
          <div
            style={{
              fontSize: 12,
              color: "#9B9B9B",
              fontFamily: "Inter, sans-serif",
              padding: "0 4px",
            }}
          >
            ...
          </div>
          <div
            style={{
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              fontSize: 12,
              color: "#9B9B9B",
              fontFamily: "Inter, sans-serif",
              cursor: "pointer",
            }}
          >
            12
          </div>
        </div>

        <button
          type="button"
          style={{
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <ChevronRight size={16} color="#9B9B9B" />
        </button>
      </div>
    </div>
  );
}
