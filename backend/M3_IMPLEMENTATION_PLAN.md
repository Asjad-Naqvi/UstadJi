# M3 audit and implementation plan

Status: architecture audit and proposed contracts, 17 November 2026.
This document is a plan, not a claim that the missing capabilities are implemented.

Implementation update: the first structured text increment is now implemented in
understanding.ts and booking-understanding.ts, orchestrated by agent.service.ts.
It includes bounded/grounded extraction, provider-name and time resolution, draft
corrections, ambiguity handling and explicit confirmation. Fixture HTTP checks,
deterministic regression checks, a real-Qwen four-turn correction conversation
and two additional Roman Urdu extraction examples passed. This is smoke-test
coverage, not the 60-scenario release benchmark below. Persistent sessions,
existing-booking management and speech remain following increments.

## Architecture decision

Keep React Native/Expo, NestJS, Prisma/PostgreSQL, existing JWT authentication,
ProvidersService, BookingsService, and local Ollama qwen3.5:2b-q4_K_M.
Do not introduce FastAPI, replace the database, or add LangGraph for this work.
A future local Python speech worker can sit behind NestJS if its libraries need
Python. The mobile app should continue talking to one authenticated backend.
The pasted architecture is reference material; the repository is the source of
truth for the existing stack.

## Audit findings

| Capability | Current implementation | Gap |
| --- | --- | --- |
| Local generation | AgentService calls Ollama with history and system context | Free-text wording only; no structured understanding |
| Service/date extraction | Keyword expressions and dateFromText | Limited vocabulary; no Urdu-script extraction, weekday/time preferences, or negation-aware multi-field edits |
| Booking execution | Authenticated /agent/chat validates provider, exact slot and explicit confirmation; delegates to BookingsService | Text cannot select offered providers/slots; no conversational management of existing bookings |
| Corrections | Date/category changes update state | Every message clears slot/summary, even thanks or unrelated questions; issue description is not maintained across follow-ups |
| Matching | Verified trade + saved-sector filtering; actual working hours and availability | No model-proposed choice resolution against offered candidates |
| Conversation memory | AgentChatProvider survives navigation; backend Map stores sessions | Full app/backend restart loses state; backend expiry is 30 minutes |
| Language | Roman Urdu instructions, greeting/echo filtering | No measured English/Urdu/mixed-language quality; broad output-word filter rejects some harmless wording |
| Booking records | Real creation and My Bookings retrieval already work | Durable request idempotency and reconciliation are missing |
| Reschedule/cancel | Existing BookingsService methods | Not exposed through the agent; existing booking controller lacks route guards/ownership checks |
| Scheduling | Creation validates exact start/end and uses slot locks | Revisit date/timezone handling and reschedule's start-only slot check, lock release, race handling and status eligibility |
| Speech | No recorder, ASR or TTS dependencies integrated | Entire push-to-talk pipeline and device permissions remain |
| Evaluation | Fixture HTTP safeguards and a small live smoke test | No held-out multilingual extraction/completion benchmark |

Relevant files: src/agent/agent.service.ts, agent-prompt.ts, agent.module.ts;
src/bookings/bookings.service.ts and bookings.controller.ts;
../ustadji-mobile/src/components/AgentChatProvider.tsx;
../ustadji-mobile/src/screens/HzAiBookingChatScreen.tsx.

## First implementation increment: structured text understanding

1. Add one schema-constrained Ollama extraction call per user message.
   Use Ollama /api/chat's format JSON schema, not unconstrained generated JSON.
   Schema validity alone does not establish semantic accuracy.
2. Interpret intent, language, problem, date/time preference and choice references.
   Keep extracted changes separate from the authoritative session state.
3. Validate proposed changes; resolve relative dates using an injected current
   date in Asia/Karachi; ask about ambiguous time, date, negation or multiple jobs.
   Do not treat the model's self-reported confidence as proof.
