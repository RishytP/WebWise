# WebWise — Two-Minute Demo Script

This script runs in a predictable order and shows **real** features on **real** data. It never presents mock data as a live result. Read the bracketed stage directions; say the quoted lines.

**Before you start (do this once):**

```bash
npm install
npm run build
```

Then in Chrome: `chrome://extensions` → enable **Developer mode** → **Load unpacked** → choose the **`dist/`** folder → pin WebWise.

Open a normal `https://` site you are happy to show on screen (a news site or a shop works well). Pick one that has been logged into or that sets a few cookies, so Cookie Detective has something to show.

---

## 0:00 — 0:15 · The problem

[Show the browser with the WebWise icon pinned.]

> "We hand kids a browser with no manual. A cookie is invisible, a permission pop-up is a yes-or-no they don't understand, and most safety advice just says 'never click anything.' That teaches fear, not judgement."

## 0:15 — 0:35 · Open the Overview

[Click the WebWise icon. The Overview appears.]

> "This is WebWise. It reads what the browser *actually* exposes for the page I'm on, and explains it. Notice it never says 'safe' or 'dangerous' — there's no trust score. Everything here is evidence."

[Point at the hostname, the https pill, the cookie summary and the permission summary.]

## 0:35 — 1:00 · Cookie Detective

[Click **Cookies**. Expand one cookie, ideally an HttpOnly session cookie.]

> "These are the real cookies that apply to this page — pulled straight from Chrome. Look at HttpOnly: *'That helps prevent ordinary page scripts from reading it. It does not make the cookie invulnerable to every attack.'* Honest, not scary."

[Point at the value note.]

> "And notice: WebWise never shows the cookie's value. It literally strips it out before it's ever displayed."

## 1:00 — 1:20 · Permission Guide

[Click **Permissions**.]

> "Permissions next. For this site, Location is 'Ask first'. Read the small print: *'This status alone does not tell us whether it has accessed your location.'* That distinction — allowed versus actually used — is something most tools get wrong."

[Scroll to a 'Not available' row if there is one.]

> "And where the browser won't tell us, WebWise says 'Not available' instead of guessing."

## 1:20 — 1:45 · Safety Coach

[Click **Coach**. Answer one scenario wrong on purpose, then read the feedback.]

> "Now the part that builds judgement. Realistic situations — a look-alike web address, a file that downloads itself, a request for a verification code. I'll pick the risky answer on purpose... see how it explains *why* that was unsafe and reveals the safer choice."

[Hover the tip card.]

> "The tips underneath aren't generic — they match what we actually found on this page."

[Click **Try this one again**.]

> "And you can retry. This is practice, not a test."

## 1:45 — 2:00 · Privacy and close

[Point at the 'Local only / No tracking' pills at the bottom of the Overview.]

> "Everything runs on your device. No backend, no analytics, no accounts. WebWise isn't a security shield — it's a teacher. Understand the web, browse with confidence."

---

## Backup beat: a restricted page (if you have five spare seconds)

[Navigate to `chrome://extensions`, reopen WebWise.]

> "Try it on a browser-internal page and it doesn't crash or guess — it explains that Chrome blocks extensions here *on purpose*, and that's a good thing."

---

## Integrity rules for this demo

- Do **not** describe any value on screen as a "scan result". It is a live report of what Chrome exposes.
- Do **not** invent numbers. If a site has zero cookies, that is fine — use the empty state as a talking point.
- Do **not** claim WebWise blocks or detects threats. It explains; it does not defend.
- If something fails on stage (a blocked probe, an empty report), show the honest state. That is the product's whole point.
