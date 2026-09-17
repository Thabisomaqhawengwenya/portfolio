import {
  collection, doc,
  getDocs, getDoc, addDoc, setDoc, deleteDoc,
  query, orderBy, serverTimestamp, Timestamp,
} from 'firebase/firestore'
import { db } from './config'
import type { Project, SkillGroup, ExperienceItem, HeroContent, Certificate } from '../types'
import type { Message, AdminSettings } from '../admin/context/AdminContext'

const COL = {
  messages:     'messages',
  projects:     'projects',
  skills:       'skills',
  settings:     'settings',
  journey:      'journey',
  hero:         'heroContent',
  certificates: 'certificates',
} as const

/**
 * Sanitizes object by removing any keys with `undefined` values.
 * Firestore strictly rejects `undefined` values during document write operations.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cleanFirestoreData<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {}
  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined) continue
    if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Timestamp) && !(val instanceof Date)) {
      result[key] = cleanFirestoreData(val)
    } else {
      result[key] = val
    }
  }
  return result
}

/* ──────────────── MESSAGES ──────────────── */
export async function fsAddMessage(m: Omit<Message,'id'|'date'|'read'>): Promise<string> {
  const data = cleanFirestoreData({ ...m, read: false, createdAt: serverTimestamp() })
  const ref = await addDoc(collection(db, COL.messages), data)
  return ref.id
}
export async function fsGetMessages(): Promise<Message[]> {
  const snap = await getDocs(query(collection(db, COL.messages), orderBy('createdAt','desc')))
  return snap.docs.map(d => ({
    id: d.id, name: d.data().name, email: d.data().email,
    message: d.data().message, read: d.data().read ?? false,
    date: (d.data().createdAt as Timestamp)?.toDate().toISOString() ?? new Date().toISOString(),
  }))
}
export async function fsMarkMessageRead(id: string)   { await setDoc(doc(db, COL.messages, id), { read: true }, { merge: true }) }
export async function fsDeleteMessage(id: string)     { await deleteDoc(doc(db, COL.messages, id)) }

/* ──────────────── PROJECTS ──────────────── */
export async function fsGetProjects(): Promise<Project[]> {
  try {
    const snap = await getDocs(collection(db, COL.projects))
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project))
    return list.sort((a, b) => {
      const ordA = typeof a.order === 'number' ? a.order : 999999
      const ordB = typeof b.order === 'number' ? b.order : 999999
      return ordA - ordB
    })
  } catch (err) {
    console.error('Error fetching projects from Firestore:', err)
    return []
  }
}
export async function fsAddProject(p: Omit<Project,'id'>): Promise<string> {
  const cleaned = cleanFirestoreData({ ...p, order: typeof p.order === 'number' ? p.order : Date.now() })
  const ref = await addDoc(collection(db, COL.projects), cleaned)
  return ref.id
}
export async function fsUpdateProject(p: Project): Promise<void> {
  const { id, ...rest } = p
  const cleaned = cleanFirestoreData(rest)
  await setDoc(doc(db, COL.projects, id), cleaned, { merge: true })
}
export async function fsDeleteProject(id: string) {
  await deleteDoc(doc(db, COL.projects, id))
}
export async function fsReorderProjects(ids: string[]): Promise<void> {
  await Promise.all(
    ids.map((id, index) =>
      setDoc(doc(db, COL.projects, id), { order: index }, { merge: true })
    )
  )
}

