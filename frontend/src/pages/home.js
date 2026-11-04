// Posts (UC-001)
import { renderPlaceholder } from '../components/placeholder.js';

export function render(container, params) {
  renderPlaceholder(container, {
    title: 'Posts',
    useCases: 'UC-001',
    todo: [
      'Search box and filters: type, category, keywords (with Other), location, time',
      'Load results with items.list(filters)',
      'Show a message and keep the filters when there are no results',
    ],
  });
}
