import { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiGithub, FiExternalLink } from 'react-icons/fi'
import { useAdmin } from '../context/AdminContext'
import type { Project } from '../../types'

/* ─── Styled ─── */
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
  grid-template-columns: 1fr 120px 80px 100px;
  background: ${({ theme }) => theme.colors.primary};
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};
  padding: 0.6rem 1rem;
  gap: 1rem;
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
  grid-template-columns: 1fr 120px 80px 100px;
  padding: 0.875rem 1rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.borderSubtle};
  align-items: center;
  gap: 1rem;
  background: ${({ theme }) => theme.colors.surface};
  transition: background 0.15s ease;

  &:last-child { border-bottom: none; }
  &:hover { background: ${({ theme }) => theme.colors.surfaceAlt}; }
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

/* ─── Blank form ─── */
const blank = (): Omit<Project, 'id'> => ({
  title: '', description: '', longDescription: '', image: '',
  technologies: [], github: '', liveUrl: '', featured: false,
  status: 'live', category: 'Full-Stack',
})

/* ─── Component ─── */
export default function AdminProjects() {
  const { projects, addProject, updateProject, deleteProject } = useAdmin()
  const [editing, setEditing] = useState<Project | null>(null)
  const [isNew,   setIsNew]   = useState(false)
  const [form,    setForm]    = useState<Omit<Project,'id'>>(blank())
  const [saving,  setSaving]  = useState(false)

  const openNew = () => { setForm(blank()); setIsNew(true); setEditing(null) }
  const openEdit = (p: Project) => {
    setForm({ ...p })
    setEditing(p)
    setIsNew(false)
  }
  const close = () => { setEditing(null); setIsNew(false) }

  const handleSave = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    const technologies = typeof form.technologies === 'string'
      ? (form.technologies as unknown as string).split(',').map((s: string) => s.trim()).filter(Boolean)
      : form.technologies
    try {
      if (isNew) {
        await addProject({ ...form, technologies })
      } else if (editing) {
        await updateProject({ ...editing, ...form, technologies })
      }
      close()
    } finally {
      setSaving(false)
    }
  }

  const set = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div>
      <Header>
        <PageTitle>Projects</PageTitle>
        <AddBtn onClick={openNew} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <FiPlus /> Add Project
        </AddBtn>
      </Header>

      <Table>
        <TableHead>
          <TH>Project</TH>
          <TH>Category</TH>
          <TH>Status</TH>
          <TH>Actions</TH>
        </TableHead>

        <AnimatePresence>
          {projects.map((p, i) => (
            <TableRow key={p.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ delay: i * 0.04 }}>

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
                <IconBtn $danger onClick={() => deleteProject(p.id)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <FiTrash2 />
                </IconBtn>
              </Actions>
            </TableRow>
          ))}
        </AnimatePresence>
      </Table>

      {/* Modal */}
      <AnimatePresence>
        {(isNew || editing) && (
          <Backdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => { if (e.target === e.currentTarget) close() }}>
            <Modal initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.3 }}>

              <ModalHeader>
                <ModalTitle>{isNew ? 'Add Project' : 'Edit Project'}</ModalTitle>
                <IconBtn onClick={close} whileTap={{ scale: 0.9 }}><FiX /></IconBtn>
              </ModalHeader>

              <ModalBody>
                <Field><FieldLabel>Title *</FieldLabel>
                  <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Project title" /></Field>

                <Field><FieldLabel>Short Description *</FieldLabel>
                  <Textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="One-line description" style={{ minHeight: 60 }} /></Field>

                <Field><FieldLabel>Long Description</FieldLabel>
                  <Textarea value={form.longDescription ?? ''} onChange={e => set('longDescription', e.target.value)} placeholder="Full description shown on the card" /></Field>

                <Field><FieldLabel>Technologies (comma-separated)</FieldLabel>
                  <Input value={Array.isArray(form.technologies) ? form.technologies.join(', ') : form.technologies}
                    onChange={e => set('technologies', e.target.value)} placeholder="React, TypeScript, Node.js" /></Field>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <Field><FieldLabel>Category</FieldLabel>
                    <Select value={form.category} onChange={e => set('category', e.target.value)}>
                      {['Full-Stack','Frontend','Backend','Other'].map(c => <option key={c}>{c}</option>)}
                    </Select></Field>

                  <Field><FieldLabel>Status</FieldLabel>
                    <Select value={form.status} onChange={e => set('status', e.target.value as Project['status'])}>
                      {['live','wip','archived'].map(s => <option key={s}>{s}</option>)}
                    </Select></Field>
                </div>

                <Field><FieldLabel>GitHub URL</FieldLabel>
                  <Input value={form.github ?? ''} onChange={e => set('github', e.target.value)} placeholder="https://github.com/..." /></Field>

                <Field><FieldLabel>Live URL</FieldLabel>
                  <Input value={form.liveUrl ?? ''} onChange={e => set('liveUrl', e.target.value)} placeholder="https://..." /></Field>

                <Field style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
                  <input type="checkbox" id="featured" checked={!!form.featured}
                    onChange={e => set('featured', e.target.checked)}
                    style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#FFE500' }} />
                  <FieldLabel htmlFor="featured" style={{ margin: 0, cursor: 'pointer' }}>Featured project</FieldLabel>
                </Field>

                <SaveBtn onClick={handleSave} disabled={saving} whileHover={{ scale: saving ? 1 : 1.02 }} whileTap={{ scale: 0.97 }}>
                  <FiCheck /> {saving ? 'Saving…' : isNew ? 'Add Project' : 'Save Changes'}
                </SaveBtn>
              </ModalBody>
            </Modal>
          </Backdrop>
        )}
      </AnimatePresence>
    </div>
  )
}
