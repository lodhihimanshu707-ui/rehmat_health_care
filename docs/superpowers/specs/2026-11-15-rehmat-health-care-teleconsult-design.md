# Rehmat Health Care - Teleconsultation Demo Application Spec

- **Client:** Rehmat Health Care (Malviya Nagar, Moradabad)
- **Document Date:** 2026-11-15
- **Type:** Architectural Specification & Product Requirements Document (PRD)
- **Status:** Draft for Review

---

## 1. Project Overview & Objectives

Rehmat Health Care is a primary care medical clinic in Malviya Nagar, Moradabad. They require a lightweight, responsive teleconsultation demo application allowing patients to:
1. Access a dedicated healthcare portal (mobile-first & responsive).
2. Login / Register with quick access.
3. Recharge a digital wallet balance with credits (simulated Indian payment gateway with UPI / Card / NetBanking options).
4. Browse available Doctors (with specialty, availability status, and per-minute consultation rates).
5. Initiate live **Video Calls** with Doctors billed strictly on a **per-minute basis**, with real-time duration tracking and balance deduction.
6. Engage in direct **Messaging/Chat** with Doctors for consultations and follow-up advice.

The primary goal is to present a demo to the clinic stakeholders showcasing the end-to-end patient and doctor experience.

---

## 2. Key User Personas & User Journeys

### 2.1 Patient Persona
1. **Access & Onboarding:** Opens the web app on mobile or desktop; quick login or demo profile selection.
2. **Wallet & Recharge:** Views current credit balance (e.g. ₹0 or starting bonus). Clicks "Recharge", selects preset pack (₹100, ₹250, ₹500), selects payment method (UPI/GPay/PhonePe, Card), and confirms instant credit addition.
3. **Doctor Discovery:** Views Rehmat Health Care doctors with photo, qualifications (e.g., MBBS, General Physician), consultation rate (e.g. ₹15/min), and live status (*Online* / *Busy*).
4. **Video Consultation:**
   - Clicks "Call Doctor".
   - System checks if patient has minimum balance (e.g., at least 1 minute of call balance).
   - Starts video call with local camera preview and connects to the doctor.
   - Live timer displays elapsed time and running cost.
   - When balance drops below threshold, alerts patient; if balance runs out, safely terminates the call.
5. **Chat / Messaging:** Opens real-time chat with the doctor to exchange medical queries, advice, or symptoms.
6. **Billing History:** Displays detailed transaction history (credits added vs. consultation deductions with timestamps).

### 2.2 Doctor Persona
1. **Doctor Dashboard:** Toggle status between *Online / Available* and *Offline*.
2. **Incoming Calls:** Receives incoming call notification with patient name and quick Accept / Decline buttons.
3. **Consultation Room:** Conducts video call with patient, camera/mic controls, and access to notes.
4. **Earnings Overview:** Displays accumulated consultation minutes and total earned fees for the day/session.

---

## 3. System Architecture & Tech Stack

```
+--------------------------------------------------------------------------------+
|                           Client Layer (Responsive Web)                        |
|   - Mobile First UI (Tailwind CSS + Lucide Icons)                             |
|   - Patient Flow: Wallet, Doctor Directory, Video Call Room, Messaging Room    |
|   - Doctor Flow: Availability Toggle, Incoming Call Alert, Consultation View   |
|   - Role Switcher for instant Demo testing (Patient <-> Doctor)                |
+--------------------------------------------------------------------------------+
                                       |
                                       v
+--------------------------------------------------------------------------------+
|                        Application & Logic Layer (Next.js)                     |
|   - App Router (React 19 / 18, TypeScript)                                     |
|   - State Management: LocalStorage + Reactive Store (Sessions, Wallets, Logs)  |
|   - WebRTC Engine: Peer-to-peer Video & Audio with STUN fallback               |
|   - Signaling & Sync: Real-time BroadcastChannel / WebSocket for two tabs/browsers |
+--------------------------------------------------------------------------------+
                                       |
                                       v
+--------------------------------------------------------------------------------+
|                             Billing & Wallet Engine                            |
|   - Per-minute Metering: Tick interval (1 sec / 60 sec increments)             |
|   - Low-balance Warning Alert (when balance < 1 min left)                     |
|   - Auto-terminate on zero balance                                             |
|   - Simulated Payment Processor (UPI, Card, NetBanking receipts)              |
+--------------------------------------------------------------------------------+
```

