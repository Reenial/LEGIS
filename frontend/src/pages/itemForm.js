// Create (UC-004) or edit (UC-005) a post. Same form; edit mode when params.itemId is set.

import '../styles/itemForm.css';
import { lookups, items, uploads } from '../api/endpoints.js';
import { request } from '../api/client.js';
import { createLocationPicker } from '../components/mapView.js';
import { escapeHtml } from '../utils/escapeHtml.js';

// Categories and keywords are loaded from /api/categories and /api/keywords
// so their ids always match the database (never hard-code them).
const KIND_LABELS = {
  item_type: 'Item type',
  color: 'Color',
};

const MAX_IMAGE_MB = 5;

function optionsHtml(list) {
  return list.map((o) => `<option value="${Number(o.id)}">${escapeHtml(o.name)}</option>`).join('');
}

function keywordFieldHtml(key, cfg) {
  return `
    <div class="field">
      <label for="${key}">${escapeHtml(cfg.label)} *</label>
      <select id="${key}" name="${key}">
        <option value="">Select...</option>
        ${optionsHtml(cfg.options)}
        <option value="other">Other</option>
      </select>
      <input type="text" id="${key}_other" name="${key}_other"
             class="other-input" maxlength="100" placeholder="Describe it in your own words" hidden />
      <small class="error" data-error-for="${key}"></small>
    </div>`;
}

export function render(container, params = {}) {
  container.innerHTML = '<p class="form-status">Loading the form...</p>';
  const hashAtStart = window.location.hash;

  Promise.all([lookups.categories(), lookups.keywords()])
    .then(([categories, kinds]) => {
      if (window.location.hash !== hashAtStart) return; // the user has already moved to another page
      const keywords = {};
      kinds.forEach((kind) => {
        keywords[`kind_${kind.id}`] = {
          kindId: kind.id,
          label: KIND_LABELS[kind.name] ?? kind.name,
          options: kind.keywords,
        };
      });
      renderForm(container, params, categories, keywords);
    })
    .catch((err) => {
      if (window.location.hash !== hashAtStart) return;
      console.error(err);
      // NF-005: without categories and keywords the form cannot be saved correctly
      container.innerHTML = '<p class="form-status">The form cannot be loaded right now. Please try again later.</p>';
    });
}

