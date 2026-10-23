import { useState, useMemo } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiPlus, FiTrash2, FiSave, FiChevronDown, FiChevronUp,
  FiArrowUp, FiArrowDown,
} from 'react-icons/fi'
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
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`

const UnsavedTag = styled.span`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: #FF3C2F;
  color: #fff;
  padding: 0.35rem 0.65rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
`

const SaveBtn = styled(motion.button)<{ $saved?: boolean }>`
  display: flex; align-items: center; gap: 0.5rem;
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
  color: #000;
  background: ${({ $saved, theme }) => $saved ? theme.colors.accent3 : theme.colors.primary};
  padding: 0.65rem 1.5rem;
  border: 3px solid ${({ theme }) => theme.colors.border};
  cursor: pointer; box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-left: auto;
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
  display: flex; align-items: center; gap: 0.4rem;
`

const SmallBtn = styled(motion.button)<{ $danger?: boolean; $neutral?: boolean }>`
  display: flex; align-items: center; gap: 0.3rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.6rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.08em;
  color: ${({ $danger, $neutral }) => $danger ? '#fff' : $neutral ? 'inherit' : '#000'};
  background: ${({ $danger, $neutral, theme }) =>
    $danger ? theme.colors.error : $neutral ? theme.colors.surface : theme.colors.primary};
  padding: 0.3rem 0.55rem;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  &:disabled { opacity: 0.35; cursor: not-allowed; }
  &:hover:not(:disabled) { opacity: 0.85; }
`

const CountBadge = styled.span`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.6rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textFaint};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-right: 0.25rem;
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
  outline: none; width: 135px;
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
  const [draftGroups, setDraftGroups] = useState<SkillGroup[] | null>(null)
  const [closedSet,   setClosedSet]   = useState<Set<string>>(() => new Set())
  const [newSkill,    setNewSkill]    = useState<Record<string, string>>({})
  const [saved,       setSaved]       = useState(false)

  const groups = useMemo(() => draftGroups ?? skillGroups, [draftGroups, skillGroups])

  const hasChanges = useMemo(() => {
    return draftGroups !== null && JSON.stringify(draftGroups) !== JSON.stringify(skillGroups)
  }, [draftGroups, skillGroups])

  const isOpen = (cat: string) => !closedSet.has(cat)

  const toggleOpen = (cat: string) => setClosedSet(prev => {
    const s = new Set(prev)
    if (s.has(cat)) { s.delete(cat) } else { s.add(cat) }
    return s
  })

  const removeSkill = (cat: string, name: string) =>
    setDraftGroups(prev => (prev ?? skillGroups).map(gr => gr.category === cat
      ? { ...gr, skills: gr.skills.filter(s => s.name !== name) }
      : gr))

  const addSkill = (cat: SkillCategory) => {
    const name = (newSkill[cat] ?? '').trim()
    if (!name) return
    setDraftGroups(prev => (prev ?? skillGroups).map(gr => gr.category === cat
      ? { ...gr, skills: [...gr.skills, { name, category: cat }] }
      : gr))
    setNewSkill(n => ({ ...n, [cat]: '' }))
  }

  const removeGroup = (cat: string) =>
    setDraftGroups(prev => (prev ?? skillGroups).filter(gr => gr.category !== cat))

  const moveGroup = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= groups.length) return
    setDraftGroups(prev => {
      const next = [...(prev ?? skillGroups)]
      const [moved] = next.splice(index, 1)
      next.splice(target, 0, moved)
      return next.map((gr, idx) => ({ ...gr, order: idx }))
    })
  }

  const addGroup = () => {
    const available = CATEGORIES.filter(c => !groups.some(g => g.category === c))
    if (!available.length) return
    const cat = available[0]
    setDraftGroups(prev => {
      const current = prev ?? skillGroups
      return [...current, { category: cat, skills: [], order: current.length }]
    })
    setClosedSet(prev => {
      const s = new Set(prev)
      s.delete(cat)
      return s
    })
  }

  const renameGroup = (oldCat: string, newCat: SkillCategory) => {
    if (groups.some(g => g.category === newCat && g.category !== oldCat)) return
    setDraftGroups(prev => (prev ?? skillGroups).map(gr => gr.category === oldCat ? { ...gr, category: newCat } : gr))
  }

  const handleSave = async () => {
    await updateSkillGroups(groups.map((gr, idx) => ({ ...gr, order: idx })))
    setDraftGroups(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <PageTitle>Skills</PageTitle>
      <PageSub>Add, remove, reorder, or rename skill groups and individual skills.</PageSub>

      <SaveBar>
        {hasChanges && <UnsavedTag>Unsaved Changes</UnsavedTag>}
        <SaveBtn $saved={saved} onClick={handleSave} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <FiSave /> {saved ? 'Saved to Firebase!' : 'Save Changes'}
        </SaveBtn>
      </SaveBar>

      {groups.map((group, idx) => (
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
              <CountBadge>{group.skills.length} skills</CountBadge>
              <SmallBtn
                $neutral
                disabled={idx === 0}
                title="Move group up"
                aria-label="Move skill group up"
                onClick={e => { e.stopPropagation(); moveGroup(idx, -1) }}
                whileTap={{ scale: 0.9 }}>
                <FiArrowUp size={10} />
              </SmallBtn>
              <SmallBtn
                $neutral
                disabled={idx === groups.length - 1}
                title="Move group down"
                aria-label="Move skill group down"
                onClick={e => { e.stopPropagation(); moveGroup(idx, 1) }}
                whileTap={{ scale: 0.9 }}>
                <FiArrowDown size={10} />
              </SmallBtn>
              <SmallBtn
                $danger
                title="Remove skill group"
                aria-label="Remove skill group"
                onClick={e => { e.stopPropagation(); removeGroup(group.category) }}
                whileTap={{ scale: 0.9 }}>
                <FiTrash2 size={10} />
              </SmallBtn>
              {isOpen(group.category) ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
            </HeaderActions>
          </GroupHeader>

          <AnimatePresence>
            {isOpen(group.category) && (
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
