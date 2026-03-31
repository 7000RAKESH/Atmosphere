import React, { useMemo } from 'react'
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import ChartCard from '../ui/ChartCard'
import { CustomTooltip } from '../ui/CustomTooltip'
import { COLORS } from '../../utils/constants'
import { celsiusToFahrenheit } from '../../utils/helpers'

const CHART_H = 220

const HourlyCharts = ({ weather, air, date, tempUnit }) => {
  const hourlyData = useMemo(() => {
    if (!weather?.hourly?.time) return []
    return weather.hourly.time
      .map((t, i) => {
        if (!t.startsWith(date)) return null
        const h = new Date(t).getHours()
        const label = `${h.toString().padStart(2, '0')}:00`
        const rawTemp = weather.hourly.temperature_2m?.[i]
        const temp = rawTemp != null
          ? (tempUnit === 'F' ? celsiusToFahrenheit(rawTemp) : parseFloat(rawTemp.toFixed(1)))
          : null
        return {
          label,
          temp,
          humidity: weather.hourly.relativehumidity_2m?.[i] ?? null,
          precip: weather.hourly.precipitation?.[i] ?? null,
          visibility: weather.hourly.visibility?.[i] != null
            ? parseFloat((weather.hourly.visibility[i] / 1000).toFixed(2))
            : null,
          wind: weather.hourly.windspeed_10m?.[i] ?? null,
          pm10: air?.hourly?.pm10?.[i] ?? null,
          pm25: air?.hourly?.pm2_5?.[i] ?? null,
        }
      })
      .filter(Boolean)
  }, [weather, air, date, tempUnit])

  if (!hourlyData.length) {
    return (
      <p style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono', fontSize: '0.8rem', padding: '24px 0' }}>
        No hourly data available for this date.
      </p>
    )
  }

  const chartW = Math.max(900, hourlyData.length * 36)

  return (
    <div>
      {/* Temperature */}
      <ChartCard title={`Temperature (°${tempUnit})`} badge="Area" badgeColor="blue" minWidth={chartW}>
        <AreaChart width={chartW} height={CHART_H} data={hourlyData}>
          <defs>
            <linearGradient id="gTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
          <XAxis dataKey="label" tick={{ fill: COLORS.muted, fontSize: 11, fontFamily: 'DM Mono' }} />
          <YAxis tick={{ fill: COLORS.muted, fontSize: 11, fontFamily: 'DM Mono' }} unit={`°${tempUnit}`} />
          <Tooltip content={<CustomTooltip unit={`°${tempUnit}`} />} />
          <Area type="monotone" dataKey="temp" name="Temp" stroke={COLORS.blue} fill="url(#gTemp)" strokeWidth={2} dot={false} connectNulls />
        </AreaChart>
      </ChartCard>

      {/* Relative Humidity */}
      <ChartCard title="Relative Humidity" badge="Line" badgeColor="teal" minWidth={chartW}>
        <LineChart width={chartW} height={CHART_H} data={hourlyData}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
          <XAxis dataKey="label" tick={{ fill: COLORS.muted, fontSize: 11, fontFamily: 'DM Mono' }} />
          <YAxis tick={{ fill: COLORS.muted, fontSize: 11, fontFamily: 'DM Mono' }} unit="%" domain={[0, 100]} />
          <Tooltip content={<CustomTooltip unit="%" />} />
          <Line type="monotone" dataKey="humidity" name="Humidity" stroke={COLORS.teal} strokeWidth={2} dot={false} connectNulls />
        </LineChart>
      </ChartCard>

      {/* Precipitation */}
      <ChartCard title="Precipitation" badge="Bar" badgeColor="purple" minWidth={chartW}>
        <BarChart width={chartW} height={CHART_H} data={hourlyData}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
          <XAxis dataKey="label" tick={{ fill: COLORS.muted, fontSize: 11, fontFamily: 'DM Mono' }} />
          <YAxis tick={{ fill: COLORS.muted, fontSize: 11, fontFamily: 'DM Mono' }} unit=" mm" />
          <Tooltip content={<CustomTooltip unit=" mm" />} />
          <Bar dataKey="precip" name="Precipitation" fill={COLORS.purple} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ChartCard>

      {/* Visibility */}
      <ChartCard title="Visibility" badge="Area" badgeColor="gold" minWidth={chartW}>
        <AreaChart width={chartW} height={CHART_H} data={hourlyData}>
          <defs>
            <linearGradient id="gVis" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.gold} stopOpacity={0.25} />
              <stop offset="95%" stopColor={COLORS.gold} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
          <XAxis dataKey="label" tick={{ fill: COLORS.muted, fontSize: 11, fontFamily: 'DM Mono' }} />
          <YAxis tick={{ fill: COLORS.muted, fontSize: 11, fontFamily: 'DM Mono' }} unit=" km" />
          <Tooltip content={<CustomTooltip unit=" km" />} />
          <Area type="monotone" dataKey="visibility" name="Visibility" stroke={COLORS.gold} fill="url(#gVis)" strokeWidth={2} dot={false} connectNulls />
        </AreaChart>
      </ChartCard>

      {/* Wind Speed */}
      <ChartCard title="Wind Speed (10m)" badge="Line" badgeColor="warm" minWidth={chartW}>
        <LineChart width={chartW} height={CHART_H} data={hourlyData}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
          <XAxis dataKey="label" tick={{ fill: COLORS.muted, fontSize: 11, fontFamily: 'DM Mono' }} />
          <YAxis tick={{ fill: COLORS.muted, fontSize: 11, fontFamily: 'DM Mono' }} unit=" km/h" />
          <Tooltip content={<CustomTooltip unit=" km/h" />} />
          <Line type="monotone" dataKey="wind" name="Wind" stroke={COLORS.warm} strokeWidth={2} dot={false} connectNulls />
        </LineChart>
      </ChartCard>

      {/* PM10 & PM2.5 Combined */}
      <ChartCard title="PM10 & PM2.5 (µg/m³)" badge="Combined" badgeColor="rose" minWidth={chartW}>
        <LineChart width={chartW} height={CHART_H} data={hourlyData}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
          <XAxis dataKey="label" tick={{ fill: COLORS.muted, fontSize: 11, fontFamily: 'DM Mono' }} />
          <YAxis tick={{ fill: COLORS.muted, fontSize: 11, fontFamily: 'DM Mono' }} unit=" µg/m³" />
          <Tooltip content={<CustomTooltip unit=" µg/m³" />} />
          <Legend wrapperStyle={{ fontFamily: 'DM Mono', fontSize: 11, color: COLORS.muted }} />
          <Line type="monotone" dataKey="pm10" name="PM10" stroke={COLORS.rose} strokeWidth={2} dot={false} connectNulls />
          <Line type="monotone" dataKey="pm25" name="PM2.5" stroke={COLORS.purple} strokeWidth={2} dot={false} strokeDasharray="5 2" connectNulls />
        </LineChart>
      </ChartCard>
    </div>
  )
}

export default HourlyCharts
