# Ustadji — Multimodal Damage Assessment: Development & Integration Plan

**Feature: User uploads a photo/video of a broken appliance → app identifies the appliance and the issue, self-hosted (no paid vision API).**

---

## 1. Straight Answer on Your Two Suggested Sources

### Kaggle household-appliance image datasets
**Credible, but solves only half the problem.** There are real, usable datasets for **"what appliance is this"** — Roboflow Universe alone has multiple appliance-detection projects (identifying AC units, fridges, ovens, microwaves, dishwashers as object classes), and Kaggle has kitchen/electronics image sets in the thousands-of-images range. This part of the problem — **appliance identification** — is well-covered by public data and transfer learning works well here.

What **doesn't exist** anywhere I could find, on Kaggle or elsewhere: a public dataset of **broken/damaged household appliances** — no dataset of "AC with visible refrigerant leak," "washing machine with cracked drum," "fridge with broken door seal." I checked specifically and came up empty. The closest analogous domains are:
- **Car damage detection** (CarDD, VehiDE) — mature, well-annotated, dent/scratch/crack/glass-shatter categories, methodology worth copying
- **Industrial surface-defect datasets** (rust, corrosion, crack detection on structures/machinery) — same defect *types* (rust, crack, leak-staining) but wrong *objects* (buildings/steel parts, not appliances)

**Implication:** you can use Kaggle/Roboflow data to build the "identify the appliance" stage today. The "identify the issue/damage" stage has **no shortcut** — this is genuinely new data you'll need to collect yourself. That's not a failure of research; it's a real gap in what's publicly available, and every company doing visual defect detection in a niche domain (industrial parts, cars, appliances) has hit this same wall and solved it the same way: seed with a small internally-collected set, then grow it from real usage.

### Web-scraped brand/logo images for OCR
**This one needs a course-correction, not just a credibility check.** I looked at the standard public logo-detection datasets (FlickrLogos-32/47, Logo-2K+, LogoDet-3K, WebLogo-2M) — they're real and well-maintained, but they're built around **consumer brand logos**: Nike, Coca-Cola, McDonald's, Adidas. None of them contain **appliance-brand logos**, and critically, none contain **Pakistani-market appliance brands** (Dawlance, Haier, PEL, Waves, Orient, Homage, Kenwood-PK, Gree) at all.

More importantly: appliance brand identification is usually **not a logo-recognition problem in the first place.** Brand names on appliances typically appear as **printed/embossed text** on a nameplate or front panel (e.g. "DAWLANCE," a model number, a serial number) — not as a stylized graphic logo the way Nike's swoosh is. That reframes the task from "train a custom logo detector" (needs thousands of labeled logo images you don't have) to **"run OCR and string-match against a small curated brand list"** (needs a spreadsheet of ~15–20 brand names, which you can build in an afternoon). This is a much cheaper and more reliable approach for your actual use case.

### Additional sources worth knowing about (and one to avoid)

| Source | Credible? | Solves | Caveat |
|---|---|---|---|
| **Google Open Images (V7)** | ✅ Real, large-scale (9M images, Google-maintained) | Has a `Refrigerator` class and general kitchen/appliance-adjacent object classes with bounding boxes — genuinely useful, larger and more diverse than most Kaggle sets, for **Stage 1 (appliance ID)** | Annotations are CC BY 4.0 (fine); the underlying **images** are only "listed as" CC BY 2.0 per-image — Google explicitly says verify each image's license yourself before commercial use. Usable, but don't treat it as blanket-cleared. |
| **iFixit (repair guides/teardown photos)** | ✅ Real, huge, appliance-specific repair content exists | Looked genuinely promising for "what does a broken X look like" — iFixit has actual appliance teardown photos (dishwashers, dehumidifiers, fans, etc.) | ❌ **Ruled out.** Their license is CC BY-NC-SA (noncommercial only), and their terms explicitly state: **"Training AI — Using our data to train a machine learning or AI model is a violation of our terms of use."** This is disqualifying twice over for a commercial app. Skip it entirely rather than risk it. |
| **OLX Pakistan (used-appliance listings)** | ⚠️ Real marketplace, but weak as training data | Photos of real, used, aged appliances in actual Pakistani homes — closer to your deployment distribution than any catalog dataset, useful as **background/realism data for Stage 1** | Seller descriptions ("needs repair," "for parts") are not structured fault labels — too noisy to use for Stage 2b damage classification without heavy manual re-labeling. Scraping also sits in a legal gray zone against most marketplace ToS — if you use this, only scrape images for the appliance-ID stage, don't scrape/republish listing text, and check OLX's terms before doing this at any scale. |
| **YouTube appliance-repair tutorials** | ⚠️ Content exists, sourcing is the problem | Technicians often show the actual fault before repairing it — in principle great labeled-by-narration data | Downloading/reusing YouTube video content for training generally violates YouTube's ToS and individual creators' copyright regardless of the video being "free to watch." Don't scrape this without explicit creator permission — the risk/reward here is bad given the iFixit precedent above. |

