// Page not found (-)
import { renderPlaceholder } from '../components/placeholder.js';

export function render(container, params) {
  renderPlaceholder(container, {
    title: 'Page not found',
    useCases: '-',
    todo: [
      'Link back to the post list',
    ],
  });
}
