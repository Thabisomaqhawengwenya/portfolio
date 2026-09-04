import type { SkillGroup } from '../types'

export const skillGroups: SkillGroup[] = [
  {
    category: 'Frontend',
    skills: [
      { name: 'React',             category: 'Frontend' },
      { name: 'TypeScript',        category: 'Frontend' },
      { name: 'JavaScript',        category: 'Frontend' },
      { name: 'HTML',              category: 'Frontend' },
      { name: 'CSS',               category: 'Frontend' },
      { name: 'Styled Components', category: 'Frontend' },
      { name: 'Vite',              category: 'Frontend' },
      { name: 'Framer Motion',     category: 'Frontend' },
    ],
  },
  {
    category: 'Backend',
    skills: [
      { name: 'Node.js',   category: 'Backend' },
      { name: 'Express',   category: 'Backend' },
      { name: 'REST APIs', category: 'Backend' },
    ],
  },
  {
    category: 'Database',
    skills: [
      { name: 'SQL',        category: 'Database' },
      { name: 'PostgreSQL', category: 'Database' },
      { name: 'Prisma',     category: 'Database' },
    ],
  },
  {
    category: 'Tools',
    skills: [
      { name: 'Git',    category: 'Tools' },
      { name: 'GitHub', category: 'Tools' },
      { name: 'VS Code',category: 'Tools' },
      { name: 'Figma',  category: 'Tools' },
    ],
  },
  {
    category: 'Other',
    skills: [
      { name: 'Agile / Scrum',           category: 'Other' },
      { name: 'AI-assisted Development', category: 'Other' },
      { name: 'Accessibility (WCAG)',    category: 'Other' },
    ],
  },
]
