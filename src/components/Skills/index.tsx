import { useRef, useState } from 'react'
import styled from 'styled-components'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Container, Section, SectionHeader, SectionEyebrow, SectionTitle, SectionSubtitle, popSpring } from '../UI'
import { fadeUp } from '../../styles/animations'
import { skillGroups } from '../../data/skills'
import type { SkillCategory } from '../../types'

/* ─── Styled ─── */
const FilterRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0;
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing['8']};
  border: 3px solid ${({ theme }) => theme.colors.border};
  width: fit-content;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`

const FilterBtn = styled(motion.button)<{ $active: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.5rem 1rem;
  border: none;
  border-right: 3px solid ${({ theme }) => theme.colors.border};
  background: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.background};
  color: ${({ $active, theme }) => $active ? (theme.accentText ?? theme.colors.text) : theme.colors.text};
  cursor: pointer;
  transition: background 0.12s ease, color 0.12s ease, box-shadow 0.12s ease;

  &:last-child { border-right: none; }
  &:hover:not([data-active="true"]) {
    background: ${({ theme }) => theme.colors.text};
    color: ${({ theme }) => theme.colors.background};
  }
`

const GroupsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0;
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`

const GroupCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border-right: 3px solid ${({ theme }) => theme.colors.border};
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing['6']};
  transition: background 0.15s ease;

  &:hover { background: ${({ theme }) => theme.colors.surfaceAlt}; }
`

const GroupLabel = styled.div`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.accentText ?? theme.colors.text};
  background: ${({ theme }) => theme.colors.primary};
  padding: 0.2rem 0.5rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  display: inline-block;
  margin-bottom: ${({ theme }) => theme.spacing['4']};
`

const SkillsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing['2']};
`

const SkillPill = styled(motion.span)`
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 0;
  padding: 0.35rem 0.75rem;
  cursor: default;
  /* shadow + colour transitions via CSS; scale/y via Framer */
  transition: background 0.1s ease, color 0.1s ease, box-shadow 0.1s ease;
  box-shadow: 2px 2px 0 ${({ theme }) => theme.colors.border};

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text};
    box-shadow: 4px 4px 0 ${({ theme }) => theme.colors.border};
  }
`

const ALL = 'All' as const
type Filter = typeof ALL | SkillCategory

export default function Skills() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [active, setActive] = useState<Filter>(ALL)

  const categories: Filter[] = [ALL, ...skillGroups.map(g => g.category)]
  const filtered = active === ALL ? skillGroups : skillGroups.filter(g => g.category === active)

  return (
    <Section id="skills">
      <Container>
        <motion.div ref={ref}
          variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <SectionHeader>
            <SectionEyebrow>Skills</SectionEyebrow>
            <SectionTitle>Technologies I work with.</SectionTitle>
            <SectionSubtitle>
              A focused stack built through real project work.
            </SectionSubtitle>
          </SectionHeader>
        </motion.div>

        {/* Filter tabs */}
        <FilterRow initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ delay: 0.15 }}>
          {categories.map(cat => (
            <FilterBtn key={cat} $active={active === cat}
              data-active={active === cat ? 'true' : 'false'}
              onClick={() => setActive(cat)}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.94 }}
              transition={popSpring}>
              {cat}
            </FilterBtn>
          ))}
        </FilterRow>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <GroupsGrid key={active}>
            {filtered.map((group, gi) => (
              <GroupCard key={group.category}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: gi * 0.05 }}>
                <GroupLabel>{group.category}</GroupLabel>
                <SkillsWrap>
                  {group.skills.map((skill, si) => (
                    <SkillPill key={skill.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: si * 0.04 }}
                      whileHover={{ scale: 1.12, y: -5 }}
                      whileTap={{ scale: 0.93 }}>
                      {skill.name}
                    </SkillPill>
                  ))}
                </SkillsWrap>
              </GroupCard>
            ))}
          </GroupsGrid>
        </AnimatePresence>
      </Container>
    </Section>
  )
}
