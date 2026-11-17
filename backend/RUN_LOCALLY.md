# Run UstadJi yourself on Windows

Use PowerShell. Project location: D:\FYP. Keep the PC awake while testing.

## What currently works offline

Ollama inference runs on the PC. Expo and NestJS can run over local Wi-Fi without
internet once their dependencies and Expo Go are installed. However, the current
DATABASE_URL is non-local: ordinary login, providers, bookings and My Bookings
require access to that database. Expo's --offline flag does not change this.
Full offline booking requires local PostgreSQL with customer/provider data.

## One-time preparation while online

- Install Node.js/npm, Ollama, and compatible Expo Go on the Android phone.
- The existing node_modules folders and Qwen model are already installed here.
  On another machine, run npm ci in backend and ustadji-mobile while online.
- Run `ollama list`; ensure `qwen3.5:2b-q4_K_M` is listed. If missing, download
  it once with `ollama pull qwen3.5:2b-q4_K_M`.
- For completely offline use, install/configure PostgreSQL and populate a local
  database before disconnecting. Prisma's engine/client must already be generated.
- Open the app successfully once with the compatible Expo Go version installed.

## 1. Start Ollama

Open Ollama from the Windows Start menu. Alternatively, in a separate terminal:

```powershell
ollama serve
```

If port 11434 is already in use, Ollama may already be running; do not launch a
second copy. Verify:

```powershell
Invoke-RestMethod http://127.0.0.1:11434/api/tags
```

You do not need an interactive `ollama run` session. The backend loads the model
on its first request and supplies the UstadJi instructions and memory settings.
Opening a plain model chat does not use the project's booking agent.

## 2. Configure the backend

Edit D:\FYP\backend\.env. Keep existing database/auth settings and add/update:

```dotenv
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen3.5:2b-q4_K_M
AGENT_ALLOW_BOOKINGS=true
AGENT_SIMULATE_BOOKINGS=false
```

These settings allow actual bookings. For simulation instead, use:

```dotenv
AGENT_ALLOW_BOOKINGS=false
AGENT_SIMULATE_BOOKINGS=true
```

Simulation still needs profile/provider/availability data from the database;
it only skips booking creation. Restart the backend after changing environment.

## 3. Start the backend (PowerShell terminal 1)

```powershell
Set-Location D:\FYP\backend
npm run start:dev
```

Keep this terminal open. Wait for "Nest application successfully started" and
port 4000. If PostgreSQL cannot connect, check DATABASE_URL and database reachability.
An in-memory slot-lock fallback warning is expected when Redis is unavailable.

## 4. Get the current PC Wi-Fi IP

```powershell
ipconfig
```

Use the IPv4 address under Wi-Fi, not WSL/Ethernet or 127.0.0.1. For example,
192.168.1.18 was used during testing; it can change after a network change/reboot.
Connect the phone and PC to the same Wi-Fi. A router can provide local networking
even without internet. Guest/client-isolated Wi-Fi may block device access.

## 5. Start Expo (PowerShell terminal 2)

Replace the example IP below with the current PC Wi-Fi IP from step 4:

```powershell
Set-Location D:\FYP\ustadji-mobile
$env:EXPO_PUBLIC_API_BASE_URL='http://192.168.1.18:4000'
$env:REACT_NATIVE_PACKAGER_HOSTNAME='192.168.1.18'
npm start -- --lan --offline --port 8081
```

Expo's --offline disables its internet requests; --lan keeps the local phone
connection. Do not use --tunnel for offline operation. The two environment values
above must point to the same PC address. Do not use localhost for the phone API.
Keep this terminal open and scan its current QR code in Expo Go. Alternatively,
enter `exp://192.168.1.18:8081` manually using the same current IP.

## 6. Test the app

Log in against the backend with a customer account that exists in the selected
database and has a saved address and sector. Offline/demo UI login without a real
backend token cannot use the agent. Open Chat / AI Assistant -> UstadJi AI Agent.

Send separately:

1. Kitchen ka pipe leak hai.
2. Tariq ko parson subah 10 baje bula dein.
3. 10 ke bajaye 11 baje.

The named provider and slot must actually exist/be available; otherwise use cards
or another time. Review the summary and tap Confirm request for a real database
write. The result may be Pending Acceptance rather than Scheduled. Verify it in
My Bookings. For simulation, expect SIM-... and no My Bookings record.

Use New chat after restarting the backend. Navigation preserves chat, but full
app reloads clear local chat and backend sessions are not durable across restarts.

## Make the database fully offline (one-time, separate local database)

The hosted database is not automatically copied to the PC. Existing hosted
bookings, including earlier test bookings, will not appear in a fresh local DB.

1. With PostgreSQL installed, create an EMPTY database `ustadji_local` in pgAdmin
   and a local login allowed to use it. Keep a backup of the current .env.
2. Point DATABASE_URL in backend/.env to that new local database, for example:

   ```dotenv
   DATABASE_URL="postgresql://YOUR_USER:YOUR_URL_ENCODED_PASSWORD@127.0.0.1:5432/ustadji_local?schema=public"
   ```

   Use actual local credentials; the line above is a placeholder. Preserve the
   existing JWT_SECRET. Verify the URL points to 127.0.0.1 and ustadji_local.
3. In backend, apply the existing migrations and generate the client:

   ```powershell
   npm run prisma:deploy
   npm run prisma:generate
   ```

   Do this during preparation; engine downloads may need internet if not cached.
4. For disposable demo data on this NEW EMPTY LOCAL database only:

   ```powershell
   npm run prisma:seed
   ```

   **The seed script deletes existing records first. Never run it against the
   hosted database or a database whose records you want to preserve.**
   Seeded customer: zain@ustadji.pk / password123. Change passwords before any
   use beyond a private development demo. No seed/import/export runs are part of
   daily startup. The old export/import scripts target the earlier SQLite workflow
   and are not a migration path for the current hosted PostgreSQL data.
5. Keep the PostgreSQL Windows service running, then follow steps 1-6 above.
   Local booking data is now independent from the hosted database. External avatar
   images and remote push delivery may not work without internet; booking records
   and local inference do not depend on those assets.

Local PostgreSQL setup is described here; it has not been installed or migrated
as part of writing this guide.

## Troubleshooting and stopping

- On the phone, open `http://YOUR_PC_IP:8081/status`: expect
  `packager-status:running`. If unreachable, check same Wi-Fi, current IP, VPN,
  guest isolation and Node firewall access. Keep the firewall enabled.
- App opens but login fails: check backend terminal, port 4000 and database.
- Model fails: check Ollama, installed tag and available RAM; close unused apps.
- Address/sector error: use a backend customer profile with both saved.
- Port already in use: an earlier server may still be running; stop that server
  in its own terminal before starting another. This guide does not require Codex
  to stay open once you start your own servers.
- Stop Expo/backend with Ctrl+C in their terminals. Optionally unload the model:
  `ollama stop qwen3.5:2b-q4_K_M`.

## Optional database-free checks

```powershell
Set-Location D:\FYP\backend
npm run test:agent:understanding
npm run test:agent
npm run test:agent:understanding:live
```

The first two use mocked model/booking data; the last needs local Ollama. These
are verification scripts, not the phone's normal backend. They do not create
real bookings.

References: https://docs.expo.dev/more/expo-cli/#offline and
https://docs.ollama.com/cli
