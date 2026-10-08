# UstadJi — AI Feature Screens: Figma Make Build Plan

This is a paste-ready sequence of prompts for the Figma Make agent, covering three new feature areas:

1. **AI-Assisted Issue Understanding** (Consumer flow)
2. **AI Conversational Booking Agent** (Consumer flow — enhances existing Chat)
3. **AI Profile Optimization** (Provider flow)

**How to use this doc:** Paste Section 0 first (sets shared context/design system so every later screen stays consistent). Then paste each screen prompt in Sections 1–3 one at a time, in order, so Figma Make builds and connects them incrementally rather than trying to generate everything at once.

---

## Section 0 — Context Prompt (paste first)

```
I'm extending an existing app prototype called "UstadJi" — a home services 
marketplace connecting customers with verified professionals (plumbers, 
electricians, cleaners, technicians) in Pakistan. Match the existing design 
system exactly:

DESIGN SYSTEM
- Background: warm off-white / cream (#F5F3EF)
- Primary color: deep navy (#171733), used for primary buttons, selected 
  states, headings, and the circular logo badge
- Cards: white, rounded corners (~20px radius), soft subtle drop shadow
- Buttons: full-width, pill-shaped (fully rounded), navy fill with white 
  bold text for primary actions; outlined/ghost style for secondary
- Selectable tags/chips: pill-shaped, white/outlined when unselected, 
  solid navy fill with white text when selected
- Input fields: white rounded rectangles with a leading icon (person, 
  phone, lock, envelope, mic, camera, etc.), gray placeholder text
- Typography: clean modern sans-serif, bold dark-navy/near-black headings, 
  gray body text, generous line height
- Progress indicators: thin navy bar on a light gray track, with a 
  "Step X of Y" label and section name above it
- Chat pattern: white rounded message bubbles in a scrollable feed, fixed 
  bottom input bar with placeholder text and a circular navy send button 
  (up-arrow icon)
- Avatar/logo badge: solid navy circle with a bold white initial or icon
- Tone of voice / copy: bilingual Roman Urdu + English, warm and 
  personal, address the user by first name where possible (e.g. 
  "Shukriya, Zain! Aap kaunsi services offer karte hain?")

APP STRUCTURE (for context — don't build yet)
UstadJi has three user flows: Consumer, Provider, and Admin, connected by 
a Chat-centric consumer experience and a Dashboard-centric provider 
experience. I'm about to add three new AI-powered feature areas into this 
existing structure. I'll describe each one in the next messages — please 
keep every new screen visually and tonally consistent with what I just 
described, and reuse existing components (cards, pills, chat bubbles, 
progress bars) rather than inventing new patterns where an existing one 
already fits.
```

---

## Section 1 — AI-Assisted Issue Understanding (Consumer flow)

**Where it fits:** Inserted between `Chat` and `Provider Results` in the existing map. Entry point is a new "Report an Issue" action from the Chat screen (e.g., a `+` / camera icon near the input bar), replacing a plain text-only request with a guided multimodal capture flow. Ends by handing a structured summary into the existing `[onFindProvider] → Provider Results` path.

**Updated flow:**
```
Chat
  └── [+ / Report Issue] → Upload Capture → Analyzing (AI) → Structured Summary Preview
                                                                    ├── Edit → back to Upload Capture
                                                                    ├── Media Gallery (view all uploads)
                                                                    └── Confirm → Provider Results
```

### Prompt 1.1 — Upload Capture screen
```
Create a new screen called "Upload Capture" for the Issue Understanding 
flow. Purpose: let the customer describe their problem using photos, 
video, or voice instead of typing.

Layout:
- Header: back arrow, title "Describe the Issue" / subtitle in Roman 
  Urdu-English: "Photo, video ya voice — jo aasan ho"
- Three large tappable option cards in a row (or stacked on narrow 
  screens): "Take Photo" (camera icon), "Record Video" (video icon), 
  "Voice Note" (mic icon) — white cards, navy icon, consistent with 
  existing card style
- Below that, a horizontally scrolling strip of thumbnail previews for 
  anything already added, each with a small "x" remove button in the 
  corner
- A free-text field below the media strip: "Add more detail (optional)" 
  with placeholder like "e.g. AC not cooling since morning"
- Bottom: full-width navy pill button "Continue" — disabled/greyed until 
  at least one media item or text is added
- Small helper text under the button: "Aap jitni detail denge, humara AI 
  utni behtar madad karega"
```

### Prompt 1.2 — Analyzing state
```
Create an "Analyzing" transitional screen shown after the customer taps 
Continue. Keep it simple and reassuring, not a generic spinner:
- Centered navy circular badge with a subtle pulsing/breathing animation
- Headline: "Samajh rahe hain..." / "Understanding your issue"
- 2-3 short status lines that could cycle or stack, e.g. "Reading your 
  photos", "Checking service category", "Estimating urgency"
- No back button — this is a brief automatic transition (assume ~2-3 
  seconds) into the Structured Summary Preview screen
```

