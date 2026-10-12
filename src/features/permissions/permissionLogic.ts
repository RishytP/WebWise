import type { Evidence, PermissionFinding, PermissionName, PermissionState } from '../../types';

/**
 * Permission metadata: what each permission allows, and why a site might ask.
 * Written for a 8–13 year old reader, without dumbing down the meaning.
 */
export interface PermissionDefinition {
  name: PermissionName;
  label: string;
  whatItAllows: string;
  whyAsk: string;
}

export const PERMISSION_DEFINITIONS: PermissionDefinition[] = [
  {
    name: 'geolocation',
    label: 'Location',
    whatItAllows: 'Lets the site work out roughly where you are, using Wi-Fi, mobile data or GPS.',
    whyAsk: 'Map and weather sites ask so they can show your area without you typing it in.',
  },
  {
    name: 'camera',
    label: 'Camera',
    whatItAllows: 'Lets the site see through your device’s camera while you allow it.',
    whyAsk: 'Video calls, scanning a QR code, or taking a profile photo.',
  },
  {
    name: 'microphone',
    label: 'Microphone',
    whatItAllows: 'Lets the site hear through your device’s microphone while you allow it.',
    whyAsk: 'Voice chat, recording a message, or talking to a voice assistant.',
  },
  {
    name: 'notifications',
    label: 'Notifications',
    whatItAllows: 'Lets the site send pop-up messages to your device, even when the site is closed.',
    whyAsk: 'News sites and chat apps ask so they can alert you to something new.',
  },
  {
    name: 'clipboard-read',
    label: 'Clipboard reading',
    whatItAllows: 'Lets the site read what you have copied, such as text you copied a moment ago.',
    whyAsk: 'Rarely needed — for example a site that helps you paste a long code. Ask why before allowing it.',
  },
  {
    name: 'midi',
    label: 'Music devices (MIDI)',
    whatItAllows: 'Lets the site talk to connected musical instruments or controllers.',
    whyAsk: 'Only music-making tools normally need this.',
  },
];

export function definitionFor(name: PermissionName): PermissionDefinition {
  const def = PERMISSION_DEFINITIONS.find((d) => d.name === name);
  if (!def) {
    // Defensive: keeps the type total without inventing capability text.
    return { name, label: name, whatItAllows: 'Unknown capability.', whyAsk: 'Unknown.' };
  }
  return def;
}

/**
 * Interpret a raw `navigator.permissions.query` result for one permission.
 * `raw` is the state string the browser returned, or null if the query failed.
 */
export function interpretPermission(
  name: PermissionName,
  raw: PermissionState | string | null,
  supported: boolean,
): PermissionFinding {
  const def = definitionFor(name);

  let state: PermissionState;
  let evidence: Evidence;

  if (!supported) {
    state = 'unsupported';
    evidence = {
      kind: 'unknown',
      note: 'This browser does not let a page or extension check this permission’s status.',
    };
  } else if (raw === 'granted' || raw === 'denied' || raw === 'prompt') {
    state = raw;
    evidence = {
      kind: 'observed',
      note: 'Reported directly by the browser for this website’s address.',
    };
  } else {
    state = 'unknown';
    evidence = {
      kind: 'unknown',
      note: 'The browser did not return a status we recognise.',
    };
  }

  return {
    name,
    label: def.label,
    state,
    whatItAllows: def.whatItAllows,
    whyAsk: def.whyAsk,
    stateLabel: stateLabelFor(state),
    stateMeaning: stateMeaningFor(state, def.label),
    evidence,
  };
}

export function stateLabelFor(state: PermissionState): string {
  switch (state) {
    case 'granted':
      return 'Allowed';
    case 'denied':
      return 'Blocked';
    case 'prompt':
      return 'Ask first';
    case 'unsupported':
      return 'Not available';
    case 'unknown':
      return 'Unknown';
  }
}

export function stateMeaningFor(state: PermissionState, label: string): string {
  switch (state) {
    case 'granted':
      return `This website is allowed to use ${label.toLowerCase()}. This status only tells us permission was given — it does not tell us whether the site has actually used it, or when.`;
    case 'denied':
      return `This website is blocked from using ${label.toLowerCase()}. If something on the site is not working, this could be why.`;
    case 'prompt':
      return `This website may ask to use ${label.toLowerCase()}, but you have not decided yet. This status alone does not tell us whether it has asked before, or whether it has accessed it.`;
    case 'unsupported':
      return `We cannot check the ${label.toLowerCase()} setting here. That is a limit of what the browser exposes, not a sign that anything is wrong.`;
    case 'unknown':
      return `The browser did not give us a clear answer about ${label.toLowerCase()}. We would rather say "unknown" than guess.`;
  }
}

/** Sort findings so the most decision-relevant states appear first. */
const STATE_ORDER: Record<PermissionState, number> = {
  granted: 0,
  prompt: 1,
  denied: 2,
  unknown: 3,
  unsupported: 4,
};

export function sortFindings(findings: PermissionFinding[]): PermissionFinding[] {
  return [...findings].sort((a, b) => STATE_ORDER[a.state] - STATE_ORDER[b.state]);
}

export function permissionLimitations(): string[] {
  return [
    'A permission status is not the same as usage. "Allowed" means the site may ask to use it; it does not prove the site did.',
    'WebWise only checks the site currently in your active tab. It cannot see permissions you granted to other websites.',
    'The browser only lets us read status for some permissions. Camera, microphone and location are usually checkable; many others are not.',
    'WebWise cannot read your browser’s global settings or see which sites you have allowed in the past.',
  ];
}
