# Ustadji — MVP Plan

**AI-powered home services marketplace for Islamabad's informal economy**

---

## 1. What We're Building

Ustadji connects consumers who need home services (plumbing, electrical, AC repair, carpentry, cleaning) with local service providers, through an AI agent ("Ustadji") that understands the problem, finds and ranks the right provider, manages the booking, and produces a transparent, disputed-free bill at the end.

**MVP definition (from the design spec):** *the app cannot function without this — every item below is a blocker for launch.* Anything that needs data that doesn't exist yet (historical bookings, labeled datasets) is explicitly Scope 2 and deferred (see Section 8).

---

## 2. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Mobile frontend | **React Native (Expo)** | Android primary, iOS compatible |
| Backend | **Flask (Python)** | REST API, deployable on any Linux VPS |
| Conversational agent (text) | **Groq (LLaMA)** | Fast inference for the Ustadji agent's conversational NLU |
| Vision / structured extraction | **Claude Sonnet (Anthropic API)** | Damage assessment (image), invoice NLP extraction (text) |
| Speech-to-text | **OpenAI Whisper-1** | Urdu / Roman Urdu / English transcription |
| Database | **Supabase (PostgreSQL)** | Relational core + JSONB for flexible AI outputs |
| File storage | **Supabase Storage** | Damage photos, voice recordings, signatures |
| Auth | **Supabase Auth** | JWT-based, shared across consumer and provider apps |
| Real-time | **Supabase Realtime** | Booking status updates, provider dispatch |

This stack is intentionally lean for MVP: Flask + Supabase avoids standing up separate infra for queues/cache at launch — Supabase Realtime and Postgres cover the MVP's real-time and data needs. Revisit (Redis, background workers, etc.) once usage data justifies it.

---

## 3. MVP Scope — Must-Have Modules

| # | Module | What it does | Depends on |
|---|---|---|---|
| M1 | **Consumer onboarding** | Account creation, location (sector), service category selection — entry point for all bookings | Supabase Auth |
| M2 | **Provider onboarding** | Ustadji agent conversational onboarding across trade, sectors covered, rates, availability (5 DB tables) | Supabase, Groq |
| M3 | **Ustadji consumer agent** | Intent extraction, provider search & ranking, dynamic pricing, booking creation & confirmation | Groq, Supabase |
| M4 | **Provider dispatch** | Job notification, accept/decline, real-time booking status updates | Supabase Realtime |
| M5 | **Booking management** | View active/past bookings, reschedule, cancel, track through 8 lifecycle phases | Supabase |
| M6 | **Reviews & ratings** | Post-job 1–5 star + text review, feeds provider ranking formula | Supabase |
| M7 | **Multimodal damage assessment** | Photo/video → Vision LLM → structured ticket, pre-fills provider dispatch | Anthropic Vision API |
| M8 | **Smart dynamic pricing engine** | Voice note → Whisper → NLP extraction → deterministic formula → confirmation + signature | Whisper, Anthropic API |
| M9 | **Dispute handling** | Consumer raises dispute → Ustadji classifies → resolution workflow (phase 8) | Groq, Supabase |
| M10 | **Safety escalation** | Hazard detection in text (M3) and vision (M7) input; auto-override severity to emergency | Embedded in M3 + M7 |

---

## 4. The 8-Phase Booking Lifecycle

1. **Request initiation** — consumer describes issue / uploads photo to Ustadji
2. **Intent & category extraction** — M3 + M7 determine service category, urgency
3. **Provider search & ranking** — M3 matches and ranks nearby providers
4. **Dispatch & acceptance** — M4 notifies provider, waits for accept/decline
5. **Price estimation & confirmation** — preliminary pricing shown to consumer
6. **Service execution** — provider en route → on-site → working
7. **Completion & billing** — M8 voice-to-invoice flow, signature capture
8. **Review / dispute** — M6 rating, or M9 dispute resolution if raised

Every phase transition should be timestamped and logged (see Section 7) — this is what makes the funnel debuggable after launch.

---

## 5. Core Data Model (MVP)

Minimum tables needed at launch. JSONB is used deliberately for AI-generated structured output so schema doesn't need to change as prompts evolve.

