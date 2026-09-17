import { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiGithub, FiExternalLink,
  FiChevronUp, FiChevronDown, FiSearch, FiAlertTriangle, FiAlertCircle,
} from 'react-icons/fi'
import { useAdmin } from '../context/AdminContext'
import type { Project } from '../../types'

/* ─── Styled Components ─── */
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.75rem;
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

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
`

const ToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  flex: 1;
`

const SearchWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.border};
  padding: 0.4rem 0.75rem;
  min-width: 240px;

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

const CategoryTabs = styled.div`
  display: flex;
  gap: 0.25rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  padding: 2px;
  flex-wrap: wrap;
`

const CategoryTab = styled.button<{ $active: boolean }>`
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
  transition: box-shadow 0.1s ease, transform 0.1s ease;

  &:hover { transform: translate(-2px,-2px); box-shadow: ${({ theme }) => theme.shadows.md}; }
`

const Table = styled.div`
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.md};
`

const TableHead = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr 120px 80px 100px;
  background: ${({ theme }) => theme.colors.primary};
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};
  padding: 0.6rem 1rem;
  gap: 1rem;
  align-items: center;

  @media (max-width: 860px) {
    display: none;
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

const TableRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 50px 1fr 120px 80px 100px;
  padding: 0.875rem 1rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.borderSubtle};
  align-items: center;
  gap: 1rem;
  background: ${({ theme }) => theme.colors.surface};
  transition: background 0.15s ease;

  &:last-child { border-bottom: none; }
  &:hover { background: ${({ theme }) => theme.colors.surfaceAlt}; }

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    gap: 0.6rem;
  }
`

const OrderControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const OrderBtn = styled.button`
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  width: 24px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;

  &:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary};
    color: #000;
  }
`

const ProjectName = styled.div`
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

const ProjectMeta = styled.div`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.65rem;
  color: ${({ theme }) => theme.colors.textFaint};
  margin-top: 0.2rem;
`

const StatusBadge = styled.span<{ $status: string }>`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.2rem 0.5rem;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ $status }) =>
    $status === 'live' ? '#FFE500' : $status === 'wip' ? '#FF3C2F' : '#444'};
  color: ${({ $status }) => $status === 'wip' ? '#fff' : '#000'};
  width: fit-content;
`

const CategoryBadge = styled.span`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.2rem 0.5rem;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.textMuted};
  width: fit-content;
`

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`

const IconBtn = styled(motion.button)<{ $danger?: boolean }>`
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  background: ${({ $danger, theme }) => $danger ? theme.colors.error : theme.colors.surfaceAlt};
  border: 2px solid ${({ theme }) => theme.colors.border};
  color: ${({ $danger }) => $danger ? '#fff' : 'inherit'};
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.1s;

  &:hover { background: ${({ $danger, theme }) => $danger ? '#cc2020' : theme.colors.primary}; color: #000; }
`

const LinkBtns = styled.div`
  display: flex;
  gap: 0.35rem;
  font-size: 0.75rem;
`

const MiniLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.75rem;
  text-decoration: none;
  &:hover { text-decoration: underline; }
`

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.textFaint};
  background: ${({ theme }) => theme.colors.surface};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

/* Modal */
const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
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
  max-width: 560px;
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
  letter-spacing: -0.02em;
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

const FieldLabel = styled.label`
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
  &:focus { box-shadow: ${({ theme }) => theme.shadows.sm}; }
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
  &:focus { box-shadow: ${({ theme }) => theme.shadows.sm}; }
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

const SaveBtn = styled(motion.button)`
  display: flex; align-items: center; gap: 0.5rem;
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.06em;
  color: #000; background: ${({ theme }) => theme.colors.primary};
  padding: 0.7rem 1.5rem;
  border: 3px solid ${({ theme }) => theme.colors.border};
  cursor: pointer; align-self: flex-end;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  &:hover { box-shadow: ${({ theme }) => theme.shadows.md}; }
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

/* ─── Blank form ─── */
const blank = (): Omit<Project, 'id'> => ({
  title: '', description: '', longDescription: '', image: '',
  technologies: [], github: '', liveUrl: '', featured: false,
  status: 'live', category: 'Business',
})

