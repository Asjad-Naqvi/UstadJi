import React, { useState, useRef } from "react";
import {
  Search, X, Wrench, Zap, Wind, Hammer,
  Sparkles, Paintbrush, Settings2, Bug, SlidersHorizontal,
} from "lucide-react";
import { HzProviderCard, HzProviderCardData } from "./hz-provider-card";

const NAVY = "#161533";
const BG   = "#FAF8F5";
const BORDER = "#E8E3DB";

/* ── Categories ── */
interface Category {
  id: string;
  label: string;
  Icon: React.FC<{ size: number; color: string }>;
  iconBg: string;
  iconColor: string;
  keywords: string[];
}

const CATEGORIES: Category[] = [
  { id: "all",        label: "All",           Icon: Search,      iconBg: NAVY,      iconColor: "#FFFFFF", keywords: [] },
  { id: "plumbing",   label: "Plumbing",      Icon: Wrench,      iconBg: "#EFF6FF", iconColor: "#3B82F6", keywords: ["plumb","pipe","water","tap","drain"] },
  { id: "electrical", label: "Electrical",    Icon: Zap,         iconBg: "#FFFBEB", iconColor: "#F59E0B", keywords: ["electr","wiring","switch","socket","fan fitting","inverter"] },
  { id: "ac-repair",  label: "AC Repair",     Icon: Wind,        iconBg: "#ECFEFF", iconColor: "#06B6D4", keywords: ["ac","air con","hvac","cooling","gas recharge"] },
  { id: "carpentry",  label: "Carpentry",     Icon: Hammer,      iconBg: "#F5F3FF", iconColor: "#7C3AED", keywords: ["carpent","wood","furniture","cabinet","door fitting","shelving"] },
  { id: "cleaning",   label: "Cleaning",      Icon: Sparkles,    iconBg: "#F0FDF4", iconColor: "#16A34A", keywords: ["clean","sofa","carpet","kitchen","mop"] },
  { id: "painting",   label: "Painting",      Icon: Paintbrush,  iconBg: "#FDF2F8", iconColor: "#DB2777", keywords: ["paint","wall","colour","color","pop","texture"] },
  { id: "appliance",  label: "Appliance",     Icon: Settings2,   iconBg: "#F9FAFB", iconColor: "#6B7280", keywords: ["appliance","fridge","washing","microwave","dishwasher"] },
  { id: "pest",       label: "Pest Control",  Icon: Bug,         iconBg: "#FFF1F2", iconColor: "#E11D48", keywords: ["pest","insect","termite","cockroach","mosquito","rodent"] },
];

