/* ─── Project ─── */
export interface Project {
  id:          string
  title:       string
  description: string
  longDescription?: string
  image?:      string
  technologies: string[]
  github?:     string
  liveUrl?:    string
  featured?:   boolean
  status:      'live' | 'wip' | 'archived'
  category:    'Business' | 'Mobile' | 'Gift' | 'Personal'
  order?:      number
}

/* ─── Certificate ─── */
export interface Certificate {
  id:            string
  title:         string
  issuer:        string
  issuerLogo?:   string
  issueDate:     string
  expiryDate?:   string
  credentialId?: string
  credentialUrl?: string
  skills:        string[]
  featured?:     boolean
  order?:        number
}

/* ─── Experience / Journey ─── */
export interface ExperienceItem {
  id:           string
  type:         'education' | 'work' | 'project' | 'milestone'
  title:        string
  organization: string
  location?:    string
  startDate:    string
  endDate?:     string        // undefined = present
  description:  string
  highlights?:  string[]
  technologies?: string[]
  url?:         string
  order?:       number
}

/* ─── Skill ─── */
export interface Skill {
  name:     string
  category: SkillCategory
  icon?:    string
}

export type SkillCategory =
  | 'Frontend'
  | 'Backend'
  | 'Database'
  | 'Tools'
  | 'Design'
  | 'Other'

export interface SkillGroup {
  category: SkillCategory
  skills:   Skill[]
  order?:   number
}

/* ─── Education ─── */
export interface EducationItem {
  id:           string
  institution:  string
  program:      string
  field:        string
  startDate:    string
  endDate?:     string
  description:  string
  highlights?:  string[]
  url?:         string
}

/* ─── Social link ─── */
export interface SocialLink {
  label:    string
  href:     string
  icon:     string
}

/* ─── Nav item ─── */
export interface NavItem {
  label:  string
  href:   string
}

/* ─── Hero editable content ─── */
export interface HeroContent {
  greeting:     string   // "Hello, World" label
  role:         string   // subtitle line
  available:    boolean  // show "Open" dot
  sticker1:     string
  sticker2:     string
  sticker3:     string
  cvUrl:        string   // public URL to the CV PDF
}

/* ─── GitHub Stats ─── */
export interface GitHubStats {
  projectCount: number   // total public repositories from GitHub
  commitCount:  number   // total authored commits from GitHub
  lastUpdated:  number   // timestamp in milliseconds
}

/* ─── Section Visibility ─── */
export interface SectionVisibility {
  hero: boolean
  marquee: boolean
  about: boolean
  journey: boolean
  skills: boolean
  projects: boolean
  certificates: boolean
  faq: boolean
  contact: boolean
}

export const DEFAULT_SECTION_VISIBILITY: SectionVisibility = {
  hero: true,
  marquee: true,
  about: true,
  journey: true,
  skills: true,
  projects: true,
  certificates: true,
  faq: true,
  contact: true,
}

/* ─── Analytics Summary ─── */
export interface AnalyticsSummary {
  pageViews: number
  uniqueVisitors: number
  cvDownloads: number
  projectClicks: number
  contactSubmissions: number
  lastUpdated: number
}

export const DEFAULT_ANALYTICS_SUMMARY: AnalyticsSummary = {
  pageViews: 0,
  uniqueVisitors: 0,
  cvDownloads: 0,
  projectClicks: 0,
  contactSubmissions: 0,
  lastUpdated: 0,
}
