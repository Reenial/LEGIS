// Sign in with Google (UC-003).
import { renderPlaceholder } from '../components/placeholder.js';

export function render(container) {
  renderPlaceholder(container, {
    title: 'Sign in',
    useCases: 'UC-003',
    todo: [
      'Render the Google button with google.accounts.id (client ID: import.meta.env.VITE_GOOGLE_CLIENT_ID)',
      'Send the returned credential to auth.signInWithGoogle(), then setUser() and go to the post list',
      'On cancel or failure, stay signed out with a message; browsing still works',
    ],
  });
}
