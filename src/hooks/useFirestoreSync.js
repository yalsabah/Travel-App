import { useEffect, useRef } from 'react'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import useTripStore from '../store/useTripStore'

// Syncs itinerary, customAttractions, tripDuration, isDark to Firestore
// under users/{uid}/tripData. Loads from Firestore when user signs in.
export function useFirestoreSync(user) {
  const store = useTripStore()
  const initialLoadDone = useRef(false)
  const syncTimeoutRef  = useRef(null)

  // Load from Firestore when user first signs in
  useEffect(() => {
    if (!user) { initialLoadDone.current = false; return }

    async function load() {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid, 'data', 'tripData'))
        if (snap.exists()) {
          const data = snap.data()
          // Hydrate store — only fields we sync
          useTripStore.setState({
            ...(data.itinerary          != null && { itinerary: data.itinerary }),
            ...(data.tripDuration       != null && { tripDuration: data.tripDuration }),
            ...(data.customAttractions  != null && { customAttractions: data.customAttractions }),
            ...(data.isDark             != null && { isDark: data.isDark }),
          })
        }
      } catch (e) {
        console.warn('Firestore load failed:', e)
      } finally {
        initialLoadDone.current = true
      }
    }
    load()
  }, [user])

  // Debounced write on any relevant state change
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