```
users                  -- consumers (Supabase Auth linked)
providers              -- trade, sectors, rates, availability
service_tickets        -- one per request; includes damage_photo_url, damage_assessment (JSONB)
bookings               -- status, phase tracking, timestamps, providers_contacted, first_rank_used
invoices               -- voice_transcript, extracted_data (JSONB), line_items (JSONB), subtotal, total, status
reviews                -- rating, text, linked to booking + provider
agent_sessions         -- phase_log (JSONB), total_turns, completed  → funnel analytics
disputes               -- linked booking, classification, resolution status
```

Key design decision: **every AI feature writes structured JSONB, and every deterministic calculation (pricing) happens in application code, never inside the LLM call.** This keeps billing auditable and prevents hallucinated prices.

---

## 6. Feature Build Details

### 6.1 Feature M7 — Multimodal Damage Assessment
- Consumer captures photo/video via Expo `ImagePicker` (compressed to 70% quality, base64-encoded)
- Video → Flask extracts a frame at the 3-second mark via `ffmpeg` before sending to the Vision LLM
- Flask sends image + a fixed-schema prompt to **Claude Sonnet**, parses the returned JSON directly (no free text) into `service_tickets.damage_assessment`
- Server enforces a **safety override**: if `safety_hazard: true`, severity is force-set to `emergency` — never trusted from a client-editable value
- Result is injected into the Ustadji agent's system prompt so it "knows" the issue without the user re-describing it, and is shown on the provider's dispatch card (photo + parts list) before they leave for the job

### 6.2 Feature M8 — Smart Dynamic Pricing Engine
- After marking a job complete, provider records a voice note (Expo `Audio` API) describing work done, parts used, time spent
- Flask sends the audio to **Whisper-1** (`language='ur'` handles Urdu/Roman Urdu/English code-switching)
- Transcript → **Claude** extracts structured invoice data (work items, parts, labor hours, complexity) into fixed JSON, including a `missing_info` array
- If `missing_info` is non-empty, Ustadji asks the provider up to 2 targeted follow-up questions before proceeding
- A **deterministic Python formula** (labor rate × complexity multiplier + parts + travel + 10% platform fee) computes the bill — the LLM never computes a price, only extracts facts
- Consumer reviews the itemized bill, confirms, provider captures a digital signature (`react-native-signature-canvas`) uploaded to Supabase Storage, booking marked `completed`

### 6.3 How M7 and M8 connect
`likely_parts_needed` from the pre-job damage assessment (M7) pre-populates the post-job invoice's `parts_used` (M8) — the provider only confirms/adjusts instead of listing from scratch. This cuts voice note length and extraction error rate simultaneously.

---

## 7. Instrumentation (build this in from day one)

A few schema additions unlock the entire MVP funnel analysis without extra infra:

```sql
ALTER TABLE agent_sessions
  ADD COLUMN phase_log JSONB DEFAULT '[]',
  ADD COLUMN total_turns INT DEFAULT 0,
  ADD COLUMN completed BOOLEAN DEFAULT FALSE;

ALTER TABLE bookings
  ADD COLUMN providers_contacted INT DEFAULT 1,
  ADD COLUMN first_rank_used BOOLEAN,
  ADD COLUMN time_to_confirm_sec INT;
```

This is also the **data flywheel for Scope 2** — predictive maintenance, demand heatmaps, and fraud detection all depend on data that only accumulates if the MVP logs it from day one. Design the schema with these future fields in mind now; migrations later are expensive.

---

## 8. Explicitly Out of Scope for MVP (Scope 2)

Deferred because they require historical data or infra that doesn't exist at launch. The platform functions without these — they make it meaningfully better later.

| # | Feature | Blocked on |
|---|---|---|
| S1 | Predictive maintenance alerts | 6 months of booking history per appliance type |
| S2 | Peak-hour demand heatmaps | 3 months of timestamped booking requests |
| S3 | Fake review detection | 500+ labeled genuine/fake reviews |
| S4 | Fraud/anomaly detection engine | 3–6 months of activity logs, labeled fraud cases |
| S5 | Payment gateway (JazzCash/Easypaisa) | Payment partner agreement + KYC compliance |
| S6 | Real-time GPS tracking | WebSocket infra + always-on location permissions |
| S7 | Damage-assessment model fine-tuning | 1,000+ labeled before/after repair photos |
| S8 | Provider earnings forecasting | 60+ days of per-provider booking history |

