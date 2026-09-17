import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            'AIzaSyCenJUi43hnD80VNK-aKx4YYk6v7oew0RI',
  authDomain:        'portfolio-13662.firebaseapp.com',
  projectId:         'portfolio-13662',
  storageBucket:     'portfolio-13662.firebasestorage.app',
  messagingSenderId: '892518225274',
  appId:             '1:892518225274:web:da810e00c8f55da97ff2c3',
  measurementId:     'G-WYTDKSMD0G',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

const projects = [
  {
    id: 'island-child',
    title: 'Island Child Apparel',
    description: 'Full-stack e-commerce platform for a local fashion brand — product catalogue, cart, and checkout flow.',
    longDescription: 'A complete e-commerce solution built from the ground up. Features a responsive storefront, product management, shopping cart, and a RESTful API backend. Designed to feel clean and editorial while remaining fully functional.',
    image: '/images/projects/island-child.webp',
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Styled Components'],
    github: 'https://github.com/Thabisomaqhawengwenya',
    featured: true,
    status: 'live',
    category: 'Business',
    order: 0,
  },
  {
    id: 'toyota-zimbabwe',
    title: 'Toyota Zimbabwe',
    description: 'Professional website rebuild for Toyota Zimbabwe — responsive, performant, and brand-aligned.',
    longDescription: 'A collaborative rebuild of the Toyota Zimbabwe web presence. Focused on responsive design, performance optimisation, and delivering a polished, on-brand user experience across all device sizes.',
    image: '/images/projects/toyota.webp',
    technologies: ['React', 'JavaScript', 'HTML', 'CSS', 'Git'],
    github: 'https://github.com/Thabisomaqhawengwenya',
    featured: true,
    status: 'live',
    category: 'Business',
    order: 1,
  },
  {
    id: 'devpulse-dashboard',
    title: 'DevPulse Metrics',
    description: 'Real-time developer analytics dashboard tracking team commits, CI build health, and velocity.',
    longDescription: 'A dashboard web application providing automated insights for engineering teams. Integrates repository activity, build statuses, and sprint milestones with interactive charting and dark-mode data visualizations.',
    technologies: ['React', 'TypeScript', 'TailwindCSS', 'Node.js', 'PostgreSQL', 'REST API'],
    github: 'https://github.com/Thabisomaqhawengwenya',
    featured: true,
    status: 'live',
    category: 'Business',
    order: 2,
  },
  {
    id: 'apex-logistics',
    title: 'Apex Freight & Logistics',
    description: 'Enterprise fleet management and shipment booking portal for regional freight carriers.',
    longDescription: 'Cloud-native logistics platform featuring real-time GPS fleet tracking, automated rate quotation, bill-of-lading generation, and client self-service portals.',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Google Maps API'],
    github: 'https://github.com/Thabisomaqhawengwenya',
    featured: false,
    status: 'live',
    category: 'Business',
    order: 3,
  },
  {
    id: 'portfolio',
    title: 'Personal Portfolio',
    description: 'This portfolio — built with React, TypeScript, Styled Components and Framer Motion.',
    longDescription: 'Designed and developed to showcase my work and communicate my approach to software development. Prioritises clean typography, purposeful animation, and accessibility.',
    technologies: ['React', 'TypeScript', 'Styled Components', 'Framer Motion', 'Vite', 'Lenis'],
    github: 'https://github.com/Thabisomaqhawengwenya',
    featured: false,
    status: 'live',
    category: 'Personal',
    order: 4,
  },
  {
    id: 'algovision-lab',
    title: 'AlgoVision Lab',
    description: 'Interactive visualizer for sorting, pathfinding, and graph search algorithms.',
    longDescription: 'An educational web tool designed to demystify complex algorithms. Features step-by-step state playback, time complexity graphs, and interactive maze generation.',
    technologies: ['React', 'TypeScript', 'Canvas API', 'Framer Motion', 'Web Workers'],
    github: 'https://github.com/Thabisomaqhawengwenya',
    featured: true,
    status: 'live',
    category: 'Personal',
    order: 5,
  },
  {
    id: 'dotcraft-cli',
    title: 'DotCraft CLI',
    description: 'Developer workspace automation tool for bootstrapping standardized dev environments.',
    longDescription: 'A cross-platform command line utility written in TypeScript and Node.js to manage shell configurations, symlink dotfiles, and provision developer workstations.',
    technologies: ['TypeScript', 'Node.js', 'Commander.js', 'Inquirer', 'Bash'],
    github: 'https://github.com/Thabisomaqhawengwenya',
    featured: false,
    status: 'live',
    category: 'Personal',
    order: 6,
  },
  {
    id: 'marknotes-editor',
    title: 'MarkNotes Minimal',
    description: 'Distraction-free local-first Markdown notebook with LaTeX math and code execution.',
    longDescription: 'A fast, offline-first notes application with instant Markdown rendering, syntax highlighting, and local filesystem synchronization using the File System Access API.',
    technologies: ['React', 'TypeScript', 'Monaco Editor', 'IndexedDB', 'TailwindCSS'],
    github: 'https://github.com/Thabisomaqhawengwenya',
    featured: false,
    status: 'live',
    category: 'Personal',
    order: 7,
  },
  {
    id: 'fitpulse-tracker',
    title: 'FitPulse Mobile App',
    description: 'Cross-platform fitness tracker with offline workout logging and health insights.',
    longDescription: 'A mobile workout tracking app designed for gym and outdoor athletes. Features customizable routine builders, rest timer notifications, and interactive progress analytics.',
    technologies: ['React Native', 'Expo', 'TypeScript', 'SQLite', 'Reanimated'],
    github: 'https://github.com/Thabisomaqhawengwenya',
    featured: true,
    status: 'live',
    category: 'Mobile',
    order: 8,
  },
  {
    id: 'cryptoscan-mobile',
    title: 'CryptoScan Wallet & Alerts',
    description: 'Lightweight crypto wallet tracker with on-chain whale alerts and gas estimators.',
    longDescription: 'Mobile dashboard for tracking digital assets across EVM chains. Delivers customizable push alerts on gas price dips and significant address movements.',
    technologies: ['React Native', 'TypeScript', 'Ethers.js', 'CoinGecko API', 'Redux Toolkit'],
    github: 'https://github.com/Thabisomaqhawengwenya',
    featured: false,
    status: 'live',
    category: 'Mobile',
    order: 9,
  },
  {
    id: 'giftly-card-creator',
    title: 'Giftly Personalized Greetings',
    description: 'Custom animated digital card and gift voucher builder with confetti celebrations.',
    longDescription: 'Interactive web platform enabling users to compose, customize, and deliver bespoke digital greeting cards and gift tokens with rich micro-animations.',
    technologies: ['React', 'TypeScript', 'Framer Motion', 'Canvas Confetti', 'TailwindCSS'],
    github: 'https://github.com/Thabisomaqhawengwenya',
    featured: true,
    status: 'live',
    category: 'Gift',
    order: 10,
  },
  {
    id: 'wishbox-registry',
    title: 'WishBox Registry',
    description: 'Crowdfunded celebration registry for birthdays, weddings, and milestones.',
    longDescription: 'Social wishlist and milestone funding platform where friends and family can pool contributions toward meaningful gifts and celebrate occasions.',
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Stripe API'],
    github: 'https://github.com/Thabisomaqhawengwenya',
    featured: false,
    status: 'live',
    category: 'Gift',
    order: 11,
  },
]

