import { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiPlus, FiEdit2, FiTrash2, FiX, FiCheck,
  FiAlertTriangle, FiAlertCircle, FiSearch, FiArrowUp, FiArrowDown,
} from 'react-icons/fi'
import { useAdmin } from '../context/AdminContext'
import type { ExperienceItem } from '../../types'

/* ─── Shared admin styles ─── */
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 1rem;
`

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.03em;
`

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
`

const SearchWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.border};
  padding: 0.45rem 0.75rem;
  min-width: 240px;
  flex: 1;
  max-width: 360px;

  svg { color: ${({ theme }) => theme.colors.textFaint}; flex-shrink: 0; }
`

const SearchInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text};
  width: 100%;
  &::placeholder { color: ${({ theme }) => theme.colors.textFaint}; }
`

const FilterTabs = styled.div`
  display: flex;
  gap: 0.25rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  padding: 2px;
  flex-wrap: wrap;
`

const FilterTab = styled.button<{ $active: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.35rem 0.65rem;
  border: none;
  background: ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active }) => $active ? '#000' : 'inherit'};
  cursor: pointer;
  transition: all 0.1s;
`

const Banner = styled(motion.div)<{ $type: 'success' | 'error' }>`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  margin-bottom: 1.25rem;
  border: 2px solid ${({ $type, theme }) => $type === 'success' ? theme.colors.accent3 : theme.colors.error};
  background: ${({ $type }) => $type === 'success' ? '#00C85315' : '#FF3C2F15'};
  color: ${({ $type, theme }) => $type === 'success' ? '#00C853' : theme.colors.error};
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: 700;
  line-height: 1.4;
`

const AddBtn = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #000;
  background: ${({ theme }) => theme.colors.primary};
  padding: 0.6rem 1.25rem;
  border: 3px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`

const Table = styled.div`
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.md};
`

const TableHead = styled.div`
  display: grid;
  grid-template-columns: 1fr 100px 100px 150px;
  background: ${({ theme }) => theme.colors.primary};
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};
  padding: 0.6rem 1rem;
  gap: 1rem;
  @media (max-width: 680px) {
    grid-template-columns: 1fr 80px 130px;
  }
`

const TH = styled.span`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #000;
`

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 100px 100px 150px;
  padding: 0.875rem 1rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.borderSubtle};
  align-items: center;
  gap: 1rem;
  background: ${({ theme }) => theme.colors.surface};
  transition: background 0.15s;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }
  @media (max-width: 680px) {
    grid-template-columns: 1fr 80px 130px;
  }
`

const Cell = styled.div`
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

const CellSub = styled.div`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.65rem;
  color: ${({ theme }) => theme.colors.textFaint};
  margin-top: 0.2rem;
`

const TypeBadge = styled.span<{ $type: string }>`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.2rem 0.5rem;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ $type }) =>
    $type === 'education' ? '#FFE500' : $type === 'work' ? '#0047FF' : $type === 'project' ? '#FF3C2F' : '#00C853'};
  color: ${({ $type }) => ($type === 'education' || $type === 'milestone' ? '#000' : '#fff')};
  width: fit-content;
`

const Actions = styled.div`
  display: flex;
  gap: 0.35rem;
  align-items: center;
`

const IconBtn = styled(motion.button)<{ $danger?: boolean }>`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $danger, theme }) => ($danger ? theme.colors.error : theme.colors.surfaceAlt)};
  border: 2px solid ${({ theme }) => theme.colors.border};
  color: ${({ $danger }) => ($danger ? '#fff' : 'inherit')};
  cursor: pointer;
  font-size: 0.8rem;
  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    background: ${({ $danger, theme }) => ($danger ? '#cc2020' : theme.colors.primary)};
    color: #000;
  }
`

/* Modal */
const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`

const Modal = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  width: 100%;
  max-width: 580px;
  max-height: 90svh;
  overflow-y: auto;
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.primary};
`

const ModalTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: 700;
  color: #000;
`

const ModalBody = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`

const Label = styled.label`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.textMuted};
`

const Input = styled.input`
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ theme }) => theme.colors.border};
  padding: 0.6rem 0.875rem;
  outline: none;
  width: 100%;
  &:focus {
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`

const Textarea = styled.textarea`
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ theme }) => theme.colors.border};
  padding: 0.6rem 0.875rem;
  outline: none;
  width: 100%;
  min-height: 80px;
  resize: vertical;
  line-height: 1.5;
  &:focus {
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`

const Select = styled.select`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ theme }) => theme.colors.border};
  padding: 0.6rem 0.875rem;
  outline: none;
  width: 100%;
  cursor: pointer;
