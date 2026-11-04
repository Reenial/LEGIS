// Holds the signed-in user ({ id, name, role }) or null for a visitor.
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
