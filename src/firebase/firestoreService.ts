import {
  collection, doc,
  getDocs, getDoc, addDoc, setDoc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp, Timestamp,
} from 'firebase/firestore'
import { db } from './config'
import type { Project, SkillGroup }   from '../types'
import type { Message, AdminSettings } from '../admin/context/AdminContext'

/* ─── Collection references ─── */
const COL = {
  messages: 'messages',
  projects: 'projects',
  skills:   'skills',
  settings: 'settings',
} as const

/* ──────────────────────────────────────────────
   MESSAGES
────────────────────────────────────────────── */
export async function fsAddMessage(
  m: Omit<Message, 'id' | 'date' | 'read'>
): Promise<string> {
  const ref = await addDoc(collection(db, COL.messages), {
    ...m,
    read:      false,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function fsGetMessages(): Promise<Message[]> {
  const q    = query(collection(db, COL.messages), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({
    id:      d.id,
    name:    d.data().name,
    email:   d.data().email,
    message: d.data().message,
    read:    d.data().read ?? false,
    date:    (d.data().createdAt as Timestamp)?.toDate().toISOString() ?? new Date().toISOString(),
  }))
}

export async function fsMarkMessageRead(id: string): Promise<void> {
  await updateDoc(doc(db, COL.messages, id), { read: true })
}

export async function fsDeleteMessage(id: string): Promise<void> {
  await deleteDoc(doc(db, COL.messages, id))
}

/* ──────────────────────────────────────────────
   PROJECTS
────────────────────────────────────────────── */
export async function fsGetProjects(): Promise<Project[]> {
  const snap = await getDocs(collection(db, COL.projects))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Project))
}

export async function fsAddProject(p: Omit<Project, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, COL.projects), p)
  return ref.id
}

export async function fsUpdateProject(p: Project): Promise<void> {
  const { id, ...rest } = p
  await setDoc(doc(db, COL.projects, id), rest)
}

export async function fsDeleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, COL.projects, id))
}

/* ──────────────────────────────────────────────
   SKILLS
────────────────────────────────────────────── */
export async function fsGetSkills(): Promise<SkillGroup[]> {
  const snap = await getDocs(collection(db, COL.skills))
  /* stored as one doc per group, id = category */
  return snap.docs.map(d => d.data() as SkillGroup)
}

export async function fsSaveSkillGroups(groups: SkillGroup[]): Promise<void> {
  /* delete all existing, re-write — simple for this scale */
  const snap = await getDocs(collection(db, COL.skills))
  await Promise.all(snap.docs.map(d => deleteDoc(d.ref)))
  await Promise.all(groups.map(g => setDoc(doc(db, COL.skills, g.category), g)))
}

/* ──────────────────────────────────────────────
   SETTINGS
────────────────────────────────────────────── */
const SETTINGS_ID = 'main'

export async function fsGetSettings(): Promise<AdminSettings | null> {
  const snap = await getDoc(doc(db, COL.settings, SETTINGS_ID))
  return snap.exists() ? (snap.data() as AdminSettings) : null
}

export async function fsSaveSettings(s: AdminSettings): Promise<void> {
  await setDoc(doc(db, COL.settings, SETTINGS_ID), s)
}
