import React from 'react'
import { fmtHourFromDecimal } from '../../utils/helpers'
import styles from './CustomTooltip.module.css'

export const CustomTooltip = ({ active, payload, label, unit = '' }) => {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.tooltip}>
      <div className={styles.label}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} className={styles.row} style={{ color: p.color }}>
          <span className={styles.name}>{p.name}:</span>
          <span className={styles.value}>
            {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}{unit}
          </span>
        </div>
      ))}
    </div>
  )
}

export const SunTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className={styles.tooltip}>
      <div className={styles.label}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} className={styles.row} style={{ color: p.color }}>
          <span className={styles.name}>{p.name}:</span>
          <span className={styles.value}>{fmtHourFromDecimal(p.value)} IST</span>
        </div>
      ))}
    </div>
  )
}
