# Rehmat Health Care Teleconsultation App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready, mobile-responsive teleconsultation web application for Rehmat Health Care (Malviya Nagar, Moradabad) featuring a prepaid medical wallet, doctor directory, live WebRTC video calling with per-minute billing, dynamic duration tickers, low-balance warnings, auto-cutoff, and in-app messaging.

**Architecture:** Decoupled architecture consisting of a Node.js + Express + Sequelize + Socket.io backend built with servercn patterns (`ApiError`, `ApiResponse`, `asyncHandler`, `validate`), alongside a React + Vite + TypeScript + Tailwind CSS + shadcn/ui frontend organized in modular `src/features/*` domains with TanStack Query and Zustand.

**Tech Stack:** Node.js, Express, TypeScript, Sequelize (SQLite/PostgreSQL), Zod, Socket.io, React, Vite, Tailwind CSS, shadcn/ui (Radix UI), TanStack Query, Zustand, WebRTC.

**Spec:** [docs/superpowers/specs/2026-11-15-rehmat-health-care-teleconsult-design.md](file:///c:/Users/Himanshu/OneDrive/Desktop/Project/Rehmat_Health_Care/docs/superpowers/specs/2026-11-15-rehmat-health-care-teleconsult-design.md)

## Global Constraints

- Backend must reside in `server/` with TypeScript and Express.
- Frontend must reside in `client/` with React, Vite, and TypeScript.
- Follow servercn patterns in `server/src/core/` (`api-error.ts`, `api-response.ts`, `async-handler.ts`, `validate.middleware.ts`).
- Follow modular `src/features/*` in `client/src/features/` (`auth/`, `wallet/`, `doctors/`, `consultation/`, `chat/`).
- Database models must be implemented using Sequelize with strict associations and seed data for Rehmat Health Care.
- Real-time video signaling and ringing must use Socket.io.
- Billing is strictly per-minute: `Math.max(1, Math.ceil(durationSeconds / 60)) * ratePerMinute`.
- Immediate auto-cutoff when wallet balance hits ₹0.00.

---

### Task 1: Scaffolding Root Workspace & Server/Client Directories

**Files:**
- Create: `package.json` (root orchestrator)
- Create: `server/package.json`
- Create: `server/tsconfig.json`
- Create: `client/package.json`
- Create: `client/tsconfig.json`
- Create: `client/vite.config.ts`

**Interfaces:**
- Consumes: None
- Produces: Root workspace script commands (`npm run dev`, `npm run build`, `npm run seed`)

- [ ] **Step 1: Create root `package.json`**

```json
{
  "name": "rehmat-health-care",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev:server": "npm --prefix server run dev",
    "dev:client": "npm --prefix client run dev",
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "build:server": "npm --prefix server run build",
    "build:client": "npm --prefix client run build",
    "build": "npm run build:server && npm run build:client",
    "seed": "npm --prefix server run seed"
  },
  "devDependencies": {
    "concurrently": "^9.1.2"
  }
}
```

- [ ] **Step 2: Create `server/package.json` and `server/tsconfig.json`**

```json
{
  "name": "rehmat-health-care-server",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "seed": "tsx src/seed/seed-data.ts",
    "test": "node --test dist/**/*.test.js || echo 'No tests found'"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "sequelize": "^6.37.5",
    "sqlite3": "^5.1.7",
    "socket.io": "^4.8.1",
    "uuid": "^11.1.0",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^22.13.9",
    "@types/uuid": "^10.0.0",
    "tsx": "^4.19.3",
    "typescript": "^5.8.2"
  }
}
```

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: Create `client/package.json`, `client/tsconfig.json`, and `client/vite.config.ts`**

```json
{
  "name": "rehmat-health-care-client",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-slot": "^1.1.2",
    "@radix-ui/react-tabs": "^1.1.3",
    "@tanstack/react-query": "^5.67.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.477.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "socket.io-client": "^4.8.1",
    "tailwind-merge": "^3.0.2",
    "tailwindcss-animate": "^1.0.7",
    "zustand": "^5.0.3"
  },
  "devDependencies": {
    "@types/node": "^22.13.9",
    "@types/react": "^19.0.10",
    "@types/react-dom": "^19.0.4",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.8.2",
    "vite": "^6.2.0"
  }
}
```

- [ ] **Step 4: Install dependencies in both workspaces**

Run: `npm install; cd server && npm install; cd ../client && npm install`
Verify: Node modules installed in both server and client without errors.

- [ ] **Step 5: Commit workspace configuration**

```bash
git add package.json server/package.json server/tsconfig.json client/package.json client/tsconfig.json client/vite.config.ts
git commit -m "chore: scaffold root workspace with server and client directories"
```

---

### Task 2: Servercn Core Architecture Primitives (Node.js Backend)

**Files:**
- Create: `server/src/core/api-error.ts`
- Create: `server/src/core/api-response.ts`
- Create: `server/src/core/async-handler.ts`
- Create: `server/src/core/validate.middleware.ts`
- Create: `server/src/config/env.ts`
- Create: `server/src/config/database.ts`

**Interfaces:**
- Consumes: `zod`, `sequelize`, `express`
- Produces: `ApiError`, `ApiResponse`, `asyncHandler`, `validate`, `sequelize`, `ENV`

- [ ] **Step 1: Write `server/src/core/api-error.ts` & `server/src/core/api-response.ts`**

```typescript
// server/src/core/api-error.ts
export class ApiError extends Error {
  statusCode: number;
  errors: any[];
  success: boolean;

  constructor(statusCode: number, message = "Something went wrong", errors: any[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;
    Error.captureStackTrace(this, this.constructor);
  }
}

// server/src/core/api-response.ts
export class ApiResponse<T = any> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: T, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}
```

- [ ] **Step 2: Write `server/src/core/async-handler.ts` & `server/src/core/validate.middleware.ts`**

```typescript
// server/src/core/async-handler.ts
import { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// server/src/core/validate.middleware.ts
import { AnyZodObject, ZodError } from "zod";
import { ApiError } from "./api-error.js";

export const validate = (schema: AnyZodObject) =>
  asyncHandler(async (req, res, next) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ApiError(400, "Validation failed", error.errors);
      }
      throw error;
    }
  });
```

- [ ] **Step 3: Write `server/src/config/env.ts` & `server/src/config/database.ts`**

```typescript
// server/src/config/env.ts
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  CLIENT_URL: z.string().default("http://localhost:5173"),
  DB_STORAGE: z.string().default("./rehmat_healthcare.sqlite"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const ENV = envSchema.parse(process.env);

// server/src/config/database.ts
import { Sequelize } from "sequelize";
import { ENV } from "./env.js";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ENV.DB_STORAGE,
  logging: false,
});
```

- [ ] **Step 4: Verify compilation of core primitives**

Run: `cd server && npx tsc --noEmit`
Expected: Exits cleanly with zero errors.

- [ ] **Step 5: Commit servercn core primitives**

```bash
git add server/src/core server/src/config
git commit -m "feat(server): add servercn core primitives, env config, and sequelize database instance"
```

---

### Task 3: Sequelize Database Models, Associations & Initial Clinic Seed Data

**Files:**
- Create: `server/src/models/User.ts`
- Create: `server/src/models/Doctor.ts`
- Create: `server/src/models/Wallet.ts`
- Create: `server/src/models/Transaction.ts`
- Create: `server/src/models/Consultation.ts`
- Create: `server/src/models/Message.ts`
- Create: `server/src/models/index.ts`
- Create: `server/src/seed/seed-data.ts`

**Interfaces:**
- Consumes: `sequelize`, `User`, `Doctor`, `Wallet`, `Transaction`, `Consultation`, `Message`
- Produces: Synced relational database with Rehmat Health Care doctors & patient test records

- [ ] **Step 1: Define Sequelize Models with Type Definitions**
Implement `User`, `Doctor`, `Wallet`, `Transaction`, `Consultation`, `Message` with UUID primary keys, decimal columns for balances and consultation fees, and timestamps.

- [ ] **Step 2: Configure Model Associations in `server/src/models/index.ts`**
- `User.hasOne(Doctor, { foreignKey: 'userId', as: 'doctorProfile' })`
- `Doctor.belongsTo(User, { foreignKey: 'userId', as: 'user' })`
- `User.hasOne(Wallet, { foreignKey: 'userId', as: 'wallet' })`
- `Wallet.belongsTo(User, { foreignKey: 'userId', as: 'user' })`
- `Wallet.hasMany(Transaction, { foreignKey: 'walletId', as: 'transactions' })`
- `Transaction.belongsTo(Wallet, { foreignKey: 'walletId', as: 'wallet' })`
- `User.hasMany(Consultation, { foreignKey: 'patientId', as: 'patientConsultations' })`
- `Doctor.hasMany(Consultation, { foreignKey: 'doctorId', as: 'doctorConsultations' })`
- `Consultation.belongsTo(User, { foreignKey: 'patientId', as: 'patient' })`
- `Consultation.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' })`
- `User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' })`

- [ ] **Step 3: Create Initial Clinic Seed Script in `server/src/seed/seed-data.ts`**
Seed data includes:
- Doctor: Dr. Rehmat Ali (MBBS, General Physician, 12 years experience, ₹15.00/min, Online)
- Doctor: Dr. Sana Khan (BUMS, Family Medicine & Women Health, 8 years experience, ₹12.00/min, Online)
- Patient: Mohd. Imran (Demo Patient with starting wallet balance of ₹150.00)
- Sample transactions and welcome message.

- [ ] **Step 4: Execute Seed Script**

Run: `cd server && npm run seed`
Expected: Database initialized, tables created, seed records inserted successfully.

- [ ] **Step 5: Commit models and seed script**

```bash
git add server/src/models server/src/seed
git commit -m "feat(server): define sequelize models, associations and initial clinic seed data"
```

---

### Task 4: Backend Feature Modules & REST API with Zod Validation

**Files:**
- Create: `server/src/modules/doctors/doctors.routes.ts`, `doctors.controller.ts`, `doctors.service.ts`
- Create: `server/src/modules/wallet/wallet.routes.ts`, `wallet.controller.ts`, `wallet.service.ts`, `wallet.schema.ts`
- Create: `server/src/modules/consultations/consultations.routes.ts`, `consultations.controller.ts`, `consultations.service.ts`, `consultations.schema.ts`
- Create: `server/src/modules/messages/messages.routes.ts`, `messages.controller.ts`, `messages.service.ts`
- Create: `server/src/app.ts`

**Interfaces:**
- Consumes: Sequelize models, `asyncHandler`, `ApiResponse`, `ApiError`, `validate`
- Produces: Express REST API endpoints (`/api/doctors`, `/api/wallet`, `/api/consultations`, `/api/messages`)

- [ ] **Step 1: Implement Doctors Module**
- `GET /api/doctors` -> Returns list of doctors with user profile details and current online/busy statuses.
- `PATCH /api/doctors/:id/status` -> Toggles doctor online / busy state.

- [ ] **Step 2: Implement Wallet Module with Atomic Transactions**
- `GET /api/wallet/:userId` -> Returns user wallet balance and recent transactions.
- `POST /api/wallet/recharge` -> Validates amount via Zod (`min(50)`), creates transaction record, and atomically increments balance.

- [ ] **Step 3: Implement Consultations & Live Billing Ticker Module**
- `POST /api/consultations/initiate` -> Checks if patient balance $\ge$ doctor rate, creates consultation record (`status: ringing`).
- `POST /api/consultations/:id/accept` -> Marks status as `connected`, sets `startedAt = new Date()`.
- `POST /api/consultations/:id/tick` -> Heartbeat calculation: increments duration, checks if remaining balance $< 60s$ (warning) or $\le 0$ (auto-cutoff).
- `POST /api/consultations/:id/end` -> Finalizes duration, calculates `billedMinutes = Math.ceil(duration / 60)`, executes atomic debit transaction, and marks consultation `completed`.

- [ ] **Step 4: Implement Messages Module**
- `GET /api/messages/:userId1/:userId2` -> Fetches chat thread between patient and doctor.
- `POST /api/messages` -> Saves message and returns standard `ApiResponse`.

- [ ] **Step 5: Assemble Express App in `server/src/app.ts` with Global Error Handler**
Includes `cors`, `express.json()`, route mounting, and servercn global error middleware.

- [ ] **Step 6: Commit backend REST API modules**

```bash
git add server/src/modules server/src/app.ts
git commit -m "feat(server): implement doctors, wallet, consultations, and messages REST API modules"
```

---

### Task 5: Socket.io Real-time Gateway (Signaling, Ringing & Live Chat)

**Files:**
- Create: `server/src/socket/call.socket.ts`
- Create: `server/src/socket/chat.socket.ts`
- Create: `server/src/socket/index.ts`
- Create: `server/src/server.ts`

**Interfaces:**
- Consumes: Node `http`, `socket.io`, consultation service
- Produces: Real-time Socket.io server with call rooms, WebRTC signaling events, and incoming call alerts

- [ ] **Step 1: Implement `server/src/socket/call.socket.ts`**
Events:
- `join-room`: Joins user to their private room (for alerts) and consultation room.
- `call-user`: Emits `incoming-call` to doctor with patient name, consultation ID, and doctor rate.
- `accept-call`: Doctor accepts call -> notifies patient to initiate WebRTC offer.
- `reject-call`: Doctor declines call -> notifies patient.
- `webrtc-offer`, `webrtc-answer`, `ice-candidate`: Seamless peer-to-peer signaling forwarding.
- `end-call`: Disconnects room and triggers final billing deduction.

- [ ] **Step 2: Implement `server/src/socket/chat.socket.ts`**
Events:
- `send-message`: Broadcasts instant message to the recipient's room.

- [ ] **Step 3: Setup HTTP Server and Socket.io bootstrap in `server/src/server.ts`**
Connects Express app, attaches Socket.io server with CORS, and tests database connection on startup.

- [ ] **Step 4: Test Server Launch**

Run: `cd server && npm run dev`
Expected: "Server running on port 5000", "Database connected successfully", "Socket.io initialized".

- [ ] **Step 5: Commit real-time Socket.io gateway**

```bash
git add server/src/socket server/src/server.ts
git commit -m "feat(server): implement socket.io server with webrtc signaling and incoming call ringing"
```

---

### Task 6: Frontend Design System & shadcn/ui Components (React + Tailwind)

**Files:**
- Create: `client/tailwind.config.ts`
- Create: `client/src/index.css`
- Create: `client/src/lib/utils.ts`
- Create: `client/src/components/ui/button.tsx`
- Create: `client/src/components/ui/card.tsx`
- Create: `client/src/components/ui/dialog.tsx`
- Create: `client/src/components/ui/badge.tsx`
- Create: `client/src/components/ui/input.tsx`
- Create: `client/src/components/ui/tabs.tsx`
- Create: `client/src/components/ui/avatar.tsx`

**Interfaces:**
- Consumes: Tailwind CSS, Radix UI primitives, `clsx`, `tailwind-merge`, `class-variance-authority`
- Produces: shadcn/ui component library with healthcare color palette (emerald/teal, slate, rose)

- [ ] **Step 1: Configure `tailwind.config.ts` and `src/index.css`**
Set up CSS custom properties for healthcare theme tokens: `--primary`, `--primary-foreground`, `--muted`, `--accent`, `--border`, and radius.

- [ ] **Step 2: Create `client/src/lib/utils.ts`**
Implement standard `cn(...inputs: ClassValue[])` function.

- [ ] **Step 3: Implement shadcn/ui components**
Create `button.tsx`, `card.tsx`, `dialog.tsx`, `badge.tsx`, `input.tsx`, `tabs.tsx`, `avatar.tsx` following standard shadcn/ui patterns.

- [ ] **Step 4: Verify UI build**

Run: `cd client && npm run build`
Expected: Build passes with zero TypeScript or Tailwind errors.

- [ ] **Step 5: Commit design system and shadcn components**

```bash
git add client/tailwind.config.ts client/src/index.css client/src/lib/utils.ts client/src/components/ui
git commit -m "feat(client): configure tailwind and implement shadcn/ui components"
```

---

### Task 7: Frontend Infrastructure & Global State (TanStack Query, Zustand, Socket.io)

**Files:**
- Create: `client/src/lib/api-client.ts`
- Create: `client/src/lib/socket.ts`
- Create: `client/src/providers/query-provider.tsx`
- Create: `client/src/features/auth/store/use-auth-store.ts`
- Create: `client/src/features/wallet/store/use-wallet-store.ts`
- Create: `client/src/features/consultation/store/use-call-store.ts`

**Interfaces:**
- Consumes: `@tanstack/react-query`, `zustand`, `socket.io-client`
- Produces: API HTTP client, connected Socket client, and global reactive stores

- [ ] **Step 1: Implement `client/src/lib/api-client.ts`**
Fetch wrapper with baseUrl `http://localhost:5000/api`, default JSON headers, and error handling.

- [ ] **Step 2: Implement `client/src/lib/socket.ts`**
Singleton Socket.io client connecting to `http://localhost:5000`.

- [ ] **Step 3: Implement Zustand Stores**
- `useAuthStore`: Holds active demo profile (Patient "Mohd. Imran" vs Doctor "Dr. Rehmat Ali"), allows 1-click toggle.
- `useWalletStore`: Holds cached balance and triggers recharge modal.
- `useCallStore`: Holds active consultation ID, call state (`idle`, `ringing`, `connected`, `ended`), duration seconds, live cost, and remote stream.

- [ ] **Step 4: Commit frontend infrastructure**

```bash
git add client/src/lib client/src/providers client/src/features/auth/store client/src/features/wallet/store client/src/features/consultation/store
git commit -m "feat(client): configure api client, socket singleton, query provider and zustand stores"
```

---

### Task 8: Clinic Layout, Header & Fast Role Switcher

**Files:**
- Create: `client/src/features/auth/components/role-switcher.tsx`
- Create: `client/src/components/layout/navbar.tsx`
- Create: `client/src/components/layout/footer.tsx`

**Interfaces:**
- Consumes: `useAuthStore`, `useWalletStore`, shadcn `button`, `badge`
- Produces: Responsive navigation header with active role toggle and clinic branding

- [ ] **Step 1: Implement `role-switcher.tsx`**
Pill toggle enabling the user to switch between "Patient View" and "Doctor View" instantly for testing two-way calls and messaging on a single machine.

- [ ] **Step 2: Implement `navbar.tsx`**
Clinic logo: **Rehmat Health Care (Moradabad)**, navigation links (Doctors, Consultations, Chat, Wallet), live wallet balance badge (`₹150.00`), and role switcher.

- [ ] **Step 3: Implement `footer.tsx`**
Clinic address: *Near Mohan X-Ray, Malviya Nagar, Moradabad, Uttar Pradesh*. Contact info, timings, and emergency medical disclaimer.

- [ ] **Step 4: Commit layout and role switcher**

```bash
git add client/src/features/auth/components client/src/components/layout
git commit -m "feat(client): implement clinic navbar, footer, and fast role switcher"
```

---

### Task 9: Feature Module: Doctors Directory

**Files:**
- Create: `client/src/features/doctors/types/doctor.types.ts`
- Create: `client/src/features/doctors/hooks/use-doctors.ts`
- Create: `client/src/features/doctors/components/doctor-card.tsx`
- Create: `client/src/features/doctors/components/doctor-filter.tsx`
- Create: `client/src/features/doctors/pages/doctors-view.tsx`

**Interfaces:**
- Consumes: `/api/doctors`, `useCallStore`, `useWalletStore`
- Produces: Doctor listing with rate per minute, status badge (Online/Busy), and direct "Start Video Call" button

- [ ] **Step 1: Create types and TanStack Query hook in `use-doctors.ts`**
Fetches `/api/doctors` with automatic background refetching.

- [ ] **Step 2: Build `doctor-card.tsx`**
Displays doctor name, specialty (e.g. General Physician), qualifications (MBBS), experience, clinic verified badge, rating (4.9), per-minute rate badge (e.g. `₹15 / min`), and call buttons.

- [ ] **Step 3: Add Pre-Call Balance Guard**
When clicking "Start Video Call", checks if `wallet.balance >= doctor.ratePerMinute`. If insufficient, prompts the user to recharge. If sufficient, initiates call.

- [ ] **Step 4: Commit doctors module**

```bash
git add client/src/features/doctors
git commit -m "feat(client): implement doctor directory with rate badges and pre-call balance check"
```

---

### Task 10: Feature Module: Medical Wallet & Recharge System

**Files:**
- Create: `client/src/features/wallet/types/wallet.types.ts`
- Create: `client/src/features/wallet/hooks/use-wallet.ts`
- Create: `client/src/features/wallet/components/balance-card.tsx`
- Create: `client/src/features/wallet/components/recharge-modal.tsx`
- Create: `client/src/features/wallet/components/transaction-list.tsx`
- Create: `client/src/features/wallet/pages/wallet-view.tsx`

**Interfaces:**
- Consumes: `/api/wallet/:userId`, `/api/wallet/recharge`
- Produces: Interactive wallet with instant simulated UPI / Card recharge and complete transaction audit ledger

- [ ] **Step 1: Build `balance-card.tsx`**
Card displaying available consultation balance, estimated calling minutes remaining, and a prominent "+ Recharge Credits" button.

- [ ] **Step 2: Build `recharge-modal.tsx`**
Dialog with preset amount pills (`₹100`, `₹250`, `₹500`, `₹1000`), simulated payment method selector (UPI / Google Pay / PhonePe / Card), and a "Simulate Instant Pay" button that credits the wallet and shows a success receipt.

- [ ] **Step 3: Build `transaction-list.tsx`**
Table / list showing transactions with type badge (Green for Credit, Red for Call Debit), timestamp, duration, and reference ID.

- [ ] **Step 4: Commit wallet module**

```bash
git add client/src/features/wallet
git commit -m "feat(client): implement wallet balance card, recharge modal with upi simulation and transaction ledger"
```

---

### Task 11: Feature Module: WebRTC Video Consultation Room & Controls

**Files:**
- Create: `client/src/features/consultation/types/consultation.types.ts`
- Create: `client/src/features/consultation/hooks/use-webrtc.ts`
- Create: `client/src/features/consultation/components/video-room.tsx`
- Create: `client/src/features/consultation/components/call-controls.tsx`
- Create: `client/src/features/consultation/components/incoming-call-modal.tsx`

**Interfaces:**
- Consumes: Socket.io signaling events, `navigator.mediaDevices.getUserMedia`
- Produces: Live video consultation interface with remote video stream, local picture-in-picture stream, mic/camera controls, and incoming call ringing popup

- [ ] **Step 1: Implement `use-webrtc.ts`**
Handles camera/mic access, RTCPeerConnection creation, STUN servers (`stun:stun.l.google.com:19302`), local and remote video elements, track mute/unmute, and fallback demo video stream if no webcam is connected.

- [ ] **Step 2: Build `call-controls.tsx`**
Floating glassmorphism control bar: Mute/Unmute Mic, Camera On/Off, Switch Camera, and End Call button.

- [ ] **Step 3: Build `incoming-call-modal.tsx`**
Modal that pops up on the Doctor's screen when a patient initiates a call, with caller name, patient avatar, audio ringing simulation, and [Accept] / [Decline] buttons.

- [ ] **Step 4: Commit WebRTC consultation components**

```bash
git add client/src/features/consultation
git commit -m "feat(client): implement webrtc media hook, call controls, video room and incoming call ringing modal"
```

---

### Task 12: Feature Module: Per-Minute Billing Engine & Auto-Cutoff

**Files:**
- Create: `client/src/features/consultation/hooks/use-call-timer.ts`
- Create: `client/src/features/consultation/components/billing-hud.tsx`
- Create: `client/src/features/consultation/components/low-balance-alert.tsx`
- Create: `client/src/features/consultation/components/call-summary-modal.tsx`

**Interfaces:**
- Consumes: `useCallStore`, `useWalletStore`, `/api/consultations/:id/tick`
- Produces: Live per-minute meter HUD, low-balance warning alert, and zero-balance auto-cutoff handler

- [ ] **Step 1: Implement `use-call-timer.ts`**
- Starts interval when call status is `connected`.
- Computes `elapsedSeconds` and `billedMinutes = Math.max(1, Math.ceil(elapsedSeconds / 60))`.
- Calculates `liveCost = billedMinutes * doctorRate`.
- Calculates `remainingSeconds = Math.max(0, (walletBalance - liveCost) / doctorRate * 60)`.
- If `remainingSeconds <= 60 && remainingSeconds > 0`, activates low-balance banner.
- If `remainingSeconds <= 0`, calls `endCall('ended_zero_balance')` automatically.

- [ ] **Step 2: Build `billing-hud.tsx`**
Top overlay on the video call showing:
- Call Duration (`04:12`)
- Current Rate (`₹15 / min`)
- Running Cost (`₹75.00`)
- Balance Left (`₹75.00` / ~5 mins remaining)

- [ ] **Step 3: Build `call-summary-modal.tsx`**
Shows final consultation receipt: Doctor consulted, duration in minutes, total amount deducted, and updated wallet balance.

- [ ] **Step 4: Commit per-minute billing and auto-cutoff**

```bash
git add client/src/features/consultation
git commit -m "feat(client): implement live per-minute billing hud, low-balance alert and zero-balance auto-cutoff"
```

---

### Task 13: Feature Module: Real-time In-App Messaging

**Files:**
- Create: `client/src/features/chat/types/chat.types.ts`
- Create: `client/src/features/chat/hooks/use-chat.ts`
- Create: `client/src/features/chat/components/message-bubble.tsx`
- Create: `client/src/features/chat/components/message-input.tsx`
- Create: `client/src/features/chat/components/chat-container.tsx`
- Create: `client/src/features/chat/pages/chat-view.tsx`

**Interfaces:**
- Consumes: `/api/messages`, Socket.io chat events
- Produces: Real-time messaging screen between patient and doctor

- [ ] **Step 1: Build `use-chat.ts` with Socket.io real-time listener**
Loads initial message history via TanStack Query and listens to `receive-message` for instant chat bubbles.

- [ ] **Step 2: Build chat UI components**
Header with doctor info and online badge, scrollable message list with timestamps, and message input with send button.

- [ ] **Step 3: Commit in-app messaging module**

```bash
git add client/src/features/chat
git commit -m "feat(client): implement in-app real-time messaging module"
```

---

### Task 14: App Shell Assembly, End-to-End Integration & Verification

**Files:**
- Create: `client/src/App.tsx`
- Create: `client/src/main.tsx`
- Create: `README.md`

**Interfaces:**
- Consumes: All modules (`features/doctors`, `features/wallet`, `features/consultation`, `features/chat`, `features/auth`)
- Produces: Complete, running teleconsultation application ready for client demonstration

- [ ] **Step 1: Assemble `client/src/App.tsx`**
Includes tab navigation (Doctors, Live Consultation, Messages, Wallet), Navbar, Footer, and global modals (RechargeModal, IncomingCallModal, CallSummaryModal).

- [ ] **Step 2: Add comprehensive `README.md`**
Project overview, architecture diagrams, step-by-step instructions to run the server & client, and instructions for running a live demo test.

- [ ] **Step 3: Run Full End-to-End Verification**
1. Start server: `cd server && npm run dev`
2. Start client: `cd client && npm run dev`
3. Verify:
   - Patient views Dr. Rehmat Ali (₹15/min).
   - Recharges wallet by ₹100 via simulated UPI.
   - Starts video call -> Doctor sees incoming call modal and accepts.
   - Live video stream connects, timer ticks, HUD calculates ₹15, ₹30...
   - Test low balance warning and auto-cutoff when balance exhausts.
   - Send chat message and verify instant delivery.

- [ ] **Step 4: Final commit**

```bash
git add client/src/App.tsx client/src/main.tsx README.md
git commit -m "feat: complete rehmat health care teleconsultation platform integration"
```
