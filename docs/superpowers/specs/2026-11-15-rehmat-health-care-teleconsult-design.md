# Rehmat Health Care - Production Teleconsultation Architecture & Design Spec

- **Client:** Rehmat Health Care (Malviya Nagar, Moradabad)
- **Document Date:** 2026-11-15
- **Type:** Architectural Specification & Enterprise System Design
- **Status:** Approved for Implementation Planning

---

## 1. Executive Summary & Objective

Rehmat Health Care requires a production-ready, highly responsive teleconsultation web application tailored for their clinic. The system enables patients to:
1. Access a high-grade, mobile-responsive portal built with **Next.js (App Router)**, **TypeScript**, **shadcn/ui**, and **Tailwind CSS**.
2. Manage a prepaid medical wallet with simulated Indian payment gateways (UPI, Cards, NetBanking) powered by **Zustand** and **TanStack Query**.
3. Browse verified Rehmat Health Care doctors with transparent per-minute consultation rates.
4. Conduct real-time **Video Consultations** with live per-minute billing, dynamic duration tickers, low-balance warnings, and automated balance-exhaustion safety cutoffs.
5. Communicate via real-time **In-App Messaging** for prescriptions and clinical inquiries.
6. Persist and manage data through **Sequelize ORM** (with SQLite zero-config local database, switchable to PostgreSQL) with robust **Zod** schema validations and enterprise-grade repository/service layers.

---

## 2. Technology Stack & Design System

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 15+ (App Router) | Server components, API Route Handlers, SSR/CSR balance |
| **Language** | TypeScript (strict mode) | Type safety across client, server, and database models |
| **UI Components** | **shadcn/ui** + Radix UI + Lucide Icons | Accessible, modern healthcare component design system |
| **Styling** | Tailwind CSS + `class-variance-authority` | Mobile-first responsive layout (Moradabad clinic branding) |
| **Client State** | **Zustand** | Global call session, live timer ticker, wallet balance, active role |
| **Server State / Caching** | **TanStack Query (React Query v5)** | Declarative queries, mutations, cache invalidation, loading states |
| **Data Validation** | **Zod** | Runtime contract validation for API payloads, forms, and entities |
| **ORM & Database** | **Sequelize** + **SQLite / PostgreSQL** | Relational data persistence with strict foreign keys & transactions |
| **Video & Media** | WebRTC API + BroadcastChannel / Socket | P2P audio/video streaming, media controls, and signaling |

---

## 3. Best-in-Class Clean Architecture & Folder Structure

