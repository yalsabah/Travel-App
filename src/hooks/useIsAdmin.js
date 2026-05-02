import { useAuth } from './useAuth'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || ''

export function useIsAdmin() {
  const { user } = useAuth()
  return Boolean(user && ADMIN_EMAIL && user.email === ADMIN_EMAIL)
}