`

const Row2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`

const SaveBtn = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #000;
  background: ${({ theme }) => theme.colors.primary};
  padding: 0.7rem 1.5rem;
  border: 3px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  align-self: flex-end;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`

const DeleteModalBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

const DeleteWarning = styled.p`
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
`

const DeleteActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
`

const CancelBtn = styled.button`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.6rem 1rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
`

const ConfirmDeleteBtn = styled.button`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.6rem 1.25rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.error};
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;

  &:hover {
    background: #cc2020;
  }
`

const EmptyRow = styled.div`
  padding: 2.5rem;
  text-align: center;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.textFaint};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: ${({ theme }) => theme.colors.surface};
`

const blank = (): Omit<ExperienceItem, 'id'> => ({
  type: 'education',
  title: '',
  organization: '',
  location: '',
  startDate: '',
  endDate: '',
  description: '',
  highlights: [],
  technologies: [],
})

export default function AdminJourney() {
  const { journey, addJourneyItem, updateJourneyItem, deleteJourneyItem, reorderJourney } = useAdmin()
  const [editing, setEditing] = useState<ExperienceItem | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [deletingItem, setDeletingItem] = useState<ExperienceItem | null>(null)
  const [form, setForm] = useState<Omit<ExperienceItem, 'id'>>(blank())
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | ExperienceItem['type']>('all')

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text })
    setTimeout(() => setStatusMsg(null), 4000)
  }

  const openNew = () => {
    setForm(blank())
    setIsNew(true)
    setEditing(null)
    setError('')
  }
  const openEdit = (i: ExperienceItem) => {
    setForm({
      type: i.type,
      title: i.title || '',
      organization: i.organization || '',
      location: i.location || '',
      startDate: i.startDate || '',
      endDate: i.endDate || '',
      description: i.description || '',
      highlights: i.highlights || [],
      technologies: i.technologies || [],
      url: i.url || '',
    })
    setEditing(i)
    setIsNew(false)
    setError('')
  }
  const close = () => {
    setEditing(null)
    setIsNew(false)
    setError('')
  }

  const parse = (v: string | string[]) =>
    typeof v === 'string' ? v.split('\n').map(s => s.trim()).filter(Boolean) : (Array.isArray(v) ? v : [])

  const handleSave = async () => {
    if (!form.title.trim() || !form.startDate.trim()) {
      setError('Title and Start Date are required.')
      return
    }
    setSaving(true)
    setError('')

    const payload: Omit<ExperienceItem, 'id'> = {
      type: form.type,
      title: form.title.trim(),
      organization: form.organization.trim(),
      location: form.location?.trim() || '',
      startDate: form.startDate.trim(),
      endDate: form.endDate?.trim() || '',
      description: form.description.trim(),
      highlights: parse(form.highlights ?? []),
      technologies: parse(form.technologies ?? []),
      url: form.url?.trim() || '',
    }

    try {
      if (isNew) {
        await addJourneyItem(payload)
        showStatus('success', `✓ Successfully added "${payload.title}".`)
      } else if (editing) {
        await updateJourneyItem({ ...payload, id: editing.id, order: editing.order })
        showStatus('success', `✓ Successfully updated "${payload.title}".`)
      }
      close()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes('permission') || msg.includes('PERMISSION_DENIED')) {
        setError('Permission denied — verify Firestore security rules or sign-in status in Firebase.')
      } else {
        setError(`Save failed: ${msg}`)
      }
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!deletingItem) return
    setDeleting(true)
    try {
      await deleteJourneyItem(deletingItem.id)
      showStatus('success', `✓ Journey entry "${deletingItem.title}" deleted.`)
      setDeletingItem(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      showStatus('error', `Failed to delete entry: ${msg}`)
    } finally {
      setDeleting(false)
    }
  }

  const moveItem = async (id: string, direction: -1 | 1) => {
    const idx = journey.findIndex(item => item.id === id)
    if (idx === -1) return
    const targetIdx = idx + direction
    if (targetIdx < 0 || targetIdx >= journey.length) return
    const nextIds = journey.map(item => item.id)
    const [moved] = nextIds.splice(idx, 1)
    nextIds.splice(targetIdx, 0, moved)
    try {
      await reorderJourney(nextIds)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      showStatus('error', `Failed to reorder: ${msg}`)
    }
  }

  const filtered = journey.filter(item => {
    if (typeFilter !== 'all' && item.type !== typeFilter) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      item.title.toLowerCase().includes(q) ||
      item.organization.toLowerCase().includes(q) ||
      (item.description || '').toLowerCase().includes(q)
    )
  })

  const set = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div>
      <Header>
        <PageTitle>Journey ({journey.length})</PageTitle>
        <AddBtn onClick={openNew} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <FiPlus /> Add Entry
        </AddBtn>
      </Header>

      <Toolbar>
        <SearchWrap>
          <FiSearch size={14} />
          <SearchInput
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search role, organisation, description..."
          />
        </SearchWrap>

        <FilterTabs>
          {(['all', 'work', 'education', 'project', 'milestone'] as const).map(t => (
            <FilterTab key={t} $active={typeFilter === t} onClick={() => setTypeFilter(t)}>
              {t}
            </FilterTab>
          ))}
        </FilterTabs>
      </Toolbar>

      {statusMsg && (
        <Banner
          $type={statusMsg.type}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}>
          {statusMsg.type === 'success' ? <FiCheck size={16} /> : <FiAlertCircle size={16} />}
          <span>{statusMsg.text}</span>
        </Banner>
      )}

      <Table>
        <TableHead>
          <TH>Entry</TH>
          <TH>Type</TH>
          <TH>Dates</TH>
          <TH>Order & Actions</TH>
        </TableHead>
        {filtered.length === 0 ? (
          <EmptyRow>No matching journey entries found</EmptyRow>
        ) : (
          <AnimatePresence>
            {filtered.map((item, i) => {
              const fullIdx = journey.findIndex(j => j.id === item.id)
              return (
                <Row
                  key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ delay: i * 0.04 }}>
                  <div>
                    <Cell>{item.title}</Cell>
                    <CellSub>
                      {item.organization}
                      {item.location ? ` · ${item.location}` : ''}
                    </CellSub>
                  </div>
                  <TypeBadge $type={item.type}>{item.type}</TypeBadge>
                  <Cell style={{ fontFamily: 'Space Mono', fontSize: '0.7rem' }}>
                    {item.startDate}
                    {item.endDate ? `–${item.endDate}` : '–Now'}
                  </Cell>
                  <Actions>
                    <IconBtn
                      onClick={() => moveItem(item.id, -1)}
                      disabled={fullIdx <= 0}
                      title="Move up"
                      aria-label="Move entry up"
                      whileTap={{ scale: 0.9 }}>
                      <FiArrowUp />
                    </IconBtn>
                    <IconBtn
                      onClick={() => moveItem(item.id, 1)}
                      disabled={fullIdx === -1 || fullIdx >= journey.length - 1}
                      title="Move down"
                      aria-label="Move entry down"
                      whileTap={{ scale: 0.9 }}>
                      <FiArrowDown />
                    </IconBtn>
                    <IconBtn
                      onClick={() => openEdit(item)}
                      title="Edit entry"
                      aria-label="Edit entry"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}>
                      <FiEdit2 />
                    </IconBtn>
                    <IconBtn
                      $danger
                      onClick={() => setDeletingItem(item)}
                      title="Delete entry"
                      aria-label="Delete entry"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}>
                      <FiTrash2 />
                    </IconBtn>
                  </Actions>
                </Row>
              )
            })}
          </AnimatePresence>
        )}
      </Table>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingItem && (
          <Backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={e => {
              if (e.target === e.currentTarget && !deleting) setDeletingItem(null)
            }}>
            <Modal
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}>
              <ModalHeader style={{ background: '#FF3C2F' }}>
                <ModalTitle style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiAlertTriangle /> Delete Journey Entry
                </ModalTitle>
                <IconBtn onClick={() => !deleting && setDeletingItem(null)} whileTap={{ scale: 0.9 }}>
                  <FiX />
                </IconBtn>
              </ModalHeader>
              <DeleteModalBody>
                <DeleteWarning>
                  Are you sure you want to permanently delete <strong>"{deletingItem.title}"</strong> ({deletingItem.organization})?
                </DeleteWarning>
                <DeleteActions>
                  <CancelBtn onClick={() => setDeletingItem(null)} disabled={deleting}>
                    Cancel
                  </CancelBtn>
                  <ConfirmDeleteBtn onClick={confirmDelete} disabled={deleting}>
                    <FiTrash2 /> {deleting ? 'Deleting…' : 'Yes, Delete'}
                  </ConfirmDeleteBtn>
                </DeleteActions>
              </DeleteModalBody>
            </Modal>
          </Backdrop>
        )}
      </AnimatePresence>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {(isNew || editing) && (
          <Backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={e => {
              if (e.target === e.currentTarget && !saving) close()
            }}>
            <Modal
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.3 }}>
              <ModalHeader>
                <ModalTitle>{isNew ? 'Add Entry' : 'Edit Entry'}</ModalTitle>
                <IconBtn onClick={close} whileTap={{ scale: 0.9 }} disabled={saving}>
                  <FiX />
                </IconBtn>
              </ModalHeader>
              <ModalBody>
                <Row2>
                  <Field>
                    <Label>Type</Label>
                    <Select value={form.type} onChange={e => set('type', e.target.value)}>
                      {['education', 'work', 'project', 'milestone'].map(t => (
                        <option key={t}>{t}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field>
                    <Label>Start Date *</Label>
                    <Input
                      value={form.startDate}
                      onChange={e => set('startDate', e.target.value)}
                      placeholder="2024"
                      required
                    />
                  </Field>
                </Row2>
                <Row2>
                  <Field>
                    <Label>Title *</Label>
                    <Input
                      value={form.title}
                      onChange={e => set('title', e.target.value)}
                      placeholder="Role or programme title"
                      required
                    />
                  </Field>
                  <Field>
                    <Label>End Date (leave blank = Present)</Label>
                    <Input
                      value={form.endDate ?? ''}
                      onChange={e => set('endDate', e.target.value)}
                      placeholder="2025"
                    />
                  </Field>
                </Row2>
                <Row2>
                  <Field>
                    <Label>Organisation</Label>
                    <Input
                      value={form.organization}
                      onChange={e => set('organization', e.target.value)}
                      placeholder="Company or institution"
                    />
                  </Field>
                  <Field>
                    <Label>Location</Label>
                    <Input
                      value={form.location ?? ''}
                      onChange={e => set('location', e.target.value)}
                      placeholder="Zimbabwe"
                    />
                  </Field>
                </Row2>
                <Field>
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={e => set('description', e.target.value)} />
                </Field>
                <Field>
                  <Label>Highlights (one per line)</Label>
                  <Textarea
                    value={Array.isArray(form.highlights) ? form.highlights.join('\n') : form.highlights ?? ''}
                    onChange={e => set('highlights', e.target.value)}
                    placeholder="Built X&#10;Achieved Y"
                  />
                </Field>
                <Field>
                  <Label>Technologies (one per line)</Label>
                  <Textarea
                    style={{ minHeight: 60 }}
                    value={Array.isArray(form.technologies) ? form.technologies.join('\n') : form.technologies ?? ''}
                    onChange={e => set('technologies', e.target.value)}
                    placeholder="React&#10;TypeScript"
                  />
                </Field>
                <Field>
                  <Label>URL (optional)</Label>
                  <Input
                    value={form.url ?? ''}
                    onChange={e => set('url', e.target.value)}
                    placeholder="https://..."
                  />
                </Field>
                {error && (
                  <div
                    style={{
                      background: '#ff000015',
                      border: '2px solid #FF3C2F',
                      color: '#FF3C2F',
                      padding: '0.6rem 0.875rem',
                      fontFamily: 'Space Mono',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      lineHeight: 1.5,
                    }}>
                    ⚠ {error}
                  </div>
                )}
                <SaveBtn
                  onClick={handleSave}
                  disabled={saving}
                  whileHover={{ scale: saving ? 1 : 1.02 }}
                  whileTap={{ scale: 0.97 }}>
                  <FiCheck /> {saving ? 'Saving to Firebase…' : isNew ? 'Add Entry' : 'Save Changes'}
                </SaveBtn>
              </ModalBody>
            </Modal>
          </Backdrop>
        )}
      </AnimatePresence>
    </div>
  )
}
