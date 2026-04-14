import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TRIP_CONFIG } from '../data/tripConfig'
import { generateDayRange } from '../utils/dateUtils'

const useTripStore = create(
  persist(
    (set, get) => ({
      // --- Persisted ---
      itinerary: {},
      tripDuration: TRIP_CONFIG.defaultDuration,
      isDark: true,
      customAttractions: [], // user-added locations

      // --- UI state ---
      selectedAttraction: null,
      flyToTarget: null,
      expandedCountries: ['FR', 'NL', 'DE', 'CH', 'IT', 'GR'],
      searchQuery: '',
      countryFilter: null,
      activeTab: 'explore',

      // Sidebar visibility (persisted via partialize below)
      leftSidebarVisible: true,
      rightSidebarVisible: true,

      // Modal state
      showAddModal: false,
      showTransportModal: false,

      // --- Computed ---
      getDays() {
        const { tripDuration } = get()
        const endDate = tripDuration === 'june20' ? TRIP_CONFIG.endDateLong : TRIP_CONFIG.endDateShort
        return generateDayRange(TRIP_CONFIG.startDate, endDate)
      },
      getTotalStops() {
        return Object.values(get().itinerary).reduce((s, stops) => s + stops.length, 0)
      },
      isInItinerary(attractionId) {
        return Object.values(get().itinerary).some(stops => stops.some(s => s.id === attractionId))
      },

      // --- Itinerary ---
      addToDay(attraction, dayIndex) {
        set(state => {
          const day = state.itinerary[dayIndex] ?? []
          if (day.some(s => s.id === attraction.id)) return state
          return { itinerary: { ...state.itinerary, [dayIndex]: [...day, attraction] } }
        })
      },
      removeFromDay(attractionId, dayIndex) {
        set(state => ({
          itinerary: {
            ...state.itinerary,
            [dayIndex]: (state.itinerary[dayIndex] ?? []).filter(s => s.id !== attractionId),
          },
        }))
      },
      moveStop(attractionId, fromDay, toDay, newIndex) {
        set(state => {
          const fromList = [...(state.itinerary[fromDay] ?? [])]
          const attraction = fromList.find(s => s.id === attractionId)
          if (!attraction) return state
          const filteredFrom = fromList.filter(s => s.id !== attractionId)
          const toList = [...(state.itinerary[toDay] ?? []).filter(s => s.id !== attractionId)]
          toList.splice(newIndex, 0, attraction)
          return { itinerary: { ...state.itinerary, [fromDay]: filteredFrom, [toDay]: toList } }
        })
      },
      clearDay(dayIndex) {
        set(state => ({ itinerary: { ...state.itinerary, [dayIndex]: [] } }))
      },
      clearAll() { set({ itinerary: {} }) },

      // --- Custom attractions ---
      addCustomAttraction(attraction) {
        set(state => ({ customAttractions: [...state.customAttractions, attraction] }))
      },
      removeCustomAttraction(id) {
        set(state => ({ customAttractions: state.customAttractions.filter(a => a.id !== id) }))
      },

      // --- UI actions ---
      setFlyTo(attraction) {
        set(state => ({
          flyToTarget: { lat: attraction.lat, lng: attraction.lng, zoom: 13 },
          selectedAttraction: attraction,
          expandedCountries: state.expandedCountries.includes(attraction.countryCode)
            ? state.expandedCountries
            : [...state.expandedCountries, attraction.countryCode],
        }))
      },
      setSelectedAttraction(attraction) {
        if (!attraction) { set({ selectedAttraction: null }); return }
        set(state => ({
          selectedAttraction: attraction,
          expandedCountries: state.expandedCountries.includes(attraction.countryCode)
            ? state.expandedCountries
            : [...state.expandedCountries, attraction.countryCode],
        }))
      },
      toggleCountry(code) {
        set(state => ({
          expandedCountries: state.expandedCountries.includes(code)
            ? state.expandedCountries.filter(c => c !== code)
            : [...state.expandedCountries, code],
        }))
      },
      setSearchQuery(q) { set({ searchQuery: q }) },
      setCountryFilter(code) { set({ countryFilter: code }) },
      setTripDuration(d) { set({ tripDuration: d }) },
      setActiveTab(tab) { set({ activeTab: tab }) },
      toggleTheme() { set(state => ({ isDark: !state.isDark })) },

      // Sidebar
      toggleLeftSidebar() { set(state => ({ leftSidebarVisible: !state.leftSidebarVisible })) },
      toggleRightSidebar() { set(state => ({ rightSidebarVisible: !state.rightSidebarVisible })) },

      // Modals
      openAddModal() { set({ showAddModal: true }) },
      hideAddModal() { set({ showAddModal: false }) },
      openTransportModal() { set({ showTransportModal: true }) },
      hideTransportModal() { set({ showTransportModal: false }) },
    }),
    {
      name: 'europe-trip-planner-v1',
      partialize: state => ({
        itinerary: state.itinerary,
        tripDuration: state.tripDuration,
        isDark: state.isDark,
        customAttractions: state.customAttractions,
        leftSidebarVisible: state.leftSidebarVisible,
        rightSidebarVisible: state.rightSidebarVisible,
      }),
    }
  )
)

export default useTripStore
