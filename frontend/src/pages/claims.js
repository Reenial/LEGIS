// Return requests (UC-009)
import { renderPlaceholder } from '../components/placeholder.js';

export function render(container, params) {
  renderPlaceholder(container, {
    title: 'Return requests',
    useCases: 'UC-009',
    todo: [
      'Tabs for sent and received requests (claims.list(role))',
      'Show status of each request',
      'Message when the list is empty',
    ],
  });
}
