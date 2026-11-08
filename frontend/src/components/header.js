// Top bar: title, notifications and profile. Links depend on whether the user is signed in and on their role.
import { getUser, onUserChange } from '../state/session.js';
import bellIcon from '../assets/icons/bell.png';
import profileIcon from '../assets/icons/profile.png';

export function renderHeader(container) {
  const draw = (user) => {
    // Visitors are sent to sign-in; the router would redirect them anyway.
    const notificationsHref = user ? '#/notifications' : '#/sign-in';
    const profileHref = user ? '#/my-posts' : '#/sign-in';
    container.innerHTML = `
      <a class="title" href="#/">Lost &amp; Found</a>
      ${user?.role === 'admin' ? '<a class="admin-link" href="#/admin/reports">Moderation</a>' : ''}
      <a class="notification" href="${notificationsHref}" title="Notifications">
        <img src="${bellIcon}" class="icons" alt="Notifications" />
      </a>
      <a class="user" href="${profileHref}" title="${user ? 'My posts' : 'Sign in'}">
        <img src="${profileIcon}" class="icons" alt="${user ? 'My posts' : 'Sign in'}" />
      </a>
    `;
    // TODO (UC-003): sign-out action calling auth.signOut()
  };
  draw(getUser());
  onUserChange(draw);
}
