import { useCallback, useEffect, useState, type ReactElement } from 'react';
import type { CookieReport, PageContext, PermissionReport, ViewId } from '../types';
import { buildPageContext } from '../utils/url';
import { requestCookieReport, requestPermissionReport } from '../services/browserService';
import { OverviewView } from '../features/overview/OverviewView';
import { CookieDetectiveView } from '../features/cookies/CookieDetectiveView';
import { PermissionGuideView } from '../features/permissions/PermissionGuideView';
import { SafetyCoachView } from '../features/safety-coach/SafetyCoachView';
import { ToolkitView } from '../features/learn/ToolkitView';
import { ShieldLogo, IconHome, IconCookie, IconKey, IconCompass, IconBook, IconRefresh } from './components/Icons';

const NAV: { id: ViewId; label: string; icon: ReactElement }[] = [
  { id: 'overview', label: 'Overview', icon: <IconHome size={18} /> },
  { id: 'cookies', label: 'Cookies', icon: <IconCookie size={18} /> },
  { id: 'permissions', label: 'Perms', icon: <IconKey size={18} /> },
  { id: 'coach', label: 'Coach', icon: <IconCompass size={18} /> },
  { id: 'learn', label: 'Learn', icon: <IconBook size={18} /> },
];

interface LoadState {
  context: PageContext | null;
  cookieReport: CookieReport | null;
  permissionReport: PermissionReport | null;
  cookiesLoading: boolean;
  permissionsLoading: boolean;
  cookiesError: string | null;
  permissionsError: string | null;
}

export function App(): ReactElement {
  const [view, setView] = useState<ViewId>('overview');
  const [state, setState] = useState<LoadState>({
    context: null,
    cookieReport: null,
    permissionReport: null,
    cookiesLoading: true,
    permissionsLoading: true,
    cookiesError: null,
    permissionsError: null,
  });

  const load = useCallback(async () => {
    setState((s) => ({
      ...s,
      cookiesLoading: true,
      permissionsLoading: true,
      cookiesError: null,
      permissionsError: null,
    }));

    let tab: chrome.tabs.Tab | undefined;
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      tab = tabs[0];
    } catch {
      tab = undefined;
    }

    const context = buildPageContext(tab?.url ?? null, tab?.title ?? null, tab?.favIconUrl ?? null);
    const tabId = tab?.id;

    setState((s) => ({ ...s, context }));

    if (context.kind !== 'web' || tabId === undefined) {
      setState((s) => ({
        ...s,
        cookieReport: null,
        permissionReport: null,
        cookiesLoading: false,
        permissionsLoading: false,
      }));
      return;
    }

    const [cookieResult, permissionResult] = await Promise.allSettled([
      requestCookieReport(tabId, context),
      requestPermissionReport(tabId, context),
    ]);

    setState((s) => ({
      ...s,
      cookieReport: cookieResult.status === 'fulfilled' ? cookieResult.value : null,
      permissionReport: permissionResult.status === 'fulfilled' ? permissionResult.value : null,
      cookiesLoading: false,
      permissionsLoading: false,
      cookiesError: cookieResult.status === 'rejected' ? toMessage(cookieResult.reason) : null,
      permissionsError:
        permissionResult.status === 'rejected' ? toMessage(permissionResult.reason) : null,
    }));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const context = state.context;
  const busy = state.cookiesLoading || state.permissionsLoading;

  return (
    <div className="ww-app">
      <a className="ww-skip" href="#ww-content">
        Skip to content
      </a>

      <header className="ww-header">
        <div className="ww-header__brand">
          <ShieldLogo size={30} />
        </div>
        <div className="ww-header__titles">
          <div className="ww-header__name">WebWise</div>
          <div className="ww-header__tagline">Understand the web. Browse with confidence.</div>
        </div>
        <button
          type="button"
          className={`ww-header__refresh${busy ? ' ww-header__refresh--spin' : ''}`}
          onClick={() => void load()}
          disabled={busy}
          aria-label="Run the checks again"
        >
          <IconRefresh size={13} />
          {busy ? 'Checking' : 'Refresh'}
        </button>
      </header>

      <nav className="ww-nav" aria-label="WebWise sections">
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            className="ww-nav__item"
            aria-current={view === item.id ? 'true' : undefined}
            onClick={() => setView(item.id)}
          >
            {item.icon}
            <span className="ww-nav__label">{item.label}</span>
          </button>
        ))}
      </nav>

      <main className="ww-main" id="ww-content" tabIndex={-1} key={view}>
        {view === 'learn' ? (
          <ToolkitView />
        ) : !context ? (
          <div className="ww-stack">
            <div className="ww-skeleton" style={{ height: 20, width: '60%' }} />
            <div className="ww-skeleton" style={{ height: 96 }} />
            <div className="ww-skeleton" style={{ height: 96 }} />
          </div>
        ) : view === 'overview' ? (
          <OverviewView
            context={context}
            cookieReport={state.cookieReport}
            permissionReport={state.permissionReport}
            cookiesLoading={state.cookiesLoading}
            permissionsLoading={state.permissionsLoading}
            cookiesError={state.cookiesError}
            permissionsError={state.permissionsError}
            onNavigate={setView}
            onRefresh={() => void load()}
          />
        ) : view === 'cookies' ? (
          <CookieDetectiveView
            report={state.cookieReport}
            loading={state.cookiesLoading}
            error={state.cookiesError}
          />
        ) : view === 'permissions' ? (
          <PermissionGuideView
            report={state.permissionReport}
            loading={state.permissionsLoading}
            error={state.permissionsError}
          />
        ) : (
          <SafetyCoachView
            context={context}
            cookieReport={state.cookieReport}
            permissionReport={state.permissionReport}
          />
        )}
      </main>

      <footer className="ww-footnote" style={{ padding: '8px 16px 12px' }}>
        Everything stays on your device — no tracking, no accounts.
      </footer>
    </div>
  );
}

function toMessage(reason: unknown): string {
  if (reason instanceof Error) return reason.message;
  if (typeof reason === 'string') return reason;
  return 'Something unexpected went wrong.';
}
