import type { Project } from '../types'

export const projects: Project[] = [
  /* ── Business ── */
  {
    id:          'island-child',
    title:       'Island Child Apparel',
    description: 'Full-stack e-commerce platform for a local fashion brand — product catalogue, cart, and checkout flow.',
    longDescription:
      'A complete e-commerce solution built from the ground up. Features a responsive storefront, product management, shopping cart, and a RESTful API backend. Designed to feel clean and editorial while remaining fully functional.',
    image:       '/images/projects/island-child.webp',
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Styled Components'],
    github:      'https://github.com/Thabisomaqhawengwenya',
    featured:    true,
    status:      'live',
    category:    'Business',
  },
  {
    id:          'toyota-zimbabwe',
    title:       'Toyota Zimbabwe',
    description: 'Professional website rebuild for Toyota Zimbabwe — responsive, performant, and brand-aligned.',
    longDescription:
      'A collaborative rebuild of the Toyota Zimbabwe web presence. Focused on responsive design, performance optimisation, and delivering a polished, on-brand user experience across all device sizes.',
    image:       '/images/projects/toyota.webp',
    technologies: ['React', 'JavaScript', 'HTML', 'CSS', 'Git'],
    github:      'https://github.com/Thabisomaqhawengwenya',
    featured:    true,
    status:      'live',
    category:    'Business',
  },
  {
    id:          'devpulse-dashboard',
    title:       'DevPulse Metrics',
    description: 'Real-time developer analytics dashboard tracking team commits, CI build health, and velocity.',
    longDescription:
      'A dashboard web application providing automated insights for engineering teams. Integrates repository activity, build statuses, and sprint milestones with interactive charting and dark-mode data visualizations.',
    technologies: ['React', 'TypeScript', 'TailwindCSS', 'Node.js', 'PostgreSQL', 'REST API'],
    github:      'https://github.com/Thabisomaqhawengwenya',
    featured:    true,
    status:      'live',
    category:    'Business',
  },
  {
    id:          'apex-logistics',
    title:       'Apex Freight & Logistics',
    description: 'Enterprise fleet management and shipment booking portal for regional freight carriers.',
    longDescription:
      'Cloud-native logistics platform featuring real-time GPS fleet tracking, automated rate quotation, bill-of-lading generation, and client self-service portals.',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Google Maps API'],
    github:      'https://github.com/Thabisomaqhawengwenya',
    featured:    false,
    status:      'live',
    category:    'Business',
  },

  /* ── Personal ── */
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
    category:    'Personal',
  },
  {
    id:          'algovision-lab',
    title:       'AlgoVision Lab',
    description: 'Interactive visualizer for sorting, pathfinding, and graph search algorithms.',
    longDescription:
      'An educational web tool designed to demystify complex algorithms. Features step-by-step state playback, time complexity graphs, and interactive maze generation.',
    technologies: ['React', 'TypeScript', 'Canvas API', 'Framer Motion', 'Web Workers'],
    github:      'https://github.com/Thabisomaqhawengwenya',
    featured:    true,
    status:      'live',
    category:    'Personal',
  },
  {
    id:          'dotcraft-cli',
    title:       'DotCraft CLI',
    description: 'Developer workspace automation tool for bootstrapping standardized dev environments.',
    longDescription:
      'A cross-platform command line utility written in TypeScript and Node.js to manage shell configurations, symlink dotfiles, and provision developer workstations.',
    technologies: ['TypeScript', 'Node.js', 'Commander.js', 'Inquirer', 'Bash'],
    github:      'https://github.com/Thabisomaqhawengwenya',
    featured:    false,
    status:      'live',
    category:    'Personal',
  },
  {
    id:          'marknotes-editor',
    title:       'MarkNotes Minimal',
    description: 'Distraction-free local-first Markdown notebook with LaTeX math and code execution.',
    longDescription:
      'A fast, offline-first notes application with instant Markdown rendering, syntax highlighting, and local filesystem synchronization using the File System Access API.',
    technologies: ['React', 'TypeScript', 'Monaco Editor', 'IndexedDB', 'TailwindCSS'],
    github:      'https://github.com/Thabisomaqhawengwenya',
    featured:    false,
    status:      'live',
    category:    'Personal',
  },

  /* ── Mobile ── */
  {
    id:          'recipe-vault',
    title:       'RecipeVault Mobile',
    description: 'Cross-platform mobile recipe organizer with smart grocery shopping list and meal planner.',
    longDescription:
      'A modern mobile-first web application enabling users to curate recipes, generate automated grocery checklists, and plan weekly meals with offline synchronization.',
    technologies: ['React', 'TypeScript', 'PWA', 'Styled Components', 'Firebase'],
    github:      'https://github.com/Thabisomaqhawengwenya',
    featured:    false,
    status:      'wip',
    category:    'Mobile',
  },
  {
    id:          'fitpulse-tracker',
    title:       'FitPulse Workout Companion',
    description: 'Mobile workout and habit tracker with HIIT interval timers and biometric charts.',
    longDescription:
      'A mobile-optimized workout logging app. Includes custom routine builders, rest-interval audio alerts, and detailed progressive overload analytics.',
    technologies: ['React', 'TypeScript', 'TailwindCSS', 'PWA', 'Chart.js'],
    github:      'https://github.com/Thabisomaqhawengwenya',
    featured:    true,
    status:      'live',
    category:    'Mobile',
  },
  {
    id:          'vaultx-mobile',
    title:       'VaultX Portfolio PWA',
    description: 'Real-time asset & crypto portfolio tracker with offline caching and price alerts.',
    longDescription:
      'Mobile progressive web application for monitoring multi-chain asset balances, price movements, and market trends with biometric unlock and local encryption.',
    technologies: ['React', 'TypeScript', 'PWA', 'Service Workers', 'CoinGecko API'],
    github:      'https://github.com/Thabisomaqhawengwenya',
    featured:    false,
    status:      'live',
    category:    'Mobile',
  },
  {
    id:          'zimtransit-app',
    title:       'ZimTransit Commuter',
    description: 'Harare urban transport route finder, fare estimator, and commuter schedule guide.',
    longDescription:
      'Mobile commuter helper mapping public transit routes, terminal locations, standard fares, and real-time community traffic alerts across Harare.',
    technologies: ['React', 'TypeScript', 'Leaflet', 'PWA', 'Styled Components'],
    github:      'https://github.com/Thabisomaqhawengwenya',
    featured:    false,
    status:      'wip',
    category:    'Mobile',
  },

  /* ── Gift ── */
  {
    id:          'kudana-registry',
    title:       'Kudana Gift Registry',
    description: 'Social gift registry and wishlist platform designed for weddings, birthdays, and celebrations.',
    longDescription:
      'A gift registry platform allowing organizers to create custom event wishlists, accept guest contributions, and track claimed gifts with real-time notifications.',
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'Prisma', 'PostgreSQL'],
    github:      'https://github.com/Thabisomaqhawengwenya',
    featured:    false,
    status:      'live',
    category:    'Gift',
  },
  {
    id:          'celebrate-hub',
    title:       'CelebrateHub Cards',
    description: 'Collaborative group digital greeting cards with collective gift funding.',
    longDescription:
      'Interactive card creation platform allowing teams and friends to sign digital cards with GIFs, video messages, and pooled group gift card contributions.',
    technologies: ['React', 'TypeScript', 'Canvas', 'Stripe API', 'Firebase'],
    github:      'https://github.com/Thabisomaqhawengwenya',
    featured:    true,
    status:      'live',
    category:    'Gift',
  },
  {
    id:          'wishcraft-exchange',
    title:       'WishCraft Secret Santa',
    description: 'Automated holiday gift exchange organizer with budget limits and anonymous matching.',
    longDescription:
      'Secret Santa matching engine for families and remote workplaces. Handles exclusion rules, anonymous question asking, and personalized wishlist links.',
    technologies: ['React', 'TypeScript', 'Node.js', 'TailwindCSS', 'SendGrid API'],
    github:      'https://github.com/Thabisomaqhawengwenya',
    featured:    false,
    status:      'live',
    category:    'Gift',
  },
  {
    id:          'present-pal',
    title:       'PresentPal Reminders',
    description: 'AI-assisted gift idea generator and recurring anniversary reminder engine.',
    longDescription:
      'Intelligent occasion calendar that tracks recipient interests, suggests curated gifts within budget, and sends timely reminders before milestones.',
    technologies: ['React', 'TypeScript', 'Styled Components', 'OpenAI API', 'Node.js'],
    github:      'https://github.com/Thabisomaqhawengwenya',
    featured:    false,
    status:      'wip',
    category:    'Gift',
  },
]
