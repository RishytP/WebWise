# AGENTS.md — WebWise repository notes

Persistent context for agents working in this repository. Keep it short and current.

## What this is

WebWise is a Manifest V3 Chrome extension (TypeScript + React + Vite) that explains
cookies and permissions for the active tab to children aged ~8–13. Privacy-first:
no backend, no analytics, no network calls, no API keys.

## Commands

```bash
npm install
npm run icons            # regenerate public/icons/*.png (dependency-free script)
npm run typecheck        # tsc --noEmit
npm test                 # Vitest unit tests (mocked chrome API + pure logic)
npm run build            # typecheck + vite (popup) + esbuild (service worker) -> dist/
npm run test:integration # REAL headless Chromium check; needs `chromium` on PATH
npm run verify           # typecheck + test + build
```

Load `dist/` via chrome://extensions -> Developer mode -> Load unpacked.

## Architecture rules (do not violate)

1. **The service worker (`src/background/index.ts`) is the only place that calls
   privileged Chrome APIs** (`chrome.cookies`, `chrome.tabs`, `chrome.scripting`).
   The popup asks it for a *report* over `chrome.runtime.sendMessage`.
2. **Every worker message is validated** by `isWorkerRequest` in
   `src/services/messaging.ts`. Never trust popup-supplied page context — the
   worker re-derives it from the live tab.
3. **Interpretation logic is pure and lives in `*.ts` logic modules**, separate
   from the `*View.tsx` components. Tests target the logic modules.
4. **Cookie values are stripped** in `toCookieRecord`. Never add a `value` field
   to `CookieRecord`; a unit test asserts the serialised record has no value.
5. Honesty rule: never output "safe"/"dangerous"/trust scores; always distinguish
   observed vs inferred vs unknown; always list what could not be inspected.
6. **General safety knowledge that no browser API can observe lives in
   `src/features/safety-coach/toolkit.ts`** ("Know the Web" view), never in the
   cookie/permission pipeline. Keep page-specific reporting strictly evidence-based.

## Design system

- Aesthetic: warm "field kit" — cream paper, ink outlines, hard offset shadows,
  a single coral accent. Tokens are all in `src/styles/global.css` (`--ww-*`).
- Fonts (Fraunces + Nunito) come from `@fontsource-variable` and are bundled into
  `dist/assets/`; never load fonts from a remote URL.
- Add motion for feedback only, and always keep the `prefers-reduced-motion`
  block at the bottom of `global.css` intact.

## Conventions

- Strict TypeScript. `noUncheckedIndexedAccess` is on, so index access yields
  `T | undefined`. Prefer explicit handling over non-null assertions.
- `verbatimModuleSyntax` is on: use `import type { ... }` for type-only imports.
- No `any` without a documented reason.
- Keep the manifest permission list minimal; if you add a permission, document it
  in `README.md` and `SECURITY_AND_PRIVACY.md` and justify it in a comment.

## Testing split (be honest about it)

- `tests/*.test.ts` — fast unit tests. `tests/background.test.ts` installs a
  **mocked** `chrome` global; it proves control flow, not Chrome's behaviour.
- `scripts/integration-check.mjs` — loads the real built extension into headless
  Chromium and calls the real APIs. Only run/report this if `chromium` exists.

Do not claim a browser verification you did not run.
