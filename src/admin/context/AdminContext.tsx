import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { projects as defaultProjects } from '../../data/projects'
import { skillGroups as defaultSkills } from '../../data/skills'
import type { Project, SkillGroup } from '../../types'

/* ─── Types ─── */
export interface Message {
  id:        string
  name:      string
  email:     string
  message:   string
  date:      string
  read:      boolean
}

export interface AdminSettings {
  bio:        string
  githubUrl:  string
  linkedinUrl:string
  email:      string
  location:   string
}

interface AdminCtx {
  /* Auth */
  isAuthed:    boolean
  login:       (password: string) => boolean
  logout:      () => void
  /* Projects */
  projects:    Project[]
  addProject:  (p: Omit<Project, 'id'>) => void
  updateProject:(p: Project) => void
  deleteProject:(id: string) => void
  /* Skills */
  skillGroups: SkillGroup[]
  updateSkillGroups:(groups: SkillGroup[]) => void
  /* Messages */
  messages:    Message[]
  addMessage:  (m: Omit<Message, 'id' | 'date' | 'read'>) => void
  markRead:    (id: string) => void
  deleteMessage:(id: string) => void
  /* Settings */
  settings:    AdminSettings
  updateSettings:(s: AdminSettings) => void
}

/* ─── Defaults ─── */
const ADMIN_PASSWORD = 'admin2026'   // Change this

const DEFAULT_SETTINGS: AdminSettings = {
  bio:         "Junior Full-Stack Software Developer from Zimbabwe, currently training at Uncommon.org.",
  githubUrl:   'https://github.com/Thabisomaqhawengwenya',
  linkedinUrl: 'https://www.linkedin.com/in/maqhawe-ngwenya/',
  email:       'thabisomaqhawengwenya@gmail.com',
  location:    'Zimbabwe',
}

/* ─── Helpers ─── */
const ls = {
  get: <T,>(key: string, fallback: T): T => {
    try {
      const v = localStorage.getItem(key)
      return v ? JSON.parse(v) : fallback
    } catch { return fallback }
  },
  set: (key: string, value: unknown) => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* noop */ }
  },
}

/* ─── Context ─── */
const Ctx = createContext<AdminCtx>({} as AdminCtx)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthed,    setAuthed]      = useState(() => ls.get('admin-auth', false))
  const [projects,    setProjects]    = useState<Project[]>(() => ls.get('admin-projects', defaultProjects))
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>(() => ls.get('admin-skills', defaultSkills))
  const [messages,    setMessages]    = useState<Message[]>(() => ls.get('admin-messages', []))
  const [settings,    setSettings]    = useState<AdminSettings>(() => ls.get('admin-settings', DEFAULT_SETTINGS))

  /* Persist on change */
  useEffect(() => { ls.set('admin-projects',  projects)    }, [projects])
  useEffect(() => { ls.set('admin-skills',    skillGroups) }, [skillGroups])
  useEffect(() => { ls.set('admin-messages',  messages)    }, [messages])
  useEffect(() => { ls.set('admin-settings',  settings)    }, [settings])
  useEffect(() => { ls.set('admin-auth',      isAuthed)    }, [isAuthed])

  const login = useCallback((pw: string): boolean => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true); return true }
    return false
  }, [])

  const logout = useCallback(() => {
    setAuthed(false)
    localStorage.removeItem('admin-auth')
  }, [])

  const addProject = useCallback((p: Omit<Project, 'id'>) => {
    setProjects(prev => [...prev, { ...p, id: Date.now().toString() }])
  }, [])

  const updateProject = useCallback((p: Project) => {
    setProjects(prev => prev.map(x => x.id === p.id ? p : x))
  }, [])

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(x => x.id !== id))
  }, [])

  const updateSkillGroups = useCallback((groups: SkillGroup[]) => {
    setSkillGroups(groups)
  }, [])

  const addMessage = useCallback((m: Omit<Message, 'id' | 'date' | 'read'>) => {
    setMessages(prev => [{
      ...m,
      id:   Date.now().toString(),
      date: new Date().toISOString(),
      read: false,
    }, ...prev])
  }, [])

  const markRead = useCallback((id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
  }, [])

  const deleteMessage = useCallback((id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id))
  }, [])

  const updateSettings = useCallback((s: AdminSettings) => setSettings(s), [])

  return (
    <Ctx.Provider value={{
      isAuthed, login, logout,
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
