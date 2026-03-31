import React, { useState } from 'react'
import { useLocation } from '../context/LocationContext'
import { useHistoricalData } from '../hooks/useHistoricalData'
import HistoricalCharts from '../components/charts/HistoricalCharts'
import SectionHeader from '../components/ui/SectionHeader'
import Spinner from '../components/ui/Spinner'
import ErrorMessage from '../components/ui/ErrorMessage'
import { todayStr, daysBetween } from '../utils/helpers'
import { TWO_YEARS_AGO } from '../utils/constants'
import styles from './HistoricalPage.module.css'

const QUICK_RANGES = [
  { label: '1 Month',  months: 1  },
  { label: '3 Months', months: 3  },
  { label: '6 Months', months: 6  },
  { label: '1 Year',   months: 12 },
  { label: '2 Years',  months: 24 },
]

const subtractMonths = (months) => {
  const d = new Date()
  d.setMonth(d.getMonth() - months)
  return d.toISOString().slice(0, 10)
}

const HistoricalPage = () => {
  const { location } = useLocation()
  const today = todayStr()

  const [startDate, setStartDate] = useState(() => subtractMonths(3))
  const [endDate, setEndDate]     = useState(today)

  const { data, loading, error, fetch: fetchData } = useHistoricalData(
    location?.lat,
    location?.lon
  )

  const days = daysBetween(startDate, endDate)
  const isValidRange = startDate && endDate && startDate < endDate && days <= 730

  const handleAnalyze = () => {
    if (!isValidRange) return
    fetchData(startDate, endDate)
  }

  const handleQuick = (months) => {
    const s = subtractMonths(months)
    setStartDate(s)
    setEndDate(today)
  }

  return (
    <div className={styles.page}>
      <SectionHeader title="Historical Analysis" pill="Max 2 Years" />

      {/* Quick range buttons */}
      <div className={styles.quickRanges}>
        <span className={styles.quickLabel}>Quick:</span>
        {QUICK_RANGES.map(({ label, months }) => (
          <button
            key={label}
            className={styles.quickBtn}
            onClick={() => handleQuick(months)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Date range picker */}
      <div className={styles.rangeRow}>
        <div className={styles.rangeField}>
          <label className={styles.rangeLabel}>FROM</label>
          <input
            type="date"
            className={styles.dateInput}
            value={startDate}
            min={TWO_YEARS_AGO}
            max={endDate || today}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>

        <span className={styles.rangeSep}>→</span>

        <div className={styles.rangeField}>
          <label className={styles.rangeLabel}>TO</label>
          <input
            type="date"
            className={styles.dateInput}
            value={endDate}
            min={startDate}
            max={today}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>

        <button
          className={`${styles.btn} ${!isValidRange || loading ? styles.btnDisabled : ''}`}
          onClick={handleAnalyze}
          disabled={!isValidRange || loading}
        >
          {loading ? '⟳ Loading…' : '📊 Analyze'}
        </button>

        <div className={styles.rangeInfo}>
          {!isValidRange && startDate && endDate && days > 0 && (
            <span className={styles.errText}>
              {days > 730 ? 'Max range is 2 years (730 days)' : 'Invalid date range'}
            </span>
          )}
          {isValidRange && (
            <span className={styles.daysText}>{days} days selected</span>
          )}
        </div>
      </div>

      {/* Results */}
      {loading && <Spinner text={`Fetching ${days} days of historical data…`} />}

      {error && !loading && (
        <ErrorMessage
          title="Historical data unavailable"
          message={error}
          onRetry={() => fetchData(startDate, endDate)}
        />
      )}

      {data && !loading && !error && (
        <HistoricalCharts weather={data.weather} air={data.air} />
      )}

      {!data && !loading && !error && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📅</div>
          <p className={styles.emptyText}>
            Select a date range above and click <strong>Analyze</strong> to load historical weather trends.
          </p>
        </div>
      )}
    </div>
  )
}

export default HistoricalPage
