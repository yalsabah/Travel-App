import useTripStore from '../../store/useTripStore'

export function DurationToggle() {
  const { tripDuration, setTripDuration } = useTripStore()

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
      <button
        onClick={() => setTripDuration('june13')}
        className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold transition-all ${
          tripDuration === 'june13'
            ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 shadow'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'
        }`}
      >
        Jun 13 Return · 14 days
      </button>
      <button
        onClick={() => setTripDuration('june20')}
        className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold transition-all ${
          tripDuration === 'june20'
            ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 shadow'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'
        }`}
      >
        Jun 20 Return · 21 days
      </button>
    </div>
  )
}
