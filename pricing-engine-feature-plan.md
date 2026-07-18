# Ustadji — Smart Dynamic Pricing Engine: Development & Integration Plan

**Feature 02 from the design doc: provider records a voice note post-job → transcribed → structured invoice data extracted → deterministic formula computes an itemized bill → consumer confirms and signs. Self-hosted, no paid API.**

---

## 1. What Changes From the Original Design

The design doc's Feature 02 chains three components: **Whisper (ASR) → Claude (NLP extraction) → deterministic pricing formula.** The formula was already zero-API by design (the doc is explicit that the LLM never computes the bill, only extracts facts — that part needs no changes). The two AI calls are what need self-hosted replacements.

| Component | Original design | Self-hosted replacement |
|---|---|---|
| Speech-to-text | Whisper-1 (OpenAI API) | **Faster-Whisper**, self-hosted, fine-tuned on Urdu — already fully scoped in the voice-booking plan. No new work here; reuse it. |
| Structured extraction | Claude Sonnet (Anthropic API) | Self-hosted open-weight LLM — this is the new work, covered below |
| Pricing formula | Deterministic Python | Unchanged — already self-hosted, already zero-API |

So this plan only really needs to solve **one new problem**: replacing the Claude call that turns a transcript into `{work_items, parts_used, labor_hours, ..., missing_info}` JSON.

---

## 2. Data Source Check — and Good News This Time

I looked for datasets that could help here the same way I checked for the previous two features.

| Source | Credible? | Applicable here? |
|---|---|---|
| **SROIE / CORD** (receipt information-extraction datasets) | ✅ Real, well-established (SROIE: 973 annotated receipts; CORD: 1,000 Indonesian receipts with 30 hierarchical fields) | ⚠️ Wrong modality and wrong language. These extract fields from **scanned/photographed printed receipts** (visual layout matters), not from **spoken Urdu/Roman Urdu narration**. Not directly usable as training data — but CORD's field schema (menu item / quantity / unit price / subtotal / total, hierarchically organized) is a genuinely useful **reference for designing your own extraction schema**, since it's a mature, tested structure for exactly this kind of line-item invoice data. |
| **CLE Urdu NER / POS-tagged resources** (from the earlier voice-feature research) | ✅ Real | Marginal help — could support a lightweight Urdu named-entity layer (detecting numbers, quantities, item-name-like tokens) as a **validation layer** (Section 4), but doesn't solve full structured extraction on its own. |
| **MultiWOZ** (dialogue-state-tracking benchmark — restaurant/hotel booking slot-filling) | ✅ Real, standard NLP benchmark | Not usable as training data (English, different domain), but a useful **methodology reference**: it's the standard academic approach to "extract structured slots from natural conversation," and the slot-filling techniques transfer conceptually even though the data doesn't. |
| **A public "spoken Pakistani service-invoice narration → structured JSON" dataset** | — | Doesn't exist, unsurprisingly — same gap pattern as the damage-assessment feature. Nobody has built this because it's specific to your exact domain. |

**The actual good news:** unlike appliance damage assessment (which genuinely needed hundreds of labeled photos because visual defect recognition has to be learned from examples), **structured text extraction is a task modern open-weight LLMs are already good at out of the box**, via prompting alone — no training data required to get started. Two concrete findings support this:

- **Qwen2.5/Qwen3** (Apache 2.0, fully free for commercial self-hosted use, strong multilingual support including Urdu) handle structured JSON extraction well via few-shot prompting — this is functionally the same prompt-engineering approach the original design doc already uses for Claude, just pointed at a self-hosted model instead.
- **NuExtract3** — a small (4B parameter), Apache 2.0-licensed, open-weight model **specifically trained for structured extraction and OCR**, runs on a single consumer GPU, no API keys or per-call fees. This is a purpose-built tool for exactly this kind of task.
- If prompting alone isn't accurate enough once you test it, a **LoRA fine-tune on as few as 20–50 hand-authored (transcript → JSON) examples** is enough to meaningfully specialize a small model for this exact schema — this is a dramatically lower data bar than the damage-assessment feature, because language extraction tasks generalize from far fewer examples than visual defect recognition does.

---

## 3. Architecture

