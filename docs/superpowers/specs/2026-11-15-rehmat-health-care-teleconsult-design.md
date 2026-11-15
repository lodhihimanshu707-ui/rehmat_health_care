# Rehmat Health Care - Production Teleconsultation Architecture & Design Spec

- **Client:** Rehmat Health Care (Malviya Nagar, Moradabad)
- **Document Date:** 2026-11-15
- **Type:** Architectural Specification & Enterprise System Design
- **Architecture Pattern:** Decoupled Architecture with `server/` (Node.js + Servercn + Sequelize + Socket.io) & `client/` (React + shadcn/ui + TanStack Query + Zustand + Modular `features/`)
- **Status:** Approved for Implementation Planning

---

## 1. Executive Summary & Objective

Rehmat Health Care requires a production-grade, highly responsive teleconsultation web application tailored for their clinic in Malviya Nagar, Moradabad. The system enables patients to:
1. Access a high-grade, mobile-responsive portal built with **React**, **TypeScript**, **shadcn/ui**, and **Tailwind CSS**.
2. Manage a prepaid medical wallet with simulated Indian payment gateways (UPI, Cards, NetBanking) powered by **Zustand** and **TanStack Query**.
3. Browse verified Rehmat Health Care doctors with transparent per-minute consultation rates.
4. Conduct real-time **Video Consultations** with live per-minute billing, dynamic duration tickers, low-balance warnings, and automated balance-exhaustion safety cutoffs.
5. Communicate via real-time **In-App Messaging** for prescriptions and clinical inquiries.
6. Real-time WebRTC signaling and instant incoming call ringing powered by a dedicated **Node.js + Socket.io** backend.
7. Persist and manage data through **Sequelize ORM** (with SQLite zero-config local database, switchable to PostgreSQL) with robust **Zod** schema validations and **servercn** clean architecture patterns (`ApiError`, `ApiResponse`, `asyncHandler`, `validate` middleware).

---

## 2. Technology Stack & Design System

| Layer | Technology | Purpose |
|---|---|---|
| **Backend Runtime** | Node.js (TypeScript) + Express | Modular REST API and WebSocket gateway |
| **Backend Architecture** | **Servercn** Patterns (`ApiError`, `ApiResponse`, `asyncHandler`, `validate`) | Clean, unbundled, enterprise error and response formatting |
| **Real-time Engine** | **Socket.io** | Instant video call ringing, WebRTC signaling, live status, chat |
| **Database & ORM** | **Sequelize** + **SQLite / PostgreSQL** | Relational data persistence with strict foreign keys & transactions |
| **Data Validation** | **Zod** | Strict runtime validation schemas for payloads and requests |
| **Frontend Framework** | **React** + **Vite** + **TypeScript** | Lightning fast client, instant hot reload, and mobile-first responsive layout |
| **Frontend UI System** | **shadcn/ui** + Radix UI + Lucide Icons | Accessible, high-end healthcare UI design system |
| **Frontend Styling** | Tailwind CSS + `class-variance-authority` | Moradabad clinic branding (clean emerald/teal healthcare palette) |
| **Client Architecture** | **Feature-Driven Modular (`src/features/*`)** | High cohesion: `wallet/`, `consultation/`, `doctors/`, `chat/`, `auth/` |
| **Client State** | **Zustand** | Global call session, live timer ticker, wallet balance, active role |
| **Server State / Caching** | **TanStack Query (React Query v5)** | Declarative queries, mutations, cache invalidation, loading states |
| **Video & Media** | WebRTC API + Socket.io Signaling | P2P audio/video streaming, media controls, and status sync |

---

## 3. Architecture & Project Layout

