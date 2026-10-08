SECTION 1: ANALYSIS OF EXISTING FEATURES IN PROTOTYPE
Already Implemented (Skip):
Provider Results Screen (hz-provider-results-screen.tsx) - Already exists with basic provider listing

Google Maps View - Already exists as a tab in provider results

Provider Cards - Already shows: avatar, name, service type, star rating, review count, area, price/hr, availability badge

Filter Icon - Already exists (non-functional in prototype)

View Profile - Already navigates to provider-profile

What's Missing (Need to Add):
Rank Badges - Visual indicators showing provider ranking position

Smart Sorting - Sort by verified status, experience, credibility score

Advanced Filters - Verified only, experience level, credibility score range

Credibility Score - Visible score on provider cards

Verified Provider Badge - Enhanced verification display

Experience Indicators - Years of experience, job count display

Map View Enhancements - Rank indicators on map pins, filter application on map

Ranking Explanation - Why this provider is ranked this way

SECTION 2: MODIFICATIONS TO EXISTING SCREENS
SCREEN 1: Provider Results (hz-provider-results-screen.tsx)
Location: Main provider listing after chat screen

Current Features: Basic provider cards with availability badge

Changes to Add:

A. Tab Enhancement (Top Section)
Current: Two tabs: "UstadJi Providers" and "Google Maps"

Keep: Same tab structure

Add to "UstadJi Providers" Tab:

Smart ranking badge on top right of tab bar

