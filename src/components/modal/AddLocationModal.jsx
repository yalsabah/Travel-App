import { useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import useTripStore from '../../store/useTripStore'
import { COLOR_MAP } from '../../utils/colorMap'

const CATEGORIES = ['landmark', 'museum', 'nature', 'cruise', 'palace', 'religious', 'district']
const CATEGORY_ICONS = {
  landmark: '🏛️', museum: '🖼️', nature: '⛰️',
  cruise: '🚢', palace: '🏰', religious: '⛪', district: '🏘️',
}

async function geocodeSearch(query) {
  if (!query.trim()) return []
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6&addressdetails=1`
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
    return await res.json()
  } catch { return [] }
}

// Helper to recenter the mini-map when a result is selected
function MapRecenter({ lat, lng }) {
  const map = useMap()
  map.setView([lat, lng], 14)
  return null
}

export function AddLocationModal() {
  const { isDark, hideAddModal, addCustomAttraction } = useTripStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults]         = useState([])
  const [searching, setSearching]     = useState(false)
  const [selected, setSelected]       = useState(null)
  const [name, setName]               = useState('')
  const [country, setCountry]         = useState('')
  const [city, setCity]               = useState('')
  const [category, setCategory]       = useState('landmark')
  const [description, setDescription] = useState('')
  const [mustSee, setMustSee]         = useState(false)
  const [estimatedHours, setEstimatedHours] = useState(2)
  const debounceRef = useRef(null)

  function handleSearchChange(e) {
    const val = e.target.value
    setSearchQuery(val)
    clearTimeout(debounceRef.current)
    if (!val.trim()) { setResults([]); return }
    setSearching(true)
    debounceRef.current = setTimeout(async () => {
      const data = await geocodeSearch(val)
      setResults(data)
      setSearching(false)
    }, 500)
  }

  function selectResult(result) {
    const shortName = result.display_name.split(',')[0].trim()
    const addr = result.address ?? {}
    setSelected({ lat: parseFloat(result.lat), lng: parseFloat(result.lon) })
    setSearchQuery(shortName)
    setResults([])
    if (!name) setName(shortName)
    if (!city) setCity(addr.city || addr.town || addr.village || addr.county || '')
    if (!country) {
      const code = (addr.country_code ?? '').toUpperCase()
      if (COLOR_MAP[code]) setCountry(code)
    }
  }

  function handleSubmit() {
    if (!selected || !name.trim()) return
    const code        = country || 'XX'
    const countryName = country ? (COLOR_MAP[country]?.name ?? 'My Places') : 'My Places'
    const flagEmoji   = country ? (COLOR_MAP[country]?.flag ?? '📍') : '📍'
    addCustomAttraction({
      id: `custom-${Date.now()}`,
      name: name.trim(),
      countryCode: code,
      country: countryName,
      city: city.trim() || 'Custom Location',
      category,
      description: description.trim() || 'Custom location added to the trip.',
      lat: selected.lat,
      lng: selected.lng,
      mustSee,
      flagEmoji,
      isDayTrip: false,
      estimatedHours: Number(estimatedHours),
      custom: true,
    })
    hideAddModal()
  }

  const inputCls = `w-full px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 transition-colors`
  const labelCls = `block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5`

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={hideAddModal}
      />

      {/* Modal card */}
      <div className="relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-slate-700">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Add New Location</h2>
            <p className="text-xs text-slate-400 mt-0.5">Search any place on the map and add it to your trip</p>
          </div>
          <button
            onClick={hideAddModal}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">

          {/* ── Geocoding search ── */}
          <div>
            <label className={labelCls}>Search Location on Map</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Type a city, landmark, or address…"
                className={`${inputCls} pl-9`}
                autoFocus
              />
              {searching && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 animate-pulse">Searching…</span>
              )}
            </div>

            {/* Results dropdown */}
            {results.length > 0 && (
              <div className="mt-1 rounded-xl border border-gray-200 dark:border-slate-600 overflow-hidden shadow-xl z-10 relative">
                {results.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => selectResult(r)}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-slate-700 border-b border-gray-100 dark:border-slate-700 last:border-0 transition-colors bg-white dark:bg-slate-800"
                  >
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {r.display_name.split(',')[0]}
                    </div>
                    <div className="text-xs text-slate-400 truncate mt-0.5">{r.display_name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Mini map preview ── */}
          {selected && (
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-slate-600 shadow-sm" style={{ height: 200 }}>
              <MapContainer
                center={[selected.lat, selected.lng]}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
                attributionControl={false}
                scrollWheelZoom={true}
              >
                <TileLayer
                  url={isDark
                    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'}
                  subdomains="abcd"
                />
                <Marker position={[selected.lat, selected.lng]} icon={L.icon({
                  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                  iconSize: [25, 41], iconAnchor: [12, 41],
                })} />
                <MapRecenter lat={selected.lat} lng={selected.lng} />
              </MapContainer>
            </div>
          )}

          {/* ── Form fields ── */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Sagrada Família"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>City</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="e.g. Barcelona"
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Country</label>
              <select value={country} onChange={e => setCountry(e.target.value)} className={inputCls} style={{ colorScheme: 'inherit' }}>
                <option value="">📍 My Places</option>
                {Object.entries(COLOR_MAP).map(([code, c]) => (
                  <option key={code} value={code}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className={inputCls} style={{ colorScheme: 'inherit' }}>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{CATEGORY_ICONS[c]} {c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className={labelCls}>Description (optional)</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Brief description…"
                rows={2}
                className={`${inputCls} resize-none`}
              />
            </div>
            <div>
              <label className={labelCls}>Visit Time (h)</label>
              <input
                type="number"
                min={0.5}
                max={12}
                step={0.5}
                value={estimatedHours}
                onChange={e => setEstimatedHours(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <div
              onClick={() => setMustSee(v => !v)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                mustSee
                  ? 'bg-amber-500 border-amber-500 text-white'
                  : 'border-gray-300 dark:border-slate-600'
              }`}
            >
              {mustSee && <span className="text-xs leading-none">✓</span>}
            </div>
            <span className="text-sm text-slate-700 dark:text-slate-300">Mark as Must-See ★</span>
          </label>
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
          <p className="text-xs text-slate-400">
            {selected
              ? `📍 ${selected.lat.toFixed(4)}, ${selected.lng.toFixed(4)}`
              : 'Search a location above to pin it on the map'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={hideAddModal}
              className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selected || !name.trim()}
              className="px-5 py-2 text-sm font-semibold rounded-lg bg-slate-800 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add to Trip
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
