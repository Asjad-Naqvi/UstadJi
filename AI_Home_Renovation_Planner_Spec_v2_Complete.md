# Feature Specification: AI Home Renovation Planner

**Module:** Renovation Planning & Cost Estimation Engine (Including Fine-Tuned ML Layer)
**System:** AI-Powered Home Services Marketplace
**Document Type:** Technical / AI Engineering Specification
**Owner:** ML / Platform Engineering
**Status:** Draft v2.0 (merged — core architecture + fine-tuning & data strategy)

---

## Table of Contents

1. Feature Overview
2. Data Sources & AI Engineering Logic
3. Structured Data Schema
4. Sample JSON Payloads
5. Complete AI Processing Pipeline
6. Machine Learning Components
7. Rule-Based Scheduling Engine
8. Provider Recommendation Engine
9. End-to-End Workflow
10. Error Handling
11. Future Improvements
12. Fine-Tuned Model Components
13. WOW Sub-Features
14. Data Collection Strategy (Real Online / Real Manual / Synthetic)
15. Updated Architecture (With Fine-Tuned Components Highlighted)
16. Evaluation & Benchmarking Plan
17. Citations to Use in Your FYP Documentation

---

## 1. Feature Overview

### 1.1 What This Feature Does

The AI Home Renovation Planner converts an unstructured renovation request — typed by a user in natural language, with an optional budget, timeline preference, room type, and photos — into a fully structured, costed, sequenced, and provider-matched execution plan.

This feature is explicitly **not** an idea-generation or inspiration tool. The user already knows what they want done (e.g. *"I want to renovate my kitchen — repaint the walls, replace the sink, and redo the cabinets"*). The system's job is to take that intent and produce an actionable plan: what tasks are involved, who needs to do them, in what order, how long it will take, and how much it will cost — priced against real Pakistani market data.

### 1.2 Why a Hybrid Architecture

A single LLM call could produce a plausible-looking renovation plan, but it cannot be trusted for cost or scheduling because:

- LLMs hallucinate prices and do not have access to live Pakistani material/labour rates.
- LLMs do not reliably enforce hard construction dependency rules (e.g. electrical conduit work must precede plastering).
- LLMs cannot rank real service providers from the marketplace's live database.
- Cost and duration are fundamentally **regression problems** over structured features (task type, room size, material grade, city), not language generation problems.

The system therefore uses the LLM only for what LLMs are good at — understanding messy human language, holding a clarification dialogue, and extracting structured intent — and hands everything downstream (mapping, costing, sequencing, ranking) to deterministic and statistical components that can be tested, audited, and improved independently of the LLM.

### 1.3 Business Objective

- Reduce the gap between "I want to renovate X" and "here is what it will cost and who can do it" from days of manual quote-gathering to a single guided session.
- Give the marketplace a structured demand signal (tasks × professionals × region) that can be used to route leads to the correct service provider category automatically.
- Produce cost estimates accurate enough to set realistic user expectations before a human provider ever quotes, reducing quote-abandonment.

### 1.4 High-Level Architecture

```
User Request
     │
     ▼
Qwen (LLM via Ollama)
  - Understand request
  - Ask follow-up questions
  - Extract renovation tasks
     │
     ▼
spaCy NLP
  - Normalize and clean tasks
     │
     ▼
Task → Professional Mapping
  (O*NET)
     │
     ▼
Cost & Duration Estimation
  (Regression Models)
     │
     ▼
Scheduling Engine
  (Rule-Based Dependencies)
     │
     ▼
Provider Recommendation Engine
     │
     ▼
Final Renovation Plan
```

Each stage consumes the structured output of the previous stage and adds one layer of grounding — linguistic, occupational, statistical, and rule-based — before the plan reaches the user.

---

## 2. Data Sources & AI Engineering Logic

Every dataset below is used **only** for the structural relationships it encodes (task composition, task-to-occupation mapping, cost proportions, duration proportions). Foreign currency values and foreign benchmark prices are never surfaced to the user — they are replaced at inference time with Pakistan-specific values from PBS and OLX.

### 2.1 O*NET Online (Real Data)

| Aspect | Detail |
|---|---|
| **Contains** | Occupations, task statements, skills, work activities, tools/technology used per occupation |
| **Why chosen** | It is the only structured, machine-readable, real-world dataset that maps granular work tasks to formal occupation codes |
| **Consumed by** | Task → Professional Mapping component |
| **Input** | Normalized task string (e.g. `"install kitchen sink"`) |
| **Output** | Occupation code + label (e.g. `47-2152.00` → Plumber) |
| **Example mappings** | `Paint wall → Painter`, `Install sink → Plumber`, `Build/install cabinets → Carpenter`, `Electrical wiring → Electrician` |

O*NET's `Task Statements` and `Tools & Technology` files are pre-indexed offline into a searchable task-embedding index (see §6.4) so that a normalized user task can be matched to the nearest O*NET task statement, and its parent occupation retrieved.

### 2.2 Home Renovation Survey Dataset (Proxy)

| Aspect | Detail |
|---|---|
| **Contains** | Room types, renovation scope categories, typical task co-occurrence, budget bands, timeline bands (foreign) |
| **Why chosen** | Provides realistic *structure* — which tasks tend to occur together for a given room and scope — which is otherwise expensive to hand-author |
| **Consumed by** | Task extraction validation layer + recommendation/classification models |
| **What is used** | Renovation structure, task relationships, room-specific work patterns |
| **What is explicitly discarded** | All budget/currency fields |
| **Output** | Feature vectors describing "typical task bundles" per room type, used as training signal for the task-classification and scope-detection model |

### 2.3 Construction Estimation Dataset (Proxy)

| Aspect | Detail |
|---|---|
| **Contains** | Construction task types, labour categories, material quantities, cost breakdowns, activity durations (foreign) |
| **Why chosen** | Only available dataset with granular task-level duration and labour/material cost **ratios** (e.g. what fraction of total cost is labour vs. material for a given task type) |
| **Consumed by** | Regression models (labour cost, duration) as the primary training set |
| **What is used** | Structural relationships: task → duration curve shape, task → labour/material cost ratio, task → crew-size scaling |
| **What is explicitly discarded** | All absolute foreign currency values |
| **Output** | Trained regression coefficients later rescaled using PBS + OLX anchors (see §6.1) |

### 2.4 Pakistan Bureau of Statistics — PBS (Real Data)

| Aspect | Detail |
|---|---|
| **Contains** | Official current Pakistani prices for cement, paint, tiles, pipes, sanitary items, electrical materials |
| **Why chosen** | Only authoritative, non-scraped, real local price source available |
| **Consumed by** | Material Cost Estimation component |
| **Output** | Per-unit material price (PKR/kg, PKR/litre, PKR/sq.ft, PKR/unit) used to convert material *quantities* (predicted by the regression model) into material *cost in PKR* |

### 2.5 OLX Pakistan Services (Real, Manually Observed)