**Net effect on the plan:** Open Images is a legitimate addition to Stage 1's data sources (Section 3). Nothing here solves Stage 2b (damage assessment) — it reinforces, rather than changes, the conclusion in Section 4: your own pilot data collection is still the only reliable path to a damage-assessment training set. iFixit in particular looked like the obvious answer and turned out to be the one to actively avoid.

---

## 2. Revised Two-Stage Architecture

```
Photo/video upload
       │
       ▼
┌─────────────────────────┐
│ Stage 1: Appliance ID     │  Fine-tuned image classifier
│ (what is it?)              │  ResNet50/EfficientNet, transfer-learned
└──────────┬─────────────────┘
           │ appliance_type, confidence
           ▼
┌─────────────────────────┐
│ Stage 2a: Brand/model OCR │  PaddleOCR or EasyOCR on nameplate region
│ (whose is it?)              │  → string-match against curated brand list
└──────────┬─────────────────┘
           │ brand, model_number (if legible)
           ▼
┌─────────────────────────┐
│ Stage 2b: Issue/damage     │  Coarse classifier initially (see Section 4):
│ assessment (what's wrong?) │  hazard? visible damage? severity tier
└──────────┬─────────────────┘
           │ damage_assessment JSON
           ▼
   Ustadji agent (M3) + provider dispatch card
```

Each stage is a **separate, small, self-hostable model** rather than one large vision-language call — this matters for the "no paid API" goal: small task-specific classifiers run cheaply on modest hardware (even CPU for OCR, a single mid-tier GPU for the classifiers), where a general-purpose vision LLM needs either a paid API or a much bigger self-hosted model to match.

---

## 3. Stage 1 — Appliance Identification (buildable now, real data exists)

