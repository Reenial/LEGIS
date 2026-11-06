// Minimal hash router: '#/items/42' -> itemDetail page with params { itemId: '42' }.
// Hash routing works on nginx/static hosting without server rewrites.
import { getUser } from "./state/session.js";
import * as home from "./pages/home.js";
import * as itemDetail from "./pages/itemDetail.js";
import * as itemForm from "./pages/itemForm.js";
import * as myPosts from "./pages/myPosts.js";
import * as matches from "./pages/matches.js";
import * as claimsList from "./pages/claims.js";
import * as claimDetail from "./pages/claimDetail.js";
import * as notificationsPage from "./pages/notifications.js";
import * as adminReports from "./pages/adminReports.js";
import * as signIn from "./pages/signIn.js";
import * as notFound from "./pages/notFound.js";

// access: 'public' | 'user' | 'admin'
const routes = [
  { path: "/", page: home, access: "public" },
  { path: "/sign-in", page: signIn, access: "public" },
  { path: "/items/new", page: itemForm, access: "user" },
  { path: "/items/:itemId", page: itemDetail, access: "public" },
  { path: "/items/:itemId/edit", page: itemForm, access: "user" },
  { path: "/items/:itemId/matches", page: matches, access: "user" },
  { path: "/my-posts", page: myPosts, access: "user" },
  { path: "/claims", page: claimsList, access: "user" },
  { path: "/claims/:claimId", page: claimDetail, access: "user" },
  { path: "/notifications", page: notificationsPage, access: "user" },
  { path: "/admin/reports", page: adminReports, access: "admin" },
];

function match(path) {
  const parts = path.split("/").filter(Boolean);
  for (const route of routes) {
    const routeParts = route.path.split("/").filter(Boolean);
    if (routeParts.length !== parts.length) continue;
    const params = {};
    const ok = routeParts.every((rp, i) => {
      if (rp.startsWith(":")) {
        params[rp.slice(1)] = decodeURIComponent(parts[i]);
        return true;
      }
      return rp === parts[i];
    });
    if (ok) return { route, params };
  }
  return { route: { page: notFound, access: "public" }, params: {} };
}

export function navigate(path) {
  window.location.hash = path;
}

function render(container) {
  const path = window.location.hash.slice(1) || "/";
  const { route, params } = match(path);
  const user = getUser();

  // UI-side guard only; the backend still checks every request (NF-002)
  if (route.access !== "public" && !user) return navigate("/sign-in");
  if (route.access === "admin" && user?.role !== "admin") return navigate("/");

  container.replaceChildren();
  route.page.render(container, params);
}

export function startRouter(container) {
  window.addEventListener("hashchange", () => render(container));
  render(container);
}

