# Feature Specification: Autonomous Provider Profile & Performance Optimization Agent

## 1. Feature Overview

The Autonomous Provider Profile & Performance Optimization Agent continuously mines a service provider's **completed booking history, star ratings, and review text** to detect demonstrated specialties, profile gaps, and performance strengths/weaknesses that the provider has not yet reflected in their public profile. Unlike a simple review-sentiment tool, this feature treats **each review as conditional evidence tied to a specific completed service**, not as free-floating text. A one-word review such as *"Good work"* carries almost no signal on its own — but when it is bound to `booking.service_id = GEYSER_REPAIR` and `rating = 5`, it becomes a discrete, structured observation: *positive performance evidence for Geyser Repair*. Aggregated across dozens of bookings, these observations let the system statistically infer specialties the provider has proven in practice but never listed — e.g., a plumber who has quietly completed 18 geyser repairs at a 4.89 average rating but whose profile only says "General Plumbing."

The system combines a **deterministic analytics/ML layer** (which performs all scoring, aggregation, and thresholding) with an **agentic reasoning layer powered by Qwen running locally via Ollama** (which explains the evidence in natural language and requests explicit provider approval before any profile field is modified). No profile change is ever applied automatically — the agent proposes, the provider disposes.

This is a Final Year Project prototype. The platform has **no live users, bookings, or historical provider-performance data**. All NLP and ML components are therefore developed and benchmarked offline against real, publicly available datasets, with the production PostgreSQL schema built to natively support the marketplace's own `provider → booking → service → review` data once the platform launches.

---

## 2. Core Design Principle: Review Text Alone Is Not Enough

This is the central engineering insight the entire feature is built around.

Home-service customers in Pakistan (and globally) frequently leave extremely short, low-information reviews:

- "Good work"
- "Nice"
- "Excellent"
- "Very good"
- "Great service"

None of these sentences name a service. A naive NLP pipeline that tries to extract "what the provider is good at" purely from review text will fail on the majority of real-world reviews, because the information simply is not present in the text.

The fix is architectural, not linguistic: **bind every review to the booking that generated it, and pull the service identity from the booking record, not from the sentence.**

```
booking_id      : BKG-1001
provider_id     : PROV-17
service_id      : GEYSER_REPAIR
rating          : 5
review_text     : "Good work"
```

is converted by the pipeline into a structured observation:

```
provider   = PROV-17
service    = GEYSER_REPAIR
rating     = 5
sentiment  = POSITIVE
evidence   = STRONG (single sample)
```

A single observation is weak evidence. But when the same pattern repeats:

```
GEYSER_REPAIR → 5★ → "Good work"
GEYSER_REPAIR → 5★ → "Nice"
GEYSER_REPAIR → 5★ → "Excellent"
GEYSER_REPAIR → 4★ → "Very good, slightly late"
... (14 more)
```

the system accumulates 18 independent, service-conditioned observations, and statistical aggregation (Section 8.C) converts this into a defensible claim: *"Provider has demonstrated strong performance in Geyser Repair."* This is fundamentally an analytics/data-engineering result, not a text-generation guess — the LLM is never asked to infer the service from the sentence; it only reasons over numbers the ML layer has already computed.

---

## 3. Primary Feature Objectives

1. Analyze provider reviews and ratings.
2. Link every review to the booking (and therefore the exact service) that generated it.
3. Classify review sentiment (positive / neutral / negative / mixed).
4. Aggregate provider performance **per service type**, not just globally.
5. Discover services in which a provider consistently performs well.
6. Compare demonstrated specialties against the provider's declared profile.
7. Flag missing specialties that clear a defined evidence-confidence threshold.
8. Benchmark the provider against similar peer providers.
9. Detect profile completeness gaps (missing bio, hours, service area, etc.).
10. Detect recurring qualitative strengths/weaknesses (e.g., "great work, but late").
11. Compute a transparent, auditable **Profile Opportunity Score**.
12. Generate personalized, evidence-grounded optimization recommendations.
13. Use Qwen (local, via Ollama) as an agentic reasoning/communication layer over structured ML output.
14. Require explicit provider approval before any profile mutation.
15. Apply profile updates only after confirmation, via a single controlled tool call.
16. Log every recommendation, approval/rejection, and profile change for full auditability.

**Explicit constraint:** the agent must never state a business outcome it cannot support with real data (e.g., *"Adding Geyser Repair will increase your bookings by 15%"*). No booking-conversion dataset exists at this stage. All recommendation language is scoped to **demonstrated performance evidence**, e.g. *"Your recent completed jobs show consistently strong performance in Geyser Repair, but this specialty is not currently listed on your profile."* Conversion-impact prediction is deferred to Section 24 (Future Enhancements) once real platform booking data exists.

---

## 4. Data Availability Constraint (FYP Context)

The marketplace has not launched. There are **no real users, bookings, providers, or Pakistani provider-performance records**. This specification does not fabricate any of that data. Instead:

- All NLP/ML components are developed and evaluated **offline against real public datasets** (Section 5).
- A **minimal, explicitly labeled synthetic validation layer** is used only where public datasets structurally cannot represent the marketplace-specific `provider → booking → service → review` chain (Section 18).
- The production database schema (Section 12) is designed from day one to natively capture this chain, so that once the platform launches, live data seamlessly replaces the offline/public-data bootstrap without any architectural rework.

---

## 5. Data Sources & Engineering Logic

### A. Yelp Open Dataset
**Type:** Real public dataset (business + review corpus)

Contains business records, categories, attributes, review text, star ratings, dates, user metadata, and check-ins. Used to develop and benchmark the **review NLP layer** — sentiment classification, service-related vocabulary modeling, and provider/business benchmarking logic — by filtering toward service-oriented categories:

- Home Services, Contractors, Plumbing, Electricians, HVAC, Handyman, Cleaning, Repair Services, Carpentry, Appliance Services

**Limitation:** Yelp does not provide a `booking_id`-level link between a review and a specific completed job/service in the way our marketplace requires. It is used purely as a **general-purpose review/sentiment/business-category corpus**, not as a source of provider-service-performance ground truth.

### B. Google Local Reviews Dataset (UCSD McAuley Lab)
**Type:** Real public academic dataset (independent review benchmark)

Contains review text, ratings, business metadata, categories, location, hours, and price-level attributes. Used as an **independent second corpus** to:

- Validate sentiment/NLP models generalize beyond Yelp's platform-specific writing style
- Cross-check service/category distributions
- Support profile-completeness feature design (hours, price level, attributes present/absent)

**Limitation:** Same as Yelp — no booking-level service linkage. Used for cross-platform generalization testing, not booking-context modeling.

