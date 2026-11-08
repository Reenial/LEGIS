// Create (UC-004) or edit (UC-005) a post. Same form; edit mode when params.itemId is set.

import '../styles/itemForm.css';
import { lookups } from '../api/endpoints.js';
import { escapeHtml } from '../utils/escapeHtml.js';

// Set to true once the map works (location becomes required)
const REQUIRE_LOCATION = false;

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
          <span class="label">Location ${REQUIRE_LOCATION ? '*' : ''}</span>
          <input type="text" id="location_name" name="location_name" maxlength="100"
                 placeholder="Place name, e.g. Building D1" />

          <!-- MAP: built by another team member.
               When the user picks a point, write the values into
               #latitude and #longitude (input.value = ...). -->
          <div id="map" class="map-box">Map coming soon</div>
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

  /* ---------- Errors ---------- */
  function setError(name, message) {
    const el = container.querySelector(`[data-error-for="${name}"]`);
    if (el) el.textContent = message;
  }

  function clearErrors() {
    container.querySelectorAll('.error').forEach((el) => (el.textContent = ''));
  }

  /* ---------- "Other" reveals a text field ---------- */
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

    Object.keys(KEYWORDS).forEach((key) => {
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

    if (REQUIRE_LOCATION && (!data.get('latitude') || !data.get('longitude')))
      errors.location = 'Pick the location on the map.';

    return errors;
  }

  /* ---------- Submit ---------- */
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
      imageUrl: null, // set from the upload response, see below
      location: {
        name: data.get('location_name').trim() || null,
        latitude: lat ? Number(Number(lat).toFixed(6)) : null,
        longitude: lng ? Number(Number(lng).toFixed(6)) : null,
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

    // TODO: replace with backend calls once POST /api/items exists:
    //   1. if (photo) payload.imageUrl = (await uploads.photo(photo)).url;  // POST /api/uploads/photo
    //   2. const item = await items.create(payload);                         // POST /api/items
    //   3. on failure show the error and keep the input (NF-005: never a false success)
    console.log('Payload for the backend:', payload, 'Photo:', photo);

    statusEl.textContent = 'Post saved (test mode, see the console).';
    statusEl.classList.add('form-status--ok');
  });
}