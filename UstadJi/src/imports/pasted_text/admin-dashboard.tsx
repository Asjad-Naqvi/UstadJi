SECTION 1: ANALYSIS OF EXISTING FEATURES IN PROTOTYPE
Already Implemented (Skip):
Dispute Chat - Already exists for both consumer and provider

Dispute Status - Already exists showing dispute timeline

User Management - Basic user roles exist

Provider Verification - Existing onboarding flow

What's Missing (Need to Add):
Admin Dashboard - Central admin interface

User Table - Complete user management

Analytics Charts - Visual data representation

Dispute Tickets - Centralized dispute management

Monitoring Alerts - System health and activity alerts

Provider Verification Management - Admin approval workflow

Revenue Analytics - Platform earnings overview

User Activity Monitoring - Suspicious activity detection

SECTION 2: NEW SCREENS TO ADD
SCREEN 1: Admin Dashboard Main Screen
File Name: hz-admin-dashboard.tsx
Navigation: Admin login → Dashboard (admin role only)

Screen Layout (390 x 844):

A. Header Section (80px)
Left:

Logo: "UstadJi Admin" (font: Inter Bold, size: 18px, color: #161533)

Small badge: "Admin Panel" (background: #FF6B35, text white, padding: 2px 8px, border-radius: 10px)

Right:

Notification bell icon (with badge count: "3" new alerts)

Admin avatar (40x40px circle)

Dropdown arrow (▼) for admin menu

B. Quick Stats Cards (Top Section)
Horizontal Scrollable Stats Row:

text
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│ 👥 1,234 │ 📋 456   │ ⚠️ 23    │ 💰 124K  │ ⏳ 12    │
│ Users     │ Bookings │ Disputes │ Revenue  │ Pending  │
│ +12%      │ +8%      │ +2%      │ +15%     │ Reviews  │
└──────────┴──────────┴──────────┴──────────┴──────────┘
Each Stat Card:

Width: 160px (horizontal scroll)

Background: #FFFFFF

Border-radius: 8px

Padding: 12px

Border: 1px solid #E8E3DB

Content:

Icon (top left)

Number (font: Inter Bold, size: 20px, color: #161533)

Label (font: Inter Regular, size: 11px, color: #9B9B9B)

Trend indicator (green: ↑, red: ↓, grey: −)

C. Quick Actions Bar
Horizontal Action Buttons:

text
[👤 Manage Users] [📋 View Bookings] [⚠️ Disputes] [📊 Analytics] [⚙️ Settings]
Each Button:

Background: #F5F5F5

Border-radius: 20px

Padding: 8px 16px

Font: Inter Regular, size: 12px, color: #161533

Icon before text

On tap: Navigates to respective section

D. Main Content Area (Scrollable)
Section 1: Recent Disputes

Header:

"Recent Disputes" (font: Inter Bold, size: 16px, color: #161533)

"View All →" (font: Inter Regular, size: 13px, color: #161533)

Dispute Cards (3 most recent):

text
┌─────────────────────────────────────────────────┐
│  ⚠️ #D-2401 · Ahmed vs Usman                  │
│  Plumbing Service · 2 hours ago               │
│  Status: [Under Review]                       │
│  [View Ticket →]                              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  ⚠️ #D-2402 · Sana vs Ali                     │
│  AC Repair · 5 hours ago                      │
│  Status: [Resolved] ✅                        │
│  [View Ticket →]                              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  ⚠️ #D-2403 · Hassan vs Raza                  │
│  Electrical · 1 day ago                       │
│  Status: [Escalated] 🔴                       │
│  [View Ticket →]                              │
└─────────────────────────────────────────────────┘
Status Colors:

Under Review: #FFB347 (Orange)

Resolved: #4CAF84 (Green)

Escalated: #FF0000 (Red)

Pending: #9B9B9B (Grey)

Section 2: Platform Analytics

Header:

"Platform Analytics" (font: Inter Bold, size: 16px, color: #161533)

Time filter: [Today] [Week] [Month] [Year] (chips)

Charts Grid (2 columns):

Chart 1: Bookings Trend (Last 7 days)

text
📈 Bookings
    12 │          ██
    10 │      ██  ██
     8 │  ██  ██  ██  ██
     6 │  ██  ██  ██  ██  ██
     4 │  ██  ██  ██  ██  ██  ██
     2 │  ██  ██  ██  ██  ██  ██  ██
       └─────────────────────────
         M  T  W  T  F  S  S
Bar chart with 7 days

Color: #161533

Grid lines: Light grey (#F5F5F5)

Chart 2: Revenue (Last 7 days)

text
💰 Revenue (PKR)
   15K │          ██
   12K │      ██  ██
    9K │  ██  ██  ██  ██
    6K │  ██  ██  ██  ██  ██
    3K │  ██  ██  ██  ██  ██  ██
     0 │  ██  ██  ██  ██  ██  ██  ██
       └─────────────────────────
         M  T  W  T  F  S  S
Bar chart with 7 days

Color: #4CAF84

Grid lines: Light grey (#F5F5F5)

Section 3: User Growth

Header:

"User Growth" (font: Inter Bold, size: 16px, color: #161533)

"This Month" (font: Inter Regular, size: 12px, color: #9B9B9B)

Line Chart:

text
Users
  1,500 │          ●
  1,200 │      ●   ●
    900 │  ●   ●       ●
    600 │  ●               ●
    300 │  ●                   ●
      0 └─────────────────────────
         W1  W2  W3  W4  W5
Line chart with 5 weeks

Color: #0066CC

Points: Navy dots

Area fill: Light blue with 20% opacity

Section 4: Platform Health

Health Indicators (4 cards in grid):

text
┌──────────────┬──────────────┐
│ 🟢 Online    │ ⏱️ 0.8s      │
│ API Status   │ Avg Response │
│ 100% uptime  │ 2ms spike    │
├──────────────┼──────────────┤
│ 🟢 98%       │ ⚠️ 1,234    │
│ Server Load  │ Active Users │
│ Normal       │ +12% growth  │
└──────────────┴──────────────┘
Each Card:

Background: #FFFFFF

Border-radius: 8px

Padding: 12px

Border: 1px solid #E8E3DB

E. Bottom Navigation (Admin)
Tab Bar (4 tabs):

text
[📊 Dashboard] [👥 Users] [⚠️ Disputes] [⚙️ Settings]
Active: Icon + label (navy color)

Inactive: Icon only or grey label

Height: 60px

SCREEN 2: Admin User Management
File Name: hz-admin-users.tsx
Navigation: Dashboard → "Manage Users" or Bottom Nav → Users

Screen Layout (390 x 844):

A. Header Section (70px)
Left:

Back arrow (←) - navigate to dashboard

Title: "User Management" (font: Inter Bold, size: 18px, color: #161533)

Right:

"Add User" button (background: #161533, text white, border-radius: 6px, padding: 6px 12px)

B. Search & Filter Bar
Search Input:

Icon: Magnifying glass

Placeholder: "Search users by name, email, phone..."

Background: #F5F5F5

Border-radius: 8px

Padding: 10px 16px

Full width

Filter Chips (below search):

text
[All: 1,234] [Providers: 456] [Customers: 778] [Verified: 234] [Suspended: 12] [New: 67]
Chip Design:

Active: Background #161533, text white

Inactive: Background #F5F5F5, text #666666

Height: 28px, border-radius: 14px

Padding: 0 12px

C. User Table
Table Headers (sticky):

text
┌───────┬──────────────┬──────────┬──────────┬──────────┬──────────┐
│ User  │ Type         │ Status   │ Bookings │ Joined   │ Actions  │
├───────┼──────────────┼──────────┼──────────┼──────────┼──────────┤
Font: Inter Bold, size: 11px, color: #9B9B9B

Background: #FAF8F5

Padding: 8px 12px

User Rows (each):

text
┌───────┬──────────────┬──────────┬──────────┬──────────┬──────────┐
│ 👤    │ Customer     │ 🟢 Active│ 23       │ 2024-01-15│ [✏️] [⚙️] │
│ Ahmed │              │          │          │          │          │
│ Khan  │              │          │          │          │          │
├───────┼──────────────┼──────────┼──────────┼──────────┼──────────┤
│ 👤    │ Provider     │ 🟡 Pending│ 456     │ 2024-01-10│ [✏️] [⚙️] │
│ Usman │              │ Verification│        │          │          │
│ Tariq │              │          │          │          │          │
├───────┼──────────────┼──────────┼──────────┼──────────┼──────────┤
│ 👤    │ Customer     │ 🔴 Suspended│ 12    │ 2024-01-05│ [✏️] [⚙️] │
│ Sana  │              │          │          │          │          │
│ Malik │              │          │          │          │          │
└───────┴──────────────┴──────────┴──────────┴──────────┴──────────┘
Row Details:

Avatar or initial (circle, 32px)

Name (font: Inter Bold, size: 13px, color: #1A1A1A)

User Type (font: Inter Regular, size: 11px, color: #666666)

Status badge (font: Inter Bold, size: 10px)

Bookings count (font: Inter Regular, size: 12px)

Joined date (font: Inter Regular, size: 11px, color: #9B9B9B)

Actions: Edit (✏️) and More (⚙️)

Status Badges:

Active: 🟢 Green (#4CAF84)

Pending Verification: 🟡 Orange (#FFB347)

Suspended: 🔴 Red (#FF0000)

Inactive: ⚪ Grey (#9B9B9B)

D. Pagination
Bottom:

text
[<] [1] [2] [3] ... [12] [>]
Current page: Navy background, white text

Inactive pages: Grey text

Showing: "Showing 1-10 of 1,234 users"

SCREEN 3: Admin Dispute Management
File Name: hz-admin-disputes.tsx
Navigation: Dashboard → Disputes or Bottom Nav → Disputes

Screen Layout (390 x 844):

A. Header Section (70px)
Left:

Back arrow (←) - navigate to dashboard

Title: "Dispute Management" (font: Inter Bold, size: 18px, color: #161533)

Badge: "23 Open" (background: #FF6B35, text white, padding: 2px 10px, border-radius: 12px)

Right:

Filter button (icon)

B. Dispute Stats
Stats Row:

text
┌──────────┬──────────┬──────────┬──────────┐
│ ⚠️ 23    │ 🔄 12    │ ✅ 8     │ 🔴 3     │
│ Open      │ Under     │ Resolved │ Escalated│
│ Disputes  │ Review    │          │          │
└──────────┴──────────┴──────────┴──────────┘
Each Card:

Background: #FFFFFF

Border-radius: 6px

Padding: 8px

Border: 1px solid #E8E3DB

C. Filter Bar
Filter Chips:

text
[All] [Open] [Under Review] [Resolved] [Escalated] [Provider] [Customer]
Sort Options:

text
[Newest First] [Oldest First] [Priority]
D. Dispute List
Dispute Cards (each):

text
┌─────────────────────────────────────────────────┐
│  ⚠️ #D-2401 · Ahmed vs Usman                   │
│  ────────────────────────────────────────────  │
│  Service: Plumbing Repair                      │
│  Category: Payment Dispute                     │
│  Priority: High ⚠️                             │
│  Created: 2 hours ago                         │
│  Status: [Under Review]                       │
│  ────────────────────────────────────────────  │
│  [View Details →]  [Resolve]  [Escalate]     │
└─────────────────────────────────────────────────┘
Card Details:

Dispute ID and title (font: Inter Bold, size: 14px)

Service type (font: Inter Regular, size: 12px, color: #666666)

Category (font: Inter Regular, size: 12px, color: #666666)

Priority level (font: Inter Bold, size: 11px)

Created time (font: Inter Regular, size: 11px, color: #9B9B9B)

Status badge (font: Inter Bold, size: 10px)

Action buttons:

"View Details →" (font: Inter Regular, size: 12px, color: #161533)

"Resolve" (primary button, background #4CAF84, text white)

"Escalate" (danger button, background #FF0000, text white)

Priority Colors:

High: #FF0000 (red)

Medium: #FFB347 (orange)

Low: #4CAF84 (green)

SCREEN 4: Admin Dispute Detail
File Name: hz-admin-dispute-detail.tsx
Navigation: Dispute Management → "View Details"

Screen Layout (390 x 844):

A. Header Section (70px)
Left:

Back arrow (←) - navigate to dispute list

Title: "#D-2401" (font: Inter Bold, size: 18px, color: #161533)

Right:

Status: "Under Review" (background: #FFB347, text white, padding: 4px 12px, border-radius: 12px)

Actions: [Resolve] [Escalate] [Close]

B. Dispute Overview Card
Card:

Background: #FFFFFF

Border-radius: 8px

Padding: 16px

Border: 1px solid #E8E3DB

Content:

Title: "Ahmed vs Usman" (font: Inter Bold, size: 16px)

Service: "Plumbing Repair" (font: Inter Regular, size: 14px)

Category: "Payment Dispute" (font: Inter Regular, size: 13px, color: #666666)

Priority: "High" (font: Inter Bold, size: 13px, color: #FF0000)

Created: "2 hours ago" (font: Inter Regular, size: 12px, color: #9B9B9B)

Updated: "Last updated: 10 min ago" (font: Inter Regular, size: 11px, color: #9B9B9B)

C. Dispute Timeline
Timeline View:

text
┌─────────────────────────────────────────────────┐
│  ✅ Submitted by Ahmed                         │
│     "Provider didn't complete the job"         │
│     2 hours ago                                │
│  ────────────────────────────────────────────  │
│  🟡 Assigned to Admin                         │
│     Admin Sana assigned to this case           │
│     1 hour ago                                 │
│  ────────────────────────────────────────────  │
│  💬 Provider Response                         │
│     Usman: "Customer refused to pay"           │
│     30 min ago                                 │
│  ────────────────────────────────────────────  │
│  ⏳ Under Review                               │
│     Admin is reviewing evidence                │
│     10 min ago                                 │
└─────────────────────────────────────────────────┘
Timeline Items:

Each item: Icon, title, description, timestamp

Colors match status (green for resolved, orange for pending)

Connecting line between items

D. Evidence Section
Evidence Cards:

text
┌─────────────────────────────────────────────────┐
│  📷 Photos (3)                                 │
│  ┌──────┬──────┬──────┐                       │
│  │ 📸 1 │ 📸 2 │ 📸 3 │                       │
│  └──────┴──────┴──────┘                       │
│  Uploaded by Ahmed · 2 hours ago              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  💬 Chat History                               │
│  [View Full Chat →]                           │
│  Last message: 1 hour ago                     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  📄 Invoice #INV-2026-001                      │
│  [View Invoice →]                              │
│  Amount: PKR 5,535                            │
└─────────────────────────────────────────────────┘
E. Admin Actions
Action Buttons:

text
[✅ Resolve Dispute] [🚨 Escalate] [💬 Message Parties] [📝 Add Notes]
Resolution Options Modal:

text
Resolve Dispute
─────────────────────────
Select Resolution:
○ Customer wins (refund)
○ Provider wins (payment)
○ Partial refund
○ Cancel booking
─────────────────────────
Notes:
[_____________________]
─────────────────────────
[Confirm Resolution] [Cancel]
SCREEN 5: Admin Analytics
File Name: hz-admin-analytics.tsx
Navigation: Dashboard → Analytics or Bottom Nav → Analytics

Screen Layout (390 x 844):

A. Header Section (70px)
Left:

Back arrow (←) - navigate to dashboard

Title: "Analytics" (font: Inter Bold, size: 18px, color: #161533)

Right:

Date picker: [Jan 2026 ▼]

B. Time Period Tabs
Tabs:

text
[Today] [This Week] [This Month] [This Quarter] [This Year] [Custom]
Active: Navy background, white text
Inactive: Transparent, navy text

C. Analytics Grid
Top Row (2 columns):

Chart 1: Revenue Overview

text
💰 Revenue
120K │        ●
100K │    ●   ●   ●
 80K │    ●       ●   ●
 60K │●   ●           ●
 40K │●
 20K │●
   0 └─────────────────
      J  F  M  A  M  J
Line chart with 6 months

Area fill: Blue gradient

Chart 2: User Growth

text
👥 Users
1.5K │        ●
1.2K │    ●   ●   ●
 900 │●   ●       ●   ●
 600 │●
 300 │●
   0 └─────────────────
      J  F  M  A  M  J
Line chart with 6 months

Area fill: Green gradient

Middle Row (Full width):

Chart 3: Service Category Distribution

text
Service Categories
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Plumbing    ████████████████░░░░  45%
Electrical  ████████████░░░░░░░░  30%
AC Repair   ██████░░░░░░░░░░░░░░  15%
Cleaning    ████░░░░░░░░░░░░░░░░  10%
Carpentry   ██░░░░░░░░░░░░░░░░░░   5%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Horizontal bar chart

Each bar with percentage

Different colors per category

Bottom Row (2 columns):

Chart 4: Provider Performance

text
Top Providers
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Usman Tariq    ████████████  4.9 ★
Ali Hassan     ███████████   4.8 ★
Ahmed Khan     ██████████    4.7 ★
Sana Malik     █████████     4.6 ★
Raza Ali       ████████      4.5 ★
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
List with rating bars

Star rating display

Chart 5: Disputes Trend

text
⚠️ Disputes
  8 │          ■
  6 │      ■   ■
  4 │  ■   ■       ■
  2 │  ■               ■
  0 └─────────────────
      W1  W2  W3  W4
Bar chart for weekly disputes

Color: #FF6B35

D. Key Metrics Summary
Metrics Grid (3 columns):

text
┌──────────┬──────────┬──────────┐
│ 1,234    │ PKR 124K │ 98%      │
│ Users     │ Revenue  │ Satisfact│
│ +12%      │ +15%     │ +2%      │
├──────────┼──────────┼──────────┤
│ 456       │ 23       │ 12       │
│ Bookings  │ Disputes │ New      │
│ +8%       │ +2%      │ Today    │
└──────────┴──────────┴──────────┘
SCREEN 6: Admin Monitoring & Alerts
File Name: hz-admin-monitoring.tsx
Navigation: Dashboard → Monitoring or notification bell

Screen Layout (390 x 844):

A. Header Section (70px)
Left:

Back arrow (←) - navigate to dashboard

Title: "Monitoring Alerts" (font: Inter Bold, size: 18px, color: #161533)

Badge: "3 New" (background: #FF0000, text white)

Right:

"Mark All Read" (font: Inter Regular, size: 13px, color: #161533)

B. Alert Filter
Filter Chips:

text
[All] [Critical] [Warning] [Info] [Resolved]
C. Alert List
Alert Cards:

Critical Alert:

text
┌─────────────────────────────────────────────────┐
│  🔴 CRITICAL · 5 min ago                       │
│  ────────────────────────────────────────────  │
│  Server CPU usage at 92%                       │
│  Auto-scaling triggered                        │
│  [View Details →] [Acknowledge]               │
└─────────────────────────────────────────────────┘
Warning Alert:

text
┌─────────────────────────────────────────────────┐
│  🟡 WARNING · 15 min ago                      │
│  ────────────────────────────────────────────  │
│  Unusual activity detected                     │
│  25 failed login attempts from IP 192.168...  │
│  [View Details →] [Acknowledge]               │
└─────────────────────────────────────────────────┘
Info Alert:

text
┌─────────────────────────────────────────────────┐
│  🔵 INFO · 45 min ago                         │
│  ────────────────────────────────────────────  │
│  New provider registration pending verification│
│  Usman Tariq - AC Technician                   │
│  [View Details →] [Review Now]                │
└─────────────────────────────────────────────────┘
Alert Card Details:

Icon and severity level

Title (font: Inter Bold, size: 14px)

Timestamp (font: Inter Regular, size: 11px, color: #9B9B9B)

Description (font: Inter Regular, size: 13px, color: #666666)

Action buttons:

"View Details →" (font: Inter Regular, size: 12px, color: #161533)

"Acknowledge" (primary button) or "Review Now" (primary button)

D. System Health Dashboard
Health Cards (Grid 2x2):

text
┌──────────────┬──────────────┐
│ 🟢 API       │ 💾 Database  │
│ 100% uptime  │ 98% health   │
│ 0.8s avg     │ 1.2s query   │
├──────────────┼──────────────┤
│ ⚡ Server    │ 📡 Cache    │
│ 45% load     │ 85% hit rate │
│ 2 instances  │ Redis 6.2    │
└──────────────┴──────────────┘
SCREEN 7: Admin Settings
File Name: hz-admin-settings.tsx
Navigation: Bottom Nav → Settings

Screen Layout (390 x 844):

A. Header Section (60px)
Left:

Back arrow (←) - navigate to dashboard

Title: "Settings" (font: Inter Bold, size: 18px, color: #161533)

B. Settings Sections
Section 1: General Settings

text
┌─────────────────────────────────────────────────┐
│  ⚙️ General                                    │
│  ├─ Platform Name      UstadJi                 │
│  ├─ Timezone           Pakistan (GMT+5)       │
│  └─ Language           English                 │
└─────────────────────────────────────────────────┘
Section 2: User Management

text
┌─────────────────────────────────────────────────┐
│  👥 User Management                            │
│  ├─ User Registration  [Open]                  │
│  ├─ Provider Approval  [Manual]                │
│  └─ Verification Req.  [Required]              │
└─────────────────────────────────────────────────┘
Section 3: Platform Fees

text
┌─────────────────────────────────────────────────┐
│  💰 Platform Fees                              │
│  ├─ Service Fee        10%                     │
│  ├─ Provider Commission 85%                    │
│  └─ Tax Rate           13%                     │
└─────────────────────────────────────────────────┘
Section 4: Notifications

text
┌─────────────────────────────────────────────────┐
│  🔔 Notifications                              │
│  ├─ Email Alerts      [ON]                     │
│  ├─ SMS Alerts        [OFF]                    │
│  └─ Push Notifications [ON]                    │
└─────────────────────────────────────────────────┘
Section 5: Security

text
┌─────────────────────────────────────────────────┐
│  🔒 Security                                   │
│  ├─ 2FA               [ON]                     │
│  ├─ Session Timeout   30 min                   │
│  └─ IP Whitelist      [Configure]              │
└─────────────────────────────────────────────────┘
Section 6: Admin Accounts

text
┌─────────────────────────────────────────────────┐
│  👤 Admin Accounts                             │
│  ├─ Admin 1           Sana (Active)            │
│  ├─ Admin 2           Ali (Active)             │
│  └─ [Add Admin →]                             │
└─────────────────────────────────────────────────┘
SECTION 3: NEW SHARED COMPONENTS
COMPONENT 1: HzAdminStatCard
Purpose: Display quick stats on dashboard

Props:

text
{
  icon: string;
  value: string;
  label: string;
  trend: number;
  color: string;
}
Design:

White card with icon and value

Trend indicator (up/down arrow)

Background color based on stat type

COMPONENT 2: HzAdminChart
Purpose: Render analytics charts

Props:

text
{
  type: 'bar' | 'line' | 'horizontal-bar';
  data: ChartData[];
  colors: string[];
  height: number;
}
Design:

Clean chart with grid lines

Labels on axis

Tooltips on hover

COMPONENT 3: HzDisputeCard
Purpose: Display dispute in list

Props:

text
{
  id: string;
  title: string;
  serviceType: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: string;
  created: string;
  onView: () => void;
  onResolve: () => void;
  onEscalate: () => void;
}
COMPONENT 4: HzAlertCard
Purpose: Display system alerts

Props:

text
{
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  onAcknowledge: () => void;
  onView: () => void;
}
COMPONENT 5: HzUserRow
Purpose: Display user in table

Props:

text
{
  id: string;
  name: string;
  avatar?: string;
  type: 'customer' | 'provider';
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  bookings: number;
  joined: string;
  onEdit: () => void;
  onMore: () => void;
}
SECTION 4: NAVIGATION FLOW
Complete Navigation with Admin Dashboard:
text
Admin Login (NEW)
    │
    └── Admin Dashboard (NEW)
            │
            ├── [Quick Actions] → Various admin screens
            │
            ├── [Notification Bell] → Admin Monitoring
            │
            ├── [Recent Disputes] → Admin Dispute Detail
            │
            ├── [View All Disputes] → Admin Disputes
            │
            ├── [Bottom Nav: Users] → Admin Users
            │
            ├── [Bottom Nav: Disputes] → Admin Disputes
            │
            ├── [Bottom Nav: Analytics] → Admin Analytics
            │
            └── [Bottom Nav: Settings] → Admin Settings

Admin Users
    │
    ├── [Add User] → Add User Modal (NEW)
    │
    ├── [Search/Filter] → Filtered User List
    │
    └── [User Row Actions] → Edit User Modal (NEW)
                              ├── [Suspend User]
                              ├── [Verify Provider]
                              └── [Delete User]

Admin Disputes
    │
    ├── [Filter] → Filtered Dispute List
    │
    ├── [View Details] → Admin Dispute Detail
    │                       ├── [Resolve] → Resolution Modal
    │                       ├── [Escalate] → Escalate Confirmation
    │                       ├── [Message Parties] → Chat View
    │                       └── [Add Notes] → Note Input
    │
    └── [Resolve] → Resolution Modal

Admin Monitoring
    │
    ├── [Alert Filter] → Filtered Alerts
    │
    ├── [Acknowledge] → Alert Acknowledged
    │
    └── [View Details] → Alert Detail View (NEW)

Admin Analytics
    │
    ├── [Time Period] → Updated Charts
    │
    └── [Chart Tap] → Detail View (NEW)
SECTION 5: UI TEXT COPY
Labels and Messages:
English	Urdu
Admin Dashboard	ایڈمن ڈیش بورڈ
Users	صارفین
Bookings	بکنگز
Disputes	تنازعات
Revenue	آمدنی
Pending Reviews	زیر التواء جائزے
Manage Users	صارفین کا نظم کریں
View Bookings	بکنگز دیکھیں
Analytics	تجزیات
User Management	صارفین کا نظم و نسق
Dispute Management	تنازعات کا نظم و نسق
Monitoring Alerts	نگرانی کے الرٹس
Open Disputes	کھلے تنازعات
Under Review	زیر جائزہ
Resolved	حل شدہ
Escalated	بڑھا ہوا
Priority	ترجیح
Critical	سنگین
Warning	انتباہ
Info	معلومات
Acknowledge	تسلیم کریں
Resolve	حل کریں
Escalate	بڑھائیں
Suspend	معطل کریں
Verify	تصدیق کریں
Platform Health	پلیٹ فارم کی صحت
SECTION 6: INTERACTION STATES
Admin Dashboard Interactions:
Action	Result
Tap Stat Card	Navigate to relevant section
Tap Quick Action	Navigate to specific screen
Tap Dispute Card	Open dispute detail
Tap Notification Bell	Open monitoring alerts
Tap Chart	Open detailed analytics
Tap Bottom Nav	Switch between sections
User Table Interactions:
Action	Result
Tap Search	Focus search input
Tap Filter Chip	Filter user list
Tap Edit Icon	Open edit user modal
Tap More Icon	Open actions dropdown
Tap User Row	Open user profile
Dispute Detail Interactions:
Action	Result
Tap Timeline Item	Expand for more details
Tap Evidence Card	View evidence full screen
Tap Resolve	Open resolution modal
Tap Escalate	Open escalation confirmation
Tap Message	Open chat view
SECTION 7: ANIMATION REQUIREMENTS
Dashboard Animations:
Stats Cards Load: Staggered fade-in

Chart Animations: Draw lines/bars from left to right

Number Counters: Count up animation

Notification Bell: Bounce when new alerts arrive

Status Updates: Smooth color transitions

Table Animations:
Row Hover: Background color change

Sort Indicator: Smooth rotation

Filter Apply: Fade in/out of rows

Modal Open: Slide up from bottom

SECTION 8: RESPONSIVE CONSIDERATIONS
Tablet/Desktop Views:
Dashboard: Grid layout instead of scroll

Charts: Larger, more detailed charts

Tables: Full width with more columns

Sidebar: Navigation sidebar instead of bottom nav

Mobile Views (Prototype):
Dashboard: Scrollable single column

Stats: Horizontal scrollable cards

Charts: Smaller, compact

Bottom Nav: 4 tabs

SECTION 9: IMPLEMENTATION NOTES
Backend Integration:
User Data: Fetch from PostgreSQL with pagination

Analytics: Aggregate data from bookings, users, disputes

Disputes: Real-time updates via WebSocket

Alerts: Server monitoring via logging service

Admin Access Control:
Role-Based Access: Admin role only

Permissions: Granular permissions per admin

Audit Log: Track all admin actions

Security:
2FA: Two-factor authentication for admin accounts

IP Whitelist: Restrict access to trusted IPs

Session Management: Auto-logout after inactivity

SECTION 10: FIGMA HANDOFF CHECKLIST
New Screens (7):
□ hz-admin-dashboard.tsx
□ hz-admin-users.tsx
□ hz-admin-disputes.tsx
□ hz-admin-dispute-detail.tsx
□ hz-admin-analytics.tsx
□ hz-admin-monitoring.tsx
□ hz-admin-settings.tsx
New Components (5):
□ HzAdminStatCard
□ HzAdminChart
□ HzDisputeCard
□ HzAlertCard
□ HzUserRow
New Modals (5):
□ Add User Modal
□ Edit User Modal
□ Dispute Resolution Modal
□ Escalate Confirmation Modal
□ Alert Detail Modal
Assets Needed:
□ Admin logo variant
□ Chart icons (bar, line, pie)
□ Status icons (active, pending, suspended)
□ Severity icons (critical, warning, info)
□ Admin avatar placeholder
Design Deliverables:
□ All screens at 390x844
□ Chart templates (bar, line, horizontal bar)
□ Table templates
□ Modal designs
□ Color palette for statuses
□ Interaction prototypes
□ Redline specs for spacing
□ Component library for admin