import React, { useState } from "react";
import { Bell, ChevronDown, MapPin, Search, Wrench, Zap, Wind, Hammer, Sparkles, Paintbrush, Settings2, Bug } from "lucide-react";
import { HzInput } from "./hz-input";
import { HzHeading, HzBody, HzCaption } from "./hz-typography";
import { HzProviderCard, HzProviderCardData } from "./hz-provider-card";

const NAVY   = "#161533";
const BORDER = "#E8E3DB";

/* ── Icon categories ── */
interface Category {
  id: string;
  label: string;
  Icon: React.FC<{ size: number; color: string }>;
  iconBg: string;
  iconColor: string;
  keywords: string[];
}

const CATEGORIES: Category[] = [
  { id: "all",        label: "All",          Icon: Search,     iconBg: NAVY,      iconColor: "#FFFFFF", keywords: [] },
  { id: "plumbing",   label: "Plumbing",     Icon: Wrench,     iconBg: "#EFF6FF", iconColor: "#3B82F6", keywords: ["plumb","pipe","water","tap","drain"] },
  { id: "electrical", label: "Electrical",   Icon: Zap,        iconBg: "#FFFBEB", iconColor: "#F59E0B", keywords: ["electr","wiring","switch","socket","fan fitting","inverter"] },
  { id: "ac-repair",  label: "AC Repair",    Icon: Wind,       iconBg: "#ECFEFF", iconColor: "#06B6D4", keywords: ["ac","air con","hvac","cooling","gas recharge"] },
  { id: "carpentry",  label: "Carpentry",    Icon: Hammer,     iconBg: "#F5F3FF", iconColor: "#7C3AED", keywords: ["carpent","wood","furniture","cabinet","shelving"] },
  { id: "cleaning",   label: "Cleaning",     Icon: Sparkles,   iconBg: "#F0FDF4", iconColor: "#16A34A", keywords: ["clean","sofa","carpet","kitchen","mop"] },
  { id: "painting",   label: "Painting",     Icon: Paintbrush, iconBg: "#FDF2F8", iconColor: "#DB2777", keywords: ["paint","wall","colour","color","pop","texture"] },
  { id: "appliance",  label: "Appliance",    Icon: Settings2,  iconBg: "#F9FAFB", iconColor: "#6B7280", keywords: ["appliance","fridge","washing","microwave","dishwasher"] },
  { id: "pest",       label: "Pest Control", Icon: Bug,        iconBg: "#FFF1F2", iconColor: "#E11D48", keywords: ["pest","insect","termite","cockroach","mosquito","rodent"] },
];

/* ── Provider data ── */
const PROVIDERS: HzProviderCardData[] = [
  { id:"1", name:"Ali Hassan",     initials:"AH", serviceType:"AC Repair & Service",  services:["AC Installation","Gas Recharge","AC Servicing","Split AC"],        rating:4.8, reviewCount:127, completedJobs:127, experience:"5 yrs exp", location:"G-10, G-11, G-13", responseTime:"in ~15 min", price:"PKR 2,500", availability:"available"  },
  { id:"2", name:"Usman Butt",     initials:"UB", serviceType:"Plumbing & Pipework",  services:["Pipe Repair","Tap Fitting","Drainage","Water Tank"],                rating:4.6, reviewCount:89,  completedJobs:89,  experience:"3 yrs exp", location:"F-7, F-8, F-10",  responseTime:"in ~20 min", price:"PKR 1,800", availability:"available"  },
  { id:"3", name:"Rizwan Ahmed",   initials:"RA", serviceType:"Electrical Work",       services:["Wiring","MCB/Fuse","Fan Fitting","Inverter Setup"],                 rating:4.9, reviewCount:203, completedJobs:203, experience:"8 yrs exp", location:"I-8, I-10, H-13",  responseTime:"in ~10 min", price:"PKR 2,000", availability:"available"  },
  { id:"4", name:"Babar Khan",     initials:"BK", serviceType:"Carpentry & Woodwork", services:["Furniture Repair","Cabinet Making","Door Fitting","Shelving"],      rating:4.5, reviewCount:64,  completedJobs:64,  experience:"4 yrs exp", location:"E-11, F-11, G-10", responseTime:"in ~30 min", price:"PKR 3,500", availability:"scheduled"  },
  { id:"5", name:"Tariq Mehmood",  initials:"TM", serviceType:"House Painting",        services:["Interior Painting","Exterior Painting","POP Work","Texture Paint"], rating:4.7, reviewCount:41,  completedJobs:41,  experience:"6 yrs exp", location:"D-12, E-11, G-13", responseTime:"in ~25 min", price:"PKR 4,200", availability:"available"  },
  { id:"6", name:"Imran Siddiqui", initials:"IS", serviceType:"Deep Cleaning",         services:["Sofa Cleaning","Carpet Cleaning","Kitchen Deep Clean","Move-out"],  rating:4.4, reviewCount:56,  completedJobs:56,  experience:"2 yrs exp", location:"G-11, G-13, F-7",  responseTime:"in ~20 min", price:"PKR 2,800", availability:"available"  },
  { id:"7", name:"Khalid Rehman",  initials:"KR", serviceType:"Appliance Repair",      services:["Washing Machine","Refrigerator","Microwave","Dishwasher"],          rating:4.6, reviewCount:78,  completedJobs:78,  experience:"7 yrs exp", location:"F-10, F-11, I-8",  responseTime:"in ~35 min", price:"PKR 1,500", availability:"scheduled"  },
  { id:"8", name:"Shahid Qureshi", initials:"SQ", serviceType:"Pest Control",          services:["Termite Treatment","Cockroach Control","Mosquito Spray","Rodent"],  rating:4.3, reviewCount:33,  completedJobs:33,  experience:"3 yrs exp", location:"H-13, G-13, E-11", responseTime:"in ~40 min", price:"PKR 3,000", availability:"available"  },
];

