// Report a problematic post (UC-013). Signed-in users only; a reason is required.
// TODO: reason textarea, items.report(), confirmation message.
export function reportDialog(itemId) {
  const el = document.createElement('div');
  el.className = 'report-dialog';
  el.textContent = `Report post ${itemId} (UC-013)`;
  return el;
}
