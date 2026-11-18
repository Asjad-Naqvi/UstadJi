# Local Ollama booking chat (experimental)

Mobile AI Booking Agent now calls authenticated POST /agent/chat. NestJS calls
Ollama on the backend PC; the phone never calls Ollama directly.

Backend environment (add to your existing local configuration, don't replace it):

```dotenv
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen3.5:2b-q4_K_M
AGENT_ALLOW_BOOKINGS=false
AGENT_SIMULATE_BOOKINGS=true
```

Run Ollama, then `npm run start:dev` in backend and `npm start` in ustadji-mobile.
Login successfully against the backend; simulated/offline logins cannot access
the agent. The customer profile must have a saved address and sector. Chat uses
that address, rather than silently changing the customer's profile from chat.
For a phone, both devices must reach the backend on the same LAN. Override
EXPO_PUBLIC_API_BASE_URL=http://YOUR_PC_LAN_IP:4000 in mobile's local environment
if Metro host detection doesn't match. Do not set it to the phone's localhost.

Backend defaults to preview-only agent booking actions. Set
AGENT_ALLOW_BOOKINGS=true only for your intended test/development database when
ready to test actual creation. Existing non-agent booking endpoints retain their
own behavior; this flag controls the agent route only.

For a complete test without database writes, set AGENT_SIMULATE_BOOKINGS=true.
This enables Confirm test booking after normal provider/slot/summary validation.
It returns a SIM- code and SIMULATED status, never calls booking creation or
notifies a provider. It does not reserve a slot or appear in My Bookings; it lives
only in the current chat session. Simulation takes precedence over real writes.
Disable it explicitly before testing real submission. The mobile screen labels
this mode. Greetings are allowed only when the current user message greets the
agent; unsolicited model greeting prefixes are removed server-side.

## Interaction

The home AI Assistant and bottom Chat tab both open the authenticated local-model
booking agent. The former demo chat (fixed F-7 echo replies) is no longer routed.
Conversation state lives above screen navigation, so messages, draft input,
provider/slot choices and in-flight replies survive leaving and reopening chat.
New chat explicitly starts another conversation; sign-out/account change clears
the local chat. This state is in memory: a full app reload/restart clears it, and
backend sessions still expire after 30 minutes or a backend restart.
The model's role, Roman Urdu style examples, conversation rules and trusted next
step are in src/agent/agent-prompt.ts. Context guides wording; it does not replace
fine-tuning or the backend's booking safeguards. Verbatim message echoes are
rejected and replaced with the backend's next-step reply.

Describe the issue in Roman Urdu. The model now proposes a schema-constrained
intent, category, issue detail and date/time/provider reference. Evidence must
come from the current message; model-generated IDs or unknown fields are rejected.
Server parsers resolve ISO dates, kal/parson/aaj and common weekdays in Asia/Karachi.
Times support subah/shaam, AM/PM, HH:mm and common number words. Ambiguous times
such as "10 baje" require clarification; unsupported phrasing falls back to asking.

Try "Kitchen ka pipe leak hai", then "Tariq ko parson subah 10 baje bula dein".
Names must uniquely match an actual verified provider covering your saved sector;
times must match a real available slot. Names/slots can also be chosen using cards.
The summary includes the saved address. Review it, then use Confirm request.
Text such as "confirm kar do" never submits the request by itself.

Corrections like "10 ke bajaye 11 baje" preserve the date and provider, while
"kal nahi parson" refreshes availability and requires review of the updated summary.
Greetings/thanks preserve valid selections; changed service invalidates its old
provider; issue follow-ups update the draft. Ambiguous or unusable extraction
blocks confirmation until clarified. This is draft correction only, not editing
a booking that has already been submitted. The server checks owner, revision, current
profile/address, provider category/coverage/verification, and current availability
before submission. Customer identity is injected from JWT, never a model field.
An uncertain submission outcome blocks retries in that session; check bookings
before starting another request. Completed sessions replay their result rather
than creating again. Sessions expire after 30 minutes and live in process memory.
This is a single-backend experimental implementation, not durable distributed
idempotency across restarts/workers. No schema migration is required: a service
address snapshot is appended to the booking's issueDescription.

Ollama uses a small batch and a 90-second timeout. On unavailability, the app
shows a notice and keeps backend-generated controls. Language quality is still
limited; generated wording is not verified business evidence. Provider cards,
slots, summary, and returned booking status are authoritative. Voice simulation
was removed from this screen because there is no speech-to-text integration yet.

## Checks (no real database)

```powershell
npm run test:agent
npm run test:agent:live
npm run test:agent:understanding
npm run test:agent:understanding:live
```

The first starts an ephemeral loopback fixture NestJS server and stubs Ollama.
The second additionally makes real local model calls. All DB/provider/booking
services remain test doubles in both commands; JWT authentication is real.
The understanding checks cover grounded fields, name/time ambiguity, corrections,
unavailable slots, extraction failures, stale confirmation and unknown outcomes.
The understanding live check exercises a multi-turn conversation with actual local
Qwen and synthetic service data; it never calls booking creation. Transactional
turns use a single extraction inference, then backend-controlled next-step text;
casual turns can additionally use natural reply generation. This is a smoke test,
not a measured multilingual accuracy benchmark.

For UI tests, `npm run agent:fixture` starts that fixture server on 127.0.0.1:4001.
Run mobile with EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:4001 and Expo web.
The existing Zain demo login maps to an Integration Test Customer in this server.
All fixture bookings are in-memory and synthetic. Do not expose the fixture
server externally. Stop it before ordinary testing against your real backend.

## Verification in this change

- Backend/mobile TypeScript checks passed.
- Structured understanding regression and authenticated HTTP correction checks passed.
- Real Qwen: four-turn issue/provider/time/date correction flow passed; warm turns
  were approximately 8-10 seconds in this run. Two differently worded plumbing and
  electrical extraction examples passed in approximately 8-12 seconds. Cold load
  and CPU/RAM contention can be slower; this is not a broad accuracy benchmark.
- Authenticated fixture HTTP booking flow and live Ollama call passed.
- Mobile web: login, actual model reply, provider/slot selection, date correction,
  summary review, and fixture-only confirmation exercised in the browser.
- Full mobile lint currently reports pre-existing errors in unrelated screens;
  the modified chat/API files lint clean. Expo-compatible ESLint setup was added.
- Physical Android/iOS and production database submission have not been tested.
