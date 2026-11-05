/*// Create (UC-004) or edit (UC-005) a post. Same form; edit mode when params.itemId is set.
import { renderPlaceholder } from '../components/placeholder.js';
import { createLocationPicker } from '../components/mapView.js';

export function render(container, { itemId } = {}) {
  const editing = Boolean(itemId);
  renderPlaceholder(container, {
    title: editing ? `Edit post ${itemId}` : 'New post',
    useCases: editing ? 'UC-005' : 'UC-004',
    todo: [
      'Type (lost/found), category, title, description, date and optional time window',
      'Keywords per kind from lookups.keywords(), with "Other" free text',
      'Optional photo (upload not implemented yet) and optional hidden detail',
      'Validate required fields before sending; show errors without losing input',
      editing ? 'Load the post and save with items.update()' : 'Save with items.create()',
    ],
  });

  const pickerEl = document.createElement('div');
  pickerEl.className = 'map';
  container.append(pickerEl);
  createLocationPicker(pickerEl);
}*/


import '../styles/itemForm.css';

// Kad karta bude gotova, postaviti na true (lokacija postaje obavezna)
const REQUIRE_LOCATION = false;

// TODO: kad backend bude gotov, učitati s /api/categories i /api/keywords.
// ID-ovi moraju odgovarati onima u bazi (seed.sql).
const CATEGORIES = [
  { id: 1, name: 'Osobni predmeti' },
  { id: 2, name: 'Uređaji' },
  { id: 3, name: 'Odjeća' },
  { id: 4, name: 'Dokumenti' },
];

const KEYWORDS = {
  item_type: {
    kindId: 1,
    label: 'Vrsta predmeta',
    options: [
      { id: 1, name: 'Novčanik' },
      { id: 2, name: 'Ključevi' },
      { id: 3, name: 'Mobitel' },
      { id: 4, name: 'Slušalice' },
      { id: 5, name: 'Studentska iskaznica' },
      { id: 6, name: 'Ruksak' },
      { id: 7, name: 'Jakna' },
    ],
  },
  color: {
    kindId: 2,
    label: 'Boja',
    options: [
      { id: 8, name: 'Crna' },
      { id: 9, name: 'Bijela' },
      { id: 10, name: 'Siva' },
      { id: 11, name: 'Crvena' },
      { id: 12, name: 'Plava' },
      { id: 13, name: 'Zelena' },
      { id: 14, name: 'Žuta' },
      { id: 15, name: 'Smeđa' },
    ],
  },
};

const MAX_IMAGE_MB = 5;

function optionsHtml(list) {
  return list.map((o) => `<option value="${o.id}">${o.name}</option>`).join('');
}

function keywordFieldHtml(key, cfg) {
  return `
    <div class="field">
      <label for="${key}">${cfg.label} *</label>
      <select id="${key}" name="${key}">
        <option value="">Odaberi...</option>
        ${optionsHtml(cfg.options)}
        <option value="other">Ostalo</option>
      </select>
      <input type="text" id="${key}_other" name="${key}_other"
             class="other-input" maxlength="100" placeholder="Upiši svoj opis" hidden />
      <small class="error" data-error-for="${key}"></small>
    </div>`;
}

