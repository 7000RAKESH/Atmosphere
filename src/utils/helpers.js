import { AQI_LEVELS, WIND_DIRS } from './constants'

export const todayStr = () => new Date().toISOString().slice(0, 10)

export const fmtLocalTime = (isoStr) => {
  if (!isoStr) return '—'
  const d = new Date(isoStr)
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

export const fmtIST = (isoStr) => {
  if (!isoStr) return '—'
  // open-meteo sunrise/sunset come as "YYYY-MM-DDTHH:MM" local time already
  // treat as UTC then offset +5:30 for IST
  const d = new Date(isoStr + ':00Z')
  const ist = new Date(d.getTime() + 5.5 * 3600 * 1000)
  const h = ist.getUTCHours()
  const m = ist.getUTCMinutes()
  const ampm = h < 12 ? 'AM' : 'PM'
  return `${(h % 12 || 12).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`
}

export const toIST_hours = (isoStr) => {
  if (!isoStr) return null
  const d = new Date(isoStr + ':00Z')
  const ist = new Date(d.getTime() + 5.5 * 3600 * 1000)
  return parseFloat((ist.getUTCHours() + ist.getUTCMinutes() / 60).toFixed(2))
}

export const fmtHourFromDecimal = (val) => {
  if (val == null) return '—'
  const h = Math.floor(val)
  const m = Math.round((val - h) * 60)
  const ampm = h < 12 ? 'AM' : 'PM'
  return `${(h % 12 || 12).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`
}

export const celsiusToFahrenheit = (c) => {
  if (c == null) return null
  return parseFloat((c * 9 / 5 + 32).toFixed(1))
}

export const getAQILevel = (aqi) => {
  if (aqi == null) return { label: 'N/A', color: '#525870' }
  return AQI_LEVELS.find((l) => aqi <= l.max) || AQI_LEVELS[AQI_LEVELS.length - 1]
}

export const getWindDirection = (deg) => {
  if (deg == null) return '—'
  return WIND_DIRS[Math.round(deg / 45) % 8]
}

export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export const shortDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
}

export const daysBetween = (start, end) => {
  if (!start || !end) return 0
  return Math.round((new Date(end) - new Date(start)) / 86400000)
}
