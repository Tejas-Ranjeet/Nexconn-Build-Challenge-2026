# Sahaay (सहाय) — 2.5-Minute Video Walkthrough Guide & Recording Script

> **For the Presenter/Friend:** Don't worry if you didn't write the code! Read the 1-minute quick brief below so you understand the story, set up your screen according to the instructions, and then follow the **Word-for-Word Script** step by step.

---

## 1. The 1-Minute Quick Brief (What is Sahaay?)

* **The Problem:** During local crises (power cuts, floods, sudden medical emergencies), apps like WhatsApp fail. Distress calls get lost in noisy chat memes, and elderly or injured people struggle with tiny touch screens and manual typing.
* **Our Solution:** **Sahaay** (meaning *Support*) is an accessible emergency communication network built on the **Nexconn Chat SDK & Chat UI**.
* **Why Judges Care:**
  1. It uses **real Nexconn Chat SDK & Chat UI** on Nexconn Singapore servers (App Key: `z3v5yqkbzet40`).
  2. It has **structured triage channels** (Emergency, Medical, Volunteer, Announcements).
  3. It has **first-class accessibility** (voice dictation for people who can't type, text-to-speech read-aloud, high contrast for low vision, and 1-click GPS dispatch).

---

## 2. Pre-Recording Setup (Takes 2 Minutes)

1. **Recommended Tool:** Use **Loom** (free at [loom.com](https://www.loom.com)) or OBS / Windows Game Bar (`Win + Alt + R`).
2. **Two Browser Windows Side-by-Side:**
   - Open **Window 1 (Left Half of Screen):** `https://nexconn-build-challenge-2026.vercel.app/`
     - Keep user as **Anita Devi (Citizen)**.
   - Open **Window 2 (Right Half of Screen):** `https://nexconn-build-challenge-2026.vercel.app/`
     - In the top bar user switcher dropdown, change user to **Dr. Sunita Sharma (Physician)** or **Arjun Patel (Volunteer)**.
3. **Make Sure Both Windows are in the Same Channel:**
   - Click on **Emergency & Rescue** (`sahaay_emergency`) or **Medical Support** (`sahaay_medical`) on both windows.
4. **Test Sending One Message:**
   - Send "Test" on one side and see it appear on the other side. This proves real-time sync is working!

---

## 3. Step-by-Step Screenplay & Spoken Script (Target: 2.5 Minutes)

### Part 1: Introduction (0:00 – 0:35)

| Time | What to Do On Screen | What to Say (Word-for-Word Script) |
| :--- | :--- | :--- |
| **0:00 - 0:15** | Show the clean Sahaay interface on screen (full screen or left window). Point mouse to the header. | *"Hi everyone, this is Team Lucario Wizards, and today we’re presenting **Sahaay** — an accessible community communication and emergency response network built for the Nexconn Build Challenge 2026."* |
| **0:15 - 0:35** | Hover over the left sidebar channels (`Emergency & Rescue`, `Medical Support`, `Volunteer Network`). | *"During crises, traditional social apps like WhatsApp fail vulnerable citizens. Distress signals get drowned in chit-chat, and senior citizens or injured individuals struggle with tiny keyboards and complex navigation. Sahaay solves this by combining Nexconn's real-time messaging with dedicated crisis triage and WCAG AAA accessibility."* |

---

### Part 2: Nexconn SDK Architecture & App Key (0:35 – 1:05)

| Time | What to Do On Screen | What to Say (Word-for-Word Script) |
| :--- | :--- | :--- |
| **0:35 - 0:50** | Click on the **SDK Proof** or **Nexconn Status** badge in the header (or point to the green "Connected" badge). | *"Sahaay is powered by the official **Nexconn Chat SDK** and **Nexconn Chat UI**. We are connected live to Nexconn’s Singapore data center under our verified App Key: `z3v5yqkbzet40`."* |
| **0:50 - 1:05** | Point to the left sidebar showing the channels. | *"Under the hood, we use Nexconn's `GroupChannelIdentifier` to organize conversations into specialized lifelines: **Emergency & Rescue**, **Medical Support**, **Volunteer Logistics**, and **Announcements** — ensuring urgent distress calls are never lost in casual noise."* |

---

### Part 3: Live Real-Time Messaging Demo (1:05 – 1:45)

| Time | What to Do On Screen | What to Say (Word-for-Word Script) |
| :--- | :--- | :--- |
| **1:05 - 1:25** | Bring both browser windows side-by-side into view (Window 1 on Left: **Anita Devi**, Window 2 on Right: **Arjun Patel / Dr. Sunita**). | *"Here we have two live browser sessions connected side-by-side. On the left, we have **Anita Devi**, a senior resident in Sector 4. On the right, we have **Arjun Patel**, our on-duty emergency first responder."* |
| **1:25 - 1:35** | On the Left Window, type or click a quick action: *"Urgent: Need blood pressure medication delivered to Flat 302"* and hit **Send**. | *"When Anita posts an urgent request, it travels over Nexconn’s real-time WebSocket protocol and instantly renders on Arjun's responder dashboard without reloading the page."* |
| **1:35 - 1:45** | On the Right Window (Arjun), type: *"Received Anita, dispatching volunteer team now. ETA 5 minutes."* and hit **Send**. Watch it instantly show on the left! | *"Arjun acknowledges immediately, providing instant reassurance to the citizen in distress. Furthermore, all messages are persisted locally and synchronized across tabs."* |

---

### Part 4: Accessibility Features (Voice, Audio, High Contrast) (1:45 – 2:15)

| Time | What to Do On Screen | What to Say (Word-for-Word Script) |
| :--- | :--- | :--- |
| **1:45 - 1:55** | On the left window, click the **Microphone** icon at the bottom. Speak a brief sentence, or click one of the quick chips. | *"Accessibility is central to Sahaay. For elderly residents or people with trembling hands who cannot type, we built native **Voice-to-Text input** so they can simply speak their distress call."* |
| **1:55 - 2:05** | Click the **"Listen"** (speaker icon) on any message bubble to trigger the audio read-out. | *"For visually impaired citizens, our **Text-to-Speech engine** reads aloud every incoming announcement and doctor instruction with a single click."* |
| **2:05 - 2:15** | In the top header, click the **High Contrast Mode** toggle (sun/moon) and the **Text Size (A+)** toggle. | *"We also support instant high-contrast theming and dynamic font scaling, exceeding WCAG AAA standards for low-vision readability."* |

---

### Part 5: One-Click SOS Dispatch & Conclusion (2:15 – 2:40)

| Time | What to Do On Screen | What to Say (Word-for-Word Script) |
| :--- | :--- | :--- |
| **2:15 - 2:30** | Click the red **"SOS Alert"** button in the header. Show the location dialog and click **Send SOS**. Watch the red Emergency card broadcast live! | *"In extreme emergencies, tapping the red **SOS Alert** button automatically queries device GPS coordinates and dispatches a prioritized emergency card directly to all first responders."* |
| **2:30 - 2:40** | Switch back to the clean view. | *"Sahaay shows how the Nexconn Chat SDK can be harnessed to protect lives and build resilient, accessible communities. Thank you so much for watching!"* |

---

## 4. After Recording (Checklist)

1. **Stop the recording.**
2. **Rename the file:** `Sahaay_Demo_Walkthrough.mp4` (or keep the Loom link).
3. **Upload to Google Drive:**
   - Open the hackathon submission Drive folder:  
     👉 **[https://drive.google.com/drive/folders/1NHKl2p0NWWKTNUyq0RXqNzJ_iEvS8Q4Y?usp=sharing](https://drive.google.com/drive/folders/1NHKl2p0NWWKTNUyq0RXqNzJ_iEvS8Q4Y?usp=sharing)**
   - Drag and drop your video file into the folder.
   - **Double-check sharing settings:** Right-click the uploaded file or folder → Share → Set to **"Anyone with the link can view"**.
4. **All Done!** The submission portal link is already configured with this folder.
