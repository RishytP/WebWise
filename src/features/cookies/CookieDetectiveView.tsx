import { useMemo, useState, type ReactElement } from 'react';
import type { CookieRecord, CookieReport } from '../../types';
import {
  explainCookieAttributes,
  partyLabel,
  sameSiteLabel,
} from './cookieLogic';
import { Card, Explainer, Limitations, LoadingCard, Pill, StateBlock, Stat } from '../../popup/components/Primitives';
import { IconAlert, IconCookie, IconInfo, IconLock, IconShieldOff } from '../../popup/components/Icons';

function formatExpiry(cookie: CookieRecord): string {
  if (cookie.session || cookie.expirationDate === null) return 'Session — ends when the browser closes';
  const d = new Date(cookie.expirationDate * 1000);
  if (Number.isNaN(d.getTime())) return 'Unknown expiry date';
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function CookieRow({ cookie }: { cookie: CookieRecord }): ReactElement {
  const [open, setOpen] = useState(false);
  const attrs = useMemo(() => explainCookieAttributes(cookie), [cookie]);

  return (
    <div className="ww-cookie">
      <button
        type="button"
        className="ww-cookie__summary"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="ww-cookie__name">{cookie.name}</span>
        <Pill tone={cookie.party === 'third-party' ? 'note' : 'neutral'}>{partyLabel(cookie.party)}</Pill>
        {cookie.secure && (
          <span title="Secure" aria-label="Secure cookie">
            <IconLock size={14} />
          </span>
        )}
        <span className="ww-cookie__chev" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9.5 6 6 6-6 6" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="ww-cookie__detail">
          <div className="ww-meta">
            <span className="ww-meta__k">Domain</span>
            <span className="ww-meta__v">{cookie.domain}</span>
            <span className="ww-meta__k">Path</span>
            <span className="ww-meta__v">{cookie.path}</span>
            <span className="ww-meta__k">Expires</span>
            <span className="ww-meta__v ww-meta__v--plain">{formatExpiry(cookie)}</span>
            <span className="ww-meta__k">SameSite</span>
            <span className="ww-meta__v ww-meta__v--plain">{sameSiteLabel(cookie.sameSite)}</span>
          </div>

          <div className="ww-hidden-note">
            <IconLock size={14} />
            <span>WebWise hides this cookie’s value. It is never read, shown or sent anywhere.</span>
          </div>

          <div className="ww-attr">
            {attrs.map((a) => (
              <div className="ww-attr__item" key={a.attribute}>
                <div className="ww-attr__head">
                  <span>{a.attribute}</span>
                  <Pill tone="muted">{a.state}</Pill>
                </div>
                <p className="ww-attr__body">{a.plain}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function CookieDetectiveView({
  report,
  loading,
  error,
}: {
  report: CookieReport | null;
  loading: boolean;
  error: string | null;
}): ReactElement {
  if (loading) return <LoadingCard label="Looking at cookies that apply to this page…" />;

  if (error) {
    return (
      <StateBlock
        variant="error"
        icon={<IconAlert size={28} />}
        title="We could not read cookies here"
        text={error}
      />
    );
  }

  if (!report) return <LoadingCard label="Preparing the cookie report…" />;

  if (report.status === 'unsupported') {
    return (
      <div className="ww-stack">
        <StateBlock
          variant="unsupported"
          icon={<IconShieldOff size={28} />}
          title="Cookies cannot be inspected on this page"
          text={report.message ?? 'This page type does not have website cookies for WebWise to look at.'}
        />
        <Card title="Why this happens">
          <p className="ww-small ww-muted" style={{ margin: 0 }}>
            WebWise can only inspect normal website pages that start with http:// or https://. Built-in browser pages,
            extension pages and local files are protected by the browser, and that protection keeps you safer too.
          </p>
        </Card>
      </div>
    );
  }

  const { summary } = report;

  return (
    <div className="ww-stack">
      <Card
        title="Cookie Detective"
        subtitle={`Cookies that apply to ${report.hostname ?? 'this page'}`}
        icon={<IconCookie size={18} />}
        badge={`${summary.total} found`}
      >
        <div className="ww-stats">
          <Stat value={summary.total} label="Total" />
          <Stat value={summary.firstParty} label="First-party" />
          <Stat value={summary.thirdParty} label="Third-party" />
        </div>
        <div className="ww-divider" />
        <div className="ww-chip-row">
          <Pill tone="good">{summary.secure} Secure</Pill>
          <Pill tone="info">{summary.httpOnly} HttpOnly</Pill>
          <Pill tone="muted">{summary.session} Session</Pill>
          <Pill tone="muted">{summary.persistent} Stored</Pill>
        </div>
      </Card>

      {summary.total === 0 ? (
        <StateBlock
          icon={<IconCookie size={28} />}
          title="No accessible cookies on this page"
          text="That is completely normal. Many pages set no cookies until you sign in or change a setting. It can also mean the cookies here are hidden from extensions by the browser’s security rules."
        />
      ) : (
        <div>
          <div className="ww-row ww-row--between" style={{ marginBottom: 8 }}>
            <h2 className="ww-card__title">Cookies we could read</h2>
            <span className="ww-small ww-muted">Tap one to learn what it does</span>
          </div>
          {report.cookies.map((c, i) => (
            <CookieRow key={`${c.name}-${c.domain}-${c.path}-${i}`} cookie={c} />
          ))}
        </div>
      )}

      {report.insights.length > 0 && (
        <Card title="What this means" icon={<IconInfo size={18} />}>
          <div className="ww-stack">
            {report.insights.map((insight) => (
              <div key={insight.id}>
                <Explainer found={insight.found} meaning={insight.meaning} action={insight.action} />
                <div className="ww-divider" />
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card title="First-party or third-party?" icon={<IconInfo size={18} />}>
        <p className="ww-perm__text">
          <span className="ww-strong">First-party</span> cookies are set by the site you are visiting — the name in the
          address bar. They usually handle things like staying signed in or remembering your settings.
        </p>
        <p className="ww-perm__text">
          <span className="ww-strong">Third-party</span> cookies are set by a different company whose content appears
          inside the page, such as an embedded video player or an advert. They are often used to measure or personalise
          what you see.
        </p>
        <p className="ww-perm__text ww-perm__text--muted" style={{ marginBottom: 0 }}>
          We work this out by comparing domains. That is a good clue, but it does not tell us what any single cookie is
          actually used for.
        </p>
      </Card>

      <Limitations items={report.limitations} />
    </div>
  );
}
