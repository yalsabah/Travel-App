import { useEffect } from 'react'
import { AppShell } from './components/layout/AppShell'
import { AuthPage } from './components/auth/AuthPage'
import { useAuth } from './hooks/useAuth'
import { useFirestoreSync } from './hooks/useFirestoreSync'
import useTripStore from './store/useTripStore'

function AuthenticatedApp({ user }) {
  // Sync itinerary etc. to Firestore whenever they change
  useFirestoreSync(user)
  return <AppShell />
}

export default function App() {
  const isDark = useTripStore(s => s.isDark)
  const { user, loading } = useAuth()

  // Apply dark/light class on html element
  useEffect(() => {
    const root = document.documentElement
    if (isDark) root.classList.add('dark')
    else root.classList.remove('dark')
  }, [isDark])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="text-4xl animate-pulse">✈️</div>
          <p className="text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return <AuthPage />

  return <AuthenticatedApp user={user} />
}