/* ── Provider data ── */
const ALL_PROVIDERS: HzProviderCardData[] = [
  { id:"1", name:"Ali Hassan",       initials:"AH", serviceType:"AC Repair & Service",  services:["AC Installation","Gas Recharge","AC Servicing","Split AC"],       rating:4.8, reviewCount:127, completedJobs:127, experience:"5 yrs exp", location:"G-10, G-11, G-13", responseTime:"in ~15 min", price:"PKR 2,500", availability:"available"  },
  { id:"2", name:"Usman Butt",       initials:"UB", serviceType:"Plumbing & Pipework",  services:["Pipe Repair","Tap Fitting","Drainage","Water Tank"],               rating:4.6, reviewCount:89,  completedJobs:89,  experience:"3 yrs exp", location:"F-7, F-8, F-10",  responseTime:"in ~20 min", price:"PKR 1,800", availability:"available"  },
  { id:"3", name:"Rizwan Ahmed",     initials:"RA", serviceType:"Electrical Work",       services:["Wiring","MCB/Fuse","Fan Fitting","Inverter Setup"],                rating:4.9, reviewCount:203, completedJobs:203, experience:"8 yrs exp", location:"I-8, I-10, H-13",  responseTime:"in ~10 min", price:"PKR 2,000", availability:"available"  },
  { id:"4", name:"Babar Khan",       initials:"BK", serviceType:"Carpentry & Woodwork", services:["Furniture Repair","Cabinet Making","Door Fitting","Shelving"],     rating:4.5, reviewCount:64,  completedJobs:64,  experience:"4 yrs exp", location:"E-11, F-11, G-10", responseTime:"in ~30 min", price:"PKR 3,500", availability:"scheduled"  },
  { id:"5", name:"Tariq Mehmood",    initials:"TM", serviceType:"House Painting",        services:["Interior Painting","Exterior Painting","POP Work","Texture Paint"],rating:4.7, reviewCount:41,  completedJobs:41,  experience:"6 yrs exp", location:"D-12, E-11, G-13", responseTime:"in ~25 min", price:"PKR 4,200", availability:"available"  },
  { id:"6", name:"Imran Siddiqui",   initials:"IS", serviceType:"Deep Cleaning",         services:["Sofa Cleaning","Carpet Cleaning","Kitchen Deep Clean","Move-out"], rating:4.4, reviewCount:56,  completedJobs:56,  experience:"2 yrs exp", location:"G-11, G-13, F-7",  responseTime:"in ~20 min", price:"PKR 2,800", availability:"available"  },
  { id:"7", name:"Khalid Rehman",    initials:"KR", serviceType:"Appliance Repair",      services:["Washing Machine","Refrigerator","Microwave","Dishwasher"],         rating:4.6, reviewCount:78,  completedJobs:78,  experience:"7 yrs exp", location:"F-10, F-11, I-8",  responseTime:"in ~35 min", price:"PKR 1,500", availability:"scheduled"  },
  { id:"8", name:"Shahid Qureshi",   initials:"SQ", serviceType:"Pest Control",          services:["Termite Treatment","Cockroach Control","Mosquito Spray","Rodent"], rating:4.3, reviewCount:33,  completedJobs:33,  experience:"3 yrs exp", location:"H-13, G-13, E-11", responseTime:"in ~40 min", price:"PKR 3,000", availability:"available"  },
];

type SortKey = "rating" | "jobs" | "price-asc" | "price-desc";
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "rating",     label: "Top Rated"   },
  { key: "jobs",       label: "Most Booked" },
  { key: "price-asc",  label: "Price: Low"  },
  { key: "price-desc", label: "Price: High" },
];

const parsePrice = (p: string) => parseInt(p.replace(/[^0-9]/g, ""), 10) || 0;

/* ── Main screen ── */
interface HzExploreScreenProps {
  onSelectProvider?: () => void;
}

