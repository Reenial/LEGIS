// My posts (UC-005, UC-006, UC-011)
import { renderPlaceholder } from '../components/placeholder.js';

export function render(container, params) {
  renderPlaceholder(container, {
    title: 'My posts',
    useCases: 'UC-005, UC-006, UC-011',
    todo: [
      'List own posts with items.listMine()',
      'Links to edit, remove (with confirmation) and possible matches',
      'Mark a found item as handed over',
    ],
  });
}