### Prompt 1.3 — Structured Summary Preview screen
```
Create a "Structured Summary Preview" screen. Purpose: show the AI's 
structured interpretation of the uploaded media/text before matching 
providers, and let the customer confirm or correct it.

Layout:
- Header: "Yahan Hai Aapka Summary" / "Here's what we understood"
- A summary card (white, rounded) with labeled rows, each with a small 
  edit (pencil) icon on the right:
  - Service Category (e.g. "AC Repairing") — shown as a navy pill
  - Urgency level — small tag: Low / Medium / High, color-coded but 
    staying within the navy/neutral palette (e.g. navy = high, gray = low)
  - Estimated Issue: 1-2 sentence AI-generated plain description
  - Suggested Scope: short bullet list (e.g. "Gas refill likely needed", 
    "Possible compressor check")
- Thumbnail row of the uploaded media (tap to open Media Gallery)
- Two buttons at bottom: outlined "Edit Details" (secondary) and full 
  navy pill "Confirm & Find Providers" (primary) — this leads into the 
  existing Provider Results screen
```

### Prompt 1.4 — Media Gallery screen
```
Create a "Media Gallery" screen reached by tapping any thumbnail on the 
Structured Summary Preview screen. Purpose: full review of everything 
uploaded.

Layout:
- Header with back arrow, title "Uploaded Media", count badge (e.g. "4 
  items")
- Grid of thumbnails (2-3 columns), tap to open full-screen viewer with 
  swipe between items
- Voice notes shown as a card with a waveform icon and play button 
  rather than a thumbnail
- Each item has a small delete (trash) icon on long-press or corner tap
- Bottom: "Add More" ghost button that returns to Upload Capture
```

---

## Section 2 — AI Conversational Booking Agent (Consumer flow)

**Where it fits:** This upgrades the existing `Chat` hub screen already referenced in the nav map (the same chat-bubble pattern already used in Provider Registration, per your screenshot). It becomes the primary way customers talk to the AI to find/book services, with the existing `[mini cards] → Provider Results` and `[onFindProvider]` actions now triggered from within the conversation rather than as separate buttons.

**Updated flow:**
```
Chat (AI Conversational Agent)
  ├── [voice toggle] → Voice Listening state → back to Chat with transcribed text
  ├── [intent suggestion chip] → pre-fills or sends a quick message
  ├── [agent response: provider mini-cards] → Provider Results / Provider Profile
  ├── [agent response: booking card] → Booking Confirm
  └── [fallback: "I didn't get that"] → Human handoff / Report Issue flow
```

### Prompt 2.1 — Main Chat / Agent screen (default + populated states)
```
Build the primary "Chat" screen as an AI conversational booking agent. 
Two states needed:

STATE A — Empty/first-time state:
- Navy circular logo badge at top, greeting: "Assalam-o-Alaikum, Zain! 
  Main aapki kis tarah madad kar sakta hoon?"
- A vertical stack of 3-4 suggestion cards below the greeting (not chips 
  yet — bigger tappable cards), e.g. "Book a Service", "Track My 
  Booking", "Report an Issue", "Talk to Support" — each with a small 
  navy icon
- Bottom input bar (see shared spec below)

STATE B — Active conversation:
- Scrollable message feed. User messages: navy filled bubble, right- 
  aligned, white text. Agent messages: white bubble, left-aligned, navy 
  text, with the small navy avatar badge beside it
- Below select agent messages, a row of horizontally scrollable 
  "intent suggestion" chips (pill-shaped, outlined navy) offering quick 
  replies, e.g. "Yes, book now", "Show more options", "Change location"
- When the agent recommends providers, render them as the existing 
  mini-card component (photo, name, rating, price range, "View Profile" 
  button) embedded directly in the chat feed, 1-2 per message
- Bottom input bar: rounded white pill container with a text field 
  ("Type or select an option above..."), a mic icon button on the left 
  of the field, and a circular navy send button (up arrow) on the right
```

### Prompt 2.2 — Voice input active state
```
Create a "Voice Listening" overlay/state triggered by tapping the mic 
icon in the Chat input bar. 
- Input bar expands or a bottom sheet appears showing a live waveform 
  animation in navy
- Small label: "Sun raha hoon..." / "Listening..."
- A large circular mic button, pulsing, centered above the waveform
- Cancel (x) on one side, Send/confirm (checkmark) on the other, both 
  circular
- On send, transcribed text appears as a normal outgoing chat bubble and 
  the view returns to the standard Chat state
```

