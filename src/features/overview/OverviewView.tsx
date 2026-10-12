import { useMemo, type ReactElement } from 'react';
import type { CookieReport, PageContext, PermissionReport, ViewId } from '../../types';
import { Card, Explainer, Pill, StateBlock, Stat } from '../../popup/components/Primitives';
import {
  IconAlert,
  IconBulb,
  IconCheck,
  IconChevronRight,
  IconCookie,
  IconInfo,
  IconKey,
  IconLock,
  IconShieldOff,
} from '../../popup/components/Icons';
import { contextualTips } from '../safety-coach/scenarios';

function statusSummary(report: CookieReport | null, loading: boolean, error: string | null): {
  tone: 'good' | 'note' | 'muted' | 'info';
  label: string;
} {
  if (loading) return { tone: 'muted', label: 'Checking…' };
  if (error) return { tone: 'note', label: 'Not available' };
  if (!report) return { tone: 'muted', label: 'Unknown' };
  if (report.status === 'unsupported') return { tone: 'muted', label: 'Not inspectable' };
  if (report.status === 'error') return { tone: 'note', label: 'Error' };
  return { tone: 'info', label: `${report.summary.total} found` };
}

function SiteHeader({ context }: { context: PageContext }): ReactElement {
  return (
    <Card>
      <div className="ww-site">
        {context.favIconUrl ? (
          <img
            className="ww-site__favicon"
            src={context.favIconUrl}
            alt=""
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
            }}
          />
        ) : (
          <div className="ww-site__favicon" aria-hidden="true" />
        )}
        <div className="ww-site__meta">
          <div className="ww-site__host">{context.label}</div>
          <div className="ww-site__url">{context.hostname ?? context.url ?? 'No address'}</div>
        </div>
        {context.kind === 'web' && (
          <Pill tone={context.isHttps ? 'good' : 'note'}>{context.isHttps ? 'https' : 'http'}</Pill>
        )}
      </div>
    </Card>
  );
}