Text: "Ranked by Credibility" (font: Inter Regular, size: 11px, color: #9B9B9B)

Small info icon (i) next to it → tap opens ranking explanation tooltip

Add to "Google Maps" Tab:

Provider rank indicators on map pins (numbered 1, 2, 3, etc.)

Pin color coding:

Top 3: Gold (#FFC107)

Rank 4-10: Navy (#161533)

Rank 11+: Grey (#9B9B9B)

Pin label shows provider rank number

B. Filter & Sort Bar (Below Tabs)
Add New Filter Bar Section:

Layout: Horizontal scrollable bar, height: 50px, padding: 0 16px

Filter/Sort Chips:

Sort By Dropdown (Leftmost, fixed)

Icon: Sort arrows (↑↓)

Text: "Sort" (font: Inter Regular, size: 12px, color: #161533)

On tap: Opens bottom sheet with sort options (see modal 1)

Filter Chips (scrollable)

"All" (active: background #161533, text white)

"Verified Only" (inactive: background #F5F5F5, text #666666)

"Top Rated" (inactive: background #F5F5F5, text #666666)

"Near Me" (inactive: background #F5F5F5, text #666666)

"Experienced" (inactive: background #F5F5F5, text #666666)

"Price: Low-High" (inactive: background #F5F5F5, text #666666)

Chip Interaction:

Multiple chips can be active simultaneously

Active chips combine filters

Clear all filter button appears when filters active

C. Provider Cards Enhancement
Current Card Layout:

text
[Avatar] [Name] [Availability Badge]
         [Service Type]
         [Rating] [Review Count] [Area] [Price/hr]
         [View Profile →]
Enhanced Card Layout:

Row 1 (Top):

Left: Avatar (diameter: 48px, with border if verified)

Center:

Name (font: Inter Bold, size: 16px, color: #1A1A1A)

Service Type (font: Inter Regular, size: 12px, color: #666666)

Right:

Rank Badge (NEW) - See badge designs below

Availability Badge (existing, moved to top right)

Row 2 (Middle):

Credibility Score Bar (NEW) - Horizontal bar

Left: "Credibility" (font: Inter Regular, size: 11px, color: #9B9B9B)

Right: Score "92/100" (font: Inter Bold, size: 12px, color: #161533)

Progress bar: width: 100%, height: 4px, background: #F5F5F5

Fill color: Green (#4CAF84) if score > 80, Navy (#161533) if 60-80, Orange (#FF6B35) if < 60

Row 3 (Details):

Star rating (existing) with new label

"4.8" (font: Inter Bold, size: 14px)

Stars (existing)

Review count: "(234 reviews)" (font: Inter Regular, size: 12px, color: #9B9B9B)

Divider dot: "•" (color: #E8E3DB)

"5 years exp." (NEW - font: Inter Regular, size: 12px, color: #666666)

Divider dot: "•"

"Area: G-10" (existing)

Row 4 (Pricing & Actions):

Price: "PKR 2,500/hr" (existing, font: Inter Bold, size: 14px, color: #161533)

"View Profile →" (existing, font: Inter Regular, size: 13px, color: #161533)

Quick Action: "Book" button (NEW - small primary button, background #161533, text white, padding: 6px 16px, border-radius: 6px)

D. Rank Badge Designs
Badge Variations:

Top 1 Badge (Gold Crown)

Background: Gold (#FFC107)

Text: "1" (white, Inter Bold, size: 14px)

Icon: Crown (small, before number)

Shape: Circle (diameter: 28px)

Shadow: 0px 2px 8px rgba(255,193,7,0.3)

Top 3 Badge (Silver)

Background: Silver (#C0C0C0)

Text: "2" or "3" (white, Inter Bold, size: 14px)

Shape: Circle (diameter: 28px)

Shadow: 0px 2px 8px rgba(192,192,192,0.3)

Top 10 Badge (Navy)

Background: Navy (#161533)

Text: "4-10" (white, Inter Bold, size: 12px)

Shape: Pill (width: 32px, height: 24px)

Text placement: Number only

Top 50 Badge (Grey)

Background: Light Grey (#F5F5F5)

Text: "#12" (dark grey, Inter Bold, size: 10px)

Shape: Pill (width: 32px, height: 20px)

Badge Display Rules:

Show badge on all provider cards in list view

Badge is clickable → shows tooltip "Ranked #X in your area"

Badge appears before availability badge

E. Credibility Score Section
Add Below Each Card (New Section):

Credibility Breakdown (expandable):

Small chevron icon (▼) to expand

When expanded shows:

"✓ Verified Professional" (green checkmark)

"✓ 5 years experience" (green checkmark)

"✓ 4.8 average rating" (green checkmark)

"✓ 95% on-time arrival" (green checkmark)

"✓ 85% job completion" (green checkmark)

Font: Inter Regular, size: 12px, color: #4CAF84

Each item with small icon

F. Enhanced Empty State
When No Providers Match Filters:

Icon: Magnifying glass with sad face

Text: "No providers match your filters" (font: Inter Bold, size: 16px, color: #161533)

Subtext: "Try adjusting your filters or expanding your search area" (font: Inter Regular, size: 14px, color: #9B9B9B)

Buttons:

"Clear Filters" (primary button, background #161533, text white)

"Expand Search Radius" (secondary button, transparent, border 1px #161533)

SCREEN 2: Google Maps Tab Enhancement
Location: Second tab in provider results

Current: Visual only map display

Changes to Add:

A. Map Overlays
Add Interactive Elements on Map:

Provider Pins with Rank Indicators

Pin color coding (as described above)

Number on pin showing rank

Tap on pin → shows mini provider card

Heat Radius

Circle overlay showing provider's service radius

Semi-transparent navy circle

Label on edge: "Service Radius: 5 km"

Filter Applied Indicator

Top of map: Banner showing active filters

Text: "Showing: Verified • Top Rated" (font: Inter Regular, size: 12px)

Clear button: "× Clear" (font: Inter Regular, size: 12px, color: #161533)

Provider Cluster (When Zoomed Out)

Circle with number (e.g., "3")

Shows count of providers in area

Background: Navy (#161533), text white

Tap to zoom in

B. Map Pin Popup
When Provider Pin Tapped:

Popup Card (appears above pin):

Background: #FFFFFF

Border-radius: 12px

Width: 280px

Shadow: 0px 4px 16px rgba(0,0,0,0.15)

Content:

Top: Rank badge (small)

Provider name (font: Inter Bold, size: 16px)

Service type (font: Inter Regular, size: 12px, color: #666666)

Rating: Stars + "4.8" (font: Inter Bold, size: 14px)

Credibility: "Credibility 92/100" (font: Inter Regular, size: 12px)

Price: "PKR 2,500/hr" (font: Inter Bold, size: 14px)

Buttons:

"View Profile" (primary, background #161533, text white, border-radius: 6px)

"Book" (secondary, transparent, border 1px #161533, border-radius: 6px)

Close button (X) top right

Animation: Popup slides up from pin position

SCREEN 3: Provider Profile Screen Enhancement
Location: hz-provider-profile-screen.tsx (already exists)

Current Features: Profile with stats, services, schedule, ratings

Changes to Add:

A. Ranking & Credibility Section
Add Below Avatar/Name:

Credibility Score Card (New):

Background: #FAF8F5

Border-radius: 8px

Padding: 16px

Border: 1px solid #E8E3DB

Card Content:

Header: "Credibility Score" (font: Inter Bold, size: 14px, color: #161533)

Score display: Large number "92" (font: Inter Bold, size: 32px, color: #161533)

Label: "/100" (font: Inter Regular, size: 16px, color: #9B9B9B)

Progress bar: width: 100%, height: 6px, background: #F5F5F5, fill: #4CAF84

Text below: "Top 3 Provider in your area" (font: Inter Bold, size: 13px, color: #4CAF84)

Breakdown Items (Grid 2 columns):

Row 1: "✓ Verified" | "✓ 5+ Years Exp"

Row 2: "✓ 4.8 Rating" | "✓ 95% On-Time"

Row 3: "✓ 85% Completion" | "✓ 1.2K Jobs"

Each item: font: Inter Regular, size: 12px, color: #1A1A1A

Checkmark color: #4CAF84

B. Rankings Display
Add Below Credibility Score:

Rankings Card:

Background: #FFFFFF

Border-radius: 8px

Padding: 16px

Border: 1px solid #E8E3DB

Content:

Header: "Rankings" (font: Inter Bold, size: 14px, color: #161533)

Row 1:

"Plumbing Services" (font: Inter Regular, size: 13px, color: #1A1A1A)

"Rank #1" (font: Inter Bold, size: 13px, color: #FFC107)

Row 2:

"AC Repair Services" (font: Inter Regular, size: 13px, color: #1A1A1A)

"Rank #3" (font: Inter Bold, size: 13px, color: #C0C0C0)

Row 3:

"Electrical Services" (font: Inter Regular, size: 13px, color: #1A1A1A)

"Rank #7" (font: Inter Bold, size: 13px, color: #161533)

Row 4 (if applies):

"Overall Rank" (font: Inter Bold, size: 13px, color: #161533)

"Rank #2" (font: Inter Bold, size: 13px, color: #FFC107)

C. "Why This Ranking" Tooltip
Add Info Icon:

Position: Next to "Rankings" header

Icon: (i) in circle

Interaction: Tap opens bottom sheet

Tooltip Content (Bottom Sheet):

Header: "How Rankings Work" (font: Inter Bold, size: 16px, color: #161533)

Section 1: "Credibility Score" (font: Inter Bold, size: 14px, color: #161533)

Text: "Calculated from: Ratings, Experience, Job Completion Rate, On-Time Performance"

Section 2: "Verification" (font: Inter Bold, size: 14px, color: #161533)

Text: "Providers with verified documents and background checks get higher rankings"

Section 3: "Experience" (font: Inter Bold, size: 14px, color: #161533)

Text: "More years of experience and completed jobs improve ranking"

Section 4: "Performance" (font: Inter Bold, size: 14px, color: #161533)

Text: "Rating, on-time arrival, and job completion rate affect ranking daily"

Close button at bottom

SCREEN 4: Chat Screen Enhancement
Location: hz-chat-screen.tsx

Change: "Find Provider Manually" card

Current: Single action "Find Provider Manually" → provider-results

Add:

Small text above button: "Top 3 providers near you" (font: Inter Regular, size: 12px, color: #9B9B9B)

Mini provider preview (3 small cards horizontal scroll):

Each card: Avatar (28px), Name (font: Inter Bold, size: 11px), Rank badge (small)

Background: #FAF8F5, border-radius: 8px, padding: 8px

Tappable → opens provider-profile

SECTION 3: NEW SCREENS TO ADD
SCREEN 1: Sorting Options Bottom Sheet
File Name: hz-sort-options-bottom-sheet.tsx
Trigger: Tapping "Sort" button in filter bar

Content:

Header:

Title: "Sort Providers By" (font: Inter Bold, size: 16px, color: #161533)

Close button (X) top right

Sort Options (Radio selection):

"Credibility Score (Best)" (Default, selected)

Description: "Highest rated and most reliable providers" (font: Inter Regular, size: 11px, color: #9B9B9B)

Radio button: Selected (navy filled)

"Distance (Nearest First)"

Description: "Providers closest to your location" (font: Inter Regular, size: 11px, color: #9B9B9B)

Radio button: Unselected (circle outline)

"Rating (Highest First)"

Description: "Top rated providers in your area" (font: Inter Regular, size: 11px, color: #9B9B9B)

Radio button: Unselected (circle outline)

"Price (Low to High)"

Description: "Most affordable providers" (font: Inter Regular, size: 11px, color: #9B9B9B)

Radio button: Unselected (circle outline)

"Experience (Most Experienced)"

Description: "Providers with most years of experience" (font: Inter Regular, size: 11px, color: #9B9B9B)

Radio button: Unselected (circle outline)

"Response Time (Fastest)"

Description: "Quickest to respond to booking requests" (font: Inter Regular, size: 11px, color: #9B9B9B)

Radio button: Unselected (circle outline)

Footer:

"Apply Sort" button (primary, background #161533, text white, full width)

"Reset to Default" link (text button, font: Inter Regular, size: 14px, color: #9B9B9B)

SCREEN 2: Filter Options Bottom Sheet
File Name: hz-filter-options-bottom-sheet.tsx
Trigger: Tapping filter icon (already exists)

Content:

Header:

Title: "Filter Providers" (font: Inter Bold, size: 16px, color: #161533)

Clear all link: "Clear All" (font: Inter Regular, size: 13px, color: #9B9B9B)

Filter Sections:

Section 1: Verification Status

Toggle: "Show Verified Only" (font: Inter Regular, size: 14px, color: #1A1A1A)

Toggle switch: On/Off (existing design pattern)

Section 2: Experience Level

Three chips (single select):

"Entry (0-2 yrs)" (inactive: background #F5F5F5, text #666666)

"Experienced (3-5 yrs)" (inactive: background #F5F5F5, text #666666)

"Expert (5+ yrs)" (inactive: background #F5F5F5, text #666666)

Active: background #161533, text white

Section 3: Rating Range

Slider (two handles: min and max)

Labels: "Min: 3.0" | "Max: 5.0" (font: Inter Regular, size: 12px, color: #9B9B9B)

Steps: 0.5 increments

Current values displayed above slider

Section 4: Credibility Score

Slider (single handle)

Labels: "Min: 60" (font: Inter Regular, size: 12px, color: #9B9B9B)

Scale: 0-100

Current value: "80" (font: Inter Bold, size: 14px, color: #161533)

Section 5: Price Range

Two input fields: Min (PKR) and Max (PKR)

Labels above each: "Minimum" and "Maximum" (font: Inter Regular, size: 11px, color: #9B9B9B)

Input styling: border 1px #E8E3DB, border-radius: 6px, padding: 8px

Section 6: Availability

Toggle: "Available Now" (font: Inter Regular, size: 14px, color: #1A1A1A)

Toggle: "Available Today" (font: Inter Regular, size: 14px, color: #1A1A1A)

Footer:

"Apply Filters" (primary button, background #161533, text white, full width)

Filter count badge: "3 filters active" (font: Inter Regular, size: 12px, color: #9B9B9B)

SCREEN 3: Ranking Explanation Screen
File Name: hz-ranking-explanation-screen.tsx
Trigger: Tapping info icon next to "Ranked by Credibility" text

Content:

Header:

Back arrow (←)

Title: "How Providers Are Ranked" (font: Inter Bold, size: 18px, color: #161533)

Sections (Scrollable):

Section 1: Credibility Score

Icon: Shield/Star

Header: "Credibility Score (60% weight)" (font: Inter Bold, size: 16px, color: #161533)

Subtext: "The most important factor in ranking" (font: Inter Regular, size: 13px, color: #9B9B9B)

Points (with icons):

"✓ Average Rating from verified customers" (font: Inter Regular, size: 13px)

"✓ Job Completion Rate" (font: Inter Regular, size: 13px)

"✓ On-Time Performance" (font: Inter Regular, size: 13px)

"✓ Response Time to Requests" (font: Inter Regular, size: 13px)

Section 2: Verification (20% weight)

Icon: Checkmark/Verified

Header: "Verification Status" (font: Inter Bold, size: 16px, color: #161533)

Points:

"✓ Government ID Verified" (font: Inter Regular, size: 13px)

"✓ Professional Certificates" (font: Inter Regular, size: 13px)

"✓ Background Check Passed" (font: Inter Regular, size: 13px)

"✓ Bank Account Verified" (font: Inter Regular, size: 13px)

Section 3: Experience (15% weight)

Icon: Clock/Calendar

Header: "Experience & Track Record" (font: Inter Bold, size: 16px, color: #161533)

Points:

"✓ Years of Professional Experience" (font: Inter Regular, size: 13px)

"✓ Total Jobs Completed" (font: Inter Regular, size: 13px)

"✓ Customer Retention Rate" (font: Inter Regular, size: 13px)

Section 4: Distance (5% weight)

Icon: Location

Header: "Proximity" (font: Inter Bold, size: 16px, color: #161533)

Points:

"✓ Distance from your location" (font: Inter Regular, size: 13px)

"✓ Service Area Coverage" (font: Inter Regular, size: 13px)

Bottom Section:

Box: "Your ranking updates daily based on provider performance"

Background: #FAF8F5, border-radius: 8px, padding: 16px

Font: Inter Regular, size: 13px, color: #666666

SECTION 4: NEW SHARED COMPONENTS
COMPONENT 1: HzRankBadge
Purpose: Display provider rank consistently

Props:

text
{
  rank: number;
  totalProviders?: number;
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
}
Design Variations:

Size: Small (used on chat mini cards)

Diameter: 20px

Font: Inter Bold, size: 10px

Background: Navy (#161533)

Text: White

Size: Medium (used on provider cards)

Diameter: 28px

Font: Inter Bold, size: 14px

Background: Based on rank (Gold/Silver/Navy/Grey)

Size: Large (used on profile)

Diameter: 40px

Font: Inter Bold, size: 18px

Background: Gold (#FFC107) for rank 1

Color Rules:

Rank 1: Gold (#FFC107), white text, crown icon

Rank 2-3: Silver (#C0C0C0), white text, star icon

Rank 4-10: Navy (#161533), white text, number only

Rank 11+: Grey (#9B9B9B), white text, number only

COMPONENT 2: HzCredibilityScore
Purpose: Display credibility score with progress bar

Props:

text
{
  score: number;
  showBreakdown?: boolean;
  onExpand?: () => void;
}
Design:

Score number (large) + "/100" (small)

Progress bar (background #F5F5F5, fill colored based on score)

Breakdown items (optional expandable)

COMPONENT 3: HzFilterChip
Purpose: Interactive filter/sort chips

Props:

text
{
  label: string;
  isActive: boolean;
  icon?: string;
  onPress: () => void;
}
Design:

Active: Background #161533, text white

Inactive: Background #F5F5F5, text #666666

Height: 32px, border-radius: 16px

Padding: 0 16px

COMPONENT 4: HzMapPin
Purpose: Custom map pin with rank

Props:

text
{
  rank: number;
  isTopRank?: boolean;
  onPress?: () => void;
}
Design:

Pin shape (standard map pin)

Color based on rank

Rank number centered on pin

Shadow for depth

SECTION 5: NEW MODALS
MODAL 1: Sort Options Bottom Sheet
File: hz-sort-bottom-sheet.tsx

Trigger: Tapping "Sort" button in filter bar

Design:

Bottom sheet (60% height)

Rounded top corners (16px)

Background: #FFFFFF

Drag handle at top

Content:

Header: "Sort Providers By" (font: Inter Bold, size: 16px)

Radio list of sort options (6 options)

Each option: Radio button + Label + Description

Footer: "Apply Sort" button + "Reset" link

MODAL 2: Filter Bottom Sheet
File: hz-filter-bottom-sheet.tsx

Trigger: Tapping filter icon

Design:

Bottom sheet (80% height)

Rounded top corners (16px)

Background: #FFFFFF

Drag handle at top

Content:

Header: "Filter Providers" (font: Inter Bold, size: 16px)

Clear all link in header

6 filter sections (Verification, Experience, Rating, Credibility, Price, Availability)

Footer: "Apply Filters" button + Active filters count

MODAL 3: Ranking Explanation Tooltip
File: hz-ranking-tooltip.tsx

Trigger: Tapping info icon or rank badge

Design:

Small popup (positioned near trigger element)

Background: #FFFFFF

Border-radius: 8px

Shadow: 0px 4px 16px rgba(0,0,0,0.15)

Arrow pointing to trigger element

Content:

Header: "Rank #3 in your area" (font: Inter Bold, size: 13px)

Brief explanation: "Ranked based on credibility, verification, experience, and distance" (font: Inter Regular, size: 11px, color: #666666)

"Learn more →" link (font: Inter Regular, size: 11px, color: #161533) → navigates to ranking explanation screen

SECTION 6: NAVIGATION FLOW
Updated Navigation with Ranking Features:
text
provider-results
    ├── [Sort] → sort-bottom-sheet
    │             └── [Apply] → provider-results (re-sorted)
    │
    ├── [Filter] → filter-bottom-sheet
    │              └── [Apply] → provider-results (filtered)
    │
    ├── [Rank Badge Tap] → ranking-tooltip → ranking-explanation
    │
    ├── [Provider Card] → provider-profile (with ranking info)
    │                      ├── [Ranking Info] → ranking-explanation
    │                      └── [Credibility Breakdown] → expand/collapse
    │
    └── [Google Maps Tab] → map-view
                             ├── [Map Pin Tap] → provider-popup
                             │                   ├── [View Profile] → provider-profile
                             │                   └── [Book] → booking-confirm
                             │
                             ├── [Provider Cluster] → zoom in
                             └── [Filter Applied Banner] → filter-bottom-sheet
SECTION 7: DATA STRUCTURE FOR RANKING
Provider Ranking Data:
typescript
interface ProviderRanking {
  rank: number;                    // Overall rank
  credibilityScore: number;        // 0-100
  categoryRanks: {                // Rank per service category
    plumbing?: number;
    electrical?: number;
    acRepair?: number;
    cleaning?: number;
    carpentry?: number;
  };
  rankingFactors: {
    rating: number;               // 0-5
    experienceYears: number;
    jobsCompleted: number;
    completionRate: number;       // 0-100
    onTimeRate: number;          // 0-100
    responseTime: number;         // minutes
    verificationStatus: boolean;
    documentVerified: boolean;
  };
}
Mock Data for Ranking Display:
Provider 1:

Rank: 1

Credibility: 96

Experience: 8 years

Jobs: 1,234

Rating: 4.9

Verified: Yes

Provider 2:

Rank: 2

Credibility: 92

Experience: 5 years

Jobs: 856

Rating: 4.8

Verified: Yes

Provider 3:

Rank: 3

Credibility: 88

Experience: 6 years

Jobs: 723

Rating: 4.7

Verified: Yes

SECTION 8: UI TEXT COPY
Labels and Messages:
Location	English	Urdu
Tab Bar	Ranked by Credibility	کریڈیبلٹی کے لحاظ سے درجہ بندی
Filter Bar	Sort	ترتیب دیں
Filter Bar	Verified Only	صرف تصدیق شدہ
Filter Bar	Top Rated	اعلی ترین درجہ بندی
Filter Bar	Near Me	میرے قریب
Filter Bar	Experienced	تجربہ کار
Card	Credibility	کریڈیبلٹی
Card	years exp.	سال کا تجربہ
Card	View Profile	پروفائل دیکھیں
Card	Book	بک کریں
Tooltip	How Rankings Work	درجہ بندی کیسے کام کرتی ہے
Sort	Credibility Score (Best)	کریڈیبلٹی اسکور (بہترین)
Sort	Distance (Nearest First)	فاصلہ (قریب ترین)
Sort	Rating (Highest First)	درجہ بندی (اعلی ترین)
Sort	Experience (Most Experienced)	تجربہ (سب سے زیادہ تجربہ کار)
Filter	Verification Status	تصدیق کی حیثیت
Filter	Experience Level	تجربے کی سطح
Filter	Entry (0-2 yrs)	ابتدائی
Filter	Experienced (3-5 yrs)	تجربہ کار
Filter	Expert (5+ yrs)	ماہر
Filter	Rating Range	درجہ بندی کی حد
Filter	Credibility Score	کریڈیبلٹی اسکور
Filter	Price Range	قیمت کی حد
Filter	Availability	دستیابی
Filter	Available Now	ابھی دستیاب
Filter	Available Today	آج دستیاب
SECTION 9: IMPLEMENTATION NOTES
Backend Integration Points (for developers):
Ranking Algorithm:

Weight: Credibility (60%), Verification (20%), Experience (15%), Distance (5%)

Real-time update: After each completed job, review, or status change

Cache: Redis cache for fast retrieval

Filter Implementation:

Combine multiple filters with AND logic

Index fields in Elasticsearch for fast searching

Use PostgreSQL with PostGIS for location queries

Sort Options:

Credibility: Score field sorted DESC

Distance: Calculated using PostGIS ST_Distance

Rating: Average rating sorted DESC

Price: Service price sorted ASC

Experience: Years of experience sorted DESC

Performance Considerations:
Caching Strategy:

Cache provider rankings (TTL: 1 hour)

Cache filter results (TTL: 15 minutes)

Redis for session and real-time data

Pagination:

Load 10 providers per page

Infinite scroll or "Load More" button

Skeleton loading for smooth experience

Map Performance:

Cluster providers at zoom levels < 12

Load only visible providers in viewport

Lazy load map tiles

SECTION 10: FIGMA HANDOFF CHECKLIST
Modified Screens:
□ hz-provider-results-screen.tsx (Card redesign, filters, badges)
□ hz-provider-profile-screen.tsx (Credibility section, rankings)
□ hz-chat-screen.tsx (Mini provider preview)
□ Google Maps Tab (Rank pins, popups, clusters)
New Screens (3):
□ hz-sort-bottom-sheet.tsx
□ hz-filter-bottom-sheet.tsx
□ hz-ranking-explanation-screen.tsx
New Components (4):
□ HzRankBadge
□ HzCredibilityScore
□ HzFilterChip
□ HzMapPin
New Modals (3):
□ hz-sort-bottom-sheet.tsx
□ hz-filter-bottom-sheet.tsx
□ hz-ranking-tooltip.tsx
Design Deliverables:
□ All screens at 390x844
□ All components with variants (sizes, states)
□ Prototyping links between screens
□ Redline specs for spacing
□ Color variables defined
□ Text styles defined
□ Assets exported (icons, illustrations)
□ Interaction notes for developers
Final Notes for Figma Designer:
Maintain Consistency: Use existing design system (colors, typography, spacing)

Keep It Simple: Don't overcomplicate the UI, ranking should be intuitive

Mobile First: All interactions designed for touch (44px minimum targets)

Progressive Disclosure: Show basic info first, advanced details on interaction

Clear Feedback: Show filter count, sort indicator, active filters visibly

Accessibility: High contrast, readable fonts, proper label associations

Animation: Smooth transitions when applying filters/sorts, map interactions