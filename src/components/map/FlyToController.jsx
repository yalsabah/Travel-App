import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import useTripStore from '../../store/useTripStore'

export function FlyToController() {
  const map = useMap()
  const flyToTarget = useTripStore(s => s.flyToTarget)

  useEffect(() => {
    if (flyToTarget) {
      map.flyTo([flyToTarget.lat, flyToTarget.lng], flyToTarget.zoom ?? 14, {
        duration: 1.2,
      })
    }
  }, [flyToTarget, map])

  return null
}