/* ──────────────── CERTIFICATES ──────────────── */
export async function fsGetCertificates(): Promise<Certificate[]> {
  try {
    const snap = await getDocs(collection(db, COL.certificates))
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Certificate))
    return list.sort((a, b) => {
      const ordA = typeof a.order === 'number' ? a.order : 999999
      const ordB = typeof b.order === 'number' ? b.order : 999999
      return ordA - ordB
    })
  } catch (err) {
    console.error('Error fetching certificates from Firestore:', err)
    return []
  }
}
export async function fsAddCertificate(c: Omit<Certificate, 'id'>): Promise<string> {
  const cleaned = cleanFirestoreData({ ...c, order: typeof c.order === 'number' ? c.order : Date.now() })
  const ref = await addDoc(collection(db, COL.certificates), cleaned)
  return ref.id
}
export async function fsUpdateCertificate(c: Certificate): Promise<void> {
  const { id, ...rest } = c
  const cleaned = cleanFirestoreData(rest)
  await setDoc(doc(db, COL.certificates, id), cleaned, { merge: true })
}
export async function fsDeleteCertificate(id: string): Promise<void> {
  await deleteDoc(doc(db, COL.certificates, id))
}
export async function fsReorderCertificates(ids: string[]): Promise<void> {
  await Promise.all(
    ids.map((id, index) =>
      setDoc(doc(db, COL.certificates, id), { order: index }, { merge: true })
    )
  )
}

/* ──────────────── SKILLS ──────────────── */
export async function fsGetSkills(): Promise<SkillGroup[]> {
  const snap = await getDocs(collection(db, COL.skills))
  return snap.docs.map(d => d.data() as SkillGroup)
}
export async function fsSaveSkillGroups(groups: SkillGroup[]): Promise<void> {
  const snap = await getDocs(collection(db, COL.skills))
  await Promise.all(snap.docs.map(d => deleteDoc(d.ref)))
  await Promise.all(groups.map(g => setDoc(doc(db, COL.skills, g.category), cleanFirestoreData(g))))
}

/* ──────────────── JOURNEY ──────────────── */
export async function fsGetJourney(): Promise<ExperienceItem[]> {
  const q    = query(collection(db, COL.journey), orderBy('startDate','desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ExperienceItem))
}
export async function fsAddJourneyItem(item: Omit<ExperienceItem,'id'>): Promise<string> {
  const cleaned = cleanFirestoreData(item)
  const ref = await addDoc(collection(db, COL.journey), cleaned)
  return ref.id
}
export async function fsUpdateJourneyItem(item: ExperienceItem): Promise<void> {
  const { id, ...rest } = item
  const cleaned = cleanFirestoreData(rest)
  await setDoc(doc(db, COL.journey, id), cleaned, { merge: true })
}
export async function fsDeleteJourneyItem(id: string) {
  await deleteDoc(doc(db, COL.journey, id))
}

/* ──────────────── SETTINGS ──────────────── */
const SETTINGS_ID = 'main'
export async function fsGetSettings(): Promise<AdminSettings | null> {
  const snap = await getDoc(doc(db, COL.settings, SETTINGS_ID))
  return snap.exists() ? snap.data() as AdminSettings : null
}
export async function fsSaveSettings(s: AdminSettings): Promise<void> {
  await setDoc(doc(db, COL.settings, SETTINGS_ID), cleanFirestoreData(s), { merge: true })
}

/* ──────────────── HERO CONTENT ──────────────── */
const HERO_ID = 'main'
const HERO_DEFAULTS: HeroContent = {
  greeting:  'Hello, World',
  role:      'Junior Full-Stack Software Developer. Building modern, useful, and engaging digital experiences — from Zimbabwe to the world.',
  available: true,
  sticker1:  'React + TS',
  sticker2:  'Node.js',
  sticker3:  'Full-Stack',
  cvUrl:     '/Maqhawe-Ngwenya-CV.pdf',
}
export async function fsGetHeroContent(): Promise<HeroContent> {
  const snap = await getDoc(doc(db, COL.hero, HERO_ID))
  return snap.exists() ? snap.data() as HeroContent : HERO_DEFAULTS
}
export async function fsSaveHeroContent(h: HeroContent): Promise<void> {
  await setDoc(doc(db, COL.hero, HERO_ID), cleanFirestoreData(h), { merge: true })
}
export { HERO_DEFAULTS }

