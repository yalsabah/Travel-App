import { Popup } from 'react-leaflet'
import { MustSeeBadge, DayTripBadge } from '../shared/Badge'
import { CategoryIcon, getCategoryLabel } from '../shared/CategoryIcon'
import { getCountryStyle } from '../../utils/colorMap'
import useTripStore from '../../store/useTripStore'

export function MarkerPopup({ attraction }) {
  const { addToDay, getDays, isInItinerary, isDark } = useTripStore()
  const style = getCountryStyle(attraction.countryCode)
  const days = getDays()
  const alreadyAdded = isInItinerary(attraction.id)

  return (
    <Popup
      minWidth={260}
      maxWidth={300}
      // Disable auto-pan so clicking a pin never moves the map
      autoPan={false}
    >
      <div className={`p-3 min-w-[240px] ${isDark ? 'popup-dark' : 'popup-light'}`}>
        {/* Color bar */}
        <div
          className="h-1 rounded-t-sm -mx-3 -mt-3 mb-3"
          style={{ backgroundColor: style.hex }}
        />

        {/* Flag + location */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-base">{attraction.flagEmoji}</span>
          <span className="popup-meta">{attraction.country} · {attraction.city}</span>
        </div>

        {/* Title */}
        <div className="flex items-start gap-2 mb-2">
          <CategoryIcon category={attraction.category} className="mt-0.5 shrink-0" />
          <h3 className="popup-title">{attraction.name}</h3>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {attraction.mustSee && <MustSeeBadge />}
          {attraction.isDayTrip && <DayTripBadge />}
          <span className="popup-badge">{getCategoryLabel(attraction.category)}</span>
          <span className="popup-badge">~{attraction.estimatedHours}h</span>
        </div>

        {/* Description */}
        <p className="popup-desc">{attraction.description}</p>

        {/* Add to itinerary */}
        {alreadyAdded ? (
          <div className="w-full py-1.5 text-xs text-center rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700/30 mt-3">
            ✓ Already in your itinerary
          </div>
        ) : (
          <select
            onChange={e => {
              if (e.target.value !== '') {
                addToDay(attraction, Number(e.target.value))
                e.target.value = ''
              }
            }}
            className="w-full mt-3 py-1.5 px-3 text-xs rounded-lg popup-select focus:outline-none cursor-pointer"
            defaultValue=""
          >
            <option value="" disabled>+ Add to itinerary</option>
            {days.map((label, i) => (
              <option key={i} value={i}>Day {i + 1} — {label}</option>
            ))}
          </select>
        )}
      </div>
    </Popup>
  )
}
