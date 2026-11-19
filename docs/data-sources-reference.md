# Ustadji — AI Features: Data Sources Reference

Self-hosted, no-paid-API approach for all three features. Full plans: `voice-feature-plan.md`, `damage-assessment-feature-plan.md`, `pricing-engine-feature-plan.md`.

---

## 1. Voice-Powered Booking

User speaks in Urdu, English, or Roman Urdu to search and book services; self-hosted STT + translation feeds the same booking agent used for text chat.

| Source | Useful? | Use Case | Link |
|---|---|---|---|
| Mozilla Common Voice (Urdu) | Yes | Whisper fine-tuning + WER baseline testing before touching real users | https://commonvoice.mozilla.org |
| CLE (Center for Language Engineering, Pakistan) | Partial | Urdu-script reference and transliteration mapping; much of it needs a request-access process, not instant download | https://www.cle.org.pk |
| Roman-Urdu-Parl (6.37M parallel sentences) | Yes - best find | Bootstrap the Roman Urdu normalization dictionary; large enough to train a real transliteration model | https://dl.acm.org/doi/10.1145/3464424 |
| Smat26 Roman Urdu Dataset | Yes, supplementary | Adds more Roman Urdu spelling variants (sourced from reviews/social media) on top of Roman-Urdu-Parl | https://github.com/Smat26/Roman-Urdu-Dataset |
| Whisper Urdu fine-tune (existing checkpoint) | Yes | Starting point to fine-tune further, instead of training a Whisper model from scratch | https://huggingface.co/Abdul145/whisper-medium-urdu-custom |
| Wav2Vec2 Urdu fine-tune (existing checkpoint) | Optional | Alternative STT architecture to benchmark against Whisper - not required, useful for comparison | https://huggingface.co/kingabzpro/wav2vec2-urdu |

---

## 2. Multimodal Damage Assessment

User uploads a photo/video of a broken appliance; app identifies the appliance, brand, and (once trained on real data) the likely issue.

| Source | Useful? | Use Case | Link |
|---|---|---|---|
| Roboflow Universe - appliance detection | Yes | Direct training data for the appliance-type classifier (Stage 1) - already labeled for fridge/AC/oven/microwave etc. | https://universe.roboflow.com/appliancedetection/appliance-detection |
| Roboflow Universe - appliance search (all projects) | Yes | Broader sourcing across multiple appliance-labeled community projects; check license per-project | https://universe.roboflow.com/search?q=class%3Aappliance |
| Google Open Images V7 | Yes, with caveat | Large-scale supplementary appliance images (has a Refrigerator class); verify per-image license before commercial use | https://www.kaggle.com/datasets/bigquery/open-images |
| Kaggle - Electronic Components | Supplementary only | Adds background/class diversity for Stage 1; not appliance-specific enough to be a primary source | https://www.kaggle.com/datasets/aryaminus/electronic-components |
| Kaggle - Kitchen Image Dataset | Supplementary only | Real-setting background/context diversity (appliances in situ, not catalog shots) | https://www.kaggle.com/datasets/dataclusterlabs/kitchen-full-image-dataset |
| CarDD (car damage dataset) | Reference only, not usable data | Wrong object entirely (cars, not appliances) - useful only for copying its annotation/severity-tagging methodology | https://cardd-ustc.github.io |
| OLX Pakistan - Electronics & Appliances | Partial | Real used-appliance photos in actual Pakistani homes (images only - descriptions aren't structured fault labels); scraping sits in a ToS gray zone | https://www.olx.com.pk/electronics-home-appliances_c99 |
| iFixit | No - actively avoid | Looked like the obvious answer (real appliance teardown photos) but ToS explicitly bans using their data to train AI models, and content is CC BY-NC-SA (noncommercial) | https://about.ifixit.com/Info/Licensing |
| PaddleOCR | Yes | Self-hosted OCR engine for reading brand/model text off appliance nameplates | https://github.com/PaddlePaddle/PaddleOCR |
| EasyOCR | Yes, alternative | Second self-hosted OCR option to benchmark against PaddleOCR | https://github.com/JaidedAI/EasyOCR |

**Note:** no public dataset of *damaged* appliances exists anywhere - every source above helps Stage 1 (what appliance is it) or OCR (whose is it), not Stage 2 (what's wrong with it). Stage 2 requires your own pilot data collection - see damage-assessment-feature-plan.md Section 4.

---

## 3. Smart Dynamic Pricing Engine

Provider records a voice note describing completed work; self-hosted STT + extraction turns it into a structured, itemized bill via a deterministic pricing formula.

| Source | Useful? | Use Case | Link |
|---|---|---|---|
| (Reuses Whisper sources from Section 1) | Yes | Same self-hosted STT pipeline already built for voice booking - no new STT work needed | - |
| SROIE (receipt extraction dataset) | Not usable as training data | Wrong modality (scanned printed receipts, not spoken narration) and wrong language; not something you can train on directly | https://arxiv.org/pdf/2103.10213 |
| CORD (Consolidated Receipt Dataset) | Reference only, not usable data | Same modality/language mismatch as SROIE; its line-item field schema (menu/qty/price hierarchy) is worth copying when designing your own extraction schema | https://github.com/clovaai/cord |
| Qwen2.5 / Qwen3 (Apache 2.0) | Yes - core to the solution | Self-hosted LLM that does the actual structured JSON extraction from transcripts, via few-shot prompting | https://huggingface.co/Qwen |
| NuExtract3 (NuMind, Apache 2.0) | Yes - purpose-built alternative | Small (4B) model trained specifically for structured extraction; worth testing against Qwen for this exact task | https://www.buildmvpfast.com/blog/nuextract3-open-weight-vlm-structured-extraction-self-hosted-2026 |
| Ollama | Yes | Local serving layer to run the self-hosted extraction model | https://ollama.com |

**Note:** unlike Feature 2, this task needs little to no training data - few-shot prompting or a 20-50 example LoRA fine-tune is sufficient, since structured text extraction generalizes far better from small samples than visual damage recognition does. No public dataset solves this directly, but none is really needed here.

---

*Verify licenses per-dataset before commercial use, especially for anything sourced from Kaggle/Roboflow community uploads - check each listing individually rather than assuming.*
