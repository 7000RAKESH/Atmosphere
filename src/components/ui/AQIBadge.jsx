import React from 'react'
import { getAQILevel } from '../../utils/helpers'
import styles from './AQIBadge.module.css'

const AQIBadge = ({ aqi }) => {
  const level = getAQILevel(aqi)
  return (
    <span
      className={styles.badge}
      style={{
        background: `${level.color}22`,
        border: `1px solid ${level.color}55`,
        color: level.color,
      }}
    >
      <span className={styles.dot} style={{ background: level.color }} />
      {level.label}
    </span>
  )
}

export default AQIBadge
