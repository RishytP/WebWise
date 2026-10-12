import { useEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';

/** Reusable presentational + interactive primitives shared by every view. */

export function Card({
  title,
  subtitle,
  badge,
  icon,
  children,
  delay,
}: {
  title?: string;
  subtitle?: string;
  badge?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  /** Stagger the entrance animation (ms). */
  delay?: number;
}): ReactElement {
  return (
    <section className="ww-card" style={delay ? { animationDelay: `${delay}ms` } : undefined}>
      {(title || badge) && (
        <div className="ww-card__head">
          {icon}
          <div style={{ flex: 1, minWidth: 0 }}>
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
  tone = 'default',
}: {
  found: ReactNode;
  meaning: ReactNode;
  action?: ReactNode;
  tone?: 'default' | 'good' | 'note';
}): ReactElement {
  return (
    <div className={`ww-explainer${tone === 'default' ? '' : ` ww-explainer--${tone}`}`}>
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

/* -------------------------------------------------------------------------- */
/* Animated number                                                            */
/* -------------------------------------------------------------------------- */

/** Counts up to `value` on mount for a lively, tangible feel. */
export function CountUp({ value, duration = 650 }: { value: number; duration?: number }): ReactElement {
  const [shown, setShown] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || value <= 0) {
      setShown(value);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(eased * value));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, [value, duration]);

  return <>{shown}</>;
}

export function Stat({
  value,
  label,
  tone = 'teal',
  animate = true,
}: {
  value: number;
  label: string;
  tone?: 'teal' | 'coral' | 'blue' | 'green' | 'sun';
  animate?: boolean;
}): ReactElement {
  return (
    <div className={`ww-stat ww-stat--${tone}`}>
      <div className="ww-stat__value">{animate ? <CountUp value={value} /> : value}</div>
      <div className="ww-stat__label">{label}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Donut ring                                                                 */
/* -------------------------------------------------------------------------- */

export interface RingSlice {
  label: string;
  value: number;
  color: string;
}

/**
 * A compact SVG donut built from stroke dashes. `animation` draws each arc in
 * with a CSS transition triggered on mount.
 */
export function Donut({
  slices,
  centerValue,
  centerCaption,
  size = 104,
}: {
  slices: RingSlice[];
  centerValue: ReactNode;
  centerCaption: string;
  size?: number;
}): ReactElement {
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const total = slices.reduce((sum, s) => sum + s.value, 0) || 1;
  const stroke = 14;
  const r = 50 - stroke / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="ww-ring" style={{ ['--ww-ring-size' as string]: `${size}px` }}>
      <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#f3e8d2" strokeWidth={stroke} />
        {slices
          .filter((s) => s.value > 0)
          .map((s) => {
            const frac = s.value / total;
            const dash = drawn ? frac * c : 0;
            const el = (
              <circle
                key={s.label}
                cx="50"
                cy="50"
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${c - dash}`}
                strokeDashoffset={-offset * c}
                transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dasharray 0.9s cubic-bezier(0.22,1,0.36,1)' }}
              />
            );
            offset += frac;
            return el;
          })}
      </svg>
      <div className="ww-ring__hole">
        <div>
          <div className="ww-ring__value">{centerValue}</div>
          <div className="ww-ring__cap">{centerCaption}</div>
        </div>
      </div>
    </div>
  );
}

export function Legend({ slices }: { slices: RingSlice[] }): ReactElement {
  return (
    <div className="ww-legend">
      {slices.map((s) => (
        <div className="ww-legend__row" key={s.label}>
          <span className="ww-legend__swatch" style={{ background: s.color }} />
          <span style={{ flex: 1 }}>{s.label}</span>
          <span className="ww-strong">{s.value}</span>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Confetti                                                                   */
/* -------------------------------------------------------------------------- */

const CONFETTI_COLORS = ['#ff5a3c', '#ffc53d', '#0fa3a3', '#7c6bf0', '#12a150', '#2f6fd0'];

/** A one-shot confetti burst, positioned over the nearest positioned ancestor. */
export function Confetti({ seed }: { seed: number }): ReactElement {
  const bits = Array.from({ length: 18 }, (_, i) => {
    const angle = (i / 18) * Math.PI * 2 + (seed % 7) * 0.3;
    const dist = 70 + ((i * 37 + seed * 13) % 90);
    const dx = Math.round(Math.cos(angle) * dist);
    const dy = Math.round(Math.sin(angle) * dist + 40);
    return {
      dx: `${dx}px`,
      dy: `${dy}px`,
      rot: `${((i * 53) % 360) - 180}deg`,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: `${(i % 6) * 18}ms`,
    };
  });
  return (
    <div className="ww-confetti" aria-hidden="true" key={seed}>
      {bits.map((b, i) => (
        <span
          key={i}
          className="ww-confetti__bit"
          style={{
            background: b.color,
            animationDelay: b.delay,
            ['--dx' as string]: b.dx,
            ['--dy' as string]: b.dy,
            ['--rot' as string]: b.rot,
          }}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* States                                                                     */
/* -------------------------------------------------------------------------- */

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
          <div className="ww-skeleton" style={{ width: '70%', height: 14 }} />
          <div className="ww-skeleton" style={{ width: '92%', height: 14 }} />
          <div className="ww-skeleton" style={{ width: '55%', height: 14 }} />
        </div>
      </div>
    </div>
  );
}

export function Limitations({
  items,
  title = 'What we could not inspect',
}: {
  items: string[];
  title?: string;
}): ReactElement | null {
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
