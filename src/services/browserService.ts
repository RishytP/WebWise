import type { CookieReport, PageContext, PermissionReport } from '../types';
import {
  MESSAGE_SOURCE,
  MESSAGE_TARGET,
  type WorkerResponse,
} from './messaging';

/**
 * The popup's single entry point for talking to the background worker.
 * Every privileged call goes through here so the popup itself stays free of
 * broad Chrome API usage.
 */

function send<T extends WorkerResponse>(message: Record<string, unknown>): Promise<T> {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage(message, (response: T) => {
        const err = chrome.runtime.lastError;
        if (err) {
          reject(new Error(err.message ?? 'The extension background service did not respond.'));
          return;
        }
        if (!response) {
          reject(new Error('The extension background service returned no response.'));
          return;
        }
        resolve(response);
      });
    } catch (e) {
      reject(e instanceof Error ? e : new Error(String(e)));
    }
  });
}

export async function requestCookieReport(tabId: number, context: PageContext): Promise<CookieReport> {
  const res = await send<WorkerResponse>({
    source: MESSAGE_SOURCE,
    target: MESSAGE_TARGET,
    type: 'GET_COOKIE_REPORT',
    tabId,
    url: context.url,
    hostname: context.hostname,
  });
  if (res.ok && 'cookieReport' in res) return res.cookieReport;
  if (!res.ok) throw new Error(res.error);
  throw new Error('Unexpected response type for cookie report.');
}

export async function requestPermissionReport(tabId: number, context: PageContext): Promise<PermissionReport> {
  const res = await send<WorkerResponse>({
    source: MESSAGE_SOURCE,
    target: MESSAGE_TARGET,
    type: 'GET_PERMISSION_REPORT',
    tabId,
    url: context.url,
    hostname: context.hostname,
  });
  if (res.ok && 'permissionReport' in res) return res.permissionReport;
  if (!res.ok) throw new Error(res.error);
  throw new Error('Unexpected response type for permission report.');
}
