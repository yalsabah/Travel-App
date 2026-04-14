import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { ItineraryStop } from './ItineraryStop'
import { estimateTravelTime } from '../../utils/geoUtils'
import useTripStore from '../../store/useTripStore'

export function DayColumn({ dayIndex, dateLabel }) {
  const itinerary = useTripStore(s => s.itinerary)
  const clearDay = useTripStore(s => s.clearDay)
  const stops = itinerary[dayIndex] ?? []

  const { setNodeRef, isOver } = useDroppable({
    id: `day-${dayIndex}`,
    data: { type: 'day', dayIndex },
  })

  const sortableIds = stops.map(s => `stop-${s.id}-day-${dayIndex}`)
  const totalHours = stops.reduce((sum, s) => sum + s.estimatedHours, 0)

  return (
    <div className="shrink-0 w-64 flex flex-col">
      {/* Day header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-xs font-bold text-slate-900 dark:text-white">Day {dayIndex + 1}</div>
          <div className="text-xs text-slate-400 dark:text-slate-500">{dateLabel}</div>
        </div>
        <div className="flex items-center gap-2">
          {stops.length > 0 && (
            <span className="text-xs text-slate-400 dark:text-slate-500">~{totalHours}h total</span>
          )}
          {stops.length > 0 && (
            <button
              onClick={() => clearDay(dayIndex)}
              className="text-xs text-slate-400 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[80px] rounded-xl border-2 border-dashed transition-all p-2 space-y-1.5 ${
          isOver
            ? 'border-indigo-500/60 bg-indigo-50 dark:bg-indigo-500/10'
            : stops.length === 0
            ? 'border-gray-300 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-800/20'
            : 'border-transparent bg-gray-50/50 dark:bg-slate-800/20'
        }`}
      >
        {stops.length === 0 ? (
          <div className="flex items-center justify-center h-16 text-xs text-slate-400 dark:text-slate-600">
            Drop stops here
          </div>
        ) : (
          <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
            {stops.map((stop, i) => (
              <div key={stop.id}>
                <ItineraryStop
                  attraction={stop}
                  dayIndex={dayIndex}
                  stopIndex={i}
                />
                {i < stops.length - 1 && (
                  <div className="flex items-center gap-1 py-0.5 px-2">
                    <div className="flex-1 h-px border-t border-dashed border-gray-300 dark:border-slate-700/50" />
                    <span className="text-xs text-slate-400 dark:text-slate-600 shrink-0">
                      {estimateTravelTime(stop, stops[i + 1])}
                    </span>
                    <div className="flex-1 h-px border-t border-dashed border-gray-300 dark:border-slate-700/50" />
                  </div>
                )}
              </div>
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  )
}
