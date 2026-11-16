// Thin fetch wrapper. Sends the session cookie with every request.
import { startWaiting, stopWaiting } from '../components/wakeNotice.js';

// Normally empty: requests go to /api on this origin (Vite dev proxy locally, nginx in Docker/Render).
function resolveBaseUrl(raw) {
  if (!raw) return '';
  return /^https?:\/\//.test(raw) ? raw : `https://${raw}`;
}

const BASE_URL = resolveBaseUrl(import.meta.env.VITE_API_URL);

// Render's free plan stops the backend after about 15 minutes without traffic. While it
// starts again (up to about a minute) Render answers 502/503 with its own HTML page and the
// request never reaches the app, so it is safe to repeat it, even a POST. A 503 that the app
// sends itself (JSON, e.g. busy address search) is a real answer and is not retried.
// If the start takes longer than nginx waits (nginx.conf.template), nginx answers 504, and a
// network error can happen too. The backend may still get those requests once it is up, so
// only GET/HEAD are repeated after them (repeating a POST could create a duplicate post).
const RETRY_DELAYS_MS = [2000, 3000, 5000, 5000, 10000, 10000, 10000, 15000]; // 60 s in total

// After this long the "connecting to the server" banner appears (components/wakeNotice.js).
const SLOW_REQUEST_MS = 4000;

function isJson(res) {
  return (res.headers.get('Content-Type') || '').includes('application/json');
}

// res === null means the request failed without an answer (network error).
function isBackendWakingUp(res, idempotent) {
  if (res === null) return idempotent;
  if (isJson(res)) return false;
  if (res.status === 502 || res.status === 503) return true;
  return res.status === 504 && idempotent;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class ApiError extends Error {
  constructor(status, message, body) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export async function request(path, { method = 'GET', body, query } = {}) {
  const url = new URL(`${BASE_URL}/api${path}`, window.location.origin);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
    });
  }

  const options = {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  };

  const idempotent = method === 'GET' || method === 'HEAD';
  const send = async () => {
    try {
      return await fetch(url, options);
    } catch (err) {
      if (!idempotent) throw err;
      return null;
    }
  };

  let slow = false;
  const slowTimer = setTimeout(() => {
    slow = true;
    startWaiting();
  }, SLOW_REQUEST_MS);

  let res;
  try {
    res = await send();
    for (const delay of RETRY_DELAYS_MS) {
      if (!isBackendWakingUp(res, idempotent)) break;
      await sleep(delay);
      res = await send();
    }
  } finally {
    clearTimeout(slowTimer);
    if (slow) stopWaiting();
  }

  if (res === null) {
    throw new ApiError(0, 'Could not reach the server. Check your connection and try again.', null);
  }

  const data = res.status === 204 ? null : await res.json().catch(() => null);

  // NF-005: never treat a failed save as success
  if (!res.ok) {
    throw new ApiError(res.status, data?.error || res.statusText, data);
  }
  return data;
}