### C. HS-ABSA — Home Services Aspect-Based Sentiment Analysis Dataset
**Type:** Real, manually annotated, domain-specific dataset (~4,164 home-service reviews)

This is the most valuable dataset for this feature because it is **domain-specific to home services** and annotated at the aspect level (e.g., "technical quality," "punctuality," "pricing," "professionalism") with opinion terms and polarity. Used as:

- Primary training/fine-tuning benchmark for aspect-based sentiment analysis (ABSA)
- Evaluation set for domain adaptation from general Yelp/Google sentiment models to home-service language
- Ground truth for the strength/weakness detector (Section 8.H)

### D. O*NET OnLine
**Type:** Real occupational knowledge base (taxonomy, not a performance dataset)

Provides structured occupational/task vocabulary that lets the system normalize free-form service names into professional/trade categories:

```
Geyser Repair          → Plumbers (47-2152.00) → related task: "repair water heaters"
Cabinet Installation   → Carpenters (47-2031.00)
Electrical Wiring      → Electricians (47-2111.00)
Interior Painting      → Painters, Construction & Maintenance (47-2141.00)
```

O*NET is used exclusively for **service-taxonomy normalization and occupation mapping** — it contains no provider or review data whatsoever.

### E. ESCO (Optional Supporting Taxonomy)
**Type:** Optional occupational/skill taxonomy

ESCO (European Skills, Competences, Qualifications and Occupations) may optionally supplement O*NET for finer-grained skill mapping and multilingual occupation labels. It is **not required for the MVP**. If O*NET alone provides sufficient service-to-occupation coverage during implementation, ESCO integration is skipped to avoid unnecessary complexity. This decision is deferred to implementation time based on taxonomy coverage testing.

### F. Explicitly Excluded Sources
No OLX scraping, no provider surveys, no provider interviews, and no manual performance surveys are used anywhere in this feature. The design does not depend on any of these.

### G. No Current Application Data
The platform currently has **no real bookings, completion rates, cancellation rates, conversion rates, or customer histories**. None of these are claimed to exist today. The schema in Section 12 is explicitly designed to *begin* capturing these signals from the moment the platform goes live.

---

## 6. Offline Public Data vs. Future Platform-Native Data

| Layer | Data Source | Role |
|---|---|---|
| **Offline model development (now)** | Yelp, Google Local Reviews, HS-ABSA, O*NET, (optional ESCO) | Train/benchmark sentiment classifier, aspect extractor, service-taxonomy normalizer, and peer-benchmarking logic |
| **Future live inference (post-launch)** | `provider_id`, `booking_id`, `service_id`, completion status, `rating`, `review_text`, review date, cancellation flag, response time, provider profile, provider-listed services | Real, marketplace-native `provider → booking → service → review` chain feeding the same trained/validated pipeline |

The intelligence layer (sentiment model, aspect model, taxonomy mapper) is **model-agnostic to the data source** — it is trained/validated offline on public data, then pointed at the live `reviews`/`bookings` tables the moment real transactions exist. No retraining architecture change is required at launch; only the input source changes.

---

## 7. Required ML / AI Components

### A. Review Sentiment Analysis

Classifies each review's `review_text` into `POSITIVE / NEUTRAL / NEGATIVE / MIXED`.

| Example Input | Output |
|---|---|
| "Good work" | POSITIVE |
| "Very late but work was okay" | MIXED |
| "Terrible repair, pipe still leaks" | NEGATIVE |

**Model options (MVP → stronger alternative):**
- **MVP baseline:** TF-IDF + Logistic Regression / Linear SVM (scikit-learn), fast to train and fully explainable
- **Stronger option:** Fine-tuned transformer (e.g., DistilBERT/BERT-family sentiment head) trained on Yelp + Google Local labels, domain-adapted using HS-ABSA
- **Alternative:** Sentence-Transformer embeddings + lightweight classifier head (good middle ground between cost and accuracy)

HS-ABSA is used as the **domain-specific evaluation benchmark** to confirm the model generalizes to home-service language rather than only restaurant/retail language dominant in Yelp.

### B. Aspect / Service Intelligence (Text-Level, Best-Effort Only)

When review text *does* contain identifiable service language, an aspect extractor pulls it out for auxiliary confirmation and for the strength/weakness detector:

```
"Excellent geyser installation."      → aspect: Geyser Installation
"Bathroom pipe fixed perfectly."      → aspect: Bathroom Plumbing / Pipe Repair
```

**Critical constraint:** when text is generic ("Good work", "Nice"), the system does **not** attempt aspect extraction and does **not** guess the service from wording. It falls back entirely to the structured path: `review → booking_id → service_id`. Aspect extraction is a *supplementary* signal, never the primary source of service identity — that role belongs exclusively to the booking record (Section 2).

### C. Provider × Service Performance Aggregation

For every `(provider_id, service_id)` pair, the analytics layer computes:

| Metric | Description |
|---|---|
| `completed_jobs` | Count of completed bookings for this service |
| `avg_rating` | Mean star rating |
| `five_star_ratio` | Proportion of 5★ reviews |
| `four_plus_ratio` | Proportion of ≥4★ reviews |
| `positive_sentiment_ratio` | Share of reviews classified POSITIVE |
| `negative_sentiment_ratio` | Share of reviews classified NEGATIVE |
| `recent_successes` | Count of positive outcomes within a recency window (e.g. last 90 days) |
| `recency_weighted_score` | Rating/sentiment weighted by exponential time decay |
| `complaint_count` | Count of NEGATIVE-sentiment or ≤2★ reviews |
| `review_count` | Total reviews for this service |
| `consistency` | 1 − (standard deviation of ratings / max possible spread) |

**Example — Ahmed × Geyser Repair:**

```
completed_jobs      : 18
avg_rating           : 4.89
five_star_ratio       : 0.94
positive_sentiment    : 0.96
recency               : Strong (13 of 18 jobs in last 90 days)
→ Service Performance Score = 0.92
```

**Service Performance Score formula:**

```
SPS = w1·norm(avg_rating)
    + w2·five_star_ratio
    + w3·positive_sentiment_ratio
    + w4·recency_weighted_score
    + w5·consistency
    − w6·negative_sentiment_ratio

where  w1..w6 are tunable weights (Σw = 1, negative term subtracted),
       norm(avg_rating) = (avg_rating − 1) / 4   (rescaled to 0–1)
```

Default MVP weights: `w1=0.30, w2=0.20, w3=0.20, w4=0.15, w5=0.10, w6=0.15` (negative term). Weights are configuration, not hardcoded — tunable per deployment once real distribution data exists.

