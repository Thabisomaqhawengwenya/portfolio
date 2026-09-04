import type { ExperienceItem } from '../types'

export const experience: ExperienceItem[] = [
  {
    id:           'uncommon-2024',
    type:         'education',
    title:        'Software Development Programme',
    organization: 'Uncommon.org',
    location:     'Zimbabwe',
    startDate:    '2024',
    description:
      'Intensive full-stack software development training. Building real-world applications from scratch using modern web technologies, with a strong focus on JavaScript, React, Node.js, and professional engineering practices.',
    highlights: [
      'Built and deployed full-stack web applications end-to-end',
      'Worked in teams using Agile and Scrum methodologies',
      'Practiced code review, pair programming, and collaborative Git workflows',
      'Developed Island Child Apparel and Toyota Zimbabwe as major capstone projects',
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'JavaScript', 'SQL', 'Prisma', 'Git'],
    url: 'https://uncommon.org',
  },
  {
    id:           'island-child-2025',
    type:         'project',
    title:        'Lead Developer — Island Child Apparel',
    organization: 'Capstone Project',
    location:     'Zimbabwe',
    startDate:    '2025',
    description:
      'Designed and built a full-stack e-commerce platform for a local fashion brand. Responsible for architecture decisions, frontend implementation, and backend API development.',
    highlights: [
      'Designed the full system architecture from data model to UI',
      'Built a responsive storefront with product catalogue and cart',
      'Implemented REST API with Node.js and Express',
      'Managed database schema and migrations with Prisma and PostgreSQL',
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Styled Components'],
  },
  {
    id:           'toyota-2025',
    type:         'project',
    title:        'Developer — Toyota Zimbabwe Website',
    organization: 'Capstone Project',
    location:     'Zimbabwe',
    startDate:    '2025',
    description:
      'Collaborated on a professional website rebuild for Toyota Zimbabwe. Focused on responsive design, performance, and delivering a high-quality user experience.',
    highlights: [
      'Translated design concepts into clean, production-ready React components',
      'Implemented responsive layouts that work across all device sizes',
      'Contributed to team codebase through structured Git workflows',
    ],
    technologies: ['React', 'JavaScript', 'HTML', 'CSS', 'Git', 'GitHub'],
  },
  {
    id:           'portfolio-2026',
    type:         'project',
    title:        'Personal Portfolio — v1',
    organization: 'Personal Project',
    startDate:    '2026',
    description:
      'Designed and developed this portfolio from scratch. Practised animation, theming, accessibility, and production build optimization.',
    highlights: [
      'Built with React, TypeScript, Styled Components, and Framer Motion',
      'Implemented smooth scrolling, section reveal animations, and responsive layout',
      'Prioritised accessibility and performance throughout',
    ],
    technologies: ['React', 'TypeScript', 'Styled Components', 'Framer Motion', 'Vite'],
  },
]
