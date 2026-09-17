import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { useToast } from '../../context/ToastContext'
import { loginWithEmail, logout as fbLogout, onAuthChange } from '../../firebase/authService'
import {
  fsGetMessages, fsAddMessage, fsMarkMessageRead, fsDeleteMessage,
  fsGetProjects, fsAddProject, fsUpdateProject, fsDeleteProject, fsReorderProjects,
  fsGetCertificates, fsAddCertificate, fsUpdateCertificate, fsDeleteCertificate, fsReorderCertificates,
  fsGetSkills, fsSaveSkillGroups,
  fsGetJourney, fsAddJourneyItem, fsUpdateJourneyItem, fsDeleteJourneyItem,
  fsGetSettings, fsSaveSettings,
  fsGetHeroContent, fsSaveHeroContent, HERO_DEFAULTS,
} from '../../firebase/firestoreService'
import { projects as defaultProjects } from '../../data/projects'
import { certificates as defaultCertificates } from '../../data/certificates'
import { skillGroups as defaultSkills }  from '../../data/skills'
import { experience as defaultExperience } from '../../data/experience'
import { seedAllDataToFirestore, type SeedResult } from '../../firebase/seedService'
import type { Project, SkillGroup, ExperienceItem, HeroContent, Certificate } from '../../types'

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

  certificates:        Certificate[]
  addCertificate:      (c: Omit<Certificate,'id'>) => Promise<void>
  updateCertificate:   (c: Certificate) => Promise<void>
  deleteCertificate:   (id: string) => Promise<void>
  reorderCertificates: (ids: string[]) => Promise<void>

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

  seedDatabase: () => Promise<SeedResult>
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
  const { toast } = useToast()
  const [isAuthed,     setAuthed]       = useState(false)
  const [authLoading,  setAuthLoad]     = useState(true)
  const [projects,     setProjects]     = useState<Project[]>(defaultProjects)
  const [certificates, setCertificates] = useState<Certificate[]>(defaultCertificates)
  const [skillGroups,  setSkills]       = useState<SkillGroup[]>(defaultSkills)
  const [journey,      setJourney]      = useState<ExperienceItem[]>(defaultExperience)
  const [messages,     setMessages]     = useState<Message[]>([])
  const [settings,     setSettings]     = useState<AdminSettings>(DEFAULT_SETTINGS)
  const [heroContent,  setHero]         = useState<HeroContent>(HERO_DEFAULTS)

  useEffect(() => {
    return onAuthChange(u => { setAuthed(!!u); setAuthLoad(false) })
  }, [])

  useEffect(() => {
    if (!isAuthed) return
    fsGetProjects().then(p => { if (p.length) setProjects(p) }).catch(console.error)
    fsGetCertificates().then(c => { if (c.length) setCertificates(c) }).catch(console.error)
    fsGetSkills().then(s => { if (s.length) setSkills(s) }).catch(console.error)
    fsGetJourney().then(j => { if (j.length) setJourney(j) }).catch(console.error)
    fsGetMessages().then(m => setMessages(m)).catch(console.error)
    fsGetSettings().then(s => { if (s) setSettings(s) }).catch(console.error)
    fsGetHeroContent().then(h => setHero(h)).catch(console.error)
  }, [isAuthed])

  const login  = useCallback(async (email: string, pw: string) => { 
    try { 
      await loginWithEmail(email, pw)
      toast.success('Signed in successfully', `Welcome back, ${email}`)
      return true 
    } catch (err: unknown) { 
      toast.error('Sign in failed', (err as Error)?.message || 'Invalid credentials')
      return false 
    } 
  }, [toast])

  const logout = useCallback(async () => { 
    await fbLogout()
    toast.info('Signed out', 'Admin session ended')
  }, [toast])

  const addProject = useCallback(async (p: Omit<Project,'id'>) => {
    try {
      const id = await toast.promise(
        fsAddProject(p),
        {
          loading: 'Saving project to Firebase…',
          success: `Project "${p.title}" saved to Firebase!`,
          error: (err) => `Failed to save project: ${(err as Error)?.message || 'Permission denied'}`,
        }
      )
      setProjects(prev => [...prev, { ...p, id }])
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [toast])

  const updateProject = useCallback(async (p: Project) => {
    try {
      await toast.promise(
        fsUpdateProject(p),
        {
          loading: `Updating "${p.title}" on Firebase…`,
          success: `Project "${p.title}" updated successfully!`,
          error: (err) => `Failed to update project: ${(err as Error)?.message || 'Permission denied'}`,
        }
      )
      setProjects(prev => prev.map(x => x.id === p.id ? p : x))
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [toast])

  const deleteProject = useCallback(async (id: string) => {
    try {
      await toast.promise(
        fsDeleteProject(id),
        {
          loading: 'Deleting project from Firebase…',
          success: 'Project deleted from Firebase.',
          error: (err) => `Failed to delete project: ${(err as Error)?.message || 'Permission denied'}`,
        }
      )
      setProjects(prev => prev.filter(x => x.id !== id))
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [toast])

  const reorderProjects = useCallback(async (ids: string[]) => {
    try {
      await toast.promise(
        fsReorderProjects(ids),
        {
          loading: 'Updating project order on Firebase…',
          success: 'Project order saved to Firebase!',
          error: (err) => `Failed to save project order: ${(err as Error)?.message || 'Error'}`,
        }
      )
      setProjects(prev => ids.map(id => prev.find(p => p.id === id)!).filter(Boolean))
    } catch (err) {
      console.error(err)
    }
  }, [toast])

  const addCertificate = useCallback(async (c: Omit<Certificate,'id'>) => {
    try {
      const id = await toast.promise(
        fsAddCertificate(c),
        {
          loading: 'Saving certificate to Firebase…',
          success: `Certificate "${c.title}" saved!`,
          error: (err) => `Failed to save certificate: ${(err as Error)?.message || 'Permission denied'}`,
        }
      )
      setCertificates(prev => [...prev, { ...c, id }])
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [toast])

  const updateCertificate = useCallback(async (c: Certificate) => {
    try {
      await toast.promise(
        fsUpdateCertificate(c),
        {
          loading: `Updating "${c.title}" on Firebase…`,
          success: `Certificate "${c.title}" updated!`,
          error: (err) => `Failed to update certificate: ${(err as Error)?.message || 'Permission denied'}`,
        }
      )
      setCertificates(prev => prev.map(x => x.id === c.id ? c : x))
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [toast])

  const deleteCertificate = useCallback(async (id: string) => {
    try {
      await toast.promise(
        fsDeleteCertificate(id),
        {
          loading: 'Deleting certificate from Firebase…',
          success: 'Certificate deleted from Firebase.',
          error: (err) => `Failed to delete certificate: ${(err as Error)?.message || 'Permission denied'}`,
        }
      )
      setCertificates(prev => prev.filter(x => x.id !== id))
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [toast])

  const reorderCertificates = useCallback(async (ids: string[]) => {
    try {
      await toast.promise(
        fsReorderCertificates(ids),
        {
          loading: 'Updating certificate order on Firebase…',
          success: 'Certificate order saved to Firebase!',
          error: (err) => `Failed to save certificate order: ${(err as Error)?.message || 'Error'}`,
        }
      )
      setCertificates(prev => ids.map(id => prev.find(c => c.id === id)!).filter(Boolean))
    } catch (err) {
      console.error(err)
    }
  }, [toast])

  const updateSkillGroups = useCallback(async (g: SkillGroup[]) => {
    try {
      await toast.promise(
        fsSaveSkillGroups(g),
        {
          loading: 'Saving skills to Firebase…',
          success: 'Skills updated successfully!',
          error: (err) => `Failed to save skills: ${(err as Error)?.message || 'Permission denied'}`,
        }
      )
      setSkills(g)
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [toast])

  const addJourneyItem = useCallback(async (i: Omit<ExperienceItem,'id'>) => {
    try {
      const id = await toast.promise(
        fsAddJourneyItem(i),
        {
          loading: 'Saving journey entry to Firebase…',
          success: `Journey "${i.title}" saved!`,
          error: (err) => `Failed to save journey entry: ${(err as Error)?.message || 'Permission denied'}`,
        }
      )
      setJourney(prev => [{ ...i, id }, ...prev])
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [toast])

  const updateJourneyItem = useCallback(async (i: ExperienceItem) => {
    try {
      await toast.promise(
        fsUpdateJourneyItem(i),
        {
          loading: `Updating "${i.title}" on Firebase…`,
          success: `Journey "${i.title}" updated!`,
          error: (err) => `Failed to update journey entry: ${(err as Error)?.message || 'Permission denied'}`,
        }
      )
      setJourney(prev => prev.map(x => x.id === i.id ? i : x))
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [toast])

  const deleteJourneyItem = useCallback(async (id: string) => {
    try {
      await toast.promise(
        fsDeleteJourneyItem(id),
        {
          loading: 'Deleting journey entry from Firebase…',
          success: 'Journey entry deleted from Firebase.',
          error: (err) => `Failed to delete journey entry: ${(err as Error)?.message || 'Permission denied'}`,
        }
      )
      setJourney(prev => prev.filter(x => x.id !== id))
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [toast])

  const addMessage = useCallback(async (m: Omit<Message,'id'|'date'|'read'>) => {
    try {
      const id = await toast.promise(
        fsAddMessage(m),
        {
          loading: 'Sending message to Firebase…',
          success: 'Message sent & saved to Firebase!',
          error: (err) => `Failed to send message: ${(err as Error)?.message || 'Submission error'}`,
        }
      )
      setMessages(prev => [{ ...m, id, date: new Date().toISOString(), read: false }, ...prev])
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [toast])

  const markRead = useCallback(async (id: string) => {
    try {
      await fsMarkMessageRead(id)
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
      toast.info('Message marked as read')
    } catch (err) {
      toast.error('Failed to update message', (err as Error)?.message)
    }
  }, [toast])

  const deleteMessage = useCallback(async (id: string) => {
    try {
      await toast.promise(
        fsDeleteMessage(id),
        {
          loading: 'Deleting message…',
          success: 'Message deleted.',
          error: (err) => `Failed to delete message: ${(err as Error)?.message || 'Error'}`,
        }
      )
      setMessages(prev => prev.filter(m => m.id !== id))
    } catch (err) {
      console.error(err)
    }
  }, [toast])

  const markAllRead = useCallback(async () => {
    const unread = messages.filter(m => !m.read)
    if (!unread.length) return
    try {
      await toast.promise(
        Promise.all(unread.map(m => fsMarkMessageRead(m.id))),
        {
          loading: 'Marking all messages as read…',
          success: 'All messages marked as read.',
          error: (err) => `Failed to update messages: ${(err as Error)?.message || 'Error'}`,
        }
      )
      setMessages(prev => prev.map(m => ({ ...m, read: true })))
    } catch (err) {
      console.error(err)
    }
  }, [messages, toast])

  const deleteReadMessages = useCallback(async () => {
    const read = messages.filter(m => m.read)
    if (!read.length) return
    try {
      await toast.promise(
        Promise.all(read.map(m => fsDeleteMessage(m.id))),
        {
          loading: 'Deleting read messages…',
          success: 'Read messages deleted.',
          error: (err) => `Failed to delete messages: ${(err as Error)?.message || 'Error'}`,
        }
      )
      setMessages(prev => prev.filter(m => !m.read))
    } catch (err) {
      console.error(err)
    }
  }, [messages, toast])

  const updateSettings = useCallback(async (s: AdminSettings) => {
    try {
      await toast.promise(
        fsSaveSettings(s),
        {
          loading: 'Saving profile settings to Firebase…',
          success: 'Profile settings saved to Firebase!',
          error: (err) => `Failed to save settings: ${(err as Error)?.message || 'Permission denied'}`,
        }
      )
      setSettings(s)
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [toast])

  const updateHeroContent = useCallback(async (h: HeroContent) => {
    try {
      await toast.promise(
        fsSaveHeroContent(h),
        {
          loading: 'Saving hero content to Firebase…',
          success: 'Hero content saved to Firebase!',
          error: (err) => `Failed to save hero content: ${(err as Error)?.message || 'Permission denied'}`,
        }
      )
      setHero(h)
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [toast])

  const seedDatabase = useCallback(async () => {
    try {
      const res = await toast.promise(
        seedAllDataToFirestore(),
        {
          loading: 'Syncing all portfolio data to Firebase…',
          success: 'All data successfully synced to Firebase!',
          error: (err) => `Sync failed: ${(err as Error)?.message || 'Check Firestore connection'}`,
        }
      )
      // Refresh local states
      const [p, c, s, j, st, hero] = await Promise.all([
        fsGetProjects(),
        fsGetCertificates(),
        fsGetSkills(),
        fsGetJourney(),
        fsGetSettings(),
        fsGetHeroContent(),
      ])
      if (p.length) setProjects(p)
      if (c.length) setCertificates(c)
      if (s.length) setSkills(s)
      if (j.length) setJourney(j)
      if (st) setSettings(st)
      setHero(hero)
      return res
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [toast])

  return (
    <Ctx.Provider value={{
      isAuthed, authLoading, login, logout,
      projects, addProject, updateProject, deleteProject, reorderProjects,
      certificates, addCertificate, updateCertificate, deleteCertificate, reorderCertificates,
      skillGroups, updateSkillGroups,
      journey, addJourneyItem, updateJourneyItem, deleteJourneyItem,
      messages, addMessage, markRead, deleteMessage, markAllRead, deleteReadMessages,
      settings, updateSettings,
      heroContent, updateHeroContent,
      seedDatabase,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAdmin = () => useContext(Ctx)
