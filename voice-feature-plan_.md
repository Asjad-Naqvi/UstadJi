# Ustadji — Voice-Powered Booking Feature: Development & Integration Plan

**Feature: Speak to Ustadji in Urdu, English, or Roman Urdu to search, book, and manage services — real-time transcription and translation feeding the booking agent.**

---

## 1. What This Feature Actually Requires

"Talk to the agent to book" is not one component — it's a pipeline. Every stage has to work before the user experience feels real-time:

```
Mic input → Voice Activity Detection → Speech-to-Text (STT)
   → Language Detection / Normalization → Translation (if needed)
   → Ustadji Agent (intent + booking logic) → Response text
   → Text-to-Speech (optional, for spoken replies) → Audio out
```

The MVP plan (plan1.md) already scoped voice notes for **post-job invoicing** (Whisper, one-shot transcription). This is different: it's a **live, turn-based conversation** used for **booking**, which means latency, streaming, and multi-turn context matter in ways the invoice flow didn't.

---

## 2. Scope Decision: MVP vs. This Feature

| | Invoice voice note (already in plan1.md) | Voice booking (this plan) |
|---|---|---|
| Interaction | Single recording, one-shot | Multi-turn conversation |
| Latency tolerance | Seconds are fine (async, provider isn't waiting on UI) | Needs to feel conversational — under ~3s per turn |
| Language handling | Whisper `language='ur'`, done | Needs Urdu / English / Roman Urdu detection + normalization |
| Translation | Not needed | Needed — agent reasons in one working language internally |

**Recommendation:** ship this as a **Phase 2 feature**, after the text-based Ustadji agent (M3 in plan1.md) is live and stable. Voice booking should be a new input modality on top of the *same* agent and booking logic — not a parallel system. Building it this way means you're only ever debugging the mic → text pipeline, never the booking logic twice.

---

## 3. Architecture

```
┌─────────────────┐
│  React Native    │  expo-av / react-native-audio-recorder
│  (mic capture)    │  Voice Activity Detection (client-side, silence trims)
└────────┬──────────┘
         │ audio chunk (webm/m4a, 16kHz mono)
         ▼
┌─────────────────┐
│  Flask endpoint   │  /api/voice/transcribe
│  (audio ingest)    │
└────────┬──────────┘
         │
         ▼
┌─────────────────┐
│  Whisper-1 (STT)  │  language hint: auto-detect among ur/en
│  OpenAI API       │  returns: raw_text, detected_language, confidence
└────────┬──────────┘
         │
         ▼
┌───────────────────────┐
│ Roman Urdu Normalizer   │  custom dictionary + rules (Section 5)
│ (only if Roman Urdu)    │  "AC kharab hai" → normalized token form
└────────┬───────────────┘
         │
         ▼
┌───────────────────────┐
│ Translation layer       │  Claude/Groq: Urdu/Roman Urdu → English
│ (only if not English)   │  (agent reasons in English internally)
└────────┬───────────────┘
         │ english_text + original_text + detected_language
         ▼
┌───────────────────────┐
│ Ustadji Agent (M3)      │  same intent extraction / booking logic
│ Groq (LLaMA)             │  as the text-chat flow — no duplication
└────────┬───────────────┘
         │ response (English, generated in agent's working language)
         ▼
┌───────────────────────┐
│ Response translation    │  English → user's detected_language
│ (back-translate reply)  │
└────────┬───────────────┘
         │
         ▼
┌───────────────────────┐
│ Text-to-Speech (opt.)   │  ElevenLabs / Google Cloud TTS (Urdu voice)
└────────┬───────────────┘
         │
         ▼
   RN app: shows text + plays audio reply
```

**Key architectural decision:** the agent always reasons in English internally, regardless of input language. This keeps M3's intent-extraction prompts and booking logic identical for voice and text — you translate at the edges, not in the middle. Do not build a separate Urdu-native reasoning path; it doubles prompt-engineering and QA effort for no real gain at MVP scale.

---

## 4. Component-by-Component Plan

### 4.1 Client-side capture (React Native)
- Library: `expo-av` (Expo-managed) for recording; switch to `react-native-audio-recorder-player` only if you eject from Expo
- Format: record at 16kHz mono (Whisper's native rate) to avoid server-side resampling
- **Voice Activity Detection (VAD):** trim silence client-side before upload — reduces payload size and Whisper cost, and shortens perceived latency
- **Turn-taking UI:** push-to-talk for MVP (tap mic, speak, release) — full open-mic/continuous listening is a v2 feature, adds VAD/interruption complexity not worth it for booking flows
- Show a live waveform or pulsing indicator while recording so users know it's capturing

### 4.2 Speech-to-Text — Whisper-1
- Reuse the same OpenAI Whisper integration already planned for invoicing (plan1.md M8) — one client, one API key, one cost line
- Call with `language=None` (auto-detect) rather than forcing `ur`, since users will genuinely mix English and Urdu mid-sentence (code-switching) — Whisper handles this reasonably well without a hard language pin
- Capture Whisper's segment-level confidence; if below threshold, ask the user to repeat rather than silently passing garbage downstream

### 4.3 Language Detection & Roman Urdu Normalization
This is the hardest and least "off-the-shelf" part of the pipeline — Roman Urdu has no standard spelling ("theek," "thek," "thik" are all the same word).

- **Build a normalization dictionary**, not a model, for MVP: a lookup table mapping common Roman Urdu spelling variants → canonical tokens (domain-scoped to service categories: appliance names, problem words like "kharab," "toot gaya," "leak," price/time words)
- Bootstrap this dictionary from:
  - **Roman-Urdu-Parl** (or similar open Roman Urdu corpora on GitHub/Kaggle) — mine common spelling variants at scale
  - **CLE (Center for Language Engineering, Pakistan)** resources — for Urdu-script side reference and transliteration mapping
  - Real transcripts from your own Whisper pipeline as they accumulate (this is the highest-value source — actual user phrasing beats generic corpora)
- Fallback: if normalization confidence is low, just pass raw text through to the translation step — Claude/Groq are reasonably robust to messy Roman Urdu even without normalization; the dictionary is an accuracy booster, not a hard dependency

### 4.4 Translation Layer
- Use the same LLM already in the stack (Claude Sonnet or Groq) rather than a dedicated translation API — one fewer vendor, and it can be combined with intent hints in a single prompt ("translate to English, preserve service-related terms literally")
- Translate **user input → English** before it hits the Ustadji agent
- Translate **agent response → user's detected language** before display/speech — do this as a separate, simple call; don't ask the agent to "respond in Urdu" directly, since that couples booking-logic prompt quality to translation quality and makes both harder to debug independently

### 4.5 Ustadji Agent Integration
- **No changes to M3's core logic.** The agent receives English text and produces English text, exactly as in the text-chat flow
- Add a `session.input_modality` field (`text` | `voice`) and `session.language` to `agent_sessions` (already exists per plan1.md Section 7) — this lets you measure voice-specific completion rates separately from text
- Multi-turn state: voice sessions must persist conversation context across turns the same way text chat does — reuse the existing session/conversation ID mechanism, don't build a parallel state store

### 4.6 Text-to-Speech (optional for MVP, recommended for v1.1)
- Options: **ElevenLabs** (best Urdu voice quality, paid) or **Google Cloud TTS** (has Urdu support, cheaper)
- Recommendation: **launch voice booking with text-only responses first** (agent replies shown as text, possibly in the detected language) — add spoken replies once the STT→translation→agent loop is proven reliable. TTS adds cost and latency for a feature that's genuinely optional (most users can read the reply even if they prefer to speak).

---

## 5. Data & Testing Strategy

| Source | Use |
|---|---|
| **Mozilla Common Voice (Urdu subset)** | Test/validate the Whisper pipeline against clean Urdu audio before touching real users — establishes a baseline WER (word error rate) |
| **CLE (Center for Language Engineering, Pakistan)** | Urdu-script corpora/lexicons — reference for building the Roman Urdu ↔ Urdu-script normalization mapping |
| **Roman-Urdu-Parl / similar GitHub/Kaggle corpora** | Bootstrap the Roman Urdu normalization dictionary with real spelling-variant frequency data |
| **Your own accumulating transcripts** | Once live, this becomes the primary source — log every transcript + normalized form + agent outcome (see Section 7) to continuously expand the dictionary and catch failure patterns |

**Test plan before launch:**
1. Run 50–100 Common Voice Urdu clips through Whisper → measure WER, confirm it's usable before building anything downstream
2. Manually author ~100 realistic Roman Urdu booking phrases ("mera AC kharab hai," "plumber chahiye abhi," "kal subah aa sakte hain?") — record team members speaking them, run end-to-end through the full pipeline, check normalization + translation + agent intent extraction at each stage
3. Code-switching test set: sentences mixing English and Urdu mid-phrase (very common in Pakistan urban speech) — verify Whisper doesn't fail hard on these
4. Noisy-environment test: record samples with background noise (street, home) — booking calls won't happen in a quiet studio

---

## 6. Latency Budget

Conversational feel requires the full round trip to stay under ~3 seconds. Rough budget:

| Stage | Target |
|---|---|
| Upload audio (client → server) | < 300ms (VAD-trimmed clip should be small) |
| Whisper transcription | ~1–1.5s for short utterances |
| Normalization (dictionary lookup) | < 50ms, negligible |
| Translation (LLM call) | ~500ms–1s (Groq is fast; use it here even if Claude is used elsewhere) |
| Agent response (Groq, M3) | ~500ms–1s |
| Response translation back | ~500ms |
| **Total (text-only reply)** | **~3–4s** |
| + TTS generation (if enabled) | +1–2s — this is why TTS is deferred past MVP |

If real-world testing shows this budget blown, the first optimization is combining steps 4.3+4.4 (normalization + translation) into a single LLM call rather than sequential ones.

---

## 7. Instrumentation

Extend the `agent_sessions` table (already defined in plan1.md) rather than creating a parallel voice-specific table:

```sql
ALTER TABLE agent_sessions
  ADD COLUMN input_modality TEXT DEFAULT 'text',   -- 'text' | 'voice'
  ADD COLUMN detected_language TEXT,                -- 'ur' | 'en' | 'roman_ur' | 'mixed'
  ADD COLUMN stt_confidence FLOAT,
  ADD COLUMN raw_transcript TEXT,
  ADD COLUMN normalized_transcript TEXT,
  ADD COLUMN translation_used BOOLEAN DEFAULT FALSE;
```

This lets you directly compare **voice vs. text booking completion rate** — the single most important metric for deciding whether this feature is working or just a novelty.

---

## 8. Build Order (3-week integration, after M3 text agent is stable)

**Week 1 — Pipeline plumbing**
- RN mic capture component (push-to-talk, VAD trimming)
- Flask `/api/voice/transcribe` endpoint → Whisper integration
- Run Common Voice test set through pipeline, measure baseline WER
- Log raw transcripts to `agent_sessions` (schema from Section 7)

**Week 2 — Normalization + translation**
- Build Roman Urdu normalization dictionary v1 (seeded from Roman-Urdu-Parl + CLE resources)
- Translation layer (Groq/Claude call): user input → English
- Response translation: English → user's language
- Wire into existing Ustadji agent (M3) — verify zero changes needed to agent's own prompt/logic

**Week 3 — End-to-end + hardening**
- Full round-trip in RN app: record → transcribe → translate → agent → response → display
- Run the manual Roman Urdu test set (Section 5) end-to-end, fix normalization gaps found
- Noisy-environment and code-switching test passes
- Latency measurement against Section 6 budget; optimize if needed
- Soft launch to a small user cohort, monitor `agent_sessions` voice-vs-text completion rate daily

**Post-launch (v1.1, not MVP-blocking):**
- Text-to-Speech for spoken replies
- Continuous-listening mode (replace push-to-talk)
- Expand normalization dictionary from real accumulated transcripts

---

## 9. Success Metrics

| Metric | Target |
|---|---|
| Whisper WER on Common Voice Urdu baseline | < 15% |
| End-to-end turn latency (text-reply path) | < 4s at p95 |
| Voice booking completion rate | Within 10 percentage points of text booking completion rate (M3 target: >65%) |
| STT confidence below threshold (retry prompt shown) | < 10% of turns |
| Roman Urdu normalization hit rate | > 70% of tokens matched in dictionary within first month, trending up |

---

## 10. Continuous Learning Pipeline

Public datasets (Common Voice, Roman-Urdu-Parl, CLE) get the pipeline to a credible starting point — they don't capture your actual users speaking real Roman Urdu into a phone mic with a fridge running in the background. Closing that gap requires a deliberate feedback loop, not automatic self-updating models. New model versions are never deployed blind; every retrain is evaluated offline, shadow-tested, then A/B tested before it touches real traffic.

```
Real usage → Capture & label → Curate dataset → Retrain → Offline eval
   → Shadow test → A/B test → Deploy → back to Real usage
```

### 10.1 What gets captured, per component

**STT (Whisper fine-tune)**
- Log every `(audio, transcript, confidence_score)` triple to `agent_sessions` (schema below)
- The valuable signal is *correction*, not the raw transcript: when a user has to repeat themselves after a low-confidence transcription, or a disputed booking requires support to re-listen to the audio, that `(audio, corrected_text)` pair is gold-standard training data
- Prioritize capturing real noisy-environment audio — this is exactly what Common Voice's clean, read-speech recordings don't cover

**Roman Urdu normalization / translation**
- Log every case where the normalization dictionary had no match and fell through to the raw-text path — each one is a missing dictionary entry, and the fallthrough log is a frequency-ranked queue of what to add next
- Log cases where downstream intent extraction failed or the agent asked an unnecessary clarifying question — trace back to check whether a translation error caused it

**Booking agent** (if/when it's migrated off the hosted API — see the earlier API-vs-self-hosted discussion)
- Log full conversation transcripts + outcome (completed / abandoned / disputed)
- Human-in-the-loop labeling matters most here: a failed booking could be the agent's fault (wrong provider match) or the user's (changed their mind) — sample and tag failures weekly, or retraining just reinforces noise

### 10.2 Retraining cadence

Not literally continuous — batched, on a schedule matched to how fast useful data accumulates:

| Component | Cadence | Why |
|---|---|---|
| STT fine-tune | Monthly, or after ~50–100 hrs of new corrected audio accumulates | Needs a meaningful batch to move the needle |
| Normalization dictionary | Weekly | Lookup table — near-zero cost to update, no retraining involved |
| Translation model (if self-hosted) | Quarterly, or when fallthrough rate crosses a threshold | Needs enough new parallel examples to matter |
| Booking agent (if self-hosted) | Only once the offline eval harness (10.3) is trustworthy | Highest-risk component to retrain casually — a bad update directly breaks bookings |

### 10.3 Offline evaluation before any deploy

- Maintain a **frozen, held-out test set**: the manually-authored Roman Urdu phrases, noisy-environment clips, and code-switching examples from Section 5's test plan. Never let this set leak into training data.
- Every retrain is scored against this same fixed set, compared to the currently-deployed version — not just in aggregate, but per slice (noisy audio, code-switching, etc.). A model can improve on aggregate WER while regressing on a subgroup that matters more to your users; slice-level comparison catches that, aggregate numbers hide it.

### 10.4 Shadow deployment, then A/B

- Run the new model **in parallel with the live one** on real incoming traffic for a few days — it processes the same audio, but its output isn't shown to users, only logged and diffed against the live model's output. This surfaces production-distribution issues (accents, background noise types, phrasing) the held-out set didn't anticipate, with zero user-facing risk.
- Only after shadow testing looks clean: roll out to a small slice of real traffic (e.g. 5%) and watch the metric that actually matters — **voice booking completion rate**, not transcription accuracy in isolation. Better WER doesn't guarantee better bookings if the remaining errors land on the wrong words (a mis-heard price is worse than a mis-heard filler word).

### 10.5 Schema additions to support this

Extends the `agent_sessions` table (already carrying `input_modality`, `detected_language`, `stt_confidence`, `raw_transcript`, `normalized_transcript`, `translation_used` from Section 7):

```sql
ALTER TABLE agent_sessions
  ADD COLUMN was_corrected BOOLEAN DEFAULT FALSE,     -- user repeated/retyped after this turn
  ADD COLUMN corrected_transcript TEXT,                -- the corrected version, if any
  ADD COLUMN normalization_fallthrough BOOLEAN DEFAULT FALSE,  -- dictionary had no match
  ADD COLUMN model_version TEXT,                       -- which STT/translation model version served this turn
  ADD COLUMN human_reviewed BOOLEAN DEFAULT FALSE,      -- flagged and labeled by a human reviewer
  ADD COLUMN review_label TEXT;                         -- reviewer's tag: 'stt_error' | 'translation_error' | 'agent_error' | 'user_changed_mind' | ...
```

`model_version` is what makes A/B comparisons and rollback possible — every logged turn is attributable to the exact model that served it.

### 10.6 Where this plugs into the build order

Not a Week 1–3 MVP item — the loop only has data to run on *after* launch. Add to the post-launch track (Section 8):

- **v1.1:** ship the `was_corrected` / `normalization_fallthrough` logging (cheap, should go out with the MVP launch itself so data starts accumulating from day one)
- **v1.2 (once ~4–6 weeks of real usage exists):** first STT fine-tune cycle, first normalization dictionary expansion pass, offline eval harness stood up
- **v1.3+:** recurring retrain cadence per Section 10.2, shadow/A-B infrastructure

---

## 11. Key Risks

| Risk | Mitigation |
|---|---|
| Roman Urdu spelling variance breaks intent extraction | Normalization dictionary + fallback raw-text-to-LLM path (LLMs handle messy Roman Urdu better than a naive dictionary lookup) |
| Latency kills the "conversational" feel | Push-to-talk (not continuous) reduces wasted turns; combine normalization+translation into one call if budget is blown |
| Background noise in real usage vs. clean test data | Explicit noisy-environment test set before launch (Section 5) |
| Users default back to text because voice feels unreliable | Ship voice as an *additional* input option alongside text, never a replacement — low-risk rollout, real usage data decides if it's worth expanding |
| Cost creep (Whisper + 2x LLM calls per turn vs. 1x for text) | Track cost-per-voice-turn from day one; VAD trimming keeps audio payload (and Whisper cost) low |

---

*This plan treats voice booking as a new input modality layered onto the existing Ustadji agent (M3, plan1.md) — not a separate system. The only genuinely new engineering work is the STT → normalization → translation pipeline; the booking intelligence itself is reused unchanged.*