### D. Specialty Recommendation Model

Framed as a **supervised classification/ranking problem**: given a `(provider, service)` pair's feature vector, predict a `specialty_recommendation_score ∈ [0,1]`.

**Feature vector:**

```
[ completed_jobs, avg_rating, five_star_ratio, four_plus_ratio,
  positive_sentiment_ratio, negative_sentiment_ratio,
  recent_successes, recency_weighted_score, review_count,
  service_category_onehot, provider_category_onehot,
  profile_already_lists_service (bool), profile_completeness_score,
  peer_percentile ]
```

**Example output:**

```
Ahmed × Geyser Repair            → 0.94
Ahmed × Water Heater Installation → 0.89
Ahmed × Bathroom Plumbing         → 0.63
```

**Model options (MVP → stronger alternative):**
- **MVP baseline:** Logistic Regression (fully interpretable coefficients, easy to justify to stakeholders/examiners)
- **Stronger option:** Random Forest or Gradient Boosting (XGBoost/LightGBM) for non-linear interactions between rating consistency and recency
- **Ranking variant:** Learning-to-rank (e.g., LambdaMART) if the goal shifts from "should we recommend this service" to "which of N candidate services should we recommend first"

No single model is mandated; the MVP ships with Logistic Regression for transparency and auditability, with tree-ensemble methods documented as the natural upgrade path once more (real or synthetic-validation) training examples are available.

### E. Profile Gap Detection

Deterministic set comparison, gated by the ML confidence score:

```
current_profile_services = { General Plumbing, Pipe Repair }
evidence_backed_services = { Geyser Repair (0.94), Water Heater Installation (0.89),
                              Pipe Repair (0.71), Bathroom Plumbing (0.63) }

gap = evidence_backed_services − current_profile_services
    = { Geyser Repair, Water Heater Installation }
```

A service only enters `gap` if `specialty_recommendation_score ≥ GAP_CONFIDENCE_THRESHOLD` (default `0.75`, see Section 19).

### F. Peer Benchmarking

Compares a provider's per-service score against a **peer cohort** — providers sharing the same professional category, overlapping service portfolio, and (where available) region.

```
Provider's Geyser Repair score : 0.92
Peer cohort median              : 0.76
Peer percentile                 : 88th
```

Peer percentile strengthens the recommendation's credibility beyond raw review counts — a provider scoring in the 88th percentile of peers who *already list* Geyser Repair is stronger evidence than an isolated high rating with no peer context.

### G. Profile Completeness Analysis

Checklist-based scoring over profile fields:

| Field | Weight |
|---|---|
| Profile name | 5 |
| Description/bio | 15 |
| Professional category | 10 |
| Services listed | 20 |
| Specialties | 15 |
| Service area | 10 |
| Working hours | 10 |
| Years of experience | 5 |
| Portfolio images (≥3) | 15 |
| Certifications (if applicable) | 5 |

```
Profile Completeness Score = Σ(weight if field present) / Σ(all weights) × 100
Example: 72 / 100  (missing: portfolio images, working hours, certifications)
```

### H. Performance Strength / Weakness Detection

Uses aspect-level sentiment (Section 7.B) plus HS-ABSA-style aspect categories (technical quality, punctuality, response time, pricing, professionalism) to detect **recurring** patterns — never from a single review.

```
"Excellent work but arrived late."
"Good electrician, but response was slow."
"Technically very good, but came two hours late."

→ Technical Quality : STRONG   (3/3 positive mentions)
→ Punctuality        : WEAK     (3/3 negative mentions)
→ Response Time       : WEAK     (2/3 negative mentions)
```

Agent framing: *"Customers consistently praise your technical work, but recent feedback indicates delays in arrival. Consider improving availability and response-time information."*

### I. Profile Opportunity Score

A transparent composite score combining all upstream signals:

```
Profile Opportunity Score =
      α · specialty_evidence_strength
    + β · peer_benchmark_gap
    + γ · profile_completeness_deficit
    + δ · recency_factor
    + ε · performance_consistency

  where α+β+γ+δ+ε = 1  (default: α=0.35, β=0.20, γ=0.20, δ=0.15, ε=0.10)
  all components pre-normalized to [0,1]; final score scaled to 0–100
```

```
Example: Profile Opportunity Score = 91 / 100
```

This score is a **transparent, formula-driven ranking signal** used to prioritize which providers/recommendations the background worker surfaces first (Section 10) — it is not presented to users as a market prediction.

---

## 8. Autonomous Agent Layer (Qwen via Ollama)

**Strict separation of responsibility:** the ML/analytics layer (Section 7) computes every number. Qwen never calculates a score — it **reasons over already-computed structured evidence**, explains it in natural language, proposes an action, and requests confirmation. This separation is a hard architectural rule, not a style preference: it keeps every claim traceable to a deterministic computation rather than an LLM guess.

**Structured input passed to the agent:**

```json
{
  "provider": "Ahmed Plumbing Services",
  "current_services": ["General Plumbing", "Pipe Repair"],
  "strong_demonstrated_services": [
    {
      "service": "Geyser Repair",
      "score": 0.94,
      "completed_jobs": 18,
      "average_rating": 4.89,
      "five_star_ratio": 0.94
    },
    {
      "service": "Water Heater Installation",
      "score": 0.89,
      "completed_jobs": 9,
      "average_rating": 4.78,
      "five_star_ratio": 0.89
    }
  ],
  "profile_gaps": ["Geyser Repair", "Water Heater Installation"],
  "peer_benchmark": {
    "Geyser Repair": {"peer_median": 0.76, "peer_percentile": 88}
  }
}
```

**Agent-generated response (illustrative):**

> "I noticed that your recent completed jobs show consistently strong customer ratings for Geyser Repair and Water Heater Installation. These specialties are not currently listed on your profile. Would you like me to add them?"

- If provider replies **"Yes"** → agent invokes the `profile_update` tool → PostgreSQL profile row updated → audit record written.
- If provider replies **"No"** → no mutation occurs; rejection is logged (feeds the cooldown rule, Section 19).

**Tool contract exposed to the agent (function-calling schema):**

```json
{
  "name": "profile_update",
  "description": "Adds one or more approved specialties to a provider's public profile. Requires explicit prior provider approval captured in the conversation.",
  "parameters": {
    "type": "object",
    "properties": {
      "provider_id": {"type": "string"},
      "services_to_add": {"type": "array", "items": {"type": "string"}},
      "approved_by_provider": {"type": "boolean"},
      "recommendation_id": {"type": "string"}
    },
    "required": ["provider_id", "services_to_add", "approved_by_provider", "recommendation_id"]
  }
}
```

