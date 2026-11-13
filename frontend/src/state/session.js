// Holds the signed-in user ({ id, name, role }) or null for a visitor.
import { auth } from '../api/endpoints.js';

let currentUser = null;
const listeners = new Set();

export function getUser() {
  return currentUser;
}

export function setUser(user) {
  currentUser = user;
  listeners.forEach((fn) => fn(currentUser));
}

export function onUserChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// UC-003: restore the session on startup (401 or unreachable backend = visitor)
export async function loadUser() {
  try {
    setUser(await auth.me()); // { id, name, role }
  } catch {
    setUser(null);
  }
}
