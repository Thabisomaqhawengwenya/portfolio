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
