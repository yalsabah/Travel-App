import { Polyline } from 'react-leaflet'
import useTripStore from '../../store/useTripStore'

export function RouteLine() {
  const itinerary = useTripStore(s => s.itinerary)

  // Flatten all stops in day order
  const positions = Object.keys(itinerary)
    .map(Number)
    .sort((a, b) => a - b)
    .flatMap(dayIndex => (itinerary[dayIndex] ?? []).map(s => [s.lat, s.lng]))

  if (positions.length < 2) return null

  return (
    <Polyline
      positions={positions}
      pathOptions={{
        color: '#94a3b8',
        weight: 2,
        opacity: 0.6,
        dashArray: '6 8',
      }}
    />
  )
}