const certificates = [
  {
    id: 'uncommon-fullstack',
    title: 'Full-Stack Software Development',
    issuer: 'Uncommon.org',
    issueDate: '2025',
    credentialId: 'UNC-FS-2025-084',
    credentialUrl: 'https://uncommon.org',
    skills: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'REST APIs'],
    featured: true,
    order: 0,
  },
  {
    id: 'meta-frontend',
    title: 'Meta Front-End Developer Professional Certificate',
    issuer: 'Meta / Coursera',
    issueDate: '2024',
    credentialId: 'COURSERA-META-FE-992',
    credentialUrl: 'https://www.coursera.org',
    skills: ['React', 'JavaScript', 'HTML5 & CSS3', 'UI/UX Design', 'Version Control'],
    featured: true,
    order: 1,
  },
  {
    id: 'fcc-js-algorithms',
    title: 'JavaScript Algorithms & Data Structures',
    issuer: 'freeCodeCamp',
    issueDate: '2024',
    credentialId: 'FCC-JS-ALGO-4102',
    credentialUrl: 'https://www.freecodecamp.org',
    skills: ['JavaScript ES6+', 'Data Structures', 'Algorithms', 'OOP', 'Functional Programming'],
    featured: true,
    order: 2,
  },
  {
    id: 'fcc-responsive-web',
    title: 'Responsive Web Design Certification',
    issuer: 'freeCodeCamp',
    issueDate: '2024',
    credentialId: 'FCC-RWD-7819',
    credentialUrl: 'https://www.freecodecamp.org',
    skills: ['Responsive CSS', 'Flexbox', 'CSS Grid', 'Typography', 'Web Accessibility'],
    featured: false,
    order: 3,
  },
  {
    id: 'node-express-backend',
    title: 'Node.js & Express RESTful API Development',
    issuer: 'Codecademy',
    issueDate: '2024',
    credentialId: 'CAD-NODE-EXP-331',
    credentialUrl: 'https://www.codecademy.com',
    skills: ['Node.js', 'Express', 'JWT Auth', 'REST Architecture', 'Middleware'],
    featured: false,
    order: 4,
  },
  {
    id: 'git-github-pro',
    title: 'Git & GitHub Team Collaboration Workflow',
    issuer: 'LinkedIn Learning',
    issueDate: '2024',
    credentialId: 'LNK-GIT-PRO-105',
    credentialUrl: 'https://www.linkedin.com/learning',
    skills: ['Git CLI', 'GitHub Actions', 'Code Review', 'Branching Strategy', 'CI/CD'],
    featured: false,
    order: 5,
  },
]

