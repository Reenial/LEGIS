// Edit own post (UC-005). Not built yet: the backend has no update route.
// When it is ready, point the /items/:itemId/edit route in router.js back to itemForm.js (edit mode).
import { renderNotImplemented } from '../components/notImplemented.js';

export function render(container, params) {
  renderNotImplemented(container, { title: 'Edit post' });
}
