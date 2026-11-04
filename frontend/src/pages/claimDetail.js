// One return request: decision (UC-008) and private conversation (UC-010).
import { renderPlaceholder } from '../components/placeholder.js';

export function render(container, { claimId }) {
  renderPlaceholder(container, {
    title: `Request ${claimId}`,
    useCases: 'UC-008, UC-010',
    todo: [
      'Load claims.get(claimId); 403 means the user is not a participant',
      'Post author: accept or reject, compare with the hidden detail',
      'Requester: withdraw the request',
      'Conversation: claims.messages() and claims.sendMessage()',
    ],
  });
}
