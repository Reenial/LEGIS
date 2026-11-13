// Unit tests for POST /api/items body validation (F-004, UC-004). No database needed.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { parseNewItem } = require('../src/modules/items/items.validation');

const TODAY = '2026-11-13';

function validBody(overrides = {}) {
  return {
    type: 'lost',
    title: '  Black wallet ',
    description: 'Leather wallet with a zip.',
    categoryId: 4,
    dateFoundLost: '2026-11-08',
    timeFrom: '08:30',
    timeTo: null,
    hiddenDetail: 'Initials on the inside',
    imageUrl: null,
    location: { name: 'FER, building D', latitude: 45.8011, longitude: 15.9709 },
    keywords: [
      { kindId: 1, keywordId: 7, otherText: null },
      { kindId: 2, keywordId: null, otherText: ' dark navy ' },
    ],
    ...overrides,
  };
}

function errorsFor(body) {
  try {
    parseNewItem(body, { today: TODAY });
  } catch (err) {
    assert.equal(err.status, 400);
    return err.details || {};
  }
  assert.fail('Expected HttpError 400');
}

test('accepts the example body from API.md and trims text', () => {
  const item = parseNewItem(validBody(), { today: TODAY });
  assert.equal(item.title, 'Black wallet');
  assert.equal(item.timeTo, null);
  assert.deepEqual(item.keywords[1], { kindId: 2, keywordId: null, otherText: 'dark navy' });
  assert.equal(item.location.latitude, 45.8011);
});

test('photo and hidden detail are optional', () => {
  const item = parseNewItem(validBody({ hiddenDetail: '  ', imageUrl: undefined }), { today: TODAY });
  assert.equal(item.hiddenDetail, null);
  assert.equal(item.imageUrl, null);
});

test('missing required fields are all reported at once', () => {
  const errors = errorsFor({});
  for (const key of ['type', 'title', 'description', 'categoryId', 'dateFoundLost', 'location', 'keywords']) {
    assert.ok(key in errors, `missing error for ${key}`);
  }
});

test('rejects a non-object body', () => {
  assert.throws(() => parseNewItem(null), { status: 400 });
  assert.throws(() => parseNewItem([]), { status: 400 });
});

test('rejects an invalid type, blank title and too long title', () => {
  assert.ok('type' in errorsFor(validBody({ type: 'stolen' })));
  assert.ok('title' in errorsFor(validBody({ title: '   ' })));
  assert.ok('title' in errorsFor(validBody({ title: 'x'.repeat(101) })));
});

test('categoryId must be a positive integer number', () => {
  assert.ok('categoryId' in errorsFor(validBody({ categoryId: '4' })));
  assert.ok('categoryId' in errorsFor(validBody({ categoryId: 0 })));
});

test('date must be valid and not in the future', () => {
  assert.ok('dateFoundLost' in errorsFor(validBody({ dateFoundLost: '2026-02-30' })));
  assert.ok('dateFoundLost' in errorsFor(validBody({ dateFoundLost: '08.11.2026' })));
  assert.ok('dateFoundLost' in errorsFor(validBody({ dateFoundLost: '2026-11-14' })));
  assert.equal(parseNewItem(validBody({ dateFoundLost: TODAY }), { today: TODAY }).dateFoundLost, TODAY);
});

test('time window: HH:MM, timeTo needs timeFrom and must not be earlier', () => {
  assert.ok('timeFrom' in errorsFor(validBody({ timeFrom: '8:30' })));
  assert.ok('timeFrom' in errorsFor(validBody({ timeFrom: null, timeTo: '10:00' })));
  assert.ok('timeTo' in errorsFor(validBody({ timeFrom: '10:00', timeTo: '09:00' })));
  const item = parseNewItem(validBody({ timeFrom: '09:00', timeTo: '10:00' }), { today: TODAY });
  assert.equal(item.timeTo, '10:00');
});

test('location requires coordinates within range (map picker may send null)', () => {
  assert.ok('location' in errorsFor(validBody({ location: null })));
  assert.ok('location' in errorsFor(validBody({ location: { name: 'FER', latitude: null, longitude: null } })));
  assert.ok('location.latitude' in errorsFor(validBody({ location: { latitude: 91, longitude: 15 } })));
  assert.ok('location.longitude' in errorsFor(validBody({ location: { latitude: 45, longitude: '15' } })));
});

test('each keyword has either a suggested keyword or "Other" text, never both or neither', () => {
  assert.ok('keywords' in errorsFor(validBody({ keywords: [] })));
  assert.ok('keywords[0]' in errorsFor(validBody({ keywords: [{ kindId: 1, keywordId: 7, otherText: 'x' }] })));
  assert.ok('keywords[0]' in errorsFor(validBody({ keywords: [{ kindId: 1, keywordId: null, otherText: '  ' }] })));
  assert.ok('keywords[1]' in errorsFor(validBody({
    keywords: [{ kindId: 1, keywordId: 7 }, { kindId: 1, keywordId: 8 }],
  })));
  assert.ok('keywords[0]' in errorsFor(validBody({ keywords: [{ kindId: 1, otherText: 'x'.repeat(101) }] })));
});

test('imageUrl must be an http(s) URL', () => {
  assert.ok('imageUrl' in errorsFor(validBody({ imageUrl: 'javascript:alert(1)' })));
  const item = parseNewItem(validBody({ imageUrl: 'https://example.com/a.jpg' }), { today: TODAY });
  assert.equal(item.imageUrl, 'https://example.com/a.jpg');
});