| Aspect | Detail |
|---|---|
| **Contains** | Manually observed listing rates for painters, plumbers, carpenters, electricians |
| **Why chosen** | Real, local, currently-active labour rate reference; no scraping is performed — values are manually curated and periodically refreshed |
| **Consumed by** | Labour Rate Calibration step |
| **Output** | PKR/day or PKR/task multiplier per professional category, used to rescale the proxy dataset's labour-cost *ratios* into absolute PKR labour costs |

### 2.6 Zameen Blog / Graana Blog (Reference Only)

| Aspect | Detail |
|---|---|
| **Contains** | Renovation trend articles, cost commentary, regional practice notes |
| **Why chosen** | Widely-read Pakistani real-estate publications with practical renovation commentary |
| **Consumed by** | Not consumed by any model. Used exclusively during literature review and as a manual sanity-check that model output cost/timeline ranges are not wildly inconsistent with reported market experience |
| **Output** | None (non-training, qualitative validation only) |

### 2.7 Tools (Not Data Sources)

| Tool | Role |
|---|---|
| **spaCy** | Tokenization, entity extraction (rooms, materials, quantities), lemmatization/normalization of extracted task phrases before O*NET matching |
| **Qwen (via Ollama)** | Local LLM used for conversational clarification and structured task extraction from free-text requests |
| **scikit-learn** | Training of regression models (cost, duration), classification models (task/scope), and the recommendation scoring model |

### 2.8 Data Source Summary Table

| # | Source | Type | Used For | Consumed By | Surfaced to User? |
|---|---|---|---|---|---|
| 1 | O*NET Online | Real | Task → Profession mapping | Mapping engine | Indirectly (profession labels) |
| 2 | Home Renovation Survey | Proxy (structure only) | Task co-occurrence patterns | Task classifier | No |
| 3 | Construction Estimation Dataset | Proxy (structure only) | Cost/duration ratios | Regression models | No |
| 4 | PBS | Real | Material unit prices (PKR) | Material cost engine | Yes (final cost) |
| 5 | OLX Pakistan Services | Real (manual) | Labour rate calibration | Labour cost engine | Yes (final cost) |
| 6 | Zameen / Graana Blogs | Reference | Sanity-check only | Human review | No |


---

## 3. Structured Data Schema

All tables use PostgreSQL. JSONB is used for genuinely variable-shape data (extracted task lists, provider score breakdowns); everything with a fixed, queryable shape is kept in typed columns so it can be indexed and joined efficiently.

### 3.1 `renovation_requests`

| Field Name | Data Type | Validation | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY`, default `gen_random_uuid()` | Unique request identifier |
| `user_id` | `UUID` | `NOT NULL`, `FK → users.id` | Requesting user |
| `room_type` | `VARCHAR(50)` | `NOT NULL`, `CHECK (room_type IN ('kitchen','bathroom','bedroom','living_room','exterior','full_house','other'))` | Declared room/area |
| `raw_request_text` | `TEXT` | `NOT NULL`, `LENGTH <= 2000` | Original free-text request from user |
| `budget_declared` | `NUMERIC(12,2)` | `NULL`, `>= 0` if present | User's stated budget (PKR), optional |
| `preferred_timeline_days` | `INTEGER` | `NULL`, `> 0` if present | User's desired completion window |
| `image_urls` | `JSONB` | `NULL`, array of URLs | Optional uploaded photos |
| `notes` | `TEXT` | `NULL` | Free-form user notes |
| `clarification_log` | `JSONB` | `NOT NULL DEFAULT '[]'` | Array of `{question, answer, timestamp}` from Qwen follow-ups |
| `status` | `VARCHAR(30)` | `NOT NULL DEFAULT 'draft'`, `CHECK (status IN ('draft','clarifying','extracted','estimated','scheduled','completed','failed'))` | Pipeline stage tracker |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | Creation time |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | Last update time |

### 3.2 `renovation_tasks`

| Field Name | Data Type | Validation | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | Unique task identifier |
| `request_id` | `UUID` | `NOT NULL`, `FK → renovation_requests.id` | Parent request |
| `task_label_raw` | `VARCHAR(255)` | `NOT NULL` | Task phrase as extracted by LLM (pre-normalization) |
| `task_label_normalized` | `VARCHAR(255)` | `NOT NULL` | spaCy-normalized task phrase |
| `task_category` | `VARCHAR(50)` | `NOT NULL`, `CHECK (task_category IN ('electrical','plumbing','carpentry','painting','masonry','flooring','cleaning','other'))` | High-level trade category |
| `onet_occupation_code` | `VARCHAR(20)` | `NOT NULL` | Mapped O*NET occupation code |
| `professional_type` | `VARCHAR(50)` | `NOT NULL` | Human-readable profession (e.g. `Electrician`) |
| `extraction_confidence` | `NUMERIC(4,3)` | `NOT NULL`, `BETWEEN 0 AND 1` | LLM/mapping confidence score |
| `sequence_order` | `INTEGER` | `NULL` | Populated later by Scheduling Engine |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | Creation time |

### 3.3 `task_estimations`

| Field Name | Data Type | Validation | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | Unique estimation record |
| `task_id` | `UUID` | `NOT NULL`, `FK → renovation_tasks.id`, `UNIQUE` | One estimation per task |
| `labour_cost_pkr` | `NUMERIC(12,2)` | `NOT NULL`, `>= 0` | Predicted labour cost |
| `material_cost_pkr` | `NUMERIC(12,2)` | `NOT NULL`, `>= 0` | Predicted material cost |
| `material_breakdown` | `JSONB` | `NOT NULL DEFAULT '{}'` | `{material_name: {qty, unit, unit_price_pkr, subtotal_pkr}}` |
| `duration_days` | `NUMERIC(5,2)` | `NOT NULL`, `> 0` | Predicted task duration |
| `model_version` | `VARCHAR(30)` | `NOT NULL` | Regression model version used |
| `prediction_confidence` | `NUMERIC(4,3)` | `NOT NULL`, `BETWEEN 0 AND 1` | Model confidence / inverse variance score |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | Creation time |

### 3.4 `renovation_plan`

| Field Name | Data Type | Validation | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | Unique plan identifier |
| `request_id` | `UUID` | `NOT NULL`, `FK → renovation_requests.id`, `UNIQUE` | Parent request (one final plan per request) |
| `task_sequence` | `JSONB` | `NOT NULL` | Ordered array of `{task_id, phase, start_day, end_day}` |
| `total_cost_pkr` | `NUMERIC(14,2)` | `NOT NULL`, `>= 0` | Sum of all task labour + material costs |
| `total_duration_days` | `INTEGER` | `NOT NULL`, `> 0` | Critical-path duration across all phases |
| `budget_flag` | `VARCHAR(20)` | `NOT NULL`, `CHECK (budget_flag IN ('within_budget','over_budget','no_budget_given'))` | Comparison against `renovation_requests.budget_declared` |
| `plan_status` | `VARCHAR(30)` | `NOT NULL DEFAULT 'generated'`, `CHECK (plan_status IN ('generated','user_approved','user_rejected','revised'))` | Plan lifecycle state |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | Creation time |

### 3.5 `provider_recommendations`

| Field Name | Data Type | Validation | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY` | Unique recommendation record |
| `plan_id` | `UUID` | `NOT NULL`, `FK → renovation_plan.id` | Parent plan |
| `task_id` | `UUID` | `NOT NULL`, `FK → renovation_tasks.id` | Task being staffed |
| `provider_id` | `UUID` | `NOT NULL`, `FK → providers.id` | Recommended provider |
| `rank` | `INTEGER` | `NOT NULL`, `>= 1` | Rank within this task's candidate list |
| `score_breakdown` | `JSONB` | `NOT NULL` | `{rating_score, distance_score, availability_score, experience_score, price_score, final_score}` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | Creation time |


