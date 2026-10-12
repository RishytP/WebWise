import type { ReactElement, ReactNode } from 'react';

/** Small, reusable presentational primitives shared by every feature view. */

export function Card({
  title,
  subtitle,
  badge,
  icon,
  children,
  tone,
}: {
  title?: string;
  subtitle?: string;
  badge?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  tone?: 'default' | 'soft';
}): ReactElement {
  return (
    <section className={`ww-card${tone === 'soft' ? ' ww-card--soft' : ''}`}>
      {(title || badge) && (
        <div className="ww-card__head">
          {icon}
          <div>
            {title && <h2 className="ww-card__title">{title}</h2>}
            {subtitle && <p className="ww-card__sub">{subtitle}</p>}
          </div>
          {badge && <span className="ww-card__badge">{badge}</span>}
        </div>
      )}
      <div className="ww-card__body">{children}</div>
    </section>
  );
}

export function Pill({
  children,
  tone = 'muted',
}: {
  children: ReactNode;
  tone?: 'good' | 'note' | 'info' | 'neutral' | 'muted';
}): ReactElement {
  return <span className={`ww-pill ww-pill--${tone}`}>{children}</span>;
}

/**
 * The "What we found / What it means / What you can do" explainer block.
 * Used everywhere we present an interpretation so the three parts stay
 * visually and conceptually separate.
 */
export function Explainer({
  found,
  meaning,
  action,
}: {
  found: ReactNode;
  meaning: ReactNode;
  action?: ReactNode;
}): ReactElement {
  return (
    <div className="ww-explainer">
      <div className="ww-explainer__row">
        <span className="ww-explainer__label">What we found</span>
        <p className="ww-explainer__text">{found}</p>
      </div>
      <div className="ww-explainer__row">
        <span className="ww-explainer__label">What it means</span>
        <p className="ww-explainer__text">{meaning}</p>
      </div>
      {action && (
        <div className="ww-explainer__row">
          <span className="ww-explainer__label">What you can do</span>
          <p className="ww-explainer__text">{action}</p>
        </div>
      )}
    </div>
  );
}

export function Stat({ value, label }: { value: ReactNode; label: string }): ReactElement {
  return (
    <div className="ww-stat">
      <div className="ww-stat__value">{value}</div>
      <div className="ww-stat__label">{label}</div>
    </div>
  );
}

export function StateBlock({
  icon,
  title,
  text,
  variant = 'default',
  children,
}: {
  icon?: ReactNode;
  title: string;
  text: ReactNode;
  variant?: 'default' | 'error' | 'unsupported';
  children?: ReactNode;
}): ReactElement {
  const cls = variant === 'default' ? 'ww-state' : `ww-state ww-state--${variant}`;
  return (
    <div className={cls}>
      {icon && <div className="ww-state__icon">{icon}</div>}
      <p className="ww-state__title">{title}</p>
      <p className="ww-state__text">{text}</p>
      {children}
    </div>
  );
}

export function LoadingCard({ label }: { label: string }): ReactElement {
  return (
    <div className="ww-card">
      <div className="ww-card__body">
        <p className="ww-small ww-muted" style={{ marginBottom: 12 }}>
          {label}
        </p>
        <div className="ww-stack" aria-hidden="true">
          <div className="ww-skeleton" style={{ width: '70%' }} />
          <div className="ww-skeleton" style={{ width: '92%' }} />
          <div className="ww-skeleton" style={{ width: '55%' }} />
        </div>
      </div>
    </div>
  );
}

export function Limitations({ items, title = 'What we could not inspect' }: { items: string[]; title?: string }): ReactElement | null {
  if (items.length === 0) return null;
  return (
    <div className="ww-card">
      <div className="ww-card__head">
        <h2 className="ww-card__title">{title}</h2>
      </div>
      <div className="ww-card__body ww-card__body--tight">
        <ul className="ww-limits">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