export function OverviewView({
  context,
  cookieReport,
  permissionReport,
  cookiesLoading,
  permissionsLoading,
  cookiesError,
  permissionsError,
  onNavigate,
  onRefresh,
}: {
  context: PageContext;
  cookieReport: CookieReport | null;
  permissionReport: PermissionReport | null;
  cookiesLoading: boolean;
  permissionsLoading: boolean;
  cookiesError: string | null;
  permissionsError: string | null;
  onNavigate: (view: ViewId) => void;
  onRefresh: () => void;
}): ReactElement {
  const cookieStatus = statusSummary(cookieReport, cookiesLoading, cookiesError);

  const tips = useMemo(
    () =>
      contextualTips({
        cookieSummary:
          cookieReport && cookieReport.status === 'ok'
            ? {
                total: cookieReport.summary.total,
                httpOnly: cookieReport.summary.httpOnly,
                thirdParty: cookieReport.summary.thirdParty,
                persistent: cookieReport.summary.persistent,
              }
            : null,
        permissionFindings:
          permissionReport && permissionReport.status === 'ok'
            ? permissionReport.findings.map((f) => ({ name: f.name, state: f.state }))
            : null,
      }).slice(0, 2),
    [cookieReport, permissionReport],
  );

  // ---- Restricted page handling -----------------------------------------
  if (context.kind !== 'web') {
    return (
      <div className="ww-stack">
        <SiteHeader context={context} />
        <StateBlock
          variant="unsupported"
          icon={<IconShieldOff size={28} />}
          title="This page is off-limits to extensions — and that is a good thing"
          text={context.restrictionReason ?? 'WebWise cannot inspect this page.'}
        />
        <Card title="What you can still do">
          <div className="ww-stack">
            <p className="ww-perm__text" style={{ marginBottom: 0 }}>
              Open a normal website (one that starts with https://) and WebWise will show you its cookies and
              permissions.
            </p>
            <button type="button" className="ww-btn ww-btn--primary" onClick={() => onNavigate('coach')}>
              Try the Safety Coach instead
            </button>
          </div>
        </Card>
      </div>
    );
  }

  const granted = permissionReport?.findings.filter((f) => f.state === 'granted') ?? [];
  const promptable = permissionReport?.findings.filter((f) => f.state === 'prompt') ?? [];

  return (
    <div className="ww-stack">
      <SiteHeader context={context} />

      {/* Cookie card */}
      <Card
        title="Cookies"
        subtitle="What this site asked your browser to remember"
        icon={<IconCookie size={18} />}
        badge={<Pill tone={cookieStatus.tone}>{cookieStatus.label}</Pill>}
      >
        {cookiesLoading ? (
          <p className="ww-small ww-muted" style={{ margin: 0 }}>
            Checking cookies…
          </p>
        ) : cookiesError ? (
          <p className="ww-small" style={{ margin: 0, color: 'var(--ww-slate-600)' }}>
            {cookiesError}
          </p>
        ) : cookieReport && cookieReport.status === 'ok' ? (
          <>
            <div className="ww-stats">
              <Stat value={cookieReport.summary.total} label="Total" />
              <Stat value={cookieReport.summary.firstParty} label="First-party" />
              <Stat value={cookieReport.summary.thirdParty} label="Third-party" />
            </div>
            <div className="ww-divider" />
            <Explainer
              found={
                cookieReport.summary.total === 0
                  ? 'No accessible cookies were found for this page.'
                  : `${cookieReport.summary.total} cookie${cookieReport.summary.total === 1 ? '' : 's'} apply to this page.`
              }
              meaning={
                cookieReport.summary.httpOnly > 0
                  ? `${cookieReport.summary.httpOnly} are marked HttpOnly, which helps protect login sessions from page scripts.`
                  : 'Cookies can hold a login session, your settings, or help the site count visits. We cannot tell which from the cookie alone.'
              }
              action="Open Cookie Detective to see each cookie and what its settings mean."
            />
            <button type="button" className="ww-btn ww-btn--block" style={{ marginTop: 12 }} onClick={() => onNavigate('cookies')}>
              Open Cookie Detective
              <IconChevronRight size={14} />
            </button>
          </>
        ) : (
          <p className="ww-small ww-muted" style={{ margin: 0 }}>
            No cookie report is available right now.
          </p>
        )}
      </Card>

      {/* Permission card */}
      <Card
        title="Permissions"
        subtitle="What this site can ask to use"
        icon={<IconKey size={18} />}
        badge={
          permissionsLoading ? (
            <Pill tone="muted">Checking…</Pill>
          ) : permissionsError ? (
            <Pill tone="note">Not available</Pill>
          ) : granted.length > 0 ? (
            <Pill tone="good">{granted.length} allowed</Pill>
          ) : promptable.length > 0 ? (
            <Pill tone="neutral">{promptable.length} can ask</Pill>
          ) : (
            <Pill tone="muted">Nothing allowed</Pill>
          )
        }
      >
        {permissionsLoading ? (
          <p className="ww-small ww-muted" style={{ margin: 0 }}>
            Checking permissions…
          </p>
        ) : permissionsError ? (
          <p className="ww-small" style={{ margin: 0, color: 'var(--ww-slate-600)' }}>
            {permissionsError}
          </p>
        ) : permissionReport && permissionReport.status === 'ok' ? (
          <>
            <div className="ww-chip-row">
              {permissionReport.findings.map((f) => (
                <Pill
                  key={f.name}
                  tone={
                    f.state === 'granted'
                      ? 'good'
                      : f.state === 'prompt'
                        ? 'neutral'
                        : f.state === 'denied'
                          ? 'note'
                          : 'muted'
                  }
                >
                  {f.label}: {f.stateLabel}
                </Pill>
              ))}
            </div>
            <div className="ww-divider" />
            <Explainer
              found={
                granted.length > 0
                  ? `${granted.map((f) => f.label).join(', ')} ${granted.length === 1 ? 'is' : 'are'} allowed for this site.`
                  : 'This site has not been allowed to use anything yet.'
              }
              meaning="A permission status shows what a site is allowed to ask for. It does not prove the site has used it."
              action="Open Permission Guide to see what each permission would let the site do."
            />
            <button
              type="button"
              className="ww-btn ww-btn--block"
              style={{ marginTop: 12 }}
              onClick={() => onNavigate('permissions')}
            >
              Open Permission Guide
              <IconChevronRight size={14} />
            </button>
          </>
        ) : (
          <p className="ww-small ww-muted" style={{ margin: 0 }}>
            No permission report is available right now.
          </p>
        )}
      </Card>

      {/* Tips card */}
      <Card title="Learning tips" subtitle="Matched to what we found here" icon={<IconBulb size={18} />}>
        {tips.map((tip) => (
          <div className="ww-tip" key={tip.id}>
            <span aria-hidden="true" style={{ color: 'var(--ww-teal-600)', flexShrink: 0 }}>
              <IconInfo size={16} />
            </span>
            <div>
              <p className="ww-tip__title">{tip.title}</p>
              <p className="ww-tip__body">{tip.body}</p>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="ww-btn ww-btn--block"
          style={{ marginTop: 12 }}
          onClick={() => onNavigate('coach')}
        >
          Practise with the Safety Coach
          <IconChevronRight size={14} />
        </button>
      </Card>

      {/* What we could not inspect */}
      <Card title="What we could not inspect" icon={<IconAlert size={18} />}>
        <ul className="ww-limits">
          <li>Cookies are limited to the page you are on. WebWise cannot list every cookie in your browser.</li>
          <li>A permission status is not proof of use, and only some permissions can be checked at all.</li>
          <li>WebWise cannot see other websites, your browser settings, or your browsing history.</li>
          <li>Cookie values are hidden by design and never leave your device.</li>
        </ul>
        <div className="ww-row" style={{ marginTop: 10 }}>
          <button type="button" className="ww-linkbtn" onClick={onRefresh}>
            Run the checks again
          </button>
        </div>
      </Card>

      <div className="ww-row" style={{ justifyContent: 'center' }}>
        <Pill tone="good">
          <IconCheck size={13} /> Local only
        </Pill>
        <Pill tone="info">
          <IconLock size={13} /> No tracking
        </Pill>
      </div>
    </div>
  );
}
