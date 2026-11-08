import './styles/main.css';
import { loadUser } from './state/session.js';
import { renderHeader } from './components/header.js';
import { startRouter } from './router.js';

// Bottom nav "search" icon: go to the post list and focus its search box.
function wireSearchShortcut() {
  document.querySelector('[data-action="search"]')?.addEventListener('click', () => {
    setTimeout(() => document.getElementById('search')?.focus(), 0);
  });
}

async function start() {
  await loadUser();
  renderHeader(document.getElementById('app-header'));
  startRouter(document.getElementById('app'));
  wireSearchShortcut();
}

start();
