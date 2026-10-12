# WebWise — Project Overview

**One line:** a privacy-first Chrome extension that explains the cookies and permissions behind the page you are on, in language a child aged 8–13 can use.

**Tagline:** Understand the web. Browse with confidence.

## The idea in three sentences

Children browse with powerful tools and almost no honest instruction. Most safety advice teaches fear ("never click anything"), which does not transfer to new situations. WebWise instead shows the real evidence the browser exposes, explains what it does and does not mean, and lets the child practise judging situations safely.

## What it does (all real, all local)

| View | What it shows | Data source |
| --- | --- | --- |
| **Overview** | Hostname, protocol, cookie summary, permission summary, matched tips, and what could not be inspected | Recomputed from the two reports below |
| **Cookie Detective** | Cookies that apply to the current page, with attribute explanations and first/third-party classification | `chrome.cookies.getAll({ url })` |
| **Permission Guide** | Location, camera, microphone, notifications and more, as Allowed / Blocked / Ask first / Not available / Unknown | `navigator.permissions` via a `chrome.scripting.executeScript` probe |
| **Safety Coach** | Five interactive scenarios plus tips matched to real findings | Local content, no network |

## What it deliberately does not do

- No "safe"/"dangerous" label and no trust score.
- No claim to see every cookie, every permission or every browsing act.
- No network requests, no analytics, no accounts, no AI APIs.
- No automatic deletion of cookies or changes to your sessions.

## How it is built

- **TypeScript** throughout, in strict mode, with types that encode honest reporting (`'observed' | 'inferred' | 'unknown'`, and `unsupported`/`unknown` permission states).
- **Manifest V3** extension, React + Vite popup, esbuild-bundled service worker.
- **The service worker is the only component that touches privileged Chrome APIs.** The popup asks it for a *report* over a runtime-validated message channel.
- **All interpretation logic is pure functions**, which is why the tests can prove behaviour without a browser.
- **Zero runtime dependencies beyond React**, and no remotely hosted code.

## Verified status

- `npm run typecheck` — passes.
- `npm test` — 83 tests pass across 7 suites.
- `npm run build` — produces a loadable `dist/` folder.
- `npm run test:integration` — loads the real extension into headless Chromium and confirms the worker starts, `chrome.cookies` returns real metadata, `chrome.scripting` returns a live permission state, and the popup mounts with no console errors.

See `README.md` for full detail and `KNOWN LIMITATIONS` inside it for the honest gaps.
