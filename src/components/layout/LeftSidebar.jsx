import { useEffect, useState } from 'react'
import { SearchBar } from '../sidebar/SearchBar'
import { CountryAccordion } from '../sidebar/CountryAccordion'
import { SettingsModal } from '../settings/SettingsModal'
import { useSearch } from '../../hooks/useSearch'
import useTripStore from '../../store/useTripStore'

export function LeftSidebar() {
  const [showSettings, setShowSettings] = useState(false)

  const {
    searchQuery, setSearchQuery,
    countryFilter, setCountryFilter,
    expandedCountries, toggleCountry,
    selectedAttraction,
    openAddModal,
  } = useTripStore()

  const filtered = useSearch(searchQuery, countryFilter)

  // Scroll sidebar to the selected attraction card when a marker is clicked
  useEffect(() => {
    if (!selectedAttraction) return
    const timer = setTimeout(() => {
      const el = document.getElementById(`card-${selectedAttraction.id}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 180)
    return () => clearTimeout(timer)
  }, [selectedAttraction])

  return (
    <div className="flex flex-col h-full border-r border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-900">

      {/* Fixed: title bar */}
      <div className="shrink-0 px-3 pt-3 pb-3 border-b border-gray-200 dark:border-slate-700/50">
        <div className="flex items-center gap-2">
          <span className="text-lg">✈️</span>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Europe Trip Planner</h1>
            <p className="text-xs text-slate-400">May 31 – Jun 13/20, 2026</p>
          </div>

          {/* Add location */}
          <button
            onClick={openAddModal}
            title="Add new location"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-white transition-colors text-base font-bold shrink-0"
          >
            +
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowSettings(true)}
            title="Settings"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-base shrink-0"
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Fixed: search + country filters */}
      <div className="shrink-0">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          countryFilter={countryFilter}
          onCountryFilterChange={setCountryFilter}
        />
      </div>

      {/* Scrollable: attractions list */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-sm text-slate-400 dark:text-slate-500">
            <span className="text-2xl mb-2">🔍</span>
            No attractions found
          </div>
        ) : (
          filtered.map(country => (
            <CountryAccordion
              key={country.code}
              country={country}
              isOpen={expandedCountries.includes(country.code)}
              onToggle={() => toggleCountry(country.code)}
            />
          ))
        )}
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  )
}
