import './styles/main.css';
import { loadUser } from './state/session.js';
import { renderHeader } from './components/header.js';
import { startRouter } from './router.js';

async function start() {
  await loadUser();
  renderHeader(document.getElementById('app-header'));
  startRouter(document.getElementById('app'));
}

start();
