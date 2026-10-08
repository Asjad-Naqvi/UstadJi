SECTION 1: ANALYSIS OF EXISTING FEATURES IN PROTOTYPE
Already Implemented (Skip):
Google Maps View - Already exists as a tab in provider results

Map Integration - Basic map display is already in prototype

Provider Location - Providers are shown on map

Tab Navigation - Switching between list and map view exists

What's Missing (Need to Add):
Heatmap Overlay - Color gradient showing demand intensity

Demand Zones - Areas with active customer requests

Color Legend - Explaining heatmap colors

Customer Request List - Showing customers in selected demand zone

Provider Action - Accept request from heatmap

Demand Indicators - Number of requests per area

Real-time Updates - Live demand changes

SECTION 2: MODIFICATIONS TO EXISTING SCREENS
SCREEN 1: Provider Results - Google Maps Tab Enhancement
Location: hz-provider-results-screen.tsx → Google Maps Tab

Current: Visual only map with basic provider pins

Changes to Add:

A. Heatmap Overlay on Map
Add New Layer Above Map:

Heatmap Intensity Colors

No Demand: Transparent (no color)

Low Demand: Light Yellow (#FFF3CD) - 10-30% opacity

Medium Demand: Orange (#FFB347) - 30-60% opacity

High Demand: Red-Orange (#FF6B35) - 60-80% opacity

Very High Demand: Deep Red (#D32F2F) - 80-100% opacity

Heatmap Generation

Smooth gradient transitions between zones

Circular radius around each demand point (2km radius)

Blur effect for natural blending

Opacity based on request count

Demand Zone Labels

Area name displayed on map

Example: "G-13" with small badge showing request count

Font: Inter Bold, size: 11px, color: white, background: navy pill

B. Map Controls & Legend
Add Controls (Top Right Corner):

1. Layer Toggle Button

Icon: Layers (stacked squares)

Position: Top right (below zoom controls)

Size: 40x40px

Background: #FFFFFF, shadow: 0px 2px 8px rgba(0,0,0,0.1)

Border-radius: 8px

On tap: Opens layer selector modal

2. Legend Toggle Button

Icon: Color palette or info (i)

Position: Bottom right (above provider location)

Size: 40x40px

Background: #FFFFFF, shadow: 0px 2px 8px rgba(0,0,0,0.1)

Border-radius: 8px

On tap: Shows/hides color legend

C. Color Legend (Bottom Left)
Legend Card (Collapsible):

Background: #FFFFFF (80% opacity)

Border-radius: 8px

Padding: 12px

Shadow: 0px 2px 8px rgba(0,0,0,0.1)

Max Width: 160px

Content:

Title: "Demand Level" (font: Inter Bold, size: 12px, color: #161533)

Color Bars (Vertical gradient):

Color	Label	Request Count
🔴 Deep Red	Very High	20+ requests
🟠 Red-Orange	High	10-19 requests
🟡 Orange	Medium	5-9 requests
🟢 Yellow	Low	1-4 requests
⚪ Transparent	No Demand	0 requests
Each Bar:

Height: 20px

Width: 100% (full legend width)

Left: Color swatch (16x16px, rounded)

Center: Label (font: Inter Regular, size: 10px, color: #666666)

Right: Count range (font: Inter Regular, size: 10px, color: #9B9B9B)

Toggle Arrow:

Bottom of legend: "▼ Hide" or "▲ Show"

Font: Inter Regular, size: 10px, color: #9B9B9B

D. Demand Zone Interaction
When User Taps a Demand Zone:

1. Zone Highlights:

Border pulse animation on selected zone

Color intensifies slightly

"X requests in this area" label appears

2. Bottom Sheet Appears (40% height):

Slides up from bottom

Rounded top corners (16px)

Background: #FFFFFF

Drag handle at top

Content (Bottom Sheet):

Header:

Area name: "G-13, Islamabad" (font: Inter Bold, size: 16px, color: #161533)

Demand level badge: "High Demand" (background: #FF6B35, text white, padding: 4px 12px, border-radius: 12px)

"3 customers need service" (font: Inter Regular, size: 13px, color: #666666)

Close button (X) top right

Customer Request List:

Customer Request Card (each):

text
┌─────────────────────────────────────────────────┐
│  [Avatar]  Ahmed Khan                          │
│  ⭐ 4.8 · 5 requests today                    │
│  ────────────────────────────────────────────  │
│  Service: AC Repair                            │
│  Distance: 2.5 km from you                     │
│  Urgency: Emergency ⚡                         │
│  Time: Within 2 hours                         │
│  ────────────────────────────────────────────  │
│  [Accept Request]  [View Details]             │
└─────────────────────────────────────────────────┘
Card Details:

Customer avatar (circle, 40px)

Customer name (font: Inter Bold, size: 14px)

Customer rating (font: Inter Regular, size: 12px, color: #666666)

Service type (font: Inter Regular, size: 13px)

Distance from provider (font: Inter Regular, size: 12px, color: #666666)

Urgency badge (if emergency)

Time requirement (font: Inter Regular, size: 12px, color: #666666)

Two buttons:

"Accept Request" (primary, background #161533, text white, border-radius: 6px)

"View Details" (secondary, transparent, border 1px #E8E3DB)

Request Count Badge:

On each customer card: Small badge showing how many requests they've made today

Background: #EEEEF5, text: #161533, padding: 2px 8px, border-radius: 10px

E. Provider Location & Status
Add Provider Location Indicator:

Blue dot on map showing provider's current location

Pulsing ring around dot

Label: "You are here" (font: Inter Regular, size: 10px, color: #161533)

Add "Accept & Navigate" Action:

When provider taps "Accept Request":

Modal appears: "Accept this request? You will travel 2.5 km"

Buttons: [Accept & Navigate] [Cancel]

On accept: Provider moves to active job flow

SCREEN 2: Provider Dashboard Enhancement
Location: hz-provider-dashboard.tsx

Changes to Add:

A. Demand Alert Banner
Add at Top (Below Stats):

Banner (if provider is near high demand area):

Background: #FF6B35 (or gradient)

Border-radius: 8px

Padding: 12px

Margin: 0 16px

Content:

Left: Fire icon (🔥)

Center: "High demand in G-13! 5 customers waiting" (font: Inter Bold, size: 13px, color: white)

Right: "View →" (font: Inter Bold, size: 12px, color: white)

On tap: Navigates to heatmap tab

Banner (if provider is far from demand):

Background: #FFF3CD (light yellow)

Content: "Customers are looking in G-13. Travel to find work!" (font: Inter Regular, size: 12px, color: #856404)

Button: "View on Map →" (font: Inter Bold, size: 12px, color: #856404)

B. Quick Actions Enhancement
Add New Quick Action:

"View Demand Map" (icon: Map with heat)

Position: In quick actions section

Action: Navigates to provider results → Google Maps tab with heatmap active

SCREEN 3: Chat Screen Enhancement
Location: hz-chat-screen.tsx

Add Demand Indicator:

When provider is viewing chat

Small pill at top: "🔥 5 customers waiting nearby"

Background: #FF6B35, text white

On tap: Navigates to heatmap

SECTION 3: NEW SCREENS TO ADD
SCREEN 1: Full Screen Heatmap View
File Name: hz-heatmap-view-screen.tsx
Navigation: From provider dashboard quick action or demand banner

Design Requirements:

Full Screen Layout (390 x 844):

A. Header Section (60px)
Left:

Back arrow (←) - navigates back to dashboard

Title: "Demand Map" (font: Inter Bold, size: 18px, color: #161533)

Right:

"Refresh" icon (circular arrow)

"Live" badge (pulsing green dot + text "Live")

Font: Inter Bold, size: 10px, color: #4CAF84

B. Map Area (Main Content)
Full map with heatmap overlay:

Heatmap Layers:

Base Map: Google Maps (existing)

Heatmap Overlay: Colored gradient (see section 2A)

Demand Zone Labels: Area names with request counts

Provider Location: Blue dot with pulsing ring

Interactive Elements:

Tap zone → Bottom sheet opens (see section 2D)

Long press → Shows demand details for that point

Pinch to zoom → Heatmap adjusts granularity

C. Filter Bar (Above Map)
Horizontal Filter Chips:

text
[All Services] [AC Repair] [Plumbing] [Electrical] [Cleaning] [Carpentry]
Chip Design:

Active: Background #161533, text white

Inactive: Background #F5F5F5, text #666666

Height: 32px, border-radius: 16px

Padding: 0 16px

Horizontal scrollable

Function: Filter heatmap by service category

D. Demand Stats Bar (Below Map)
Horizontal Stats Cards:

text
┌──────────┬──────────┬──────────┬──────────┐
│ Total     │ High      │ Medium    │ Low       │
│ Requests  │ Demand    │ Demand    │ Demand    │
│ 47        │ 3 Areas   │ 5 Areas   │ 8 Areas   │
└──────────┴──────────┴──────────┴──────────┘
Each Card:

Width: 25% (4 cards in row)

Background: #FFFFFF, border-radius: 6px

Padding: 8px 4px

Border: 1px solid #E8E3DB

Content:

Top: Stat number (font: Inter Bold, size: 16px, color: #161533)

Bottom: Label (font: Inter Regular, size: 9px, color: #9B9B9B)

Icon: Small color indicator (circle) for each stat

E. Legend Toggle
Floating Legend Button:

Position: Bottom right corner

Icon: Info (i) or color palette

Background: #FFFFFF, shadow

Border-radius: 8px

On tap: Shows/hides color legend

SCREEN 2: Demand Zone Detail View
File Name: hz-demand-zone-detail-screen.tsx
Navigation: From heatmap tap → bottom sheet → "View All" or full screen view

Design Requirements:

Full Screen Layout (390 x 844):

A. Header Section (60px)
Left:

Back arrow (←) - navigates back to heatmap

Title: "G-13, Islamabad" (font: Inter Bold, size: 18px, color: #161533)

Right:

Demand badge: "High Demand" (background: #FF6B35, text white, padding: 4px 12px, border-radius: 12px)

Font: Inter Bold, size: 11px

B. Zone Summary Card
Card (top section):

Background: #FAF8F5

Border-radius: 8px

Padding: 16px

Border: 1px solid #E8E3DB

Content:

Row 1: "🔥 12 active requests" (font: Inter Bold, size: 14px, color: #161533)

Row 2: "5 providers in area" (font: Inter Regular, size: 13px, color: #666666)

Row 3: "Last updated: 2 min ago" (font: Inter Regular, size: 11px, color: #9B9B9B)

Progress bar: Showing demand intensity (filled based on requests)

C. Service Breakdown
Horizontal Chips:

text
[AC Repair: 4] [Plumbing: 3] [Electrical: 2] [Cleaning: 2] [Carpentry: 1]
Chip Design:

Background: #FFFFFF, border: 1px solid #E8E3DB

Padding: 8px 12px

Border-radius: 16px

Font: Inter Regular, size: 11px, color: #1A1A1A

Number badge: Background #EEEEF5, color #161533

D. Customer Request List
List of Customers (scrollable):

Customer Request Card (full width):

text
┌─────────────────────────────────────────────────┐
│  [Avatar]  Ahmed Khan                          │
│  4.8 ★ · 5 requests today                     │
│  ────────────────────────────────────────────  │
│  Service: AC Repair                            │
│  Location: Street 5, G-13                      │
│  Distance: 2.5 km from you                     │
│  Urgency: ⚡ Emergency (within 1 hour)         │
│  ────────────────────────────────────────────  │
│  [Accept Request]  [View Profile]             │
└─────────────────────────────────────────────────┘
Card Details:

Customer avatar (circle, 48px)

Customer name (font: Inter Bold, size: 15px)

Rating: 4.8 ★ (font: Inter Bold, size: 13px, color: #161533)

"5 requests today" (font: Inter Regular, size: 11px, color: #9B9B9B)

Service type (font: Inter Regular, size: 13px, color: #1A1A1A)

Location (font: Inter Regular, size: 12px, color: #666666)

Distance (font: Inter Regular, size: 12px, color: #666666)

Urgency badge (if emergency)

Buttons:

"Accept Request" (primary, background #161533, text white, border-radius: 6px)

"View Profile" (secondary, transparent, border 1px #E8E3DB)

Card States:

New request: Navy border left (4px)

Viewed: No border

Expired: Greyed out (50% opacity)

E. Quick Filters (Top of List)
Filter Chips:

text
[All: 12] [Emergency: 4] [Nearby: 5] [Urgent: 3]
Chip Design:

Active: Background #161533, text white

Inactive: Background #F5F5F5, text #666666

Height: 28px, border-radius: 14px

Padding: 0 12px

F. Empty State
When No Customers in Zone:

Icon: Person with question mark

Text: "No customers currently requesting in this area" (font: Inter Regular, size: 14px, color: #666666)

Subtext: "Check nearby areas or come back later" (font: Inter Regular, size: 12px, color: #9B9B9B)

Button: "View Nearby Areas →" (font: Inter Bold, size: 13px, color: #161533)

SCREEN 3: Accept Request Confirmation
File Name: hz-accept-request-modal.tsx
Navigation: Tapping "Accept Request" from any customer card

Design Requirements:

Centered Modal:

Width: 90% of screen

Background: #FFFFFF

Border-radius: 16px

Overlay: rgba(0,0,0,0.5)

Content:

Header:

"Accept Customer Request" (font: Inter Bold, size: 18px, color: #161533)

Close icon (X) top right

Customer Summary:

Customer avatar (large, 60px)

Customer name: "Ahmed Khan" (font: Inter Bold, size: 16px)

Service: "AC Repair" (font: Inter Regular, size: 14px, color: #666666)

Details Card:

"Distance: 2.5 km" (font: Inter Regular, size: 14px)

"Estimated travel: 12 mins" (font: Inter Regular, size: 14px)

"Service time: 1-2 hours" (font: Inter Regular, size: 14px)

"Earnings: PKR 2,500" (font: Inter Bold, size: 14px, color: #4CAF84)

Acceptance Note:

"By accepting, you agree to travel to the customer's location and complete the service" (font: Inter Regular, size: 11px, color: #9B9B9B)

Checkbox: "I understand and agree" (font: Inter Regular, size: 12px, color: #1A1A1A)

Action Buttons:

Primary: "Accept & Navigate →" (background: #161533, text white, border-radius: 8px)

Secondary: "Cancel" (text button, font: Inter Regular, size: 14px, color: #9B9B9B)

On Accept:

Navigates to provider-active-job screen

Booking is created automatically

Customer is notified

SECTION 4: NEW SHARED COMPONENTS
COMPONENT 1: HzHeatmapLayer
Purpose: Generate heatmap overlay on map

Props:

text
{
  demandData: DemandPoint[];
  colorScheme: 'default' | 'dark' | 'light';
  opacity: number;
  onZoneTap: (zoneId: string) => void;
}
Design:

Canvas-based heatmap generation

Smooth gradient transitions

Pulsing effect on high demand areas

COMPONENT 2: HzDemandZone
Purpose: Display demand zone on map

Props:

text
{
  zoneId: string;
  name: string;
  requestCount: number;
  intensity: 'low' | 'medium' | 'high' | 'very-high';
  isSelected: boolean;
  onTap: () => void;
}
Design:

Colored area with blur

Label with request count

Pulse animation when selected

COMPONENT 3: HzCustomerRequestCard
Purpose: Display customer in demand zone

Props:

text
{
  customerName: string;
  rating: number;
  serviceType: string;
  location: string;
  distance: string;
  urgency: boolean;
  requestCount: number;
  onAccept: () => void;
  onViewProfile: () => void;
}
Design:

Card layout with avatar, details, and actions

Emergency badge for urgent requests

Distance indicator

COMPONENT 4: HzDemandLegend
Purpose: Color legend for heatmap

Props:

text
{
  isVisible: boolean;
  onToggle: () => void;
}
Design:

Compact legend with color gradients

Expandable/collapsible

Touch-friendly

COMPONENT 5: HzDemandStats
Purpose: Display demand statistics

Props:

text
{
  totalRequests: number;
  highDemandAreas: number;
  mediumDemandAreas: number;
  lowDemandAreas: number;
}
Design:

Horizontal stats cards

Each stat with icon and number

SECTION 5: NEW MODALS
MODAL 1: Service Filter Modal
File: hz-service-filter-modal.tsx

Trigger: Tapping filter bar on heatmap

Design:

Bottom sheet (60% height)

Rounded top corners

Background: #FFFFFF

Content:

Header: "Filter Services" (font: Inter Bold, size: 16px)

List of services with toggle switches

AC Repair

Plumbing

Electrical

Cleaning

Carpentry

Painting

Appliance Repair

"Select All" / "Clear All" buttons

Footer: "Apply Filters" button

MODAL 2: Zone Detail Bottom Sheet
File: hz-zone-detail-bottom-sheet.tsx

Trigger: Tapping demand zone on heatmap

Design:

Bottom sheet (40-50% height)

Rounded top corners

Background: #FFFFFF

Drag handle at top

Content:

Zone name and demand level

Request count and service breakdown

Top 3 customer requests (mini cards)

"View All Requests →" link

Close button

MODAL 3: Layer Selector
File: hz-layer-selector-modal.tsx

Trigger: Tapping layers button on heatmap

Design:

Bottom sheet (30% height)

Rounded top corners

Background: #FFFFFF

Content:

Header: "Map Layers" (font: Inter Bold, size: 16px)

Layer options with toggles:

"Heatmap" (default: ON)

"Providers" (default: ON)

"Demand Zones" (default: ON)

"Traffic" (default: OFF)

Footer: "Apply" button

SECTION 6: NAVIGATION FLOW
Complete Navigation with Heatmap Feature:
text
provider-dashboard
    │
    ├── [Demand Alert Banner] → heatmap-view
    │
    ├── [Quick Action: View Demand Map] → heatmap-view
    │
    └── [Chat] → chat-screen
                   └── [Demand Indicator] → heatmap-view

heatmap-view (NEW)
    │
    ├── [Service Filter] → service-filter-modal
    │                        └── [Apply] → heatmap-view (filtered)
    │
    ├── [Demand Zone Tap] → zone-detail-bottom-sheet
    │                        │
    │                        ├── [View All Requests] → demand-zone-detail (NEW)
    │                        │
    │                        └── [Accept Request] → accept-request-modal
    │                                                 └── [Accept] → provider-active-job
    │
    ├── [Layer Toggle] → layer-selector-modal
    │                     └── [Apply] → heatmap-view (layers updated)
    │
    ├── [Legend Toggle] → Shows/hides legend
    │
    └── [Refresh] → Reloads demand data

demand-zone-detail (NEW)
    │
    ├── [Customer Card] → accept-request-modal
    │                      └── [Accept] → provider-active-job
    │
    ├── [View Profile] → provider-profile
    │
    ├── [Filter Chips] → demand-zone-detail (filtered)
    │
    └── [Back] → heatmap-view

accept-request-modal (NEW)
    │
    ├── [Accept & Navigate] → provider-active-job
    │
    └── [Cancel] → dismiss modal
SECTION 7: DATA STRUCTURE FOR HEATMAP
Demand Data Types:
typescript
interface DemandPoint {
  id: string;
  latitude: number;
  longitude: number;
  serviceType: string;
  urgency: 'normal' | 'emergency';
  timestamp: Date;
}

interface DemandZone {
  id: string;
  name: string;
  centerLatitude: number;
  centerLongitude: number;
  radius: number; // km
  requestCount: number;
  intensity: 'low' | 'medium' | 'high' | 'very-high';
  services: {
    serviceType: string;
    count: number;
  }[];
  customers: CustomerRequest[];
}

interface CustomerRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  serviceType: string;
  location: string;
  latitude: number;
  longitude: number;
  distanceFromProvider: number; // km
  urgency: boolean;
  timeRequired: string;
  requestCount: number; // today
  createdAt: Date;
  expiresAt: Date;
}
Mock Demand Data:
Zone: G-13, Islamabad

Total Requests: 12

Intensity: High

Services: AC Repair (4), Plumbing (3), Electrical (2), Cleaning (2), Carpentry (1)

Zone: F-10, Islamabad

Total Requests: 8

Intensity: Medium

Services: Electrical (3), Cleaning (2), Plumbing (2), AC Repair (1)

Zone: I-8, Islamabad

Total Requests: 5

Intensity: Medium

Services: Plumbing (2), Cleaning (2), Carpentry (1)

Zone: G-10, Islamabad

Total Requests: 3

Intensity: Low

Services: AC Repair (2), Plumbing (1)

SECTION 8: UI TEXT COPY
Labels and Messages:
English	Urdu
Demand Map	ڈیمانڈ کا نقشہ
Live	براہ راست
High Demand	زیادہ ڈیمانڈ
Medium Demand	درمیانی ڈیمانڈ
Low Demand	کم ڈیمانڈ
Very High Demand	بہت زیادہ ڈیمانڈ
Total Requests	کل درخواستیں
Active Requests	فعال درخواستیں
Customers Waiting	گاہک منتظر
Accept Request	درخواست قبول کریں
View Profile	پروفائل دیکھیں
Emergency	ایمرجنسی
Distance from you	آپ سے فاصلہ
Estimated travel	تخمینی سفر
Earnings	کمائی
Filter Services	خدمات فلٹر کریں
All Services	تمام خدمات
Nearby	قریب
Urgent	فوری
Accept & Navigate	قبول کریں اور جائیں
No customers currently	فی الحال کوئی گاہک نہیں
Check nearby areas	قریبی علاقے چیک کریں
View Nearby Areas	قریبی علاقے دیکھیں
SECTION 9: ANIMATION REQUIREMENTS
Map Animations:
Heatmap Load:

Gradient appears gradually (fade-in)

Smooth transition from transparent to colored

Demand Pulse:

High demand areas pulse (scale 1.0 → 1.05 → 1.0)

Duration: 2 seconds

Continuous loop

Zone Selection:

Border pulse animation

Highlight glow effect

Bottom sheet slides up smoothly

Request Count Update:

Number counter animation

Badge updates with bounce

Accept Request:

Card highlights green (success)

Confetti or checkmark animation

Smooth transition to active job

SECTION 10: INTERACTION STATES
Heatmap Interactions:
Action	Result
Pinch to Zoom	Heatmap granularity adjusts
Tap Zone	Bottom sheet appears
Tap Customer Card	Accept request modal opens
Long Press Map	Show demand details popup
Swipe Up on Bottom Sheet	Expands to full screen
Swipe Down on Bottom Sheet	Closes bottom sheet
Tap Legend	Toggle legend visibility
Tap Layers Button	Open layer selector modal
Tap Refresh	Animated reload of demand data
Zone Detail Interactions:
Action	Result
Tap Customer	Open accept request modal
Tap View Profile	Navigate to provider profile
Tap Filter Chip	Filter list by service
Swipe to Refresh	Reload customer list
Tap Back	Return to heatmap
SECTION 11: IMPLEMENTATION NOTES
Backend Integration:
Real-time Updates:

WebSocket connection for live demand updates

Push notifications when new requests appear nearby

Cache demand data for 1 minute

Geolocation:

Use provider's current location

Calculate distance to each demand zone

Sort zones by distance and demand intensity

Request Management:

When provider accepts request → booking created

Customer receives notification

Request removed from heatmap (or marked inactive)

Performance Considerations:
Heatmap Rendering:

Use canvas for performance

Limit to 1000 demand points

Aggregate points in clusters

Data Updates:

Poll every 30 seconds for new requests

WebSocket for real-time updates

Optimistic UI updates

Memory Management:

Unload data when tab is inactive

Cache only visible zones

SECTION 12: FIGMA HANDOFF CHECKLIST
Modified Screens (3):
□ hz-provider-results-screen.tsx (Google Maps tab with heatmap)
□ hz-provider-dashboard.tsx (Demand alert banner, quick action)
□ hz-chat-screen.tsx (Demand indicator pill)
New Screens (3):
□ hz-heatmap-view-screen.tsx (Full screen heatmap)
□ hz-demand-zone-detail-screen.tsx (Customer list in zone)
□ hz-accept-request-modal.tsx (Confirmation modal)
New Components (5):
□ HzHeatmapLayer (Canvas heatmap)
□ HzDemandZone (Zone display on map)
□ HzCustomerRequestCard (Customer card in list)
□ HzDemandLegend (Color legend)
□ HzDemandStats (Stats cards)
New Modals (3):
□ hz-service-filter-modal.tsx
□ hz-zone-detail-bottom-sheet.tsx
□ hz-layer-selector-modal.tsx
Assets Needed:
□ Map icons (layers, legend, refresh)
□ Heatmap color gradient assets
□ Emergency badge icon
□ Demand level icons (fire, etc.)
□ Empty state illustrations
Design Deliverables:
□ All screens at 390x844
□ Heatmap color palette defined
□ Interaction prototypes for zone taps
□ Animation specs for map interactions
□ Redline specs for spacing
□ Component variants (states: loading, empty, error)
□ Dark mode considerations (optional)
SECTION 13: VISUAL EXAMPLES
Heatmap Color Palette:
text
Very High: #D32F2F (Deep Red)
High:      #FF6B35 (Red-Orange)
Medium:    #FFB347 (Orange)
Low:       #FFF3CD (Light Yellow)
No Demand: Transparent
Gradient Transitions:
text
Red → Orange → Yellow → Transparent
Zone Label Design:
text
┌─────────────┐
│ G-13     🔥 │
│ 12 requests │
└─────────────┘
Background: Navy (#161533) with 85% opacity

Text: White, Inter Bold

Rounded corners: 8px

Padding: 6px 12px

Customer Card Design:
text
┌─────────────────────────────────────────────────┐
│  [👤]  Ahmed Khan                 ⭐ 4.8      │
│        AC Repair · Street 5, G-13             │
│        🚶 2.5 km · ⚡ Emergency               │
│  ────────────────────────────────────────────  │
│        [Accept Request]  [View Profile]       │
└─────────────────────────────────────────────────┘
Demand Stats Bar:
text
┌──────────┬──────────┬──────────┬──────────┐
│ 📊 47    │ 🔥 3     │ 🟠 5     │ 🟡 8     │
│ Total     │ High      │ Medium    │ Low       │
│ Requests  │ Areas     │ Areas     │ Areas     │
└──────────┴──────────┴──────────┴──────────┘
