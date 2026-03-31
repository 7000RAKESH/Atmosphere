import { useState, useEffect, useCallback } from 'react'
import { fetchDayData } from '../services/weatherApi'
import { todayStr } from '../utils/helpers'

export const useWeatherData = (lat, lon, date) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!lat || !lon || !date) return
    setLoading(true)
    setError(null)
    try {
      const result = await fetchDayData(lat, lon, date)
      setData(result)
    } catch (e) {
      setError(e.message || 'Failed to fetch weather data.')
    } finally {
      setLoading(false)
    }
  }, [lat, lon, date])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, refetch: load }
}
