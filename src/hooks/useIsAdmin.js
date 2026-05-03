import { useAuth } from './useAuth'

// Fallback to hardcoded value so it works on Netlify without env vars
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'yousif2alsabah@gmail.com'

export function useIsAdmin() {
  const { user } = useAuth()
  return Boolean(user && user.email === ADMIN_EMAIL)
}