The `profile_update` tool implementation itself enforces `approved_by_provider === true` as a server-side guard — even if the LLM hallucinated approval, the backend refuses the write without a corresponding logged confirmation event.

---

## 9. Autonomous / Periodic Execution

A scheduled background worker (daily or weekly) re-runs the pipeline per provider:

```
Load provider performance data
        ↓
Recalculate service performance (Section 7.C)
        ↓
Detect significant changes since last run
        ↓
Detect new profile opportunities (Section 7.E/I)
        ↓
Generate recommendation only if threshold is met (Section 19)
        ↓
Notify provider (in-app + agent conversation entry point)
```

**Anti-spam safeguards:**
- A recommendation for the same `(provider_id, service_id)` gap is not re-issued within a configurable cooldown window (default 30 days) unless underlying evidence materially strengthens (e.g., `score` increases by ≥0.10).
- If a provider explicitly rejected a suggestion, it enters an extended cooldown (default 90 days) before being reconsidered.
- Each run's inputs, outputs, and score deltas are logged to `profile_optimization_runs` for reproducibility.

---

## 10. Claim Limitations (Hard Rule)

The system **never** states an unsupported business outcome. Because no real booking/conversion dataset exists yet, statements such as *"Adding Geyser Repair will increase your bookings by 15%"* are explicitly disallowed at both the prompt-engineering level (system prompt for Qwen forbids numeric outcome predictions) and the application level (no `predicted_booking_lift` field exists anywhere in the schema).

**Permitted phrasing pattern:**
> "Your completed service history shows strong performance in Geyser Repair, but this specialty is missing from your profile."
> "Your performance evidence strongly supports adding Geyser Repair."

**Disallowed phrasing pattern:**
> "This will increase your bookings by X%." *(no data to support this claim)*

Booking-conversion-impact modeling is deferred to Section 24 as a **future enhancement**, contingent on real platform booking-outcome data.

---

## 11. Structured Database Schema (PostgreSQL)

The schema is designed so the `providers → bookings → services → reviews` chain is first-class — this is what makes the "Good work" scenario (Section 2) solvable in production.

### `providers`

| Field | Type | Constraint | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Unique provider identifier |
| `full_name` | VARCHAR(150) | NOT NULL | Provider display name |
| `professional_category` | VARCHAR(100) | NOT NULL | e.g. "Plumber", "Electrician" |
| `bio` | TEXT | NULLABLE | Profile description |
| `service_area` | VARCHAR(150) | NULLABLE | Geographic coverage |
| `working_hours` | JSONB | NULLABLE | Structured hours per weekday |
| `years_experience` | INTEGER | CHECK (years_experience >= 0) | Self-declared experience |
| `profile_completeness_score` | NUMERIC(5,2) | DEFAULT 0 | Cached from Section 7.G |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Row creation time |
| `updated_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Last update time |

### `provider_services` (declared/listed specialties)

| Field | Type | Constraint | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Row ID |
| `provider_id` | UUID | FK → providers.id, NOT NULL | Owning provider |
| `service_id` | UUID | FK → services.id, NOT NULL | Declared service |
| `source` | VARCHAR(20) | DEFAULT 'MANUAL' CHECK (source IN ('MANUAL','AGENT_APPROVED')) | How the entry was added |
| `added_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | When added |
| | | UNIQUE (provider_id, service_id) | Prevent duplicates |

### `services` (normalized taxonomy, seeded from O*NET mapping)

| Field | Type | Constraint | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Service identifier |
| `name` | VARCHAR(150) | NOT NULL UNIQUE | e.g. "Geyser Repair" |
| `category` | VARCHAR(100) | NOT NULL | e.g. "Plumbing" |
| `onet_occupation_code` | VARCHAR(20) | NULLABLE | e.g. "47-2152.00" |

### `bookings`

| Field | Type | Constraint | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Booking identifier |
| `provider_id` | UUID | FK → providers.id, NOT NULL | Assigned provider |
| `customer_id` | UUID | FK → users.id, NOT NULL | Requesting customer |
| `service_id` | UUID | FK → services.id, NOT NULL | **Service actually performed** |
| `status` | VARCHAR(20) | CHECK (status IN ('COMPLETED','CANCELLED','IN_PROGRESS','PENDING')) | Booking lifecycle state |
| `completed_at` | TIMESTAMPTZ | NULLABLE | Completion timestamp |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Booking creation time |

### `reviews`

| Field | Type | Constraint | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Review identifier |
| `booking_id` | UUID | FK → bookings.id, NOT NULL, UNIQUE | **Link that carries service context** |
| `provider_id` | UUID | FK → providers.id, NOT NULL | Denormalized for query speed |
| `service_id` | UUID | FK → services.id, NOT NULL | Denormalized from booking |
| `rating` | INTEGER | CHECK (rating BETWEEN 1 AND 5) | Star rating |
| `review_text` | TEXT | NULLABLE | Free-text feedback (may be very short/empty) |
| `sentiment_label` | VARCHAR(10) | NULLABLE CHECK (sentiment_label IN ('POSITIVE','NEUTRAL','NEGATIVE','MIXED')) | ML output |
| `sentiment_confidence` | NUMERIC(4,3) | NULLABLE | Model confidence 0–1 |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Review submission time |

Index: `CREATE INDEX idx_reviews_provider_service ON reviews(provider_id, service_id);`

### `provider_service_performance` (materialized aggregation, Section 7.C)

| Field | Type | Constraint | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Row ID |
| `provider_id` | UUID | FK → providers.id, NOT NULL | Provider |
| `service_id` | UUID | FK → services.id, NOT NULL | Service |
| `completed_jobs` | INTEGER | DEFAULT 0 | Count |
| `avg_rating` | NUMERIC(3,2) | NULLABLE | Mean rating |
| `five_star_ratio` | NUMERIC(4,3) | NULLABLE | 0–1 |
| `positive_sentiment_ratio` | NUMERIC(4,3) | NULLABLE | 0–1 |
| `negative_sentiment_ratio` | NUMERIC(4,3) | NULLABLE | 0–1 |
| `recency_weighted_score` | NUMERIC(4,3) | NULLABLE | 0–1 |
| `service_performance_score` | NUMERIC(4,3) | NULLABLE | Section 7.C output |
| `last_computed_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Recompute timestamp |
| | | UNIQUE (provider_id, service_id) | One row per pair |

### `provider_recommendations`

| Field | Type | Constraint | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Recommendation ID |
| `provider_id` | UUID | FK → providers.id, NOT NULL | Target provider |
| `recommendation_type` | VARCHAR(30) | CHECK (recommendation_type IN ('SPECIALTY_GAP','PROFILE_COMPLETENESS','STRENGTH_WEAKNESS')) | Category |
| `payload` | JSONB | NOT NULL | Full structured evidence (Section 13) |
| `opportunity_score` | NUMERIC(5,2) | NULLABLE | Section 7.I output |
| `status` | VARCHAR(20) | DEFAULT 'PENDING' CHECK (status IN ('PENDING','ACCEPTED','REJECTED','EXPIRED')) | Provider response |
| `created_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Generated time |
| `responded_at` | TIMESTAMPTZ | NULLABLE | Provider decision time |