const experience = [
  {
    id: 'uncommon-2025',
    type: 'education',
    title: 'Software Development Programme',
    organization: 'Uncommon.org',
    location: 'Zimbabwe',
    startDate: '2025',
    description: 'Intensive full-stack software development training. Building real-world applications from scratch using modern web technologies, with a strong focus on JavaScript, React, Node.js, and professional engineering practices.',
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
    id: 'island-child-2025',
    type: 'project',
    title: 'Lead Developer — Island Child Apparel',
    organization: 'Capstone Project',
    location: 'Zimbabwe',
    startDate: '2025',
    description: 'Designed and built a full-stack e-commerce platform for a local fashion brand. Responsible for architecture decisions, frontend implementation, and backend API development.',
    highlights: [
      'Designed the full system architecture from data model to UI',
      'Built a responsive storefront with product catalogue and cart',
      'Implemented REST API with Node.js and Express',
      'Managed database schema and migrations with Prisma and PostgreSQL',
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'Prisma', 'PostgreSQL', 'Styled Components'],
  },
  {
    id: 'toyota-2025',
    type: 'project',
    title: 'Developer — Toyota Zimbabwe Website',
    organization: 'Capstone Project',
    location: 'Zimbabwe',
    startDate: '2025',
    description: 'Collaborated on a professional website rebuild for Toyota Zimbabwe. Focused on responsive design, performance, and delivering a high-quality user experience.',
    highlights: [
      'Translated design concepts into clean, production-ready React components',
      'Implemented responsive layouts that work across all device sizes',
      'Contributed to team codebase through structured Git workflows',
    ],
    technologies: ['React', 'JavaScript', 'HTML', 'CSS', 'Git', 'GitHub'],
  },
  {
    id: 'portfolio-2026',
    type: 'project',
    title: 'Personal Portfolio — v1',
    organization: 'Personal Project',
    startDate: '2026',
    description: 'Designed and developed this portfolio from scratch. Practised animation, theming, accessibility, and production build optimization.',
    highlights: [
      'Built with React, TypeScript, Styled Components, and Framer Motion',
      'Implemented smooth scrolling, section reveal animations, and responsive layout',
      'Prioritised accessibility and performance throughout',
    ],
    technologies: ['React', 'TypeScript', 'Styled Components', 'Framer Motion', 'Vite'],
  },
]

