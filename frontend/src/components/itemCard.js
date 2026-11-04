// Compact post summary for lists (UC-001, UC-011). Shows public fields only.
export function itemCard(item) {
  const el = document.createElement('article');
  el.className = 'item-card';
  // TODO: type badge, title, category, date, status, thumbnail
  el.innerHTML = `<a href="#/items/${item.id}">${item.title ?? 'Post'}</a>`;
  return el;
}