---

## 4. Sample JSON Payloads

### 4.1 Renovation Request (User Input)

```json
{
  "request_id": "8f14e45f-ceea-4b0a-9d1a-9e2c4a2b7a11",
  "user_id": "3c1a9e2d-5b6f-4a0e-8c2d-1f9a7e3b4d55",
  "room_type": "kitchen",
  "raw_request_text": "I want to renovate my kitchen. Repaint the walls, replace the sink, and redo the cabinets.",
  "budget_declared": 250000,
  "preferred_timeline_days": 14,
  "image_urls": [
    "https://cdn.marketplace.pk/uploads/kitchen_before_1.jpg"
  ],
  "notes": "Prefer matte paint finish, no strong smell",
  "status": "draft"
}
```

### 4.2 Task Extraction Output (Qwen → spaCy → O*NET)

```json
{
  "request_id": "8f14e45f-ceea-4b0a-9d1a-9e2c4a2b7a11",
  "clarification_log": [
    {
      "question": "What is the approximate size of the kitchen (in sq. ft.)?",
      "answer": "About 120 sq ft",
      "timestamp": "2026-07-25T09:12:04Z"
    },
    {
      "question": "Should the cabinets be fully replaced or just refinished?",
      "answer": "Fully replaced",
      "timestamp": "2026-07-25T09:12:41Z"
    }
  ],
  "extracted_tasks": [
    {
      "task_label_raw": "repaint the walls",
      "task_label_normalized": "paint wall",
      "task_category": "painting",
      "onet_occupation_code": "47-2141.00",
      "professional_type": "Painter",
      "extraction_confidence": 0.94
    },
    {
      "task_label_raw": "replace the sink",
      "task_label_normalized": "install sink",
      "task_category": "plumbing",
      "onet_occupation_code": "47-2152.00",
      "professional_type": "Plumber",
      "extraction_confidence": 0.97
    },
    {
      "task_label_raw": "redo the cabinets",
      "task_label_normalized": "install cabinets",
      "task_category": "carpentry",
      "onet_occupation_code": "47-2031.00",
      "professional_type": "Carpenter",
      "extraction_confidence": 0.91
    }
  ]
}
```

### 4.3 Cost Estimation Output (Per Task)

```json
{
  "task_id": "a2b7c9d0-1e3f-4a5b-8c6d-7e9f0a1b2c3d",
  "task_label_normalized": "install cabinets",
  "labour_cost_pkr": 45000,
  "material_cost_pkr": 78000,
  "material_breakdown": {
    "plywood_sheet": {"qty": 6, "unit": "sheet", "unit_price_pkr": 4200, "subtotal_pkr": 25200},
    "laminate_finish": {"qty": 120, "unit": "sq_ft", "unit_price_pkr": 210, "subtotal_pkr": 25200},
    "hardware_fittings": {"qty": 1, "unit": "set", "unit_price_pkr": 27600, "subtotal_pkr": 27600}
  },
  "duration_days": 4.5,
  "model_version": "cost-reg-v1.3",
  "prediction_confidence": 0.86
}
```

### 4.4 Timeline / Sequencing Output

```json
{
  "request_id": "8f14e45f-ceea-4b0a-9d1a-9e2c4a2b7a11",
  "task_sequence": [
    {"task_id": "t-plumb-01", "task": "install sink", "phase": 1, "start_day": 1, "end_day": 2},
    {"task_id": "t-carp-01", "task": "install cabinets", "phase": 2, "start_day": 3, "end_day": 7},
    {"task_id": "t-paint-01", "task": "paint wall", "phase": 3, "start_day": 8, "end_day": 10},
    {"task_id": "t-clean-01", "task": "post-renovation cleaning", "phase": 4, "start_day": 11, "end_day": 11}
  ],
  "total_duration_days": 11
}
```

### 4.5 Final Renovation Plan

```json
{
  "plan_id": "f0a1b2c3-4d5e-6f70-8192-a3b4c5d6e7f8",
  "request_id": "8f14e45f-ceea-4b0a-9d1a-9e2c4a2b7a11",
  "total_cost_pkr": 213500,
  "total_duration_days": 11,
  "budget_flag": "within_budget",
  "tasks": [
    {"task": "install sink", "professional": "Plumber", "cost_pkr": 41500, "duration_days": 2},
    {"task": "install cabinets", "professional": "Carpenter", "cost_pkr": 123000, "duration_days": 5},
    {"task": "paint wall", "professional": "Painter", "cost_pkr": 39000, "duration_days": 3},
    {"task": "post-renovation cleaning", "professional": "Cleaning Crew", "cost_pkr": 10000, "duration_days": 1}
  ],
  "plan_status": "generated"
}
```

### 4.6 Provider Recommendation Output

```json
{
  "task": "install cabinets",
  "recommended_providers": [
    {
      "provider_id": "p-2291",
      "name": "Rawal Interiors & Carpentry",
      "rank": 1,
      "score_breakdown": {
        "rating_score": 0.92,
        "distance_score": 0.88,
        "availability_score": 1.0,
        "experience_score": 0.81,
        "price_score": 0.74,
        "final_score": 0.876
      }
    },
    {
      "provider_id": "p-1187",
      "name": "Al-Noor Woodworks",
      "rank": 2,
      "score_breakdown": {
        "rating_score": 0.85,
        "distance_score": 0.70,
        "availability_score": 0.8,
        "experience_score": 0.90,
        "price_score": 0.82,
        "final_score": 0.812
      }
    }
  ]
}
```


---

## 5. Complete AI Processing Pipeline

### Step 1 — Request Intake

- **Input:** `room_type`, `raw_request_text`, `budget_declared`, `preferred_timeline_days`, `image_urls`, `notes`
- **Processing:** Basic validation (non-empty text, budget ≥ 0 if provided, valid room enum). Record inserted into `renovation_requests` with `status = 'draft'`.
- **AI model:** None (validation layer only)
- **Output:** Persisted request row, `status → 'clarifying'`

### Step 2 — Conversational Understanding & Clarification (Qwen)

- **Input:** `raw_request_text`, plus room type and any prior clarification turns
- **Processing:** Qwen is prompted with a system instruction constraining it to (a) identify whether the request contains enough detail to extract discrete tasks, and (b) if not, ask **one** targeted follow-up question at a time (e.g. missing room size, unclear scope such as "redo cabinets" — replace vs. refinish).
- **AI model:** Qwen (via Ollama), temperature ~0.2 for consistency
- **Decision logic:** If Qwen's self-reported extraction confidence (elicited via a structured JSON response field) is below `0.7`, another clarification round is triggered, up to a maximum of 3 rounds; after 3 rounds the system proceeds with best-effort extraction and flags low-confidence tasks downstream.
- **Output:** Updated `clarification_log`, final free-text request ready for extraction

