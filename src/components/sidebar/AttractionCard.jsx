import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { MustSeeBadge, DayTripBadge } from '../shared/Badge'
import { CategoryIcon, getCategoryLabel } from '../shared/CategoryIcon'
import { getCountryStyle } from '../../utils/colorMap'
import useTripStore from '../../store/useTripStore'

export function AttractionCard({ attraction }) {
  const { setFlyTo, addToDay, getDays, isInItinerary, selectedAttraction } = useTripStore()
  const style = getCountryStyle(attraction.countryCode)
  const days = getDays()
  const alreadyAdded = isInItinerary(attraction.id)
  const isSelected = selectedAttraction?.id === attraction.id

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `sidebar-${attraction.id}`,
    data: { type: 'sidebar', attraction },
  })

  const dragStyle = transform
    ? { transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.4 : 1 }
    : undefined

  return (
    <div
      id={`card-${attraction.id}`}
      ref={setNodeRef}
      style={{ borderLeftColor: style.hex, ...dragStyle }}
      className={`bg-gray-50 dark:bg-slate-800/60 border dark:border-slate-700/50 border-l-[3px] rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all cursor-grab active:cursor-grabbing select-none ${
        isSelected
          ? 'border-gray-300 dark:border-slate-500 shadow-md dark:shadow-slate-900/50 ring-1 ring-inset ring-gray-300 dark:ring-slate-600'
          : 'border-gray-200'
      }`}
      {...attributes}
      {...listeners}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <CategoryIcon category={attraction.category} />
          <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">{attraction.name}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {attraction.mustSee && <MustSeeBadge />}
          {attraction.isDayTrip && <DayTripBadge />}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
        {attraction.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2.5 gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <span>{getCategoryLabel(attraction.category)}</span>
          <span>·</span>
          <span>~{attraction.estimatedHours}h</span>
        </div>

        <div className="flex items-center gap-1.5" onPointerDown={e => e.stopPropagation()}>
          <button
            onClick={() => setFlyTo(attraction)}
            className="px-2 py-1 text-xs rounded-md bg-gray-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            📍 Map
          </button>

          {alreadyAdded ? (
            <span className="px-2 py-1 text-xs rounded-md bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 border border-green-300 dark:border-green-700/30">
              ✓ Added
            </span>
          ) : (
            <select
              onChange={e => {
                if (e.target.value !== '') {
                  addToDay(attraction, Number(e.target.value))
                  e.target.value = ''
                }
              }}
              className="px-2 py-1 text-xs rounded-md bg-gray-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors cursor-pointer focus:outline-none"
              defaultValue=""
              style={{ colorScheme: 'inherit' }}
            >
              <option value="" disabled>+ Add to day</option>
              {days.map((label, i) => (
                <option key={i} value={i}>Day {i + 1} — {label}</option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  )
}
