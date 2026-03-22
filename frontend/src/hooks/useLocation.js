import { useState, useEffect } from "react"

export const useLocation = () => {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported")
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      }),
      () => {
        // Default to OAU campus center if denied
        setLocation({ lat: 7.5227, lng: 4.5198 })
      }
    )
  }, [])

  return { location, error }
}