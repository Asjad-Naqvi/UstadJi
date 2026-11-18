# Database Schema Specification (MVP)

This document defines the relational database schema for the Ustadji MVP launch, utilizing PostgreSQL (Supabase) as our core relational engine with `JSONB` fields for flexible, AI-generated structured outputs.

---

## 1. Core Tables

### `users`

_Tracks standard account registration for consumers (linked directly to Supabase Auth)._

| Column Name  | Data Type    | Constraints      | Description                |
| :----------- | :----------- | :--------------- | :------------------------- |
| `id`         | UUID         | PRIMARY KEY      | Linked to `auth.users.id`  |
| `full_name`  | VARCHAR(100) | NOT NULL         | User's full name           |
| `email`      | VARCHAR(100) | UNIQUE, NOT NULL | Account email address      |
| `created_at` | TIMESTAMP    | DEFAULT NOW()    | Account creation timestamp |

---

### `providers`

_Contains professional details, rates, and coverage sectors for service providers._

| Column Name    | Data Type     | Constraints                   | Description                        |
| :------------- | :------------ | :---------------------------- | :--------------------------------- |
| `id`           | UUID          | PRIMARY KEY, FK -> `users.id` | Link to core user record           |
| `trade`        | VARCHAR(50)   | NOT NULL                      | E.g., 'Plumbing', 'Electrical'     |
| `sectors`      | VARCHAR(50)[] | NOT NULL                      | Array of Islamabad sectors covered |
| `hourly_rate`  | NUMERIC(10,2) | NOT NULL                      | Base hourly service fee            |
| `is_available` | BOOLEAN       | DEFAULT TRUE                  | Real-time availability status      |

---

### `service_tickets`

_Tracks the customer's reported problem and the M7 Multimodal Damage Assessment outputs._

| Column Name         | Data Type   | Constraints      | Description                       |
| :------------------ | :---------- | :--------------- | :-------------------------------- |
| `id`                | UUID        | PRIMARY KEY      | Unique ticket identifier          |
| `consumer_id`       | UUID        | FK -> `users.id` | The reporting consumer            |
| `category`          | VARCHAR(50) | NOT NULL         | Extracted service category        |
| `damage_photo_url`  | TEXT        | NULLABLE         | Path to image in Supabase Storage |
| `damage_assessment` | JSONB       | NULLABLE         | Claude Sonnet structured output   |
| `safety_hazard`     | BOOLEAN     | DEFAULT FALSE    | Server-side safety override flag  |

---

### `bookings`

_Manages the 8-phase booking lifecycle and matches users to providers._

| Column Name           | Data Type   | Constraints                | Description                      |
| :-------------------- | :---------- | :------------------------- | :------------------------------- |
| `id`                  | UUID        | PRIMARY KEY                | Unique booking identifier        |
| `ticket_id`           | UUID        | FK -> `service_tickets.id` | Associated service ticket        |
| `provider_id`         | UUID        | FK -> `providers.id`       | Assigned service provider        |
| `status`              | VARCHAR(50) | DEFAULT 'Pending'          | Current phase state (1 to 8)     |
| `providers_contacted` | INT         | DEFAULT 1                  | Total match attempts (Section 7) |
| `first_rank_used`     | BOOLEAN     | NULLABLE                   | Did 1st ranked provider accept?  |
| `time_to_confirm_sec` | INT         | NULLABLE                   | Seconds from creation to accept  |
| `created_at`          | TIMESTAMP   | DEFAULT NOW()              | Creation timestamp               |

---

### `invoices`

_Stores deterministic bills and the M8 Voice-to-Invoice Whisper extraction JSON._

| Column Name        | Data Type     | Constraints         | Description                            |
| :----------------- | :------------ | :------------------ | :------------------------------------- |
| `id`               | UUID          | PRIMARY KEY         | Unique invoice ID                      |
| `booking_id`       | UUID          | FK -> `bookings.id` | Linked booking reference               |
| `voice_transcript` | TEXT          | NULLABLE            | Raw Whisper Urdu/English transcription |
| `extracted_data`   | JSONB         | NULLABLE            | Claude extracted structured facts      |
| `line_items`       | JSONB         | NOT NULL            | Final calculated parts & labor cost    |
| `total_amount`     | NUMERIC(10,2) | NOT NULL            | Deterministic final computed price     |
| `signature_url`    | TEXT          | NULLABLE            | Customer confirmation signature        |

---

### `reviews`

_Post-job feedback that feeds our dynamic provider ranking metrics._

| Column Name     | Data Type | Constraints                    | Description                |
| :-------------- | :-------- | :----------------------------- | :------------------------- |
| `id`            | UUID      | PRIMARY KEY                    | Unique review identifier   |
| `booking_id`    | UUID      | FK -> `bookings.id`            | Target booking transaction |
| `provider_id`   | UUID      | FK -> `providers.id`           | Provider receiving rating  |
| `rating`        | INT       | CHECK (rating BETWEEN 1 AND 5) | Review score               |
| `feedback_text` | TEXT      | NULLABLE                       | Written customer feedback  |

---

### `agent_sessions`

_Captures interaction traces to evaluate conversational flow and funnel drop-offs._

| Column Name   | Data Type | Constraints      | Description                         |
| :------------ | :-------- | :--------------- | :---------------------------------- |
| `id`          | UUID      | PRIMARY KEY      | Unique session identifier           |
| `user_id`     | UUID      | FK -> `users.id` | User interacting with Ustadji agent |
| `phase_log`   | JSONB     | DEFAULT '[]'     | List of phase transitions           |
| `total_turns` | INT       | DEFAULT 0        | Count of chat messages exchanged    |
| `completed`   | BOOLEAN   | DEFAULT FALSE    | Successful session completion flag  |

---

### `disputes`

_Tracks unresolved anomalies and complaints raised in Phase 8._

| Column Name      | Data Type    | Constraints         | Description                       |
| :--------------- | :----------- | :------------------ | :-------------------------------- |
| `id`             | UUID         | PRIMARY KEY         | Unique dispute identifier         |
| `booking_id`     | UUID         | FK -> `bookings.id` | Target transaction being disputed |
| `classification` | VARCHAR(100) | NOT NULL            | AI-categorized issue type         |
| `status`         | VARCHAR(50)  | DEFAULT 'Open'      | Resolution status                 |
