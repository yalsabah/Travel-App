import { useEffect, useRef } from 'react'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import useTripStore from '../store/useTripStore'
import { TRIP_CONFIG } from '../data/tripConfig'

// Default state for a brand-new user (empty slate)
const EMPTY_STATE = {
  itinerary:         {},
  customAttractions: [],
  tripDuration:      TRIP_CONFIG.defaultDuration,
}

export function useFirestoreSync(user) {
  const store = useTripStore()
  const initialLoadDone = useRef(false)
  const syncTimeoutRef  = useRef(null)
  const lastUidRef      = useRef(null)

  // ── Load (or reset) whenever the logged-in user changes ──
  useEffect(() => {
    // User signed out — reset to empty defaults
    if (!user) {
      useTripStore.setState(EMPTY_STATE)
      initialLoadDone.current = false
      lastUidRef.current = null
      return
    }

    // Same user still logged in — don't re-load
    if (lastUidRef.current === user.uid) return
    lastUidRef.current = user.uid
    initialLoadDone.current = false

    async function load() {
      // Always wipe previous user's data from the store first
      useTripStore.setState(EMPTY_STATE)

      try {
        const snap = await getDoc(doc(db, 'users', user.uid, 'data', 'tripData'))
        if (snap.exists()) {
          const data = snap.data()
          useTripStore.setState({
            ...(data.itinerary          != null && { itinerary:         data.itinerary }),
            ...(data.tripDuration       != null && { tripDuration:       data.tripDuration }),
            ...(data.customAttractions  != null && { customAttractions:  data.customAttractions }),
            ...(data.isDark             != null && { isDark:             data.isDark }),
          })
        }
        // No Firestore doc = new user → stays on empty defaults above
      } catch (e) {
        console.warn('Firestore load failed:', e)
      } finally {
        initialLoadDone.current = true
      }
    }
    load()
  }, [user])

  // ── Debounced write on any store change ──
  useEffect(() => {
    if (!user || !initialLoadDone.current) return

    clearTimeout(syncTimeoutRef.current)
    syncTimeoutRef.current = setTimeout(async () => {
      try {
        await setDoc(
          doc(db, 'users', user.uid, 'data', 'tripData'),
          {
            itinerary:         store.itinerary,
            tripDuration:      store.tripDuration,
            customAttractions: store.customAttractions,
            isDark:            store.isDark,
            updatedAt:         new Date().toISOString(),
          },
          { merge: true }
        )
      } catch (e) {
        console.warn('Firestore sync failed:', e)
      }
    }, 1500)

    return () => clearTimeout(syncTimeoutRef.current)
  }, [user, store.itinerary, store.tripDuration, store.customAttractions, store.isDark])
}
