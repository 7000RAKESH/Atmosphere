import React from 'react'
import styles from './SectionHeader.module.css'

const SectionHeader = ({ title, pill, extra }) => (
  <div className={styles.header}>
    <h2 className={styles.title}>{title}</h2>
    {pill && <span className={styles.pill}>{pill}</span>}
    {extra && <div className={styles.extra}>{extra}</div>}
    <div className={styles.divider} />
  </div>
)

export default SectionHeader