/* ── Props ── */
interface HzHomeScreenProps {
  onSelectProvider?: () => void;
}

export const HzHomeScreen: React.FC<HzHomeScreenProps> = ({ onSelectProvider }) => {
  const [activeCat,    setActiveCat]    = useState("all");
  const [searchValue,  setSearchValue]  = useState("");

  const catDef = CATEGORIES.find((c) => c.id === activeCat)!;

  const filtered = PROVIDERS.filter((p) => {
    if (activeCat !== "all") {
      const hay = (p.serviceType + " " + p.services.join(" ")).toLowerCase();
      if (!catDef.keywords.some((kw) => hay.includes(kw))) return false;
    }
    if (searchValue.trim()) {
      const q = searchValue.toLowerCase();
      const hay = [p.name, p.serviceType, ...p.services, p.location].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#FAF8F5", overflowY: "auto", overflowX: "hidden" }}>

      {/* ── Header ── */}
      <header style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #EFEFEF", padding: "16px 16px 12px", flexShrink: 0 }}>
        {/* Location row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <button
            type="button"
            aria-label="Change location: G-13, Islamabad"
            style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", padding: 0, minHeight: "48px" }}
          >
            <MapPin size={16} color={NAVY} aria-hidden="true" />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <HzCaption style={{ color: "#9B9B9B" }}>Your location</HzCaption>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 600, lineHeight: "22px", color: "#1A1A1A" }}>G-13, Islamabad</span>
                <ChevronDown size={14} color="#9B9B9B" aria-hidden="true" />
              </div>
            </div>
          </button>
          <button
            type="button"
            aria-label="Notifications"
            style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "#FAF8F5", border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", minWidth: "48px", minHeight: "48px" }}
          >
            <Bell size={20} color="#1A1A1A" aria-hidden="true" />
          </button>
        </div>

        {/* Greeting */}
        <HzHeading as="h1" style={{ marginBottom: "4px" }}>Good morning, Ali 👋</HzHeading>
        <HzBody style={{ color: "#9B9B9B", marginBottom: "16px" }}>What service do you need today?</HzBody>

        {/* Search */}
        <HzInput
          placeholder="Search providers or services..."
          value={searchValue}
          onChange={setSearchValue}
          leadingIcon={<Search size={18} />}
          aria-label="Search providers or services"
        />
      </header>

      {/* ── Icon category chips ── */}
      <div
        role="group"
        aria-label="Filter by service category"
        style={{ display: "flex", gap: "8px", padding: "14px 16px 4px", overflowX: "auto", scrollbarWidth: "none", flexShrink: 0 }}
      >
        {CATEGORIES.map(({ id, label, Icon, iconBg, iconColor }) => {
          const active = activeCat === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveCat(id)}
              aria-pressed={active}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", height: "36px", paddingLeft: "10px", paddingRight: "14px", borderRadius: "20px", flexShrink: 0, backgroundColor: active ? NAVY : "#FFFFFF", border: active ? `1.5px solid ${NAVY}` : `1px solid ${BORDER}`, cursor: "pointer" }}
            >
              <div style={{ width: "22px", height: "22px", borderRadius: "6px", backgroundColor: active ? "rgba(255,255,255,0.18)" : iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={13} color={active ? "#FFFFFF" : iconColor} />
              </div>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: active ? 600 : 500, color: active ? "#FFFFFF" : "#555555", whiteSpace: "nowrap" }}>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Provider list ── */}
      <main style={{ flex: 1, padding: "10px 16px 24px" }}>
        <div style={{ marginTop: "10px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 700, lineHeight: "22px", color: "#1A1A1A" }}>
            {activeCat === "all" && !searchValue.trim() ? "Popular Near You" : "Results"}
          </span>
          {filtered.length > 0 && (
            <HzCaption>{filtered.length} {filtered.length === 1 ? "provider" : "providers"}</HzCaption>
          )}
        </div>

        {filtered.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 24px", gap: "12px", textAlign: "center" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "18px", backgroundColor: "#F0EDE8", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Search size={28} color="#C4BDB5" aria-hidden="true" />
            </div>
            <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "15px", fontWeight: 600, color: "#1A1A1A" }}>No providers found</p>
            <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: "13px", color: "#9B9B9B", lineHeight: "18px" }}>
              Try a different search or select another category.
            </p>
            <button
              type="button"
              onClick={() => { setSearchValue(""); setActiveCat("all"); }}
              style={{ marginTop: "4px", height: "38px", paddingLeft: "20px", paddingRight: "20px", borderRadius: "10px", backgroundColor: NAVY, color: "#FFFFFF", border: "none", fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
            >
              Show All
            </button>
          </div>
        ) : (
          <ul aria-label="Service providers" style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
            {filtered.map((p) => (
              <li key={p.id}>
                <HzProviderCard {...p} onSelect={onSelectProvider} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};
