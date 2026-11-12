/* Holds the signed-in user ({ id, name, role }) or null for a visitor.
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

// TODO (UC-003): call auth.me() on startup and setUser() with the result (null on 401)
export async function loadUser() {
  setUser(null);
}
*/

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
    const result = await auth.me();
    setUser(result?.user ?? result ?? null);
  } catch {
    setUser(null);
  }
}