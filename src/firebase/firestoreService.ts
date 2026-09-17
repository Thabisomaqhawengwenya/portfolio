import {
  collection, doc,
  getDocs, getDoc, addDoc, setDoc, updateDoc, deleteDoc,
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

/* ──────────────── MESSAGES ──────────────── */
export async function fsAddMessage(m: Omit<Message,'id'|'date'|'read'>): Promise<string> {
  const ref = await addDoc(collection(db, COL.messages), { ...m, read: false, createdAt: serverTimestamp() })
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
export async function fsMarkMessageRead(id: string)   { await updateDoc(doc(db, COL.messages, id), { read: true }) }
export async function fsDeleteMessage(id: string)     { await deleteDoc(doc(db, COL.messages, id)) }

/* ──────────────── PROJECTS ──────────────── */
export async function fsGetProjects(): Promise<Project[]> {
  /* Try ordered first; fall back to unordered if index doesn't exist yet */
  let list: Project[] = []
  try {
    const q    = query(collection(db, COL.projects), orderBy('order', 'asc'))
    const snap = await getDocs(q)
    list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project))
  } catch {
    const snap = await getDocs(collection(db, COL.projects))
    list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project))
  }
  if (!list.length) return []
  return list
}
export async function fsAddProject(p: Omit<Project,'id'>): Promise<string> {
  const ref = await addDoc(collection(db, COL.projects), { ...p, order: Date.now() })
  return ref.id
}
export async function fsUpdateProject(p: Project): Promise<void> {
  const { id, ...rest } = p; await setDoc(doc(db, COL.projects, id), rest)
}
export async function fsDeleteProject(id: string)     { await deleteDoc(doc(db, COL.projects, id)) }
export async function fsReorderProjects(ids: string[]): Promise<void> {
  await Promise.all(ids.map((id, i) => updateDoc(doc(db, COL.projects, id), { order: i })))
}

/* ──────────────── CERTIFICATES ──────────────── */
export async function fsGetCertificates(): Promise<Certificate[]> {
  let list: Certificate[] = []
  try {
    const q    = query(collection(db, COL.certificates), orderBy('order', 'asc'))
    const snap = await getDocs(q)
    list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Certificate))
  } catch {
    const snap = await getDocs(collection(db, COL.certificates))
    list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Certificate))
  }
  if (!list.length) return []
  return list
}
export async function fsAddCertificate(c: Omit<Certificate, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, COL.certificates), { ...c, order: Date.now() })
  return ref.id
}
export async function fsUpdateCertificate(c: Certificate): Promise<void> {
  const { id, ...rest } = c; await setDoc(doc(db, COL.certificates, id), rest)
}
export async function fsDeleteCertificate(id: string): Promise<void> {
  await deleteDoc(doc(db, COL.certificates, id))
}
export async function fsReorderCertificates(ids: string[]): Promise<void> {
  await Promise.all(ids.map((id, i) => updateDoc(doc(db, COL.certificates, id), { order: i })))
}

/* ──────────────── SKILLS ──────────────── */
export async function fsGetSkills(): Promise<SkillGroup[]> {
  const snap = await getDocs(collection(db, COL.skills))
  return snap.docs.map(d => d.data() as SkillGroup)
}
export async function fsSaveSkillGroups(groups: SkillGroup[]): Promise<void> {
  const snap = await getDocs(collection(db, COL.skills))
  await Promise.all(snap.docs.map(d => deleteDoc(d.ref)))
  await Promise.all(groups.map(g => setDoc(doc(db, COL.skills, g.category), g)))
}

/* ──────────────── JOURNEY ──────────────── */
export async function fsGetJourney(): Promise<ExperienceItem[]> {
  const q    = query(collection(db, COL.journey), orderBy('startDate','desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ExperienceItem))
}
export async function fsAddJourneyItem(item: Omit<ExperienceItem,'id'>): Promise<string> {
  const ref = await addDoc(collection(db, COL.journey), item)
  return ref.id
}
export async function fsUpdateJourneyItem(item: ExperienceItem): Promise<void> {
  const { id, ...rest } = item; await setDoc(doc(db, COL.journey, id), rest)
}
export async function fsDeleteJourneyItem(id: string) { await deleteDoc(doc(db, COL.journey, id)) }

/* ──────────────── SETTINGS ──────────────── */
const SETTINGS_ID = 'main'
export async function fsGetSettings(): Promise<AdminSettings | null> {
  const snap = await getDoc(doc(db, COL.settings, SETTINGS_ID))
  return snap.exists() ? snap.data() as AdminSettings : null
}
export async function fsSaveSettings(s: AdminSettings): Promise<void> {
  await setDoc(doc(db, COL.settings, SETTINGS_ID), s)
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
  await setDoc(doc(db, COL.hero, HERO_ID), h)
}
export { HERO_DEFAULTS }
