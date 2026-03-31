# AtmoSphere — Weather Intelligence Dashboard

A production-ready React weather dashboard built with Vite, integrating the **Open-Meteo API** for real-time and historical weather data with full air quality metrics.

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
# Clone or extract the project
cd weather-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
weather-dashboard/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   ├── HourlyCharts.jsx        # 6 interactive hourly graphs (Page 1)
│   │   │   ├── HistoricalCharts.jsx    # 5 historical trend charts (Page 2)
│   │   │   ├── WeatherMetrics.jsx      # All metric cards (Page 1)
│   │   │   └── WeatherMetrics.module.css
│   │   ├── layout/
│   │   │   ├── Navbar.jsx              # Sticky nav with page tabs + location badge
│   │   │   ├── Navbar.module.css
│   │   │   ├── LocationModal.jsx       # GPS detection + city search modal
│   │   │   └── LocationModal.module.css
│   │   └── ui/
│   │       ├── AQIBadge.jsx            # Colored AQI level indicator
│   │       ├── ChartCard.jsx           # Scrollable chart wrapper
│   │       ├── CustomTooltip.jsx       # Recharts tooltips (standard + sun)
│   │       ├── ErrorMessage.jsx        # Error state UI
│   │       ├── MetricCard.jsx          # Individual weather metric card
│   │       ├── SectionHeader.jsx       # Titled section divider
│   │       ├── Spinner.jsx             # Loading spinner
│   │       └── *.module.css            # Scoped styles per component
│   ├── context/
│   │   └── LocationContext.jsx         # Global location state (React Context)
│   ├── hooks/
│   │   ├── useGeolocation.js           # Browser GPS hook
│   │   ├── useWeatherData.js           # Page 1 data fetching hook
│   │   └── useHistoricalData.js        # Page 2 data fetching hook
│   ├── pages/
│   │   ├── CurrentWeatherPage.jsx      # Page 1: Today + Hourly
│   │   ├── CurrentWeatherPage.module.css
│   │   ├── HistoricalPage.jsx          # Page 2: Date range analysis
│   │   └── HistoricalPage.module.css
│   ├── services/
│   │   └── weatherApi.js              # All API calls + 5-min in-memory cache
│   ├── styles/
│   │   └── global.css                 # CSS variables, resets, scrollbar styles
│   ├── utils/
│   │   ├── constants.js               # Colors, AQI levels, wind directions
│   │   └── helpers.js                 # Formatting, conversion, calculation utils
│   ├── App.jsx
│   ├── App.module.css
│   └── main.jsx
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 🌐 APIs Used

| API | Purpose | Docs |
|-----|---------|------|
| Open-Meteo Forecast | Current + hourly weather | https://open-meteo.com |
| Open-Meteo Archive | Historical weather (up to 2 years) | https://archive-api.open-meteo.com |
| Open-Meteo Air Quality | PM10, PM2.5, CO, NO₂, SO₂, AQI | https://air-quality-api.open-meteo.com |
| Open-Meteo Geocoding | City search → lat/lon | https://geocoding-api.open-meteo.com |

All APIs are **free** and require **no API key**.

---

## 🔧 Features

### Page 1 — Current Weather & Hourly Forecast
- **Auto GPS detection** on load with city search fallback
- **Date picker** — view any past date or today
- **°C / °F toggle** — applied to all temperature displays and charts
- **Metric cards**: Temperature (current/min/max), Precipitation, Humidity, UV Index, Sunrise/Sunset, Wind Speed & Direction, Full Air Quality (AQI, PM10, PM2.5, CO, CO₂, NO₂, SO₂)
- **6 hourly charts**:
  - Temperature — Area chart
  - Relative Humidity — Line chart
  - Precipitation — Bar chart
  - Visibility — Area chart
  - Wind Speed — Line chart
  - PM10 & PM2.5 — Combined line chart

### Page 2 — Historical Analysis
- **Date range selector** with quick presets (1M, 3M, 6M, 1Y, 2Y)
- **Maximum 2-year range** with validation
- **5 historical charts**:
  - Temperature (Mean/Max/Min) — Line chart
  - Sun Cycle (Sunrise/Sunset in IST) — Line chart
  - Precipitation — Bar chart
  - Wind Speed + Direction — Composed chart
  - PM10 & PM2.5 — Line chart

### Performance
- 5-minute in-memory API response cache
- `useMemo` / `useCallback` to prevent unnecessary re-renders
- API calls parallelized with `Promise.all`

### Responsive Design
- Mobile-first CSS with CSS Modules
- All charts horizontally scrollable on small screens
- Adaptive grid layouts (2-col → 1-col on mobile)

---

## 🎨 Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 + Vite |
| Charts | Recharts 2 |
| Styling | CSS Modules + CSS Variables |
| APIs | Open-Meteo (free, no key) |
| Fonts | Syne, DM Mono, Instrument Serif (Google Fonts) |

---

## 📱 Mobile Support

- Sticky navbar collapses gracefully on small screens
- Temperature hero card stacks vertically on mobile
- Metric grids adapt from 4-col → 2-col → 1-col
- All charts scroll horizontally and remain readable

---

## 🛠 Customization

Edit `src/utils/constants.js` to change chart colors or AQI level thresholds.

Edit `src/styles/global.css` CSS variables to retheme the entire app.
