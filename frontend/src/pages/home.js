// Posts (UC-001): search, category filter and the newest public posts from GET /api/items.
import { items as itemsApi, lookups } from '../api/endpoints.js';
import { escapeHtml } from '../utils/escapeHtml.js';

const PAGE_SIZE = 20;
const SEARCH_DELAY_MS = 300;

const TYPE_LABELS = { lost: 'Lost', found: 'Found' };

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// dateFoundLost is a plain YYYY-MM-DD date (no time zone), so it is formatted by hand
function formatWhen(item) {
  const [y, m, d] = item.dateFoundLost.split('-').map(Number);
  let text = `${d} ${MONTHS[m - 1]} ${y}`;
  if (item.timeFrom) text += `, ${item.timeFrom}${item.timeTo ? `–${item.timeTo}` : ''}`;
  return text;
}

function itemHtml(item) {
  return `
    <a class="item" href="#/items/${Number(item.id)}">
      <div>
        <h3>${TYPE_LABELS[item.type] ?? escapeHtml(item.type)}</h3>
        <h3>${escapeHtml(item.title)}</h3>
        <p>Category: ${escapeHtml(item.category?.name)}</p>
        <p>Location: ${escapeHtml(item.location?.name || 'not specified')}</p>
        <p>When: ${formatWhen(item)}</p>
      </div>
    </a>`;
}

export function render(container) {
  container.innerHTML = `
    <input id="search" type="search" placeholder="Search items..." />

    <div class="categories">
      <h3>Categories</h3>
      <div class="category-list">
        <button class="category active" data-category="">All</button>
      </div>
    </div>

    <div class="actions">
      <button class="button1" data-href="#/my-posts">My posts</button>
      <button class="button2" data-href="#/items/new">Post a lost or found item</button>
    </div>

    <h3>Recently posted</h3>
    <p class="list-status" role="status"></p>
    <div id="items-list"></div>
    <button class="button1 load-more" hidden>Load more</button>
  `;

  const searchInput = container.querySelector('#search');
  const categoryList = container.querySelector('.category-list');
  const listEl = container.querySelector('#items-list');
  const statusEl = container.querySelector('.list-status');
  const loadMoreBtn = container.querySelector('.load-more');

  const filters = { q: '', categoryId: '' };
  let offset = 0;
  let requestId = 0; // ignores responses that arrive after a newer search started

  container.querySelectorAll('[data-href]').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.location.hash = btn.dataset.href;
    });
  });

  async function load({ append = false } = {}) {
    const id = ++requestId;
    if (!append) offset = 0;
    statusEl.textContent = 'Loading...';
    loadMoreBtn.hidden = true;
    try {
      const page = await itemsApi.list({ ...filters, limit: PAGE_SIZE, offset });
      if (id !== requestId) return;
      const html = page.items.map(itemHtml).join('');
      if (append) listEl.insertAdjacentHTML('beforeend', html);
      else listEl.innerHTML = html;
      offset += page.items.length;
      // UC-001: no results -> message, filters stay as they are
      statusEl.textContent = page.total === 0 ? 'No posts match your search.' : '';
      loadMoreBtn.hidden = offset >= page.total;
    } catch (err) {
      if (id !== requestId) return;
      // NF-005: show the failure instead of an empty list
      statusEl.textContent = 'Posts cannot be loaded right now. Please try again later.';
      console.error(err);
    }
  }

  // Categories come from the database so their ids always match
  lookups
    .categories()
    .then((categories) => {
      categoryList.insertAdjacentHTML(
        'beforeend',
        categories
          .map((c) => `<button class="category" data-category="${Number(c.id)}">${escapeHtml(c.name)}</button>`)
          .join(''),
      );
    })
    .catch((err) => console.error('Categories could not be loaded', err));

  categoryList.addEventListener('click', (e) => {
    const button = e.target.closest('.category');
    if (!button) return;
    categoryList.querySelectorAll('.category').forEach((b) => b.classList.toggle('active', b === button));
    filters.categoryId = button.dataset.category;
    load();
  });

  let searchTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      filters.q = searchInput.value.trim();
      load();
    }, SEARCH_DELAY_MS);
  });

  loadMoreBtn.addEventListener('click', () => load({ append: true }));

  load();
}
