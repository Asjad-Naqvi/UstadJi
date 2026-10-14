# 🚀 UstadJi — CI/CD Pipeline

> **Project**: UstadJi (FYP) — On-demand Home Services Platform  
> **Stack**: NestJS Backend · Expo React Native Mobile · Prisma/SQLite · Redis (optional)  
> **Repository**: `d:\FYP` (Git mono-repo)

---

## 📐 Pipeline Overview

```mermaid
flowchart TD
    DEV["👨‍💻 Developer\nLocal Machine"]:::devNode

    subgraph LOCAL["🖥️ Local Development"]
        direction TB
        L1["Code Changes\nVSCode / Antigravity IDE"]
        L2["ts-node-dev\nHot Reload Backend"]
        L3["npx expo start\nExpo Go / Browser"]
        L4["Prisma Studio\nDB Inspection"]
        L1 --> L2
        L1 --> L3
        L1 --> L4
    end

    subgraph GIT["🔀 Source Control - Git"]
        direction TB
        G1["git add / commit"]
        G2["git push to GitHub"]
        G3{"Branch?"}
        G4["feature/* branch"]
        G5["main branch"]
        G1 --> G2 --> G3
        G3 -->|"feature"| G4
        G3 -->|"merge PR"| G5
    end

    subgraph CI["⚙️ CI — GitHub Actions"]
        direction TB
        subgraph BACKEND_CI["Backend Pipeline"]
            B1["📥 Checkout Code"]
            B2["🟢 Setup Node 20"]
            B3["📦 npm ci"]
            B4["🔍 TypeScript Check\nnpx tsc --noEmit"]
            B5["🗄️ Prisma Generate"]
            B6["🧪 Run Tests - Jest"]
            B7["🏗️ Build - nest build"]
            B1-->B2-->B3-->B4-->B5-->B6-->B7
        end
        subgraph MOBILE_CI["Mobile Pipeline"]
            M1["📥 Checkout Code"]
            M2["🟢 Setup Node 20"]
            M3["📦 npm ci"]
            M4["🔍 TypeScript Check"]
            M5["🧹 Expo Doctor"]
            M1-->M2-->M3-->M4-->M5
        end
    end

    subgraph CD_STAGING["🧪 Staging / Preview"]
        direction TB
        S1["EAS Build\nExpo Preview Channel"]
        S2["Backend Deploy\nRender / Railway Staging"]
        S3["Prisma Migrate\nnpx prisma migrate deploy"]
        S4["Smoke Tests\n/health endpoint check"]
        S2-->S3-->S4
        S1-->S4
    end

    subgraph CD_PROD["🚀 Production Deployment"]
        direction TB
        P1["EAS Submit\nGoogle Play / App Store"]
        P2["Backend Deploy\nRender / Railway Prod"]
        P3["Prisma Migrate\nProduction DB"]
        P4["✅ Live"]
        P2-->P3-->P4
        P1-->P4
    end

    DEV --> LOCAL
    LOCAL --> GIT
    GIT --> CI
    CI -->|"✅ All checks pass"| CD_STAGING
    CD_STAGING -->|"✅ Staging approved"| CD_PROD
    CI -->|"❌ Fail - notify dev"| DEV

    classDef devNode fill:#6366f1,color:#fff,stroke:#4f46e5
```

---

## 🗂️ Stage-by-Stage Breakdown

### Stage 1 — Local Development

| Step | Tool | Purpose |
|------|------|---------|
| Code editing | VSCode / Antigravity IDE | TypeScript source editing |
| Backend hot-reload | `ts-node-dev --respawn` | Instant restart on file change |
| Mobile dev server | `npx expo start` | Live reload via Expo Go / Web |
| DB inspection | `npx prisma studio` | Browse & edit SQLite records |
| DB schema changes | `npx prisma db push` | Apply schema without migrations |

---

### Stage 2 — Source Control (Git)

```
main
  └── feature/booking-lifecycle
  └── feature/consumer-orders-ui
  └── feature/provider-pending-requests
  └── fix/slot-lock-try-catch
```

- All features developed on **feature branches**
- PRs merged to `main` only after local testing
- `.gitignore` excludes: `node_modules/`, `prisma/dev.db`, `.env`, `dist/`

---

### Stage 3 — CI (GitHub Actions)

#### `backend-ci.yml`