export function render(container, params = {}) {
  const isEdit = Boolean(params.itemId); // TODO: kod uređivanja učitati postojeću objavu

  container.innerHTML = `
    <section class="item-form">
      <a href="#/" class="back-link">← Natrag</a>
      <h1>${isEdit ? 'Uredi objavu' : 'Nova objava'}</h1>

      <form id="item-form" novalidate>

        <div class="field">
          <span class="label">Vrsta objave *</span>
          <div class="type-switch">
            <label>
              <input type="radio" name="type" value="lost" checked />
              <span>Izgubio/la sam</span>
            </label>
            <label>
              <input type="radio" name="type" value="found" />
              <span>Pronašao/la sam</span>
            </label>
          </div>
        </div>

        <div class="field">
          <label for="title">Naziv *</label>
          <input type="text" id="title" name="title" maxlength="100"
                 placeholder="npr. Crni novčanik" />
          <small class="error" data-error-for="title"></small>
        </div>

        <div class="field">
          <label for="description">Opis *</label>
          <textarea id="description" name="description" rows="4"
                    placeholder="Opiši predmet (bez podataka koje želiš zadržati kao skriveni detalj)"></textarea>
          <small class="error" data-error-for="description"></small>
        </div>

        <div class="field">
          <label for="category_id">Kategorija *</label>
          <select id="category_id" name="category_id">
            <option value="">Odaberi...</option>
            ${optionsHtml(CATEGORIES)}
          </select>
          <small class="error" data-error-for="category_id"></small>
        </div>

        ${keywordFieldHtml('item_type', KEYWORDS.item_type)}
        ${keywordFieldHtml('color', KEYWORDS.color)}

        <div class="field">
          <label for="date_found_lost">Datum *</label>
          <input type="date" id="date_found_lost" name="date_found_lost" />
          <small class="error" data-error-for="date_found_lost"></small>
        </div>

        <div class="field">
          <span class="label">Približno vrijeme (neobavezno)</span>
          <div class="time-row">
            <div>
              <label for="time_from">Od</label>
              <input type="time" id="time_from" name="time_from" />
            </div>
            <div>
              <label for="time_to">Do</label>
              <input type="time" id="time_to" name="time_to" />
            </div>
          </div>
          <small class="error" data-error-for="time"></small>
        </div>

        <div class="field">
          <span class="label">Lokacija ${REQUIRE_LOCATION ? '*' : ''}</span>
          <input type="text" id="location_name" name="location_name" maxlength="100"
                 placeholder="Naziv mjesta, npr. Zgrada D1" />

          <!-- KARTA: ovo popunjava druga osoba.
               Kad korisnik odabere točku, treba upisati vrijednosti u
               #latitude i #longitude (input.value = ...). -->
          <div id="map" class="map-box">Karta uskoro</div>
          <input type="hidden" id="latitude" name="latitude" />
          <input type="hidden" id="longitude" name="longitude" />

          <small class="error" data-error-for="location"></small>
        </div>

        <div class="field">
          <label for="photo">Fotografija (neobavezno)</label>
          <input type="file" id="photo" name="photo" accept="image/*" />
          <img id="photo-preview" class="photo-preview" alt="Pretpregled fotografije" hidden />
          <small class="error" data-error-for="photo"></small>
        </div>

        <div class="field">
          <label for="hidden_detail">Skriveni detalj (neobavezno)</label>
          <textarea id="hidden_detail" name="hidden_detail" rows="3"
                    placeholder="npr. ogrebotina na poleđini, naljepnica unutra..."></textarea>
          <p class="hint">🔒 Ovo se ne prikazuje javno. Vidi ga samo autor, a služi za provjeru vlasništva.</p>
        </div>

        <button type="submit" class="btn-submit">${isEdit ? 'Spremi promjene' : 'Objavi'}</button>
        <p id="form-status" class="form-status" role="status"></p>
      </form>
    </section>
  `;

  const form = container.querySelector('#item-form');
  const photoInput = container.querySelector('#photo');
  const photoPreview = container.querySelector('#photo-preview');
  const statusEl = container.querySelector('#form-status');

  /* ---------- Greške ---------- */
  function setError(name, message) {
    const el = container.querySelector(`[data-error-for="${name}"]`);
    if (el) el.textContent = message;
  }

  function clearErrors() {
    container.querySelectorAll('.error').forEach((el) => (el.textContent = ''));
  }

  /* ---------- "Ostalo" otkriva tekstualno polje ---------- */
  Object.keys(KEYWORDS).forEach((key) => {
    const select = container.querySelector(`#${key}`);
    const other = container.querySelector(`#${key}_other`);
    select.addEventListener('change', () => {
      const isOther = select.value === 'other';
      other.hidden = !isOther;
      if (isOther) other.focus();
      else other.value = '';
    });
  });

  /* ---------- Pretpregled fotografije ---------- */
  photoInput.addEventListener('change', () => {
    setError('photo', '');
    const file = photoInput.files[0];
    if (!file) {
      photoPreview.hidden = true;
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('photo', 'Odaberi sliku (JPG, PNG...).');
      photoInput.value = '';
      photoPreview.hidden = true;
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setError('photo', `Slika smije imati najviše ${MAX_IMAGE_MB} MB.`);
      photoInput.value = '';
      photoPreview.hidden = true;
      return;
    }
    photoPreview.src = URL.createObjectURL(file);
    photoPreview.hidden = false;
  });

  /* ---------- Validacija ---------- */
  function validate(data) {
    const errors = {};
    const today = new Date().toISOString().slice(0, 10);

    if (!data.get('title').trim()) errors.title = 'Naziv je obavezan.';
    if (!data.get('description').trim()) errors.description = 'Opis je obavezan.';
    if (!data.get('category_id')) errors.category_id = 'Odaberi kategoriju.';

    Object.keys(KEYWORDS).forEach((key) => {
      const value = data.get(key);
      if (!value) errors[key] = 'Odaberi vrijednost.';
      else if (value === 'other' && !data.get(`${key}_other`).trim())
        errors[key] = 'Upiši svoj opis.';
    });

    const date = data.get('date_found_lost');
    if (!date) errors.date_found_lost = 'Datum je obavezan.';
    else if (date > today) errors.date_found_lost = 'Datum ne može biti u budućnosti.';

    const from = data.get('time_from');
    const to = data.get('time_to');
    if (to && !from) errors.time = 'Upiši i početno vrijeme ("Od").';
    else if (from && to && to < from) errors.time = '"Do" ne može biti prije "Od".';

    if (REQUIRE_LOCATION && (!data.get('latitude') || !data.get('longitude')))
      errors.location = 'Odaberi lokaciju na karti.';

    return errors;
  }

  /* ---------- Slanje ---------- */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    const data = new FormData(form);
    const errors = validate(data);

    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([name, msg]) => setError(name, msg));
      const firstError = container.querySelector('.error:not(:empty)');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const lat = data.get('latitude');
    const lng = data.get('longitude');

    // Isti oblik kao tablice items, locations i item_keywords
    const payload = {
      type: data.get('type'),
      title: data.get('title').trim(),
      description: data.get('description').trim(),
      category_id: Number(data.get('category_id')),
      date_found_lost: data.get('date_found_lost'),
      time_from: data.get('time_from') || null,
      time_to: data.get('time_to') || null,
      hidden_detail: data.get('hidden_detail').trim() || null,
      location: {
        name: data.get('location_name').trim() || null,
        latitude: lat ? Number(Number(lat).toFixed(6)) : null,
        longitude: lng ? Number(Number(lng).toFixed(6)) : null,
      },
      keywords: Object.entries(KEYWORDS).map(([key, cfg]) => {
        const value = data.get(key);
        const isOther = value === 'other';
        return {
          kind_id: cfg.kindId,
          keyword_id: isOther ? null : Number(value),
          other_text: isOther ? data.get(`${key}_other`).trim() : null,
        };
      }),
    };
    const photo = photoInput.files[0] || null;

    // TODO: zamijeniti pozivom backenda, npr.
    // const body = new FormData();
    // body.append('data', JSON.stringify(payload));
    // if (photo) body.append('photo', photo);
    // fetch('/api/items', { method: 'POST', body })
    //   .then(...)
    //   .catch(() => prikaži grešku (NF-005: nikad lažna potvrda uspjeha)
    console.log('Payload za backend:', payload, 'Fotografija:', photo);

    statusEl.textContent = 'Objava je spremljena (testni način, vidi konzolu).';
    statusEl.classList.add('form-status--ok');
  });
}