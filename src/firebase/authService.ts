import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { auth } from './config'

/** Sign in with email + password. Returns the Firebase User on success. */
export async function loginWithEmail(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

/** Sign out the current user. */
export async function logout(): Promise<void> {
  await signOut(auth)
}

/** Subscribe to auth state changes. Returns the unsubscribe function. */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback)
}

/** Get the currently authenticated user (synchronous snapshot). */
export function getCurrentUser(): User | null {
  return auth.currentUser
}
