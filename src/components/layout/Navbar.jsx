import React from 'react'
import { useLocation } from '../../context/LocationContext'
import styles from './Navbar.module.css'

const Navbar = ({ activePage, onPageChange }) => {
  const { location } = useLocation()

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <span className={styles.brand}>AtmoSphere</span>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activePage === 1 ? styles.active : ''}`}
            onClick={() => onPageChange(1)}
          >
            <span className={styles.tabIcon}>⛅</span>
            <span>Today</span>
          </button>
          <button
            className={`${styles.tab} ${activePage === 2 ? styles.active : ''}`}
            onClick={() => onPageChange(2)}
          >
            <span className={styles.tabIcon}>📈</span>
            <span>Historical</span>
          </button>
        </div>

        {location && (
          <div className={styles.locationBadge}>
            <span className={styles.dot} />
            <span className={styles.locName}>{location.name}</span>
            <span className={styles.coords}>
              {location.lat}°, {location.lon}°
            </span>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
