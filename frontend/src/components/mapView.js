// Leaflet + OpenStreetMap map, used for post details (UC-002) and picking a location (UC-004/005).
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Without this Vite cannot find the marker images
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// FER, Zagreb
export const DEFAULT_CENTER = [45.8011, 15.9709];

// Adds the OSM tile layer. The attribution is required by the OSM tile policy.
// NF-004: tile errors are reported through callbacks, the rest of the page keeps working.
function addTiles(map, { onUnavailable, onAvailable } = {}) {
  const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  tiles.on('tileerror', () => onUnavailable?.());
  tiles.on('tileload', () => onAvailable?.());
  return tiles;
}

// Read-only map with markers (post details). markers: [{ latitude, longitude, title }]
export function createMap(
  element,
  { center = DEFAULT_CENTER, zoom = 15, markers = [], onUnavailable, onAvailable } = {},
) {
  element.textContent = '';
  const map = L.map(element).setView(center, zoom);
  addTiles(map, { onUnavailable, onAvailable });
  markers.forEach((m) => {
    const marker = L.marker([m.latitude, m.longitude]).addTo(map);
    if (m.title) marker.bindPopup(m.title);
  });
  setTimeout(() => map.invalidateSize(), 0);
  return map;
}

// Map where the user clicks to choose one point (F-005).
// onChange({ latitude, longitude }) is called only when the USER clicks the map.
// Returns { setPosition(lat, lng, { zoom }), destroy() }. setPosition does not call onChange.
export function createLocationPicker(
  element,
  { center = DEFAULT_CENTER, initial, onChange, onUnavailable, onAvailable } = {},
) {
  element.textContent = '';
  const start = initial ? [initial.latitude, initial.longitude] : center;
  const map = L.map(element).setView(start, initial ? 17 : 16);
  addTiles(map, { onUnavailable, onAvailable });

  let marker = null;
  function setPosition(latitude, longitude, { zoom } = {}) {
    if (marker) marker.setLatLng([latitude, longitude]);
    else marker = L.marker([latitude, longitude]).addTo(map);
    if (zoom) map.setView([latitude, longitude], zoom);
    else map.panTo([latitude, longitude]);
  }

  if (initial) setPosition(initial.latitude, initial.longitude);

  map.on('click', (e) => {
    setPosition(e.latlng.lat, e.latlng.lng);
    onChange?.({ latitude: e.latlng.lat, longitude: e.latlng.lng });
  });

  setTimeout(() => map.invalidateSize(), 0);

  return {
    setPosition,
    destroy: () => map.remove(),
  };
}