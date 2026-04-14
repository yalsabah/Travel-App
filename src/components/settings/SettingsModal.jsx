import { useAuth } from '../../hooks/useAuth'
import useTripStore from '../../store/useTripStore'

export function SettingsModal({ onClose }) {
  const { user, signOut } = useAuth()
  const isDark      = useTripStore(s => s.isDark)
  const toggleTheme = useTripStore(s => s.toggleTheme)
  const clearAll    = useTripStore(s => s.clearAll)

  async function handleSignOut() {
    await signOut()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          {/* Account info */}
          {user && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800">
              {user.photoURL ? (
                <img src={user.photoURL} alt="avatar" className="w-9 h-9 rounded-full object-cover" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 text-sm font-bold">
                  {(user.displayName || user.email || '?')[0].toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                {user.displayName && (
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.displayName}</p>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          )}

          {/* Appearance */}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Appearance</p>
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{isDark ? '🌙' : '☀️'}</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
              {/* Toggle pill */}
              <div className={`relative w-10 h-5 rounded-full transition-colors ${isDark ? 'bg-blue-500' : 'bg-gray-200'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isDark ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
            </button>
          </div>

          {/* Trip */}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Trip</p>
            <button
              onClick={() => { if (confirm('Clear all planned days? This cannot be undone.')) { clearAll(); onClose() } }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <span className="text-base">🗑️</span>
              <span className="text-sm font-medium">Clear All Planned Days</span>
            </button>
          </div>

          {/* Sign out */}
          {user && (
            <div className="pt-1 border-t border-gray-100 dark:border-slate-800">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="text-base">👋</span>
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
