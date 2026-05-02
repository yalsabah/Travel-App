import { MapContainer, TileLayer } from 'react-leaflet'
import { COUNTRIES } from '../../data/attractions'
import { AttractionMarker } from './AttractionMarker'
import { FlyToController } from './FlyToController'
import { RouteLine } from './RouteLine'
import { MapSizeController } from './MapSizeController'
import { useIsAdmin } from '../../hooks/useIsAdmin'
import useTripStore from '../../store/useTripStore'

export function TripMap({ leftWidth, rightWidth }) {
  const isDark            = useTripStore(s => s.isDark)
  const customAttractions = useTripStore(s => s.customAttractions)
  const isAdmin           = useIsAdmin()

  const tileUrl = isDark
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

  const bgColor = isDark ? '#1a1a2e' : '#d4dadc'

  return (
    <MapContainer
      center={[48.5, 12]}
      zoom={5}
      style={{ height: '100%', width: '100%', background: bgColor }}
      zoomControl={true}
    >
      <TileLayer
        key={isDark ? 'dark' : 'light'}
        url={tileUrl}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={19}
        minZoom={2}
        keepBuffer={8}
        updateWhenIdle={false}
        detectRetina={true}
      />

      {/* Built-in attractions — admin only */}
      {isAdmin && COUNTRIES.flatMap(country =>
        country.cities.flatMap(city =>
          city.attractions.map(attraction => (
            <AttractionMarker key={attraction.id} attraction={attraction} />
          ))
        )
      )}

      {/* User-added custom attractions */}
      {customAttractions.map(attraction => (
        <AttractionMarker key={attraction.id} attraction={attraction} />
      ))}

      <RouteLine />
      <FlyToController />
      <MapSizeController leftWidth={leftWidth} rightWidth={rightWidth} />
    </MapContainer>
  )
}
