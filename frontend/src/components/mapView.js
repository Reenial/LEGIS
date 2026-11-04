// Leaflet + OpenStreetMap map, used for post details (UC-002) and picking a location (UC-004/005).
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// TODO: create the map in `element`, add the OSM tile layer with attribution, show `markers`.
// NF-004: if tiles fail to load, keep the rest of the page and show "Map unavailable".
export function createMap(element, { center, zoom = 15, markers = [] } = {}) {
  element.textContent = 'Map placeholder';
  return null;
}

// TODO (F-005): let the user click to choose a point, or use navigator.geolocation.
// Denied GPS permission must still allow manual selection (NF-004).
export function createLocationPicker(element, { initial, onChange } = {}) {
  element.textContent = 'Location picker placeholder';
  return null;
}
