import { useState, useEffect } from 'react'

export const useGeolocation = () => {
  const [state, setState] = useState({
    loading: true,
    error: null,
    coords: null,
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ loading: false, error: 'Geolocation not supported by your browser.', coords: null })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          loading: false,
          error: null,
          coords: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
        })
      },
      (err) => {
        setState({
          loading: false,
          error: err.code === 1
            ? 'Location access denied. Please search for a city.'
            : 'Unable to retrieve your location.',
          coords: null,
        })
      },
      { timeout: 8000, maximumAge: 60000 }
    )
  }, [])

  return state
}
