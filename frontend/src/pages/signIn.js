// Sign in with Google (UC-003).
import { auth } from '../api/endpoints.js';
import { getUser, setUser } from '../state/session.js';
import '../styles/signIn.css';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// The Google script is loaded with async/defer, so it may not be ready yet.
function waitForGoogle(timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      if (window.google?.accounts?.id) return resolve(window.google.accounts.id);
      if (Date.now() - start > timeoutMs) return reject(new Error('Google script not loaded'));
      setTimeout(check, 100);
    };
    check();
  });
}

export async function render(container) {
  // Already signed in: nothing to do here
  if (getUser()) {
    window.location.hash = '#/';
    return;
  }

  container.innerHTML = `
    <section class="sign-in">
      <h1>Sign in</h1>
      <p>Sign in to post items, send return requests and exchange messages.
         You can browse posts without signing in.</p>
      <div id="google-button" class="sign-in__button"></div>
      <p id="sign-in-status" class="sign-in__status" role="status"></p>
      <a href="#/" class="sign-in__back">← Continue browsing without signing in</a>
    </section>
  `;

  const statusEl = container.querySelector('#sign-in-status');
  const buttonEl = container.querySelector('#google-button');
  const showError = (msg) => {
    statusEl.textContent = msg;
  };

  if (!CLIENT_ID) {
    showError('Sign-in is not configured (missing VITE_GOOGLE_CLIENT_ID).');
    return;
  }

  async function handleCredential(response) {
    statusEl.textContent = 'Signing in...';
    try {
      const user = await auth.signInWithGoogle(response.credential); // { id, name, role }
      setUser(user);
      window.location.hash = '#/';
    } catch (err) {
      // NF-005: no false success; the user stays signed out and can still browse
      showError('Sign-in failed. Please try again.');
      console.error('Sign-in error:', err);
    }
  }

  try {
    const gsi = await waitForGoogle();
    gsi.initialize({ client_id: CLIENT_ID, callback: handleCredential });
    gsi.renderButton(buttonEl, {
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      width: 280,
    });
  } catch (err) {
    showError('Google sign-in is unavailable. Check your connection and try again.');
    console.error(err);
  }
}
