// Top bar: title, notifications and profile. Links depend on whether the user is signed in and on their role.
import { getUser, onUserChange, setUser } from '../state/session.js';
import { auth } from '../api/endpoints.js';
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
      ${user ? '<button type="button" class="sign-out" data-action="sign-out">Sign out</button>' : ''}
    `;

    container.querySelector('[data-action="sign-out"]')?.addEventListener('click', async () => {
      try {
        await auth.signOut();
      } catch (err) {
        // NF-005: do not pretend the session ended if the server did not confirm it
        alert('Sign-out failed. Please try again.');
        console.error(err);
        return;
      }
      setUser(null);
      window.location.hash = '#/';
    });
  };
  draw(getUser());
  onUserChange(draw);
}
