export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371e3
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const meters = R * c
  return meters < 1000
    ? `${Math.round(meters)}m`
    : `${(meters / 1000).toFixed(1)}km`
}

export const CATEGORY_COLORS = {
  food: "#FF6B6B",
  printing: "#4ECDC4",
  hair: "#FFE66D",
  fashion: "#A855F7",
  services: "#3B82F6",
  places: "#10B981",
}

export const CATEGORIES = ["food", "printing", "hair", "fashion", "services"]
