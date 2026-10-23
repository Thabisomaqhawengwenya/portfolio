import {
  collection, doc,
  getDocs, getDoc, addDoc, setDoc, deleteDoc,
  query, orderBy, serverTimestamp, Timestamp, onSnapshot,
} from 'firebase/firestore'
import { db } from './config'
import type { Project, SkillGroup, ExperienceItem, HeroContent, Certificate, SectionVisibility } from '../types'
import { DEFAULT_SECTION_VISIBILITY } from '../types'
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
export function cleanFirestoreData<T extends object>(obj: T): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined) continue
    if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Timestamp) && !(val instanceof Date)) {
      result[key] = cleanFirestoreData(val as object)
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
export function fsSubscribeMessages(onUpdate: (messages: Message[]) => void): () => void {
  const q = query(collection(db, COL.messages), orderBy('createdAt', 'desc'))
  return onSnapshot(
    q,
    snap => {
      const list = snap.docs.map(d => ({
        id: d.id,
        name: d.data().name ?? '',
        email: d.data().email ?? '',
        message: d.data().message ?? '',
        read: d.data().read ?? false,
        date: (d.data().createdAt as Timestamp)?.toDate().toISOString() ?? new Date().toISOString(),
      }))
      onUpdate(list)
    },
    err => {
      console.warn('[Firestore] Real-time messages subscription warning:', err)
    }
  )
}
export async function fsMarkMessageRead(id: string)                  { await setDoc(doc(db, COL.messages, id), { read: true }, { merge: true }) }
export async function fsSetMessageRead(id: string, read: boolean)    { await setDoc(doc(db, COL.messages, id), { read }, { merge: true }) }
export async function fsDeleteMessage(id: string)                    { await deleteDoc(doc(db, COL.messages, id)) }

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
  const data = {
    title: c.title || '',
    issuer: c.issuer || '',
    issuerLogo: c.issuerLogo || '',
    issueDate: c.issueDate || '',
    expiryDate: c.expiryDate || '',
    credentialId: c.credentialId || '',
    credentialUrl: c.credentialUrl || '',
    skills: Array.isArray(c.skills) ? c.skills.filter(Boolean) : [],
    featured: Boolean(c.featured),
    order: typeof c.order === 'number' ? c.order : Date.now(),
  }
  const cleaned = cleanFirestoreData(data)
  const ref = await addDoc(collection(db, COL.certificates), cleaned)
  return ref.id
}
export async function fsUpdateCertificate(c: Certificate): Promise<void> {
  const { id, ...rest } = c
  const data = {
    title: rest.title || '',
    issuer: rest.issuer || '',
    issuerLogo: rest.issuerLogo || '',
    issueDate: rest.issueDate || '',
    expiryDate: rest.expiryDate || '',
    credentialId: rest.credentialId || '',
    credentialUrl: rest.credentialUrl || '',
    skills: Array.isArray(rest.skills) ? rest.skills.filter(Boolean) : [],
    featured: Boolean(rest.featured),
    ...(typeof rest.order === 'number' ? { order: rest.order } : {}),
  }
  const cleaned = cleanFirestoreData(data)
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
  const list = snap.docs.map(d => d.data() as SkillGroup)
  return list.sort((a, b) => {
    const ordA = typeof a.order === 'number' ? a.order : 999999
    const ordB = typeof b.order === 'number' ? b.order : 999999
    return ordA - ordB
  })
}
export async function fsSaveSkillGroups(groups: SkillGroup[]): Promise<void> {
  const snap = await getDocs(collection(db, COL.skills))
  await Promise.all(snap.docs.map(d => deleteDoc(d.ref)))
  await Promise.all(
    groups.map((g, index) =>
      setDoc(doc(db, COL.skills, g.category), cleanFirestoreData({ ...g, order: index }))
    )
  )
}

/* ──────────────── JOURNEY ──────────────── */
export async function fsGetJourney(): Promise<ExperienceItem[]> {
  const snap = await getDocs(collection(db, COL.journey))
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as ExperienceItem))
  return list.sort((a, b) => {
    const hasOrdA = typeof a.order === 'number'
    const hasOrdB = typeof b.order === 'number'
    if (hasOrdA && hasOrdB) return (a.order as number) - (b.order as number)
    if (hasOrdA) return -1
    if (hasOrdB) return 1
    return (b.startDate || '').localeCompare(a.startDate || '')
  })
}
export async function fsAddJourneyItem(item: Omit<ExperienceItem,'id'>): Promise<string> {
  const cleaned = cleanFirestoreData({
    ...item,
    order: typeof item.order === 'number' ? item.order : 0,
  })
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
export async function fsReorderJourney(ids: string[]): Promise<void> {
  await Promise.all(
    ids.map((id, index) =>
      setDoc(doc(db, COL.journey, id), { order: index }, { merge: true })
    )
  )
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
  role:      'Front-End Software Developer. Building modern, useful, and engaging digital experiences — from Zimbabwe to the world.',
  available: true,
  sticker1:  'React + TS',
  sticker2:  'Node.js',
  sticker3:  'Front-End',
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

/* ──────────────── SECTION VISIBILITY ──────────────── */
const SECTIONS_ID = 'sections'
export async function fsGetSectionVisibility(): Promise<SectionVisibility> {
  try {
    const snap = await getDoc(doc(db, COL.settings, SECTIONS_ID))
    return snap.exists() ? { ...DEFAULT_SECTION_VISIBILITY, ...snap.data() } as SectionVisibility : DEFAULT_SECTION_VISIBILITY
  } catch (err) {
    console.error('Error fetching section visibility from Firestore:', err)
    return DEFAULT_SECTION_VISIBILITY
  }
}
export async function fsSaveSectionVisibility(v: SectionVisibility): Promise<void> {
  await setDoc(doc(db, COL.settings, SECTIONS_ID), cleanFirestoreData(v), { merge: true })
}
