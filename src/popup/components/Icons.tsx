import type { ReactElement, SVGProps } from 'react';

/**
 * Original WebWise identity and icon set, drawn as inline SVG so there are no
 * remote assets and no icon-font dependency. All icons share a 24x24 viewBox
 * and inherit `currentColor`.
 */

export function ShieldLogo({ size = 26 }: { size?: number }): ReactElement {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-label="WebWise shield logo"
      focusable="false"
    >
      <defs>
        <linearGradient id="ww-shield-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2bb8b0" />
          <stop offset="100%" stopColor="#0e788c" />
        </linearGradient>
      </defs>
      <path
        d="M16 2.5 27.5 6.4v8.9c0 6.3-4.6 11.9-11.5 14.2C9.1 27.2 4.5 21.6 4.5 15.3V6.4L16 2.5Z"
        fill="url(#ww-shield-grad)"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="0.9"
      />
      <path
        d="M10.4 16.1l3.6 3.5 7.6-7.8"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 18, ...rest }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.9,
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