### Step 3 — Structured Task Extraction (Qwen)

- **Input:** Full clarified request text
- **Processing:** Qwen is prompted to output **only** a JSON array of task phrases (no prose), each with a raw label and a provisional category guess.
- **AI model:** Qwen (via Ollama), JSON-constrained output
- **Output:** `extracted_tasks[]` with `task_label_raw`

### Step 4 — Linguistic Normalization (spaCy)

- **Input:** `task_label_raw` strings
- **Processing:** Tokenization, lemmatization, stop-word removal, and entity extraction (material nouns, room nouns, quantities). `"repaint the walls"` → lemma-normalized to `"paint wall"`.
- **AI model:** spaCy (`en_core_web_sm`/`_lg` pipeline, custom entity ruler for construction vocabulary)
- **Output:** `task_label_normalized`, extracted entities (materials, quantities) attached to each task

### Step 5 — Task → Professional Mapping (O*NET)

- **Input:** `task_label_normalized`
- **Processing:** Normalized task is embedded and matched via cosine similarity against a pre-built index of O*NET task statements. Best match above similarity threshold `0.75` is accepted; below threshold, the task is flagged `professional_type = 'unmatched'` for manual review or a secondary LLM-assisted lookup.
- **AI model:** Sentence-embedding similarity search (scikit-learn / vector index) over O*NET task corpus
- **Output:** `onet_occupation_code`, `professional_type`

### Step 6 — Cost & Duration Estimation (Regression Models)

- **Input:** `task_category`, `professional_type`, room size (from clarification), material entities/quantities, task complexity signal (single vs. multi-step)
- **Processing:** Two regression models run per task — one predicting **labour cost ratio / duration** (trained on the Construction Estimation Dataset's structural relationships), one predicting **material quantities** (trained on the same dataset's material-to-task ratios). Outputs are then rescaled into PKR (see Step 7).
- **AI model:** Gradient Boosted Regressors (scikit-learn `GradientBoostingRegressor` / `RandomForestRegressor`)
- **Output:** Raw duration (days), raw material quantities per task

### Step 7 — Local Price Grounding (PBS + OLX)

- **Input:** Raw material quantities (Step 6), `professional_type`
- **Processing:** Material quantities are multiplied by current PBS unit prices to get `material_cost_pkr`. Labour cost ratios are rescaled using OLX-observed per-day/per-task rates for the matched profession, adjusted for estimated task duration.
- **AI model:** None — deterministic lookup and rescaling
- **Output:** `labour_cost_pkr`, `material_cost_pkr`, `material_breakdown`, written to `task_estimations`

### Step 8 — Rule-Based Scheduling

- **Input:** All tasks for the request with their `task_category` and `duration_days`
- **Processing:** A dependency rule set (see §7) orders tasks into phases, resolves parallelizable tasks within a phase, and computes cumulative start/end days.
- **AI model:** None — deterministic rule engine
- **Output:** `task_sequence[]`, `total_duration_days`, written to `renovation_plan`

### Step 9 — Provider Recommendation

- **Input:** `professional_type` per task, user's approximate location, provider database
- **Processing:** Candidate providers filtered by profession and service radius, then scored using the weighted formula in §8.
- **AI model:** Weighted scoring model (scikit-learn-trained weight calibration, deterministic scoring at inference)
- **Output:** Ranked `provider_recommendations[]` per task

### Step 10 — Final Plan Assembly

- **Input:** All outputs from Steps 6–9
- **Processing:** Aggregation into a single plan object; `total_cost_pkr` summed; compared against `budget_declared` to set `budget_flag`.
- **AI model:** None — aggregation only
- **Output:** `renovation_plan` record, `status → 'estimated'/'scheduled'`, presented to user


---

## 6. Machine Learning Components

### 6.1 Labour Cost & Duration Regression Model

| Aspect | Detail |
|---|---|
| **Algorithm** | Gradient Boosted Regression Trees (`GradientBoostingRegressor`) — chosen over linear regression for its ability to capture non-linear interactions between task complexity and duration without heavy feature engineering |
| **Input features** | `task_category` (one-hot), room size (sq. ft.), number of sub-tasks in the same room, material quantity estimate, historical crew-size for the task type, room type (one-hot) |
| **Target variables** | (a) `duration_days`, (b) `labour_cost_ratio` (labour cost as a fraction of total task cost, learned from the Construction Estimation Dataset) |
| **Training dataset** | Construction Estimation Dataset (structural fields only) |
| **Inference flow** | Feature vector built at Step 6 → model predicts raw duration + labour ratio → Step 7 rescales ratio into PKR using OLX-calibrated day-rate for the matched profession |
| **Rescaling formula** | `labour_cost_pkr = duration_days × onet_profession_day_rate_pkr × complexity_multiplier` |

### 6.2 Material Quantity Regression Model

| Aspect | Detail |
|---|---|
| **Algorithm** | `RandomForestRegressor`, one model per material category (paint, cement, tiles, pipes, fittings, wood) |
| **Input features** | Task category, room size, entity-extracted quantities from user text (if explicitly stated, these override model predictions), room type |
| **Target variable** | Material quantity in standard units (litres, kg, sq. ft., units) |
| **Training dataset** | Construction Estimation Dataset (material-to-task structural ratios only) |
| **Inference flow** | Predicted quantity × PBS unit price → `material_cost_pkr` |

### 6.3 Task / Scope Classification Model

| Aspect | Detail |
|---|---|
| **Purpose** | Cross-checks LLM-extracted tasks against typical room-task bundles to catch missing or spurious tasks (e.g. flag if "cabinets" implies "electrical for under-cabinet lighting" is commonly bundled but was not mentioned) |
| **Algorithm** | Multi-label `RandomForestClassifier` over task-bundle co-occurrence |
| **Training dataset** | Home Renovation Survey Dataset (task co-occurrence structure only) |
| **Inference flow** | Runs after Step 4; outputs a list of "commonly associated tasks not present in this request" as **suggestions only** — surfaced to the user for confirmation, never auto-added |
| **Evaluation metric** | Precision@k on held-out bundles (target: ≥ 0.80 precision at k=3) |

### 6.4 O*NET Task-Matching (Similarity Retrieval)

| Aspect | Detail |
|---|---|
| **Purpose** | Maps normalized task phrases to the closest O*NET task statement / occupation |
| **Method** | TF-IDF or sentence-embedding vectorization of O*NET task corpus (offline, pre-computed), cosine similarity at query time |
| **Threshold** | Accept if similarity ≥ 0.75; else route to `unmatched` queue |
| **Evaluation metric** | Top-1 mapping accuracy against a hand-labeled validation set of 200 renovation task phrases (target: ≥ 90%) |

### 6.5 Provider Recommendation Ranking Model

