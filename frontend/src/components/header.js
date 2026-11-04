// Top navigation. Links depend on whether the user is signed in and on their role.
import { getUser, onUserChange } from '../state/session.js';

function links(user) {
  const items = [['#/', 'Posts']];
  if (!user) {
    items.push(['#/sign-in', 'Sign in']);
    return items;
  }
  items.push(['#/items/new', 'New post'], ['#/my-posts', 'My posts'], ['#/claims', 'Requests'], ['#/notifications', 'Notifications']);
  if (user.role === 'admin') items.push(['#/admin/reports', 'Moderation']);
  // TODO (UC-003): sign-out button calling auth.signOut()
  return items;
}

export function renderHeader(container) {
  const draw = (user) => {
    container.innerHTML = `
      <nav class="nav">
        <a class="nav__brand" href="#/">Lost &amp; Found</a>
        ${links(user).map(([href, label]) => `<a href="${href}">${label}</a>`).join('')}
      </nav>
    `;
  };
  draw(getUser());
  onUserChange(draw);
}
