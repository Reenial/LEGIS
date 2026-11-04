// Post details (UC-002), with return request (UC-007) and report (UC-013) entry points.
import { renderPlaceholder } from '../components/placeholder.js';
import { createMap } from '../components/mapView.js';
import { claimForm } from '../components/claimForm.js';
import { reportDialog } from '../components/reportDialog.js';
import { getUser } from '../state/session.js';

export function render(container, { itemId }) {
  renderPlaceholder(container, {
    title: `Post ${itemId}`,
    useCases: 'UC-002, UC-007, UC-013',
    todo: [
      'Load items.get(itemId); show "unavailable" for a removed post',
      'Type, category, title, description, date/time, status, photo',
      'Map with the location; keep the page usable if the map fails (NF-004)',
    ],
  });

  const mapEl = document.createElement('div');
  mapEl.className = 'map';
  container.append(mapEl);
  createMap(mapEl);

  // Only signed-in users can request a return or report a post
  if (getUser()) {
    container.append(claimForm(itemId), reportDialog(itemId));
  }
}