4. Apply accepted changes deterministically. Clear provider/slot/confirmation only
   when the changed field actually invalidates them. Preserve context on greetings,
   thanks and questions. Append relevant issue details without copying unrelated text.
5. Resolve provider/time references against offered server-owned candidates.
   Names or ordinal choices must match uniquely; otherwise ask which one.
6. Produce the next question/response from validated state and actual tool results.
   Retain deterministic fallback text. Measure whether a second generation call
   improves wording enough to justify extra CPU latency; do not assume it is free.
7. Keep explicit on-screen confirmation for mutations in this increment. A typed
   "haan" is not sufficient authorization by itself. Buttons remain a fallback
   even when text selections work.
8. Verify with mocked booking services before enabling the new path in real mode.

Example extraction proposal (internal model output, never a direct booking DTO):

```json
{
  "intent": "create",
  "language": "roman_urdu",
  "changes": {
    "category": "Plumbing",
    "issue": "Kitchen pipe leak",
    "dateExpression": "parson",
    "timeExpression": "subah 10 baje",
    "providerReference": "Tariq"
  },
  "clearFields": [],
  "needsClarification": false
}
```

Intent enum: greet, create, correct, status, cancel, reschedule, help, other.
Languages: roman_urdu, urdu, english, mixed, unknown.
Category is an allowlisted enum or null; strings have bounded lengths; unknown
properties are rejected. Missing information means no update. Explicit clearing
is separately represented and limited to editable booking fields.
No customerId, providerId, prices, availability or arbitrary tool names come from
the model. Exact dates/times and candidate IDs are resolved by server code.

## Workflow and tool boundary

State transitions for creation:
COLLECT_ISSUE -> COLLECT_DATE -> CHOOSE_PROVIDER -> CHOOSE_SLOT -> REVIEW
-> AWAIT_CONFIRMATION -> SUBMITTING -> PENDING_ACCEPTANCE or SCHEDULED.
Any stage can enter CLARIFY, UNAVAILABLE, EXPIRED or RECOVERY. Actual status is
returned by the booking service; a successful request is not always confirmed.
Unknown mutation outcomes enter RECOVERY; reconcile before allowing another write.
Simulation is labelled and never reported as a database booking.

Server-owned tool contracts:

| Tool | Input | Required checks/output |
| --- | --- | --- |
| getProfile | authenticated actor | Saved address/sector; never update silently |
| findProviders | validated category, saved sector | Verified matching candidates with stable IDs |
| getSlots | offered provider ID, resolved date | Exact available start/end pairs |
| getMyBooking | actor, optional booking-code reference | Ownership and unique resolution; no cross-customer lookup |
| createRequest | actor, validated draft, confirmation token, request key | Fresh profile/availability, revision, one mutation; persisted result |
| rescheduleRequest | actor, owned booking, validated replacement slot, confirmation | Allowed status, exact slot, atomic concurrency checks |
| cancelRequest | actor, owned booking, confirmation | Allowed status, audit trail and cancellation policy |

No generic model-driven HTTP or database tool. Model suggestions cannot choose
actor identity or invoke administrative/provider-only status changes.
Do not expose reschedule/cancel until ownership and scheduling gaps are fixed.

## Proposed files and API evolution

```text
backend/src/agent/
  agent.module.ts             existing authenticated routes
  agent.service.ts            orchestrator
  agent-prompt.ts             language/context instructions
  understanding.schema.ts    proposed schema and server validation
  ollama.client.ts            extraction/generation/timeouts
  booking-state.ts            pure transitions and invalidation rules
  choice-resolver.ts          offered-provider/slot text references
  agent-tools.service.ts     authenticated adapters to existing services
  session.repository.ts      later: durable owner-scoped state
backend/test/
  agent.integration-check.ts existing safeguards
  agent-understanding-check.ts
  fixtures/m3-evaluation.jsonl
ustadji-mobile/src/
  components/AgentChatProvider.tsx  existing shared state, later restore
  screens/HzAiBookingChatScreen.tsx existing UI and proposed confirmations
  services/api.ts                 existing authenticated client
```

