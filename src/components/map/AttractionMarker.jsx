import { Marker, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import { getCountryStyle } from '../../utils/colorMap'
import { MarkerPopup } from './MarkerPopup'
import useTripStore from '../../store/useTripStore'

function createPinIcon(color, isInItinerary) {
  const ring = isInItinerary
    ? `<circle cx="14" cy="14" r="11" fill="none" stroke="white" stroke-width="2" opacity="0.8"/>`
    : ''
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 36" width="28" height="36">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22S28 23.333 28 14C28 6.268 21.732 0 14 0z"
        fill="${color}" stroke="rgba(0,0,0,0.25)" stroke-width="1"/>
      <circle cx="14" cy="14" r="6" fill="white" opacity="0.9"/>
      ${ring}
    </svg>
  `
  return L.divIcon({
    html: svg,
    className: 'custom-marker',
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -38],
  })
}

export function AttractionMarker({ attraction }) {
  const { setSelectedAttraction, isInItinerary } = useTripStore()
  const style = getCountryStyle(attraction.countryCode)
  const inPlan = isInItinerary(attraction.id)
  const icon = createPinIcon(style.hex, inPlan)

  return (
    <Marker
      position={[attraction.lat, attraction.lng]}
      icon={icon}
      eventHandlers={{
        // Only set selected — no flyTo so popup opens right where the pin is
        click: () => setSelectedAttraction(attraction),
      }}
    >
      {/* Hover tooltip — shows name immediately on hover */}
      <Tooltip
        direction="top"
        offset={[0, -36]}
        opacity={1}
        className="attraction-tooltip"
      >
        <div className="flex items-center gap-1.5">
          <span>{attraction.flagEmoji}</span>
          <span className="font-semibold text-xs">{attraction.name}</span>
          {attraction.mustSee && <span className="text-amber-400 text-xs">★</span>}
        </div>
      </Tooltip>

      <MarkerPopup attraction={attraction} />
    </Marker>
  )
}
