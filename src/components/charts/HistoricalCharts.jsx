import React, { useMemo } from 'react'
import {
  LineChart, Line, BarChart, Bar, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'
import ChartCard from '../ui/ChartCard'
import { CustomTooltip, SunTooltip } from '../ui/CustomTooltip'
import { COLORS } from '../../utils/constants'
import { shortDate, toIST_hours, fmtHourFromDecimal } from '../../utils/helpers'

const CHART_H = 240

const HistoricalCharts = ({ weather, air }) => {
  const dailyData = useMemo(() => {
    if (!weather?.daily?.time) return []
    return weather.daily.time.map((t, i) => ({
      label: shortDate(t),
      date: t,
      tmax:     weather.daily.temperature_2m_max?.[i] ?? null,
      tmin:     weather.daily.temperature_2m_min?.[i] ?? null,
      tmean:    weather.daily.temperature_2m_mean?.[i] ?? null,
      sunrise:  toIST_hours(weather.daily.sunrise?.[i]),
      sunset:   toIST_hours(weather.daily.sunset?.[i]),
      precip:   weather.daily.precipitation_sum?.[i] ?? null,
      windmax:  weather.daily.windspeed_10m_max?.[i] ?? null,
      winddir:  weather.daily.winddirection_10m_dominant?.[i] ?? null,
      pm10:     air?.daily?.pm10_mean?.[i] ?? null,
      pm25:     air?.daily?.pm2_5_mean?.[i] ?? null,
    }))
  }, [weather, air])

  if (!dailyData.length) return null

  const count = dailyData.length
  // adaptive chart width: min 900, ~14px per day
  const chartW = Math.max(900, count * 14)
  const tickInterval = Math.max(0, Math.floor(count / 20) - 1)

  const axisTick = { fill: COLORS.muted, fontSize: 10, fontFamily: 'DM Mono' }

  return (
    <div>
      {/* Temperature Trends */}
      <ChartCard title="Temperature — Mean / Max / Min (°C)" badge="Line" badgeColor="blue" minWidth={chartW}>
        <LineChart width={chartW} height={CHART_H} data={dailyData}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
          <XAxis dataKey="label" tick={axisTick} interval={tickInterval} />
          <YAxis tick={axisTick} unit="°C" />
          <Tooltip content={<CustomTooltip unit="°C" />} />
          <Legend wrapperStyle={{ fontFamily: 'DM Mono', fontSize: 11, color: COLORS.muted }} />
          <Line type="monotone" dataKey="tmean" name="Mean" stroke={COLORS.blue} strokeWidth={2} dot={false} connectNulls />
          <Line type="monotone" dataKey="tmax" name="Max" stroke={COLORS.rose} strokeWidth={1.5} dot={false} strokeDasharray="5 2" connectNulls />
          <Line type="monotone" dataKey="tmin" name="Min" stroke={COLORS.teal} strokeWidth={1.5} dot={false} strokeDasharray="5 2" connectNulls />
        </LineChart>
      </ChartCard>

      {/* Sun Cycle */}
      <ChartCard title="Sun Cycle — Sunrise & Sunset (IST)" badge="Line" badgeColor="gold" minWidth={chartW}>
        <div style={{ padding: '0 12px 8px', display: 'flex', gap: 8 }}>
          <span style={{
            fontFamily: 'DM Mono', fontSize: '0.65rem',
            padding: '2px 8px', background: 'rgba(255,201,71,0.15)',
            border: '1px solid rgba(255,201,71,0.35)', borderRadius: 10, color: COLORS.gold
          }}>IST · UTC+5:30</span>
        </div>
        <LineChart width={chartW} height={CHART_H} data={dailyData}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
          <XAxis dataKey="label" tick={axisTick} interval={tickInterval} />
          <YAxis tick={axisTick} tickFormatter={fmtHourFromDecimal} domain={[4, 22]} />
          <Tooltip content={<SunTooltip />} />
          <Legend wrapperStyle={{ fontFamily: 'DM Mono', fontSize: 11, color: COLORS.muted }} />
          <Line type="monotone" dataKey="sunrise" name="Sunrise" stroke={COLORS.gold} strokeWidth={2} dot={false} connectNulls />
          <Line type="monotone" dataKey="sunset" name="Sunset" stroke={COLORS.warm} strokeWidth={2} dot={false} connectNulls />
        </LineChart>
      </ChartCard>

      {/* Precipitation */}
      <ChartCard title="Precipitation — Daily Total (mm)" badge="Bar" badgeColor="purple" minWidth={chartW}>
        <BarChart width={chartW} height={CHART_H} data={dailyData}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
          <XAxis dataKey="label" tick={axisTick} interval={tickInterval} />
          <YAxis tick={axisTick} unit=" mm" />
          <Tooltip content={<CustomTooltip unit=" mm" />} />
          <Bar dataKey="precip" name="Precipitation" fill={COLORS.purple} radius={[2, 2, 0, 0]} maxBarSize={20} />
        </BarChart>
      </ChartCard>

      {/* Wind Speed + Direction */}
      <ChartCard title="Wind — Max Speed & Dominant Direction" badge="Composed" badgeColor="warm" minWidth={chartW}>
        <ComposedChart width={chartW} height={CHART_H} data={dailyData}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
          <XAxis dataKey="label" tick={axisTick} interval={tickInterval} />
          <YAxis yAxisId="speed" tick={axisTick} unit=" km/h" />
          <YAxis yAxisId="dir" orientation="right" tick={axisTick} unit="°" domain={[0, 360]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontFamily: 'DM Mono', fontSize: 11, color: COLORS.muted }} />
          <Bar yAxisId="speed" dataKey="windmax" name="Max Speed (km/h)" fill={COLORS.warm} radius={[2, 2, 0, 0]} maxBarSize={16} opacity={0.85} />
          <Line yAxisId="dir" type="monotone" dataKey="winddir" name="Direction (°)" stroke={COLORS.gold} strokeWidth={1.5} dot={false} connectNulls />
        </ComposedChart>
      </ChartCard>

      {/* Air Quality PM10 & PM2.5 */}
      <ChartCard title="Air Quality — PM10 & PM2.5 Trends (µg/m³)" badge="Line" badgeColor="rose" minWidth={chartW}>
        <LineChart width={chartW} height={CHART_H} data={dailyData}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
          <XAxis dataKey="label" tick={axisTick} interval={tickInterval} />
          <YAxis tick={axisTick} unit=" µg/m³" />
          <Tooltip content={<CustomTooltip unit=" µg/m³" />} />
          <Legend wrapperStyle={{ fontFamily: 'DM Mono', fontSize: 11, color: COLORS.muted }} />
          <Line type="monotone" dataKey="pm10" name="PM10" stroke={COLORS.rose} strokeWidth={2} dot={false} connectNulls />
          <Line type="monotone" dataKey="pm25" name="PM2.5" stroke={COLORS.purple} strokeWidth={2} dot={false} strokeDasharray="5 2" connectNulls />
        </LineChart>
      </ChartCard>
    </div>
  )
}

export default HistoricalCharts
