import { AttractionCard } from './AttractionCard'

export function CityGroup({ city }) {
  if (city.attractions.length === 0) return null

  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 px-3 py-1.5">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider">{city.name}</span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-slate-700/60" />
        <span className="text-xs text-slate-400 dark:text-slate-600">{city.attractions.length}</span>
      </div>
      <div className="px-3 space-y-2">
        {city.attractions.map(attraction => (
          <AttractionCard key={attraction.id} attraction={attraction} />
        ))}
      </div>
    </div>
  )
}