```
c:\Users\Himanshu\OneDrive\Desktop\Project\Rehmat_Health_Care\
├── docs/
│   ├── superpowers/
│   │   ├── specs/
│   │   │   └── 2026-11-15-rehmat-health-care-teleconsult-design.md
│   │   └── plans/
│   │       └── 2026-11-15-rehmat-health-care-implementation-plan.md
│
├── server/                                 # Node.js + Express + Sequelize + Socket.io Backend
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts                 # Sequelize instance & SQLite/Postgres connection
│   │   │   └── env.ts                      # Zod-validated environment config
│   │   ├── models/                         # Sequelize relational models
│   │   │   ├── index.ts                    # Model associations
│   │   │   ├── User.ts
│   │   │   ├── Doctor.ts
│   │   │   ├── Wallet.ts
│   │   │   ├── Transaction.ts
│   │   │   ├── Consultation.ts
│   │   │   └── Message.ts
│   │   ├── core/                           # Servercn Architecture Primitives
│   │   │   ├── api-error.ts                # Standardized ApiError class
│   │   │   ├── api-response.ts             # Standardized ApiResponse wrapper
│   │   │   ├── async-handler.ts            # Catch-all async error wrapper
│   │   │   └── validate.middleware.ts      # Zod schema validation middleware
│   │   ├── modules/                        # Backend Feature Modules
│   │   │   ├── doctors/
│   │   │   │   ├── doctors.controller.ts
│   │   │   │   ├── doctors.service.ts
│   │   │   │   └── doctors.routes.ts
│   │   │   ├── wallet/
│   │   │   │   ├── wallet.controller.ts
│   │   │   │   ├── wallet.service.ts
│   │   │   │   ├── wallet.schema.ts
│   │   │   │   └── wallet.routes.ts
│   │   │   ├── consultations/
│   │   │   │   ├── consultations.controller.ts
│   │   │   │   ├── consultations.service.ts
│   │   │   │   ├── consultations.schema.ts
│   │   │   │   └── consultations.routes.ts
│   │   │   └── messages/
│   │   │       ├── messages.controller.ts
│   │   │       ├── messages.service.ts
│   │   │       └── messages.routes.ts
│   │   ├── socket/                         # Socket.io Real-Time Handlers
│   │   │   ├── index.ts                    # Socket server initialization
│   │   │   ├── call.socket.ts              # WebRTC signaling, ringing, accept/reject
│   │   │   └── chat.socket.ts              # Real-time text messaging
│   │   ├── seed/
│   │   │   └── seed-data.ts                # Initial clinic doctors and patient records
│   │   ├── app.ts                          # Express app configuration & middlewares
│   │   └── server.ts                       # HTTP + Socket.io bootstrap entry point
│
└── client/                                 # React + Vite + TypeScript + Tailwind + shadcn/ui Frontend
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── index.html
    ├── src/
    │   ├── components/                     # Shared UI Components & Layout
    │   │   ├── ui/                         # shadcn/ui components (button, dialog, card, badge, etc.)
    │   │   ├── layout/
    │   │   │   ├── navbar.tsx              # Clinic header & role switcher
    │   │   │   └── footer.tsx              # Rehmat Health Care details (Malviya Nagar)
    │   ├── features/                       # Modular Feature-Driven Structure
    │   │   ├── auth/                       # Demo Profile & Role Switcher
    │   │   │   ├── components/role-switcher.tsx
    │   │   │   ├── store/use-auth-store.ts
    │   │   │   └── types/auth.types.ts
    │   │   ├── wallet/                     # Wallet & Recharge Module
    │   │   │   ├── components/
    │   │   │   │   ├── balance-card.tsx
    │   │   │   │   ├── recharge-modal.tsx
    │   │   │   │   └── transaction-list.tsx
    │   │   │   ├── hooks/use-wallet.ts     # TanStack query & mutations
    │   │   │   └── types/wallet.types.ts
    │   │   ├── doctors/                    # Doctor Directory Module
    │   │   │   ├── components/
    │   │   │   │   ├── doctor-card.tsx
    │   │   │   │   └── doctor-filter.tsx
    │   │   │   ├── hooks/use-doctors.ts    # TanStack query
    │   │   │   └── types/doctor.types.ts
    │   │   ├── consultation/               # Video Call & Live Billing Module
    │   │   │   ├── components/
    │   │   │   │   ├── video-room.tsx      # Video canvas & local/remote stream
    │   │   │   │   ├── call-controls.tsx   # Camera, Mic, End Call controls
    │   │   │   │   ├── billing-hud.tsx     # Live timer, rate ticker, remaining credit
    │   │   │   │   ├── low-balance-alert.tsx
    │   │   │   │   └── incoming-call-modal.tsx # Ringing alert for Doctor
    │   │   │   ├── hooks/
    │   │   │   │   ├── use-webrtc.ts       # WebRTC peer connection & media stream
    │   │   │   │   └── use-call-timer.ts   # Live duration & balance deduction ticker
    │   │   │   ├── store/use-call-store.ts # Zustand call state
    │   │   │   └── types/consultation.types.ts
    │   │   └── chat/                       # Live Messaging Module
    │   │       ├── components/
    │   │       │   ├── chat-container.tsx
    │   │       │   ├── message-bubble.tsx
    │   │       │   └── message-input.tsx
    │   │       ├── hooks/use-chat.ts
    │   │       └── types/chat.types.ts
    │   ├── lib/
    │   │   ├── api-client.ts               # Axios / Fetch client with baseUrl
    │   │   ├── socket.ts                   # Client Socket.io connection instance
    │   │   └── utils.ts                    # shadcn `cn()` helper
    │   ├── providers/
    │   │   ├── query-provider.tsx          # TanStack QueryClientProvider
    │   │   └── toast-provider.tsx          # Toast notification provider
    │   ├── App.tsx                         # Main Clinic App Shell
    │   ├── main.tsx                        # Application mount
    │   └── index.css                       # Tailwind CSS & theme tokens
```

---

## 4. Sequelize Relational Models & Zod Schemas

### 4.1 Database Models
1. **User**: `id` (UUID), `name`, `phone`, `role` ('patient' | 'doctor'), `avatarUrl`.
2. **Doctor**: `id` (UUID), `userId` (FK), `specialization`, `qualifications`, `experienceYears`, `clinicName`, `ratePerMinute`, `isOnline`, `isBusy`, `rating`.
3. **Wallet**: `id` (UUID), `userId` (FK), `balance` (DECIMAL), `currency` ('INR').
4. **Transaction**: `id` (UUID), `walletId` (FK), `type` ('credit' | 'debit'), `amount`, `paymentMethod`, `referenceId`, `status`, `description`.
5. **Consultation**: `id` (UUID), `patientId` (FK), `doctorId` (FK), `type` ('video' | 'audio'), `status`, `ratePerMinute`, `startedAt`, `endedAt`, `durationSeconds`, `billedMinutes`, `totalCost`.
6. **Message**: `id` (UUID), `senderId` (FK), `receiverId` (FK), `text`, `isRead`.

---

## 5. Per-Minute Billing Engine & Real-Time Auto Cutoff Logic

### Billing Rules:
- Minimum initial balance requirement: `wallet.balance >= doctor.ratePerMinute`.
- Live metering ticker:
  $$\text{Billed Minutes} = \max\left(1, \left\lceil \frac{\text{Duration in Seconds}}{60} \right\rceil\right)$$
  $$\text{Total Deducted} = \text{Billed Minutes} \times \text{Rate Per Minute}$$
- When remaining balance $< 60$ seconds, trigger audio/visual low-balance warning banner.
- When balance hits ₹0.00, server & client immediately end call with status `ended_zero_balance` and display consultation receipt.
