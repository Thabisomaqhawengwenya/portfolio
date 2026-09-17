import { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiPlus, FiEdit2, FiTrash2, FiX, FiCheck,
  FiAward, FiExternalLink, FiChevronUp, FiChevronDown, FiSearch,
  FiAlertTriangle, FiAlertCircle,
} from 'react-icons/fi'
import { useAdmin } from '../context/AdminContext'
import type { Certificate } from '../../types'

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
  gap: 1rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
`

const SearchWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.border};
  padding: 0.4rem 0.75rem;
  flex: 1;
  max-width: 360px;

  svg {
    color: ${({ theme }) => theme.colors.textFaint};
    flex-shrink: 0;
  }
`

const SearchInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text};
  width: 100%;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textFaint};
  }
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
  grid-template-columns: 50px 140px 1fr 110px 130px;
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
  grid-template-columns: 50px 140px 1fr 110px 130px;
  padding: 0.875rem 1rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.borderSubtle};
  align-items: center;
  gap: 1rem;
  background: ${({ theme }) => theme.colors.surface};
  transition: background 0.15s ease;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }

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

const IssuerBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.2rem 0.5rem;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
  width: fit-content;
`

const CertTitle = styled.div`
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

const SkillsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 0.35rem;
`

const SkillChip = styled.span`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.6rem;
  padding: 0.1rem 0.35rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
`

const MetaText = styled.p`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.65rem;
  color: ${({ theme }) => theme.colors.textFaint};
  margin-top: 0.2rem;
`

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`

const IconBtn = styled(motion.button)<{ $danger?: boolean }>`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $danger, theme }) => ($danger ? theme.colors.error : theme.colors.surfaceAlt)};
  border: 2px solid ${({ theme }) => theme.colors.border};
  color: ${({ $danger }) => ($danger ? '#fff' : 'inherit')};
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.1s;

  &:hover {
    background: ${({ $danger, theme }) => ($danger ? '#cc2020' : theme.colors.primary)};
    color: #000;
  }
`

const VerifyLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.65rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  margin-top: 0.3rem;

  &:hover {
    text-decoration: underline;
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
  &:focus {
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
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

/* ─── Blank form ─── */
const blank = (): Omit<Certificate, 'id'> => ({
  title: '',
  issuer: '',
  issuerLogo: '',
  issueDate: '',
  expiryDate: '',
  credentialId: '',
  credentialUrl: '',
  skills: [],
  featured: false,
})

/* ─── Component ─── */
export default function AdminCertificates() {
  const {
    certificates,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    reorderCertificates,
  } = useAdmin()

  const [editing, setEditing] = useState<Certificate | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [deletingCert, setDeletingCert] = useState<Certificate | null>(null)
  const [form, setForm] = useState<Omit<Certificate, 'id'>>(blank())
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [search, setSearch] = useState('')

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

  const openEdit = (c: Certificate) => {
    setForm({
      title: c.title || '',
      issuer: c.issuer || '',
      issuerLogo: c.issuerLogo || '',
      issueDate: c.issueDate || '',
      expiryDate: c.expiryDate || '',
      credentialId: c.credentialId || '',
      credentialUrl: c.credentialUrl || '',
      skills: c.skills || [],
      featured: !!c.featured,
    })
    setEditing(c)
    setIsNew(false)
    setError('')
  }

  const close = () => {
    setEditing(null)
    setIsNew(false)
    setError('')
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.issuer.trim()) {
      setError('Title and Issuer are required.')
      return
    }
    setSaving(true)
    setError('')

    const skills = typeof form.skills === 'string'
      ? (form.skills as unknown as string).split(',').map((s: string) => s.trim()).filter(Boolean)
      : (Array.isArray(form.skills) ? form.skills : [])

    const payload: Omit<Certificate, 'id'> = {
      title: form.title.trim(),
      issuer: form.issuer.trim(),
      issuerLogo: form.issuerLogo?.trim() || '',
      issueDate: form.issueDate.trim(),
      expiryDate: form.expiryDate?.trim() || '',
      credentialId: form.credentialId?.trim() || '',
      credentialUrl: form.credentialUrl?.trim() || '',
      skills,
      featured: Boolean(form.featured),
    }

    try {
      if (isNew) {
        await addCertificate(payload)
        showStatus('success', `✓ Successfully added "${payload.title}".`)
      } else if (editing) {
        await updateCertificate({ ...payload, id: editing.id })
        showStatus('success', `✓ Successfully updated "${payload.title}".`)
      }
      close()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.toLowerCase().includes('permission') || msg.includes('PERMISSION_DENIED')) {
        setError('Permission denied — please check your admin sign-in session.')
      } else {
        setError(`Save failed: ${msg}`)
      }
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!deletingCert) return
    setDeleting(true)
    try {
      await deleteCertificate(deletingCert.id)
      showStatus('success', `✓ Certificate "${deletingCert.title}" deleted.`)
      setDeletingCert(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      showStatus('error', `Failed to delete certificate: ${msg}`)
    } finally {
      setDeleting(false)
    }
  }

  const handleMove = async (filteredIndex: number, direction: 'up' | 'down') => {
    const targetFilteredIndex = direction === 'up' ? filteredIndex - 1 : filteredIndex + 1
    if (targetFilteredIndex < 0 || targetFilteredIndex >= filtered.length) return

    const currentItem = filtered[filteredIndex]
    const targetItem = filtered[targetFilteredIndex]

    const currentIndex = certificates.findIndex(c => c.id === currentItem.id)
    if (currentIndex === -1) return

    const reordered = [...certificates]
    const [moved] = reordered.splice(currentIndex, 1)
    const newTargetIndex = reordered.findIndex(c => c.id === targetItem.id)
    if (newTargetIndex === -1) return

    if (direction === 'up') {
      reordered.splice(newTargetIndex, 0, moved)
    } else {
      reordered.splice(newTargetIndex + 1, 0, moved)
    }

    try {
      await reorderCertificates(reordered.map(c => c.id))
      showStatus('success', '✓ Certificates order updated.')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      showStatus('error', `Failed to reorder: ${msg}`)
    }
  }

  const set = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const filtered = certificates.filter(c => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      c.title.toLowerCase().includes(q) ||
      c.issuer.toLowerCase().includes(q) ||
      c.skills.some(s => s.toLowerCase().includes(q))
    )
  })

  return (
    <div>
      <Header>
        <PageTitle>Certificates & Credentials</PageTitle>
        <AddBtn onClick={openNew} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <FiPlus /> Add Certificate
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
        <SearchWrap>
          <FiSearch size={14} />
          <SearchInput
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, issuer, or skill..."
          />
        </SearchWrap>
      </Toolbar>

      <Table>
        <TableHead>
          <TH>Order</TH>
          <TH>Issuer</TH>
          <TH>Certificate Details</TH>
          <TH>Issued</TH>
          <TH>Actions</TH>
        </TableHead>

        {filtered.length === 0 ? (
          <EmptyState>No certificates found.</EmptyState>
        ) : (
          <AnimatePresence>
            {filtered.map((cert, i) => {
              return (
                <TableRow
                  key={cert.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ delay: i * 0.04 }}>
                  <OrderControls>
                    <OrderBtn
                      disabled={i === 0}
                      onClick={() => handleMove(i, 'up')}
                      title="Move Up">
                      <FiChevronUp />
                    </OrderBtn>
                    <OrderBtn
                      disabled={i === filtered.length - 1}
                      onClick={() => handleMove(i, 'down')}
                      title="Move Down">
                      <FiChevronDown />
                    </OrderBtn>
                  </OrderControls>

                  <div>
                    <IssuerBadge>
                      <FiAward /> {cert.issuer}
                    </IssuerBadge>
                  </div>

                  <div>
                    <CertTitle>{cert.title}</CertTitle>
                    {cert.credentialId && (
                      <MetaText>ID: {cert.credentialId}</MetaText>
                    )}
                    <SkillsWrap>
                      {cert.skills.map(s => (
                        <SkillChip key={s}>{s}</SkillChip>
                      ))}
                    </SkillsWrap>
                    {cert.credentialUrl && (
                      <VerifyLink href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                        Verify Credential <FiExternalLink size={10} />
                      </VerifyLink>
                    )}
                  </div>

                  <MetaText>{cert.issueDate}</MetaText>

                  <Actions>
                    <IconBtn
                      onClick={() => openEdit(cert)}
                      title="Edit"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}>
                      <FiEdit2 />
                    </IconBtn>
                    <IconBtn
                      $danger
                      onClick={() => setDeletingCert(cert)}
                      title="Delete"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}>
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
        {deletingCert && (
          <Backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={e => {
              if (e.target === e.currentTarget && !deleting) setDeletingCert(null)
            }}>
            <Modal
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}>
              <ModalHeader style={{ background: '#FF3C2F' }}>
                <ModalTitle style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiAlertTriangle /> Delete Certificate
                </ModalTitle>
                <IconBtn onClick={() => !deleting && setDeletingCert(null)} whileTap={{ scale: 0.9 }}>
                  <FiX />
                </IconBtn>
              </ModalHeader>
              <DeleteModalBody>
                <DeleteWarning>
                  Are you sure you want to permanently delete <strong>"{deletingCert.title}"</strong> ({deletingCert.issuer})?
                </DeleteWarning>
                <DeleteActions>
                  <CancelBtn onClick={() => setDeletingCert(null)} disabled={deleting}>
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
                <ModalTitle>{isNew ? 'Add Certificate' : 'Edit Certificate'}</ModalTitle>
                <IconBtn onClick={close} whileTap={{ scale: 0.9 }} disabled={saving}>
                  <FiX />
                </IconBtn>
              </ModalHeader>

              <ModalBody>
                <Field>
                  <FieldLabel>Certificate Title *</FieldLabel>
                  <Input
                    value={form.title}
                    onChange={e => set('title', e.target.value)}
                    placeholder="e.g. Responsive Web Design Certification"
                    required
                  />
                </Field>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <Field>
                    <FieldLabel>Issuer / Organization *</FieldLabel>
                    <Input
                      value={form.issuer}
                      onChange={e => set('issuer', e.target.value)}
                      placeholder="e.g. FreeCodeCamp, Meta, Coursera"
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Issue Date / Year *</FieldLabel>
                    <Input
                      value={form.issueDate}
                      onChange={e => set('issueDate', e.target.value)}
                      placeholder="e.g. 2024, Jan 2025"
                      required
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel>Credential ID</FieldLabel>
                  <Input
                    value={form.credentialId ?? ''}
                    onChange={e => set('credentialId', e.target.value)}
                    placeholder="e.g. FCC-RWD-2024-001"
                  />
                </Field>

                <Field>
                  <FieldLabel>Verification / Credential URL</FieldLabel>
                  <Input
                    value={form.credentialUrl ?? ''}
                    onChange={e => set('credentialUrl', e.target.value)}
                    placeholder="https://freecodecamp.org/certification/..."
                  />
                </Field>

                <Field>
                  <FieldLabel>Skills Validated (comma-separated)</FieldLabel>
                  <Input
                    value={Array.isArray(form.skills) ? form.skills.join(', ') : form.skills}
                    onChange={e => set('skills', e.target.value)}
                    placeholder="HTML5, CSS3, Flexbox, CSS Grid, Responsive Design"
                  />
                </Field>

                <Field style={{ flexDirection: 'row', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    type="checkbox"
                    id="cert-featured"
                    checked={!!form.featured}
                    onChange={e => set('featured', e.target.checked)}
                    style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#FFE500' }}
                  />
                  <FieldLabel htmlFor="cert-featured" style={{ margin: 0, cursor: 'pointer' }}>
                    Featured Certificate
                  </FieldLabel>
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
                  <FiCheck /> {saving ? 'Saving to Firebase…' : isNew ? 'Add Certificate' : 'Save Changes'}
                </SaveBtn>
              </ModalBody>
            </Modal>
          </Backdrop>
        )}
      </AnimatePresence>
    </div>
  )
}
