import type { ReactElement } from 'react';
import type { PermissionFinding, PermissionReport, PermissionState } from '../../types';
import { Card, Limitations, LoadingCard, Pill, StateBlock } from '../../popup/components/Primitives';
import {
  Pip,
  IconAlert,
  IconBell,
  IconEye,
  IconGlobe,
  IconInfo,
  IconKey,
  IconPlay,
  IconShieldOff,
  IconUser,
  IconWifi,
} from '../../popup/components/Icons';

function stateTone(state: PermissionState): 'good' | 'note' | 'neutral' | 'muted' {
  switch (state) {
    case 'granted':
      return 'good';
    case 'prompt':
      return 'neutral';
    case 'denied':
      return 'note';
    default:
      return 'muted';
  }
}

function evidenceLabel(kind: PermissionFinding['evidence']['kind']): string {
  switch (kind) {
    case 'observed':
      return 'Observed';
    case 'inferred':
      return 'Inferred';
    default:
      return 'Unknown';
  }
}

function PermissionIcon({ name }: { name: PermissionFinding['name'] }): ReactElement {
  const size = 20;
  switch (name) {
    case 'geolocation':
      return <IconGlobe size={size} />;
    case 'camera':
      return <IconEye size={size} />;
    case 'microphone':
      return <IconUser size={size} />;
    case 'notifications':
      return <IconBell size={size} />;
    case 'clipboard-read':
      return <IconPlay size={size} />;
    case 'midi':
      return <IconWifi size={size} />;
    default:
      return <IconKey size={size} />;
  }
}

function PermissionRow({ finding, index }: { finding: PermissionFinding; index: number }): ReactElement {
  return (
    <div className={`ww-perm ww-perm--${finding.state}`} style={{ animationDelay: `${index * 45}ms` }}>
      <div className="ww-perm__head">
        <span className={`ww-perm__led ww-perm__led--${finding.state}`} aria-hidden="true" />
        <span style={{ display: 'grid', flex: 'none' }}>
          <PermissionIcon name={finding.name} />
        </span>
        <span className="ww-perm__label">{finding.label}</span>
        <Pill tone={stateTone(finding.state)}>{finding.stateLabel}</Pill>
      </div>

      <p className="ww-perm__text">{finding.stateMeaning}</p>

      <details className="ww-perm__details">
        <summary>What does this permission allow?</summary>
        <div style={{ marginTop: 8 }}>
          <p className="ww-perm__text">{finding.whatItAllows}</p>
          <p className="ww-perm__text ww-perm__text--muted" style={{ marginBottom: 0 }}>
            <span className="ww-strong">Why a site might ask: </span>
            {finding.whyAsk}
          </p>
          <div className="ww-row" style={{ marginTop: 8 }}>
            <Pill tone="muted">{evidenceLabel(finding.evidence.kind)}</Pill>
            {finding.evidence.note && (
              <span className="ww-small ww-muted">{finding.evidence.note}</span>
            )}
          </div>
        </div>
      </details>
    </div>
  );
}

export function PermissionGuideView({
  report,
  loading,
  error,
}: {
  report: PermissionReport | null;
  loading: boolean;
  error: string | null;
}): ReactElement {
  if (loading) return <LoadingCard label="Checking which permissions this site can ask for…" />;

  if (error) {
    return (
      <StateBlock
        variant="error"
        icon={<IconAlert size={28} />}
        title="We could not check permissions here"
        text={error}
      />
    );
  }

  if (!report) return <LoadingCard label="Preparing the permission guide…" />;

  if (report.status === 'unsupported') {
    return (
      <div className="ww-stack">
        <StateBlock
          variant="unsupported"
          icon={<IconShieldOff size={28} />}
          title="Permissions cannot be checked on this page"
          text={report.message ?? 'This page type has no website permissions to check.'}
        />
        <Card title="Why this happens">
          <p className="ww-small ww-muted" style={{ margin: 0 }}>
            Permission checks only work on normal website pages. The browser blocks extensions from running on
            built-in pages and other extensions’ pages, which protects your privacy.
          </p>
        </Card>
      </div>
    );
  }

  const granted = report.findings.filter((f) => f.state === 'granted').length;
  const promptable = report.findings.filter((f) => f.state === 'prompt').length;

  return (
    <div className="ww-stack">
      <div className="ww-hero">
        <Pip size={50} mood="curious" />
        <div className="ww-hero__text">
          <h1 className="ww-hero__host" style={{ fontSize: 19 }}>
            Permission Guide
          </h1>
          <p className="ww-small ww-muted" style={{ margin: '4px 0 0' }}>
            What {report.hostname ?? 'this site'} can ask to use
          </p>
        </div>
      </div>

      <Card icon={<IconKey size={18} />}>
        <div className="ww-chip-row">
          <Pill tone="good">{granted} allowed</Pill>
          <Pill tone="neutral">{promptable} can ask</Pill>
          <Pill tone="muted">{report.findings.length} checked</Pill>
        </div>
        <p className="ww-small ww-muted" style={{ margin: 0 }}>
          A status tells you what the site is allowed to ask for — it does not tell you what the site has actually done.
        </p>
      </Card>

      {report.message && (
        <StateBlock icon={<IconInfo size={24} />} title="Some checks were not available" text={report.message} />
      )}

      <div className="ww-stack" style={{ gap: 10 }}>
        {report.findings.map((f, i) => (
          <PermissionRow key={f.name} finding={f} index={i} />
        ))}
      </div>

      <Card title="Status is not the same as use" icon={<IconInfo size={18} />}>
        <p className="ww-perm__text">
          <span className="ww-strong">Allowed</span> means the site may use something if it needs to. It does not prove
          the site has used it, or when.
        </p>
        <p className="ww-perm__text">
          <span className="ww-strong">Ask first</span> means the site is allowed to show you a permission pop-up. It may
          never do so.
        </p>
        <p className="ww-perm__text" style={{ marginBottom: 0 }}>
          <span className="ww-strong">Blocked</span> means the site is not allowed to use it. If something on the page
          is broken, this is a good place to look.
        </p>
      </Card>

      <Limitations items={report.limitations} />
    </div>
  );
}
