import { CityGroup } from './CityGroup'
import { getCountryStyle } from '../../utils/colorMap'

export function CountryAccordion({ country, isOpen, onToggle }) {
  const style = getCountryStyle(country.code)
  const totalAttractions = country.cities.reduce((sum, c) => sum + c.attractions.length, 0)

  return (
    <div className="border-b border-gray-200 dark:border-slate-700/40">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors text-left"
      >
        <div
          className="w-1 h-6 rounded-full shrink-0"
          style={{ backgroundColor: style.hex }}
        />
        <span className="text-lg leading-none">{country.flagEmoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900 dark:text-white">{country.name}</span>
            <span
              className="text-xs px-1.5 py-0.5 rounded-full font-medium"
              style={{ background: `${style.hex}20`, color: style.hex }}
            >
              {totalAttractions}
            </span>
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            {country.cities.map(c => c.name).join(' · ')}
          </div>
        </div>
        <span className={`text-slate-400 dark:text-slate-500 text-sm transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Content */}
      {isOpen && (
        <div className="pb-2">
          {country.cities.map(city => (
            <CityGroup key={city.name} city={city} />
          ))}
        </div>
      )}
    </div>
  )
}
