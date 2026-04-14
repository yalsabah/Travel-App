/**
 * Haversine formula — returns distance in km between two lat/lng points.
 */
export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/**
 * Estimate travel time between two attractions.
 * Uses ~250 km/h average for intercity rail/flight as rough heuristic.
 * Returns a formatted label like "~45 min" or "~2h by train".
 */
export function estimateTravelTime(stopA, stopB) {
  const km = haversineKm(stopA.lat, stopA.lng, stopB.lat, stopB.lng)
  if (km < 5) return '~10 min walk'
  if (km < 30) return `~${Math.round(km * 3)} min`  // ~20 km/h local transit
  const hours = km / 200  // 200 km/h avg intercity
  if (hours < 1) return `~${Math.round(hours * 60)} min by train`
  if (hours < 2) return `~${hours.toFixed(1)}h by train`
  return `~${Math.round(hours)}h by train`
}