function renderForm(container, params, CATEGORIES, KEYWORDS) {
  const isEdit = Boolean(params.itemId); // TODO: load the existing post when editing

  container.innerHTML = `
    <section class="item-form">
      <a href="#/" class="back-link">← Back</a>
      <h1>${isEdit ? 'Edit post' : 'New post'}</h1>

      <form id="item-form" novalidate>

        <div class="field">
          <span class="label">Post type *</span>
          <div class="type-switch">
            <label>
              <input type="radio" name="type" value="lost" checked />
              <span>I lost something</span>
            </label>
            <label>
              <input type="radio" name="type" value="found" />
              <span>I found something</span>
            </label>
          </div>
        </div>

        <div class="field">
          <label for="title">Title *</label>
          <input type="text" id="title" name="title" maxlength="100"
                 placeholder="e.g. Black wallet" />
          <small class="error" data-error-for="title"></small>
        </div>

        <div class="field">
          <label for="description">Description *</label>
          <textarea id="description" name="description" rows="4"
                    placeholder="Describe the item (leave out anything you want to keep as the hidden detail)"></textarea>
          <small class="error" data-error-for="description"></small>
        </div>

        <div class="field">
          <label for="category_id">Category *</label>
          <select id="category_id" name="category_id">
            <option value="">Select...</option>
            ${optionsHtml(CATEGORIES)}
          </select>
          <small class="error" data-error-for="category_id"></small>
        </div>

        ${Object.entries(KEYWORDS).map(([key, cfg]) => keywordFieldHtml(key, cfg)).join('')}

        <div class="field">
          <label for="date_found_lost">Date *</label>
          <input type="date" id="date_found_lost" name="date_found_lost" />
          <small class="error" data-error-for="date_found_lost"></small>
        </div>

        <div class="field">
          <span class="label">Approximate time (optional)</span>
          <div class="time-row">
            <div>
              <label for="time_from">From</label>
              <input type="time" id="time_from" name="time_from" />
            </div>
            <div>
              <label for="time_to">To</label>
              <input type="time" id="time_to" name="time_to" />
            </div>
          </div>
          <small class="error" data-error-for="time"></small>
        </div>

        <div class="field">
          <span class="label">Location *</span>

          <div class="search-row">
            <input type="text" id="address_search" maxlength="200"
                   placeholder="Search an address or place, then press Enter" />
            <button type="button" id="address_search_btn" class="btn-secondary">Search</button>
          </div>
          <ul id="search-results" class="search-results" hidden></ul>

          <button type="button" id="gps-btn" class="btn-secondary">📍 Use my location</button>

          <div id="map" class="map-box"></div>
          <p class="hint" id="map-hint">Click the map to mark the place.</p>

          <label for="location_name">Place name (optional)</label>
          <input type="text" id="location_name" name="location_name" maxlength="100"
                 placeholder="e.g. Building D1" />
          <input type="hidden" id="latitude" name="latitude" />
          <input type="hidden" id="longitude" name="longitude" />

          <small class="error" data-error-for="location"></small>
        </div>

        <div class="field">
          <label for="photo">Photo (optional)</label>
          <input type="file" id="photo" name="photo" accept="image/*" />
          <img id="photo-preview" class="photo-preview" alt="Photo preview" hidden />
          <small class="error" data-error-for="photo"></small>
        </div>

        <div class="field">
          <label for="hidden_detail">Hidden detail (optional)</label>
          <textarea id="hidden_detail" name="hidden_detail" rows="3"
                    placeholder="e.g. a scratch on the back, a sticker inside..."></textarea>
          <p class="hint">🔒 This is never shown publicly. Only you can see it; it is used to verify ownership.</p>
        </div>

        <button type="submit" class="btn-submit">${isEdit ? 'Save changes' : 'Publish'}</button>
        <p id="form-status" class="form-status" role="status"></p>
      </form>
    </section>
  `;

  const form = container.querySelector('#item-form');
  const photoInput = container.querySelector('#photo');
  const photoPreview = container.querySelector('#photo-preview');
  const statusEl = container.querySelector('#form-status');
  const submitBtn = container.querySelector('.btn-submit');
  const keywordKeys = Object.keys(KEYWORDS);
  const formHash = window.location.hash;

  const latInput = container.querySelector('#latitude');
  const lngInput = container.querySelector('#longitude');
  const nameInput = container.querySelector('#location_name');
  const mapHint = container.querySelector('#map-hint');
  const searchInput = container.querySelector('#address_search');
  const searchBtn = container.querySelector('#address_search_btn');
  const resultsEl = container.querySelector('#search-results');
  const gpsBtn = container.querySelector('#gps-btn');

  /* ---------- Errors ---------- */
  function setError(name, message) {
    const el = container.querySelector(`[data-error-for="${name}"]`);
    if (el) el.textContent = message;
  }

  function clearErrors() {
    container.querySelectorAll('.error').forEach((el) => (el.textContent = ''));
  }

  /* ---------- Location: map, search, GPS (F-005) ---------- */
  const MAP_UNAVAILABLE = 'The map is unavailable right now. Check your connection and try again.';
  const DEFAULT_HINT = 'Click the map to mark the place.';
  let mapFailed = false;
  let nameAutofilled = false; // true while the place name was filled in by us, not typed by the user
  let reverseSeq = 0; // ignore answers of outdated reverse-geocoding requests

  nameInput.addEventListener('input', () => {
    nameAutofilled = false;
  });

  function setCoordinates(latitude, longitude) {
    latInput.value = latitude.toFixed(6);
    lngInput.value = longitude.toFixed(6);
    mapHint.textContent = `Selected: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
    setError('location', '');
  }

  // Fills in the place name after a click or GPS fix, but never overwrites text the user typed.
  // A failure here is harmless: the user can type the name.
  async function fillNameFromMap(latitude, longitude) {
    if (nameInput.value.trim() && !nameAutofilled) return;
    const seq = ++reverseSeq;
    try {
      const place = await request('/geocode/reverse', {
        query: { lat: latitude.toFixed(5), lon: longitude.toFixed(5) },
      });
      if (seq !== reverseSeq) return;
      if (place?.name && (!nameInput.value.trim() || nameAutofilled)) {
        nameInput.value = place.name;
        nameAutofilled = true;
      }
    } catch {
      /* ignore */
    }
  }

  const picker = createLocationPicker(container.querySelector('#map'), {
    onChange: ({ latitude, longitude }) => {
      setCoordinates(latitude, longitude);
      fillNameFromMap(latitude, longitude);
    },
    // NF-004: the rest of the form keeps working when the map tiles do not load
    onUnavailable: () => {
      mapFailed = true;
      mapHint.textContent = MAP_UNAVAILABLE;
    },
    onAvailable: () => {
      if (mapFailed) {
        mapFailed = false;
        mapHint.textContent = latInput.value
          ? `Selected: ${Number(latInput.value).toFixed(5)}, ${Number(lngInput.value).toFixed(5)}`
          : DEFAULT_HINT;
      }
    },
  });

  // GPS. If permission is denied the user can still click the map (NF-004).
  gpsBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      mapHint.textContent = 'GPS is not available. Click the map to mark the place.';
      return;
    }
    mapHint.textContent = 'Getting your location...';
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        picker.setPosition(latitude, longitude, { zoom: 17 });
        setCoordinates(latitude, longitude);
        fillNameFromMap(latitude, longitude);
      },
      () => {
        mapHint.textContent = 'Could not get your location. Click the map to mark the place.';
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  });

  // Address search. Only on Enter or the Search button, never while typing (Nominatim policy).
  let lastResults = [];

  function showResults(list) {
    lastResults = list;
    resultsEl.hidden = false;
    if (list.length === 0) {
      resultsEl.innerHTML = '<li class="search-results__empty">No places found. Click the map instead.</li>';
      return;
    }
    resultsEl.innerHTML = list
      .map(
        (r, i) =>
          `<li><button type="button" class="result-btn" data-index="${i}">${escapeHtml(r.label || r.name)}</button></li>`,
      )
      .join('');
  }

  function showSearchMessage(message) {
    lastResults = [];
    resultsEl.hidden = false;
    resultsEl.innerHTML = `<li class="search-results__empty">${escapeHtml(message)}</li>`;
  }

  async function runSearch() {
    const q = searchInput.value.trim();
    if (!q || searchBtn.disabled) return;
    searchBtn.disabled = true;
    showSearchMessage('Searching...');
    try {
      showResults(await lookups.geocode(q));
    } catch (err) {
      console.error(err);
      if (err.status === 401) showSearchMessage('Sign in to search addresses. You can still click the map.');
      else showSearchMessage(err.message || 'Address search is unavailable. Click the map instead.');
    } finally {
      searchBtn.disabled = false;
    }
  }

  searchBtn.addEventListener('click', runSearch);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault(); // Enter must not submit the whole form
    runSearch();
  });

  resultsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.result-btn');
    if (!btn) return;
    const place = lastResults[Number(btn.dataset.index)];
    if (!place) return;
    picker.setPosition(place.latitude, place.longitude, { zoom: 17 });
    setCoordinates(place.latitude, place.longitude);
    if (place.name && (!nameInput.value.trim() || nameAutofilled)) {
      nameInput.value = place.name;
      nameAutofilled = true;
    }
    resultsEl.hidden = true;
  });

  /* ---------- "Other" reveals a text field ---------- */
  keywordKeys.forEach((key) => {
    const select = container.querySelector(`#${key}`);
    const other = container.querySelector(`#${key}_other`);
    select.addEventListener('change', () => {
      const isOther = select.value === 'other';
      other.hidden = !isOther;
      if (isOther) other.focus();
      else other.value = '';
    });
  });

  /* ---------- Photo preview ---------- */
  photoInput.addEventListener('change', () => {
    setError('photo', '');
    const file = photoInput.files[0];
    if (!file) {
      photoPreview.hidden = true;
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('photo', 'Choose an image (JPG, PNG...).');
      photoInput.value = '';
      photoPreview.hidden = true;
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setError('photo', `The image can be at most ${MAX_IMAGE_MB} MB.`);
      photoInput.value = '';
      photoPreview.hidden = true;
      return;
    }
    photoPreview.src = URL.createObjectURL(file);
    photoPreview.hidden = false;
  });

  /* ---------- Validation ---------- */
  function validate(data) {
    const errors = {};
    // Local date (toISOString is UTC, so just after midnight today's date would count as "in the future")
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    if (!data.get('title').trim()) errors.title = 'Title is required.';
    if (!data.get('description').trim()) errors.description = 'Description is required.';
    if (!data.get('category_id')) errors.category_id = 'Select a category.';

    keywordKeys.forEach((key) => {
      const value = data.get(key);
      if (!value) errors[key] = 'Select a value.';
      else if (value === 'other' && !data.get(`${key}_other`).trim())
        errors[key] = 'Describe it in your own words.';
    });

    const date = data.get('date_found_lost');
    if (!date) errors.date_found_lost = 'Date is required.';
    else if (date > today) errors.date_found_lost = 'The date cannot be in the future.';

    const from = data.get('time_from');
    const to = data.get('time_to');
    if (to && !from) errors.time = 'Enter the start time ("From") as well.';
    else if (from && to && to < from) errors.time = '"To" cannot be before "From".';

    if (!data.get('latitude') || !data.get('longitude'))
      errors.location = 'Pick the location on the map, search for it, or use your location.';

    return errors;
  }

  /* ---------- Backend errors ---------- */
  // Backend field name -> data-error-for name used in this form (null = show in the status line)
  function errorTarget(field) {
    const map = {
      categoryId: 'category_id',
      dateFoundLost: 'date_found_lost',
      timeFrom: 'time',
      timeTo: 'time',
      hiddenDetail: 'hidden_detail',
      imageUrl: 'photo',
      location: 'location',
      'location.name': 'location',
      'location.latitude': 'location',
      'location.longitude': 'location',
      keywords: null,
    };
    if (field in map) return map[field];
    const kw = field.match(/^keywords\[(\d+)\]$/); // same order as the payload below
    if (kw) return keywordKeys[Number(kw[1])] ?? null;
    return field; // type, title, description
  }

  // Shows field errors from the backend; returns messages that had no field to sit under
  function showServerErrors(details) {
    const unplaced = [];
    Object.entries(details).forEach(([field, message]) => {
      const target = errorTarget(field);
      if (target && container.querySelector(`[data-error-for="${target}"]`)) setError(target, message);
      else unplaced.push(message);
    });
    return unplaced;
  }

  /* ---------- Submit ---------- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitBtn.disabled) return;
    clearErrors();
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    if (isEdit) {
      statusEl.textContent = 'Editing is not available yet.';
      return;
    }

    const data = new FormData(form);
    const errors = validate(data);

    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([name, msg]) => setError(name, msg));
      container.querySelector('.error:not(:empty)')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Body of POST /api/items (backend/API.md). camelCase, same as API responses.
    const payload = {
      type: data.get('type'),
      title: data.get('title').trim(),
      description: data.get('description').trim(),
      categoryId: Number(data.get('category_id')),
      dateFoundLost: data.get('date_found_lost'),
      timeFrom: data.get('time_from') || null,
      timeTo: data.get('time_to') || null,
      hiddenDetail: data.get('hidden_detail').trim() || null,
      imageUrl: null,
      location: {
        name: data.get('location_name').trim() || null,
        latitude: Number(Number(data.get('latitude')).toFixed(6)),
        longitude: Number(Number(data.get('longitude')).toFixed(6)),
      },
      keywords: Object.entries(KEYWORDS).map(([key, cfg]) => {
        const value = data.get(key);
        const isOther = value === 'other';
        return {
          kindId: cfg.kindId,
          keywordId: isOther ? null : Number(value),
          otherText: isOther ? data.get(`${key}_other`).trim() : null,
        };
      }),
    };
    const photo = photoInput.files[0] || null;

    submitBtn.disabled = true;
    statusEl.textContent = 'Publishing...';

    try {
      // Photo upload is not implemented on the backend yet: publish without it
      let photoSkipped = false;
      if (photo) {
        try {
          payload.imageUrl = (await uploads.photo(photo)).url;
        } catch {
          photoSkipped = true;
        }
      }

      await items.create(payload);

      statusEl.textContent = photoSkipped
        ? 'Post published, but without the photo (photo upload is not available yet).'
        : 'Post published.';
      statusEl.classList.add('form-status--ok');
      // Keep the button disabled so the post cannot be published twice
      setTimeout(() => {
        if (window.location.hash === formHash) window.location.hash = '#/';
      }, 1800);
    } catch (err) {
      // NF-005: never a false success; keep everything the user typed
      console.error(err);
      submitBtn.disabled = false;
      statusEl.textContent = '';

      if (err.status === 401) {
        statusEl.textContent = 'Your session has expired. Please sign in again.';
        return;
      }

      const details = err.body?.details;
      if (err.status === 400 && details && typeof details === 'object') {
        const unplaced = showServerErrors(details);
        statusEl.textContent = unplaced.length ? unplaced.join(' ') : 'Please fix the highlighted fields.';
        container.querySelector('.error:not(:empty)')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      statusEl.textContent = 'The post could not be saved. Nothing was published. Please try again.';
    }
  });
}