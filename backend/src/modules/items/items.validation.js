// Validates the JSON body of POST /api/items (F-004, F-005, UC-004). See backend/API.md.
// Checks shape and format only; whether ids exist in the database is checked in items.service.js.
// Returns a clean object or throws HttpError 400 listing every invalid field.
const HttpError = require('../../utils/HttpError');

const TYPES = ['lost', 'found'];
const MAX_TITLE = 100;
const MAX_DESCRIPTION = 5000;
const MAX_HIDDEN_DETAIL = 1000;
const MAX_LOCATION_NAME = 100;
const MAX_OTHER_TEXT = 100;
const MAX_IMAGE_URL = 2048;
const MAX_KEYWORDS = 20;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

// Users are in Croatia; "today" on a UTC server would reject dates just after local midnight.
function todayInZagreb() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Zagreb' }).format(new Date());
}

function isBlank(value) {
  return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
}

function isPositiveInt(value) {
  return Number.isSafeInteger(value) && value > 0;
}

function isValidDate(text) {
  if (!DATE_RE.test(text)) return false;
  const date = new Date(`${text}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(text);
}

// Required text: trimmed, non-empty, within maxLength
function requiredText(body, key, maxLength, errors) {
  const value = body[key];
  if (isBlank(value)) {
    errors[key] = 'Required';
    return null;
  }
  if (typeof value !== 'string') {
    errors[key] = 'Must be text';
    return null;
  }
  const text = value.trim();
  if (text.length > maxLength) errors[key] = `At most ${maxLength} characters`;
  return text;
}

// Optional text: blank becomes null
function optionalText(value, key, maxLength, errors) {
  if (isBlank(value)) return null;
  if (typeof value !== 'string') {
    errors[key] = 'Must be text';
    return null;
  }
  const text = value.trim();
  if (text.length > maxLength) errors[key] = `At most ${maxLength} characters`;
  return text;
}

function parseLocation(location, errors) {
  if (!location || typeof location !== 'object' || Array.isArray(location)) {
    errors.location = 'Pick the location using GPS or on the map';
    return null;
  }
  const name = optionalText(location.name, 'location.name', MAX_LOCATION_NAME, errors);
  const { latitude, longitude } = location;
  if (isBlank(latitude) || isBlank(longitude)) {
    errors.location = 'Pick the location using GPS or on the map';
    return null;
  }
  if (typeof latitude !== 'number' || !Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    errors['location.latitude'] = 'Number between -90 and 90';
  }
  if (typeof longitude !== 'number' || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    errors['location.longitude'] = 'Number between -180 and 180';
  }
  return { name, latitude, longitude };
}

function parseKeywords(keywords, errors) {
  if (!Array.isArray(keywords) || keywords.length === 0) {
    errors.keywords = 'Describe the item with keywords';
    return [];
  }
  if (keywords.length > MAX_KEYWORDS) {
    errors.keywords = `At most ${MAX_KEYWORDS} keywords`;
    return [];
  }

  const seenKinds = new Set();
  const result = [];
  keywords.forEach((entry, index) => {
    const key = `keywords[${index}]`;
    if (!entry || typeof entry !== 'object') {
      errors[key] = 'Must be an object with kindId and keywordId or otherText';
      return;
    }
    const { kindId, keywordId } = entry;
    if (!isPositiveInt(kindId)) {
      errors[key] = 'kindId must be a positive integer';
      return;
    }
    if (seenKinds.has(kindId)) {
      errors[key] = 'Only one value per keyword kind';
      return;
    }
    seenKinds.add(kindId);

    const hasKeyword = !isBlank(keywordId);
    const otherText = typeof entry.otherText === 'string' ? entry.otherText.trim() : entry.otherText;
    const hasOther = !isBlank(otherText);
    if (hasKeyword === hasOther) {
      errors[key] = 'Select a suggested keyword or enter your own text under "Other", not both';
      return;
    }
    if (hasKeyword && !isPositiveInt(keywordId)) {
      errors[key] = 'keywordId must be a positive integer';
      return;
    }
    if (hasOther && typeof otherText !== 'string') {
      errors[key] = 'otherText must be text';
      return;
    }
    if (hasOther && otherText.length > MAX_OTHER_TEXT) {
      errors[key] = `"Other" text can have at most ${MAX_OTHER_TEXT} characters`;
      return;
    }
    result.push({
      kindId,
      keywordId: hasKeyword ? keywordId : null,
      otherText: hasOther ? otherText : null,
    });
  });
  return result;
}

function parseImageUrl(value, errors) {
  if (isBlank(value)) return null;
  if (typeof value !== 'string' || value.length > MAX_IMAGE_URL || !/^https?:\/\/\S+$/i.test(value)) {
    errors.imageUrl = 'Must be the URL returned by the photo upload';
    return null;
  }
  return value;
}

// `today` (YYYY-MM-DD) can be passed in tests.
function parseNewItem(body, { today = todayInZagreb() } = {}) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new HttpError(400, 'Request body must be a JSON object');
  }
  const errors = {};

  if (!TYPES.includes(body.type)) errors.type = `One of: ${TYPES.join(', ')}`;

  const title = requiredText(body, 'title', MAX_TITLE, errors);
  const description = requiredText(body, 'description', MAX_DESCRIPTION, errors);

  if (!isPositiveInt(body.categoryId)) errors.categoryId = 'Select a category';

  const { dateFoundLost } = body;
  if (isBlank(dateFoundLost)) errors.dateFoundLost = 'Required';
  else if (typeof dateFoundLost !== 'string' || !isValidDate(dateFoundLost)) {
    errors.dateFoundLost = 'Date in YYYY-MM-DD format';
  } else if (dateFoundLost > today) errors.dateFoundLost = 'The date cannot be in the future';

  const timeFrom = isBlank(body.timeFrom) ? null : body.timeFrom;
  const timeTo = isBlank(body.timeTo) ? null : body.timeTo;
  if (timeFrom !== null && (typeof timeFrom !== 'string' || !TIME_RE.test(timeFrom))) {
    errors.timeFrom = 'Time in HH:MM format';
  }
  if (timeTo !== null && (typeof timeTo !== 'string' || !TIME_RE.test(timeTo))) {
    errors.timeTo = 'Time in HH:MM format';
  }
  if (!errors.timeFrom && !errors.timeTo) {
    if (timeTo !== null && timeFrom === null) errors.timeFrom = 'Required when timeTo is given';
    else if (timeFrom !== null && timeTo !== null && timeTo < timeFrom) {
      errors.timeTo = 'Must not be before timeFrom';
    }
  }

  const hiddenDetail = optionalText(body.hiddenDetail, 'hiddenDetail', MAX_HIDDEN_DETAIL, errors);
  const imageUrl = parseImageUrl(body.imageUrl, errors);
  const location = parseLocation(body.location, errors);
  const keywords = parseKeywords(body.keywords, errors);

  if (Object.keys(errors).length > 0) {
    throw new HttpError(400, 'Invalid post data', errors);
  }

  return {
    type: body.type,
    title,
    description,
    categoryId: body.categoryId,
    dateFoundLost,
    timeFrom,
    timeTo,
    hiddenDetail,
    imageUrl,
    location,
    keywords,
  };
}

module.exports = { parseNewItem };
