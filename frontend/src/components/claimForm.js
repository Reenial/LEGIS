// Return request form shown on a found post (UC-007).
// TODO: textarea for the ownership explanation, submit via claims.submit(),
// show pending status on success and a visible error on failure (NF-005).
export function claimForm(itemId) {
  const el = document.createElement('form');
  el.className = 'claim-form';
  el.textContent = `Return request form for post ${itemId} (UC-007)`;
  return el;
}
