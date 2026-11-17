// Thin fetch wrapper. Sends the session cookie with every request.
import { startWaiting, stopWaiting } from '../components/wakeNotice.js';

// Normally empty: requests go to /api on this origin (Vite dev proxy locally, nginx in Docker/Render).
function resolveBaseUrl(raw) {
  if (!raw) return '';
  return /^https?:\/\//.test(raw) ? raw : `https://${raw}`;
}

const BASE_URL = resolveBaseUrl(import.meta.env.VITE_API_URL);

// Render's free plan stops the backend after about 15 minutes without traffic. Requests that
// nginx forwards to the stopped backend do NOT start it again: Render answers them at once with
// 502 and its own HTML "loading" page, and the request never reaches the app, so it is safe to
// repeat it, even a POST. Only a request sent straight from the browser to the backend starts
// it, so on such an answer wakeBackend() sends one and the request is repeated once it is up.
// A 503 that the app sends itself (JSON, e.g. busy address search) is a real answer and is not
// retried. nginx can also answer 504 and a network error can happen; the backend may still get
// those requests, so only GET/HEAD are repeated after them (a repeated POST could create a
// duplicate post).
const RETRY_DELAYS_MS = [2000, 3000, 5000, 5000, 10000, 10000, 10000, 15000]; // 60 s in total

// nginx redirects this path to the backend's own /health URL (nginx.conf.template).
const WAKE_PATH = '/wake-api';
const WAKE_TIMEOUT_MS = 90000;

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

// Starts a stopped backend: the browser follows nginx's redirect straight to the backend, and
// Render holds that request until the backend is running, so this resolves once it is up.
// The answer itself is not needed ('no-cors'). Requests waiting at the same time share one wake-up.
let waking = null;

function wakeBackend() {
  if (!waking) {
    const signal = typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(WAKE_TIMEOUT_MS) : undefined;
    waking = fetch(WAKE_PATH, { mode: 'no-cors', cache: 'no-store', signal })
      .catch(() => {}) // the retries below still run
      .finally(() => {
        waking = null;
      });
  }
  return waking;
}

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
      await Promise.all([wakeBackend(), sleep(delay)]);
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
