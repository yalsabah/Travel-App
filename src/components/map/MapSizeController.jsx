import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import useTripStore from '../../store/useTripStore'

// Must be a child of MapContainer. Calls invalidateSize() whenever
// sidebar visibility/width changes so the map fills its container correctly.
export function MapSizeController({ leftWidth, rightWidth }) {
  const map = useMap()
  const leftVisible  = useTripStore(s => s.leftSidebarVisible)
  const rightVisible = useTripStore(s => s.rightSidebarVisible)

  useEffect(() => {
    // Wait for the CSS transition (300ms) to finish before invalidating
    const t = setTimeout(() => map.invalidateSize(), 320)
    return () => clearTimeout(t)
  }, [leftVisible, rightVisible, leftWidth, rightWidth, map])

  // Also invalidate once on mount to handle initial render
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 100)
    return () => clearTimeout(t)
  }, [map])

  return null
}