### Prompt 2.3 — Agent fallback / handoff state
```
Add a fallback agent message style for when intent isn't understood: 
white bubble with a slightly different accent (e.g. a small warning-tone 
icon, still within the navy/neutral palette — avoid red), text like 
"Mujhe thori confusion hui — kya aap dobara bata sakte hain?" followed by 
two chip options: "Try Again" and "Talk to a Human" (the latter would 
route to a support/dispute flow).
```

---

## Section 3 — AI Profile Optimization (Provider flow)

**Where it fits:** New entry point from `Provider Settings` (and optionally a banner/card on `Provider Dashboard`), alongside the existing `Rewards Hub` and `Invoice History` items.

**Updated flow:**
```
Provider Dashboard
  └── [optional banner: "Boost your profile"] → Performance Insights

Provider Settings
  └── [Optimize My Profile] → Performance Insights
                                   └── Recommendation Cards
                                             └── Before/After Profile Preview
                                                       ├── Accept → Applied confirmation → Provider Settings
                                                       └── Reject/Keep Editing → back to Recommendation Cards
```

### Prompt 3.1 — Performance Insights screen
```
Create a "Performance Insights" screen for providers, reached from 
Provider Settings ("Optimize My Profile").

Layout:
- Header: "Your Profile Performance"
- Row of 2-3 stat cards (white, rounded, in a grid): "Profile Views" 
  (with a small up/down trend arrow + %), "Booking Conversion Rate", 
  "Avg. Response Time" — big navy number, small gray label underneath
- Below that, a simple trend line/bar chart (last 30 days) in navy on 
  the cream background, minimal gridlines
- An "AI Insight" callout card: light navy-tinted background, icon + 
  short generated insight text, e.g. "Providers with 5+ photos get 40% 
  more bookings — you currently have 2."
- Bottom: full-width navy pill button "See Recommendations"
```

### Prompt 3.2 — Recommendation Cards screen
```
Create a "Recommendations" screen listing AI-generated profile 
improvement suggestions as a vertical stack of cards.

Each card contains:
- Small impact tag in the corner (pill-shaped): "High Impact" / "Quick 
  Win" / "Optional" — styled as navy-outlined or navy-filled by 
  priority
- Short title, e.g. "Add more work photos"
- 1-2 line explanation of why it helps
- Two small buttons at the bottom of the card: outlined "Dismiss" and 
  filled navy "Apply" (or "Preview" if it needs a before/after view, 
  such as bio rewrites or photo changes)
- Cards can be swiped away to dismiss, or tapped to expand

Header: "Recommendations for You", subtitle showing count, e.g. "5 ways 
to improve your profile"
```

### Prompt 3.3 — Before/After Profile Preview screen
```
Create a "Before / After Preview" screen shown when a provider taps 
"Preview" on a recommendation (e.g. an AI-rewritten bio, or a reordered 
photo gallery).

Layout:
- Toggle control at top: "Current" / "Suggested" (segmented control, 
  navy fill on active segment)
- Below it, render the relevant profile section using the same 
  component as the real Provider Profile screen, populated with either 
  the current or AI-suggested version depending on toggle state — so 
  it's a true side-by-side comparison via toggle, not two screens 
  rendered at once
- Small "What changed" summary chip/text under the toggle, e.g. "Bio 
  shortened, added certifications, removed repeated phrase"
- Bottom: two buttons — outlined "Keep Current" and filled navy "Use 
  Suggested Version"
- On accept, show a brief confirmation toast/state: "Profile updated ✓" 
  before returning to Provider Settings
```

---

## Shared Components to Reuse (don't recreate)

| Component | Already exists in | Reuse for |
|---|---|---|
| Mini provider card | Provider Results / Chat mini cards | Chat agent recommendations |
| Pill tag (selectable) | Provider Registration (Services Offered) | Intent chips, impact tags |
| Progress bar + step label | Provider Registration | Not needed here, but keep style available |
| Chat bubble + bottom input bar | Provider Registration conversational step | Main Chat screen (Section 2) |
| Circular navy avatar/logo badge | Splash / Welcome | Agent avatar in chat |

## Copy Style Notes for Figma Make
- Mix Roman Urdu and English naturally within the same sentence, not alternating whole sentences.
- Address the user by first name when a name is available in context.
- Keep AI-generated explanations short (1–2 sentences) — this app's existing tone is warm but efficient, not verbose.
- Avoid red/alarm colors even for "high urgency" or "fallback" states — stay within the navy/cream/gray palette with weight (bold, filled vs outlined) doing the work instead of color-coding by hue.

## Suggested Updated Screen Counts
Your original count was 47 screens. These additions would bring it to roughly:
- Consumer: +4 (Upload Capture, Analyzing, Summary Preview, Media Gallery) → 24
- Consumer (chat states, counted as overlays/states rather than new screens): Voice Listening, Fallback state
- Provider: +3 (Performance Insights, Recommendations, Before/After Preview) → 20
- New total: ~54 screens
