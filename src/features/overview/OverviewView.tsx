import { useMemo, type ReactElement } from 'react';
import type { CookieReport, PageContext, PermissionReport, ViewId } from '../../types';
import { Card, Explainer, Pill, StateBlock, Stat } from '../../popup/components/Primitives';
import {
  Pip,
  IconAlert,
  IconBulb,
  IconCheck,
  IconChevronRight,
  IconCookie,
  IconInfo,
  IconKey,
  IconLock,
  IconBook,
  IconCompass,
} from '../../popup/components/Icons';
import { contextualTips } from '../safety-coach/scenarios';

function SiteHero({ context }: { context: PageContext }): ReactElement {
  return (
    <div className="ww-hero">
      <Pip size={58} mood={context.kind === 'web' ? 'idle' : 'think'} />
      <div className="ww-hero__text">
        <div className="ww-hero__host">{context.label}</div>
        <div className="ww-hero__meta">
          {context.kind === 'web' && (
            <Pill tone={context.isHttps ? 'good' : 'note'}>{context.isHttps ? 'https padlock' : 'no padlock'}</Pill>
          )}
          {context.isIpAddress && <Pill tone="note">number address</Pill>}
          <Pill tone="muted">{context.hostname ?? context.url ?? 'no address'}</Pill>
        </div>
      </div>
    </div>
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
        <SiteHero context={context} />
        <StateBlock
          variant="unsupported"
          icon={<Pip size={44} mood="think" />}
          title="This page is off-limits to extensions"
          text={context.restrictionReason ?? 'WebWise cannot inspect this page.'}
        />
        <div className="ww-tiles">
          <button type="button" className="ww-tile ww-tile--coral" onClick={() => onNavigate('coach')}>
            <span className="ww-tile__icon">
              <IconCompass size={20} />
            </span>
            <span className="ww-tile__title">Safety Coach</span>
            <span className="ww-tile__sub">Practise spotting tricks</span>
          </button>
          <button type="button" className="ww-tile ww-tile--green" onClick={() => onNavigate('learn')}>
            <span className="ww-tile__icon">
              <IconBook size={20} />
            </span>
            <span className="ww-tile__title">Know the Web</span>
            <span className="ww-tile__sub">Skills to learn</span>
          </button>
        </div>
        <Card title="Want the full report?">
          <p className="ww-perm__text" style={{ marginBottom: 0 }}>
            Open a normal website — one that starts with <span className="ww-strong">https://</span> — and WebWise
            will show its cookies and permissions.
          </p>
        </Card>
      </div>
    );
  }

  const granted = permissionReport?.findings.filter((f) => f.state === 'granted') ?? [];
  const cookiesOk = cookieReport?.status === 'ok';
  const permsOk = permissionReport?.status === 'ok';

  const cookieCountLabel = cookiesLoading
    ? 'checking'
    : cookiesError
      ? 'not available'
      : cookiesOk
        ? `${cookieReport.summary.total} found`
        : 'unknown';
  const permCountLabel = permissionsLoading
    ? 'checking'
    : permissionsError
      ? 'not available'
      : permsOk
        ? granted.length > 0
          ? `${granted.length} allowed`
          : 'none allowed'
        : 'unknown';

  return (
    <div className="ww-stack">
      <SiteHero context={context} />

      {/* Quick tiles */}
      <div className="ww-tiles">
        <button type="button" className="ww-tile ww-tile--teal" onClick={() => onNavigate('cookies')}>
          <span className="ww-tile__icon">
            <IconCookie size={20} />
          </span>
          <span className="ww-tile__title">Cookie Detective</span>
          <span className="ww-tile__sub">See what this site remembers</span>
          <span className="ww-tile__count">{cookieCountLabel}</span>
        </button>
        <button type="button" className="ww-tile ww-tile--blue" onClick={() => onNavigate('permissions')}>
          <span className="ww-tile__icon">
            <IconKey size={20} />
          </span>
          <span className="ww-tile__title">Permission Guide</span>
          <span className="ww-tile__sub">What it can ask to use</span>
          <span className="ww-tile__count">{permCountLabel}</span>
        </button>
        <button type="button" className="ww-tile ww-tile--coral" onClick={() => onNavigate('coach')}>
          <span className="ww-tile__icon">
            <IconCompass size={20} />
          </span>
          <span className="ww-tile__title">Safety Coach</span>
          <span className="ww-tile__sub">5 quick challenges</span>
        </button>
        <button type="button" className="ww-tile ww-tile--green" onClick={() => onNavigate('learn')}>
          <span className="ww-tile__icon">
            <IconBook size={20} />
          </span>
          <span className="ww-tile__title">Know the Web</span>
          <span className="ww-tile__sub">Skills a browser can't check</span>
        </button>
      </div>

      {/* Cookie summary */}
      <Card
        title="Cookies"
        subtitle="What this site asked your browser to remember"
        icon={<IconCookie size={18} />}
        delay={60}
      >
        {cookiesLoading ? (
          <p className="ww-small ww-muted" style={{ margin: 0 }}>
            Checking cookies…
          </p>
        ) : cookiesError ? (
          <p className="ww-small" style={{ margin: 0 }}>
            {cookiesError}
          </p>
        ) : cookiesOk ? (
          <>
            <div className="ww-stats">
              <Stat value={cookieReport.summary.total} label="Total" tone="teal" />
              <Stat value={cookieReport.summary.firstParty} label="First-party" tone="green" />
              <Stat value={cookieReport.summary.thirdParty} label="Third-party" tone="coral" />
            </div>
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
            <button
              type="button"
              className="ww-btn ww-btn--block"
              onClick={() => onNavigate('cookies')}
            >
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

      {/* Permission summary */}
      <Card
        title="Permissions"
        subtitle="What this site can ask to use"
        icon={<IconKey size={18} />}
        delay={120}
      >
        {permissionsLoading ? (
          <p className="ww-small ww-muted" style={{ margin: 0 }}>
            Checking permissions…
          </p>
        ) : permissionsError ? (
          <p className="ww-small" style={{ margin: 0 }}>
            {permissionsError}
          </p>
        ) : permsOk ? (
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

      {/* Tips */}
      {tips.length > 0 && (
        <Card title="Learning tips" subtitle="Matched to what we found here" icon={<IconBulb size={18} />} delay={180}>
          {tips.map((tip) => (
            <div className="ww-tip" key={tip.id}>
              <span aria-hidden="true" style={{ color: 'var(--ww-coral)', flexShrink: 0 }}>
                <IconInfo size={16} />
              </span>
              <div>
                <p className="ww-tip__title">{tip.title}</p>
                <p className="ww-tip__body">{tip.body}</p>
              </div>
            </div>
          ))}
          <button type="button" className="ww-btn ww-btn--block" onClick={() => onNavigate('coach')}>
            Practise with the Safety Coach
            <IconChevronRight size={14} />
          </button>
        </Card>
      )}

      <Card title="What we could not inspect" icon={<IconAlert size={18} />} delay={240}>
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
