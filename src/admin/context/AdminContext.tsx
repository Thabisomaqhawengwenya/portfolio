/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { loginWithEmail, logout as fbLogout, onAuthChange } from '../../firebase/authService'
import {
  fsGetMessages, fsAddMessage, fsMarkMessageRead, fsDeleteMessage,
  fsGetProjects, fsAddProject, fsUpdateProject, fsDeleteProject, fsReorderProjects,
  fsGetSkills, fsSaveSkillGroups,
  fsGetJourney, fsAddJourneyItem, fsUpdateJourneyItem, fsDeleteJourneyItem,
  fsGetSettings, fsSaveSettings,
  fsGetHeroContent, fsSaveHeroContent, HERO_DEFAULTS,
} from '../../firebase/firestoreService'
import { projects as defaultProjects } from '../../data/projects'
import { skillGroups as defaultSkills }  from '../../data/skills'
import { experience as defaultExperience } from '../../data/experience'
import type { Project, SkillGroup, ExperienceItem, HeroContent } from '../../types'

export interface Message {
  id: string; name: string; email: string; message: string; date: string; read: boolean
}
export interface AdminSettings {
  bio: string; githubUrl: string; linkedinUrl: string; email: string; location: string
}

interface AdminCtx {
  isAuthed: boolean; authLoading: boolean
  login:  (email: string, pw: string) => Promise<boolean>
  logout: () => Promise<void>

  projects:     Project[]
  addProject:   (p: Omit<Project,'id'>) => Promise<void>
  updateProject:(p: Project) => Promise<void>
  deleteProject:(id: string) => Promise<void>
  reorderProjects:(ids: string[]) => Promise<void>

  skillGroups:      SkillGroup[]
  updateSkillGroups:(g: SkillGroup[]) => Promise<void>

  journey:          ExperienceItem[]
  addJourneyItem:   (i: Omit<ExperienceItem,'id'>) => Promise<void>
  updateJourneyItem:(i: ExperienceItem) => Promise<void>
  deleteJourneyItem:(id: string) => Promise<void>

  messages:     Message[]
  addMessage:   (m: Omit<Message,'id'|'date'|'read'>) => Promise<void>
  markRead:     (id: string) => Promise<void>
  deleteMessage:(id: string) => Promise<void>
  markAllRead:  () => Promise<void>
  deleteReadMessages: () => Promise<void>

  settings:       AdminSettings
  updateSettings: (s: AdminSettings) => Promise<void>

  heroContent:       HeroContent
  updateHeroContent: (h: HeroContent) => Promise<void>
}

const DEFAULT_SETTINGS: AdminSettings = {
  bio: 'Junior Full-Stack Software Developer from Zimbabwe, currently training at Uncommon.org.',
  githubUrl: 'https://github.com/Thabisomaqhawengwenya',
  linkedinUrl: 'https://www.linkedin.com/in/maqhawe-ngwenya/',
  email: 'thabisomaqhawengwenya@gmail.com',
  location: 'Zimbabwe',
}

