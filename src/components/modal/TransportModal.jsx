import { useState } from 'react'
import { COUNTRIES } from '../../data/attractions'
import { compareTransport, getAllCities } from '../../utils/transportUtils'
import useTripStore from '../../store/useTripStore'

function TimeBar({ hours, maxHours, color }) {
  const pct = Math.min(100, (hours / maxHours) * 100)
  return (
    <div className="h-2 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  )
}

function CostBar({ min, max, maxCost, color }) {
  const pctMin = Math.min(100, (min / maxCost) * 100)
  const pctMax = Math.min(100, (max / maxCost) * 100)
  return (
    <div className="h-2 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden relative">
      <div className="h-full rounded-full absolute" style={{ left: `${pctMin}%`, width: `${pctMax - pctMin}%`, backgroundColor: color, opacity: 0.6 }} />
      <div className="h-full rounded-full absolute" style={{ left: `${pctMin}%`, width: `${Math.min(4, pctMax - pctMin)}%`, backgroundColor: color }} />
    </div>
  )
}

export function TransportModal() {
  const { hideTransportModal, isDark, customAttractions } = useTripStore()
  const cities = getAllCities(COUNTRIES, customAttractions)

  const [fromIdx, setFromIdx] = useState('')
  const [toIdx, setToIdx]     = useState('')
  const [result, setResult]   = useState(null)

  function handleCompare() {
    if (fromIdx === '' || toIdx === '' || fromIdx === toIdx) return
    const from = cities[Number(fromIdx)]
    const to   = cities[Number(toIdx)]
    setResult(compareTransport(from, to))
  }

  const selectCls = `w-full px-3 py-2.5 text-sm rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:border-slate-400 transition-colors`

  const maxTime = result
    ? Math.max(result.train.hours ?? 0, result.flight.hoursDoorToDoor) * 1.2
    : 10
  const maxCost = result
    ? Math.max(result.train.costMax ?? 0, result.flight.costMax) * 1.2
    : 300

  const WINNER_COLOR = { train: '#22c55e', fly: '#3b82f6', either: '#f59e0b' }
  const winnerColor = result ? WINNER_COLOR[result.winner] : '#94a3b8'

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={hideTransportModal} />

      <div className="relative w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-slate-700">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">🚆 Train vs ✈️ Flight</h2>
            <p className="text-xs text-slate-400 mt-0.5">Compare travel options between two cities</p>
          </div>
          <button
            onClick={hideTransportModal}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-xl"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-4">

          {/* City pickers */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">From</label>
              <select
                value={fromIdx}
                onChange={e => { setFromIdx(e.target.value); setResult(null) }}
                className={selectCls}
                style={{ colorScheme: 'inherit' }}
              >
                <option value="">Select city…</option>
                {cities.map((c, i) => (
                  <option key={i} value={i}>{c.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => { setFromIdx(toIdx); setToIdx(fromIdx); setResult(null) }}
              className="mt-5 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 text-slate-500 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors text-base shrink-0"
              title="Swap"
            >
              ⇄
            </button>

            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">To</label>
              <select
                value={toIdx}
                onChange={e => { setToIdx(e.target.value); setResult(null) }}
                className={selectCls}
                style={{ colorScheme: 'inherit' }}
              >
                <option value="">Select city…</option>
                {cities.map((c, i) => (
                  <option key={i} value={i}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleCompare}
            disabled={fromIdx === '' || toIdx === '' || fromIdx === toIdx}
            className="w-full py-2.5 text-sm font-semibold rounded-xl bg-slate-800 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Compare Routes
          </button>

          {/* ── Results ── */}
          {result && (
            <div className="space-y-3">
              {/* Distance badge */}
              <div className="text-center text-xs text-slate-400">
                Straight-line distance: <span className="font-semibold text-slate-600 dark:text-slate-300">{result.distKm.toLocaleString()} km</span>
                {result.isEstimate && <span className="ml-2 text-amber-500">· estimates only</span>}
              </div>

              {/* Cards */}
              <div className="grid grid-cols-2 gap-3">

                {/* Train card */}
                <div className={`rounded-xl p-4 border-2 transition-all ${
                  result.winner === 'train'
                    ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/40'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg">🚆</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">Train</span>
                    </div>
                    {result.winner === 'train' && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-500 text-white">Recommended</span>
                    )}
                  </div>

                  {result.train.feasible ? (
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500 dark:text-slate-400">Door-to-door</span>
                          <span className="font-bold text-slate-900 dark:text-white">{result.train.hours}h</span>
                        </div>
                        <TimeBar hours={result.train.hours} maxHours={maxTime} color="#22c55e" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500 dark:text-slate-400">Cost range</span>
                          <span className="font-bold text-slate-900 dark:text-white">${result.train.costMin}–${result.train.costMax}</span>
                        </div>
                        <CostBar min={result.train.costMin} max={result.train.costMax} maxCost={maxCost} color="#22c55e" />
                      </div>
                      <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5 mt-2">
                        <li>✓ City centre to city centre</li>
                        <li>✓ No check-in or security</li>
                        <li>✓ Scenic & comfortable</li>
                      </ul>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4 text-center">
                      <span className="text-2xl mb-2">⛔</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">No practical direct train for this route</p>
                    </div>
                  )}
                </div>

                {/* Flight card */}
                <div className={`rounded-xl p-4 border-2 transition-all ${
                  result.winner === 'fly'
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/40'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg">✈️</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">Flight</span>
                    </div>
                    {result.winner === 'fly' && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500 text-white">Recommended</span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500 dark:text-slate-400">Door-to-door</span>
                        <span className="font-bold text-slate-900 dark:text-white">{result.flight.hoursDoorToDoor}h</span>
                      </div>
                      <TimeBar hours={result.flight.hoursDoorToDoor} maxHours={maxTime} color="#3b82f6" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500 dark:text-slate-400">Cost incl. transfers</span>
                        <span className="font-bold text-slate-900 dark:text-white">${result.flight.costMin}–${result.flight.costMax}</span>
                      </div>
                      <CostBar min={result.flight.costMin} max={result.flight.costMax} maxCost={maxCost} color="#3b82f6" />
                    </div>
                    <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5 mt-2">
                      <li>✓ Faster for long distances</li>
                      <li className="text-slate-400">· +{result.flight.hoursDoorToDoor - result.flight.hoursAir}h airport overhead</li>
                      <li className="text-slate-400">· Includes airport transfers</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Verdict banner */}
              <div
                className="rounded-xl p-4 text-sm"
                style={{ background: `${winnerColor}18`, borderLeft: `4px solid ${winnerColor}` }}
              >
                <div className="font-semibold text-slate-900 dark:text-white mb-1">
                  {result.winner === 'train' && '🚆 Take the train'}
                  {result.winner === 'fly'   && '✈️ Fly this one'}
                  {result.winner === 'either'&& '⚖️ Either works'}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{result.reason}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 italic">💡 {result.tip}</p>
              </div>

              <p className="text-xs text-center text-slate-400 dark:text-slate-600">
                All figures are estimates based on typical schedules. Verify on Trainline, DB, or Google Flights.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
