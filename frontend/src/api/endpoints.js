// One function per backend route (backend/src/modules/*/*.routes.js).
import { request } from './client.js';

// Auth (UC-003)
export const auth = {
  signInWithGoogle: (idToken) => request('/auth/google', { method: 'POST', body: { idToken } }),
  signOut: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
};

// Posts (UC-001, UC-002, UC-004 to UC-006)
export const items = {
  list: (filters) => request('/items', { query: filters }),
  listMine: () => request('/me/items'),
  get: (itemId) => request(`/items/${itemId}`),
  create: (data) => request('/items', { method: 'POST', body: data }),
  update: (itemId, data) => request(`/items/${itemId}`, { method: 'PATCH', body: data }),
  remove: (itemId) => request(`/items/${itemId}`, { method: 'DELETE' }),
  markHandedOver: (itemId) => request(`/items/${itemId}/handed-over`, { method: 'PATCH' }),
  matches: (itemId) => request(`/items/${itemId}/matches`), // UC-011
  report: (itemId, reason) => request(`/items/${itemId}/reports`, { method: 'POST', body: { reason } }), // UC-013
};

// Reference data for forms and filters
export const lookups = {
  categories: () => request('/categories'),
  keywords: () => request('/keywords'),
  geocode: (q) => request('/geocode', { query: { q } }),
};

// Return requests and messages (UC-007 to UC-010)
export const claims = {
  submit: (itemId, message) => request(`/items/${itemId}/claims`, { method: 'POST', body: { message } }),
  list: (role) => request('/claims', { query: { role } }),
  get: (claimId) => request(`/claims/${claimId}`),
  decide: (claimId, decision) => request(`/claims/${claimId}/decision`, { method: 'PATCH', body: { decision } }),
  withdraw: (claimId) => request(`/claims/${claimId}/withdraw`, { method: 'PATCH' }),
  messages: (claimId) => request(`/claims/${claimId}/messages`),
  sendMessage: (claimId, message) => request(`/claims/${claimId}/messages`, { method: 'POST', body: { message } }),
};

// Notifications (UC-012)
export const notifications = {
  list: () => request('/notifications'),
  markRead: (notificationId) => request(`/notifications/${notificationId}/read`, { method: 'PATCH' }),
  setEnabled: (enabled) => request('/notifications/settings', { method: 'PUT', body: { enabled } }),
};

// Moderation (UC-014)
export const admin = {
  reports: (status) => request('/admin/reports', { query: { status } }),
  resolveReport: (reportId, action) => request(`/admin/reports/${reportId}`, { method: 'PATCH', body: { action } }),
};

// Photo upload, storage not decided yet
export const uploads = {
  photo: () => Promise.reject(new Error('Photo upload is not implemented yet')),
};
