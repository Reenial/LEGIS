// Thin fetch wrapper. Sends the session cookie with every request.

function resolveBaseUrl(raw) {
  if (!raw) return '';
  // render.yaml passes the backend host without a scheme
  return /^https?:\/\//.test(raw) ? raw : `https://${raw}`;
}

const BASE_URL = resolveBaseUrl(import.meta.env.VITE_API_URL);

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

  const res = await fetch(url, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = res.status === 204 ? null : await res.json().catch(() => null);

  // NF-005: never treat a failed save as success
  if (!res.ok) {
    throw new ApiError(res.status, data?.error || res.statusText, data);
  }
  return data;
}
