import { logEvent } from 'firebase/analytics'
import {
  doc,
  getDoc,
  setDoc,
  increment,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { db, analyticsPromise } from '../firebase/config'
import type { AnalyticsSummary } from '../types'
import { DEFAULT_ANALYTICS_SUMMARY } from '../types'

const SESSION_PV_KEY = 'portfolio_pv_logged'
const LOCAL_UV_KEY = 'portfolio_uv_date'

/**
 * Safely dispatches a Google Analytics event if the client SDK is supported.
 */
export async function safeLogGaEvent(
  name: string,
  params?: Record<string, string | number | boolean | undefined>
): Promise<void> {
  if (typeof window === 'undefined') return
  try {
    const analytics = await analyticsPromise
    if (analytics) {
      logEvent(analytics, name, params)
    }
  } catch (err) {
    // Non-blocking telemetry warning
    console.debug('[Analytics GA4]', name, err)
  }
}

/**
 * Records a page view and increments the daily unique visitor and aggregate page view counters.
 * Uses atomic Firestore increments and client deduplication.
 */
export async function recordPageView(): Promise<void> {
  if (typeof window === 'undefined') return

  // 1. Log event to GA4
  safeLogGaEvent('page_view', {
    page_location: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
  })

  // 2. Client deduplication check for real-time Firestore counters
  const sessionLogged = sessionStorage.getItem(SESSION_PV_KEY)
  const today = new Date().toISOString().slice(0, 10)
  const lastUvDate = localStorage.getItem(LOCAL_UV_KEY)
  const isNewVisitorToday = lastUvDate !== today

  // If already logged in this tab session and visitor date is current, avoid double-counting on quick re-renders
  if (sessionLogged && !isNewVisitorToday) {
    return
  }

  try {
    sessionStorage.setItem(SESSION_PV_KEY, '1')
    if (isNewVisitorToday) {
      localStorage.setItem(LOCAL_UV_KEY, today)
    }

    const docRef = doc(db, 'analytics', 'summary')
    await setDoc(
      docRef,
      {
        pageViews: increment(1),
        ...(isNewVisitorToday ? { uniqueVisitors: increment(1) } : {}),
        lastUpdated: Date.now(),
      },
      { merge: true }
    )
  } catch (err) {
    console.warn('[Analytics Firestore] Failed recording page view:', err)
  }
}

/**
 * Records when a user clicks the Download CV button in the Hero section.
 */
export async function recordCvDownload(url?: string): Promise<void> {
  safeLogGaEvent('file_download', {
    file_name: 'Maqhawe-Ngwenya-CV.pdf',
    link_url: url ?? '',
  })

  try {
    const docRef = doc(db, 'analytics', 'summary')
    await setDoc(
      docRef,
      {
        cvDownloads: increment(1),
        lastUpdated: Date.now(),
      },
      { merge: true }
    )
  } catch (err) {
    console.warn('[Analytics Firestore] Failed recording CV download:', err)
  }
}

/**
 * Records when a user clicks an external project link (Live demo or GitHub repository).
 */
export async function recordProjectClick(
  title: string,
  destination: 'live' | 'github'
): Promise<void> {
  safeLogGaEvent('select_content', {
    content_type: 'project',
    item_id: title,
    destination,
  })

  try {
    const docRef = doc(db, 'analytics', 'summary')
    await setDoc(
      docRef,
      {
        projectClicks: increment(1),
        lastUpdated: Date.now(),
      },
      { merge: true }
    )
  } catch (err) {
    console.warn('[Analytics Firestore] Failed recording project click:', err)
  }
}

/**
 * Records when a user sends a contact message.
 */
export async function recordContactSubmit(): Promise<void> {
  safeLogGaEvent('generate_lead', {
    method: 'contact_form',
  })

  try {
    const docRef = doc(db, 'analytics', 'summary')
    await setDoc(
      docRef,
      {
        contactSubmissions: increment(1),
        lastUpdated: Date.now(),
      },
      { merge: true }
    )
  } catch (err) {
    console.warn('[Analytics Firestore] Failed recording contact submission:', err)
  }
}

/**
 * Records when a visitor switches the visual theme / accent.
 */
export function recordThemeChange(themeName: string): void {
  safeLogGaEvent('theme_change', {
    theme_name: themeName,
  })
}

/**
 * One-off fetch of the current analytics summary.
 */
export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  try {
    const docRef = doc(db, 'analytics', 'summary')
    const snap = await getDoc(docRef)
    if (snap.exists()) {
      const data = snap.data()
      return {
        pageViews: Number(data.pageViews) || 0,
        uniqueVisitors: Number(data.uniqueVisitors) || 0,
        cvDownloads: Number(data.cvDownloads) || 0,
        projectClicks: Number(data.projectClicks) || 0,
        contactSubmissions: Number(data.contactSubmissions) || 0,
        lastUpdated: Number(data.lastUpdated) || 0,
      }
    }
  } catch (err) {
    console.warn('[Analytics Firestore] Failed fetching summary:', err)
  }
  return DEFAULT_ANALYTICS_SUMMARY
}

/**
 * Real-time listener for the analytics summary, enabling instant live updates in Admin Overview.
 */
export function subscribeToAnalytics(
  onUpdate: (summary: AnalyticsSummary) => void
): Unsubscribe {
  const docRef = doc(db, 'analytics', 'summary')
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data()
        onUpdate({
          pageViews: Number(data.pageViews) || 0,
          uniqueVisitors: Number(data.uniqueVisitors) || 0,
          cvDownloads: Number(data.cvDownloads) || 0,
          projectClicks: Number(data.projectClicks) || 0,
          contactSubmissions: Number(data.contactSubmissions) || 0,
          lastUpdated: Number(data.lastUpdated) || 0,
        })
      } else {
        onUpdate(DEFAULT_ANALYTICS_SUMMARY)
      }
    },
    (err) => {
      console.warn('[Analytics Firestore] Realtime subscription error:', err)
      onUpdate(DEFAULT_ANALYTICS_SUMMARY)
    }
  )
}