const Ctx = createContext<AdminCtx>({} as AdminCtx)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthed,     setAuthed]     = useState(false)
  const [authLoading,  setAuthLoad]   = useState(true)
  const [projects,     setProjects]   = useState<Project[]>(defaultProjects)
  const [skillGroups,  setSkills]     = useState<SkillGroup[]>(defaultSkills)
  const [journey,      setJourney]    = useState<ExperienceItem[]>(defaultExperience)
  const [messages,     setMessages]   = useState<Message[]>([])
  const [settings,     setSettings]   = useState<AdminSettings>(DEFAULT_SETTINGS)
  const [heroContent,  setHero]       = useState<HeroContent>(HERO_DEFAULTS)

  useEffect(() => {
    return onAuthChange(u => { setAuthed(!!u); setAuthLoad(false) })
  }, [])

  useEffect(() => {
    if (!isAuthed) return
    fsGetProjects().then(p  => { if (p.length)  setProjects(p)  }).catch(console.error)
    fsGetSkills().then(s    => { if (s.length)  setSkills(s)    }).catch(console.error)
    fsGetJourney().then(j   => { if (j.length)  setJourney(j)   }).catch(console.error)
    fsGetMessages().then(m  => setMessages(m)).catch(console.error)
    fsGetSettings().then(s  => { if (s) setSettings(s) }).catch(console.error)
    fsGetHeroContent().then(h => setHero(h)).catch(console.error)
  }, [isAuthed])

  const login  = useCallback(async (email: string, pw: string) => { try { await loginWithEmail(email, pw); return true } catch { return false } }, [])
  const logout = useCallback(async () => { await fbLogout() }, [])

  const addProject     = useCallback(async (p: Omit<Project,'id'>) => { const id = await fsAddProject(p); setProjects(prev => [...prev, { ...p, id }]) }, [])
  const updateProject  = useCallback(async (p: Project) => { await fsUpdateProject(p); setProjects(prev => prev.map(x => x.id === p.id ? p : x)) }, [])
  const deleteProject  = useCallback(async (id: string) => { await fsDeleteProject(id); setProjects(prev => prev.filter(x => x.id !== id)) }, [])
  const reorderProjects = useCallback(async (ids: string[]) => {
    await fsReorderProjects(ids)
    setProjects(prev => ids.map(id => prev.find(p => p.id === id)!).filter(Boolean))
  }, [])

  const updateSkillGroups = useCallback(async (g: SkillGroup[]) => { await fsSaveSkillGroups(g); setSkills(g) }, [])

  const addJourneyItem    = useCallback(async (i: Omit<ExperienceItem,'id'>) => { const id = await fsAddJourneyItem(i); setJourney(prev => [{ ...i, id }, ...prev]) }, [])
  const updateJourneyItem = useCallback(async (i: ExperienceItem) => { await fsUpdateJourneyItem(i); setJourney(prev => prev.map(x => x.id === i.id ? i : x)) }, [])
  const deleteJourneyItem = useCallback(async (id: string) => { await fsDeleteJourneyItem(id); setJourney(prev => prev.filter(x => x.id !== id)) }, [])

  const addMessage    = useCallback(async (m: Omit<Message,'id'|'date'|'read'>) => { const id = await fsAddMessage(m); setMessages(prev => [{ ...m, id, date: new Date().toISOString(), read: false }, ...prev]) }, [])
  const markRead      = useCallback(async (id: string) => { await fsMarkMessageRead(id); setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m)) }, [])
  const deleteMessage = useCallback(async (id: string) => { await fsDeleteMessage(id); setMessages(prev => prev.filter(m => m.id !== id)) }, [])
  const markAllRead   = useCallback(async () => {
    const unread = messages.filter(m => !m.read)
    await Promise.all(unread.map(m => fsMarkMessageRead(m.id)))
    setMessages(prev => prev.map(m => ({ ...m, read: true })))
  }, [messages])
  const deleteReadMessages = useCallback(async () => {
    const read = messages.filter(m => m.read)
    await Promise.all(read.map(m => fsDeleteMessage(m.id)))
    setMessages(prev => prev.filter(m => !m.read))
  }, [messages])

  const updateSettings    = useCallback(async (s: AdminSettings) => { await fsSaveSettings(s); setSettings(s) }, [])
  const updateHeroContent = useCallback(async (h: HeroContent) => { await fsSaveHeroContent(h); setHero(h) }, [])

  return (
    <Ctx.Provider value={{
      isAuthed, authLoading, login, logout,
      projects, addProject, updateProject, deleteProject, reorderProjects,
      skillGroups, updateSkillGroups,
      journey, addJourneyItem, updateJourneyItem, deleteJourneyItem,
      messages, addMessage, markRead, deleteMessage, markAllRead, deleteReadMessages,
      settings, updateSettings,
      heroContent, updateHeroContent,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAdmin = () => useContext(Ctx)
