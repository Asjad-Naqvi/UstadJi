# Feature Specification: Predictive Maintenance Engine (Data-Driven Triaging)

## 1. Feature Overview

The Predictive Maintenance feature proactively prevents costly appliance failures by forecasting when an installed asset is nearing its degradation threshold. The system simulates realistic maintenance cycles using a combination of synthetic user history data and deterministic manufacturer-published service intervals. It then triggers automated, voice-friendly reminders to the consumer via the conversational agent before a critical breakdown occurs.

---

## 2. Data Sources & Engineering Logic

### A. Manufacturer Baseline Data (Deterministic Rules)

Rather than relying purely on complex black-box modeling at launch, the system utilizes standard, publicly available manufacturer guidelines extracted from appliance manuals and official websites. These form our hard thresholds:

- **Water Heaters / Geysers:** Hard interval of every 12 months (anode rod inspection, flushing sediment).
- **Air Conditioners (HVAC):** Seasonal interval triggered exactly 30 days prior to peak summer demand cycles (typically scheduled around March/April in target urban sectors).

### B. Synthetic Data Simulation (Clearly Labeled)

To train our scheduling pipelines before acquiring long-term user history, **all initial baseline maintenance cycles are generated using synthetic data**.

- **Labeling:** All simulated history logs in development are flagged with `is_synthetic: true`.
- **Simulation Parameters:** We inject randomized variables based on standard wear-and-tear coefficients (e.g., higher utilization coefficients for AC units located in top-floor apartments during peak summer months).

---

## 3. Structured Data Schema (`JSONB` Asset Specifications)

The tracking data sits inside a dedicated schema tracking user appliances. The core parameters, maintenance frequencies, and state histories are logged as follows:

### Maintenance Schema Structure

| Field Name           | Data Type | Validation Rule / Constraint | Description                                |
| :------------------- | :-------- | :--------------------------- | :----------------------------------------- |
| `asset_id`           | UUID      | PRIMARY KEY                  | Unique identifier for the appliance        |
| `user_id`            | UUID      | FK -> `users.id`             | Target consumer profile                    |
| `appliance_type`     | VARCHAR   | E.g., 'Water Heater', 'AC'   | Equipment classification                   |
| `installation_date`  | DATE      | NOT NULL                     | Baseline date to begin tracking cycles     |
| `last_serviced_at`   | TIMESTAMP | NULLABLE                     | Date of last verified maintenance          |
| `next_reminder_date` | DATE      | CALCULATED                   | `last_serviced_at` + Manufacturer Interval |
| `maintenance_log`    | JSONB     | DEFAULT '[]'::jsonb          | Combined history array (Synthetic + Real)  |

### Sample `maintenance_log` JSON Payload

```json
[
  {
    "service_id": "syn-9821-x",
    "is_synthetic": true,
    "service_type": "Pre-Summer Deep Clean",
    "performed_at": "2025-04-15T09:00:00Z",
    "technician_notes": "Simulated baseline service. Coils cleared of dust blockages."
  },
  {
    "service_id": "real-4412-a",
    "is_synthetic": false,
    "service_type": "Flushing Sediment & Valve Swap",
    "performed_at": "2026-01-10T11:30:00Z",
    "technician_notes": "Verified on-site completion via Proof-of-Work Node."
  }
]
```

---

## 4. Notification & Agent-Based Triage Flow

1. **The Scheduler Check:** A background cron job runs daily to query the database for records where `next_reminder_date == CURRENT_DATE`.
2. **Context Injection:** The system fetches the specific appliance data and passes it directly to the conversational agent's context window.
3. **Proactive Outreach:** The agent initiates a highly tailored chat sequence or voice alert using the user's preferred language module:
   > _"Hey, based on manufacturer guidelines, your AC unit hasn't been serviced in 11 months. To avoid high electricity bills and cooling drops before the summer heat hits next month, would you like me to match you with a top-rated HVAC technician in your sector right now?"_
