import {
  createContext, useContext, useState,
  useEffect, useCallback,
} from 'react'
import type { ReactNode } from 'react'

/* Firebase */
import { loginWithEmail, logout as fbLogout, onAuthChange } from '../../firebase/authService'
import {
  fsGetMessages, fsAddMessage, fsMarkMessageRead, fsDeleteMessage,
  fsGetProjects, fsAddProject, fsUpdateProject, fsDeleteProject,
  fsGetSkills, fsSaveSkillGroups,
  fsGetSettings, fsSaveSettings,
} from '../../firebase/firestoreService'

/* Local defaults (shown before Firestore loads) */
import { projects as defaultProjects } from '../../data/projects'
import { skillGroups as defaultSkills } from '../../data/skills'
import type { Project, SkillGroup }    from '../../types'

/* ─── Types ─── */
export interface Message {
  id:      string
  name:    string
  email:   string
  message: string
  date:    string
  read:    boolean
}

export interface AdminSettings {
  bio:         string
  githubUrl:   string
  linkedinUrl: string
  email:       string
  location:    string
}

interface AdminCtx {
  isAuthed:     boolean
  authLoading:  boolean
  login:        (email: string, password: string) => Promise<boolean>
  logout:       () => Promise<void>

  projects:     Project[]
  addProject:   (p: Omit<Project, 'id'>) => Promise<void>
  updateProject:(p: Project) => Promise<void>
  deleteProject:(id: string) => Promise<void>

  skillGroups:       SkillGroup[]
  updateSkillGroups: (groups: SkillGroup[]) => Promise<void>

  messages:     Message[]
  addMessage:   (m: Omit<Message, 'id' | 'date' | 'read'>) => Promise<void>
  markRead:     (id: string) => Promise<void>
  deleteMessage:(id: string) => Promise<void>

  settings:       AdminSettings
  updateSettings: (s: AdminSettings) => Promise<void>
}

/* ─── Default settings ─── */
const DEFAULT_SETTINGS: AdminSettings = {
  bio:         'Junior Full-Stack Software Developer from Zimbabwe, currently training at Uncommon.org.',
  githubUrl:   'https://github.com/Thabisomaqhawengwenya',
  linkedinUrl: 'https://www.linkedin.com/in/maqhawe-ngwenya/',
  email:       'thabisomaqhawengwenya@gmail.com',
  location:    'Zimbabwe',
}

/* ─── Context ─── */
const Ctx = createContext<AdminCtx>({} as AdminCtx)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthed,    setAuthed]      = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  const [projects,    setProjects]    = useState<Project[]>(defaultProjects)
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>(defaultSkills)
  const [messages,    setMessages]    = useState<Message[]>([])
  const [settings,    setSettings]    = useState<AdminSettings>(DEFAULT_SETTINGS)

  /* ── Listen to Firebase auth state ── */
  useEffect(() => {
    const unsub = onAuthChange(user => {
      setAuthed(!!user)
      setAuthLoading(false)
    })
    return unsub
  }, [])

  /* ── Load Firestore data when authenticated ── */
  useEffect(() => {
    if (!isAuthed) return

    fsGetProjects().then(p => { if (p.length) setProjects(p) }).catch(console.error)
    fsGetSkills().then(s   => { if (s.length) setSkillGroups(s) }).catch(console.error)
    fsGetMessages().then(m => setMessages(m)).catch(console.error)
    fsGetSettings().then(s => { if (s) setSettings(s) }).catch(console.error)
  }, [isAuthed])

  /* ── Auth ── */
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      await loginWithEmail(email, password)
      return true
    } catch {
      return false
    }
  }, [])

  const logout = useCallback(async () => {
    await fbLogout()
  }, [])

  /* ── Projects ── */
  const addProject = useCallback(async (p: Omit<Project, 'id'>) => {
    const id = await fsAddProject(p)
    setProjects(prev => [...prev, { ...p, id }])
  }, [])

  const updateProject = useCallback(async (p: Project) => {
    await fsUpdateProject(p)
    setProjects(prev => prev.map(x => x.id === p.id ? p : x))
  }, [])

  const deleteProject = useCallback(async (id: string) => {
    await fsDeleteProject(id)
    setProjects(prev => prev.filter(x => x.id !== id))
  }, [])

  /* ── Skills ── */
  const updateSkillGroups = useCallback(async (groups: SkillGroup[]) => {
    await fsSaveSkillGroups(groups)
    setSkillGroups(groups)
  }, [])

  /* ── Messages ── */
  const addMessage = useCallback(async (m: Omit<Message, 'id' | 'date' | 'read'>) => {
    const id = await fsAddMessage(m)
    setMessages(prev => [{
      ...m, id, date: new Date().toISOString(), read: false,
    }, ...prev])
  }, [])

  const markRead = useCallback(async (id: string) => {
    await fsMarkMessageRead(id)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
  }, [])

  const deleteMessage = useCallback(async (id: string) => {
    await fsDeleteMessage(id)
    setMessages(prev => prev.filter(m => m.id !== id))
  }, [])

  /* ── Settings ── */
  const updateSettings = useCallback(async (s: AdminSettings) => {
    await fsSaveSettings(s)
    setSettings(s)
  }, [])

  return (
    <Ctx.Provider value={{
      isAuthed, authLoading, login, logout,
      projects, addProject, updateProject, deleteProject,
      skillGroups, updateSkillGroups,
      messages, addMessage, markRead, deleteMessage,
      settings, updateSettings,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAdmin = () => useContext(Ctx)
