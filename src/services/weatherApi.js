import { todayStr } from "../utils/helpers";

const WEATHER_BASE = "https://api.open-meteo.com/v1/forecast";
const ARCHIVE_BASE = "https://archive-api.open-meteo.com/v1/archive";
const AIR_BASE = "https://air-quality-api.open-meteo.com/v1/air-quality";
const GEO_BASE = "https://geocoding-api.open-meteo.com/v1/search";

// Simple in-memory cache with TTL
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const cacheGet = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
};
const cacheSet = (key, data) => cache.set(key, { data, ts: Date.now() });

// ── Geocoding ──────────────────────────────────────────────
export const searchCity = async (name) => {
  const url = `${GEO_BASE}?name=${encodeURIComponent(name)}&count=5&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Geocoding request failed");
  const data = await res.json();
  if (!data.results?.length) throw new Error(`No results found for "${name}"`);
  return data.results; // [{name, latitude, longitude, country, admin1}]
};

// ── Current + Hourly (Page 1, today or near-future) ────────
const buildCurrentUrl = (lat, lon, date) =>
  `${WEATHER_BASE}?latitude=${lat}&longitude=${lon}` +
  `&start_date=${date}&end_date=${date}` +
  `&current=temperature_2m,relativehumidity_2m,precipitation,windspeed_10m,uv_index,weathercode` +
  `&hourly=temperature_2m,relativehumidity_2m,precipitation,visibility,windspeed_10m,uv_index` +
  `&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,sunrise,sunset,` +
  `precipitation_sum,windspeed_10m_max,winddirection_10m_dominant,precipitation_probability_max` +
  `&timezone=auto`;

// ── Archive (historical) ───────────────────────────────────
const buildArchiveUrl = (lat, lon, start, end) =>
  `${ARCHIVE_BASE}?latitude=${lat}&longitude=${lon}` +
  `&start_date=${start}&end_date=${end}` +
  `&hourly=temperature_2m,relativehumidity_2m,precipitation,visibility,windspeed_10m,uv_index` +
  `&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,sunrise,sunset,` +
  `precipitation_sum,windspeed_10m_max,winddirection_10m_dominant` +
  `&timezone=auto`;

// ── Air Quality ────────────────────────────────────────────
// const buildAirUrl = (lat, lon, start, end) =>
//   `${AIR_BASE}?latitude=${lat}&longitude=${lon}` +
//   `&start_date=${start}&end_date=${end}` +
//   `&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,european_aqi` +
//   `&daily=pm10_mean,pm2_5_mean` +
//   `&timezone=auto`

const buildAirUrl = (lat, lon, start, end) =>
  `${AIR_BASE}?latitude=${lat}&longitude=${lon}` +
  `&start_date=${start}&end_date=${end}` +
  `&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,european_aqi` +
  `&timezone=auto`;

// ── Main fetch function ────────────────────────────────────
export const fetchWeatherData = async (
  lat,
  lon,
  startDate,
  endDate = startDate,
) => {
  const key = `wx:${lat}:${lon}:${startDate}:${endDate}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  const today = todayStr();
  const isHistorical =
    endDate < today ||
    (startDate < today && endDate === today && startDate !== today);

  const weatherUrl = isHistorical
    ? buildArchiveUrl(lat, lon, startDate, endDate)
    : buildCurrentUrl(lat, lon, startDate);

  const airUrl = buildAirUrl(lat, lon, startDate, endDate);

  const [wRes, aRes] = await Promise.all([fetch(weatherUrl), fetch(airUrl)]);

  if (!wRes.ok) throw new Error(`Weather API error: ${wRes.status}`);
  if (!aRes.ok) throw new Error(`Air Quality API error: ${aRes.status}`);

  const [weather, air] = await Promise.all([wRes.json(), aRes.json()]);

  const result = { weather, air };
  cacheSet(key, result);
  return result;
};

// ── Fetch single day (Page 1) ─────────────────────────────
export const fetchDayData = async (lat, lon, date) => {
  const today = todayStr();
  const isHistorical = date < today;

  const key = `day:${lat}:${lon}:${date}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  const weatherUrl = isHistorical
    ? buildArchiveUrl(lat, lon, date, date)
    : buildCurrentUrl(lat, lon, date);

  const airUrl = buildAirUrl(lat, lon, date, date);

  const [wRes, aRes] = await Promise.all([fetch(weatherUrl), fetch(airUrl)]);
  if (!wRes.ok) throw new Error(`Weather API error: ${wRes.status}`);
  if (!aRes.ok) throw new Error(`Air Quality API error: ${aRes.status}`);

  const [weather, air] = await Promise.all([wRes.json(), aRes.json()]);
  const result = { weather, air };
  cacheSet(key, result);
  return result;
};

// ── Fetch range (Page 2) ──────────────────────────────────
export const fetchRangeData = async (lat, lon, startDate, endDate) => {
  const key = `range:${lat}:${lon}:${startDate}:${endDate}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  const today = todayStr();
  const safeEnd = endDate > today ? today : endDate;

  const weatherUrl = buildArchiveUrl(lat, lon, startDate, safeEnd);
  const airUrl = buildAirUrl(lat, lon, startDate, safeEnd);

  const [wRes, aRes] = await Promise.all([fetch(weatherUrl), fetch(airUrl)]);
  if (!wRes.ok) throw new Error(`Weather API error: ${wRes.status}`);
  if (!aRes.ok) throw new Error(`Air Quality API error: ${aRes.status}`);

  const [weather, air] = await Promise.all([wRes.json(), aRes.json()]);
  const result = { weather, air };
  cacheSet(key, result);
  return result;
};
