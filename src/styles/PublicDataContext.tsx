/* eslint-disable react-refresh/only-export-components */
/**
 * PublicDataContext
 * Loads portfolio content from Firestore on mount.
 * Available to all public portfolio components — no auth needed.
 * Falls back to static data files if Firestore is unreachable.
 */
import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Project, SkillGroup, ExperienceItem, HeroContent } from '../types'
import type { AdminSettings } from '../admin/context/AdminContext'
import {
  publicGetProjects, publicGetSkills, publicGetJourney,
  publicGetSettings, publicGetHeroContent,
} from '../firebase/publicService'
import { projects   as staticProjects  } from '../data/projects'
import { skillGroups as staticSkills    } from '../data/skills'
import { experience  as staticExperience} from '../data/experience'
import { HERO_DEFAULTS } from '../firebase/firestoreService'

const DEFAULT_SETTINGS: AdminSettings = {
  bio:         'Junior Full-Stack Software Developer from Zimbabwe, currently training at Uncommon.org.',
  githubUrl:   'https://github.com/Thabisomaqhawengwenya',
  linkedinUrl: 'https://www.linkedin.com/in/maqhawe-ngwenya/',
  email:       'thabisomaqhawengwenya@gmail.com',
  location:    'Zimbabwe',
}

interface PublicCtx {
  projects:    Project[]
  skillGroups: SkillGroup[]
  journey:     ExperienceItem[]
  settings:    AdminSettings
  heroContent: HeroContent
  loading:     boolean
}

const Ctx = createContext<PublicCtx>({
  projects:    staticProjects,
  skillGroups: staticSkills,
  journey:     staticExperience,
  settings:    DEFAULT_SETTINGS,
  heroContent: HERO_DEFAULTS,
  loading:     true,
})

export function PublicDataProvider({ children }: { children: ReactNode }) {
  const [projects,    setProjects]    = useState<Project[]>(staticProjects)
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>(staticSkills)
  const [journey,     setJourney]     = useState<ExperienceItem[]>(staticExperience)
  const [settings,    setSettings]    = useState<AdminSettings>(DEFAULT_SETTINGS)
  const [heroContent, setHeroContent] = useState<HeroContent>(HERO_DEFAULTS)
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    /* Load all public data concurrently */
    Promise.all([
      publicGetProjects(),
      publicGetSkills(),
      publicGetJourney(),
      publicGetSettings(),
      publicGetHeroContent(),
    ]).then(([p, s, j, st, h]) => {
      setProjects(p)
      setSkillGroups(s)
      setJourney(j)
      setSettings(st)
      setHeroContent(h)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <Ctx.Provider value={{ projects, skillGroups, journey, settings, heroContent, loading }}>
      {children}
    </Ctx.Provider>
  )
}

export const usePublicData = () => useContext(Ctx)
