import { COUNTRIES } from '../../data/attractions'

export function SearchBar({ searchQuery, onSearchChange, countryFilter, onCountryFilterChange }) {
  return (
    <div className="p-3 space-y-2 border-b border-gray-200 dark:border-slate-700/50">
      {/* Search input */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search attractions…"
          className="w-full bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-slate-400 dark:focus:border-slate-400 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>

      {/* Country filter pills */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => onCountryFilterChange(null)}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
            !countryFilter
              ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900'
              : 'bg-gray-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600'
          }`}
        >
          All
        </button>
        {COUNTRIES.map(c => (
          <button
            key={c.code}
            onClick={() => onCountryFilterChange(countryFilter === c.code ? null : c.code)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              countryFilter === c.code
                ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900'
                : 'bg-gray-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600'
            }`}
          >
            {c.flagEmoji} {c.name}
          </button>
        ))}
      </div>
    </div>
  )
}