### `profile_optimization_runs`

| Field | Type | Constraint | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Run ID |
| `provider_id` | UUID | FK → providers.id, NOT NULL | Target provider |
| `run_type` | VARCHAR(20) | CHECK (run_type IN ('SCHEDULED','MANUAL')) | Trigger source |
| `input_snapshot` | JSONB | NOT NULL | Feature vector snapshot |
| `output_summary` | JSONB | NOT NULL | Scores/recommendations produced |
| `executed_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Run timestamp |

### `profile_change_audit`

| Field | Type | Constraint | Description |
|---|---|---|---|
| `id` | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Audit row ID |
| `provider_id` | UUID | FK → providers.id, NOT NULL | Provider affected |
| `recommendation_id` | UUID | FK → provider_recommendations.id, NULLABLE | Source recommendation |
| `field_changed` | VARCHAR(50) | NOT NULL | e.g. "services" |
| `old_value` | JSONB | NULLABLE | Pre-change state |
| `new_value` | JSONB | NOT NULL | Post-change state |
| `approved_by_provider` | BOOLEAN | NOT NULL | Consent flag |
| `changed_at` | TIMESTAMPTZ | NOT NULL DEFAULT now() | Mutation timestamp |

**Relationship summary:** `providers 1—N bookings`, `bookings 1—1 reviews`, `bookings N—1 services`, `providers N—N services` (via `provider_services`), `providers 1—N provider_service_performance`, `providers 1—N provider_recommendations`, `provider_recommendations 1—N profile_change_audit`. This chain is what allows a one-word review to resolve unambiguously to a service.

---

## 12. Sample JSON Payloads

**A. Completed booking + review**
```json
{
  "booking_id": "BKG-1001",
  "provider_id": "PROV-17",
  "service_id": "GEYSER_REPAIR",
  "status": "COMPLETED",
  "completed_at": "2026-06-14T11:20:00Z",
  "review": {
    "rating": 5,
    "review_text": "Good work",
    "created_at": "2026-06-14T15:05:00Z"
  }
}
```

**B. NLP analysis result**
```json
{
  "review_id": "REV-5521",
  "sentiment_label": "POSITIVE",
  "sentiment_confidence": 0.88,
  "aspects_detected": [],
  "note": "Generic short review — service identity resolved via booking_id, not text."
}
```

**C. Provider-service performance aggregation**
```json
{
  "provider_id": "PROV-17",
  "service_id": "GEYSER_REPAIR",
  "completed_jobs": 18,
  "avg_rating": 4.89,
  "five_star_ratio": 0.94,
  "positive_sentiment_ratio": 0.96,
  "negative_sentiment_ratio": 0.02,
  "recency_weighted_score": 0.91,
  "service_performance_score": 0.92,
  "last_computed_at": "2026-07-20T02:00:00Z"
}
```

**D. Specialty recommendation result**
```json
{
  "provider_id": "PROV-17",
  "candidates": [
    {"service": "Geyser Repair", "score": 0.94, "confidence": "HIGH"},
    {"service": "Water Heater Installation", "score": 0.89, "confidence": "HIGH"},
    {"service": "Bathroom Plumbing", "score": 0.63, "confidence": "MEDIUM"}
  ]
}
```

**E. Profile gap detection**
```json
{
  "provider_id": "PROV-17",
  "current_profile_services": ["General Plumbing", "Pipe Repair"],
  "evidence_backed_services": ["Geyser Repair", "Water Heater Installation", "Pipe Repair", "Bathroom Plumbing"],
  "gap": ["Geyser Repair", "Water Heater Installation"],
  "threshold_applied": 0.75
}
```

**F. Peer benchmark result**
```json
{
  "provider_id": "PROV-17",
  "service": "Geyser Repair",
  "provider_score": 0.92,
  "peer_cohort_size": 41,
  "peer_median": 0.76,
  "peer_percentile": 88
}
```

**G. Profile opportunity score**
```json
{
  "provider_id": "PROV-17",
  "components": {
    "specialty_evidence_strength": 0.94,
    "peer_benchmark_gap": 0.85,
    "profile_completeness_deficit": 0.28,
    "recency_factor": 0.91,
    "performance_consistency": 0.88
  },
  "profile_opportunity_score": 91.0
}
```

**H. Agent recommendation (delivered to provider)**
```json
{
  "recommendation_id": "REC-3391",
  "provider_id": "PROV-17",
  "message": "I noticed that your recent completed jobs show consistently strong customer ratings for Geyser Repair and Water Heater Installation. These specialties are not currently listed on your profile. Would you like me to add them?",
  "proposed_services": ["Geyser Repair", "Water Heater Installation"],
  "status": "PENDING"
}
```

**I. Provider approval**
```json
{
  "recommendation_id": "REC-3391",
  "provider_response": "Yes",
  "approved_services": ["Geyser Repair", "Water Heater Installation"],
  "responded_at": "2026-07-20T09:12:44Z"
}
```

**J. Profile update action (tool call executed by agent)**
```json
{
  "tool": "profile_update",
  "provider_id": "PROV-17",
  "services_to_add": ["Geyser Repair", "Water Heater Installation"],
  "approved_by_provider": true,
  "recommendation_id": "REC-3391"
}
```

**K. Profile change audit record**
```json
{
  "audit_id": "AUD-8842",
  "provider_id": "PROV-17",
  "recommendation_id": "REC-3391",
  "field_changed": "services",
  "old_value": ["General Plumbing", "Pipe Repair"],
  "new_value": ["General Plumbing", "Pipe Repair", "Geyser Repair", "Water Heater Installation"],
  "approved_by_provider": true,
  "changed_at": "2026-07-20T09:12:47Z"
}
```

---

## 13. Complete AI Processing Pipeline

| Stage | Input | Processing | Model / Algorithm | Output |
|---|---|---|---|---|
| 1. Provider onboarding | Registration form | Profile row created | — | `providers` row |
| 2. Initial profile | Declared services | Stored | — | `provider_services` rows |
| 3. Booking completion | Booking lifecycle events | Status → COMPLETED | — | `bookings` row w/ `service_id` |
| 4. Review submission | Customer input | Rating + text stored, linked to `booking_id` | — | `reviews` row |
| 5. Service context retrieval | `review.booking_id` | Join to `bookings.service_id` | SQL join | Resolved service |
| 6. Sentiment analysis | `review_text` | Classify polarity | Fine-tuned classifier / TF-IDF+LR baseline | `sentiment_label`, confidence |
| 7. Aspect analysis (if text is informative) | `review_text` | Extract aspects/opinion terms | ABSA model (HS-ABSA-trained) | Aspect list (may be empty) |
| 8. Provider × Service aggregation | All reviews/bookings for pair | Compute metrics (Section 7.C) | Aggregation + weighted formula | `provider_service_performance` row |
| 9. Specialty score calculation | Feature vector | Predict recommendation score | Logistic Regression / GBM | `specialty_recommendation_score` |
| 10. Profile comparison | Scores + current profile | Set difference above threshold | Rule engine | `gap` list |
| 11. Peer benchmarking | Cohort scores | Percentile calculation | Statistical ranking | Peer percentile |
| 12. Profile opportunity detection | All above | Weighted composite | Formula (Section 7.I) | `profile_opportunity_score` |
| 13. Qwen agent reasoning | Structured JSON evidence | Natural-language explanation + proposal | Qwen (Ollama, local) | Draft recommendation message |
| 14. Personalized recommendation | Draft message | Delivered to provider | — | `provider_recommendations` row |
| 15. Provider approval | Provider reply | Yes/No captured | Conversational parsing | Approval flag |
| 16. Profile update | Approval flag | `profile_update` tool call | Server-side guarded write | Updated `provider_services` |
| 17. Audit logging | All prior stages | Immutable log write | — | `profile_change_audit` row |

---

## 14. Short-Review Scenario (Worked Example)

This scenario is the strongest demonstration of the feature's design and is documented in full.

**Input:**
```
Customer service booked : Geyser Repair
Rating                   : 5 stars
Review text              : "Good work"
```

**Step 1 — Sentiment analysis:** the classifier reads "Good work" and outputs `sentiment = POSITIVE` (high confidence given the short but clearly affirmative phrasing).

**Step 2 — Service identity resolution:** the pipeline does **not** attempt to extract "geyser" or "repair" from the two-word review. Instead:
```
review.booking_id → BKG-1001
BKG-1001.service_id → GEYSER_REPAIR
```

**Step 3 — Evidence unit created:**
```
Provider PROV-17 × Service GEYSER_REPAIR
  rating = 5, sentiment = POSITIVE
