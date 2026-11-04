// Renders a "not built yet" block so every route shows where it belongs.
export function renderPlaceholder(container, { title, useCases, todo = [] }) {
  const section = document.createElement('section');
  section.className = 'placeholder';
  section.innerHTML = `
    <h1>${title}</h1>
    <p class="placeholder__uc">${useCases}</p>
    <ul>${todo.map((t) => `<li>${t}</li>`).join('')}</ul>
  `;
  container.append(section);
  return section;
}
