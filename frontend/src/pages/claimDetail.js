// One return request: decision (UC-008) and private conversation (UC-010). Not built yet.
import { renderNotImplemented } from '../components/notImplemented.js';

export function render(container, { claimId }) {
  renderNotImplemented(container, { title: `Request ${claimId}` });
}
