import { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiTrash2, FiSave, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { useAdmin } from '../context/AdminContext'
import type { SkillGroup, Skill, SkillCategory } from '../../types'

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.03em;
  margin-bottom: 0.5rem;
`

const PageSub = styled.p`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.textFaint};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1.75rem;
`

const SaveBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
`

const SaveBtn = styled(motion.button)`
  display: flex; align-items: center; gap: 0.5rem;
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
  color: #000; background: ${({ theme }) => theme.colors.primary};
  padding: 0.65rem 1.5rem;
  border: 3px solid ${({ theme }) => theme.colors.border};
  cursor: pointer; box-shadow: ${({ theme }) => theme.shadows.sm};
  &:hover { box-shadow: ${({ theme }) => theme.shadows.md}; transform: translate(-2px,-2px); }
`

const GroupCard = styled.div`
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: 1rem;
  background: ${({ theme }) => theme.colors.surface};
`

const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  gap: 1rem;
`

const HeaderActions = styled.div`
  display: flex; align-items: center; gap: 0.5rem;
`

const SmallBtn = styled(motion.button)<{ $danger?: boolean }>`
  display: flex; align-items: center; gap: 0.3rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.6rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.08em;
  color: ${({ $danger }) => $danger ? '#fff' : '#000'};
  background: ${({ $danger, theme }) => $danger ? theme.colors.error : theme.colors.primary};
  padding: 0.3rem 0.625rem;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  &:hover { opacity: 0.85; }
`

const SkillsBody = styled(motion.div)`
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
`

const SkillChip = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ theme }) => theme.colors.border};
  padding: 0.25rem 0.625rem;
`

const RemoveChipBtn = styled.button`
  background: none; border: none; cursor: pointer;
  color: ${({ theme }) => theme.colors.textFaint};
  display: flex; align-items: center;
  font-size: 0.75rem; line-height: 1;
  padding: 0;
  &:hover { color: ${({ theme }) => theme.colors.error}; }
`

const AddSkillInput = styled.input`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  border: 2px dashed ${({ theme }) => theme.colors.border};
  padding: 0.25rem 0.625rem;
  outline: none; width: 120px;
  &:focus { border-style: solid; }
`

const AddGroupBtn = styled(motion.button)`
  display: flex; align-items: center; gap: 0.5rem; width: 100%;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.textFaint};
  background: ${({ theme }) => theme.colors.surface};
  border: 3px dashed ${({ theme }) => theme.colors.borderSubtle};
  padding: 0.875rem 1rem; cursor: pointer;
  transition: all 0.15s ease;
  &:hover { border-color: ${({ theme }) => theme.colors.border}; color: ${({ theme }) => theme.colors.text}; }
`

const CATEGORIES: SkillCategory[] = ['Frontend','Backend','Database','Tools','Design','Other']

export default function AdminSkills() {
  const { skillGroups, updateSkillGroups } = useAdmin()
  const [groups,   setGroups]   = useState<SkillGroup[]>([...skillGroups])
  const [open,     setOpen]     = useState<Set<string>>(new Set([groups[0]?.category]))
  const [newSkill, setNewSkill] = useState<Record<string, string>>({})
  const [saved,    setSaved]    = useState(false)

  const toggleOpen = (cat: string) => setOpen(prev => {
    const s = new Set(prev)
    if (s.has(cat)) { s.delete(cat) } else { s.add(cat) }
    return s
  })

  const removeSkill = (cat: string, name: string) =>
    setGroups(g => g.map(gr => gr.category === cat
      ? { ...gr, skills: gr.skills.filter(s => s.name !== name) }
      : gr))

  const addSkill = (cat: SkillCategory) => {
    const name = (newSkill[cat] ?? '').trim()
    if (!name) return
    setGroups(g => g.map(gr => gr.category === cat
      ? { ...gr, skills: [...gr.skills, { name, category: cat }] }
      : gr))
    setNewSkill(n => ({ ...n, [cat]: '' }))
  }

  const removeGroup = (cat: string) => setGroups(g => g.filter(gr => gr.category !== cat))

  const addGroup = () => {
    const available = CATEGORIES.filter(c => !groups.some(g => g.category === c))
    if (!available.length) return
    const cat = available[0]
    setGroups(g => [...g, { category: cat, skills: [] }])
    setOpen(prev => new Set([...prev, cat]))
  }

  const renameGroup = (oldCat: string, newCat: SkillCategory) => {
    if (groups.some(g => g.category === newCat && g.category !== oldCat)) return
    setGroups(g => g.map(gr => gr.category === oldCat ? { ...gr, category: newCat } : gr))
  }

  const handleSave = () => {
    updateSkillGroups(groups)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <PageTitle>Skills</PageTitle>
      <PageSub>Add, remove, or rename skill groups and individual skills.</PageSub>

      <SaveBar>
        <SaveBtn onClick={handleSave} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <FiSave /> {saved ? 'Saved!' : 'Save Changes'}
        </SaveBtn>
      </SaveBar>

      {groups.map(group => (
        <GroupCard key={group.category}>
          <GroupHeader onClick={() => toggleOpen(group.category)}>
            <select
              value={group.category}
              onClick={e => e.stopPropagation()}
              onChange={e => renameGroup(group.category, e.target.value as SkillCategory)}
              style={{
                fontFamily: 'Space Mono', fontSize: '0.75rem', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                background: 'transparent', border: 'none', outline: 'none',
                cursor: 'pointer', color: 'inherit', flex: 1,
              }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <HeaderActions>
              <SmallBtn $danger onClick={e => { e.stopPropagation(); removeGroup(group.category) }}
                whileTap={{ scale: 0.9 }}>
                <FiTrash2 size={10} />
              </SmallBtn>
              {open.has(group.category) ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
            </HeaderActions>
          </GroupHeader>

          <AnimatePresence>
            {open.has(group.category) && (
              <SkillsBody
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}>
                {group.skills.map((s: Skill) => (
                  <SkillChip key={s.name}>
                    {s.name}
                    <RemoveChipBtn onClick={() => removeSkill(group.category, s.name)} aria-label={`Remove ${s.name}`}>
                      <FiTrash2 size={10} />
                    </RemoveChipBtn>
                  </SkillChip>
                ))}
                <AddSkillInput
                  placeholder="+ Add skill"
                  value={newSkill[group.category] ?? ''}
                  onChange={e => setNewSkill(n => ({ ...n, [group.category]: e.target.value }))}
                  onKeyDown={e => { if (e.key === 'Enter') addSkill(group.category as SkillCategory) }}
                  onClick={e => e.stopPropagation()}
                />
                <SmallBtn onClick={e => { e.stopPropagation(); addSkill(group.category as SkillCategory) }}
                  whileTap={{ scale: 0.95 }}>
                  <FiPlus size={10} /> Add
                </SmallBtn>
              </SkillsBody>
            )}
          </AnimatePresence>
        </GroupCard>
      ))}

      <AddGroupBtn onClick={addGroup} whileHover={{ scale: 1.01 }}>
        <FiPlus /> Add Skill Group
      </AddGroupBtn>
    </div>
  )
}
