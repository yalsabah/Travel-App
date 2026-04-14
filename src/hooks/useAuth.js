import { useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../firebase'

export function useAuth() {
  const [user, setUser] = useState(undefined) // undefined = loading, null = not logged in

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, u => setUser(u ?? null))
    return unsubscribe
  }, [])

  async function signUp(email, password, displayName) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) await updateProfile(cred.user, { displayName })
    return cred.user
  }

  async function signIn(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    return cred.user
  }

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider()
    const cred = await signInWithPopup(auth, provider)
    return cred.user
  }

  async function signOut() {
    await firebaseSignOut(auth)
  }

  return { user, loading: user === undefined, signUp, signIn, signInWithGoogle, signOut }
}
