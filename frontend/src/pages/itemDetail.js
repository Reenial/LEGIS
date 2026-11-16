// Post details (UC-002), with return request (UC-007) and report (UC-013) entry points. Not built yet.
// When building it, use components/mapView.js (createMap), claimForm.js and reportDialog.js.
import { renderNotImplemented } from '../components/notImplemented.js';

export function render(container, { itemId }) {
  renderNotImplemented(container, { title: `Post ${itemId}` });
}
