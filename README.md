# Aaranya Interiors — Smart Interior Design Website & Automated Lead Management System

**Demonstration Website | Designed & Developed by [AI Business Growth Lab](https://ai-business-growth-lab.vercel.app/)**

A production-ready architectural interior design website and automated Google Sheets lead management system tailored for **Aaranya Interiors** (serving Greater Noida, Noida Extension, and Delhi NCR). Built to be reusable for future interior design clients via a single centralized configuration file (`src/config/siteConfig.ts`).

---

## System Architecture

```
Visitor Browser (React + TypeScript + Tailwind CSS)
   │
   ├── Multi-Step Consultation Form (/api/enquiry)
   ├── Separate "Ask a Question" Desk (/api/query)
   └── Prefilled Contextual WhatsApp Links (wa.me)
          │
          ▼
Vercel Serverless Functions (/api/enquiry.ts, /api/query.ts)
  • Server-side field validation & Indian mobile normalization
  • Honeypot spam trap & IP rate limiting
  • Duplicate submission guard (5-minute fingerprint window)
  • Spreadsheet formula injection protection (=, +, -, @, \t, \r)
  • Unique Lead ID (AAR-LD-...) & Query ID (AAR-QR-...) generation
  • Strict Live vs. Demonstration webhook separation
          │
          ▼
Google Apps Script Web App (google-apps-script/Code.gs)
  • Shared secret verification (WEBHOOK_SECRET)
  • LockService concurrency protection
  • Appends to private Google Sheets
  • Sends instant Owner & Customer emails (Live mode only; failures logged, never fail lead storage)
  • Daily 9 AM Pending & Overdue Follow-Up Digest trigger
          │
          ▼
Private Google Sheets CRM (5 Automated Tabs)
  1. Customer Leads (editable status dropdowns, follow-up dates, conditional formatting for overdue)
  2. Customer Queries (separate from leads, Pending/In Review/Resolved statuses)
  3. Dashboard (14+ native KPI formulas + Bar, Pie, and Column charts)
  4. Settings (workspace mode LIVE/DEMO, owner email, outreach toggles)
  5. Notification Log (email delivery audit & duplicate-prevention ledger)
```

---

## Key Features Implemented

1. **Preserved Luxury Design System**: Warm Ivory (`#F8F5EF`), Charcoal (`#252824`), Muted Gold (`#B69A68`), Olive Green (`#626B55`), Warm Beige (`#D8C8B4`), `Playfair Display` + `Inter` typography, and sharp `0px` architectural geometry.
2. **Complete Multi-Page Website**: Home (with explicit `Home` nav item & logo link), Services, Project Portfolio (with category & NCR corridor filters + Lightbox details), Illustrative Packages (5 configurable tiers: Individual Room Interiors through Luxury Custom Interiors), About Us, Contact Us, Free Design Consultation, Ask a Question, and Demo & Google Sheets Setup (`/demo-studio`).
3. **Bespoke Interactive Components**: Material Moodboard Matrix and Interactive Architectural Floor Plan Hotspot Viewer.
4. **Smart Multi-Step Consultation Request Form**: Captures contact details (with **optional email**), property type/location/status, interior scope & illustrative budget, and preferred consultation slot (**explicitly marked as a request, not a confirmed appointment**) with preselection when coming from Services, Portfolio, or Packages.
5. **Separate Query Management**: Dedicated "Ask a Question" desk generating unique Query IDs and routing to the `Customer Queries` tab.
6. **Zero Paid CRM / Zero Paid AI / Zero Paid WhatsApp API**: Uses Google Sheets + Google Apps Script + standard `wa.me` links (note: WhatsApp links are disabled in demo mode until `VITE_WHATSAPP_NUMBER` is configured; conversations do not automatically sync back to Google Sheets).
7. **Demonstration Safeguards**: Includes 25 synthetic NCR leads and 10 synthetic customer queries (`src/data/demoDataset.ts` and `setupDemoWorkspace()` in `Code.gs`), hides unverified addresses/phone/warranty claims unless `VITE_VERIFIED_CONTACT="true"`, and disables customer outreach in demo mode.

---

## Beginner-Friendly Google Sheets Setup Guide

### Step 1: Create Your Spreadsheet(s)
1. Go to [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet named **`Aaranya Interiors — Live CRM`**.
2. *(Recommended for client demos)* Create a **second** separate spreadsheet named **`Aaranya Interiors — Demo CRM`** so synthetic demo submissions never touch live customer data.

### Step 2: Add the Google Apps Script
1. In your Google Sheet, click **Extensions → Apps Script**.
2. Delete any placeholder code in `Code.gs` and paste the entire contents of `google-apps-script/Code.gs` from this repository.
3. Click **Save** (floppy disk icon) and name the project `Aaranya Studio Automation`.

### Step 3: Set Script Properties (Secrets)
1. In Apps Script, click **Project Settings** (gear icon on the left).
2. Scroll down to **Script Properties → Add script property** and add:
   - `WEBHOOK_SECRET`: Any strong random passphrase (e.g., `aaranya_9f8e7d6c5b4a3210_ncr`). Copy this exact value for your `.env` / Vercel settings.
   - `OWNER_EMAIL`: The studio owner's email address where new lead alerts and daily follow-up digests should arrive.

### Step 4: Initialize Tabs, Formulas, Charts & Triggers
1. Return to the **Editor** (`</>` icon) in Apps Script.
2. From the function dropdown at the top:
   - On your **Live** spreadsheet, select **`setupLiveWorkspace`** and click **Run**.
   - On your **Demo** spreadsheet, select **`setupDemoWorkspace`** and click **Run** (this automatically populates 25 synthetic leads + 10 synthetic queries + builds all Dashboard charts).
3. Grant permissions when Google asks (*Advanced → Go to Aaranya Studio Automation → Allow*).
4. *(Live sheet only)* Select **`installDailyReminderTrigger`** and click **Run** once to enable the 9:00 AM daily pending & overdue follow-up email digest.

### Step 5: Deploy as Web App
1. Click **Deploy → New deployment**.
2. Click the gear icon next to *Select type* and choose **Web app**.
3. Set:
   - **Description**: `Aaranya Lead Webhook v1`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` *(safe because `doPost` verifies `WEBHOOK_SECRET` from your server)*
4. Click **Deploy** and copy the **Web app URL** (`https://script.google.com/macros/s/.../exec`).

---

## Local Development & Testing

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env.local
# Paste APPS_SCRIPT_WEBHOOK_URL, APPS_SCRIPT_DEMO_WEBHOOK_URL, and APPS_SCRIPT_SECRET into .env.local

# 3. Start full-stack dev server (Express + Vite on port 3000)
npm run dev

# 4. Type-check and production build
npm run lint
npm run build
```

---

## GitHub & Vercel Deployment

1. Push this repository to a **private or public GitHub repository** (ensure `.env.local` is ignored—never commit secrets).
2. Import the repository in [Vercel](https://vercel.com).
3. Vercel automatically detects `vercel.json`, builds Vite into `dist/`, and deploys `/api/enquiry.ts`, `/api/query.ts`, and `/api/health.ts` as Serverless Functions.
4. In **Vercel Project Settings → Environment Variables**, add:
   - `APPS_SCRIPT_WEBHOOK_URL` — Live Web App URL
   - `APPS_SCRIPT_DEMO_WEBHOOK_URL` — *(Optional)* Separate Demo Web App URL
   - `APPS_SCRIPT_SECRET` — Must match `WEBHOOK_SECRET` in Apps Script
   - `APP_URL` — Your production domain (e.g., `https://aaranyainteriors.in`)
   - `VITE_IS_DEMO_SITE` — `"true"` shows subtle Demonstration Website banner & sample labels; `"false"` hides demo banner.
   - `VITE_DEMO_NOINDEX` — Set to `"true"` on demo deployments so search engines do not index them; `"false"` for live production.
   - `VITE_DEFAULT_DEMO_MODE` — Set to `"true"` for demo-only deployments; `"false"` for live studios.
   - `VITE_VERIFIED_CONTACT` — Set to `"true"` only after configuring `VITE_STUDIO_PHONE`, `VITE_STUDIO_PHONE_RAW`, `VITE_STUDIO_EMAIL`, and `VITE_WHATSAPP_NUMBER`.
5. Redeploy once after saving environment variables.

---

## Customizing for Future Interior Design Clients

Edit **`src/config/siteConfig.ts`** to rebrand the entire site without touching page logic:
- `business` (name, phone, WhatsApp, email, address, NCR/city service areas, social links)
- `developer` (attribution footer)
- `colors`, `services`, `portfolio`, `packages`, `materialMoodboard`, `floorPlanHotspots`, `testimonials`, and `faqs`.

---

## Troubleshooting

- **"Preview Mode — Google Sheets is not connected yet"**: `APPS_SCRIPT_WEBHOOK_URL` (or `APPS_SCRIPT_DEMO_WEBHOOK_URL` in demo mode) is empty on the server. Add it to `.env.local` (local) or Vercel Environment Variables and redeploy.
- **"Unauthorized webhook secret"**: `APPS_SCRIPT_SECRET` on Vercel/Express does not match `WEBHOOK_SECRET` in Apps Script Project Properties.
- **Changes to `Code.gs` not taking effect**: In Google Apps Script, editing code requires creating a **New version** under **Deploy → Manage deployments → Edit → Version: New version**.
- **Dashboard charts missing**: Run `rebuildDashboardOnly()` from the **Aaranya Studio CRM** menu inside Google Sheets.
