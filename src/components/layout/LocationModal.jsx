import React, { useState, useEffect } from 'react'
import { useGeolocation } from '../../hooks/useGeolocation'
import { useLocation } from '../../context/LocationContext'
import { searchCity } from '../../services/weatherApi'
import styles from './LocationModal.module.css'

const LocationModal = () => {
  const { updateLocation } = useLocation()
  const { loading: gpsLoading, error: gpsError, coords } = useGeolocation()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [searchErr, setSearchErr] = useState('')
  const [resolved, setResolved] = useState(false)

  // Auto-resolve when GPS coords arrive
  useEffect(() => {
    if (coords && !resolved) {
      setResolved(true)
      updateLocation(coords.lat, coords.lon, 'Current Location')
    }
  }, [coords, resolved, updateLocation])

  const handleSearch = async () => {
    if (!query.trim()) return
    setSearching(true)
    setSearchErr('')
    setResults([])
    try {
      const res = await searchCity(query.trim())
      setResults(res)
    } catch (e) {
      setSearchErr(e.message)
    } finally {
      setSearching(false)
    }
  }

  const handleSelect = (r) => {
    updateLocation(r.latitude, r.longitude, `${r.name}${r.admin1 ? ', ' + r.admin1 : ''}, ${r.country}`)
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.globe}>🌍</div>
        <h2 className={styles.title}>AtmoSphere</h2>
        <p className={styles.subtitle}>
          Weather intelligence at your fingertips.<br />
          {gpsLoading ? 'Detecting your location…' : gpsError ? gpsError : 'Allow GPS or search a city.'}
        </p>

        {gpsLoading && <div className={styles.gpsLoader} />}

        <div className={styles.searchRow}>
          <input
            className={styles.input}
            placeholder="Search city, e.g. Hyderabad…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button className={styles.btn} onClick={handleSearch} disabled={searching}>
            {searching ? '…' : 'Search'}
          </button>
        </div>

        {searchErr && <p className={styles.err}>{searchErr}</p>}

        {results.length > 0 && (
          <ul className={styles.results}>
            {results.map((r, i) => (
              <li key={i} className={styles.resultItem} onClick={() => handleSelect(r)}>
                <span className={styles.cityName}>{r.name}</span>
                <span className={styles.cityMeta}>{r.admin1 && `${r.admin1}, `}{r.country}</span>
                <span className={styles.cityCoords}>{r.latitude.toFixed(2)}, {r.longitude.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default LocationModal
