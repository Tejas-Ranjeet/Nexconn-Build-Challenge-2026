# Sahaay (सहाय) — Accessible Community & Emergency Communication Network

> **Built for the Nexconn Hackathon / Build Challenge 2026**  
> **Team:** Lucario Wizards  
> **Repository:** [https://github.com/Tejas-Ranjeet/Nexconn-Build-Challenge-2026](https://github.com/Tejas-Ranjeet/Nexconn-Build-Challenge-2026)  
> **Core Requirement:** Real-Time Messaging powered by **Nexconn Chat SDK** & **Nexconn Chat UI**

[![Nexconn Chat SDK](https://img.shields.io/badge/Nexconn%20Chat%20SDK-v26.5.1-blue.svg)](https://www.nexconn.ai)
[![Nexconn Chat UI](https://img.shields.io/badge/Nexconn%20Chat%20UI-v26.5.0-indigo.svg)](https://docs.nexconn.ai)
[![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black.svg)](https://nextjs.org)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FTejas-Ranjeet%2FNexconn-Build-Challenge-2026&env=NEXT_PUBLIC_NEXCONN_APP_KEY,NEXCONN_APP_SECRET,NEXCONN_BASE_URL)

---

## 📌 Executive Summary

During critical local crises, power blackouts, extreme weather events, or medical emergencies, standard social messaging apps fail vulnerable individuals. **Senior citizens, persons with visual or motor disabilities, and localized communities** are overwhelmed by cluttered groups, noisy feeds, tiny fonts, and the absence of rapid emergency dispatch.

**Sahaay** (meaning *Help / Support* in Hindi & Sanskrit) bridges this gap. It is an accessible, community-first mutual-aid and emergency communication network that segments hyper-local crisis response into five purpose-built real-time rooms and private 1:1 care lines, backed by native voice-to-text, audio read-outs, and one-click geolocation emergency requests.

---

## ⚡ Nexconn Integration Proof & Architecture

Judges check for real **Nexconn Chat SDK** and **Chat UI** usage. Sahaay integrates all required Nexconn packages:

```json
{
  "dependencies": {
    "@nexconn/chat": "^26.5.1",
    "@nexconn/chatui": "^26.5.0",
    "@nexconn/engine": "^26.5.1"
  }
}
```

### 1. Group Channels (`GroupChannelIdentifier`)
Sahaay creates five dedicated community rooms powered by Nexconn Group Channels:
* **Emergency & Rescue (`sahaay_emergency`):** High-priority distress alerts, immediate rescue dispatch, and life-safety coordination.
* **Medical Support (`sahaay_medical`):** Consultations with on-call physicians, urgent medication deliveries, and medical supplies.
* **Volunteer Network (`sahaay_volunteers`):** On-the-ground volunteer mobilization and task check-ins.
* **Community Announcements (`sahaay_announcements`):** Verified municipal bulletins and extreme weather warnings.
* **General Support (`sahaay_general`):** Neighborly check-ins, elder welfare assistance, grocery runs, and mutual community aid.

### 2. Direct Channels (`DirectChannelIdentifier`)
Private, confidential 1:1 triage channels between distressed citizens and verified doctors or first responders (`DirectChannelIdentifier`).

### 3. Prebuilt Nexconn Chat UI (`<nc-chat-ui-app-provider>`)
Sahaay embeds the official Web Component `<nc-chat-ui-app-provider />` and configures `NCChatUIApplication` with real-time `ServiceHooks`:
* `reqUserProfiles`: Resolves real user names and avatars.
* `reqGroupProfiles`: Resolves channel titles and active member lists.
* `reqGroupMembers`: Provides role-based permissions (Citizen, Volunteer, Doctor, Coordinator).

### 4. Server-Side Token Generation
In compliance with official Nexconn security standards, the client never handles secrets. `src/app/api/nexconn/token/route.ts` generates secure server-side access tokens using:
```typescript
Signature = SHA1(AppSecret + Nonce + Timestamp)
```
and calls Nexconn's Singapore router (`https://api.sg-light-api.com/v4/auth/access-token/issue`).

---

## 🚀 Easy Deployment

### Option A: Deploy to Vercel (Recommended)

1. Click the button below:  
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FTejas-Ranjeet%2FNexconn-Build-Challenge-2026&env=NEXT_PUBLIC_NEXCONN_APP_KEY,NEXCONN_APP_SECRET,NEXCONN_BASE_URL)
2. Or import the repository `https://github.com/Tejas-Ranjeet/Nexconn-Build-Challenge-2026` in your [Vercel Dashboard](https://vercel.com/new).
3. Set the Environment Variables:
   - `NEXT_PUBLIC_NEXCONN_APP_KEY`: `z3v5yqkbzet40`
   - `NEXCONN_APP_SECRET`: `2MqUpRcBl2`
   - `NEXCONN_BASE_URL`: `https://api.sg-light-api.com`
4. Click **Deploy**. Vercel will automatically build and provide a live URL!

### Option B: Deploy to Render

1. Create a New Web Service on [Render](https://dashboard.render.com).
2. Connect repository `https://github.com/Tejas-Ranjeet/Nexconn-Build-Challenge-2026`.
3. Render detects `render.yaml` automatically, or configure:
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
4. Add the environment variables (`NEXT_PUBLIC_NEXCONN_APP_KEY`, `NEXCONN_APP_SECRET`, `NEXCONN_BASE_URL`).

---

## 💻 Local Setup & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_NEXCONN_APP_KEY=z3v5yqkbzet40
NEXCONN_APP_SECRET=2MqUpRcBl2
NEXCONN_BASE_URL=https://api.sg-light-api.com
```

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
* **Nexconn App Key:** `z3v5yqkbzet40`
* **SDK Features Used:** Group Channels, Direct Channels, ChatUI Web Component Provider, Server-Side Token Generation, ConnectionStatusHandler, ServiceHooks.
* **Prior Work:** No, built for this challenge.

---

## 📜 License
MIT License. Created for the Nexconn Hackathon 2026.