```

**Step 4 — Repetition across the provider's history:**
```
18 Geyser Repair jobs total
17 × 5-star, 1 × 4-star
17/18 reviews POSITIVE sentiment
High recency (most jobs within last 90 days)
```

**Step 5 — Aggregation output:**
```
completed_jobs = 18, avg_rating = 4.89, five_star_ratio = 0.94
→ Service Performance Score = 0.92
→ Specialty Recommendation Score = 0.94
```

**Step 6 — Profile comparison:** current profile lists only `General Plumbing, Pipe Repair` → `Geyser Repair` is missing → passes `GAP_CONFIDENCE_THRESHOLD (0.75)` → enters `gap`.

**Step 7 — Recommendation generated** and routed to the Qwen agent for delivery (Section 8).

This shows that even though not one of the 17 five-star reviews contained the word "geyser," the system correctly and confidently attributes the specialty to the provider — because the signal comes from the **structured booking-service link**, not from parsing adjectives.

---

## 15. ML Training / Evaluation Strategy

Model development is strictly separated into two phases:

**Phase 1 — Public data training/benchmarking (current, pre-launch):**
- Sentiment classifier trained/benchmarked on Yelp + Google Local Reviews (general), fine-tuned/validated on HS-ABSA (domain-specific)
- Aspect extractor trained/benchmarked on HS-ABSA annotations
- Service-taxonomy normalizer built from O*NET occupation/task mappings (optionally supplemented by ESCO)

**Phase 2 — Future platform inference (post-launch):**
- Same trained pipeline applied to live `reviews`/`bookings` records
- Specialty recommendation model retrained periodically once sufficient live provider-service observations accumulate

**Evaluation metrics (to be reported once training is executed):**

| Task | Metrics |
|---|---|
| Sentiment classification | Accuracy, Precision, Recall, F1 (macro-averaged across POSITIVE/NEUTRAL/NEGATIVE) |
| Aspect extraction | Precision, Recall, F1 (span-level, against HS-ABSA annotations) |
| Specialty classification/ranking | Precision@K, Recall@K, ROC-AUC (classification framing); MAP / NDCG@K (ranking framing) |

**No evaluation numbers are fabricated in this specification.** Actual scores will be populated after implementation and reported as:

> *"Evaluation values will be populated after implementation."*

---

## 16. Synthetic Data Policy

Public datasets (Yelp, Google Local Reviews, HS-ABSA, O*NET) are sufficient for the NLP/taxonomy components: sentiment classification, aspect extraction, business-category modeling, and occupational normalization.

Their one structural gap is that none of them provide the exact `provider → completed booking → service performed → review` chain our marketplace's aggregation and specialty-recommendation logic depends on. To validate that this **specific pipeline logic** (Sections 7.C–7.I and the schema in Section 11) behaves correctly end-to-end, a small, clearly labeled synthetic layer may be used:

```json
{
  "record_type": "SYNTHETIC_VALIDATION_DATA",
  "purpose": "Pipeline/schema integration testing only — not used for model training or presented as real Pakistani marketplace observations",
  "booking_id": "SYN-BKG-0007",
  "provider_id": "SYN-PROV-02",
  "service_id": "GEYSER_REPAIR",
  "rating": 5,
  "review_text": "Nice"
}
```

**Rules governing synthetic data:**
- Used only for schema/pipeline integration testing, never as model training data
- Kept small (tens–low hundreds of rows, not bulk-generated)
- Every synthetic record explicitly tagged `SYNTHETIC_VALIDATION_DATA` in code, database seed scripts, and documentation
- Never described, plotted, or reported as if it were real Pakistani provider performance

---

## 17. Rule Engine (Deterministic Layer)

Certain decisions must remain deterministic and auditable rather than left to model probability alone.

```
IF completed_jobs < MIN_SERVICE_EVIDENCE (default 5)
   → do not recommend specialty (insufficient sample size)