```
c:\Users\Himanshu\OneDrive\Desktop\Project\Rehmat_Health_Care\
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-11-15-rehmat-health-care-teleconsult-design.md
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── doctors/route.ts
│   │   │   ├── wallet/
│   │   │   │   ├── balance/route.ts
│   │   │   │   ├── recharge/route.ts
│   │   │   │   └── transactions/route.ts
│   │   │   ├── consultations/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── tick/route.ts
│   │   │   │       └── end/route.ts
│   │   │   ├── messages/route.ts
│   │   │   └── seed/route.ts
│   │   ├── consultation/
│   │   │   └── [id]/page.tsx       # Live Video Consultation Room
│   │   ├── doctors/
│   │   │   └── page.tsx            # Doctors Directory
│   │   ├── chat/
│   │   │   └── page.tsx            # In-App Messaging
│   │   ├── wallet/
│   │   │   └── page.tsx            # Wallet & Transaction Ledger
│   │   ├── layout.tsx              # Root Layout with Providers
│   │   ├── page.tsx                # Clinic Landing & Dashboard
│   │   └── globals.css             # Tailwind & shadcn theme tokens
│   │
│   ├── components/
│   │   ├── ui/                     # shadcn/ui base primitives
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── input.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── avatar.tsx
│   │   │   └── progress.tsx
│   │   ├── layout/
│   │   │   ├── navbar.tsx          # Clinic Navigation & Role Switcher
│   │   │   ├── footer.tsx          # Rehmat Health Care details (Malviya Nagar)
│   │   │   └── role-switcher.tsx   # Fast Patient <-> Doctor testing toggle
│   │   ├── wallet/
│   │   │   ├── balance-card.tsx
│   │   │   ├── recharge-modal.tsx  # Preset packs (₹100, ₹250, ₹500) + UPI
│   │   │   └── transaction-list.tsx
│   │   ├── consultation/
│   │   │   ├── video-room.tsx      # Video canvas & local/remote stream
│   │   │   ├── call-controls.tsx   # Mute, Camera toggle, End Call
│   │   │   ├── billing-hud.tsx     # Live timer, rate ticker, remaining credit
│   │   │   ├── low-balance-alert.tsx
│   │   │   └── incoming-call-modal.tsx
│   │   ├── doctors/
│   │   │   ├── doctor-card.tsx
│   │   │   └── doctor-filter.tsx
│   │   └── chat/
│   │       ├── message-bubble.tsx
│   │       ├── message-input.tsx
│   │       └── chat-container.tsx
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   ├── connection.ts       # Sequelize database instance & pool
│   │   │   ├── models/
│   │   │   │   ├── index.ts        # Model associations setup
│   │   │   │   ├── User.ts
│   │   │   │   ├── Doctor.ts
│   │   │   │   ├── Wallet.ts
│   │   │   │   ├── Transaction.ts
│   │   │   │   ├── Consultation.ts
│   │   │   │   └── Message.ts
│   │   │   └── seed-data.ts        # Rehmat Health Care initial seed records
│   │   ├── validations/            # Zod validation schemas
│   │   │   ├── user.schema.ts
│   │   │   ├── wallet.schema.ts
│   │   │   ├── consultation.schema.ts
│   │   │   └── message.schema.ts
│   │   ├── services/               # Core business logic layer
│   │   │   ├── wallet.service.ts   # Atomic recharge & debit operations
│   │   │   ├── billing.service.ts  # Per-minute rate computation & auto-cutoff
│   │   │   └── consultation.service.ts
│   │   ├── store/                  # Zustand stores
│   │   │   ├── use-user-store.ts   # Active role (Patient vs Doctor)
│   │   │   ├── use-wallet-store.ts # Balance & quick recharge trigger
│   │   │   └── use-call-store.ts   # Live call status, duration, timers
│   │   ├── hooks/                  # TanStack Query custom hooks
│   │   │   ├── use-doctors-query.ts
│   │   │   ├── use-wallet-query.ts
│   │   │   ├── use-consultations-query.ts
│   │   │   └── use-messages-query.ts
│   │   ├── webrtc/
│   │   │   ├── media-manager.ts    # Camera & mic stream handler
│   │   │   └── signaling.ts        # Multi-tab BroadcastChannel & WebRTC sync
│   │   └── utils.ts                # shadcn `cn()` helper
│   │
│   └── providers/
│       ├── query-provider.tsx      # TanStack QueryClientProvider
│       └── toast-provider.tsx
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## 4. Sequelize Relational Models & Zod Schemas

### 4.1 `User` Model
```typescript
interface UserAttributes {
  id: string; // UUID v4
  name: string;
  phone: string;
  email?: string;
  role: 'patient' | 'doctor' | 'admin';
  avatarUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### 4.2 `Doctor` Model
```typescript
interface DoctorAttributes {
  id: string;
  userId: string; // FK -> User.id
  specialization: string; // e.g. "General Physician", "Cardiologist"
  qualifications: string; // e.g. "MBBS, MD"
  experienceYears: number; // e.g. 12
  clinicName: string; // "Rehmat Health Care"
  ratePerMinute: number; // e.g. 15.00 INR
  isOnline: boolean;
  isBusy: boolean;
  rating: number; // e.g. 4.9
}
```

### 4.3 `Wallet` Model
```typescript
interface WalletAttributes {
  id: string;
  userId: string; // FK -> User.id
  balance: number; // Current balance (e.g. 250.00 INR)
  currency: string; // "INR"
  updatedAt?: Date;
}
```

### 4.4 `Transaction` Model
```typescript
interface TransactionAttributes {
  id: string; // UUID v4
  walletId: string; // FK -> Wallet.id
  type: 'credit' | 'debit';
  amount: number;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Wallet';
  referenceId?: string; // Links to Consultation.id for debits
  status: 'success' | 'pending' | 'failed';
  description: string;
  createdAt?: Date;
}
```

### 4.5 `Consultation` (Call Session) Model
```typescript
interface ConsultationAttributes {
  id: string;
  patientId: string; // FK -> User.id
  doctorId: string; // FK -> Doctor.id
  type: 'video' | 'audio';
  status: 'ringing' | 'connected' | 'completed' | 'ended_zero_balance' | 'rejected';
  ratePerMinute: number; // Snapshot of rate at initiation
  startedAt?: Date;
  endedAt?: Date;
  durationSeconds: number;
  billedMinutes: number; // Math.ceil(durationSeconds / 60)
  totalCost: number;
}
```

### 4.6 `Message` Model
```typescript
interface MessageAttributes {
  id: string;
  senderId: string; // FK -> User.id
  receiverId: string; // FK -> User.id
  consultationId?: string;
  text: string;
  isRead: boolean;
  createdAt?: Date;
}
```

---

## 5. Per-Minute Billing Engine & Real-Time Auto Cutoff Logic

### Billing Formula:
$$\text{Billed Minutes} = \max\left(1, \left\lceil \frac{\text{Duration in Seconds}}{60} \right\rceil\right)$$
$$\text{Live Deducted Amount} = \text{Billed Minutes} \times \text{Rate Per Minute}$$

### Cutoff Logic & Safety:
1. **Pre-Call Check:** Ensure `wallet.balance >= doctor.ratePerMinute`. If lower, prevent call and trigger the Recharge modal.
2. **Real-time Live Tick:**
   - Every second, the client updates the UI timer.
   - At each 60-second boundary (or in live ticks), the system calculates remaining time:
     $$\text{Remaining Minutes} = \left\lfloor \frac{\text{Wallet Balance}}{\text{Rate Per Minute}} \right\rfloor$$
3. **Threshold Alerts:**
   - **Warning Banner:** Triggers when remaining balance is $< 60$ seconds.
   - **Auto-Cutoff:** When balance reaches zero, the WebRTC stream is closed, call status is marked as `ended_zero_balance`, and a summary dialog appears informing the user.

---

## 6. Implementation Workflow & Next Steps

1. **Step 1: Write Detailed Implementation Plan** (via `writing-plans` skill)
2. **Step 2: Scaffold Next.js Project & Dependencies**
   - Setup Tailwind CSS, Lucide, Radix UI primitives, `@tanstack/react-query`, `zustand`, `zod`, `sequelize`, `sqlite3`.
3. **Step 3: Setup Database, Models, and Seed Data**
   - Initialize Sequelize models, relationships, and Rehmat Health Care sample doctors.
4. **Step 4: Implement Core State & API Services**
   - Wallet recharge API & service with atomic transactions.
   - Consultation lifecycle & billing tick API.
   - Messaging API.
5. **Step 5: Build UI Components & Pages**
   - Clinic header & Role Switcher (Patient / Doctor demo modes).
   - Doctors Directory with rate badges and call buttons.
   - Recharge Modal with instant UPI / Card simulation.
   - Live Video Consultation Room with controls, HUD, and live WebRTC streaming.
   - In-App Messaging room.
6. **Step 6: End-to-End Verification & Walkthrough**
   - Simulate patient recharge -> start call -> live billing tick -> zero-balance cutoff -> chat.
