// Page not found: the address does not match any route in router.js.
export function render(container) {
  const section = document.createElement('section');
  section.className = 'not-found';
  section.innerHTML = `
    <h1>Page not found</h1>
    <p>This page does not exist.</p>
    <a href="#/">Back to the post list</a>
  `;
  container.append(section);
}
