import type { CookieReport, PermissionReport } from '../types';

/**
 * Message protocol between the popup and the background service worker.
 *
 * Design note: the popup asks the worker for a *report*; the worker performs
 * every privileged Chrome API call. All messages are validated with a runtime
 * type guard before use, so a stray or malformed message cannot make the
 * worker do something unexpected.
 */

export const MESSAGE_SOURCE = 'webwise-popup' as const;
export const MESSAGE_TARGET = 'webwise-background' as const;

export type RequestType = 'GET_COOKIE_REPORT' | 'GET_PERMISSION_REPORT';

export interface BaseRequest {
  source: typeof MESSAGE_SOURCE;
  target: typeof MESSAGE_TARGET;
  type: RequestType;
  tabId: number;
  url: string | null;
  hostname: string | null;
}

export interface CookieReportRequest extends BaseRequest {
  type: 'GET_COOKIE_REPORT';
}

export interface PermissionReportRequest extends BaseRequest {
  type: 'GET_PERMISSION_REPORT';
}

export type WorkerRequest = CookieReportRequest | PermissionReportRequest;

export type WorkerResponse =
  | { ok: true; cookieReport: CookieReport }
  | { ok: true; permissionReport: PermissionReport }
  | { ok: false; error: string };

export function isWorkerRequest(value: unknown): value is WorkerRequest {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  if (v.source !== MESSAGE_SOURCE) return false;
  if (v.target !== MESSAGE_TARGET) return false;
  if (typeof v.type !== 'string') return false;
  if (v.type !== 'GET_COOKIE_REPORT' && v.type !== 'GET_PERMISSION_REPORT') return false;
  if (typeof v.tabId !== 'number' || !Number.isFinite(v.tabId)) return false;
  if (v.url !== null && typeof v.url !== 'string') return false;
  if (v.hostname !== null && typeof v.hostname !== 'string') return false;
  return true;
}
