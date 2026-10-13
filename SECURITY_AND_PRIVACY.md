# WebWise — Security and Privacy

This document explains how WebWise handles data and why it is safe to hand to a child. It is deliberately specific: every claim below can be checked against the code.

## 1. Core commitment

WebWise is local-first by construction. It has **no backend, no database, no account system, no API key and no network calls**. If the network were disconnected, every feature would still work.

## 2. What WebWise reads, and what happens to it

| Data | Where it comes from | What WebWise does with it | What leaves the device |
| --- | --- | --- | --- |
| Active tab URL and title | `chrome.tabs.query` / `tabs.get` | Classifies the page and chooses which site to describe | Nothing |
| Cookie **metadata** (name, domain, path, flags, expiry) | `chrome.cookies.getAll({ url })` | Builds a value-free report for display | Nothing |
| Cookie **values** | `chrome.cookies` object | **Discarded immediately** by `toCookieRecord`; never stored, shown or sent | Nothing |
| Permission **status strings** | `navigator.permissions.query` inside the page | Mapped to Allowed / Blocked / Ask first / etc. | Nothing |
| Page content | — | **Never read.** The probe returns only a status string | Nothing |
| Safety Coach progress (opt-in only) | Your answers to invented scenarios | Stored in `chrome.storage.local` **only when "Remember my progress" is on**, so a round can be resumed | Nothing |

The only persistence is the opt-in Coach progress record. It is off by default, contains no names, no URLs and no browsing history, and is deleted the moment the toggle is switched off.

## 3. Permission minimisation

The manifest declares exactly five capabilities, each traceable to code:

- `cookies` — Cookie Detective.
- `tabs` — Overview (active tab only).
- `scripting` — Permission Guide probe.
- `storage` — the **opt-in** Safety Coach progress record, used only after the learner turns remembering on.
- `host_permissions: http://*/*, https://*/*` — required for `scripting.executeScript` to run the probe on a page.

Deliberately **absent**: `history`, `bookmarks`, `downloads`, `management`, `webRequest`, `activeTab`, and any remote host. `storage` was added only once the opt-in progress feature genuinely needed it; nothing is written unless the learner opts in.

## 4. The service-worker boundary

The popup never calls `chrome.cookies`, `chrome.tabs` or `chrome.scripting` directly. It sends a message to the background service worker, which:

1. Validates the message shape with `isWorkerRequest` (source, target, allowed type, numeric tabId, string-or-null url/hostname). Anything else is ignored.
2. **Re-derives the page context from the live tab** rather than trusting the popup's possibly-stale copy.
3. Returns only a finished report.

This means a stray message from a web page cannot make the worker perform a privileged action.

## 5. Rendering safety

- The UI is React. There is **no `dangerouslySetInnerHTML`** anywhere.
- Cookie names/domains are rendered as text, so a hostile cookie name is displayed literally and cannot inject markup.
- The favicon is loaded only from the tab's own `favIconUrl`, with an error fallback that hides it.

## 6. The permission probe is inert

The injected function:

- Is self-contained (no closures, no imports) because Chrome serialises it.
- Runs in the `ISOLATED` world by default, in the top frame only.
- Calls `navigator.permissions.query({ name })` and returns the `state` string.
- Reads no DOM, no cookies, no form data, and returns no page content.

If injection is blocked, WebWise reports every permission as **Not available** rather than guessing.

## 7. Child-safety choices

- No free-text input, no chat, no messaging.
- No personal data is requested or stored: no name, email, location, or identifier.
- Safety Coach examples are **invented and safe**. The extension never loads a malicious site, downloads a file, or asks for credentials.
- The tone never alarms. Restricted pages are explained as a safety feature of the browser, not as a fault or a threat.

## 8. Honesty as a security property

Over-claiming is a safety problem for children, because it teaches a false model of the world. WebWise therefore:

- Never says a site is "safe", "dangerous" or "trustworthy", and shows no trust score.
- Distinguishes **observed** findings from **inferred** ones, and shows **unknown** where it does not know.
- States clearly that permission *status* is not permission *use*.
- Lists, in every report, exactly what it could not inspect.
- Never fabricates a scan or a result.

## 9. Error and failure handling

- Cookie read failure → an "error" report with a plain reason and the limitations still shown.
- Permission probe blocked → all statuses "Not available" plus an explanation.
- Restricted page (`chrome://`, extension page, Web Store, `file://`) → an "unsupported" report; the privileged APIs are not even called.
- Worker unreachable → the popup shows a friendly error state instead of hanging.

## 10. Supply chain

- Runtime dependencies: React and React DOM only. Dev dependencies: TypeScript, Vite, Vitest, esbuild, jsdom and type packages.
- Package installation is not patched by the extension or its config; no custom registries are configured.
- No `postinstall` hooks are added by this project. (Note: `esbuild` ships its own native-binary installer, as it always does.)
- Icons are generated by a local script using only Node's built-in modules.

## 11. What WebWise cannot protect against

WebWise is educational. It cannot and does not claim to detect phishing, malware, spyware or tracking, and it cannot see what a site does after you grant it something. It supplements the browser's own protections and adult guidance; it does not replace them.

## 12. Reporting a concern

If you find a privacy or security issue, please open an issue on the repository describing the steps to reproduce it. Do not include real cookie values or personal data in a report.