export const HzExploreScreen: React.FC<HzExploreScreenProps> = ({ onSelectProvider }) => {
  const [search,   setSearch]   = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [sortKey,  setSortKey]  = useState<SortKey>("rating");
  const [showSort, setShowSort] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const catDef = CATEGORIES.find((c) => c.id === activeCat)!;

  const filtered = ALL_PROVIDERS
    .filter((p) => {
      if (activeCat !== "all") {
        const haystack = (p.serviceType + " " + p.services.join(" ")).toLowerCase();
        if (!catDef.keywords.some((kw) => haystack.includes(kw))) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = [p.name, p.serviceType, ...p.services, p.location].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortKey === "rating")     return b.rating - a.rating;
      if (sortKey === "jobs")       return b.completedJobs - a.completedJobs;
      if (sortKey === "price-asc")  return parsePrice(a.price) - parsePrice(b.price);
      if (sortKey === "price-desc") return parsePrice(b.price) - parsePrice(a.price);
      return 0;
    });

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: BG, overflow: "hidden" }}>
      {/* Status bar */}
      <div aria-hidden="true" style={{ height: "24px", flexShrink: 0, backgroundColor: "#FFFFFF" }} />

      {/* Header */}
      <header style={{ backgroundColor: "#FFFFFF", borderBottom: `1px solid ${BORDER}`, padding: "12px 16px 14px", flexShrink: 0 }}>
        <h1 style={{ margin: "0 0 12px", fontFamily: "Inter, sans-serif", fontSize: "20px", fontWeight: 700, lineHeight: "26px", color: "#1A1A1A" }}>
          Find a Service
        </h1>

        {/* Search bar */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "10px", height: "48px", paddingLeft: "14px", paddingRight: "12px", borderRadius: "12px", backgroundColor: BG, border: `1.5px solid ${BORDER}`, cursor: "text" }}
          onClick={() => inputRef.current?.focus()}
        >
          <Search size={18} color="#9B9B9B" aria-hidden="true" style={{ flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="search"
            placeholder="Search providers or services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, border: "none", background: "transparent", fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#1A1A1A", outline: "none" }}
            aria-label="Search providers or services"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} aria-label="Clear search" style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <X size={16} color="#9B9B9B" />
            </button>
          )}
        </div>
      </header>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>

        {/* Category grid */}
        <section aria-label="Browse by category" style={{ padding: "16px 16px 4px" }}>
          <p style={{ margin: "0 0 10px", fontFamily: "Inter, sans-serif", fontSize: "11px", fontWeight: 600, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.7px" }}>
            Browse by Category
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
            {CATEGORIES.map(({ id, label, Icon, iconBg, iconColor }) => {
              const active = activeCat === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveCat(id)}
                  aria-pressed={active}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "10px 4px", borderRadius: "12px", backgroundColor: active ? NAVY : "#FFFFFF", border: active ? `1.5px solid ${NAVY}` : `1px solid ${BORDER}`, cursor: "pointer" }}
                >
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: active ? "rgba(255,255,255,0.15)" : iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={18} color={active ? "#FFFFFF" : iconColor} />
                  </div>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "10px", fontWeight: active ? 600 : 500, color: active ? "#FFFFFF" : "#555555", textAlign: "center", lineHeight: "13px" }}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Results bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 10px" }}>
          <div>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 700, color: "#1A1A1A" }}>
              {activeCat === "all" ? "All Providers" : catDef.label}
            </span>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#9B9B9B", marginLeft: "6px" }}>
              {filtered.length} {filtered.length === 1 ? "provider" : "providers"}
            </span>
          </div>

          {/* Sort dropdown */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setShowSort((s) => !s)}
              aria-expanded={showSort}
              style={{ display: "flex", alignItems: "center", gap: "5px", height: "32px", paddingLeft: "10px", paddingRight: "10px", borderRadius: "8px", backgroundColor: "#FFFFFF", border: `1px solid ${BORDER}`, fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: 500, color: "#555555", cursor: "pointer" }}
            >
              <SlidersHorizontal size={12} color="#555555" aria-hidden="true" />
              {SORT_OPTIONS.find((o) => o.key === sortKey)?.label}
            </button>
            {showSort && (
              <div style={{ position: "absolute", top: "36px", right: 0, zIndex: 20, backgroundColor: "#FFFFFF", borderRadius: "10px", border: `1px solid ${BORDER}`, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", overflow: "hidden", minWidth: "140px" }}>
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => { setSortKey(opt.key); setShowSort(false); }}
                    style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 14px", border: "none", backgroundColor: sortKey === opt.key ? BG : "transparent", fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: sortKey === opt.key ? 600 : 400, color: sortKey === opt.key ? NAVY : "#1A1A1A", cursor: "pointer" }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Provider list / empty state */}
        {filtered.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 32px", gap: "12px", textAlign: "center" }}>
            <div style={{ width: "72px", height: "72px", borderRadius: "20px", backgroundColor: "#F0EDE8", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Search size={32} color="#C4BDB5" aria-hidden="true" />
            </div>
            <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 600, color: "#1A1A1A" }}>No providers found</p>
            <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#9B9B9B", lineHeight: "20px" }}>
              Try a different search or select another category.
            </p>
            <button
              type="button"
              onClick={() => { setSearch(""); setActiveCat("all"); }}
              style={{ marginTop: "4px", height: "40px", paddingLeft: "20px", paddingRight: "20px", borderRadius: "10px", backgroundColor: NAVY, color: "#FFFFFF", border: "none", fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
            >
              Show All Providers
            </button>
          </div>
        ) : (
          <ul aria-label="Service providers" style={{ listStyle: "none", margin: 0, padding: "0 16px 32px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {filtered.map((p) => (
              <li key={p.id}>
                <HzProviderCard {...p} onSelect={onSelectProvider} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
