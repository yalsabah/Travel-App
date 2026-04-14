import { DayPlanner } from '../itinerary/DayPlanner'
import useTripStore from '../../store/useTripStore'

export function RightPanel() {
  const openTransportModal = useTripStore(s => s.openTransportModal)

  return (
    <div className="flex flex-col h-full border-l border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-900">
      {/* Transport comparison button — pinned at top */}
      <div className="shrink-0 px-3 pt-3 pb-2 border-b border-gray-200 dark:border-slate-700/40">
        <button
          onClick={openTransportModal}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 transition-colors"
        >
          <span>🚆</span> Compare Train vs Flight <span>✈️</span>
        </button>
      </div>

      <DayPlanner />
    </div>
  )
}
