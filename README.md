# WebWise — Understand the web. Browse with confidence.

WebWise is a Chrome (Manifest V3) browser extension that helps children aged roughly 8–13 understand **what websites, cookies, permissions and installed extensions can actually do**. It explains real browser findings in plain, calm language instead of firing off unexplained warnings.

> [!IMPORTANT]
> Every claim WebWise makes is grounded in something it can observe. It clearly separates **what we found**, **what it means**, and **what we could not inspect**. It never labels a site "safe" or "dangerous", never shows a fake trust score, and never invents a scan result.

---

## Table of contents

- [Product overview](#product-overview)
- [Problem statement](#problem-statement)
- [Target users](#target-users)
- [Features](#features)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [Technology choices and rationale](#technology-choices-and-rationale)
- [Setup](#setup)
- [Build](#build)
- [Load the extension in Chrome](#load-the-extension-in-chrome)
- [Required permissions and why each is needed](#required-permissions-and-why-each-is-needed)
- [Privacy and security design](#privacy-and-security-design)
- [Testing](#testing)
- [Known limitations](#known-limitations)
- [Roadmap](#roadmap)
- [Hackathon notes: impact, feasibility, UX, craft](#hackathon-notes-impact-feasibility-ux-craft)
- [License](#license)

---

## Product overview

Children are handed powerful browsers with no instruction manual. A cookie is invisible, a permission pop-up is a yes/no they do not understand, and the web is full of advice that is either over-simplified or alarmist.

WebWise sits in the toolbar and answers the honest question: *"What is this page actually doing, and what should I know about it?"* It does that by reading what the browser genuinely exposes — cookie metadata for the current page, permission status for the current origin — and turning it into short, evidence-based explanations a child can act on.

The tagline captures the goal: **understand the web, browse with confidence.**

## Problem statement

Most "security" education for children teaches fear: *never click anything, everything is a scam*. That fails for three reasons.

1. **It does not transfer.** Children cannot evaluate a new situation if all they have learned is a list of scary words.
2. **It is inaccurate.** "Cookies are bad" and "just look for a padlock" are both misleading simplifications.
3. **It gives no feedback loop.** A child has no way to check their own reasoning about a real page.

WebWise takes the opposite approach: show the real evidence, explain what it does and does not mean, and let the child practise decision-making in a safe sandbox (the Safety Coach). Nothing is overstated as fact when it is only an inference, and genuine uncertainty is shown as uncertainty.

## Target users

- **Primary:** children aged approximately 8–13 who are starting to browse more independently.
- **Secondary:** parents, carers, teachers and school IT staff who want a transparent, non-scary tool they can explain.
- **Tertiary:** any curious user who wants a plain-language read of the current page's cookies and permissions.

## Features

### A. Cookie Detective — real `chrome.cookies` inspection

- Reads the cookies that **apply to the page in the active tab** via `chrome.cookies.getAll({ url })`.
- Shows real metadata: name, domain, path, expiry or session status, `Secure`, `HttpOnly`, `SameSite`, host-only scope, store id.
- Explains each attribute in plain language, including an honest HttpOnly explanation: *"That helps prevent ordinary page scripts from reading it. It does not make the cookie invulnerable to every attack."*
- Classifies first-party vs third-party by comparing registrable domains, with a clear note that this is a strong clue rather than a statement of purpose.
- Generates "what this means" insights from the **counts actually observed**, never from guesses.
- A helpful empty state when there are no accessible cookies.
- Graceful handling of restricted URLs, permission failures and unsupported contexts.
- **Cookie values are stripped before they ever leave the background worker.**

### B. Permission Guide — honest permission status

- Determines the active site's origin.
- Runs a tiny, self-contained probe with `chrome.scripting.executeScript` (ISOLATED world) that reads `navigator.permissions.query` for geolocation, camera, microphone, notifications, clipboard-read and MIDI.
- Maps each result to **Allowed / Blocked / Ask first / Not available / Unknown**.
- Distinguishes status from usage explicitly: *"This status alone does not tell us whether it has accessed your location."*
- When the probe cannot run (protected pages, blocked injection), every permission is shown as **Not available** rather than guessed, with a plain explanation.
- Each finding carries its **evidence kind** (observed / inferred / unknown) so the UI can be honest about how it knows.

### C. Safety Coach — interactive learning

- **50 scenarios** covering links and addresses, unexpected downloads, pop-ups and permission requests, fake logins, password and code requests, privacy, shopping and messages. The five original topics are always in the first round; later rounds are drawn from the wider bank.
- Scenarios are grouped into **rounds of five**. Finishing a round offers "Play another round", which builds a fresh set, preferring topics you have not just seen so consecutive rounds feel different.
- Each has a realistic but **invented, safe** example, a question, selectable answers, targeted feedback, a practical takeaway and a "try again" button.
- A contextual tip system that produces tips **only when the underlying finding is present** (third-party cookies, HttpOnly cookies, persistent cookies, granted camera/location, notification prompts).
- **Optional progress memory (opt-in).** A "Remember my progress" switch, off by default, saves the current round locally so you can close the popup and continue later. It stores only which invented scenarios you answered. Switching it off forgets everything immediately.
- A deliberate "how to judge a website" note that discourages treating every site as dangerous.

### D. Website overview

- A single dashboard for the active tab: hostname, protocol, cookie summary, permission summary, matched tips, and a clearly labelled **"what we could not inspect"** section.
- Neutral descriptions only — no "safe", "dangerous" or numeric trust scores.
- Restricted pages (browser internals, extension pages, the Web Store, local files) get a friendly explanation instead of a crash.

### E. Know the Web — broader safety skills the browser cannot check

The primary tools stay strictly evidence-based, so anything a browser genuinely
cannot observe lives here instead of being faked. "Know the Web" is an accordion
of ten real questions a child might ask — padlocks, fake addresses, strong
passwords, login codes, pop-ups, unexpected downloads, notification requests,
private information, prize scams and tracker cookies — each with a plain answer
and one concrete "try this". It is clearly labelled as general learning, never as
a finding about the current page.

### F. Extension Inspector — **documented as a future feature, not faked**

The stretch goal of listing and explaining other installed extensions is **not implemented**. Chrome's `chrome.management` API is powerful and its listing requires broad permissions; faking it or shipping a half-reliable version would violate the "every claim grounded in evidence" principle. It is documented in the [Roadmap](#roadmap) with a concrete implementation plan.

## Screenshots

> Real screenshots require a headed Chrome session, which the automated build environment here does not provide. No image has been fabricated. The exact rendered text captured from a real headless Chromium run of the built popup is reproduced below so you can see the genuine output.

**Verified rendered popup text (Overview, opened as an extension page):**

```
WebWise
Understand the web. Browse with confidence.
Refresh
Overview   Cookies   Perms   Coach   Learn
Extension page
This page is off-limits to extensions
This page belongs to a browser extension. Extensions are not allowed to
inspect each other's pages, so WebWise cannot look inside this one.
Safety Coach — Practise spotting tricks
Know the Web — Skills to learn
Want the full report?
Open a normal website — one that starts with https:// — and WebWise will show
its cookies and permissions.
Everything stays on your device — no tracking, no accounts.
```

Add your own screenshots here after a real session:

| View | Placeholder | What to capture |
| --- | --- | --- |
| Overview | `docs/screenshots/overview.png` | Hero with Pip, quick tiles and count-up stats for a real https site |
| Cookie Detective | `docs/screenshots/cookies.png` | The donut ring and an expanded cookie with attribute explanations |
| Permission Guide | `docs/screenshots/permissions.png` | Status LEDs for a granted and a prompt permission |
| Safety Coach | `docs/screenshots/coach.png` | A scenario mid-answer with the streak meter and feedback |
| Know the Web | `docs/screenshots/learn.png` | An open question in the learning accordion |
| Restricted page | `docs/screenshots/restricted.png` | The friendly `chrome://` explanation |

## Design and interaction

The interface is deliberately **not** a dark corporate security dashboard. It uses a
warm "field kit" aesthetic — cream paper with a faint dot grid, heavy ink outlines,
hard offset shadows, rounded cards and a single sunny coral accent — so it feels
tangible and friendly for an 8–13 year old without talking down to them.

- **Pip**, an original animated shield mascot, reacts to state (idle, curious, happy) and
  gives the product a face. It changes expression only from what is actually happening.
- Motion is used for feedback, not decoration: numbers count up, the cookie donut draws
  itself in, permission "status LEDs" pulse, correct answers pop and shake, the header
  refresh icon spins while a real check runs, and a confetti burst celebrates a correct
  answer.
- Chunky labelled tabs, quick-action tiles, and labelled blocks ("What we found / What it
  means / What you can do") keep the structure obvious.
- Typography is distinctive and bundled locally: **Fraunces** (display) and **Nunito**
  (body), imported from `@fontsource-variable` so the fonts ship inside `dist/` and are
  never fetched from a remote server at runtime.
- Accessibility: real `<button>`/`<nav>`/`<details>` elements, `aria-current` and
  `aria-expanded` state, keyboard focus rings, a skip link, and a full
  `prefers-reduced-motion` fallback that disables every animation.

## Architecture

```
src/
  background/            MV3 service worker — the ONLY place that calls
    index.ts             privileged chrome.* APIs (cookies, tabs, scripting)
  popup/
    App.tsx              Shell: header, nav, load orchestration, error states
    main.tsx             React entry point
    components/
      Icons.tsx          Original SVG shield mascot (Pip) + icon set
      Primitives.tsx     Card, Pill, Explainer, Stat/CountUp, Donut, Confetti, states
  features/
    cookies/
      cookieLogic.ts         Pure, testable: classification, summary, explanations
      CookieDetectiveView.tsx UI
    permissions/
      permissionLogic.ts     Pure, testable: state interpretation
      PermissionGuideView.tsx
    safety-coach/
      scenarios.ts           Scenario data + contextual tip engine
      toolkit.ts             "Know the Web" general safety content (not page-specific)
      SafetyCoachView.tsx
    overview/
      OverviewView.tsx       Unified dashboard
    learn/
      ToolkitView.tsx        "Know the Web" accordion view
  services/
    messaging.ts         Runtime-validated popup <-> worker protocol
    browserService.ts    The popup's single privileged-call entry point
  utils/
    url.ts               URL parsing, page classification, heuristics, domains
  types/
    index.ts             Shared domain types (Evidence, reports, states)
  styles/
    global.css           Design tokens + component styles
public/
  manifest.json          MV3 manifest
  icons/                 Generated PNG icons
scripts/
  make-icons.mjs         Dependency-free PNG icon generator
  build-background.mjs   esbuild bundler for the service worker
  integration-check.mjs  REAL headless-Chromium integration check
tests/                   Vitest suites (mocked chrome API + pure logic)
```

**Separation of responsibility is the core design rule.**

- The **popup never calls `chrome.cookies`/`chrome.scripting` directly.** It asks the worker for a *report*.
- The **worker validates every incoming message** with a runtime type guard (`isWorkerRequest`) before doing anything.
- **All interpretation logic is pure functions** in `cookieLogic.ts`, `permissionLogic.ts`, `scenarios.ts` and `url.ts`. That is what the unit tests exercise without needing a browser.
- Types encode the honesty rule directly: `EvidenceKind = 'observed' | 'inferred' | 'unknown'` and a `PermissionState` that includes `unsupported` and `unknown` as first-class values.

## Technology choices and rationale

| Choice | Why |
| --- | --- |
| **TypeScript (strict)** | The product's whole promise is "do not over-claim". Strict types (including `noUncheckedIndexedAccess`) turn that promise into compiler rules. |
| **Manifest V3** | Required for current Chrome; service worker model suits an on-demand inspector. |
| **React + Vite** | Component reuse across four views, fast HMR, and a build that emits a plain folder loadable via "Load unpacked". No remote code. |
| **esbuild (separate background build)** | The service worker has no HTML entry point; a one-line esbuild step keeps it a single self-contained file. |
| **Vitest** | Shares Vite config, runs pure-logic tests fast, and mocks the Chrome API cleanly. |
| **Hand-rolled SVG icons + a tiny PNG encoder** | Zero image dependencies, no remote assets, and demonstrably original artwork. |
| **No backend, no analytics, no AI APIs** | Privacy is a feature of a children's product, not an afterthought. |

## Setup

Requires **Node.js 18+** (developed on Node 24) and npm.

```bash
npm install
npm run icons   # generate the PNG icons (already committed to public/icons)
```

## Build

```bash
npm run build      # typecheck + Vite popup build + esbuild background bundle
```

Output goes to `dist/`. Other useful scripts:

```bash
npm run typecheck        # tsc --noEmit
npm test                 # Vitest unit tests
npm run test:integration # real headless-Chromium check (needs `chromium` installed)
npm run verify           # typecheck + unit tests + build
npm run dev              # Vite watch build for rapid iteration
```

## Load the extension in Chrome

1. Run `npm run build`.
2. Open `chrome://extensions`.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select the generated **`dist/`** folder (not the repository root).
5. Pin WebWise to the toolbar, open any normal `https://` website, and click the icon.

There are no build-time or run-time environment variables, so no `.env` file is needed.

## Required permissions and why each is needed

WebWise keeps its permission list deliberately short. Each one maps to a feature you can see working.

| Permission | Used by | Why it is needed | Why it is safe here |
| --- | --- | --- | --- |
| `cookies` | Cookie Detective | Read cookie **metadata** that applies to the active page. | Values are discarded immediately; nothing is stored or sent. |
| `tabs` | Overview | Identify the active tab's URL and title so we know which site to describe. | Only the active tab is queried; history is never read. |
| `scripting` | Permission Guide | Run a tiny probe in the page to read `navigator.permissions` status. | The probe is self-contained, returns only a state string, and never touches page data. |
| `storage` | Safety Coach (opt-in) | Save your Coach round locally **only when you switch "Remember my progress" on**. | Stores one small record in `chrome.storage.local`, on your device only. It holds no names, no URLs and no browsing history, and is deleted the moment you switch the toggle off. |
| `host_permissions: http://*/* , https://*/*` | Permission Guide | `scripting.executeScript` needs host access to run the probe on a page. | Access is used only to query permissions; no page content is read, stored or transmitted. |

**Deliberately not requested:** `history`, `bookmarks`, `downloads`, `management`, `webRequest`, `activeTab`, and any remote-host permission. The permission set was reduced from an initial draft once each candidate was traced to actual code.

## Privacy and security design

WebWise is built so that "we cannot leak your data" is a structural property, not a promise.

1. **No network calls.** The extension contains no `fetch`/`XMLHttpRequest` to any external host. There is no backend, no API key, no analytics, no advertising and no AI service.
2. **Local-only processing.** Every report is computed in the service worker from live browser data and then discarded.
3. **Cookie values never leave the worker.** `toCookieRecord` maps a `chrome.cookies.Cookie` to a value-free record; a unit test asserts the serialised record cannot contain the value.
4. **Untrusted input is not rendered.** The UI uses React (no `dangerouslySetInnerHTML`). All interpolated content is plain text.
5. **Message passing is validated.** The worker ignores anything that fails `isWorkerRequest`, so a stray web-page message cannot make it act.
6. **No personal data.** WebWise never asks for or stores names, emails, precise location or any identifier. The only thing it can persist is an opt-in Coach progress record, which holds nothing but which invented scenarios you answered.
7. **Minimal permissions** (see above), each documented and traceable to code.
8. **A strict CSP** (`script-src 'self'; object-src 'self'`) is declared in the manifest.
9. **Graceful failure.** Permission denial, protected pages and API errors produce honest "unsupported"/"unknown" states, never a fabricated result.
10. **Safe learning.** Safety Coach scenarios are invented; the extension never opens a malicious site, downloads a file, or asks for real credentials.

Full detail is in [`SECURITY_AND_PRIVACY.md`](./SECURITY_AND_PRIVACY.md).

## Testing

WebWise separates **fast mocked unit tests** from **real browser integration testing**, and says which is which.

### Unit tests (mocked Chrome API + pure logic)

```bash
npm test
```

Covers:

- Cookie attribute explanations, including the honest HttpOnly wording.
- Cookie first/third-party classification and the count summary.
- Permission-state interpretation, sorting, and "status ≠ usage" wording.
- URL heuristics and page classification (web / internal / extension / file / store).
- Background worker report builders against a **mocked** `chrome` API: real-metadata path, empty state, thrown-error path and restricted-page path.
- Runtime message validation.
- Safety Coach answer validation, feedback, and contextual tip generation.
- The full 50-scenario bank: unique ids, one correct answer each, three answers each, feedback and takeaway present, and no real URLs or credentials.
- Round building: round-one uses the required five, rounds never repeat a scenario or reuse the previous round's scenarios, later rounds draw from the wider bank, and only real ids are returned.
- Opt-in progress memory against a mocked `chrome.storage.local`: off by default, saves only when opted in, turning it off forgets the data, corrupt stored records are ignored, and a missing or failing storage API degrades gracefully.
- "Know the Web" toolkit content: shape, unique ids, a concrete action per topic, and a guard that it never claims a site is simply "safe".
- Empty and error states, and restricted-page handling.

### Real browser integration check

```bash
npm run build
npm run test:integration     # requires the `chromium` binary on PATH
```

This genuinely loads the built extension into headless Chromium and reports what it observes. On the machine used to develop WebWise it printed:

```
[it] service worker live at chrome-extension://.../background.js
[it] chrome.cookies.getAll returned 2 cookie(s)
[it]   - ww_session domain=127.0.0.1 httpOnly=true secure=false sameSite=lax session=true
[it]   - ww_theme   domain=127.0.0.1 httpOnly=false secure=false sameSite=strict session=false
[it] scripting probe result: {"tabId":...,"state":"prompt"}
[it] PASS: extension installed, worker running, real cookie metadata read
[it] PASS: real scripting path returned a live permission state
[it] PASS: popup UI mounted with no console errors
```

If `chromium` is not installed, that script exits non-zero with a clear message. Unit tests do not depend on it.

### What has and has not been verified in a real browser

- **Verified here:** the extension installs with no manifest errors; the MV3 service worker starts; `chrome.cookies` returns real metadata; `chrome.scripting.executeScript` returns a real permission state on a live page; the built popup mounts with no console errors.
- **Not verified here (requires a headed Chrome session):** visual rendering/screenshots, toolbar popup sizing on every OS, and real user interaction flows. Manual steps are in [`HACKATHON_DEMO.md`](./HACKATHON_DEMO.md).

## Known limitations

Honest, specific, and by design:

1. **Scope of cookies.** WebWise lists only cookies that *apply to the current page URL*. It cannot and does not enumerate every cookie in the browser.
2. **Cookie purpose.** A cookie's purpose cannot be known from its name or attributes. WebWise only explains attributes and counts; it never claims what a cookie is "for".
3. **Permission coverage.** Only permissions the Permissions API exposes to a page are checkable. Others show **Not available**, which is truthful rather than a guess.
4. **Permission status ≠ usage.** WebWise cannot see whether a site actually used a permission, only whether it is allowed to.
5. **Protected pages.** `chrome://`, extension pages, the Chrome Web Store and `file://` URLs cannot be inspected; WebWise says so plainly.
6. **Third-party detection is a domain comparison.** It is a strong signal, not a detection of embedded content.
7. **No cross-site or historical view.** There is no analysis across sites, over time, or of past permission decisions.
8. **Extension Inspector is not implemented** (see Roadmap). Nothing pretends otherwise.
9. **`clipboard-read` and `midi` status** may be unsupported in some Chrome versions and will show as **Not available**.
10. **Not a security guarantee.** WebWise supplements — never replaces — the browser's own protections and adult guidance. It cannot detect phishing, malware or tracking with certainty.

## Roadmap

- **Extension Inspector (real implementation).** Use `chrome.management.getAll()` behind an optional, explicitly-justified `management` permission, gated behind a user opt-in screen that explains the permission before it is added. Show each extension's name, version, enabled state and declared permissions, with a plain-language "what this permission could allow" guide, and an explicit "requested permissions show capability, not malice" disclaimer. Read-only: never disable, uninstall or modify anything.
- **Warning-sign walkthrough** in the Safety Coach using `analyseUrlHeuristics`, presented as "things to notice" rather than a verdict.
- **Accessibility pass**: full screen-reader testing and a high-contrast theme.
- **Localisation** of all user-facing strings.
- **Web Store polish**: privacy policy page, real screenshots, store listing copy.

## Hackathon notes: impact, feasibility, UX, craft

**Impact.** WebWise targets a real, underevacuated gap: children have powerful browsers and no honest guide. By refusing to scare and instead teaching evidence evaluation, it builds a transferable skill. The "requested permissions show capability, not malice" framing and the status-vs-usage distinction are the kinds of nuance most adult tools get wrong.

**Feasibility.** It is built and running. `npm run verify` is green, and the real-browser integration check proves the extension installs, the worker runs, and both privileged paths (cookies and scripting) return genuine data. There is no backend to operate and no API key to rotate — it is a self-contained extension.

**User experience.** A friendly security aesthetic (deep navy, soft neutrals, restrained teal), an original SVG shield identity, rounded cards, a compact four-way navigation, and consistent loading / empty / error / unsupported states. Every interpretive card uses the same "What we found / What it means / What you can do" structure so children learn to expect the evidence first.

**Technical craft.** Strict TypeScript that encodes the honesty rule; a validated popup↔worker message protocol; sole-privilege containment in the worker; pure, unit-tested interpretation logic; a dependency-free PNG icon generator; and a real headless-Chromium integration harness that checks the actual Chrome APIs rather than mocks.

## License

Released under the **MIT License**. The reasoning for the choice is documented in [`LICENSE`](./LICENSE).