/* ─── Component ─── */
export default function AdminProjects() {
  const { projects, addProject, updateProject, deleteProject, reorderProjects } = useAdmin()
  const [editing, setEditing] = useState<Project | null>(null)
  const [isNew,   setIsNew]   = useState(false)
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)
  const [form,    setForm]    = useState<Omit<Project,'id'>>(blank())
  const [saving,  setSaving]  = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error,   setError]   = useState('')
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [search,  setSearch]  = useState('')
  const [catFilter, setCatFilter] = useState<'All' | 'Business' | 'Mobile' | 'Gift' | 'Personal'>('All')

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text })
    setTimeout(() => setStatusMsg(null), 4000)
  }

  const openNew  = () => { setForm(blank()); setIsNew(true); setEditing(null); setError('') }
  const openEdit = (p: Project) => {
    setForm({
      title: p.title || '',
      description: p.description || '',
      longDescription: p.longDescription || '',
      image: p.image || '',
      technologies: p.technologies || [],
      github: p.github || '',
      liveUrl: p.liveUrl || '',
      featured: !!p.featured,
      status: p.status || 'live',
      category: p.category || 'Business',
    })
    setEditing(p)
    setIsNew(false)
    setError('')
  }
  const close = () => { setEditing(null); setIsNew(false); setError('') }

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError('Please provide a project title.')
      return
    }
    if (!form.description.trim()) {
      setError('Please provide a short description.')
      return
    }

    setSaving(true)
    setError('')

    const technologies = typeof form.technologies === 'string'
      ? (form.technologies as unknown as string).split(',').map((s: string) => s.trim()).filter(Boolean)
      : (Array.isArray(form.technologies) ? form.technologies : [])

    const payload: Omit<Project, 'id'> = {
      title: form.title.trim(),
      description: form.description.trim(),
      longDescription: form.longDescription?.trim() || '',
      image: form.image?.trim() || '',
      technologies,
      github: form.github?.trim() || '',
      liveUrl: form.liveUrl?.trim() || '',
      featured: Boolean(form.featured),
      status: form.status,
      category: form.category,
    }

    try {
      if (isNew) {
        await addProject(payload)
        showStatus('success', `✓ Successfully added "${payload.title}" to projects.`)
      } else if (editing) {
        await updateProject({ ...payload, id: editing.id })
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
    if (!deletingProject) return
    setDeleting(true)
    try {
      await deleteProject(deletingProject.id)
      showStatus('success', `✓ Project "${deletingProject.title}" has been deleted.`)
      setDeletingProject(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      showStatus('error', `Failed to delete project: ${msg}`)
    } finally {
      setDeleting(false)
    }
  }

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= projects.length) return
    const reordered = [...projects]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(targetIndex, 0, moved)
    try {
      await reorderProjects(reordered.map(p => p.id))
      showStatus('success', '✓ Projects order updated.')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      showStatus('error', `Failed to reorder: ${msg}`)
    }
  }

  const set = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const filtered = projects.filter(p => {
    if (catFilter !== 'All' && p.category !== catFilter) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.technologies.some(t => t.toLowerCase().includes(q))
    )
  })

  return (
    <div>
      <Header>
        <PageTitle>Projects</PageTitle>
        <AddBtn onClick={openNew} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <FiPlus /> Add Project
        </AddBtn>
      </Header>

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

      <Toolbar>
        <ToolbarLeft>
          <SearchWrap>
            <FiSearch size={14} />
            <SearchInput
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search project title, tech, description..."
            />
          </SearchWrap>

          <CategoryTabs>
            {(['All', 'Business', 'Mobile', 'Gift', 'Personal'] as const).map(cat => (
              <CategoryTab
                key={cat}
                $active={catFilter === cat}
                onClick={() => setCatFilter(cat)}>
                {cat}
              </CategoryTab>
            ))}
          </CategoryTabs>
        </ToolbarLeft>
      </Toolbar>

      <Table>
        <TableHead>
          <TH>Order</TH>
          <TH>Project</TH>
          <TH>Category</TH>
          <TH>Status</TH>
          <TH>Actions</TH>
        </TableHead>

        {filtered.length === 0 ? (
          <EmptyState>No projects found.</EmptyState>
        ) : (
          <AnimatePresence>
            {filtered.map((p, i) => {
              const originalIndex = projects.findIndex(proj => proj.id === p.id)
              return (
                <TableRow key={p.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ delay: i * 0.04 }}>

                  <OrderControls>
                    <OrderBtn
                      disabled={originalIndex === 0}
                      onClick={() => handleMove(originalIndex, 'up')}
                      title="Move Up">
                      <FiChevronUp />
                    </OrderBtn>
                    <OrderBtn
                      disabled={originalIndex === projects.length - 1}
                      onClick={() => handleMove(originalIndex, 'down')}
                      title="Move Down">
                      <FiChevronDown />
                    </OrderBtn>
                  </OrderControls>

                  <div>
                    <ProjectName>{p.title}</ProjectName>
                    <ProjectMeta>{p.technologies.slice(0,3).join(' · ')}</ProjectMeta>
                    <LinkBtns style={{ marginTop: '0.25rem' }}>
                      {p.github  && <MiniLink href={p.github}  target="_blank"><FiGithub  size={11}/> GitHub</MiniLink>}
                      {p.liveUrl && <MiniLink href={p.liveUrl} target="_blank"><FiExternalLink size={11}/> Live</MiniLink>}
                    </LinkBtns>
                  </div>

                  <CategoryBadge>{p.category}</CategoryBadge>
                  <StatusBadge $status={p.status}>{p.status}</StatusBadge>

                  <Actions>
                    <IconBtn onClick={() => openEdit(p)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <FiEdit2 />
                    </IconBtn>
                    <IconBtn $danger onClick={() => setDeletingProject(p)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <FiTrash2 />
                    </IconBtn>
                  </Actions>
                </TableRow>
              )
            })}
          </AnimatePresence>
        )}
      </Table>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingProject && (
          <Backdrop
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => { if (e.target === e.currentTarget && !deleting) setDeletingProject(null) }}>
            <Modal
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}>
              <ModalHeader style={{ background: '#FF3C2F' }}>
                <ModalTitle style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiAlertTriangle /> Delete Project
                </ModalTitle>
                <IconBtn onClick={() => !deleting && setDeletingProject(null)} whileTap={{ scale: 0.9 }}>
                  <FiX />
                </IconBtn>
              </ModalHeader>
              <DeleteModalBody>
                <DeleteWarning>
                  Are you sure you want to permanently delete <strong>"{deletingProject.title}"</strong>?
                  This action will remove it from Firebase Firestore and your live portfolio.
                </DeleteWarning>
                <DeleteActions>
                  <CancelBtn onClick={() => setDeletingProject(null)} disabled={deleting}>
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
          <Backdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => { if (e.target === e.currentTarget && !saving) close() }}>
            <Modal initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.3 }}>

              <ModalHeader>
                <ModalTitle>{isNew ? 'Add Project' : 'Edit Project'}</ModalTitle>
                <IconBtn onClick={close} whileTap={{ scale: 0.9 }} disabled={saving}><FiX /></IconBtn>
              </ModalHeader>

              <ModalBody>
                <Field>
                  <FieldLabel>Title *</FieldLabel>
                  <Input
                    value={form.title}
                    onChange={e => set('title', e.target.value)}
                    placeholder="Project title"
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel>Short Description *</FieldLabel>
                  <Textarea
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    placeholder="One-line summary for project cards"
                    style={{ minHeight: 60 }}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel>Long Description</FieldLabel>
                  <Textarea
                    value={form.longDescription ?? ''}
                    onChange={e => set('longDescription', e.target.value)}
                    placeholder="Full detailed project description"
                  />
                </Field>

                <Field>
                  <FieldLabel>Technologies (comma-separated)</FieldLabel>
                  <Input
                    value={Array.isArray(form.technologies) ? form.technologies.join(', ') : form.technologies}
                    onChange={e => set('technologies', e.target.value)}
                    placeholder="React, TypeScript, Node.js"
                  />
                </Field>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <Field>
                    <FieldLabel>Category</FieldLabel>
                    <Select value={form.category} onChange={e => set('category', e.target.value)}>
                      {['Business','Mobile','Gift','Personal'].map(c => <option key={c}>{c}</option>)}
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel>Status</FieldLabel>
                    <Select value={form.status} onChange={e => set('status', e.target.value as Project['status'])}>
                      {['live','wip','archived'].map(s => <option key={s}>{s}</option>)}
                    </Select>
                  </Field>
                </div>

                <Field>
                  <FieldLabel>GitHub Repository URL</FieldLabel>
                  <Input
                    value={form.github ?? ''}
                    onChange={e => set('github', e.target.value)}
                    placeholder="https://github.com/..."
                  />
                </Field>

                <Field>
                  <FieldLabel>Live Application URL</FieldLabel>
                  <Input
                    value={form.liveUrl ?? ''}
                    onChange={e => set('liveUrl', e.target.value)}
                    placeholder="https://..."
                  />
                </Field>

                <Field>
                  <FieldLabel>Project Image Path / URL</FieldLabel>
                  <Input
                    value={form.image ?? ''}
                    onChange={e => set('image', e.target.value)}
                    placeholder="/images/projects/example.webp or https://..."
                  />
                </Field>

                <Field style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    type="checkbox"
                    id="featured"
                    checked={!!form.featured}
                    onChange={e => set('featured', e.target.checked)}
                    style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#FFE500' }}
                  />
                  <FieldLabel htmlFor="featured" style={{ margin: 0, cursor: 'pointer' }}>
                    Featured on Home Showcase
                  </FieldLabel>
                </Field>

                {error && (
                  <div style={{
                    background: '#ff000015', border: '2px solid #FF3C2F',
                    color: '#FF3C2F', padding: '0.6rem 0.875rem',
                    fontFamily: 'Space Mono', fontSize: '0.75rem', fontWeight: 700,
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
                  <FiCheck /> {saving ? 'Saving to Firebase…' : isNew ? 'Add Project' : 'Save Changes'}
                </SaveBtn>
              </ModalBody>
            </Modal>
          </Backdrop>
        )}
      </AnimatePresence>
    </div>
  )
}

