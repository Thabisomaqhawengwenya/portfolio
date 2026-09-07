/**
 * publicService.ts
 * Read-only Firestore access for the public portfolio.
 * No auth required — Firestore security rules must allow
 * `read` on these collections for unauthenticated users.
 */
import {
  collection, doc,
  getDocs, getDoc,
  query, orderBy,
} from 'firebase/firestore'
import { db } from './config'
import type { Project, SkillGroup, ExperienceItem, HeroContent } from '../types'
import type { AdminSettings } from '../admin/context/AdminContext'
import { HERO_DEFAULTS } from './firestoreService'

import { projects   as staticProjects  } from '../data/projects'
import { skillGroups as staticSkills    } from '../data/skills'
import { experience  as staticExperience} from '../data/experience'

const DEFAULT_SETTINGS: AdminSettings = {
  bio:         'Junior Full-Stack Software Developer from Zimbabwe, currently training at Uncommon.org.',
  githubUrl:   'https://github.com/Thabisomaqhawengwenya',
  linkedinUrl: 'https://www.linkedin.com/in/maqhawe-ngwenya/',
  email:       'thabisomaqhawengwenya@gmail.com',
  location:    'Zimbabwe',
}

async function tryFetch<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try { return await fn() } catch { return fallback }
}

export async function publicGetProjects(): Promise<Project[]> {
  return tryFetch(async () => {
    try {
      const q    = query(collection(db, 'projects'), orderBy('order', 'asc'))
      const snap = await getDocs(q)
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project))
      return list.length ? list : staticProjects
    } catch {
      const snap = await getDocs(collection(db, 'projects'))
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project))
      return list.length ? list : staticProjects
    }
  }, staticProjects)
}

export async function publicGetSkills(): Promise<SkillGroup[]> {
  return tryFetch(async () => {
    const snap = await getDocs(collection(db, 'skills'))
    const list = snap.docs.map(d => d.data() as SkillGroup)
    return list.length ? list : staticSkills
  }, staticSkills)
}

export async function publicGetJourney(): Promise<ExperienceItem[]> {
  return tryFetch(async () => {
    const q    = query(collection(db, 'journey'), orderBy('startDate', 'desc'))
    const snap = await getDocs(q)
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as ExperienceItem))
    return list.length ? list : staticExperience
  }, staticExperience)
}

export async function publicGetSettings(): Promise<AdminSettings> {
  return tryFetch(async () => {
    const snap = await getDoc(doc(db, 'settings', 'main'))
    return snap.exists() ? snap.data() as AdminSettings : DEFAULT_SETTINGS
  }, DEFAULT_SETTINGS)
}

export async function publicGetHeroContent(): Promise<HeroContent> {
  return tryFetch(async () => {
    const snap = await getDoc(doc(db, 'heroContent', 'main'))
    return snap.exists() ? snap.data() as HeroContent : HERO_DEFAULTS
  }, HERO_DEFAULTS)
}
