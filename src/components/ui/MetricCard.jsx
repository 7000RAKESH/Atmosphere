import React from 'react'
import styles from './MetricCard.module.css'

const MetricCard = ({ label, value, unit, sub, accent, icon, large }) => (
  <div className={styles.card} style={{ borderColor: accent ? `${accent}30` : undefined }}>
    <div className={styles.label}>{label}</div>
    <div className={`${styles.value} ${large ? styles.large : ''}`} style={{ color: accent || undefined }}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span>{value ?? '—'}</span>
      {unit && <span className={styles.unit}>{unit}</span>}
    </div>
    {sub && <div className={styles.sub}>{sub}</div>}
  </div>
)

export default MetricCard