### 3.1 Recommended Technology Stack
- **Framework:** Next.js (React with App Router)
- **Styling:** Tailwind CSS (Modern, mobile-friendly healthcare aesthetic: clean teal/emerald/blue tones, rounded cards, clean typography)
- **Icons:** Lucide React
- **Video Calling:** WebRTC API with local media stream (`navigator.mediaDevices.getUserMedia`) and live canvas/simulated peer fallback for seamless single-device testing or cross-tab two-party calls.
- **State & Persistence:** Client-side persistent reactive store with sample seed data (Rehmat Health Care doctors, mock wallet, transaction history).

---

## 4. Detailed Functional Specifications

### 4.1 Authentication & Profile
- Quick demo login: Patient mode ("Mohd. Imran / Patient") and Doctor mode ("Dr. Rehmat Ali / MBBS, General Physician").
- Seamless role switching header for testing calls between two browser windows or on the same screen.

### 4.2 Wallet & Recharge System
- **Current Balance:** Prominently displayed in header (e.g., `₹250.00`).
- **Recharge Modal:**
  - Preset amounts: ₹100, ₹250, ₹500, ₹1000.
  - Payment options: UPI (Google Pay, PhonePe, Paytm QR simulation), Debit/Credit Card, Net Banking.
  - Instant receipt generation with unique Transaction ID (`TXN-xxxxxx`).
- **Transaction Ledger:** Tab displaying all credits and debits with date, type, duration, and amount.

### 4.3 Doctor Consultation & Video Calling
- **Doctor Directory Card:**
  - Name, Speciality, Experience (e.g., 12+ years), Rehmat Health Care badge.
  - Per-minute rate badge (e.g., `₹15 / min`).
  - Action buttons: "Start Video Call", "Message Doctor".
- **Pre-Call Verification:**
  - Ensures wallet balance $\ge$ doctor's per-minute rate.
  - If insufficient, triggers "Recharge Required" prompt.
- **In-Call Interface:**
  - Remote video stream + picture-in-picture local preview.
  - Controls: Mute/Unmute Mic, Toggle Camera, Flip Camera, End Call.
  - Live HUD:
    - Call timer (`MM:SS`).
    - Current call cost accumulator (`₹ XX.XX`).
    - Remaining balance countdown.
  - Low-balance warning banner when remaining balance is less than 60 seconds.
  - Auto-cutoff when balance reaches ₹0.00 with summary modal ("Call ended: X mins, Deducted: ₹Y").

### 4.4 In-App Messaging
- Real-time chat interface with Doctor.
- Send and receive text messages, prescription requests, and symptom notes.
- Timestamps and message delivery status checkmarks.

### 4.5 Clinic Branding
- Prominent branding: **Rehmat Health Care, Malviya Nagar, Moradabad**.
- Clinic address and contact information displayed in footer/info section.
- Emergency notice disclaimer: *"For life-threatening emergencies, please visit the nearest hospital or call 112/108 immediately."*

---

## 5. Non-Functional Requirements
- **Responsiveness:** 100% responsive across mobile smartphones (iOS Safari, Android Chrome), tablets, and desktops.
- **Latency & Performance:** Instant load times, zero external dependencies required for the demo.
- **Reliability:** Graceful handling of camera/mic permission denial with demo fallback test stream.

---

## 6. Implementation Phases & Milestones

1. **Phase 1: Project Setup & UI Design System**
   - Initialize Next.js project with Tailwind CSS & Lucide icons.
   - Implement Rehmat Health Care branding, navigation header, and responsive layout.
2. **Phase 2: Wallet & Recharge Engine**
   - Build wallet state manager, recharge modal, and transaction ledger.
3. **Phase 3: Video Calling Engine with Per-Minute Billing**
   - WebRTC media streaming component with audio/video controls.
   - Real-time per-minute billing ticker, low balance warning, and automatic call termination.
4. **Phase 4: In-App Messaging & Doctor Dashboard**
   - Chat room interface between Patient and Doctor.
   - Doctor dashboard with incoming call alerts and earnings overview.
5. **Phase 5: Verification & Polish**
   - Cross-device testing (mobile view & desktop view), edge cases (zero balance, camera disconnect), documentation and walkthrough.