IF avg_rating >= RATING_THRESHOLD (default 4.5)
   AND five_star_ratio >= FIVE_STAR_THRESHOLD (default 0.80)
   AND recent_successes >= RECENCY_THRESHOLD (default 3)
   AND specialty_recommendation_score >= SCORE_THRESHOLD (default 0.75)
   → candidate specialty

IF service already exists in provider_services
   → no profile-gap recommendation for that service

IF provider rejected the same (provider_id, service_id) recommendation
   within COOLDOWN_WINDOW (default 90 days)
   → suppress re-recommendation

IF model_confidence < MIN_CONFIDENCE (default 0.65)
   → do not recommend (insufficient certainty)
```

**Why rules complement ML:** the ML model produces a continuous, learned score capturing complex feature interactions, but the *decision boundary for taking action* (recommend or not, notify or not) must be explainable, stable, and defensible to a human provider — especially in a trust-sensitive context like modifying someone's public profile. Deterministic thresholds make the system's behavior auditable and prevent a marginal model score from triggering an unwarranted profile suggestion.

---

## 18. Provider Recommendation / Profile Action Policy

```
AI detects opportunity (Sections 7.E / 7.I, gated by Section 17 rules)
        ↓
Agent explains evidence in natural language (Section 8)
        ↓
Provider accepts ──────────────► Profile updated + audited
        │
        ├── Provider rejects ──► No update; logged; cooldown applied
        │
        └── Provider ignores ──► No update; recommendation expires after TTL (default 14 days)
```

No code path exists that mutates `provider_services` without a corresponding `approved_by_provider = true` record in `profile_change_audit`. This is enforced at the database-write layer, not just the conversational layer, so a prompt-injection or agent malfunction cannot bypass consent.

---

## 19. Profile Optimization Example (End-to-End Walkthrough)

**Provider:** Ahmed Plumbing Services (`PROV-17`)

**Current profile:**
```
Category : Plumber
Services : General Plumbing, Pipe Repair
```

**Performance history:**

| Service | Jobs | Avg Rating | Five-Star Ratio |
|---|---|---|---|
| Geyser Repair | 18 | 4.89 | 0.94 |
| Water Heater Installation | 9 | 4.78 | 0.89 |
| Bathroom Plumbing | 7 | 4.29 | 0.57 |

**Model output (specialty recommendation scores):**
```
Geyser Repair             → 0.94
Water Heater Installation → 0.89
Bathroom Plumbing         → 0.63
```

**Profile gaps (score ≥ 0.75 threshold, not already listed):**
```
Geyser Repair, Water Heater Installation
```
(Bathroom Plumbing scores below the 0.75 gap threshold and is not recommended.)

**Peer benchmark:** Geyser Repair is commonly listed by high-performing peer providers in the "Plumber" category — Ahmed's 0.92 score sits at the 88th percentile of that peer cohort, reinforcing the recommendation.

**Agent recommendation delivered:**
> "Your recent completed jobs show consistently strong customer ratings for Geyser Repair and Water Heater Installation. These specialties are not currently listed on your profile. Would you like me to add them?"

**Provider response:** "Yes"

**System action:** `profile_update` tool invoked → `provider_services` updated with two new rows (`source = 'AGENT_APPROVED'`) → profile now shows:
```
Services : General Plumbing, Pipe Repair, Geyser Repair, Water Heater Installation
```

**Audit trail written:**
```json
{
  "audit_id": "AUD-8842",
  "provider_id": "PROV-17",
  "recommendation_id": "REC-3391",
  "field_changed": "services",
  "old_value": ["General Plumbing", "Pipe Repair"],
  "new_value": ["General Plumbing", "Pipe Repair", "Geyser Repair", "Water Heater Installation"],
  "approved_by_provider": true,
  "changed_at": "2026-07-20T09:12:47Z"
}
```

---

## 20. Error Handling

| Condition | System Behaviour |
|---|---|
| Very few completed jobs (`< MIN_SERVICE_EVIDENCE`) | No specialty recommendation; provider shown "Not enough completed jobs yet" internally, no external message sent |
| Generic review with no aspect signal | Fall back entirely to booking-derived service context (Section 2); no aspect output stored |
| Missing review (booking completed, no review left) | Booking still counts toward completion metadata but not toward rating/sentiment aggregates |
| Missing service context (`service_id` null on booking) | Review excluded from all service-level aggregation; flagged for data-quality review |
| Low rating (1–2 stars) | Counted in `negative_sentiment_ratio` / `complaint_count`; may surface in strength/weakness detector, never in specialty gap recommendations |
| Conflicting rating and sentiment (e.g., 5★ + negative text) | Both signals stored as-is; aggregation uses rating and sentiment as independent features rather than forcing agreement; large persistent conflicts flagged for manual review (out of scope for this feature, handled by trust & safety systems) |
| Negative performance pattern detected | Routed to strength/weakness detector (Section 7.H), not specialty recommendation; agent frames constructively |
| Unknown/unmapped service | Service creation blocked until mapped to O*NET taxonomy; falls back to provider's declared `professional_category` |
| Unknown professional category | Peer benchmarking cohort widened to "general home services" fallback group |
| Low model confidence (`< MIN_CONFIDENCE`) | Rule engine suppresses recommendation (Section 17) |
| Insufficient peer data (cohort size < minimum, default 5) | Peer benchmarking component excluded from Profile Opportunity Score; weight redistributed to remaining components |
| Profile already fully optimized | No recommendation generated; provider marked `optimization_status = UP_TO_DATE` until new evidence arrives |
| Provider rejects recommendation | Logged; cooldown applied (Section 17) |
| Provider repeatedly rejects same suggestion | Extended cooldown / eventual permanent suppression flag after N rejections (default N=2) |
| Model/service taxonomy mismatch | Reconciliation job flags mismatched `service_id` mappings for manual taxonomy correction |
| Missing metadata (e.g., booking timestamp) | Excluded from recency-weighted calculations; does not block core rating/sentiment aggregation |

---

## 21. Security / Safety / Trust

- **No automatic profile changes without approval** — enforced at both the agent-conversation layer and the database-write layer (Section 18).
- **Minimum evidence thresholds** (`MIN_SERVICE_EVIDENCE`, Section 17) prevent a single isolated 5-star review from triggering a specialty recommendation — a lone data point is statistically meaningless and easily manipulated.
- **Recency weighting** ensures stale performance (e.g., strong ratings from years ago, weak ratings recently) does not misrepresent current capability.
- **No unsupported claims:** the agent's system prompt and the application layer jointly forbid numeric outcome predictions (bookings, revenue, ranking position) that are not backed by real data (Section 10).
- **Bias mitigation for review volume:** scores incorporate ratios (e.g., `five_star_ratio`) rather than raw counts alone, and peer benchmarking is percentile-based rather than absolute, reducing the advantage of providers who simply have more total reviews irrespective of quality.
- **Rating-inflation awareness:** consistency (variance-based) is included as a scoring component so uniformly high ratings with no variance are not automatically treated as stronger evidence than genuinely well-distributed positive feedback — flagged for future anomaly-detection work (Section 24).
- **Outdated-evidence protection:** `recency_weighted_score` decays older observations exponentially so an old burst of good reviews cannot indefinitely justify a recommendation if recent performance has declined.
- **Auditability by design:** every recommendation, approval, rejection, and profile mutation is persisted (`provider_recommendations`, `profile_optimization_runs`, `profile_change_audit`) and immutable after creation.

---

## 22. Future Enhancements

Explicitly out of scope for the current FYP implementation, listed as natural extensions once the platform has live data:

- Real booking-conversion and acceptance-rate data → booking-impact prediction modeling
- Completion rate, cancellation rate, and response-time signals as first-class features
- Repeat-customer and retention-based specialty validation
- Provider availability and dynamic ranking integration
- Personalized profile A/B testing (e.g., different bio phrasing, portfolio ordering)
- Booking-conversion prediction models once outcome-labeled data exists
- Multilingual Roman Urdu review analysis (extending sentiment/aspect models beyond English)
- Voice-based provider interaction with the agent
- Automatic profile description/bio generation from performance evidence
- Portfolio image quality/relevance analysis (computer vision)
- Provider skill graph construction across services and occupations
- Continuous online learning as live review volume grows

---

## 23. Final Architecture Diagram

```
                          PUBLIC DATA
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
      Yelp                  Google                 HS-ABSA
   (review/biz)          Local Reviews         (home-service ABSA)
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
                               ▼
                      REVIEW NLP ENGINE
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
            Sentiment                     Aspect
            Analysis                    Extraction
                 │                           │
                 └─────────────┬─────────────┘
                               │
                        O*NET / ESCO
                               │
                               ▼
                     SERVICE TAXONOMY
                               │
                               ▼
          PROVIDER → BOOKING → SERVICE → REVIEW
                    (live platform chain)
                               │
                               ▼
                PROVIDER × SERVICE
              PERFORMANCE ENGINE (7.C)
                               │
                               ▼
              ML SPECIALTY MODEL (7.D)
                               │
                               ▼
               PROFILE GAP ENGINE (7.E)
                               │
                               ▼
                PEER BENCHMARKING (7.F)
                               │
                               ▼
           PROFILE OPPORTUNITY SCORE (7.I)
                               │
                               ▼
                       QWEN AGENT
                    (Ollama, local reasoning)
                               │
                               ▼
                PROVIDER CONFIRMATION
                               │
                       ┌───────┴───────┐
                       │               │
                     YES              NO
                       │               │
                       ▼               ▼
              PROFILE UPDATE     NO CHANGE
                       │               │
                       └───────┬───────┘
                               ▼
                          AUDIT LOG
