import React, { createContext, useContext, useState, useCallback } from 'react'

const LocationContext = createContext(null)

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null) // { lat, lon, name }

  const updateLocation = useCallback((lat, lon, name) => {
    setLocation({ lat: parseFloat(lat.toFixed(4)), lon: parseFloat(lon.toFixed(4)), name })
  }, [])

  return (
    <LocationContext.Provider value={{ location, updateLocation }}>
      {children}
    </LocationContext.Provider>
  )
}

export const useLocation = () => {
  const ctx = useContext(LocationContext)
  if (!ctx) throw new Error('useLocation must be used within LocationProvider')
  return ctx
}