| Aspect | Detail |
|---|---|
| **Purpose** | Learns the relative importance (weights) of rating, distance, availability, experience, and price in predicting which providers users actually select |
| **Algorithm** | Weight calibration via logistic regression over historical selection data (`selected` vs. `shown-but-not-selected` provider impressions); weights then applied as a deterministic linear scoring formula at inference (§8) |
| **Training dataset** | Marketplace's own historical booking/impression logs (not one of the six external sources — internal platform data) |
| **Evaluation metric** | AUC on held-out impressions; monitored via click-through/booking rate post-deployment |

### 6.6 Feature Engineering Notes

- All monetary quantities used as **model inputs** during training are foreign-dataset ratios/proportions, never absolute values — this keeps the trained coefficients currency-agnostic and safe to rescale with PBS/OLX at inference.
- Room size, when not explicitly provided by the user, is imputed using the median size for the declared `room_type` from the Home Renovation Survey Dataset's structural distribution, and the estimation is marked with a lower `prediction_confidence`.
- Entity-extracted quantities from the user's own text (e.g. "3 doors") always override model-predicted quantities when present — user-stated facts take precedence over statistical priors.

### 6.7 Evaluation Metrics Summary

| Component | Metric | Target |
|---|---|---|
| Duration regression | MAE (days) | ≤ 1.5 days per task |
| Labour cost regression | MAPE | ≤ 20% |
| Material quantity regression | MAPE | ≤ 15% |
| Task/scope classifier | Precision@3 | ≥ 0.80 |
| O*NET matching | Top-1 accuracy | ≥ 90% |
| Provider ranking | AUC | ≥ 0.75 |


---

## 7. Rule-Based Scheduling Engine

Cost and duration are statistically estimated, but **task order is never left to a model** — construction dependency rules are physical/logical constraints, not statistical patterns, so they are enforced deterministically.

### 7.1 Core Dependency Rules

| Rule | Rationale |
|---|---|
| Electrical work before plastering/painting | Conduits and wiring must be embedded before wall surfaces are finished |
| Plumbing (rough-in) before tiling | Pipes must be routed before floor/wall tiles seal the surface |
| Structural/masonry work before electrical | Walls must exist before conduit can be run through them |
| Carpentry (cabinets, fixtures) after painting, before final fittings | Prevents paint damage to installed woodwork, but fixtures (handles, sinks) go in after cabinet installation |
| Painting before final cleaning | Cleaning is always the terminal phase |
| Flooring after all overhead/wall work | Prevents debris/damage to finished floors |

### 7.2 Phase Assignment Logic

Each task's `task_category` is mapped to a **phase number** via a fixed precedence table:

```
Phase 1: masonry, structural
Phase 2: electrical, plumbing (rough-in)
Phase 3: plastering
Phase 4: painting
Phase 5: carpentry, flooring, fixture installation
Phase 6: cleaning
```

- Tasks within the **same phase** are treated as parallelizable (assigned the same start day, unless they require the same professional, in which case they are queued sequentially).
- Tasks are **never** reordered across phases regardless of what order the user mentioned them in — the rule engine overrides extraction order.

### 7.3 Total Timeline Calculation

```
For each phase P (in fixed order):
    phase_duration(P) = max(duration_days of all tasks in P assigned to different professionals)
                         + sum(duration_days of tasks in P sharing the same professional)

total_duration_days = sum(phase_duration(P) for all phases with ≥1 task)
```