const skillGroups = [
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

const settings = {
  bio:         'Junior Full-Stack Software Developer from Zimbabwe, currently training at Uncommon.org.',
  githubUrl:   'https://github.com/Thabisomaqhawengwenya',
  linkedinUrl: 'https://www.linkedin.com/in/maqhawe-ngwenya/',
  email:       'thabisomaqhawengwenya@gmail.com',
  location:    'Zimbabwe',
}

const heroContent = {
  greeting:  'Hello, World',
  role:      'Junior Full-Stack Software Developer. Building modern, useful, and engaging digital experiences — from Zimbabwe to the world.',
  available: true,
  sticker1:  'React + TS',
  sticker2:  'Node.js',
  sticker3:  'Full-Stack',
  cvUrl:     '/Maqhawe-Ngwenya-CV.pdf',
}

async function seed() {
  console.log('🚀 Authenticating with Firebase...')
  const email = 'thabisomaqhawengwenya@gmail.com'
  const password = 'maqhawe_portfolio_admin'

  try {
    await signInWithEmailAndPassword(auth, email, password)
    console.log(`✓ Signed in as ${email}`)
  } catch (authErr) {
    console.log(`ℹ Sign-in note: ${authErr.message}. Attempting with alternate password or creating user...`)
    try {
      await signInWithEmailAndPassword(auth, email, 'maqhawe06')
      console.log(`✓ Signed in as ${email}`)
    } catch {
      try {
        await createUserWithEmailAndPassword(auth, email, password)
        console.log(`✓ Created and signed in as ${email}`)
      } catch (createErr) {
        console.log(`ℹ Notice: ${createErr.message}`)
      }
    }
  }

  console.log('🚀 Starting Firebase Firestore data seeding...')

  // 1. Projects
  console.log(`Writing ${projects.length} projects to Firestore 'projects' collection...`)
  try {
    for (const p of projects) {
      await setDoc(doc(db, 'projects', p.id), p)
    }
    console.log('✓ Projects saved.')
  } catch (e) {
    console.error('❌ Failed saving projects:', e.message)
  }

  // 2. Journey
  console.log(`Writing ${experience.length} journey items to Firestore 'journey' collection...`)
  try {
    for (const exp of experience) {
      await setDoc(doc(db, 'journey', exp.id), exp)
    }
    console.log('✓ Journey items saved.')
  } catch (e) {
    console.error('❌ Failed saving journey:', e.message)
  }

  // 3. Skills
  console.log(`Writing ${skillGroups.length} skill categories to Firestore 'skills' collection...`)
  try {
    for (const group of skillGroups) {
      await setDoc(doc(db, 'skills', group.category), group)
    }
    console.log('✓ Skills saved.')
  } catch (e) {
    console.error('❌ Failed saving skills:', e.message)
  }

  // 4. Settings
  console.log('Writing settings to Firestore...')
  try {
    await setDoc(doc(db, 'settings', 'main'), settings)
    console.log('✓ Settings saved.')
  } catch (e) {
    console.error('❌ Failed saving settings:', e.message)
  }

  // 5. Hero Content
  console.log('Writing hero content to Firestore...')
  try {
    await setDoc(doc(db, 'heroContent', 'main'), heroContent)
    console.log('✓ Hero content saved.')
  } catch (e) {
    console.error('❌ Failed saving hero content:', e.message)
  }

  // 6. Certificates
  console.log(`Writing ${certificates.length} certificates to Firestore 'certificates' collection...`)
  try {
    for (const c of certificates) {
      await setDoc(doc(db, 'certificates', c.id), c)
    }
    console.log('✓ Certificates saved.')
  } catch (e) {
    console.error('❌ Failed saving certificates:', e.message)
  }

  console.log('\n🏁 Seeding routine complete.')
  process.exit(0)
}

seed().catch(err => {
  console.error('❌ Error storing data on Firebase:', err)
  process.exit(1)
})

