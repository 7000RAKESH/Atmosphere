import React, { useMemo } from 'react'
import MetricCard from '../ui/MetricCard'
import SectionHeader from '../ui/SectionHeader'
import AQIBadge from '../ui/AQIBadge'
import {
  fmtLocalTime, celsiusToFahrenheit, getAQILevel, getWindDirection
} from '../../utils/helpers'
import { COLORS } from '../../utils/constants'
import styles from './WeatherMetrics.module.css'

const WeatherMetrics = ({ weather, air, date, tempUnit }) => {
  const todayStr = new Date().toISOString().slice(0, 10)

  const dayIdx = useMemo(() => {
    if (!weather?.daily?.time) return 0
    const idx = weather.daily.time.findIndex(t => t === date)
    return idx >= 0 ? idx : 0
  }, [weather, date])

  // Current values – prefer `current` block, fall back to hourly noon
  const current = useMemo(() => {
    if (weather?.current && date === todayStr) {
      return {
        temp: weather.current.temperature_2m,
        humidity: weather.current.relativehumidity_2m,
        uv: weather.current.uv_index,
        wind: weather.current.windspeed_10m,
        precip: weather.current.precipitation,
      }
    }
    if (!weather?.hourly?.time) return {}
    const noonIdx = weather.hourly.time.findIndex(t => t === `${date}T12:00`)
    const i = noonIdx >= 0 ? noonIdx : 0
    return {
      temp: weather.hourly.temperature_2m?.[i],
      humidity: weather.hourly.relativehumidity_2m?.[i],
      uv: weather.hourly.uv_index?.[i],
      wind: weather.hourly.windspeed_10m?.[i],
      precip: weather.hourly.precipitation?.[i],
    }
  }, [weather, date, todayStr])

  const daily = useMemo(() => {
    if (!weather?.daily) return {}
    const d = weather.daily
    return {
      tmax:      d.temperature_2m_max?.[dayIdx],
      tmin:      d.temperature_2m_min?.[dayIdx],
      sunrise:   d.sunrise?.[dayIdx],
      sunset:    d.sunset?.[dayIdx],
      precip:    d.precipitation_sum?.[dayIdx],
      windmax:   d.windspeed_10m_max?.[dayIdx],
      winddir:   d.winddirection_10m_dominant?.[dayIdx],
      precipProb: d.precipitation_probability_max?.[dayIdx],
    }
  }, [weather, dayIdx])

  // Air quality from hourly at noon
  const airNow = useMemo(() => {
    if (!air?.hourly?.time) return {}
    const noonIdx = air.hourly.time.findIndex(t => t === `${date}T12:00`)
    const i = noonIdx >= 0 ? noonIdx : 0
    return {
      aqi: air.hourly.european_aqi?.[i],
      pm10: air.hourly.pm10?.[i],
      pm25: air.hourly.pm2_5?.[i],
      co:   air.hourly.carbon_monoxide?.[i],
      no2:  air.hourly.nitrogen_dioxide?.[i],
      so2:  air.hourly.sulphur_dioxide?.[i],
    }
  }, [air, date])

  const fmt = (c) => {
    if (c == null) return '—'
    const val = tempUnit === 'F' ? celsiusToFahrenheit(c) : parseFloat(c.toFixed(1))
    return val
  }

  const uvLabel = (uv) => {
    if (uv == null) return ''
    if (uv >= 11) return 'Extreme'
    if (uv >= 8)  return 'Very High'
    if (uv >= 6)  return 'High'
    if (uv >= 3)  return 'Moderate'
    return 'Low'
  }

  return (
    <div>
      {/* ── Temperature Hero ── */}
      <div className={styles.tempHero}>
        <div className={styles.tempMain}>
          <div className={styles.tempLabel}>
            {date === todayStr ? 'Current Temperature' : 'Temperature at Noon'}
          </div>
          <div className={styles.tempBig}>
            {fmt(current.temp)}<span className={styles.tempDeg}>°{tempUnit}</span>
          </div>
          <div className={styles.tempDate}>
            {date === todayStr
              ? 'Right now'
              : new Date(date).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <div className={styles.tempStat}>
          <div className={styles.statLabel}>Maximum</div>
          <div className={styles.statVal} style={{ color: COLORS.rose }}>
            {fmt(daily.tmax)}<span className={styles.statUnit}>°{tempUnit}</span>
          </div>
        </div>
        <div className={styles.tempStat}>
          <div className={styles.statLabel}>Minimum</div>
          <div className={styles.statVal} style={{ color: COLORS.blue }}>
            {fmt(daily.tmin)}<span className={styles.statUnit}>°{tempUnit}</span>
          </div>
        </div>
      </div>

      {/* ── Atmospheric Conditions ── */}
      <SectionHeader title="Atmospheric Conditions" />
      <div className={`${styles.grid} ${styles.grid4}`}>
        <MetricCard label="Precipitation" value={daily.precip?.toFixed(1) ?? '—'} unit=" mm" accent={COLORS.purple} />
        <MetricCard label="Humidity" value={current.humidity?.toFixed(0) ?? '—'} unit="%" accent={COLORS.teal} />
        <MetricCard label="UV Index" value={current.uv?.toFixed(1) ?? '—'} accent={COLORS.gold} sub={uvLabel(current.uv)} />
        <MetricCard label="Precip. Probability" value={daily.precipProb ?? '—'} unit="%" accent={COLORS.blue} />
      </div>

      {/* ── Sun Cycle ── */}
      <SectionHeader title="Sun Cycle" />
      <div className={`${styles.grid} ${styles.grid2}`}>
        <div className={styles.sunCard}>
          <div className={styles.sunEmoji}>🌅</div>
          <div>
            <div className={styles.sunLabel}>Sunrise</div>
            <div className={styles.sunTime}>{fmtLocalTime(daily.sunrise)}</div>
          </div>
        </div>
        <div className={styles.sunCard}>
          <div className={styles.sunEmoji}>🌇</div>
          <div>
            <div className={styles.sunLabel}>Sunset</div>
            <div className={styles.sunTime}>{fmtLocalTime(daily.sunset)}</div>
          </div>
        </div>
      </div>

      {/* ── Wind ── */}
      <SectionHeader title="Wind" />
      <div className={`${styles.grid} ${styles.grid2}`}>
        <MetricCard label="Max Wind Speed" value={daily.windmax?.toFixed(1) ?? '—'} unit=" km/h" accent={COLORS.warm} />
        <div className={styles.card}>
          <div className={styles.cardLabel}>Dominant Direction</div>
          <div className={styles.cardValue}>
            {getWindDirection(daily.winddir)}
            {daily.winddir != null && (
              <span className={styles.cardUnit}>&nbsp;{daily.winddir.toFixed(0)}°</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Air Quality ── */}
      <SectionHeader title="Air Quality" pill="European AQI" />
      <div className={styles.aqiHero}>
        <div className={styles.cardLabel}>Air Quality Index</div>
        <div className={styles.aqiVal} style={{ color: getAQILevel(airNow.aqi).color }}>
          {airNow.aqi?.toFixed(0) ?? '—'}
        </div>
        <AQIBadge aqi={airNow.aqi} />
      </div>
      <div className={`${styles.grid} ${styles.grid3}`}>
        <MetricCard label="PM10"  value={airNow.pm10?.toFixed(1) ?? '—'} unit=" µg/m³" accent={COLORS.rose} />
        <MetricCard label="PM2.5" value={airNow.pm25?.toFixed(1) ?? '—'} unit=" µg/m³" accent={COLORS.purple} />
        <MetricCard label="CO (Carbon Monoxide)"   value={airNow.co?.toFixed(0) ?? '—'}  unit=" µg/m³" />
        <MetricCard label="CO₂ (Carbon Dioxide)"   value="~415"                           unit=" ppm"    sub="Atmospheric avg." accent={COLORS.teal} />
        <MetricCard label="NO₂ (Nitrogen Dioxide)" value={airNow.no2?.toFixed(1) ?? '—'} unit=" µg/m³" accent={COLORS.gold} />
        <MetricCard label="SO₂ (Sulphur Dioxide)"  value={airNow.so2?.toFixed(1) ?? '—'} unit=" µg/m³" accent={COLORS.warm} />
      </div>
    </div>
  )
}

export default WeatherMetrics
