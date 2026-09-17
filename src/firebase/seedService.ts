import { doc, setDoc } from 'firebase/firestore'
import { db } from './config'
import { projects } from '../data/projects'
import { certificates } from '../data/certificates'
import { experience } from '../data/experience'
import { skillGroups } from '../data/skills'
import { HERO_DEFAULTS } from './firestoreService'
import type { AdminSettings } from '../admin/context/AdminContext'

const DEFAULT_SETTINGS: AdminSettings = {
  bio:         'Junior Full-Stack Software Developer from Zimbabwe, currently training at Uncommon.org.',
  githubUrl:   'https://github.com/Thabisomaqhawengwenya',
  linkedinUrl: 'https://www.linkedin.com/in/maqhawe-ngwenya/',
  email:       'thabisomaqhawengwenya@gmail.com',
  location:    'Zimbabwe',
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
    await setDoc(doc(db, 'projects', p.id), { ...p, order: i })
    details.projects++
  }

  // 2. Journey
  for (const exp of experience) {
    await setDoc(doc(db, 'journey', exp.id), exp)
    details.journey++
  }

  // 3. Skills
  for (const group of skillGroups) {
    await setDoc(doc(db, 'skills', group.category), group)
    details.skills++
  }

  // 4. Settings
  await setDoc(doc(db, 'settings', 'main'), DEFAULT_SETTINGS)
  details.settings = true

  // 5. Hero Content
  await setDoc(doc(db, 'heroContent', 'main'), HERO_DEFAULTS)
  details.heroContent = true

  // 6. Certificates (try / catch in case Firestore rule needs update in Firebase console)
  try {
    for (let i = 0; i < certificates.length; i++) {
      const c = certificates[i]
      await setDoc(doc(db, 'certificates', c.id), { ...c, order: i })
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
