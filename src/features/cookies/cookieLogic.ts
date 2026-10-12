import type {
  CookieInsight,
  CookieParty,
  CookieRecord,
  CookieSummary,
} from '../../types';
import { registrableDomain } from '../../utils/url';

/**
 * Plain-language guide for the cookie attributes WebWise can observe.
 * Kept as data so the UI and the tests read from one source of truth.
 */
export const COOKIE_ATTRIBUTE_GUIDE = {
  secure: {
    label: 'Secure',
    on: 'This cookie is only sent over an encrypted (https) connection, so it is harder for someone on the same network to read it.',
    off: 'This cookie can be sent over an unencrypted connection, which is easier for others to see on a shared network.',
  },
  httpOnly: {
    label: 'HttpOnly',
    on: 'This cookie is marked HttpOnly. That helps prevent ordinary page scripts from reading it. It does not make the cookie invulnerable to every attack.',
    off: 'Ordinary page scripts can read this cookie, so anything running on the page could potentially see it.',
  },
  session: {
    label: 'Session',
    on: 'This is a session cookie. It disappears when you close the browser, so it is usually used for things that only matter while you are browsing.',
    off: 'This is a stored (persistent) cookie. It has an expiry date and can stay on your device after you close the browser.',
  },
  sameSite: {
    label: 'SameSite',
    strict: 'SameSite=Strict means the cookie is only sent for requests that start from this same site. This is the most private setting.',
    lax: 'SameSite=Lax means the cookie is sent for normal navigation to this site but not for most requests coming from other sites. This is a common, balanced setting.',
    none: 'SameSite=None means the cookie can be sent when other sites load content from this one. It is often used for embedded content, and browsers usually require it to be Secure too.',
    unspecified: 'This cookie does not declare a SameSite value, so the browser applies its own default. We cannot tell you the exact behaviour from here.',
  },
} as const;

/** Map a raw chrome.cookies.Cookie to our value-free record. Never keeps the value. */
export function toCookieRecord(cookie: chrome.cookies.Cookie, hostname: string | null): CookieRecord {
  return {
    name: cookie.name,
    domain: cookie.domain,
    path: cookie.path,
    secure: cookie.secure,
    httpOnly: cookie.httpOnly,
    sameSite: cookie.sameSite,
    session: cookie.session,
    expirationDate: typeof cookie.expirationDate === 'number' ? cookie.expirationDate : null,
    hostOnly: cookie.hostOnly,
    storeId: cookie.storeId,
    party: classifyParty(cookie.domain, hostname),
  };
}

/**
 * Classify a cookie as first- or third-party relative to the inspected site.
 *
 * We compare *registrable domains* (the part you actually register), so a
 * cookie for `.example.com` is first-party on `news.example.com`. This is a
 * deliberate, documented simplification: we do not attempt to guess whether
 * embedded third-party content is present, because the cookies API cannot tell
 * us that from the page URL alone.
 */
export function classifyParty(cookieDomain: string, hostname: string | null): CookieParty {
  if (!hostname) return 'unknown';
  const site = registrableDomain(hostname);
  const cookie = registrableDomain(cookieDomain);
  if (!cookie) return 'unknown';
  return cookie === site ? 'first-party' : 'third-party';
}

export function summariseCookies(cookies: CookieRecord[]): CookieSummary {
  const thirdPartyDomains = new Set<string>();
  let firstParty = 0;
  let thirdParty = 0;
  let session = 0;
  let secure = 0;
  let httpOnly = 0;

  for (const c of cookies) {
    if (c.party === 'third-party') {
      thirdParty++;
      thirdPartyDomains.add(registrableDomain(c.domain));
    } else {
      firstParty++;
    }
    if (c.session) session++;
    if (c.secure) secure++;
    if (c.httpOnly) httpOnly++;
  }

  return {
    total: cookies.length,
    firstParty,
    thirdParty,
    session,
    persistent: cookies.length - session,
    secure,
    httpOnly,
    thirdPartyDomains: [...thirdPartyDomains].sort(),
  };
}

export interface AttributeExplanation {
  attribute: string;
  state: string;
  plain: string;
}

/** Explain the attributes of one cookie in simple language. */
export function explainCookieAttributes(cookie: CookieRecord): AttributeExplanation[] {
  const out: AttributeExplanation[] = [];

  out.push({
    attribute: 'Secure',
    state: cookie.secure ? 'On' : 'Off',
    plain: cookie.secure ? COOKIE_ATTRIBUTE_GUIDE.secure.on : COOKIE_ATTRIBUTE_GUIDE.secure.off,
  });

  out.push({
    attribute: 'HttpOnly',
    state: cookie.httpOnly ? 'On' : 'Off',
    plain: cookie.httpOnly ? COOKIE_ATTRIBUTE_GUIDE.httpOnly.on : COOKIE_ATTRIBUTE_GUIDE.httpOnly.off,
  });

  out.push({
    attribute: 'Lifetime',
    state: cookie.session ? 'Session' : 'Stored',
    plain: cookie.session ? COOKIE_ATTRIBUTE_GUIDE.session.on : COOKIE_ATTRIBUTE_GUIDE.session.off,
  });

  out.push({
    attribute: 'SameSite',
    state: sameSiteLabel(cookie.sameSite),
    plain: sameSiteExplanation(cookie.sameSite),
  });

  out.push({
    attribute: 'Applies to',
    state: cookie.hostOnly ? 'This exact host' : 'This host and its subdomains',
    plain: cookie.hostOnly
      ? 'This cookie was set for one exact hostname, so it is not shared with subdomains.'
      : 'This cookie was set with a domain, so it is also sent to subdomains of that domain.',
  });

  return out;
}

