/* eslint-disable react-refresh/only-export-components */
/**
 * PublicDataContext
 * Loads portfolio content from Firestore on mount.
 * Available to all public portfolio components — no auth needed.
 * Falls back to static data files if Firestore is unreachable.
 */
import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Project, SkillGroup, ExperienceItem, HeroContent, Certificate, GitHubStats } from '../types'
import type { AdminSettings } from '../admin/context/AdminContext'
import {
  publicGetProjects, publicGetSkills, publicGetJourney,
  publicGetSettings, publicGetHeroContent, publicGetCertificates,
} from '../firebase/publicService'
import { projects     as staticProjects     } from '../data/projects'
import { skillGroups  as staticSkills       } from '../data/skills'
import { experience   as staticExperience   } from '../data/experience'
import { certificates as staticCertificates } from '../data/certificates'
import { HERO_DEFAULTS } from '../firebase/firestoreService'
import {
  getOrUpdateGitHubStats,
  getCachedGitHubStats,
  DEFAULT_GITHUB_STATS,
  GITHUB_STATS_UPDATE_INTERVAL_MS,
  extractGitHubUsername,
} from '../services/githubService'

const DEFAULT_SETTINGS: AdminSettings = {
  bio:         'Software Developer & Frontend Engineer based in Zimbabwe, building performant web applications with React, TypeScript & Node.js.',
  githubUrl:   'https://github.com/Thabisomaqhawengwenya',
  linkedinUrl: 'https://www.linkedin.com/in/maqhawe-ngwenya/',
  email:       'thabisomaqhawengwenya@gmail.com',
  location:    'Harare, Zimbabwe',
}

interface PublicCtx {
  projects:     Project[]
  skillGroups:  SkillGroup[]
  journey:      ExperienceItem[]
  certificates: Certificate[]
  settings:     AdminSettings
  heroContent:  HeroContent
  githubStats:  GitHubStats
  loading:      boolean
}

const Ctx = createContext<PublicCtx>({
  projects:     staticProjects,
  skillGroups:  staticSkills,
  journey:      staticExperience,
  certificates: staticCertificates,
  settings:     DEFAULT_SETTINGS,
  heroContent:  HERO_DEFAULTS,
  githubStats:  DEFAULT_GITHUB_STATS,
  loading:      true,
})

export function PublicDataProvider({ children }: { children: ReactNode }) {
  const [projects,     setProjects]     = useState<Project[]>(staticProjects)
  const [skillGroups,  setSkillGroups]  = useState<SkillGroup[]>(staticSkills)
  const [journey,      setJourney]      = useState<ExperienceItem[]>(staticExperience)
  const [certificates, setCertificates] = useState<Certificate[]>(staticCertificates)
  const [settings,     setSettings]     = useState<AdminSettings>(DEFAULT_SETTINGS)
  const [heroContent,  setHeroContent]  = useState<HeroContent>(HERO_DEFAULTS)
  const [githubStats,  setGithubStats]  = useState<GitHubStats>(() => getCachedGitHubStats() || DEFAULT_GITHUB_STATS)
  const [loading,      setLoading]      = useState(true)

  useEffect(() => {
    /* Load all public data concurrently */
    Promise.all([
      publicGetProjects(),
      publicGetSkills(),
      publicGetJourney(),
      publicGetSettings(),
      publicGetHeroContent(),
      publicGetCertificates(),
    ]).then(([p, s, j, st, h, c]) => {
      setProjects(p)
      setSkillGroups(s)
      setJourney(j)
      setSettings(st)
      setHeroContent(h)
      setCertificates(c)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  /* ─── 12-Hour GitHub Stats Lifecycle ─── */
  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout> | null = null
    let active = true

    const syncStats = async (force = false) => {
      const username = extractGitHubUsername(settings.githubUrl)
      const fresh = await getOrUpdateGitHubStats(username, force)
      if (!active) return
      setGithubStats(fresh)

      // Schedule next update for the remaining time in the 12-hour cycle
      const elapsed = Date.now() - fresh.lastUpdated
      const nextDelay = Math.max(1000, GITHUB_STATS_UPDATE_INTERVAL_MS - elapsed)

      if (timerId) clearTimeout(timerId)
      timerId = setTimeout(() => {
        if (active) syncStats(true)
      }, nextDelay)
    }

    // Initial check (reads cache or fetches if expired/missing)
    syncStats(false)

    // Window focus/visibility check: refresh if 12h elapsed while inactive
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const cached = getCachedGitHubStats()
        if (!cached || Date.now() - cached.lastUpdated >= GITHUB_STATS_UPDATE_INTERVAL_MS) {
          syncStats(true)
        }
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      active = false
      if (timerId) clearTimeout(timerId)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [settings.githubUrl])

  return (
    <Ctx.Provider value={{ projects, skillGroups, journey, certificates, settings, heroContent, githubStats, loading }}>
      {children}
    </Ctx.Provider>
  )
}

export const usePublicData = () => useContext(Ctx)

