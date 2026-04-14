import { TripMap } from '../map/TripMap'
import useTripStore from '../../store/useTripStore'

export function CenterMap({ leftWidth, rightWidth }) {
  const totalStops        = useTripStore(s => s.getTotalStops())
  const openAddModal      = useTripStore(s => s.openAddModal)
  const openTransportModal = useTripStore(s => s.openTransportModal)

  return (
    <div className="relative h-full overflow-hidden">
      <TripMap leftWidth={leftWidth} rightWidth={rightWidth} />

      {/* ── Floating action buttons (bottom-right) ── */}
      <div className="absolute bottom-10 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={openAddModal}
          title="Add a new location"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 shadow-lg hover:shadow-xl text-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 transition-all text-sm font-semibold"
        >
          <span className="text-base">📍</span> Add Location
        </button>

        <button
          onClick={openTransportModal}
          title="Compare train vs flight"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 shadow-lg hover:shadow-xl text-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 transition-all text-sm font-semibold"
        >
          <span className="text-base">🚆</span> Compare Routes
        </button>
      </div>

      {/* ── Hint overlay ── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[999] pointer-events-none">
        <div className="bg-white/90 dark:bg-slate-900/90 border border-gray-200 dark:border-slate-700 rounded-full px-4 py-1.5 text-xs text-slate-500 dark:text-slate-400 backdrop-blur-sm whitespace-nowrap shadow-sm">
          {totalStops === 0
            ? 'Hover pins to preview · Click for details · Drag cards to plan days'
            : `${totalStops} stop${totalStops !== 1 ? 's' : ''} planned · Route shown as dashed line`}
        </div>
      </div>
    </div>
  )
}