Example (from §4.4): plumbing (Phase 2, 2 days) → carpentry (Phase 5, 5 days) → painting (Phase 4 — but reordered ahead of carpentry's fixture step where applicable) → cleaning (Phase 6, 1 day). The engine computes `start_day`/`end_day` per task by walking phases in fixed order and accumulating durations, writing the result into `renovation_plan.task_sequence`.


---

## 8. Provider Recommendation Engine

### 8.1 Ranking Factors

| Factor | Description | Weight |
|---|---|---|
| `rating_score` | Normalized average customer rating (0–1) | 0.30 |
| `distance_score` | Inverse-normalized distance from user's location | 0.20 |
| `availability_score` | 1.0 if provider is free within the task's scheduled window, scaled down otherwise | 0.20 |
| `experience_score` | Normalized count of completed jobs in this task category | 0.15 |
| `price_score` | Inverse-normalized deviation from the task's estimated `labour_cost_pkr` (closer to estimate scores higher, not necessarily cheapest) | 0.15 |

Weights are initialized from domain judgment and refined via the logistic-regression weight calibration described in §6.5 as booking data accumulates.

### 8.2 Scoring Formula

```
final_score = (0.30 × rating_score)
            + (0.20 × distance_score)
            + (0.20 × availability_score)
            + (0.15 × experience_score)
            + (0.15 × price_score)
```

Each sub-score is normalized to `[0, 1]` before weighting:

```
rating_score        = provider_rating / 5.0
distance_score       = 1 - (distance_km / max_service_radius_km)
availability_score   = 1.0 if fully available in window else (available_days / required_days)
experience_score     = min(completed_jobs_in_category / experience_cap, 1.0)
price_score          = 1 - (abs(provider_quote - estimated_cost) / estimated_cost)   [floored at 0]
```

### 8.3 Candidate Filtering (Pre-Scoring)

Before scoring, candidates are filtered to only those:

- Registered under the `professional_type` matched for the task
- Operating within `max_service_radius_km` of the user's location
- Not currently suspended or under active dispute review
- With at least one completed job **or** explicitly marked as "new provider — verified ID" (scored separately with a bounded default `experience_score`)

Top 3–5 scored candidates per task are written to `provider_recommendations`.

---

## 9. End-to-End Workflow

1. User opens the Renovation Planner and submits `room_type`, `raw_request_text`, optional `budget_declared`, `preferred_timeline_days`, images, and notes.
2. System creates a `renovation_requests` record with `status = 'draft'`.
3. Qwen reads the request and evaluates whether enough detail exists to extract discrete tasks.
4. If detail is insufficient, Qwen asks a targeted follow-up question; the answer is appended to `clarification_log`; this repeats up to 3 rounds.
5. Qwen extracts a structured list of task phrases from the fully clarified request.
6. spaCy normalizes and lemmatizes each task phrase and extracts material/quantity entities.
7. Each normalized task is matched against the O*NET task corpus to obtain a `professional_type`.
8. The task/scope classifier flags any commonly-bundled tasks that appear to be missing, and surfaces them to the user as optional additions.
9. Regression models estimate raw duration and material quantities per task.
10. Material quantities are priced against PBS unit rates; labour costs are rescaled using OLX-calibrated day rates for the matched profession.
11. The rule-based scheduling engine assigns each task to a construction phase, resolves parallelizable tasks, and computes the full task sequence with start/end days.
12. The provider recommendation engine filters and scores candidate providers per task and returns a ranked shortlist.
13. All outputs are assembled into a single `renovation_plan` record, including `total_cost_pkr`, `total_duration_days`, and `budget_flag`.
14. The final renovation plan — tasks, costs, sequence, and recommended providers — is presented to the user for review and approval.
15. On approval, `renovation_plan.plan_status` is updated to `user_approved` and the plan is handed off to the booking/dispatch flow (outside this feature's scope).


---

## 10. Error Handling

| Scenario | Detection | System Behaviour |
|---|---|---|
| **Missing information** | Qwen's self-reported extraction confidence < 0.7 after initial parse | Trigger a targeted clarification question; if unresolved after 3 rounds, proceed with best-effort extraction and mark affected tasks `extraction_confidence < 0.7` for user review before finalizing |
| **Impossible budget** | `total_cost_pkr` exceeds `budget_declared` by more than a configurable threshold (e.g. 150%) | `budget_flag = 'over_budget'`; system presents the full plan alongside a clearly labeled cost-reduction suggestion set (e.g. lower-grade materials, task deferral) rather than silently truncating the plan |
| **Conflicting tasks** | Two extracted tasks target the same surface/component with contradictory outcomes (e.g. "repaint walls" and "install wallpaper" on the same wall) | Flagged by the scope classifier as a conflict; user is prompted to choose one before the plan proceeds to estimation |
| **Unknown room** | `room_type` does not match the enum or cannot be inferred from text | Request routed to `status = 'clarifying'` with a direct question asking the user to select from the supported room list; no estimation proceeds until resolved |
| **Unavailable professionals** | Provider filtering (§8.3) returns zero candidates within `max_service_radius_km` for a matched profession | Plan is still generated with cost/schedule intact; the task's `provider_recommendations` is returned empty with a `no_providers_available` flag, and the user is offered to widen the search radius or be notified when one becomes available |
| **Model confidence too low** | Any `task_estimations.prediction_confidence` below 0.5 | Task's cost/duration is shown with a visible "estimate — low confidence, subject to provider quote" label rather than being hidden or silently accepted as final |
| **O*NET mapping failure** | Similarity score below 0.75 threshold (§6.4) | Task routed to `professional_type = 'unmatched'`; either escalated to a fallback keyword-rule lookup or shown to the user with a manual profession-selection prompt |
| **LLM malformed JSON output** | JSON parse failure on Qwen's structured response | Automatic single retry with a stricter formatting reminder; on second failure, fall back to regex-based task-phrase extraction and flag the request for lower extraction confidence |

---

## 11. Future Improvements

The following extensions are designed to slot into the existing pipeline **without changing the core architecture** — each adds a new input signal or refines an existing stage rather than replacing it.

- **Vision AI for Damage Assessment** — Uploaded `image_urls` are currently stored but unused; a future vision model can analyze photos to detect visible damage (cracks, water stains, worn flooring) and feed detected conditions as additional features into the task/scope classifier (§6.3), improving missing-task suggestions.
- **Automatic Measurements from Photos** — Computer-vision-based room dimension estimation from uploaded images could replace the current median-imputation fallback for room size (§6.6), directly improving material quantity regression accuracy.
- **3D Renovation Planning** — A 3D layout generator could consume the same `renovation_plan.task_sequence` and `material_breakdown` outputs to render a visual walkthrough, without requiring any change to the estimation or scheduling logic.
- **Material Recommendation** — An additional recommendation layer could suggest specific material brands/grades (sourced from marketplace supplier listings) once `material_breakdown` quantities are known, sitting entirely downstream of the existing cost engine.
- **Price Forecasting** — A time-series model over historical PBS price data could project material cost trends, allowing the plan to show "estimated cost if started in 30 days" as an additional field on `task_estimations`, without altering how current-day estimates are computed.

Because every future addition consumes an existing pipeline output as its input (images, task list, material breakdown, price history) rather than replacing a pipeline stage, this specification's ten-stage architecture (§1.4) remains stable as the platform's AI capability matures.

> **Note:** The "Vision AI for Damage Assessment" item above was originally listed as a future improvement. It has since been promoted to an implemented, fine-tuned component — see §12.4.

---

## 12. Fine-Tuned Model Components

### 12.1 Task-Extraction LLM (LoRA/QLoRA Fine-Tuned)

| Aspect | Detail |
|---|---|
| **Replaces** | Base spec §Step 3 — prompted-only Qwen task extraction |
| **Base model** | Qwen2.5-1.5B-Instruct or Qwen2.5-3B-Instruct (small enough for consumer/Colab GPU fine-tuning) |
| **Fine-tuning method** | QLoRA (4-bit quantized base weights + trainable low-rank adapters) via `peft` + `transformers` + `bitsandbytes` |
| **Task format** | Instruction-tuning on `(renovation_request_text) → (structured JSON task list)` pairs, same schema as base spec §14.2 |
| **Training data source** | Self-instruct generated + human-verified (see §14.3) |
| **Training data size** | Target: 400–600 examples (small but sufficient for LoRA on a narrow, templated task) |
| **Evaluation** | Exact-match / field-level F1 on a held-out 15% split; compare against the un-tuned base model on the same split |
| **Why it's defensible** | You can produce a genuine before/after accuracy table (§3, item 3) — the single strongest artifact for a panel |

### 12.2 Custom NER Model (spaCy Fine-Tuned)

| Aspect | Detail |
|---|---|
| **Replaces** | Base spec §Step 4 — generic spaCy entity extraction |
| **Base model** | `en_core_web_sm` or `en_core_web_trf`, extended with a custom NER head |
| **New entity labels** | `MATERIAL`, `QUANTITY`, `ROOM`, `TASK_ACTION` |
| **Fine-tuning method** | `spacy train` with a custom `config.cfg`, using spaCy's native training loop (`nlp.update()` under the hood) |
| **Training data source** | Self-instruct generated text (same renovation request corpus as §12.1) manually annotated with `spacy train` — annotation done via Prodigy-style manual tagging or a simple custom labeling script |
| **Training data size** | 300–500 annotated sentences |
| **Evaluation** | Per-entity precision/recall/F1 via spaCy's built-in `Scorer` |
| **Why it's defensible** | Demonstrates you can go beyond "used spaCy" to "trained a domain-specific NER head," a concrete, gradeable ML deliverable |

### 12.3 Fine-Tuned Sentence-Embedding Model for O*NET Matching

| Aspect | Detail |
|---|---|
| **Replaces** | Base spec §6.4 — off-the-shelf TF-IDF/embedding similarity |
| **Base model** | `sentence-transformers/all-MiniLM-L6-v2` (small, fast, fine-tunable) |
| **Fine-tuning method** | Contrastive fine-tuning (`MultipleNegativesRankingLoss` in `sentence-transformers`) on `(renovation task phrase, correct O*NET task statement)` positive pairs, with in-batch negatives |
| **Training data source** | 100% real — pairs are constructed directly from the real O*NET database (§14.1); no synthetic data needed for the O*NET side, only the renovation-phrase side needs paraphrase variation (self-instruct) |
| **Evaluation** | Top-1 / Top-3 retrieval accuracy on a held-out set of hand-labeled renovation phrases, compared against the untrained embedding baseline |
| **Why it's defensible** | Directly improves a measurable, numeric pipeline metric (matching accuracy) — easy to present as a clean ablation |

### 12.4 Vision Model for Damage Assessment (CNN Fine-Tuned)

| Aspect | Detail |
|---|---|
| **Replaces** | Nothing in the base pipeline — this is a genuinely new capability (extends base spec §11's "Future Improvements" into a present-tense, implemented feature) |
| **Base model** | ResNet18 or MobileNetV3-Small, pretrained on ImageNet |
| **Fine-tuning method** | Transfer learning — freeze early conv layers, fine-tune final blocks + a new classification head |
| **Output classes** | `crack_damage`, `water_stain`, `paint_wear`, `no_visible_damage` (extendable) |
| **Training data source** | 100% real online image datasets (§14.1) — Surface Crack Detection (40,000 labeled images), SDNET2018, Concrete Crack Images for Classification |
| **Evaluation** | Accuracy, per-class F1, confusion matrix on held-out test split |
| **Pipeline integration** | Consumes `renovation_requests.image_urls`; output feeds into Step 8's task/scope classifier as an additional signal ("detected damage type X not mentioned in request text") |

### 12.5 Calibrated Regression Models with Uncertainty

| Aspect | Detail |
|---|---|
| **Replaces** | Base spec §6.1/§6.2 — point-estimate `GradientBoostingRegressor` |
| **Method** | Quantile regression: train three models per target (10th, 50th, 90th percentile) using `GradientBoostingRegressor(loss='quantile', alpha=...)`, or `RandomForestRegressor` with per-tree prediction variance as an uncertainty proxy |
| **Training data source** | Real online Kaggle construction datasets (§14.1) |
| **Output change** | `task_estimations` gains `labour_cost_low_pkr`, `labour_cost_high_pkr` (and equivalent for duration) alongside the existing point estimate |
| **Evaluation** | Prediction interval coverage probability (target: ~80% of true values fall within the 10th–90th percentile band) |
| **Why it's defensible** | Shows statistical rigor beyond "we predicted a number" — a panel question like "how confident are you in this estimate?" now has a real, quantified answer |

---

## 13. WOW Sub-Features

### 13.1 Explainability Layer (SHAP)

- **What it does:** For every `task_estimations` record, compute SHAP values against the trained `GradientBoostingRegressor` and surface the top 3 contributing features (e.g. `task_complexity`, `region`, `urgency`) with their direction and magnitude of impact.
- **Pipeline integration:** Runs immediately after Step 6 (Cost & Duration Estimation); output stored as a new `explanation` JSONB field on `task_estimations`.
- **User-facing output example:**
  ```json
  {
    "explanation": {
      "top_factors": [
        {"feature": "task_complexity", "impact": "+PKR 8,200", "direction": "increases_cost"},
        {"feature": "region_karachi", "impact": "+PKR 3,100", "direction": "increases_cost"},
        {"feature": "urgent_timeline", "impact": "+PKR 1,900", "direction": "increases_cost"}
      ]
    }
  }
  ```
- **Effort:** Low — `shap.TreeExplainer` works natively on `GradientBoostingRegressor` with no retraining required.

### 13.2 Confidence-Driven Human-in-the-Loop Flagging (Active Learning Loop)

- **What it does:** Extends base spec §10's low-confidence flagging into a closed loop: predictions below the confidence threshold are logged to a `flagged_predictions` table; once flagged examples cross a batch-size threshold (e.g. 50), a "retraining trigger" event fires.
- **Pipeline integration:** Sits alongside Step 6 and Step 9 outputs; does not block the live pipeline, runs asynchronously.
- **Schema addition:**

| Field | Type | Description |
|---|---|---|
| `id` | `UUID` | Primary key |
| `source_table` | `VARCHAR(50)` | e.g. `task_estimations`, `renovation_tasks` |
| `source_id` | `UUID` | FK to the flagged record |
| `confidence_score` | `NUMERIC(4,3)` | The confidence value that triggered the flag |
| `reviewed` | `BOOLEAN` | Whether a human has corrected/confirmed it |
| `created_at` | `TIMESTAMPTZ` | Flag timestamp |

- **Why it's defensible:** Demonstrates understanding of MLOps concepts (drift monitoring, retraining triggers) rather than a static, one-shot model — a strong answer to "what happens after deployment?"

### 13.3 Before/After Fine-Tuning Benchmark Table

- **What it does:** A single reproducible evaluation script that runs the held-out test set through both the base (un-tuned) model and the fine-tuned model for each of §12.1–§12.3, and outputs a comparison table.
- **Example output (illustrative — populate with your real numbers):**

| Component | Base Model Accuracy | Fine-Tuned Accuracy | Improvement |
|---|---|---|---|
| Task extraction (JSON field F1) | 71% | 89% | +18 pts |
| Custom NER (entity F1) | 62% (generic spaCy) | 84% | +22 pts |
| O*NET matching (Top-1) | 78% | 91% | +13 pts |

- **Why it's defensible:** This is the artifact a panel remembers. It converts "I used AI tools" into "I measured and improved a model," with numbers to back it up.

### 13.4 Regional Cost Variation Model

- **What it does:** Adds `region` (Lahore / Karachi / Islamabad-Rawalpindi / other) as a first-class feature in the cost regression model, calibrated using OLX-observed rate differences across cities.
- **Pipeline integration:** Extends the feature vector in Step 6; requires `region` to be captured at request intake (extend `renovation_requests` with a `city` field).
- **Why it's defensible:** Prevents the "one flat national number" criticism and shows you understand that cost is not homogeneous across Pakistan.

### 13.5 Self-Instruct Synthetic Data Generation Pipeline

- **What it does:** A documented, reproducible script where an LLM generates diverse synthetic renovation requests (varying room, scope, complexity, phrasing style, and even user typos/informality) which are then either auto-labeled (with a strong model) or manually spot-checked, producing the training sets used in §12.1 and §12.2.
- **Why it's defensible:** This is explicitly covered as its own data strategy in §14.3 below — treat it as a documented methodology, not an ad hoc shortcut.

---

## 14. Data Collection Strategy

Every trainable component in this addendum is assigned to exactly one of three data strategies below, chosen based on what is actually available. No component is arbitrarily assumed to have data "somewhere online" without verification — the datasets listed in §14.1 were confirmed to exist at the time of writing.

### 14.1 Strategy A — Real, Fully Online-Available Data (No Manual Collection Needed)

These components can be trained **entirely from existing, free, downloadable, real datasets** — no primary data collection or synthetic generation required.

| Component | Real Dataset(s) | Source | What It Provides |
|---|---|---|---|
| **O*NET task matching** | O*NET 30.3 Database | onetcenter.org (free, CC BY 4.0, official US Dept. of Labor) | Full occupation taxonomy, task statements, skills — used both for the mapping engine and as the "positive pair" source for §12.3's contrastive fine-tuning |
| **Cost/duration regression (structural relationships)** | "Construction Data" (Kaggle, bidding/cost prediction); "Construction Project Management Dataset" (Kaggle — real schedule, cost, and risk data); SMU Data Space "Construction Estimates" dataset (material cost, labour cost, profit rate, total cost columns) | Kaggle / SMU Clowder Data Space | Real task-level cost and duration structural ratios to train the quantile regression models in §12.5 |
| **Vision damage detection** | Surface Crack Detection Dataset (40,000 labeled real images, crack/no-crack); SDNET2018 (Structural Defects Network); Concrete Crack Images for Classification | Kaggle (Mendeley-sourced, peer-reviewed origin) | Directly trains the CNN in §12.4 with zero manual image collection needed |

**Verdict:** cost/duration regression and vision damage detection can be built as fully real-data ML pipelines with proper citations — genuinely strong, defensible components for your FYP with no synthetic data involved at all.

### 14.2 Strategy B — Real, Manually/Primarily Collected Data

These components need data that does not exist in ready-made form online. Manual collection is small-scale but genuinely "real" (primary research), and is the right move where it's feasible within FYP timelines.

| Component | What to Collect | How | Approx. Effort |
|---|---|---|---|
| **Local material prices** | Current PKR prices for cement, paint, tiles, pipes, sanitary items, electrical materials | PBS published bulletins (partially free/public) supplemented by direct price checks at 2–3 local hardware markets | Low — a few hours |
| **Local labour rates** | Per-day/per-task PKR rates for painters, plumbers, carpenters, electricians | Manually observed OLX Pakistan Services listings (no scraping — read and record by hand), as specified in the base spec | Low–Medium — a few hours of browsing and logging |
| **Regional cost calibration (§13.4)** | Rate differences across Lahore / Karachi / Islamabad-Rawalpindi | Same OLX observation exercise, stratified by city filter | Low–Medium |
| **Seed set for renovation request phrasing** *(optional but recommended)* | 30–50 real renovation requests in natural user language | A short Google Form circulated to classmates/family ("describe a renovation you want done") | Low — a day or two to collect |

**Verdict:** this strategy stays intentionally small — its purpose is to anchor/calibrate the real-online-data models (§14.1) to actual Pakistani market conditions, and to give the synthetic generation pipeline (§14.3) a small real "seed" to imitate, not to be the primary training source for anything.

### 14.3 Strategy C — Synthetic / Self-Instruct Data

No ready-made dataset exists anywhere for "renovation request text → structured task JSON" or "renovation text with MATERIAL/QUANTITY/ROOM/TASK_ACTION entity tags" — this was confirmed by search; nothing domain-specific exists at this granularity. For these two components only, synthetic generation is the correct and standard approach, not a shortcut.

| Component | Why Synthetic Is Needed | Method |
|---|---|---|
| **Task-extraction LLM fine-tuning (§12.1)** | No existing dataset maps renovation requests to structured task lists | Self-instruct: prompt a strong LLM to generate diverse renovation requests (varying room, scope, phrasing, informality) seeded by the ~30–50 real requests from §14.2; label each with the correct structured JSON output (either by the same LLM with verification, or manually for a subset); target 400–600 final examples |
| **Custom NER training data (§12.2)** | No existing MATERIAL/QUANTITY/ROOM/TASK_ACTION-tagged renovation corpus exists | Reuse the same synthetic request corpus from above; annotate with `spacy train`-compatible span labels (via manual tagging tool or a labeling script), 300–500 sentences |

**Methodology note for your defense:** this is the **self-instruct** technique (the same method used in well-known instruction-tuning research such as Stanford's Alpaca). It is a documented, citable, legitimate data-augmentation strategy for narrow domains where labeled data does not exist — not an improvised workaround. Framing it this way in your defense (with the citation) converts a potential weak point into evidence of research awareness.

### 14.4 Data Strategy Summary Table

| Component | Strategy A (Real Online) | Strategy B (Real Manual) | Strategy C (Synthetic/Self-Instruct) |
|---|---|---|---|
| Task-extraction LLM fine-tuning | — | Seed phrasing only (~30–50 examples) | ✅ Primary source |
| Custom NER fine-tuning | — | Seed phrasing only | ✅ Primary source |
| O*NET embedding fine-tuning | ✅ O*NET side of pairs | — | Renovation-phrase side reuses §12.1's data |
| Cost/duration quantile regression | ✅ Primary source | ✅ PBS + OLX calibration | — |
| Vision damage detection CNN | ✅ Primary source | Optional: a few of your own photos to extend classes | — |
| Regional cost variation model | — | ✅ Primary source (OLX by city) | — |

---

## 15. Updated Architecture (With Fine-Tuned Components Highlighted)

```
User Request
     │
     ▼
Qwen — QLoRA FINE-TUNED (task-extraction adapter)          ◄── Strategy C
  - Understand request
  - Ask follow-up questions
  - Extract renovation tasks
     │
     ▼
spaCy — FINE-TUNED NER (MATERIAL, QUANTITY, ROOM, TASK_ACTION)  ◄── Strategy C
  - Normalize and clean tasks
     │
     ▼
Task → Professional Mapping
  Sentence-Transformer — FINE-TUNED (contrastive, O*NET pairs)   ◄── Strategy A
     │
     ▼
Cost & Duration Estimation
  Quantile Regression Models (uncertainty bands)                ◄── Strategy A + B
  + SHAP Explainability Layer
     │
     ▼
Vision Damage Assessment (NEW)
  CNN — FINE-TUNED (transfer learning, ResNet18/MobileNet)      ◄── Strategy A
     │
     ▼
Scheduling Engine (Rule-Based Dependencies) — unchanged
     │
     ▼
Provider Recommendation Engine — unchanged
  + Regional Cost Variation signal                              ◄── Strategy B
     │
     ▼
Final Renovation Plan
  + Confidence flags → Active Learning Loop (flagged_predictions)
```

---

## 16. Evaluation & Benchmarking Plan

| Model | Metric | Baseline | Target |
|---|---|---|---|
| Task-extraction LLM | Field-level JSON F1 | Un-tuned Qwen (prompted only) | +15–20 pt improvement |
| Custom NER | Entity-level F1 | Generic `en_core_web_sm` | +15–20 pt improvement |
| O*NET embedding matcher | Top-1 retrieval accuracy | Off-the-shelf MiniLM embeddings | +10–15 pt improvement |
| Cost/duration quantile regression | Prediction interval coverage | N/A (new capability) | ~80% coverage at 10th–90th percentile band |
| Vision damage CNN | Classification accuracy / F1 | N/A (new capability) | ≥ 85% test accuracy |

Every row above is designed to produce a **concrete, numeric before/after or target-vs-achieved comparison** — this is what should anchor your results chapter and your panel defense slides.

---

## 17. Citations to Use in Your FYP Documentation

- O*NET 30.3 Database — U.S. Department of Labor, Employment and Training Administration (USDOL/ETA), licensed under CC BY 4.0 (onetcenter.org)
- Surface Crack Detection Dataset — Özgenel, Ç.F. (2019), "Concrete Crack Images for Classification," Mendeley Data, v2, DOI: 10.17632/5y9wdsg2zt.2
- Self-instruct methodology — Wang et al., "Self-Instruct: Aligning Language Models with Self-Generated Instructions" (Stanford Alpaca uses the same underlying approach)
- Kaggle construction cost/project datasets — cite the specific dataset page URL and uploader for each one you end up using

---

*End of Specification — AI Home Renovation Planner v2.0 (Merged: Core Architecture + Fine-Tuned ML Layer + Data Strategy)*
