import type { Project } from '../types'

export const projects: Project[] = [
  {
    id:          'island-child',
    title:       'Island Child Apparel',
    description: 'Full-stack e-commerce platform for a local fashion brand — product catalogue, cart, and checkout flow.',
    longDescription:
      'A complete e-commerce solution built from the ground up. Features a responsive storefront, product management, shopping cart, and a RESTful API backend. Designed to feel clean and editorial while remaining fully functional.',
    image:       '/images/projects/island-child.webp',
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Styled Components'],
    github:      'https://github.com/Thabisomaqhawengwenya', // Update with actual repo
    featured:    true,
    status:      'live',
  },
  {
    id:          'toyota-zimbabwe',
    title:       'Toyota Zimbabwe',
    description: 'Professional website rebuild for Toyota Zimbabwe — responsive, performant, and brand-aligned.',
    longDescription:
      'A collaborative rebuild of the Toyota Zimbabwe web presence. Focused on responsive design, performance optimisation, and delivering a polished, on-brand user experience across all device sizes.',
    image:       '/images/projects/toyota.webp',
    technologies: ['React', 'JavaScript', 'HTML', 'CSS', 'Git'],
    github:      'https://github.com/Thabisomaqhawengwenya', // Update with actual repo
    featured:    true,
    status:      'live',
  },
  {
    id:          'portfolio',
    title:       'Personal Portfolio',
    description: 'This portfolio — built with React, TypeScript, Styled Components and Framer Motion.',
    longDescription:
      'Designed and developed to showcase my work and communicate my approach to software development. Prioritises clean typography, purposeful animation, and accessibility.',
    technologies: ['React', 'TypeScript', 'Styled Components', 'Framer Motion', 'Vite', 'Lenis'],
    github:      'https://github.com/Thabisomaqhawengwenya',
    featured:    false,
    status:      'live',
  },
]
