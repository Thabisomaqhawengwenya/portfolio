import type { EducationItem } from '../types'

export const education: EducationItem[] = [
  {
    id:          'uncommon',
    institution: 'Uncommon.org',
    program:     'Software Development',
    field:       'Full-Stack Web Development',
    startDate:   '2024',
    description:
      'A rigorous, project-based software engineering programme. Covers the full web development stack from foundations to production deployment, with a focus on real-world application building and professional engineering practices.',
    highlights: [
      'Full-stack application development (React, Node.js, PostgreSQL)',
      'Agile/Scrum team collaboration and code review culture',
      'End-to-end project ownership from ideation to deployment',
      'Emphasis on clean code, testing, and maintainability',
    ],
    url: 'https://uncommon.org',
  },
]
