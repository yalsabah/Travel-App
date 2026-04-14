import { DurationToggle } from './DurationToggle'
import { DayColumn } from './DayColumn'
import useTripStore from '../../store/useTripStore'

export function DayPlanner() {
  const { getDays, getTotalStops, clearAll } = useTripStore()
  const days = getDays()
  const totalStops = getTotalStops()

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-slate-700/50 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">My Itinerary</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {totalStops === 0
                ? 'Add stops from the map or sidebar'
                : `${totalStops} stop${totalStops !== 1 ? 's' : ''} planned`}
            </p>
          </div>
          {totalStops > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-slate-400 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
        <DurationToggle />
      </div>

      {/* Scrollable day columns — min-h-0 required for flex child overflow to work */}
      <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto p-3">
        <div className="flex gap-3 pb-2" style={{ minWidth: 'max-content' }}>
          {days.map((dateLabel, i) => (
            <DayColumn key={i} dayIndex={i} dateLabel={dateLabel} />
          ))}
        </div>
      </div>
    </div>
  )
}
