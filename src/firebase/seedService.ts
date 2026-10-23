import { doc, setDoc } from 'firebase/firestore'
import { db } from './config'
import { projects } from '../data/projects'
import { certificates } from '../data/certificates'
import { experience } from '../data/experience'
import { skillGroups } from '../data/skills'
import { HERO_DEFAULTS, cleanFirestoreData } from './firestoreService'
import { DEFAULT_SECTION_VISIBILITY } from '../types'
import type { Project, Certificate, ExperienceItem, SkillGroup, HeroContent, SectionVisibility } from '../types'
import type { AdminSettings } from '../admin/context/AdminContext'

const DEFAULT_SETTINGS: AdminSettings = {
  bio:         'Front-End Software Developer from Bulawayo, Zimbabwe, currently training at Uncommon.org.',
  githubUrl:   'https://github.com/Thabisomaqhawengwenya',
  linkedinUrl: 'https://www.linkedin.com/in/maqhawe-ngwenya/',
  email:       'thabisomaqhawengwenya@gmail.com',
  location:    'Bulawayo, Zimbabwe',
}

export interface SeedResult {
  success: boolean
  message: string
  details: {
    projects: number
    certificates: number
    journey: number
    skills: number
    settings: boolean
    heroContent: boolean
  }
}

export interface PortfolioBackupPayload {
  settings?: AdminSettings
  heroContent?: HeroContent
  sectionVisibility?: SectionVisibility
  projects?: Project[]
  certificates?: Certificate[]
  skills?: SkillGroup[]
  journey?: ExperienceItem[]
}

/**
 * Seeds or syncs all default portfolio data into Firestore.
 * Requires an authenticated user session in Firebase.
 */
export async function seedAllDataToFirestore(): Promise<SeedResult> {
  const details = {
    projects: 0,
    certificates: 0,
    journey: 0,
    skills: 0,
    settings: false,
    heroContent: false,
  }

  // 1. Projects
  for (let i = 0; i < projects.length; i++) {
    const p = projects[i]
    await setDoc(doc(db, 'projects', p.id), cleanFirestoreData({ ...p, order: i }))
    details.projects++
  }

  // 2. Journey
  for (let i = 0; i < experience.length; i++) {
    const exp = experience[i]
    await setDoc(doc(db, 'journey', exp.id), cleanFirestoreData({ ...exp, order: i }))
    details.journey++
  }

  // 3. Skills
  for (let i = 0; i < skillGroups.length; i++) {
    const group = skillGroups[i]
    await setDoc(doc(db, 'skills', group.category), cleanFirestoreData({ ...group, order: i }))
    details.skills++
  }

  // 4. Settings & Section Visibility
  await setDoc(doc(db, 'settings', 'main'), cleanFirestoreData(DEFAULT_SETTINGS))
  await setDoc(doc(db, 'settings', 'sections'), cleanFirestoreData(DEFAULT_SECTION_VISIBILITY))
  details.settings = true

  // 5. Hero Content
  await setDoc(doc(db, 'heroContent', 'main'), cleanFirestoreData(HERO_DEFAULTS))
  details.heroContent = true

  // 6. Certificates
  try {
    for (let i = 0; i < certificates.length; i++) {
      const c = certificates[i]
      await setDoc(doc(db, 'certificates', c.id), cleanFirestoreData({ ...c, order: i }))
      details.certificates++
    }
  } catch (err) {
    console.warn('Note: Certificates collection write requires matching rule in Firebase Console:', err)
  }

  return {
    success: true,
    message: 'All portfolio data synchronized with Firebase Firestore.',
    details,
  }
}

/**
 * Restores portfolio collections from a JSON backup object into Firestore.
 */
export async function restoreBackupToFirestore(payload: PortfolioBackupPayload): Promise<SeedResult> {
  const details = {
    projects: 0,
    certificates: 0,
    journey: 0,
    skills: 0,
    settings: false,
    heroContent: false,
  }

  if (Array.isArray(payload.projects)) {
    for (let i = 0; i < payload.projects.length; i++) {
      const p = payload.projects[i]
      if (!p?.id) continue
      await setDoc(doc(db, 'projects', p.id), cleanFirestoreData({ ...p, order: typeof p.order === 'number' ? p.order : i }))
      details.projects++
    }
  }

  if (Array.isArray(payload.certificates)) {
    for (let i = 0; i < payload.certificates.length; i++) {
      const c = payload.certificates[i]
      if (!c?.id) continue
      await setDoc(doc(db, 'certificates', c.id), cleanFirestoreData({ ...c, order: typeof c.order === 'number' ? c.order : i }))
      details.certificates++
    }
  }

  if (Array.isArray(payload.journey)) {
    for (let i = 0; i < payload.journey.length; i++) {
      const item = payload.journey[i]
      if (!item?.id) continue
      await setDoc(doc(db, 'journey', item.id), cleanFirestoreData({ ...item, order: typeof item.order === 'number' ? item.order : i }))
      details.journey++
    }
  }

  if (Array.isArray(payload.skills)) {
    for (let i = 0; i < payload.skills.length; i++) {
      const group = payload.skills[i]
      if (!group?.category) continue
      await setDoc(doc(db, 'skills', group.category), cleanFirestoreData({ ...group, order: i }))
      details.skills++
    }
  }

  if (payload.settings) {
    await setDoc(doc(db, 'settings', 'main'), cleanFirestoreData(payload.settings), { merge: true })
    details.settings = true
  }

  if (payload.sectionVisibility) {
    await setDoc(doc(db, 'settings', 'sections'), cleanFirestoreData(payload.sectionVisibility), { merge: true })
  }

  if (payload.heroContent) {
    await setDoc(doc(db, 'heroContent', 'main'), cleanFirestoreData(payload.heroContent), { merge: true })
    details.heroContent = true
  }

  return {
    success: true,
    message: 'Backup restored to Firebase Firestore.',
    details,
  }
}
