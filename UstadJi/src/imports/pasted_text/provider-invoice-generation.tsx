SECTION 1: NEW SCREENS TO CREATE
SCREEN 1: Provider Invoice Generation
File Name: hz-provider-invoice-generation.tsx
Navigation: Accessible from provider-active-job screen

Screen Layout (390 x 844):

Header Section (height: 60px):

Left: Back arrow icon pointing left (navigate back to provider-active-job)

Center: Text "Generate Invoice" (font: Inter Bold, size: 18px, color: #161533)

Right: Empty (no icon needed)

Tab Navigation (height: 60px):

Two pill-shaped tabs side by side

Left tab: "Voice" (active state: background #161533, text white)

Right tab: "Text" (inactive state: background transparent, text #161533, border 1px #E8E3DB)

Smooth underline indicator sliding between tabs

Tab width: 50% each, full width of screen minus 32px padding

VOICE TAB CONTENT (when Voice tab is active):

Recording Area (height: 300px):

Large circular microphone button (diameter: 80px) centered

Button background: #161533 with gradient overlay

When recording: Pulse animation ring expanding outward (opacity fading)

Timer display below button: "00:32" (font: Inter Regular, size: 14px, color: #9B9B9B)

Waveform visualization: Animated bars (height varying 10-40px, width 4px each, spacing 4px, color #161533)

Below waveform: Two inline buttons side by side

Left: "Record" (red circle icon) / "Stop" (square icon) toggle

Right: "Playback" (play icon) when recording exists

Below controls: "Clear Recording" (text button, font: Inter Regular, size: 12px, color: #9B9B9B, underline on hover)

Instruction Text (height: 60px):

Text: "Describe the work you performed, materials used, and any additional charges. You can speak in Urdu or English."

Font: Inter Regular, size: 14px, color: #666666

Alignment: Centered

Padding: 16px horizontal

Example Prompt Cards (height: 120px):

Two stacked cards with light background (#FAF8F5)

First card: "Fixed leaking pipe, replaced 2 connectors, charged 1 hour labor"

Second card: "Installed new AC unit, 3 copper pipes, refrigerant top-up"

Card styling: Border radius 8px, padding 12px, border 1px #E8E3DB

Font: Inter Regular, size: 13px, color: #1A1A1A

Small microphone icon at start of each card (color: #161533)

TEXT TAB CONTENT (when Text tab is active):

Input Area (height: 250px):

Multi-line text input field

Height: 180px

Border: 1px solid #E8E3DB, border-radius: 8px

Padding: 16px

Placeholder text: "Describe the service, materials, and charges..."

Font: Inter Regular, size: 14px, color: #1A1A1A

Character counter bottom right: "0/500" (font: Inter Regular, size: 12px, color: #9B9B9B)

Background: #FFFFFF

Quick Templates Section (height: 80px):

Label: "Quick Templates" (font: Inter Regular, size: 12px, color: #9B9B9B)

Horizontal scrollable chip row

Chips (rounded corners, height: 32px, padding: 0 16px):

"Plumbing Fix" (background: #FAF8F5, border: 1px #E8E3DB)

"AC Repair" (background: #FAF8F5, border: 1px #E8E3DB)

"Electrical" (background: #FAF8F5, border: 1px #E8E3DB)

"Cleaning" (background: #FAF8F5, border: 1px #E8E3DB)

"Carpentry" (background: #FAF8F5, border: 1px #E8E3DB)

Chip font: Inter Regular, size: 12px, color: #1A1A1A

Spacing between chips: 8px

Action Button (height: 56px):

Full-width button: "Analyze with AI"

Background: #161533

Text: White, Inter Bold, size: 16px

Border-radius: 8px

Margin top: 16px

AI Analysis Results Section (appears after analysis):

Loading State:

Skeleton loading animation (pulsing)

Text: "AI is analyzing your description..." (font: Inter Regular, size: 14px, color: #9B9B9B)

Progress bar: 100% width, height: 4px, background: #E8E3DB, fill: #161533 (animated)

Results Card (after loading):

Card background: #FAF8F5

Border-radius: 8px

Padding: 16px

Border: 1px solid #E8E3DB

Card Content:

Header: "AI-Generated Invoice Summary" (font: Inter Bold, size: 14px, color: #161533)

Divider line: 1px solid #E8E3DB (margin vertical: 12px)

Row 1: "Service Type: Plumbing Repair" (font: Inter Regular, size: 14px, color: #1A1A1A)

Row 2: "Duration: 1.5 hours" (font: Inter Regular, size: 14px, color: #1A1A1A)

Row 3: "Extracted Details:" (font: Inter Bold, size: 13px, color: #161533)

Bullet points:

"Fixed bathroom pipe leak" (font: Inter Regular, size: 13px, color: #1A1A1A)

"Replaced 2 PVC connectors" (font: Inter Regular, size: 13px, color: #1A1A1A)

"Water pressure test" (font: Inter Regular, size: 13px, color: #1A1A1A)

Confidence badge: "AI Confidence: 94%" (background: #4CAF84, text: white, border-radius: 12px, padding: 4px 12px, font: Inter Bold, size: 11px)

Edit button: "Edit" (text button, font: Inter Regular, size: 13px, color: #161533, underline)

Footer Section (height: 80px):

Primary button: "Generate Invoice" (full width, background: #161533, text white, Inter Bold, size: 16px, border-radius: 8px)

Secondary button below: "Save Draft" (text button, font: Inter Regular, size: 14px, color: #9B9B9B)

SCREEN 2: Invoice Preview
File Name: hz-invoice-preview-screen.tsx
Navigation: After tapping "Generate Invoice" from generation screen

Screen Layout (390 x 844):

Header Section (height: 60px):

Left: Back arrow icon (navigate back to generation screen)

Center: Text "Invoice #INV-2026-001" (font: Inter Bold, size: 18px, color: #161533)

Right: Two icons side by side

Download icon (downward arrow)

Share icon (nodes connected)

Icon size: 20px, color: #161533

Invoice Card (main content, scrollable):

Card Container:

Background: #FFFFFF

Border-radius: 12px

Margin: 16px horizontal

Box shadow: 0px 2px 8px rgba(0,0,0,0.08)

Invoice Header Section:

UstadJi logo at top center (small, width: 80px, height: 30px)

Text: "INVOICE" (font: Inter Bold, size: 20px, color: #161533, centered)

Divider line: 1px solid #E8E3DB (margin vertical: 12px)

Invoice Metadata Row (two columns):

Left column:

"Invoice #: INV-2026-001" (font: Inter Regular, size: 12px, color: #666666)

"Date: 2026-08-06" (font: Inter Regular, size: 12px, color: #666666)

"Booking #: BK-1234" (font: Inter Regular, size: 12px, color: #666666)

Right column: (alignment right)

"Status: Draft" (font: Inter Bold, size: 12px, color: #9B9B9B, background: #F5F5F5, padding: 4px 12px, border-radius: 12px)

From/To Section (two columns):

Divider line above (1px solid #E8E3DB)

Left column: "From" (label: font Inter Bold, size: 12px, color: #9B9B9B)

"Usman Tariq" (font: Inter Bold, size: 14px, color: #1A1A1A)

"AC Technician" (font: Inter Regular, size: 12px, color: #666666)

"555-1234" (font: Inter Regular, size: 12px, color: #666666)

Right column: "To" (label: font Inter Bold, size: 12px, color: #9B9B9B)

"Ahmed Khan" (font: Inter Bold, size: 14px, color: #1A1A1A)

"123 Street, G-10" (font: Inter Regular, size: 12px, color: #666666)

"Islamabad, PK" (font: Inter Regular, size: 12px, color: #666666)

Items Table:

Divider line above (1px solid #E8E3DB)

Table headers (background: #FAF8F5, padding: 8px 12px):

"DESCRIPTION" (left aligned, font: Inter Bold, size: 11px, color: #666666)

"QTY" (center aligned, font: Inter Bold, size: 11px, color: #666666)

"RATE" (right aligned, font: Inter Bold, size: 11px, color: #666666)

"AMOUNT" (right aligned, font: Inter Bold, size: 11px, color: #666666)

Table rows (padding: 8px 12px, border-bottom: 1px solid #F5F5F5):

Row 1: "AC Repair Service" (left) | "1" (center) | "1,500" (right) | "1,500" (right)

Row 2: "Copper Pipe (10ft)" (left) | "1" (center) | "800" (right) | "800" (right)

Row 3: "Refrigerant Top-up" (left) | "1" (center) | "1,200" (right) | "1,200" (right)

Row 4: "Labor (2 hrs)" (left) | "2" (center) | "500" (right) | "1,000" (right)

Summary Section (right aligned):

Divider line above (1px solid #E8E3DB)

Row: "Subtotal:" (left) | "PKR 4,500" (right) (font: Inter Regular, size: 14px)

Row: "Service Fee (10%):" (left) | "PKR 450" (right) (font: Inter Regular, size: 14px)

Row: "Tax (GST 13%):" (left) | "PKR 585" (right) (font: Inter Regular, size: 14px)

Divider line (1px solid #E8E3DB)

Row: "GRAND TOTAL:" (left, font: Inter Bold, size: 16px, color: #161533) | "PKR 5,535" (right, font: Inter Bold, size: 16px, color: #161533)

Terms Section:

Divider line above (1px solid #E8E3DB)

Text: "Terms: Service completed. 7-day warranty. Payment due upon receipt."

Font: Inter Regular, size: 11px, color: #9B9B9B

Signature Section:

Two signature lines side by side

Left: "Provider Signature" (label above, font: Inter Regular, size: 11px, color: #9B9B9B)

Empty line with bottom border (dashed, 1px, #E8E3DB)

Right: "Customer Signature" (label above, font: Inter Regular, size: 11px, color: #9B9B9B)

Empty line with bottom border (dashed, 1px, #E8E3DB)

AI Badge:

Bottom of card: "AI-Generated" badge (background: #EEEEF5, color: #161533, border-radius: 12px, padding: 4px 12px, font: Inter Bold, size: 10px)

Checkmark icon before text

Action Buttons Section (outside card, in footer):

Three button stack (height: 180px):

Primary button: "Send to Customer" (background: #161533, text white, Inter Bold, size: 16px, border-radius: 8px, full width)

Secondary button: "Edit Invoice" (background: transparent, text #161533, border: 1px solid #161533, Inter Bold, size: 16px, border-radius: 8px, full width)

Tertiary button: "Download PDF" (text button, font: Inter Regular, size: 14px, color: #9B9B9B, full width)

Edit Mode (when Edit Invoice tapped):

All line items become editable fields

Each row transforms to input fields

Add Item row appears at bottom: [Description input] [Qty input] [Rate input] [Add button]

Save Changes button appears (background: #161533, text white)

Cancel button appears (text button)

SCREEN 3: Invoice History
File Name: hz-invoice-history.tsx
Navigation: From provider-settings → "Invoices"

Screen Layout (390 x 844):

Header Section (height: 60px):

Left: Back arrow icon (navigate back to settings)

Center: Text "Invoices" (font: Inter Bold, size: 18px, color: #161533)

Right: "New Invoice" button (font: Inter Bold, size: 14px, color: #161533, background: transparent)

Filter Chips (height: 50px):

Horizontal scrollable chip row (padding horizontal: 16px)

Chips (rounded corners, height: 30px, padding: 0 16px):

"All" (active: background #161533, text white)

"Draft" (inactive: background #F5F5F5, text #666666)

"Sent" (inactive: background #F5F5F5, text #666666)

"Paid" (inactive: background #F5F5F5, text #666666)

"Overdue" (inactive: background #F5F5F5, text #666666)

Chip spacing: 8px

Font: Inter Regular, size: 12px

Stats Cards (height: 100px):

Horizontal scrollable stats row (padding horizontal: 16px)

Each card: background #FFFFFF, border-radius: 8px, padding: 12px, border: 1px solid #E8E3DB, width: 100px

Stat cards:

"Total Invoices: 47" (font: Inter Bold, size: 14px, color: #161533)

"Revenue: PKR 1,24,850" (font: Inter Bold, size: 14px, color: #161533)

"Sent: 12" (font: Inter Bold, size: 14px, color: #161533)

"Pending: 3" (font: Inter Bold, size: 14px, color: #FF6B35)

"Paid: 32" (font: Inter Bold, size: 14px, color: #4CAF84)

Label below each stat (font: Inter Regular, size: 10px, color: #9B9B9B)

Invoice List (scrollable):

Invoice Card (each):

Background: #FFFFFF

Border-radius: 8px

Padding: 16px

Border-bottom: 1px solid #F5F5F5

Margin: 0 16px (horizontal)

Card Content:

Top row:

Left: "Invoice #INV-2026-001" (font: Inter Bold, size: 14px, color: #161533)

Right: "PKR 5,535" (font: Inter Bold, size: 14px, color: #161533)

Middle row:

Left: "2026-08-06" (font: Inter Regular, size: 12px, color: #9B9B9B)

Right: Status badge "Paid" (background: #4CAF84, text white, border-radius: 12px, padding: 2px 10px, font: Inter Bold, size: 10px)

Bottom row:

"Ahmed Khan - AC Repair" (font: Inter Regular, size: 12px, color: #666666)

Chevron icon on right edge (indicates tappable)

Status Badge Colors:

Draft: #9B9B9B (grey)

Sent: #0066CC (blue)

Paid: #4CAF84 (green)

Overdue: #FF0000 (red)

Empty State (if no invoices):

Illustration of document (centered)

Text: "No invoices yet" (font: Inter Bold, size: 16px, color: #161533)

Text: "Generate your first invoice" (font: Inter Regular, size: 14px, color: #9B9B9B)

Button: "Create Invoice" (background: #161533, text white, border-radius: 8px)

SCREEN 4: Customer Invoice View
File Name: hz-customer-invoice-view.tsx
Navigation: From chat screen or bookings screen

Screen Layout (390 x 844):

Header Section (height: 60px):

Left: Back arrow icon (navigate back to chat or bookings)

Center: Text "Invoice #INV-2026-001" (font: Inter Bold, size: 18px, color: #161533)

Right: Download icon

Payment Status Banner (height: 50px):

Full-width banner below header

If Paid: Background #4CAF84, text "Payment Confirmed" (white, font: Inter Bold, size: 14px), checkmark icon

If Unpaid: Background #FFF3CD, text "Payment Due" (color: #856404, font: Inter Bold, size: 14px), warning icon

Invoice Card (same as preview but without edit options):

Same invoice card design as preview screen

Remove any edit functionality

Read-only view

Action Buttons Section (footer):

If Unpaid:

Primary button: "Pay Now" (background: #4CAF84, text white, Inter Bold, size: 16px, border-radius: 8px)

Secondary button: "Download Invoice" (background: transparent, text #161533, border: 1px solid #161533, border-radius: 8px)

Tertiary button: "Ask Question" (text button, font: Inter Regular, size: 14px, color: #9B9B9B) → navigates to chat with provider

If Paid:

Primary button: "Download Invoice" (background: #161533, text white, border-radius: 8px)

Secondary button: "Ask Question" (text button, font: Inter Regular, size: 14px, color: #9B9B9B)

SECTION 2: MODIFICATIONS TO EXISTING SCREENS
SCREEN 1: Provider Active Job (hz-provider-active-job.tsx)
Location: In the "Update Job Status" card

Current: Three action buttons: "Mark as Arrived", "Mark as Completed", "Report Issue"

Change: Replace with four action buttons:

"Mark as Arrived" (same functionality)

"Mark as Completed" (same functionality)

NEW: "Generate Invoice" (background: #161533, text white, border-radius: 8px, padding: 8px)

"Report Issue" (same functionality)

Button Layout: Grid of 2 columns x 2 rows

Row 1: Mark as Arrived | Mark as Completed

Row 2: Generate Invoice | Report Issue

SCREEN 2: Provider Dashboard (hz-provider-dashboard.tsx)
Location: Stats strip (currently 4 stats)

Change: Add 2 new stats to make 6 stats in horizontal scroll:
Existing stats: Total Jobs, Avg Rating, On-Time %, Total Earned
NEW Stats:

"Invoices: 12" (font: Inter Bold, size: 14px, color: #161533)

"Due: 3" (font: Inter Bold, size: 14px, color: #FF6B35)

Location: Dashboard actions section

Add: New quick action button "Generate Invoice"

Position: After existing actions

Button style: HzButton primary variant (background #161533, text white)

Label: "Generate Invoice"

Action: Opens invoice generation screen with recent customer pre-selected

SCREEN 3: Provider Settings (hz-provider-profile.tsx)
Location: Account settings section

Change: Add new row in account settings list:

Icon: Document/money icon (font: 20px)

Label: "Invoices" (font: Inter Regular, size: 16px, color: #1A1A1A)

Chevron arrow on right

Action: Navigates to invoice history screen

Position: Add after "Privacy" and before "Help & Support"

SCREEN 4: Chat Screen (hz-chat-screen.tsx)
Location: When job is completed

Add: Invoice quick action in chat bubble:

Appears as a card suggestion from UstadJi

Card text: "Service is complete! Would you like the invoice?"

Two action buttons below:

"View Invoice" (primary button, background #161533, text white)

"Ask Question" (secondary button, transparent background, border 1px #161533)

Location: Active booking banner (top of chat)

Add: "View Invoice" link when booking status is "Completed"

Current: Shows "View →" link to job-status

Add: "View Invoice" link next to it or below

Style: Text link, color #161533, underlined

SCREEN 5: Bookings Screen (hz-bookings-screen.tsx)
Location: Each completed booking card

Add: "View Invoice" link at bottom of card

Position: Below the amount and after the status pill

Style: Text link, font: Inter Regular, size: 12px, color: #161533

With document icon before text

Action: Navigates to customer invoice view

Card Layout Update:

text
Service Name - Provider Name
Date, Time
[Completed] status pill
Amount: PKR 5,535
View Invoice → (new link)
SCREEN 6: Job Status Screen (hz-job-status-screen.tsx)
Location: Below the step tracker

Add: Invoice Status Card

Card Design:

Background: #FFFFFF

Border-radius: 8px

Padding: 16px

Border: 1px solid #E8E3DB

Margin: 16px horizontal

Card Content:

Header: "Invoice Status" (font: Inter Bold, size: 14px, color: #161533)

Divider line: 1px solid #E8E3DB

Row 1: "Invoice #INV-2026-001" (font: Inter Regular, size: 14px, color: #1A1A1A)

Row 2: "Amount: PKR 5,535" (font: Inter Regular, size: 14px, color: #1A1A1A)

Row 3: Status badge "Sent to Customer" (background: #EEEEF5, color: #161533, padding: 4px 12px, border-radius: 12px)

Button: "View Invoice" (background: #161533, text white, border-radius: 8px, padding: 8px, full width, margin-top: 12px)

Card States:

If no invoice generated: Show "No invoice generated" with "Generate Now" button

If draft: Show "Draft" status with "Complete Invoice" button

If sent: Show "Sent to Customer" with "View Invoice" button

If paid: Show "Paid" with green badge and "View Invoice" button

SCREEN 7: Job Completion Screen (hz-job-completion-screen.tsx)
Location: Below the service completion confirmation

Add: Invoice Summary Card

Card Design:

Background: #FAF8F5

Border-radius: 8px

Padding: 16px

Margin: 16px horizontal

Card Content:

Header: "Invoice Generated" (font: Inter Bold, size: 14px, color: #161533)

Row 1: "Invoice #INV-2026-001" (font: Inter Regular, size: 14px, color: #1A1A1A)

Row 2: "Total Amount: PKR 5,535" (font: Inter Bold, size: 14px, color: #161533)

Two buttons side by side:

Left: "View Full Invoice" (background: #161533, text white, border-radius: 8px, flex: 1)

Right: "Send to Customer" (background: transparent, border: 1px solid #161533, text #161533, border-radius: 8px, flex: 1)

SCREEN 8: Provider Rate Consumer (hz-provider-rate-consumer.tsx)
Location: Bottom action buttons

Change: Update submission flow

Current: "Submit Rating" and "Skip" buttons → navigate to provider-dashboard

NEW: "Submit Rating" and "Skip" buttons → navigate to provider-invoice-generation screen

Explanation: After rating the customer, the provider should be directed to generate the invoice for the completed job

Button Labels: Keep same, change navigation target

SECTION 3: NEW SHARED COMPONENTS
COMPONENT 1: HzInvoiceCard
Purpose: Complete invoice display component used in multiple screens

Props:

text
{
  invoiceNumber: string;
  date: string;
  bookingReference: string;
  providerName: string;
  providerTitle: string;
  providerPhone: string;
  customerName: string;
  customerAddress: string;
  customerCity: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  fee: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  showActions?: boolean;
  onEdit?: () => void;
  onSend?: () => void;
  onDownload?: () => void;
  isEditable?: boolean;
}
Design: Same as invoice preview screen card

COMPONENT 2: HzInvoiceItemRow
Purpose: Single line item in invoice

Props:

text
{
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  isEditable?: boolean;
  onChangeDescription?: (value: string) => void;
  onChangeQuantity?: (value: number) => void;
  onChangeRate?: (value: number) => void;
  onRemove?: () => void;
}
Design:

When not editable: Four column grid (description, quantity, rate, amount)

When editable: Input fields in each column

Remove button (X) when editable

COMPONENT 3: HzVoiceWaveform
Purpose: Animated audio visualizer for recording

Props:

text
{
  isRecording: boolean;
  isPlaying: boolean;
  duration: number;
  onRecord?: () => void;
  onStop?: () => void;
  onPlay?: () => void;
  onClear?: () => void;
}
Design:

20 vertical bars of varying heights

Animated when recording or playing

Timer display (MM:SS format)

Record/Stop/Play controls

COMPONENT 4: HzInvoiceStats
Purpose: Stats cards for invoice history

Props:

text
{
  totalInvoices: number;
  totalRevenue: number;
  sent: number;
  pending: number;
  paid: number;
}
Design:

Horizontal scrollable row

Each stat in white card with border

Icon + number + label

SECTION 4: NEW MODALS / BOTTOM SHEETS
MODAL 1: Voice Input Bottom Sheet
File: hz-voice-input-bottom-sheet.tsx

Trigger: When tapping voice input tab in invoice generation

Design:

Slides up from bottom of screen

Height: 50% of screen height

Background: #FFFFFF

Rounded top corners (16px)

Drag handle at top (thin grey bar)

Content:

Header: "Voice Recording" (font: Inter Bold, size: 16px, color: #161533)

Close button (X) top right

Large microphone button centered (diameter: 64px)

Timer display below (MM:SS)

Waveform visualization (animated)

Record/Stop toggle button

"Use Recording" button at bottom (primary button)

MODAL 2: Send Invoice Modal
File: hz-invoice-send-modal.tsx

Trigger: Tapping "Send to Customer" in invoice preview

Design:

Centered modal (width: 90% of screen)

Background: #FFFFFF

Border-radius: 16px

Overlay: rgba(0,0,0,0.5)

Content:

Header: "Send Invoice to Customer" (font: Inter Bold, size: 16px, color: #161533)

Customer name display: "Ahmed Khan" (font: Inter Bold, size: 14px)

Four send options (each as tappable row):

WhatsApp (green background option)
SMS (blue background option)
Email (grey background option)
Copy Link (transparent option)
Cancel button at bottom (text button, font: Inter Regular, size: 14px, color: #9B9B9B)

MODAL 3: Template Selector
File: hz-invoice-template-selector.tsx

Trigger: Tapping a template chip in invoice generation (text tab)

Design:

Bottom sheet (slides up from bottom)

Height: 60% of screen

Background: #FFFFFF

Rounded top corners

Content:

Header: "Select Template" (font: Inter Bold, size: 16px, color: #161533)

Grid of template cards (2 columns)

Each card:

Service name (font: Inter Bold, size: 14px)

Common items preview (3 bullet points, font: Inter Regular, size: 11px)

Estimated price range (font: Inter Regular, size: 11px, color: #9B9B9B)

Template categories:

Plumbing Repair, AC Service, Electrical Work, Cleaning Service, Carpentry, Painting, Appliance Repair

Tapping a card auto-fills the text input

Close button at bottom

SECTION 5: NAVIGATION FLOW
Complete Navigation Map with Invoice Feature:
text
provider-active-job
    │
    ├── [Mark as Completed] → provider-rate-consumer
    │                         └── [Submit/Skip] → provider-invoice-generation (NEW)
    │
    └── [Generate Invoice] → provider-invoice-generation (NEW)
                              │
                              ├── Voice Tab → Voice Input Sheet (NEW)
                              │                 └── [Use Recording] → AI Analysis
                              │
                              └── Text Tab → Text Input + Analyze with AI
                                              └── [Analyze] → AI Analysis
                                                            
                              ├── AI Analysis Results
                              │
                              └── [Generate Invoice] → invoice-preview (NEW)
                                                         │
                                                         ├── [Edit Invoice] → Edit Mode
                                                         │                     └── [Save] → Preview
                                                         │
                                                         ├── [Send to Customer] → Send Modal (NEW)
                                                         │                         └── [Send] → Success Toast
                                                         │
                                                         └── [Download PDF] → Download Toast

provider-settings
    └── [Invoices] → invoice-history (NEW)
                     │
                     ├── [New Invoice] → provider-invoice-generation
                     │
                     └── [Card Tap] → invoice-preview

chat-screen (when job complete)
    └── [View Invoice] → customer-invoice-view (NEW)
                          │
                          ├── [Pay Now] → Payment Flow (future)
                          ├── [Download Invoice] → Download
                          └── [Ask Question] → chat

bookings-screen (completed bookings)
    └── [View Invoice] → customer-invoice-view

job-status-screen
    └── [View Invoice] → customer-invoice-view

job-completion-screen
    ├── [View Full Invoice] → invoice-preview
    └── [Send to Customer] → Send Modal
SECTION 6: DESIGN SYSTEM ADDITIONS
New Colors:
text
--hz-invoice-blue: #0066CC
--hz-invoice-green: #4CAF84
--hz-invoice-gold: #FFC107
--hz-invoice-red: #FF0000
--hz-invoice-light-bg: #FAF8F5
--hz-invoice-border: #E8E3DB
New Typography:
text
All existing typography from prototype remains same
No new font sizes or styles needed
Use existing HzHeading, HzBody, HzLabel, HzCaption, HzPrice
New Badge Variants:
Draft: Grey background (#F5F5F5), grey text (#9B9B9B)

Sent: Blue background (#EEF5FF), blue text (#0066CC)

Paid: Green background (#E8F5E9), green text (#4CAF84)

Overdue: Red background (#FFEBEE), red text (#FF0000)

New Icons Needed (from existing icon set or simple SVG):
Microphone

Document/Invoice

Download

Share

Checkmark

Warning

Edit (pencil)

Send (paper plane)

Copy (two overlapping squares)

SECTION 7: ANIMATION REQUIREMENTS
Voice Recording:
Pulse animation on microphone button (scaling up and fading)

Waveform bars animating up and down

Timer counting up (MM:SS format)

Smooth transition when switching between Voice and Text tabs

AI Analysis:
Skeleton loading shimmer effect on results card

Progress bar filling from 0% to 100%

Items appearing one by one (staggered fade-in)

Confidence score counting up to final value

Invoice Generation:
Invoice card fading in with slight upward animation (ease-out)

Success toast sliding in from bottom

Number formatting with comma animation (for large numbers)

Signature:
Smooth drawing path (follows finger/touch)

Pressures sensitivity (thicker when pressed harder)

SECTION 8: MULTILINGUAL SUPPORT
Labels in Urdu:
English	Urdu
Generate Invoice	انوائس بنائیں
Voice	آواز
Text	تحریر
Analyze with AI	اے آئی سے تجزیہ کریں
Send to Customer	گاہک کو بھیجیں
Edit Invoice	انوائس میں ترمیم کریں
Download PDF	پی ڈی ایف ڈاؤن لوڈ کریں
Invoice Generated!	انوائس تیار!
Grand Total	کل رقم
Subtotal	ذیلی کل
Service Fee	سروس فیس
Tax	ٹیکس
Payment Status	ادائیگی کی حالت
Paid	ادا شدہ
Unpaid	غیر ادا شدہ
Draft	مسودہ
Sent	بھیجا گیا
Terms	شرائط
SECTION 9: IMPLEMENTATION NOTES FOR FIGMA
File Organization:
Create new page in Figma file named "Invoice Feature"

Add all new screens to this page

For modified screens, create duplicate frames or add layer with note "NEW"

Name layers consistently: ScreenName_ElementName

Frame Specifications:
All frames: 390 x 844 (consistent with existing prototype)

Use existing color variables from prototype

Use existing text styles from prototype

Component Organization:
Create new component page for shared components

Add HzInvoiceCard, HzInvoiceItemRow, HzVoiceWaveform, HzInvoiceStats

Publish as main components for reuse

Interaction Prototyping:
Add prototyping links between screens

Show navigation flows with arrows

Add micro-interactions (tap states, hover states)

Handoff Notes:
Clearly mark which elements are new vs existing

Add notes for developer about which screens are modified

Include redline specs for spacing and typography

SECTION 10: ACCESSIBILITY REQUIREMENTS
Touch Targets:
All interactive elements minimum 44px x 44px

Button heights minimum 48px

Spacing between clickable elements minimum 8px

Typography:
Body text minimum 14px

Labels minimum 12px

Headings minimum 16px

High contrast: #1A1A1A on white, #FFFFFF on #161533

VoiceOver/Narrator:
All icons have alt text labels

All form fields have labels

Dynamic content has accessibility announcements

FINAL CHECKLIST
New Screens (4):
□ hz-provider-invoice-generation.tsx
□ hz-invoice-preview-screen.tsx
□ hz-invoice-history.tsx
□ hz-customer-invoice-view.tsx
Modified Screens (8):
□ hz-provider-active-job.tsx
□ hz-provider-dashboard.tsx
□ hz-provider-profile.tsx
□ hz-chat-screen.tsx
□ hz-bookings-screen.tsx
□ hz-job-status-screen.tsx
□ hz-job-completion-screen.tsx
□ hz-provider-rate-consumer.tsx
New Components (4):
□ HzInvoiceCard
□ HzInvoiceItemRow
□ HzVoiceWaveform
□ HzInvoiceStats
New Modals (3):
□ hz-voice-input-bottom-sheet.tsx
□ hz-invoice-send-modal.tsx
□ hz-invoice-template-selector.tsx
Navigation:
□ Update App.tsx with new routes
□ Add navigation transitions
□ Ensure back navigation works correctly
Design System:
□ Add new colors
□ Add new badge variants
□ Add new icons
□ Document new components