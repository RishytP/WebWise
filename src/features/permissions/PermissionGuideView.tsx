import type { ReactElement } from 'react';
import type { PermissionFinding, PermissionReport, PermissionState } from '../../types';
import { Card, Limitations, LoadingCard, Pill, StateBlock } from '../../popup/components/Primitives';
import { IconAlert, IconInfo, IconKey, IconShieldOff } from '../../popup/components/Icons';

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

function PermissionRow({ finding }: { finding: PermissionFinding }): ReactElement {
  return (
    <div className="ww-perm">
      <div className="ww-perm__head">
        <span className="ww-perm__label">{finding.label}</span>
        <Pill tone={stateTone(finding.state)}>{finding.stateLabel}</Pill>
        <span style={{ marginLeft: 'auto' }}>
          <Pill tone="muted">{evidenceLabel(finding.evidence.kind)}</Pill>
        </span>
      </div>

      <p className="ww-perm__text">{finding.stateMeaning}</p>

      <details>
        <summary className="ww-linkbtn" style={{ cursor: 'pointer' }}>
          What does this permission allow?
        </summary>
        <div style={{ marginTop: 8 }}>
          <p className="ww-perm__text">{finding.whatItAllows}</p>
          <p className="ww-perm__text ww-perm__text--muted" style={{ marginBottom: 0 }}>
            <span className="ww-strong">Why a site might ask: </span>
            {finding.whyAsk}
          </p>
          {finding.evidence.note && (
            <p className="ww-perm__text ww-perm__text--muted" style={{ marginTop: 6, marginBottom: 0 }}>
              <span className="ww-strong">How we know: </span>
              {finding.evidence.note}
            </p>
          )}
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
            Permission checks only work on normal website pages. The browser blocks extensions from running on built-in
            pages and other extensions’ pages, which protects your privacy.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="ww-stack">
      <Card
        title="Permission Guide"
        subtitle={report.hostname ? `What ${report.hostname} can ask to use` : 'What this site can ask to use'}
        icon={<IconKey size={18} />}
      >
        <p className="ww-small ww-muted" style={{ margin: 0 }}>
          These are statuses for the site in your active tab. A status tells you what the site is allowed to ask for —
          it does not tell you what the site has actually done.
        </p>
      </Card>

      {report.message && (
        <StateBlock icon={<IconInfo size={24} />} title="Some checks were not available" text={report.message} />
      )}

      <div>
        {report.findings.map((f) => (
          <PermissionRow key={f.name} finding={f} />
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
          <span className="ww-strong">Blocked</span> means the site is not allowed to use it. If something on the page is
          broken, this is a good place to look.
        </p>
      </Card>

      <Limitations items={report.limitations} />
    </div>
  );
}