export function sameSiteLabel(status: chrome.cookies.SameSiteStatus): string {
  switch (status) {
    case 'no_restriction':
      return 'None';
    case 'lax':
      return 'Lax';
    case 'strict':
      return 'Strict';
    default:
      return 'Not stated';
  }
}

export function sameSiteExplanation(status: chrome.cookies.SameSiteStatus): string {
  switch (status) {
    case 'no_restriction':
      return COOKIE_ATTRIBUTE_GUIDE.sameSite.none;
    case 'lax':
      return COOKIE_ATTRIBUTE_GUIDE.sameSite.lax;
    case 'strict':
      return COOKIE_ATTRIBUTE_GUIDE.sameSite.strict;
    default:
      return COOKIE_ATTRIBUTE_GUIDE.sameSite.unspecified;
  }
}

/** Short, factual label for the party of a cookie. */
export function partyLabel(party: CookieParty): string {
  switch (party) {
    case 'first-party':
      return 'First-party';
    case 'third-party':
      return 'Third-party';
    default:
      return 'Unclear';
  }
}

/**
 * Turn a real cookie summary into educational insights.
 * Every string here is derived from counts we actually observed.
 */
export function buildCookieInsights(summary: CookieSummary, hostname: string | null): CookieInsight[] {
  const insights: CookieInsight[] = [];
  const site = hostname ?? 'this site';

  if (summary.total === 0) {
    return insights;
  }

  insights.push({
    id: 'purpose',
    found: `${site} has ${summary.total} cookie${summary.total === 1 ? '' : 's'} that apply to this page.`,
    meaning:
      'Cookies are small notes a site asks your browser to keep. They can hold a login session, remember settings like dark mode, or help count visits. We cannot tell which of those a cookie is for just by looking at it — a name like "sid" is a hint, not proof.',
    action: 'Nothing needs fixing here. This is just so you know they exist.',
    tone: 'neutral',
  });

  if (summary.httpOnly > 0) {
    insights.push({
      id: 'httponly',
      found: `${summary.httpOnly} of these cookie${summary.httpOnly === 1 ? ' is' : 's are'} marked HttpOnly.`,
      meaning:
        'HttpOnly is a protective setting. It stops ordinary scripts running on the page from reading that cookie, which makes stealing a login session harder. It is not a magic shield — it only blocks one specific way of reading it.',
      action: 'A site using HttpOnly for session cookies is usually being careful. Good sign.',
      tone: 'good',
    });
  }

  if (summary.session > 0 && summary.persistent > 0) {
    insights.push({
      id: 'lifetime',
      found: `${summary.session} disappear when you close the browser, and ${summary.persistent} have an expiry date.`,
      meaning:
        'Session cookies tidy themselves up when you close the browser. Stored cookies can stay for days or years, which is normal for "keep me signed in" or remembering your language choice.',
      action: 'If you use a shared or school computer, close the browser fully when you finish.',
      tone: 'neutral',
    });
  } else if (summary.persistent > 0 && summary.session === 0) {
    insights.push({
      id: 'lifetime',
      found: 'All of these cookies have an expiry date, so they can stay after you close the browser.',
      meaning:
        'Stored cookies are normal and often useful, but they last longer, so more of what you did here can be remembered.',
      action: 'On a shared computer, sign out of accounts you used when you are finished.',
      tone: 'note',
    });
  }

  if (summary.thirdParty > 0) {
    insights.push({
      id: 'third-party',
      found: `${summary.thirdParty} cookie${summary.thirdParty === 1 ? '' : 's'} come from a different domain than ${site}.`,
      meaning:
        'A cookie set by a domain other than the site you are on is called a third-party cookie. These are often used to measure or personalise content that other companies provide inside the page.',
      action: 'You can limit third-party cookies in your browser settings without breaking most sites.',
      tone: 'note',
    });
  } else {
    insights.push({
      id: 'first-party',
      found: 'Every cookie we could read belongs to this site’s own domain.',
      meaning:
        'That means these cookies are first-party: they are sent back to the same site that set them, not to some other company.',
      action: 'This is the simpler, tidier kind of cookie setup.',
      tone: 'good',
    });
  }

  return insights;
}

/** Limitations we always disclose, regardless of what we found. */
export function cookieLimitations(): string[] {
  return [
    'WebWise only asks for cookies that apply to the page you are on. It does not, and cannot, list every cookie stored anywhere in your browser.',
    'Cookie values are deliberately hidden. WebWise never reads out a cookie’s contents and never sends cookies anywhere.',
    'WebWise cannot know what a cookie is really used for. A friendly or scary-looking name proves nothing on its own.',
    'Cookies marked HttpOnly are visible to extensions, but the browser hides them from page scripts by design. That is why some sites show fewer cookies than you might expect.',
  ];
}
