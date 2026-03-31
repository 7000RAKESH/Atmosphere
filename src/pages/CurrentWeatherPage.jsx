import React, { useState } from 'react'
import { useLocation } from '../context/LocationContext'
import { useWeatherData } from '../hooks/useWeatherData'
import WeatherMetrics from '../components/charts/WeatherMetrics'
import HourlyCharts from '../components/charts/HourlyCharts'
import SectionHeader from '../components/ui/SectionHeader'
import Spinner from '../components/ui/Spinner'
import ErrorMessage from '../components/ui/ErrorMessage'
import { todayStr } from '../utils/helpers'
import styles from './CurrentWeatherPage.module.css'

const CurrentWeatherPage = () => {
  const { location } = useLocation()
  const [date, setDate] = useState(todayStr())
  const [tempUnit, setTempUnit] = useState('C')

  const { data, loading, error, refetch } = useWeatherData(
    location?.lat,
    location?.lon,
    date
  )

  const handleDateChange = (e) => {
    if (e.target.value) setDate(e.target.value)
  }

  return (
    <div className={styles.page}>
      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.dateRow}>
          <label className={styles.controlLabel}>DATE</label>
          <input
            type="date"
            className={styles.dateInput}
            value={date}
            max={todayStr()}
            onChange={handleDateChange}
          />
          <button
            className={`${styles.btn} ${styles.btnGhost}`}
            onClick={() => setDate(todayStr())}
          >
            Today
          </button>
        </div>

        <div className={styles.unitToggle}>
          <button
            className={`${styles.btn} ${styles.btnGhost} ${tempUnit === 'C' ? styles.active : ''}`}
            onClick={() => setTempUnit('C')}
          >
            °C
          </button>
          <button
            className={`${styles.btn} ${styles.btnGhost} ${tempUnit === 'F' ? styles.active : ''}`}
            onClick={() => setTempUnit('F')}
          >
            °F
          </button>
        </div>
      </div>

      {/* Content */}
      {loading && <Spinner text="Fetching atmospheric data…" />}

      {error && !loading && (
        <ErrorMessage
          title="Weather data unavailable"
          message={error}
          onRetry={refetch}
        />
      )}

      {data && !loading && !error && (
        <>
          <WeatherMetrics
            weather={data.weather}
            air={data.air}
            date={date}
            tempUnit={tempUnit}
          />

          <SectionHeader title="Hourly Breakdown" pill="24h intervals" />
          <HourlyCharts
            weather={data.weather}
            air={data.air}
            date={date}
            tempUnit={tempUnit}
          />
        </>
      )}
    </div>
  )
}

export default CurrentWeatherPage