```yaml
name: Backend CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: cd backend && npm ci
      - run: cd backend && npx tsc --noEmit          # Type check
      - run: cd backend && npx prisma generate        # Generate Prisma client
      - run: cd backend && npm test                   # Jest unit tests
      - run: cd backend && npm run build              # Compile to dist/
```

#### `mobile-ci.yml`

```yaml
name: Mobile CI
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: cd ustadji-mobile && npm ci
      - run: cd ustadji-mobile && npx tsc --noEmit    # Type check
      - run: cd ustadji-mobile && npx expo-doctor      # Expo config validation
```

---

### Stage 4 — Staging Deployment

| Component | Platform | Command |
|-----------|----------|---------|
| NestJS Backend | **Render** / Railway | Auto-deploy from `main` |
| Database migration | Prisma | `npx prisma migrate deploy` |
| Mobile preview build | **EAS Build** (Expo) | `eas build --profile preview` |
| Health check | REST | `GET /health → 200 OK` |

> **Environment Variables (Staging)**:
> ```env
> DATABASE_URL=file:./staging.db
> JWT_SECRET=<staging-secret>
> REDIS_URL=redis://staging-redis:6379
> NODE_ENV=staging
> ```

---

### Stage 5 — Production Deployment

| Component | Platform | Notes |
|-----------|----------|-------|
| NestJS Backend | **Render** (Prod tier) | `node dist/main` |
| Database | **PostgreSQL** (Render DB) | Migrate from SQLite for prod |
| Mobile App | **EAS Submit** | Google Play / TestFlight |
| Slot Locking | **Redis** (Upstash) | Production Redis instance |
| Secrets | **Render Env Vars** / GitHub Secrets | Never committed to git |

---

## 🔒 Secrets Management

```
GitHub Secrets
├── EXPO_TOKEN              → EAS CLI authentication
├── RENDER_API_KEY          → Backend auto-deploy trigger
├── JWT_SECRET              → Auth token signing
├── DATABASE_URL            → Production DB connection string
└── REDIS_URL               → Upstash Redis URL
```

---

## 🏗️ Project Module Map

```mermaid
graph LR
    subgraph MOBILE["📱 ustadji-mobile"]
        MA["App.tsx\nNavigation"]
        MS["src/screens\n11 screens"]
        MC["src/components"]
        MAPI["src/services/api.ts\nHTTP Client"]
        MA --> MS
        MA --> MC
        MS --> MAPI
    end

    subgraph BACKEND["🖥️ backend/src"]
        AUTH["auth\nJWT, Bcrypt"]
        BOOK["bookings\nCRUD + Lifecycle"]
        PROV["providers\nProfile, Availability"]
        QUEUE["queue\n30-min Timers"]
        REDIS_M["redis\nSlotLockService"]
        PRISMA_M["prisma\nORM"]
        BOOK --> QUEUE
        BOOK --> REDIS_M
        BOOK --> PRISMA_M
        AUTH --> PRISMA_M
        PROV --> PRISMA_M
    end

    subgraph DB["🗄️ Data Layer"]
        SQLITE["SQLite\ndev.db"]
        SCHEMA["schema.prisma\n5 models"]
        SCHEMA --> SQLITE
    end

    MAPI -->|"HTTP :4000"| AUTH
    MAPI -->|"HTTP :4000"| BOOK
    MAPI -->|"HTTP :4000"| PROV
    BACKEND --> DB
```

---

## 📊 Key Metrics

| Metric | Value |
|--------|-------|
| Backend port | `4000` |
| Mobile bundler | Expo Metro |
| DB ORM | Prisma v6 |
| Auth method | JWT (Bearer) |
| Slot lock TTL | 5 minutes |
| Booking response window | 30 minutes |
| Node version | 20 LTS |
| TypeScript | v5.7 (Backend) · v6.0 (Mobile) |

---

## 🛠️ Running Locally (Quick Reference)

```powershell
# Terminal 1 — Backend
cd d:\FYP\backend
npm start                          # ts-node src/main.ts → :4000

# Terminal 2 — Mobile
cd d:\FYP\ustadji-mobile
npx expo start                     # Metro bundler → scan QR with Expo Go

# Optional — DB GUI
cd d:\FYP\backend
npx prisma studio                  # Opens at http://localhost:5555
```