```
Provider records voice note (Expo Audio API — unchanged from design doc)
       │
       ▼
┌─────────────────────────┐
│ Faster-Whisper (self-     │  Same model already built for voice booking —
│ hosted, Urdu fine-tuned)  │  reuse, don't rebuild
└──────────┬─────────────────┘
           │ transcript
           ▼
┌─────────────────────────┐
│ Self-hosted LLM extraction │  Qwen2.5/Qwen3 or NuExtract3, few-shot prompted
│ (Ollama / vLLM)             │  (same prompt structure as original design doc's
│                              │   INVOICE_EXTRACTION_PROMPT, just self-hosted)
└──────────┬─────────────────┘
           │ {work_items, parts_used, labor_hours, ..., missing_info}
           ▼
┌─────────────────────────┐
│ Validation / sanity-check  │  Regex-based number extraction cross-checked
│ layer (new, deterministic) │  against LLM output — flags mismatches (Section 4)
└──────────┬─────────────────┘
           │
           ▼
┌─────────────────────────┐
│ Pricing formula             │  Unchanged from original design — deterministic
│ (deterministic Python)      │  Python, LLM never computes the bill
└──────────┬─────────────────┘
           │
           ▼
   Consumer reviews itemized bill → confirms → digital signature → Supabase
```

---

## 4. New Layer: Validation / Sanity-Check (worth adding regardless of API choice)

Self-hosted models — especially smaller ones — are more prone to numeric slip-ups than Claude Sonnet (transposing a digit, misreading "1200" vs "12000" from accented speech-to-text output). Add a deterministic cross-check that doesn't exist in the original design:

- Run a simple regex/number-extraction pass over the **raw transcript** independently of the LLM extraction
- Compare extracted numbers (prices, hours, quantities) against what the LLM put in the structured JSON
- If a number in the JSON doesn't appear anywhere in the raw transcript (or a close match), flag it — surface to the provider as "please confirm: 1,200 PKR for labor?" rather than silently trusting it
- This is cheap to build (a few dozen lines of regex/rapidfuzz matching) and meaningfully reduces the risk of a smaller self-hosted model quietly hallucinating a number in a domain where that directly costs someone money

This complements, not replaces, the `missing_info` mechanism already in the original design (that catches *absent* information; this catches *wrong* information).

---

## 5. Self-Hosted Tech Stack

| Component | Choice | Why |
|---|---|---|
| STT | Faster-Whisper (Urdu fine-tuned) | Already built for voice booking — this feature is a second consumer of the same model, not a new build |
| Structured extraction | **Qwen2.5-7B-Instruct or Qwen3** (Apache 2.0) via **Ollama** (simplest to stand up) or **vLLM** (better throughput at scale), OR **NuExtract3** if extraction-only accuracy matters more than general conversational ability | Apache 2.0 is unambiguous — no MAU caps, no separate commercial agreement needed (unlike some Qwen2.5 large variants under the Tongyi Qianwen license — stick to Apache-licensed variants and verify the specific model card before deploying) |
| Fine-tuning (if needed after prompt-only testing) | LoRA/QLoRA on 20–50 hand-authored examples | Cheap — runs on a single consumer GPU, hours not days, per the precedent found for this exact task type |
| Validation layer | Python regex + `rapidfuzz` | No ML needed, deterministic, cheap |
| Pricing formula | Existing deterministic Python from the design doc | Unchanged |
| Inference serving | Same FastAPI/Flask server already serving the voice-booking and damage-assessment models | Consolidate self-hosted inference behind one service rather than standing up separate infra per feature |

**Hardware note:** a 7B-parameter model (or the 4B NuExtract3) comfortably fits on a single consumer or mid-tier cloud GPU, and can share hardware with the other self-hosted models (Whisper, damage classifiers) if you're running one inference server for the whole platform — this is a much lighter lift than it sounds once the voice-booking infrastructure already exists.

---

## 6. Prompt Design (carries over almost unchanged)

The original design doc's `INVOICE_EXTRACTION_PROMPT` is a solid starting point — few-shot structured-extraction prompting works similarly across capable LLMs, whether Claude or a self-hosted Qwen model. The main adjustments needed when switching:

