import { useState, useCallback } from 'react'
import { fetchRangeData } from '../services/weatherApi'

export const useHistoricalData = (lat, lon) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetch = useCallback(async (startDate, endDate) => {
    if (!lat || !lon || !startDate || !endDate) return
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const result = await fetchRangeData(lat, lon, startDate, endDate)
      setData(result)
    } catch (e) {
      setError(e.message || 'Failed to fetch historical data.')
    } finally {
      setLoading(false)
    }
  }, [lat, lon])

  return { data, loading, error, fetch }
}
