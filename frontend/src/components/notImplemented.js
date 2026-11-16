// "Not implemented yet..." screen for pages (and API routes) that are not built yet.
// The title is optional; it tells the user which page they opened.
import { escapeHtml } from '../utils/escapeHtml.js';

export const NOT_IMPLEMENTED_TEXT = 'Not implemented yet...';

export function renderNotImplemented(container, { title } = {}) {
  const section = document.createElement('section');
  section.className = 'not-implemented';
  section.innerHTML = `
    ${title ? `<h1>${escapeHtml(title)}</h1>` : ''}
    <p class="not-implemented__text">${NOT_IMPLEMENTED_TEXT}</p>
  `;
  container.replaceChildren(section);
  return section;
}
