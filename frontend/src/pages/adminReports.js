// Moderation (UC-014)
import { renderPlaceholder } from '../components/placeholder.js';

export function render(container, params) {
  renderPlaceholder(container, {
    title: 'Moderation',
    useCases: 'UC-014',
    todo: [
      'List pending reports with reason and post (admin.reports)',
      'Dismiss a report or remove the post, with confirmation',
      'Message when there are no reports',
    ],
  });
}
