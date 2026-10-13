/**
 * Shared domain types for WebWise.
 *
 * A guiding rule across these types: the UI must be able to tell the
 * difference between something we *observed*, something we *inferred*, and
 * something we simply *do not know*. That distinction is encoded explicitly
 * wherever it matters (see `Evidence` and `PermissionState`).
 */

/** Where a piece of information came from. Used to avoid over-claiming. */
export type EvidenceKind = 'observed' | 'inferred' | 'unknown';

export interface Evidence {
  kind: EvidenceKind;
  /** Short, plain-language note about how confident we are and why. */
  note?: string;
}

/* -------------------------------------------------------------------------- */
/* Tabs & page context                                                        */
/* -------------------------------------------------------------------------- */

export type PageKind =
  | 'web' // a normal http(s) page we can inspect
  | 'browser-internal' // chrome://, edge://, about:, etc.
  | 'extension-page' // another extension's page, or WebWise itself
  | 'file' // file:// URLs
  | 'web-store' // Chrome Web Store (extensions may not run there)
  | 'new-tab' // chrome://newtab and friends
  | 'unsupported'; // anything else we can't reason about

export interface PageContext {
  kind: PageKind;
  /** Chrome tab id, when known. Used for scripting/tabs API calls. */
  tabId?: number;
  /** Full URL, or null when the tab has none (rare). */
  url: string | null;
  /** Hostname, e.g. "example.com". Null when unavailable. */
  hostname: string | null;
  /** Origin, e.g. "https://example.com". Null when unavailable. */
  origin: string | null;
  title: string | null;
  favIconUrl: string | null;
  /** True when the URL scheme is https. */
  isHttps: boolean;
  /** True when the URL looks like an IP address rather than a name. */
  isIpAddress: boolean;
  /** Human-friendly label used in the header. */
  label: string;
  /** Why the page is restricted, when it is. */
  restrictionReason?: string;
}

/* -------------------------------------------------------------------------- */
/* Cookies                                                                    */
/* -------------------------------------------------------------------------- */

/** A cookie as returned by chrome.cookies, with the value deliberately removed. */
export interface CookieRecord {
  name: string;
  domain: string;
  path: string;
  secure: boolean;
  httpOnly: boolean;
  sameSite: chrome.cookies.SameSiteStatus;
  session: boolean;
  /** Milliseconds since epoch, or null for a session cookie. */
  expirationDate: number | null;
  hostOnly: boolean;
  storeId: string;
  /** First- vs third-party classification relative to the inspected site. */
  party: CookieParty;
}

export type CookieParty = 'first-party' | 'third-party' | 'unknown';

export interface CookieSummary {
  total: number;
  firstParty: number;
  thirdParty: number;
  session: number;
  persistent: number;
  secure: number;
  httpOnly: number;
  /** Distinct registrable-ish domains seen among third-party cookies. */
  thirdPartyDomains: string[];
}

export interface CookieReport {
  status: 'ok' | 'unsupported' | 'error';
  /** Cookies we could read, values stripped. */
  cookies: CookieRecord[];
  summary: CookieSummary;
  /** Plain-language explanations generated from the real findings. */
  insights: CookieInsight[];
  /** Anything we could not inspect, stated honestly. */
  limitations: string[];
  message?: string;
  hostname: string | null;
}

export interface CookieInsight {
  id: string;
  /** "What we found" */
  found: string;
  /** "What it means" */
  meaning: string;
  /** "What you can do" */
  action: string;
  tone: 'neutral' | 'note' | 'good';
}

/* -------------------------------------------------------------------------- */
/* Permissions                                                                */
/* -------------------------------------------------------------------------- */

export type PermissionName =
  | 'geolocation'
  | 'camera'
  | 'microphone'
  | 'notifications'
  | 'clipboard-read'
  | 'midi';

/**
 * The state a permission is in *for the inspected site*, as far as the browser
 * will tell us. `unknown` and `unsupported` are first-class: we never guess.
 */
export type PermissionState =
  | 'granted'
  | 'denied'
  | 'prompt'
  | 'unsupported'
  | 'unknown';

export interface PermissionFinding {
  name: PermissionName;
  /** Friendly label, e.g. "Location". */
  label: string;
  state: PermissionState;
  /** What this permission lets a site do, in age-appropriate language. */
  whatItAllows: string;
  /** Why a site might legitimately ask for it. */
  whyAsk: string;
  /** Plain-language reading of the state, e.g. "Ask first". */
  stateLabel: string;
  /** Explanation of what the state does and does not tell us. */
  stateMeaning: string;
  /** How we learned this state. */
  evidence: Evidence;
}

export interface PermissionReport {
  status: 'ok' | 'unsupported' | 'error';
  origin: string | null;
  hostname: string | null;
  findings: PermissionFinding[];
  limitations: string[];
  message?: string;
}

/* -------------------------------------------------------------------------- */
/* Safety Coach                                                               */
/* -------------------------------------------------------------------------- */

export interface CoachAnswer {
  id: string;
  text: string;
  correct: boolean;
  feedback: string;
}

export type CoachCategory =
  | 'links'
  | 'downloads'
  | 'passwords'
  | 'popups'
  | 'privacy'
  | 'shopping'
  | 'social';

export interface CoachScenario {
  id: string;
  /** Topic group, used to label a scenario and to keep rounds varied. */
  category: CoachCategory;
  title: string;
  /** One-line setup. */
  intro: string;
  /** A realistic, safe example. Never a real malicious URL. */
  example: string;
  /** Optional second line, e.g. a fake message body. */
  exampleDetail?: string;
  question: string;
  answers: CoachAnswer[];
  takeaway: string;
}

/* -------------------------------------------------------------------------- */
/* Navigation                                                                 */
/* -------------------------------------------------------------------------- */

export type ViewId = 'overview' | 'cookies' | 'permissions' | 'coach' | 'learn';

/* -------------------------------------------------------------------------- */
/* Optional, opt-in progress memory                                           */
/* -------------------------------------------------------------------------- */

export interface CoachAttemptRecord {
  answerId: string;
  correct: boolean;
}

/**
 * A saved Safety Coach round. Written to chrome.storage.local ONLY when the
 * learner switches on "Remember my progress". It holds no personal data, no
 * URLs and no browsing history — just which invented scenarios were answered.
 */
export interface CoachProgress {
  version: 1;
  savedAt: number;
  roundNumber: number;
  roundId: string;
  scenarioIds: string[];
  index: number;
  attempts: Record<string, CoachAttemptRecord>;
  bestStreak: number;
}