```

---

## 24. Final Dataset Summary Table

| Dataset | Type | Used For | Limitation |
|---|---|---|---|
| Yelp Open Dataset | Real public review/business dataset | Sentiment model training/benchmarking, service-category vocabulary, general provider/business benchmarking patterns | No booking-level service linkage; not a substitute for marketplace transaction data |
| Google Local Reviews (UCSD McAuley Lab) | Real public review/business dataset | Independent cross-platform NLP validation, business-attribute/category analysis | Same booking-linkage limitation as Yelp |
| HS-ABSA | Real, annotated home-services NLP dataset (~4,164 reviews) | Domain-specific aspect-based sentiment training/evaluation, strength/weakness detector benchmark | Smaller scale than Yelp/Google; annotation scope limited to labeled aspects |
| O*NET OnLine | Real occupational knowledge base | Service-to-occupation taxonomy normalization | Not a review or performance dataset — taxonomy only |
| ESCO | Optional occupational/skill taxonomy | Supplementary occupation/skill normalization if O*NET coverage is insufficient | Optional; not required for MVP |
| Synthetic Validation Data | Minimal, explicitly labeled synthetic records | Pipeline/schema integration testing for the `provider → booking → service → review` chain only | Never used for model training; never presented as real observations |

**Explicitly confirmed:**
- No surveys are required.
- No interviews are required.
- No OLX scraping is required.
- No live app users are required for the current implementation.
- No real booking data currently exists.
- The production schema (Section 11) is designed to consume platform-native booking/service/review data as the primary source immediately upon launch, with public datasets serving only as the offline development/benchmarking foundation.

---

## 25. Final Feature Summary

This feature is a genuine, implementation-ready AI/Data Science system, not a wrapper around an LLM chatbot. It demonstrates:

- **Data Engineering** — Integration of four independent public datasets (Yelp, Google Local Reviews, HS-ABSA, O*NET) into a unified offline development pipeline, cleanly separated from future platform-native data.
- **NLP** — Sentiment classification and aspect-based extraction, domain-adapted from general review corpora to home-service-specific language via HS-ABSA.
- **Machine Learning** — A supervised specialty-recommendation model (Logistic Regression baseline → tree-ensemble upgrade path) that scores each `(provider, service)` pair from engineered features.
- **Analytics** — Rigorous service-level performance aggregation (ratios, recency weighting, consistency) rather than raw review counting.
- **Recommendation Systems** — Profile-gap detection that recommends specialties only when both ML confidence and deterministic evidence thresholds are satisfied.
- **Benchmarking** — Peer-cohort percentile comparison that contextualizes a provider's performance against similar providers rather than in isolation.
- **Agentic AI** — Qwen (via Ollama) operating strictly as a reasoning/communication layer over pre-computed structured evidence, never as the source of numerical truth.
- **Automation** — Scheduled background optimization runs with cooldown and anti-spam logic.
- **Human-in-the-Loop** — No profile mutation without explicit, logged provider approval, enforced at the database-write layer.
- **Database Engineering** — A normalized PostgreSQL schema centered on the `provider → booking → service → review` relationship, which is precisely what makes the short-review scenario ("Good work" → correctly attributed to Geyser Repair) solvable in production.
- **Auditability** — Every recommendation, decision, and profile change is immutably logged for traceability.

The design is intentionally modular: every ML/NLP component is trained and validated offline against real public data today, and requires no architectural change to consume live marketplace data the moment the platform launches.
