import React from 'react'
import styles from './ChartCard.module.css'

const ChartCard = ({ title, badge, badgeColor = 'blue', minWidth = 800, children }) => (
  <div className={styles.wrapper}>
    <div className={styles.header}>
      <span className={styles.title}>{title}</span>
      {badge && (
        <span className={`${styles.badge} ${styles[badgeColor]}`}>{badge}</span>
      )}
    </div>
    <div className={styles.scrollContainer}>
      <div style={{ minWidth, padding: '16px 12px 8px' }}>
        {children}
      </div>
    </div>
  </div>
)

export default ChartCard