- **Add 2–3 worked examples directly in the prompt** (few-shot, not zero-shot) — smaller self-hosted models benefit more from in-context examples than Claude typically needs
- **Test the exact same prompt against real transcripts from your own pilot** (the same pilot recordings you're already collecting for the damage-assessment continuous-learning loop, or a small dedicated set) before assuming it works — self-hosted model behavior on Roman Urdu/Urdu code-switching needs verification, it can't be assumed from the original design doc's Claude-based testing
- Keep the `missing_info` field — this mechanism doesn't change, and combined with the new validation layer (Section 4) gives you two independent checks instead of one

---

## 7. Integration with Ustadji

This replaces the Claude call inside **M8 (Smart Dynamic Pricing Engine)** from plan1.md — same role, same schema, same downstream behavior:

- `service_tickets`/`invoices` schema is unchanged — `voice_transcript`, `extracted_data` (JSONB), `line_items` (JSONB), `subtotal`, `total`, `status` all stay as originally planned
- The M7 → M8 handoff (damage assessment's `likely_parts_needed` pre-filling the invoice's `parts_used`) is unaffected — that data flow happens at the schema level, independent of which model produced either side
- Add one field for the new validation layer:

```sql
ALTER TABLE invoices
  ADD COLUMN validation_flags JSONB DEFAULT '[]',  -- numbers in JSON not found in raw transcript
  ADD COLUMN model_version TEXT;                    -- which extraction model/prompt version served this — same pattern as the continuous-learning schema from the voice plan
```

---

## 8. Continuous Learning (same loop, cheaper to run here)

This reuses the same feedback-loop pattern from the voice-booking and damage-assessment plans, but the data need is smaller:

- Every completed invoice already has a **provider-confirmed final bill** — if the consumer disputes or the provider corrects a line item before confirming, that correction is free labeled training data (transcript + corrected JSON), same idea as the damage-assessment feature's "provider diagnosis = free label"
- Because this task needs far fewer examples to improve (tens, not hundreds), even a slow trickle of real corrections is enough to periodically refresh the few-shot examples in the prompt or retrain the LoRA adapter
- Track **validation-flag rate** (how often the sanity-check layer catches a mismatch) as the leading indicator of extraction quality — trending down over time is the signal the model/prompt is improving

---

## 9. Build Order (short — most of the hard infrastructure already exists)

**Week 1:**
- Stand up Qwen2.5/Qwen3 (or NuExtract3) via Ollama/vLLM on the existing self-hosted inference server
- Port the `INVOICE_EXTRACTION_PROMPT` from the design doc, add few-shot examples
- Test against ~20–30 real or realistic transcripts (reuse pilot recordings from the damage-assessment/voice-booking pilots if available, or record a small dedicated set)

**Week 2:**
- Build the validation/sanity-check layer (Section 4)
- Wire into the existing Flask `/api/process-voice-invoice` endpoint, swapping the Claude call for the self-hosted one
- If prompt-only accuracy isn't sufficient: LoRA fine-tune on the same 20–30 examples plus any new corrections gathered

**Week 3:**
- End-to-end test: voice note → self-hosted Whisper → self-hosted extraction → validation → pricing formula → consumer confirmation UI
- Compare bill accuracy against a small holdout set with known-correct answers (manually computed from the same transcripts)
- Soft launch, start tracking validation-flag rate and provider-correction rate for the continuous-learning loop

---

## 10. Success Metrics

| Metric | Target |
|---|---|
| Structured extraction field accuracy (vs. manually-verified holdout) | > 90% on core fields (labor_hours, parts, work_items) |
| Validation-flag rate (sanity-check catching a mismatch) | < 10%, trending down |
| `missing_info` trigger rate | Comparable to what the original Claude-based design would produce — track and compare |
| Bill dispute rate (same metric as plan1.md's MVP target) | < 8%, unchanged target |
| End-to-end processing time (voice note → bill ready) | Comparable to or better than the API-based version, since self-hosted inference avoids external network round-trips |

---

## 11. Key Risks

| Risk | Mitigation |
|---|---|
| Self-hosted model less accurate than Claude at numeric extraction | Validation/sanity-check layer (Section 4) is the direct mitigation — added specifically because this risk is real and worth designing around, not ignoring |
| Roman Urdu/code-switching transcript quality varies | Shared risk with the voice-booking feature — same STT pipeline, same mitigations (confidence thresholds, retry prompts) apply |
| Wrong Qwen license variant accidentally used (Tongyi Qianwen vs Apache 2.0) | Verify the specific model card before deployment — stick to explicitly Apache-2.0-licensed variants (Qwen2.5/Qwen3 base sizes, not gated large variants) |
| LoRA fine-tune overfits on a very small example set | Keep the example set to real, varied transcripts (different providers, different job types) rather than synthetic ones; validate against a held-out slice before deploying |

---

*This plan replaces plan1.md/Feature 02's Claude NLP-extraction call with a self-hosted open-weight LLM (Qwen2.5/Qwen3 or NuExtract3), reuses the Faster-Whisper STT already built for voice booking, and keeps the deterministic pricing formula unchanged. Unlike the damage-assessment feature, this one doesn't need a large data-collection effort — structured extraction from text is well within reach of small self-hosted models via few-shot prompting, with an optional LoRA fine-tune on as few as 20–50 examples if needed. A new validation/sanity-check layer is added specifically to offset the accuracy gap smaller self-hosted models may have on numeric extraction versus Claude.*
