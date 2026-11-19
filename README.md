# UstadJi

**An AI-assisted home-services marketplace for Islamabad.**

UstadJi connects customers with local service professionals—*ustads*—for plumbing,
electrical work, AC repair, carpentry, and cleaning. Customers can describe a
household problem in Roman Urdu, prepare a service visit through a conversational
assistant, and track their booking through the mobile app.

This final-year project is under active development. The current focus is the
**M3 AI Conversational Booking Agent**, using a small language model running
locally through Ollama.

## Current features

- **Customer authentication and profiles:** backend login, saved service address,
  and sector-based service coverage.
- **Conversational booking:** structured extraction of service issues, visit dates,
  time preferences, and provider references from Roman Urdu messages.
- **Corrections across turns:** change a date, time, or provider while preserving
  other valid booking details. Chat state survives navigating between screens.
- **Validated provider and slot selection:** match actual verified providers and
  available appointment slots; ask for clarification when a choice is ambiguous.
- **Booking confirmation and tracking:** review a summary before submitting a
  database-backed request, then view it in My Bookings. Requests can await provider
  acceptance or be scheduled automatically, depending on provider preferences.
- **Simulation mode:** exercise the confirmation flow without creating a real
  booking or sending a provider request.

For example:

> Kitchen ka pipe leak hai.
>
> Tariq ko parson subah 10 baje bula dein.
>
> 10 ke bajaye 11 baje.

The requested ustad and time must match real service data. The model proposes
details; the backend validates them, and the customer explicitly confirms the
reviewed request before a booking is created.

## Technology stack

| Component | Technology |
| --- | --- |
| Mobile application | React Native, Expo, TypeScript |
| Backend | NestJS, TypeScript |
| Database | PostgreSQL with Prisma |
| Authentication | JWT |
| Local language model | Qwen3.5-2B, 4-bit (`qwen3.5:2b-q4_K_M`) via Ollama |
| Slot locking | Redis, with an in-memory development fallback |
| Web UI prototype | React and Vite |

The booking assistant does not require a hosted LLM API. Fully offline operation
also requires a local PostgreSQL database; a hosted database still needs network
access even when inference runs on the PC.

## Repository structure

```text
backend/          NestJS API, Prisma schema, conversational agent, and tests
ustadji-mobile/   Expo / React Native mobile application
UstadJi/          React / Vite web UI prototype
.github/          GitHub Actions workflows
docs/             Project documentation and feature specifications
```

## Documentation

Project documentation and design specifications are organized in the `docs/` directory:

- [Feature Specifications](docs/basic_features.md)
- [CI/CD Pipeline](docs/cicd_pipeline.md)
- [Damage Assessment Feature Plan](docs/damage-assessment-feature-plan.md)
- [Data Sources Reference](docs/data-sources-reference.md)
- [Database Schema](docs/database_schema.md)
- [Fake Review Detection](docs/feature_fake_review_detection.md)
- [Predictive Maintenance](docs/feature_predictive_maintenance.md)
- [Architecture and Implementation Plan](docs/plan1.md)
- [Pricing Engine Feature Plan](docs/pricing-engine-feature-plan.md)
- [Technology Stack](docs/tech-stack.md)
- [Voice Feature Plan](docs/voice-feature-plan_.md)

## Run locally

Start with the [Windows local setup guide](backend/RUN_LOCALLY.md). It covers
Ollama, backend configuration, Expo Go over Wi-Fi, real versus simulated bookings,
and preparation for completely offline use.

- [Agent configuration and testing](backend/AGENT_SETUP.md)
- [M3 implementation plan and remaining work](backend/M3_IMPLEMENTATION_PLAN.md)

You will need the model downloaded, project dependencies installed, a reachable
PostgreSQL database, and a customer profile with an address and sector. Keep
credentials in local environment files and out of version control.

## Verification

From `backend/`:

```sh
npm run test:agent
npm run test:agent:understanding
npm run test:agent:understanding:live
```

The first two commands use mocked model/booking data. The live understanding check
uses local Ollama with synthetic service data. These checks do not create real
database bookings.

## Development status

Roman Urdu understanding is experimental and has smoke-test coverage; broader
language accuracy and performance evaluation remain in progress. Sessions are
currently held in memory, so a full app or backend restart does not restore them.
Some screens outside the integrated booking flow still use prototype/demo data.

Planned work includes durable conversations, conversational cancellation and
rescheduling, Urdu and English evaluation, push-to-talk voice input and spoken
replies, multimodal issue assessment, and further pricing and dispute workflows.
These are roadmap items, not completed capabilities.
