export const COLORS = {
  blue: '#4f7cff',
  purple: '#a78bfa',
  teal: '#00c9a7',
  gold: '#ffc947',
  rose: '#ff4d6d',
  warm: '#ff6b35',
  muted: '#8892aa',
  grid: 'rgba(240,242,247,0.06)',
}

export const AQI_LEVELS = [
  { max: 20,  label: 'Good',        color: '#00c9a7' },
  { max: 40,  label: 'Fair',        color: '#a8e063' },
  { max: 60,  label: 'Moderate',    color: '#ffc947' },
  { max: 80,  label: 'Poor',        color: '#ff6b35' },
  { max: 100, label: 'Very Poor',   color: '#ff4d6d' },
  { max: Infinity, label: 'Hazardous', color: '#cc0000' },
]

export const WIND_DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']

export const TODAY = new Date().toISOString().slice(0, 10)

export const TWO_YEARS_AGO = (() => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 2)
  return d.toISOString().slice(0, 10)
})()
