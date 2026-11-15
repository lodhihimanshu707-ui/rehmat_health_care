# 🏥 Rehmat Health Care - Teleconsultation Platform (Moradabad)

A production-ready, mobile-responsive teleconsultation web application built for **Rehmat Health Care** (Near Mohan X-Ray, Malviya Nagar, Moradabad, Uttar Pradesh).

The platform enables patients to recharge a prepaid medical wallet, consult verified clinic doctors via live WebRTC video calling with **real-time per-minute billing**, dynamic duration tickers, low-balance alerts, automated zero-balance safety cutoffs, and in-app messaging.

---

## 🌟 Key Features

1. **Prepaid Medical Wallet & Simulated Indian Payment Gateway:**
   - Instant pack selection (₹100, ₹250, ₹500, ₹1000) or custom amount.
   - Realistic Indian payment simulation (UPI / GPay / PhonePe / Cards) with immediate credit and transaction ledger.
2. **Doctor Discovery & Credentials:**
   - Verified Rehmat Health Care doctor profiles with qualifications (MBBS, MD), experience, specialization, and ratings.
   - Transparent per-minute consultation rates (e.g. ₹15/min).
3. **Live WebRTC Video Consultation:**
   - Peer-to-peer real-time video and audio streaming with camera/mic controls.
   - Built-in fallback healthcare canvas stream for testing without a physical webcam.
4. **Per-Minute Billing Engine & Auto-Cutoff:**
   - Live Heads-Up Display (HUD) displaying elapsed time (`MM:SS`), live running cost, and remaining credit.
   - Synchronized heartbeats with the backend every 5 seconds.
   - Low-balance warning banner when balance drops below 60 seconds.
   - Automated call cutoff when balance reaches ₹0.00 with itemized consultation receipt.
5. **Real-Time In-App Messaging:**
   - Direct encrypted text messaging between patient and doctor for prescriptions and clinical inquiries.
6. **Fast Role Switcher (Demo Feature):**
   - Header toggle allows 1-click switching between **Patient View (Mohd. Imran)** and **Doctor View (Dr. Rehmat Ali)** to demonstrate two-way calls on a single laptop or across two browser tabs.

---

## 🛠️ Technology Stack & Architecture

- **Backend (`server/`):**
  - **Runtime & Framework:** Node.js, Express, TypeScript (strict mode)
  - **Architecture:** Servercn modular patterns (`ApiError`, `ApiResponse`, `asyncHandler`, `validate.middleware`)
  - **Database & ORM:** Sequelize ORM with SQLite (zero-config local persistence, switchable to PostgreSQL)
  - **Context Injection:** Node.js native `AsyncLocalStorage` (`RequestContext`) providing `this.currentUser` directly in the service layer
  - **Validation:** Zod schemas on all API endpoints
  - **Real-Time Gateway:** Socket.io for instant WebRTC signaling, ringing events, and chat
- **Frontend (`client/`):**
  - **Framework:** React 18, Vite, TypeScript
  - **UI & Styling:** **shadcn/ui** design system (Radix UI primitives + Tailwind CSS + Lucide icons)
  - **Modular Architecture:** `src/features/*` domain modules (`auth/`, `wallet/`, `doctors/`, `consultation/`, `chat/`)
  - **Client State:** Zustand (`useAuthStore`, `useWalletStore`, `useCallStore`)
  - **Server State / Caching:** TanStack Query (React Query v5)

---

## 📁 Project Structure

```
Rehmat_Health_Care/
├── server/                                 # Node.js + Express + Sequelize + Socket.io Backend
│   ├── src/
│   │   ├── config/                         # Sequelize instance & Zod env
│   │   ├── core/                           # Servercn primitives (ApiError, ApiResponse, asyncHandler, RequestContext)
│   │   ├── models/                         # Sequelize models (User, Doctor, Wallet, Transaction, Consultation, Message)
│   │   ├── modules/                        # Backend feature modules (doctors, wallet, consultations, messages)
│   │   ├── socket/                         # Socket.io handlers (WebRTC signaling, ringing, chat)
│   │   ├── seed/                           # Initial Rehmat Health Care doctors & patient records
│   │   ├── app.ts                          # Express configuration & global error handling
│   │   └── server.ts                       # HTTP + Socket.io server bootstrap
│
└── client/                                 # React + Vite + TypeScript + Tailwind + shadcn/ui Frontend
    ├── src/
    │   ├── components/
    │   │   ├── ui/                         # shadcn/ui primitives (button, card, dialog, badge, input, tabs, avatar)
    │   │   └── layout/                     # Clinic Navbar & Footer (Malviya Nagar Moradabad)
    │   ├── features/
    │   │   ├── auth/                       # Demo Profile & Role Switcher
    │   │   ├── wallet/                     # Wallet balance card, recharge modal, and transaction list
    │   │   ├── doctors/                    # Doctor directory and rate badges
    │   │   ├── consultation/               # WebRTC video room, billing HUD, low-balance alert, ringing modal
    │   │   └── chat/                       # Live messaging and message bubbles
    │   ├── lib/                            # API client, Socket singleton, and utilities
    │   ├── providers/                      # TanStack QueryClientProvider
    │   ├── App.tsx                         # Main Clinic Shell
    │   └── main.tsx                        # Application mount
```

---

## 🚀 How to Run Locally

### 1. Install Dependencies
```bash
# In the root folder
npm install
npm --prefix server install
npm --prefix client install
```

### 2. Seed Database
Initialize the SQLite database with Rehmat Health Care doctors and demo patient:
```bash
npm run seed
```

### 3. Start Both Backend & Frontend Concurrently
```bash
npm run dev
```
- **Backend API:** `http://localhost:5000/api`
- **Frontend App:** `http://localhost:5173`

---

## 🎬 How to Perform a Live Client Demonstration

1. Open `http://localhost:5173` in Browser Window A (as **Mohd. Imran / Patient**).
2. Open `http://localhost:5173` in Browser Window B (click **"Switch to Dr. Rehmat"** in the header).
3. **Wallet Check & Recharge:**
   - In Window A, view the patient wallet (starts with ₹150.00).
   - Click **"+ Recharge"** or **"Add Money"**, choose ₹100 or ₹250 via UPI, and click **Pay**. Notice the balance updates instantly with a transaction receipt.
4. **Initiate Video Consultation:**
   - In Window A, click **"Video Call"** on Dr. Rehmat Ali's card (₹15/min).
   - Window B (Doctor) immediately displays an incoming call ringing dialog with the patient's name.
   - Click **"Accept Call"** in Window B.
5. **Live Per-Minute Billing in Action:**
   - Both screens connect with live video/camera feeds.
   - Watch the top **Billing HUD**: the timer ticks (`00:01`, `00:02`...), the running cost calculates (`₹15.00` for the first minute), and the remaining balance counts down.
   - Test low-balance warning banner when balance is low, or click **"End Call"** to see the itemized consultation receipt and the atomic wallet debit!
6. **Live In-App Messaging:**
   - Go to the **Messages** tab and send a message. The recipient receives it immediately via Socket.io.
