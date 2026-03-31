import React from 'react'
import styles from './ErrorMessage.module.css'

const ErrorMessage = ({ title = 'Something went wrong', message, onRetry }) => (
  <div className={styles.wrapper}>
    <div className={styles.icon}>⛅</div>
    <h3 className={styles.title}>{title}</h3>
    <p className={styles.message}>{message}</p>
    {onRetry && (
      <button className={styles.btn} onClick={onRetry}>
        Try Again
      </button>
    )}
  </div>
)

export default ErrorMessage