Also deferred (from the broader feature list, same reasoning — nice-to-have, not a blocker): full voice-powered UI with real-time translation, home renovation planning, autonomous profile-optimization agent, proof-of-work vision cross-checking, conflicting-review detection, smart auto-rescheduling, badges, referral program.

---

## 9. Build Order (4-week core timeline)

Core marketplace (M1–M6, M9, M10) and the two AI features (M7, M8) can largely be built in parallel by splitting the team across "platform" and "AI features" tracks.

**Track A — Platform (M1–M6, M9, M10)**
- **Week 1:** Supabase schema (users, providers, bookings, service_tickets) + Auth. Consumer & provider onboarding screens.
- **Week 2:** Ustadji consumer agent (Groq) — intent extraction, provider search/ranking, booking creation. Safety keyword-detection layer (M10).
- **Week 3:** Provider dispatch (Realtime), booking management screens, 8-phase status tracking, dispute workflow skeleton (M9).
- **Week 4:** Reviews & ratings, phase-log instrumentation, end-to-end QA of the full booking lifecycle.

**Track B — AI Features (M7, M8)**
- **Week 1:** Flask endpoint + Claude Vision call + structured prompt (test on 20–30 real photos). Flask endpoint + Whisper transcription (test on real provider voice samples). Supabase schema additions (`damage_assessment`, `invoices` table).
- **Week 2:** RN camera component → Flask → display JSON. Claude NLP invoice-extraction prompt + `missing_info` detection. Pricing formula + config table, unit-tested.
- **Week 3:** Agent system-prompt injection from `damage_assessment`. Provider ticket card (photo + parts list). RN voice-recording component. Consumer bill-confirmation screen.
- **Week 4:** Digital signature capture + Storage upload + booking completion. M7 → M8 data handoff (parts pre-population). ffmpeg video-frame extraction + safety-override testing.

**Week 5 (joint):** Integration testing across both tracks, load/latency testing on Vision + Whisper calls (show a processing animation and run assessment async if p95 latency > ~10s), metrics dashboard wired to the queries in Section 10, soft launch.

---

## 10. MVP Success Metrics

Tracked from the queries defined against `agent_sessions` and `bookings` (Section 7).

| Metric | Target at launch |
|---|---|
| Booking completion rate (★ north star) | > 65% |
| Time to book (unambiguous request) | < 90 seconds |
| Post-booking cancellation rate | < 15% |
| Match acceptance rate (provider) | > 80% |
| Safety recall (M7 + M10) | > 98% |
| Bill dispute rate | < 8% |
| Signature capture rate | > 95% |
| Provider onboarding completion | > 70% |
| Vision / Whisper API success rate | > 95–98% |
| API cost per completed booking | < PKR 50 |

Daily watch: booking completion rate by phase drop-off — this single metric surfaces AI quality issues, supply gaps, pricing problems, and UX friction simultaneously.

---

## 11. Key Risks Going Into MVP

| Risk | Mitigation |
|---|---|
| Blurry/dark damage photos → poor assessment | Prompt returns a confidence/quality score; ask user to retake if low |
| Whisper mishears numbers (400 vs 4000) | Show transcript to provider for confirmation before computing bill; flag large deviations |
| Provider skips voice note | Make it mandatory to mark job complete; fallback manual form |
| Safety hazard missed | Server-side override is the last line of defense; supplement with keyword detection as a parallel check |
| Vision/Whisper latency spikes | Run assessment async, notify via push when ready, show processing state in UI |

---

*This plan translates the Ustadji AI Feature Design Document (v2.0) into a build-ready MVP scope, timeline, and success criteria. It intentionally excludes anything that needs data the platform doesn't have yet — those are tracked in Section 8 as the immediate post-MVP roadmap.*
