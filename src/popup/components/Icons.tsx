import type { ReactElement, SVGProps } from 'react';

/**
 * Original WebWise identity, mascot and icon set, drawn as inline SVG so there
 * are no remote assets and no icon-font dependency.
 *
 * "Pip" is the WebWise shield mascot. Mood changes its eyes and mouth only, so
 * it stays recognisably the same character across the app.
 */

/* -------------------------------------------------------------------------- */
/* Mascot — Pip                                                               */
/* -------------------------------------------------------------------------- */

export type PipMood = 'idle' | 'happy' | 'curious' | 'think';

export function Pip({
  size = 56,
  mood = 'idle',
  className,
}: {
  size?: number;
  mood?: PipMood;
  className?: string;
}): ReactElement {
  // Pupil offsets per mood give Pip a bit of life without extra art.
  const pupil = {
    idle: { x: 0, y: 0 },
    happy: { x: 0, y: -1 },
    curious: { x: 1.6, y: 0 },
    think: { x: -1.4, y: -1.6 },
  }[mood];

  const mouth =
    mood === 'happy'
      ? 'M23 38 Q32 47 41 38'
      : mood === 'curious'
        ? 'M26 40 Q32 43 38 40'
        : mood === 'think'
          ? 'M25 40 Q32 38 39 40'
          : 'M24 39 Q32 45 40 39';

  return (
    <span className={`ww-mascot ww-mascot--${mood}${className ? ' ' + className : ''}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        role="img"
        aria-label="Pip, the WebWise shield mascot"
        focusable="false"
      >
        <defs>
          <linearGradient id="ww-pip-body" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="#ff7a5c" />
            <stop offset="55%" stopColor="#ff5a3c" />
            <stop offset="100%" stopColor="#d83a1e" />
          </linearGradient>
        </defs>

        <ellipse cx="32" cy="58" rx="16" ry="3.4" fill="rgba(34,30,27,0.18)" />

        <path
          d="M32 4 56 11.6v17.2c0 12.6-9.3 23.7-24 28.2C17.3 52.5 8 41.4 8 28.8V11.6L32 4Z"
          fill="url(#ww-pip-body)"
          stroke="#221e1b"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />

        <path
          d="M32 12 47 16.7v11.9c0 8.4-6 15.8-15 18.9-9-3.1-15-10.5-15-18.9V16.7L32 12Z"
          fill="#fff8ec"
          stroke="#221e1b"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        <ellipse cx="25" cy="31" rx="4.2" ry="4.6" fill="#221e1b" />
        <ellipse cx="39" cy="31" rx="4.2" ry="4.6" fill="#221e1b" />
        <circle className="ww-mascot__pupil" cx={25 + pupil.x} cy={30 + pupil.y} r="1.7" fill="#fff8ec" />
        <circle className="ww-mascot__pupil" cx={39 + pupil.x} cy={30 + pupil.y} r="1.7" fill="#fff8ec" />

        <ellipse cx="19" cy="37" rx="3.4" ry="2.3" fill="#ff9d84" opacity="0.75" />
        <ellipse cx="45" cy="37" rx="3.4" ry="2.3" fill="#ff9d84" opacity="0.75" />

        <path d={mouth} fill="none" stroke="#221e1b" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/** Compact brand mark for the header (shield + check, no face). */
export function ShieldLogo({ size = 28 }: { size?: number }): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-label="WebWise shield logo"
      focusable="false"
    >
      <path
        d="M16 2.5 28 6.6v9.1c0 6.5-4.7 12.2-12 14.6C8.7 27.9 4 22.2 4 15.7V6.6L16 2.5Z"
        fill="#ff5a3c"
        stroke="#fff8ec"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M10.4 16.1l3.6 3.5 7.6-7.8"
        fill="none"
        stroke="#fff8ec"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* UI icons                                                                   */
/* -------------------------------------------------------------------------- */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 18, ...rest }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: 'false' as const,
    ...rest,
  };
}

export const IconHome = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 11.2 12 4l8 7.2" />
    <path d="M6 10.4V20h12v-9.6" />
    <path d="M10 20v-5h4v5" />
  </svg>
);

export const IconCookie = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3.5a8.5 8.5 0 1 0 8.4 9.8 3.4 3.4 0 0 1-4.1-4 3.4 3.4 0 0 1-4.3-4.3A8.6 8.6 0 0 0 12 3.5Z" />
    <circle cx="9" cy="11" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="12.5" cy="15.5" r="0.9" fill="currentColor" stroke="none" />
    <circle cx="8.2" cy="15.8" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const IconKey = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="8.5" cy="8.5" r="4.2" />
    <path d="M11.5 11.5 20 20" />
    <path d="M16.5 16.5 18.5 14.5" />
    <path d="M18.8 18.8 20.6 17" />
  </svg>
);

export const IconCompass = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m14.8 9.2-1.9 5.1-5.1 1.9 1.9-5.1 5.1-1.9Z" />
  </svg>
);

export const IconBook = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 5.5h6a3 3 0 0 1 2 1 3 3 0 0 1 2-1h6v13h-6a3 3 0 0 0-2 1 3 3 0 0 0-2-1H4v-13Z" />
    <path d="M12 6.5v13" />
  </svg>
);

export const IconLock = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="5" y="10.5" width="14" height="9" rx="2" />
    <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
  </svg>
);

export const IconInfo = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5" />
    <circle cx="12" cy="8" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const IconAlert = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 4.5 21 19.5H3L12 4.5Z" />
    <path d="M12 10v4" />
    <circle cx="12" cy="16.6" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const IconCheck = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m8.5 12.3 2.4 2.4 4.6-4.9" />
  </svg>
);

export const IconChevronRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m9.5 6 6 6-6 6" />
  </svg>
);

export const IconChevronDown = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m6 9.5 6 6 6-6" />
  </svg>
);

export const IconRefresh = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M19 12a7 7 0 1 1-2.1-5" />
    <path d="M19.5 4v3.5H16" />
  </svg>
);

export const IconBulb = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9.5 17.5h5" />
    <path d="M10 20.5h4" />
    <path d="M12 3.5a5.5 5.5 0 0 0-3.2 9.9c.5.4.7 1 .7 1.6v.5h5v-.5c0-.6.2-1.2.7-1.6A5.5 5.5 0 0 0 12 3.5Z" />
  </svg>
);

export const IconShieldOff = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3.5 20 6.3v5.4c0 4.3-3.2 8.1-8 9.8-4.8-1.7-8-5.5-8-9.8V6.3L12 3.5Z" />
    <path d="M5 5 19 19" />
  </svg>
);

export const IconPuzzle = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M10 4.5a1.8 1.8 0 0 1 3.6 0V6h2.9a1 1 0 0 1 1 1v2.9h1.5a1.8 1.8 0 0 1 0 3.6h-1.5V17a1 1 0 0 1-1 1h-2.9v-1.5a1.8 1.8 0 0 0-3.6 0V18H6.6a1 1 0 0 1-1-1v-2.9H4.1a1.8 1.8 0 0 1 0-3.6h1.5V7a1 1 0 0 1 1-1H10V4.5Z" />
  </svg>
);

export const IconStar = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m12 4 2.5 5.1 5.6.8-4 4 .9 5.6L12 16.9 7 19.5l.9-5.6-4-4 5.6-.8L12 4Z" />
  </svg>
);

export const IconSparkle = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9 12 3.5Z" />
    <path d="M19 4v2.4M17.8 5.2h2.4" />
  </svg>
);

export const IconBell = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5" />
    <path d="M5 16.5h14" />
    <path d="M10.5 19.5a1.6 1.6 0 0 0 3 0" />
  </svg>
);

export const IconDownload = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 4v10" />
    <path d="m8 10.5 4 4 4-4" />
    <path d="M5 19h14" />
  </svg>
);

export const IconLink = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9.5 14.5 14.5 9.5" />
    <path d="M8 16.5 6.4 18a3 3 0 0 1-4.2-4.2L4 12" />
    <path d="M16 7.5 17.6 6a3 3 0 0 1 4.2 4.2L20 12" />
  </svg>
);

export const IconGlobe = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.6 12h16.8" />
    <path d="M12 3.5c2.3 2.3 3.5 5.4 3.5 8.5S14.3 18.2 12 20.5c-2.3-2.3-3.5-5.4-3.5-8.5S9.7 5.8 12 3.5Z" />
  </svg>
);

export const IconEye = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" />
    <circle cx="12" cy="12" r="2.6" />
  </svg>
);

export const IconTrash = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 7h14" />
    <path d="M9.5 7V5h5v2" />
    <path d="M7 7v11.5a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7" />
    <path d="M10.5 10.5v5M13.5 10.5v5" />
  </svg>
);

export const IconWifi = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 9.5a12 12 0 0 1 16 0" />
    <path d="M7 13a8 8 0 0 1 10 0" />
    <path d="M10 16.4a4 4 0 0 1 4 0" />
    <circle cx="12" cy="19.2" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const IconUser = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8.5" r="3.7" />
    <path d="M5 20c0-3.5 3.1-5.5 7-5.5s7 2 7 5.5" />
  </svg>
);

export const IconPlay = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M8 5.5 18 12 8 18.5v-13Z" />
  </svg>
);

export const IconFlag = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 20V4" />
    <path d="M6 4.5h11l-2 4 2 4H6" />
  </svg>
);
