import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CategoryIcon } from '../shared/CategoryIcon'
import { getCountryStyle } from '../../utils/colorMap'
import useTripStore from '../../store/useTripStore'

export function ItineraryStop({ attraction, dayIndex, stopIndex }) {
  const { removeFromDay, setFlyTo } = useTripStore()
  const style = getCountryStyle(attraction.countryCode)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `stop-${attraction.id}-day-${dayIndex}`,
    data: { type: 'stop', attraction, dayIndex, stopIndex },
  })

  const dragStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={{ borderLeftColor: style.hex, ...dragStyle }}
      className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700/50 border-l-[3px] rounded-lg px-2.5 py-2 group shadow-sm dark:shadow-none"
    >
      {/* Drag handle */}
      <button
        className="text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 cursor-grab active:cursor-grabbing shrink-0 touch-none"
        {...attributes}
        {...listeners}
      >
        ⠿
      </button>

      {/* Icon + name */}
      <button
        className="flex items-center gap-1.5 flex-1 min-w-0 text-left hover:opacity-80 transition-opacity"
        onClick={() => setFlyTo(attraction)}
      >
        <CategoryIcon category={attraction.category} className="shrink-0 text-sm" />
        <div className="min-w-0">
          <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">{attraction.name}</div>
          <div className="text-xs text-slate-400 dark:text-slate-500">{attraction.city}</div>
        </div>
      </button>

      <span className="text-xs text-slate-400 dark:text-slate-600 shrink-0">~{attraction.estimatedHours}h</span>

      <button
        onClick={() => removeFromDay(attraction.id, dayIndex)}
        className="text-slate-400 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors shrink-0 opacity-0 group-hover:opacity-100 text-base leading-none"
        title="Remove"
      >
        ×
      </button>
    </div>
  )
}
