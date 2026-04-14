import { useMemo } from 'react'
import { COUNTRIES } from '../data/attractions'
import useTripStore from '../store/useTripStore'

export function useSearch(searchQuery, countryFilter) {
  const customAttractions = useTripStore(s => s.customAttractions)

  return useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    // Build a virtual "My Places" country from custom attractions
    const customCountry = customAttractions.length > 0 ? {
      code: 'CUSTOM',
      name: 'My Places',
      flagEmoji: '📍',
      cities: [{
        name: 'Custom Locations',
        lat: 0, lng: 0,
        attractions: customAttractions.filter(a =>
          !q ||
          a.name.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
        ),
      }].filter(c => c.attractions.length > 0),
    } : null

    const base = [
      ...COUNTRIES,
      ...(customCountry ? [customCountry] : []),
    ]

    return base
      .filter(c => !countryFilter || c.code === countryFilter)
      .map(country => ({
        ...country,
        cities: country.cities
          .map(city => ({
            ...city,
            attractions: city.attractions.filter(a =>
              !q ||
              a.name.toLowerCase().includes(q) ||
              a.city.toLowerCase().includes(q) ||
              a.description.toLowerCase().includes(q)
            ),
          }))
          .filter(city => city.attractions.length > 0),
      }))
      .filter(country => country.cities.length > 0)
  }, [searchQuery, countryFilter, customAttractions])
}