- **Approach:** transfer learning on a pretrained CNN backbone (ResNet50 or EfficientNet-B0, both open-weight, both run comfortably on a single GPU or even CPU for inference)
- **Data sources, ranked by usefulness for your actual classes** (AC, fridge, washing machine, microwave, water heater/geyser, fan — whatever your top service categories are):
  1. **Roboflow Universe appliance-detection projects** — several existing public projects already have bounding-box or classification labels for exactly this category set (fridge, AC, oven, microwave, dishwasher). Check license per-project (many are CC BY 4.0, which is fine for commercial use with attribution — verify each one individually, don't assume)
  2. **Google Open Images V7** — largest general-purpose source with a `Refrigerator` class and other appliance-adjacent categories, bounding-box annotated. Verify per-image license before commercial use (see Section 1 caveat) — filter to clearly-attributed images rather than bulk-downloading everything
  3. **Kaggle kitchen/electronics image sets** — supplementary, good for background/context diversity (appliances photographed in real home settings rather than product-catalog white-background shots)
  4. **OLX Pakistan listing photos** (images only, not listing text) — real, used, aged appliances photographed in actual Pakistani homes, closer to your deployment distribution than any catalog dataset. Treat as supplementary realism data, not a primary source — respect OLX's terms of service on scope/scale of scraping
  5. **Your own photo collection** (see Section 5) — even a modest 200–300 images per appliance category, shot in realistic Pakistani home conditions (poor lighting, cluttered backgrounds, phone cameras), will outperform generic catalog images for real-world accuracy, because it matches your actual deployment distribution
- **Why this stage is low-risk:** appliance identification is a solved, well-studied classification problem — this is not the novel part of the feature. Expect >90% accuracy on your service-category set (5–8 classes) without heroics, given a few hundred labeled images per class.

---

## 4. Stage 2b — Issue/Damage Assessment (the genuinely hard part — plan for this honestly)

This is where "no existing dataset" is real, so the plan has to be a **data-collection strategy first, a model second.**

### 4.1 Don't start with fine-grained damage classification
Attempting "classify the exact fault: compressor failure vs. refrigerant leak vs. thermostat fault" on day one, with zero labeled examples, will produce a model that's confidently wrong. Start coarser:

**MVP damage model outputs (3 fields, not a fine-grained taxonomy):**
- `visible_damage: boolean` — is there visible physical damage (crack, leak stain, rust, broken part)?
- `hazard_indicators: boolean` — visible signs of an electrical/fire/gas hazard (scorching, exposed wiring, gas smell reported in accompanying text)? **This one gets a server-side safety override, same as in plan1.md M7 — never trust it alone, always err toward flagging.**
- `damage_severity: {minor, moderate, severe}` — coarse triage, not diagnosis

This is deliberately closer to "is something visibly wrong, and how urgent does it look" than "diagnose the fault" — the actual diagnosis stays with the human provider, who is far better equipped for it than a model trained on a few hundred images. The photo's job is to **triage and pre-brief the provider**, not replace their expertise.

### 4.2 Building the training set for this — this is the real project
Since no public dataset fits, treat data collection as its own workstream, not an afterthought:

1. **Pilot data collection (Weeks 1–3, before any model training):** partner with a small number of provider technicians already in your network. For every job they take during the pilot, have them photograph the appliance **before and after** the repair, and tag: appliance type, what was actually wrong (from their professional diagnosis), severity. This gives you **ground-truth labels from people who actually know what they're looking at** — far more reliable than crowdsourced or scraped labels.
2. **Target for a usable v1 model:** 500–1,000 labeled photos minimum before training anything beyond a toy prototype. This will take real calendar time — budget 4–6 weeks of the pilot running in parallel with the rest of MVP development, not a blocking dependency.
3. **Augment (not replace) with public analogous data:** use CarDD's images and methodology as a **training-technique reference** (their annotation guidelines for handling ambiguous/overlapping damage types are genuinely useful), and industrial rust/crack/corrosion datasets to pretrain low-level defect-texture features (rust, cracking patterns look visually similar across domains even though the objects differ) — this is a legitimate transfer-learning trick: pretrain on the closest available analog, fine-tune on your own small real set.

### 4.3 Until the model is reliable, keep a human/rule-based fallback
For the first several months, treat the model's output as a **hint shown to the provider, not a decision made for the user.** The provider dispatch card shows the photo + the model's coarse tags ("possible visible damage, moderate confidence") — the provider still looks at the actual photo and makes the call. This is both the honest engineering position (you don't have enough data yet for the model to be trusted standalone) and the safer product position (nobody gets billed or dispatched based on a guess from an undertrained model).

---

## 5. Self-Hosted Tech Stack (replaces plan1.md's Claude Vision API call)

| Component | Choice | Why |
|---|---|---|
| Appliance classifier | **PyTorch + torchvision (ResNet50/EfficientNet)**, fine-tuned | Open-weight, well-documented, runs on modest hardware |
| Damage/severity classifier | Same architecture family, separate fine-tuned head | Keep it a small, interpretable model while the dataset is small — don't reach for a huge model on <1,000 images, it will overfit |
| OCR (nameplate/brand reading) | **PaddleOCR** or **EasyOCR** | Both fully open-source, no API cost, decent out-of-the-box accuracy on printed text; PaddleOCR generally edges out on small/rotated text common on appliance nameplates |
| Brand matching | Simple string-match / fuzzy-match (`rapidfuzz`) against a curated brand list | No ML needed here — this is a lookup problem once OCR gives you text |
| Inference serving | **FastAPI or Flask endpoint** wrapping the models, run on your own server (or a rented GPU instance if volume justifies it) | Consistent with the rest of the self-hosted stack from the voice-feature plan |
| Video handling | `ffmpeg` frame extraction (already planned in plan1.md M7) — extract 3–5 frames, run each through the pipeline, take the highest-confidence result | Cheap, no new infra |

**Hardware reality check:** these are small models (tens of millions of parameters, not billions) — a single consumer-grade GPU (or even a decent CPU for OCR + lightweight classifiers at low request volume) is enough at MVP scale. This is meaningfully cheaper than either a paid vision API or self-hosting a large vision-language model.

---

## 6. Integration with Ustadji

This replaces **M7 (Multimodal Damage Assessment)** from plan1.md — same role in the booking lifecycle, different implementation:

- Consumer uploads photo/video via Expo `ImagePicker`, same as before
- Flask endpoint runs the three-stage pipeline (Sections 3–5) instead of a Claude Vision API call
- Output schema stays the same shape as originally planned (`service_tickets.damage_assessment` JSONB) so nothing downstream — the Ustadji agent's system-prompt injection, the provider dispatch card, the M7→M8 parts-prefill handoff — needs to change
- **Safety override logic is unchanged and non-negotiable:** if `hazard_indicators: true`, severity is force-set to `emergency` server-side, never trusted from a client-editable value, exactly as originally specified

```sql
-- Same table, self-hosted-model-produced values instead of API-produced ones
-- service_tickets.damage_assessment JSONB shape:
{
  "appliance_type": "AC",
  "appliance_confidence": 0.94,
  "brand": "Dawlance",
  "brand_confidence": 0.81,
  "model_number": "DW-155",        -- null if OCR couldn't read it
  "visible_damage": true,
  "hazard_indicators": false,
  "damage_severity": "moderate",
  "model_version": "damage-v1"      -- for the continuous-learning loop, see below
}
```

---

## 7. Continuous Learning (same loop as the voice feature, applied here)

This feature needs the feedback loop even more than voice does, since it's launching with a genuinely small training set:

- Log every `(photo, model_output, provider's actual diagnosis)` triple — the provider's post-job diagnosis (already captured via M8's voice-to-invoice flow) is free ground-truth labeling that costs nothing extra to collect, since providers are already describing the actual issue for billing
- This is a stronger feedback signal than the voice feature has, because you get a **second, independent confirmation** (the provider's diagnosis) for every prediction automatically, not just on error cases
- Retrain cadence: monthly for the first two quarters (while the dataset is growing fast), stretching to quarterly once accuracy plateaus — same offline-eval-before-shadow-before-A/B discipline as Section 10 of the voice-feature-plan.md
- Track accuracy **per appliance category separately** — with a small dataset, some categories (e.g. AC, likely your highest-volume category) will have far more data than others (e.g. water heaters) and will reach usable accuracy much sooner; don't treat this as one aggregate number

---

## 8. Build Order (parallel to, not blocking, core MVP)

**Weeks 1–3 (parallel with core platform build):**
- Set up PaddleOCR/EasyOCR pipeline, test against ~30 real appliance nameplate photos, build the initial brand-name lookup list
- Begin pilot data collection with a small provider cohort (Section 4.2) — this has the longest lead time, start it earliest
- Source and license-check Roboflow/Kaggle appliance-identification datasets for Stage 1

**Weeks 4–5:**
- Train Stage 1 (appliance classifier) on public + early own data — should reach usable accuracy quickly given real public data exists
- Continue pilot data collection for Stage 2b (damage assessment) — this stage isn't ready to train yet

**Weeks 6–8 (once ~500+ labeled damage photos exist from the pilot):**
- Train the coarse Stage 2b model (visible_damage / hazard_indicators / severity)
- Integration testing: full pipeline → `service_tickets.damage_assessment` → agent system-prompt injection → provider dispatch card
- Launch with the **human-fallback framing** from Section 4.3 — model output is a hint, provider makes the call

**Post-launch, ongoing:**
- Continuous learning loop (Section 7) — provider diagnosis becomes automatic labeled data from week one of launch
- Expand fine-grained damage taxonomy only once the coarse model is proven reliable and enough data exists per-category

---

## 9. Success Metrics

| Metric | Target |
|---|---|
| Stage 1 (appliance ID) accuracy | > 90% on top 5–8 service categories |
| Stage 2a (OCR brand read) success rate | > 60% at launch (nameplates are often worn/obscured — this is inherently harder than product-catalog OCR) |
| Stage 2b (damage/hazard) — provider agreement rate | > 70% agreement with provider's actual diagnosis within first quarter, trending up via continuous learning |
| Hazard-flag recall | > 98% — false negatives here are the dangerous failure mode; bias the model toward over-flagging, not under-flagging |
| Pilot data collection | 500+ labeled photos within first 4–6 weeks |

---

## 10. Key Risks

| Risk | Mitigation |
|---|---|
| Damage model launches undertrained and gives unreliable output | Human-fallback framing (Section 4.3); coarse 3-field output instead of fine-grained diagnosis; provider always has final say |
| Pilot data collection runs slower than planned, delaying Stage 2b | Stage 1 (appliance ID) and OCR can ship independently and provide value on their own — don't block the whole feature on Stage 2b being ready |
| OCR fails on worn/dirty/rotated nameplates (common in real used appliances) | Treat brand/model as best-effort, optional metadata — never a blocking requirement for booking to proceed |
| Hazard false negatives (missed safety issue) | Bias severity threshold toward over-flagging; keep the same server-side safety-override pattern from plan1.md; supplement with text-based hazard keyword detection as a second, independent check |
| Small self-hosted models underperform vs. what a paid vision API would have given at launch | Accepted tradeoff for the "no paid API" goal — mitigated by the continuous learning loop closing the gap over time as real data accumulates, and by keeping model scope narrow (classification/OCR, not open-ended diagnosis) where small models are genuinely competitive |

---

*This plan replaces plan1.md's M7 (originally a Claude Vision API call) with a self-hosted, three-stage pipeline. Appliance identification is buildable today on existing public data. Brand recognition is reframed from logo-detection (wrong tool, no relevant public data) to OCR + lookup (right tool, buildable today). Damage/issue assessment has no public dataset shortcut and is honestly scoped as its own data-collection project, launching with a deliberately coarse model and a human-fallback framing until the continuous-learning loop (fed by providers' own diagnoses) builds up enough real data to trust the model further.*
