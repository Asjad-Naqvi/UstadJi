# Core Features Specification

This document details the functional requirements and system logic for the platform's primary modules.

---

## 1. User Registration and Login

- **Description:** Allows both customers and service providers to create secure accounts and manage their profiles on the platform.
- **How it works:**
  1. The user provides their Full Name, Email, and a secure Password.
  2. The user explicitly selects a role: **Customer** or **Service Provider**.
  3. The system stores these credentials in the relational database.
  4. Upon login, the system authenticates the user and routes them to their respective portal.

---

## 2. Service Request Creation

- **Description:** The initial entry point for customers to report a household maintenance problem.
- **How it works:**
  1. A logged-in customer fills out a request form.
  2. The user selects a specific domain from a predefined dropdown list: **Plumbing**, **Electrical**, **Carpentry**, or **AC Repair**.
  3. The user inputs a text description detailing the specific problem.
  4. The system automatically tags the request with the customer's unique ID and sets the initial status to `Pending`.

---

## 3. Nearby Service Provider Matching

- **Description:** Automatically identifies available service providers within the vicinity of the customer.
- **How it works:**
  1. The system captures the customer's active location coordinates when a request is submitted.
  2. The application queries the database for service providers who operate within that specific category.
  3. A geographical query filters out providers whose active locations fall outside the defined distance radius.

---

## 4. Smart Provider Ranking

- **Description:** Evaluates and orders the matched service providers to present the best options to the user.
- **How it works:**
  1. The system aggregates historical performance data for the filtered nearby providers.
  2. Providers are ranked dynamically using a combined scoring system based on: average ratings, text reviews, total experience, historical reliability metrics, real-time distance, and current availability.
  3. The sorted list is prepared for UI presentation or agent routing.

---

## 5. Agent-Based Assistance

- **Description:** An intelligent agent acts as an interactive middle layer between users and service providers.
- **How it works:**
  1. The agent intercepts or initiates the service request pipeline.
  2. It evaluates the user's initial problem description, dynamically prompts the user for missing information, and analyzes the context.
  3. Once details are clear, the agent programmatically triggers the matching and ranking system to recommend the most suitable provider.

---

## 6. Communication Between User and Service Provider

- **Description:** Provides a secure messaging channel for the customer and the matched provider.
- **How it works:**
  1. Once a connection is established, the platform opens a dedicated communication channel for that specific service ticket.
  2. Both parties can exchange text updates, discuss job specificities, schedule site visits, and update the status of the task.

---

## 7. Booking and Scheduling

- **Description:** Allows the customer to lock in a specific slot with the chosen service provider.
- **How it works:**
  1. The customer reviews the provider's active calendar or open windows.
  2. The customer selects a mutually suitable date and time for the on-site visit.
  3. The system locks the slot, sets the request status to `Scheduled`, and alerts both parties.

---

## 8. Real-Time Service Tracking

- **Description:** Keeps the customer updated on the live status of their active job ticket.
- **How it works:**
  1. The provider updates the request state via their dashboard (e.g., "En Route", "Arrived", "Work In Progress").
  2. The system reflects these status changes immediately on the customer’s UI view.

---

## 9. Ratings and Reviews

- **Description:** Captures quality feedback from the customer after the work is finalized.
- **How it works:**
  1. Once the provider marks a job as `Completed`, the customer's portal unlocks a review form.
  2. The customer submits a numerical rating (1-5 stars) and text-based feedback.
  3. The system updates the provider's global rating metrics in the database to influence future rankings.

---

## 10. Service History

- **Description:** Provides an archive for users to track their entire historical lifecycle on the app.
- **How it works:**
  1. The application provides an archive panel showing previous bookings, past invoices, historical text logs, and completed jobs.
  2. Users can filter this dashboard by status or date range.

---

## 11. Provider Dashboard

- **Description:** The central hub for technicians to manage their business operations.
- **How it works:**
  1. Providers log in to a dedicated workspace.
  2. The interface allows them to toggle their active availability status, view incoming booking requests, inspect user reviews, and monitor their financial tracks from completed jobs.

---

## 12. Core System Rules

To ensure strict data quality across all primary features, we must enforce the following rules:

- Every database record must be explicitly validated (no empty descriptions, email inputs must be structurally checked).
- Operational data streams must map directly to our normalized relational schemas to prevent integrity issues.