Keep POST /agent/chat and existing action fields backward compatible. Add a
versioned typed response with stage, language, missingFields, structured summary,
offered choices and recoverable error codes. Keep sessionId/revision and actual
booking status. Do not expose extraction internals as product UI.

For durable restore, later add authenticated GET /agent/sessions and
GET /agent/sessions/:id, with owner-scoped access and bounded retention. Persist
messages, draft, revision, confirmed snapshot, request key and mutation result;
do not store passwords/JWTs with transcripts. Use conditional revision updates
and a unique durable request key. Resume must refresh availability and invalidate
an expired review. Schema changes need a migration; do not silently push schema.

## Evaluation before fine-tuning

First capture the existing keyword baseline, then run identical held-out scenarios
against structured extraction. Use fixed clock, fixtures and mocked mutations.
Seed 60 human-reviewed scenarios: 20 Roman Urdu, 15 Urdu script, 15 English,
10 code-switched. Include spelling variants, multi-turn corrections, missing
details, ambiguous dates/names, negation, unavailable slots, unsupported services,
prompt injection, other users' booking references and interrupted requests.
Split by scenario family rather than putting paraphrases on both sides of a split.
Record expected intent, accepted fields, next stage, clarification and mutation
count. Never include personal customer records in public evaluation artifacts.

Proposed release gates (targets, not measured results):
- At least 90% intent accuracy and 90% exact accepted-field accuracy overall;
  report results separately per language to avoid hiding Urdu failures.
- At least 90% end-to-end completion of unambiguous bookable fixture scenarios.
- All safety cases pass: zero unauthorized, unconfirmed, invented-provider,
  unavailable-slot or duplicate mutations in the test set.
- Ambiguous cases request clarification rather than silently choosing.
- Zero unsolicited greeting prefixes and verbatim echoes in the regression set.
- Record cold/warm p50/p95 latency, fallback rate and peak memory on this PC.
  Target warm p95 <= 30 seconds; failure triggers model/context optimization and
  an explicit UX decision, not a claim that the target was met.

Fine-tune only after error analysis identifies persistent, labelled weaknesses.
The reported earlier 300-conversation dataset was not found in the current
workspace audit; locate and review it before using it for training/evaluation.

## Following increments

2. Durable session restore and mutation idempotency/reconciliation.
3. Authenticated booking lookup, cancellation and rescheduling with separate
   review/confirmation flows and hardened scheduling/service checks.
4. Push-to-talk: record -> authenticated upload -> local ASR -> editable transcript
   -> the same text workflow. Then optional local spoken output with text fallback.
   Urdu-script transcription must be supported; Roman Urdu is a writing convention,
   not a separate spoken-language ASR target. Avoid forced transliteration unless
   evaluation shows it helps.
5. Benchmark ASR/TTS candidates on this PC, keeping only one heavy model loaded
   where possible. Whisper is a candidate from the notes, not a selected/tested
   deployment. Check speech quality, CPU latency, RAM, licenses and Urdu support.
   Phone microphone permission, upload bounds, temporary-audio cleanup and failures
   must be handled. No simultaneous streaming conversation in the first voice pass.

## Dataset work

The pasted Common Voice, CLE, Roman-Urdu-Parl and Smat26 links are leads for a
separate corpus audit. No download/license verification or preprocessing was
performed in this architecture audit. Record the exact dataset version, license,
access conditions and redistribution terms before use. Speech/transliteration/
generic text data cannot substitute for reviewed booking dialogues. Keep external
corpora separate from held-out UstadJi tasks; start with a small relevant sample.

## Official implementation references

- https://docs.ollama.com/capabilities/structured-outputs
- https://docs.ollama.com/capabilities/tool-calling

Ollama's API supports these mechanisms; reliability of this specific local 2B
quantized model remains an empirical question. Validate extraction first rather
than assuming arbitrary native tool calls will be dependable.
