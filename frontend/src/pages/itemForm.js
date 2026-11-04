// Create (UC-004) or edit (UC-005) a post. Same form; edit mode when params.itemId is set.
import { renderPlaceholder } from '../components/placeholder.js';
import { createLocationPicker } from '../components/mapView.js';

export function render(container, { itemId } = {}) {
  const editing = Boolean(itemId);
  renderPlaceholder(container, {
    title: editing ? `Edit post ${itemId}` : 'New post',
    useCases: editing ? 'UC-005' : 'UC-004',
    todo: [
      'Type (lost/found), category, title, description, date and optional time window',
      'Keywords per kind from lookups.keywords(), with "Other" free text',
      'Optional photo (upload not implemented yet) and optional hidden detail',
      'Validate required fields before sending; show errors without losing input',
      editing ? 'Load the post and save with items.update()' : 'Save with items.create()',
    ],
  });

  const pickerEl = document.createElement('div');
  pickerEl.className = 'map';
  container.append(pickerEl);
  createLocationPicker(pickerEl);
}
