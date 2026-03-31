import React from 'react'
import styles from './Spinner.module.css'

const Spinner = ({ text = 'Loading…' }) => (
  <div className={styles.wrapper}>
    <div className={styles.loader} />
    <p className={styles.text}>{text}</p>
  </div>
)

export default Spinner
