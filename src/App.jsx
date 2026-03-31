import React, { useState } from 'react'
import { LocationProvider, useLocation } from './context/LocationContext'
import LocationModal from './components/layout/LocationModal'
import Navbar from './components/layout/Navbar'
import CurrentWeatherPage from './pages/CurrentWeatherPage'
import HistoricalPage from './pages/HistoricalPage'
import styles from './App.module.css'

const AppInner = () => {
  const { location } = useLocation()
  const [activePage, setActivePage] = useState(1)

  if (!location) {
    return <LocationModal />
  }

  return (
    <div className={styles.app}>
      <Navbar activePage={activePage} onPageChange={setActivePage} />
      <main className={styles.main}>
        {activePage === 1 && <CurrentWeatherPage />}
        {activePage === 2 && <HistoricalPage />}
      </main>
    </div>
  )
}

const App = () => (
  <LocationProvider>
    <AppInner />
  </LocationProvider>
)

export default App
