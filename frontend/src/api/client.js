// Thin fetch wrapper. Sends the session cookie with every request.

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
const RETRY_DELAYS_MS = [2000, 3000, 5000, 5000, 10000, 10000, 10000, 15000]; // 60 s in total

function isBackendWakingUp(res) {
  if (res.status !== 502 && res.status !== 503) return false;
  const contentType = res.headers.get('Content-Type') || '';
  return !contentType.includes('application/json');
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

  let res = await fetch(url, options);
  for (const delay of RETRY_DELAYS_MS) {
    if (!isBackendWakingUp(res)) break;
    await sleep(delay);
    res = await fetch(url, options);
  }

  const data = res.status === 204 ? null : await res.json().catch(() => null);

  // NF-005: never treat a failed save as success
  if (!res.ok) {
    throw new ApiError(res.status, data?.error || res.statusText, data);
  }
  return data;
}
