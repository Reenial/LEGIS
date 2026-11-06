// Posts (UC-001)
import { renderPlaceholder } from '../components/placeholder.js';

export function render(container, params) {
  renderPlaceholder(container, {
    title: 'Posts',
    useCases: 'UC-001',
    todo: [
      'Search box and filters: type, category, keywords (with Other), location, time',
      'Load results with items.list(filters)',
      'Show a message and keep the filters when there are no results',
    ],
  });
}




/*const items = [
  {
    status: "Izgubljeno",
    naziv: "Ključevi",
    kategorija: "Osobni predmeti",
    lokacija: "D1",
    vrijeme: "Danas, 10:30h"
  },
  {
    status: "Pronađeno",
    naziv: "Novčanik",
    kategorija: "Osobni predmeti",
    lokacija: "Autobusni kolodvor",
    vrijeme: "Danas, 9h"
  },
  {
    status: "Izgubljeno",
    naziv: "Mobitel",
    kategorija: "Uređaji",
    lokacija: "D2",
    vrijeme: "Jučer, 18h"
  },
  {
    status: "Izgubljeno",
    naziv: "Jakna",
    kategorija: "Odjeća",
    lokacija: "D1",
    vrijeme: "2. studenog, 12:00h"
  }
];

const categories = [
  "Sve",
  "Osobni predmeti",
  "Uređaji",
  "Odjeća",
  "Dokumenti",
  "Ostalo"
];

export function render(container) {
  container.innerHTML = `
    <input id="search" type="search"
      placeholder="Pretraži predmete..." />

    <div class="categories">
      <h3>Kategorije</h3>
      <div class="category-list">
        ${categories.map(category => `
          <button class="category ${category === "Sve" ? "active" : ""}"
            data-category="${category}">
            ${category}
          </button>
        `).join("")}
      </div>
    </div>

    <div class="actions">
      <button class="button1">Moje objave</button>
      <button class="button2">Objavi izgubljeni ili pronađeni predmet</button>
    </div>

    <h3>Nedavno objavljeno</h3>

    <div id="items-list">
      ${items.map(item => `
        <div class="item" data-category="${item.kategorija}">
          <div>
            <h3>${item.status}</h3>
            <h3>${item.naziv}</h3>
            <p>Kategorija: ${item.kategorija}</p>
            <p>Lokacija: ${item.lokacija}</p>
            <p>Vrijeme: ${item.vrijeme}</p>
          </div>
        </div>
      `).join("")}
    </div>
  `;

  const categoryButtons = container.querySelectorAll(".category");
  const searchInput = container.querySelector("#search");
  const itemElements = container.querySelectorAll(".item");

  let selectedCategory = "Sve";

  function filterItems() {
    const searchText = searchInput.value.toLowerCase();

    itemElements.forEach((itemElement, index) => {
      const item = items[index];

      const matchesCategory =
        selectedCategory === "Sve" ||
        item.kategorija === selectedCategory;

      const matchesSearch =
        item.naziv.toLowerCase().includes(searchText) ||
        item.kategorija.toLowerCase().includes(searchText) ||
        item.lokacija.toLowerCase().includes(searchText);

      itemElement.style.display =
        matchesCategory && matchesSearch ? "flex" : "none";
    });
  }

  categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
      selectedCategory = button.dataset.category;

      categoryButtons.forEach(btn =>
        btn.classList.remove("active")
      );

      button.classList.add("active");

      filterItems();
    });
  });

  searchInput.addEventListener("input", filterItems);
}
*/