const items = [
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

const main = document.querySelector("main");

items.forEach(item => {

  const noviItem = document.createElement("div");
  noviItem.classList.add("item");

  noviItem.innerHTML = `
    <div>
      <h3>${item.status}</h3>
      <h3>${item.naziv}</h3>

      <p>Kategorija: ${item.kategorija}</p>
      <p>Lokacija: ${item.lokacija}</p>
      <p>Vrijeme: ${item.vrijeme}</p>
    </div>
  `;

  main.appendChild(noviItem);
});