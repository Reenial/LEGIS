// Possible matches (UC-011)
import { renderPlaceholder } from '../components/placeholder.js';

export function render(container, params) {
  renderPlaceholder(container, {
    title: 'Possible matches',
    useCases: 'UC-011',
    todo: [
      'Load items.matches(params.itemId)',
      'Show suggestions with itemCard; a match does not confirm ownership',
      'Message when there are no matches',
    ],
  });
}
