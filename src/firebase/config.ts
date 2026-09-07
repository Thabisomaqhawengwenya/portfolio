import { initializeApp, getApps } from 'firebase/app'
import { getAuth }      from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey:            'AIzaSyCenJUi43hnD80VNK-aKx4YYk6v7oew0RI',
  authDomain:        'portfolio-13662.firebaseapp.com',
  projectId:         'portfolio-13662',
  storageBucket:     'portfolio-13662.firebasestorage.app',
  messagingSenderId: '892518225274',
  appId:             '1:892518225274:web:da810e00c8f55da97ff2c3',
  measurementId:     'G-WYTDKSMD0G',
}

/* Avoid re-initialising on HMR */
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const auth = getAuth(app)
export const db   = getFirestore(app)

/* Analytics — browser-only, non-blocking */
export const analyticsPromise = isSupported().then(yes => yes ? getAnalytics(app) : null)

export default app
