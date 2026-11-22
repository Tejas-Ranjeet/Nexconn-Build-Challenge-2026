# Sahaay (सहाय) — Accessible Community & Emergency Communication Network

> **Built for the Nexconn Hackathon 2026**  
> **Team:** Lucario Wizards  
> **Core Requirement:** Real-Time Messaging powered by **Nexconn Chat SDK** & **Nexconn Chat UI**

[![Nexconn Chat SDK](https://img.shields.io/badge/Nexconn%20Chat%20SDK-v26.5.1-blue.svg)](https://www.nexconn.ai)
[![Nexconn Chat UI](https://img.shields.io/badge/Nexconn%20Chat%20UI-v26.5.0-indigo.svg)](https://docs.nexconn.ai)
[![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black.svg)](https://nextjs.org)
[![WCAG AAA](https://img.shields.io/badge/Accessibility-WCAG%20AAA-success.svg)](https://www.w3.org/WAI/standards-guidelines/wcag/)

---

## 📌 Executive Summary

During critical local crises, power blackouts, extreme weather events, or medical emergencies, standard social messaging apps (WhatsApp, Telegram) fail vulnerable individuals. **Senior citizens, persons with visual or motor disabilities, and localized communities** are overwhelmed by cluttered groups, noisy feeds, tiny fonts, and the absence of rapid emergency dispatch.

**Sahaay** (meaning *Help / Support* in Hindi & Sanskrit) bridges this gap. It is an accessible, community-first mutual-aid and emergency communication network that segments hyper-local crisis response into five purpose-built real-time rooms and private 1:1 care lines, backed by native voice-to-text, audio read-outs, and one-click geolocation SOS alerts.

---

## ⚡ Nexconn Integration Proof & Architecture

Judges check for real **Nexconn Chat SDK** and **Chat UI** usage. Sahaay integrates all required Nexconn packages:

```json
{
  "dependencies": {
    "@nexconn/chat": "^26.5.1",
    "@nexconn/chatui": "^26.5.0",
    "@nexconn/engine": "^26.5.1",
    "lit": "^3.3.3"
  }
}
```

### 1. Group Channels (`GroupChannelIdentifier`)
Sahaay creates five dedicated community rooms powered by Nexconn Group Channels:
* 🚨 **`sahaay_emergency` (Emergency Help & SOS):** High-priority distress alerts, immediate rescue dispatch, and life-safety coordination.
* 🏥 **`sahaay_medical` (Medical Assistance):** Consultations with on-call physicians, urgent medication deliveries, and oxygen/blood matching.
* 🤝 **`sahaay_volunteers` (Volunteer Network):** On-the-ground volunteer mobilization, relief material distribution, and task check-ins.
* 📢 **`sahaay_announcements` (Local Announcements):** Verified municipal bulletins, extreme weather warnings, and health advisory updates.
* 💬 **`sahaay_general` (General Community):** Neighborly check-ins, elder welfare assistance, grocery runs, and mutual community aid.

### 2. Direct Channels (`DirectChannelIdentifier`)
Private, confidential 1:1 triage channels between distressed citizens and verified doctors or first responders (`DirectChannelIdentifier`).

### 3. Prebuilt Nexconn Chat UI (`<nc-chat-ui-app-provider>`)
Sahaay embeds the official Web Component `<nc-chat-ui-app-provider />` and configures `NCChatUIApplication` with real-time `ServiceHooks`:
* `reqUserProfiles`: Resolves real user names and avatars.
* `reqGroupProfiles`: Resolves channel titles and active member counts.
* `reqGroupMembers`: Syncs authorized responders and coordinators.

### 4. Server-Side Token Issuance (`/api/nexconn/token`)
As mandated by Nexconn security rules, **App Secrets are never exposed to the client**. Sahaay implements the official Nexconn Server API SHA1 signature calculation in Next.js App Router:

$$\text{Signature} = \text{SHA1}(\text{AppSecret} + \text{Nonce} + \text{Timestamp})$$

```ts
// src/app/api/nexconn/token/route.ts
const nonce = Math.floor(Math.random() * 1000000).toString();
const timestamp = Date.now().toString();
const signature = crypto
  .createHash('sha1')
  .update(appSecret + nonce + timestamp)
  .digest('hex');

const response = await fetch('https://api.sg-light-api.com/v4/auth/access-token/issue', {
  method: 'POST',
  headers: {
    'App-Key': appKey,
    'Nonce': nonce,
    'Timestamp': timestamp,
    'Signature': signature,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ userId, name, avatarUrl })
});
```

### 5. Connection Lifecycle (`ConnectionStatusHandler`)
Monitors `CONNECTED`, `CONNECTING`, and `DISCONNECTED` states with immediate UI feedback and fallback recovery.

---

## ♿ Inclusive Accessibility Features

1. **Voice-to-Text Speech Input (Web Speech API):** One-click microphone button allows elders or injured users to speak emergency requests without typing.
2. **Text-to-Speech Playback (SpeechSynthesis):** Every incoming alert or response has an audio read-aloud button for visually impaired users.
3. **WCAG AAA High Contrast Theme:** One-click toggle between crisp dark/light and high-contrast yellow/black for low-vision readability.
4. **Dynamic Font Scaling:** Three instant typography sizes (Standard, Large, Extra Large).
5. **One-Click Geolocation SOS:** Captures GPS coordinates and broadcasts a high-priority distress card to responder channels.

---

## 🚀 Quick Start Guide

### Prerequisites
* Node.js v18+ or v20+
* Nexconn Developer Account ([console.nexconn.ai](https://console.nexconn.ai))

### 1. Clone & Install
```bash
git clone https://github.com/<your-username>/sahaay.git
cd sahaay
npm install
```

### 2. Configure Environment Variables
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Set your Nexconn credentials:
```env
NEXT_PUBLIC_NEXCONN_APP_KEY=your_nexconn_app_key
NEXCONN_APP_SECRET=your_nexconn_app_secret
NEXCONN_BASE_URL=https://api.sg-light-api.com
```

> **Note:** If no credentials are provided, Sahaay seamlessly runs in interactive evaluation mode so reviewers can test every channel and flow immediately!

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 📄 Printable Write-up PDF

A dedicated, print-optimized write-up page is included at:
* `/writeup` — Open in browser and click **"Print or Save as PDF"** to generate the required submission PDF.

---

## 🏆 Submission Form Checklist

* **Project Name:** Sahaay – Accessible Community & Emergency Communication
* **Nexconn Packages Used:** `[x] Chat SDK`, `[x] Chat UI`
* **Nexconn App Key:** Configured in `NEXT_PUBLIC_NEXCONN_APP_KEY`
* **SDK Features Used:** Group Channels, Direct Channels, ChatUI Web Component Provider, Server-Side Token Generation, ConnectionStatusHandler, ServiceHooks.
* **Prior Work:** No, built for this challenge.

---

## 📜 License
MIT License. Created for the Nexconn Hackathon 2026.
