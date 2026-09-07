import { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi'
import { useAdmin } from '../context/AdminContext'
import type { ExperienceItem } from '../../types'

/* ─── Shared admin styles ─── */
const Header = styled.div`display:flex;align-items:center;justify-content:space-between;margin-bottom:1.75rem;flex-wrap:wrap;gap:1rem;`
const PageTitle = styled.h1`font-family:${({theme})=>theme.typography.fontDisplay};font-size:${({theme})=>theme.typography.sizes['2xl']};font-weight:700;color:${({theme})=>theme.colors.text};letter-spacing:-0.03em;`
const AddBtn = styled(motion.button)`display:flex;align-items:center;gap:0.5rem;font-family:${({theme})=>theme.typography.fontBody};font-size:${({theme})=>theme.typography.sizes.sm};font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#000;background:${({theme})=>theme.colors.primary};padding:0.6rem 1.25rem;border:3px solid ${({theme})=>theme.colors.border};cursor:pointer;box-shadow:${({theme})=>theme.shadows.sm};&:hover{transform:translate(-2px,-2px);box-shadow:${({theme})=>theme.shadows.md};}`
const Table = styled.div`border:3px solid ${({theme})=>theme.colors.border};box-shadow:${({theme})=>theme.shadows.md};`
const TableHead = styled.div`display:grid;grid-template-columns:1fr 100px 100px 90px;background:${({theme})=>theme.colors.primary};border-bottom:3px solid ${({theme})=>theme.colors.border};padding:0.6rem 1rem;gap:1rem;`
const TH = styled.span`font-family:${({theme})=>theme.typography.fontMono};font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#000;`
const Row = styled(motion.div)`display:grid;grid-template-columns:1fr 100px 100px 90px;padding:0.875rem 1rem;border-bottom:2px solid ${({theme})=>theme.colors.borderSubtle};align-items:center;gap:1rem;background:${({theme})=>theme.colors.surface};transition:background 0.15s;&:last-child{border-bottom:none;}&:hover{background:${({theme})=>theme.colors.surfaceAlt};}`
const Cell = styled.div`font-family:${({theme})=>theme.typography.fontBody};font-size:${({theme})=>theme.typography.sizes.sm};font-weight:700;color:${({theme})=>theme.colors.text};`
const CellSub = styled.div`font-family:${({theme})=>theme.typography.fontMono};font-size:0.65rem;color:${({theme})=>theme.colors.textFaint};margin-top:0.2rem;`
const TypeBadge = styled.span<{$type:string}>`font-family:${({theme})=>theme.typography.fontMono};font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;padding:0.2rem 0.5rem;border:1.5px solid ${({theme})=>theme.colors.border};background:${({$type})=>$type==='education'?'#FFE500':$type==='work'?'#0047FF':$type==='project'?'#FF3C2F':'#00C853'};color:${({$type})=>$type==='education'||$type==='milestone'?'#000':'#fff'};`
const Actions = styled.div`display:flex;gap:0.5rem;`
const IconBtn = styled(motion.button)<{$danger?:boolean}>`width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:${({$danger,theme})=>$danger?theme.colors.error:theme.colors.surfaceAlt};border:2px solid ${({theme})=>theme.colors.border};color:${({$danger})=>$danger?'#fff':'inherit'};cursor:pointer;font-size:0.875rem;&:hover{background:${({$danger,theme})=>$danger?'#cc2020':theme.colors.primary};color:#000;}`

/* Modal */
const Backdrop = styled(motion.div)`position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:200;display:flex;align-items:center;justify-content:center;padding:1.5rem;`
const Modal = styled(motion.div)`background:${({theme})=>theme.colors.surface};border:3px solid ${({theme})=>theme.colors.border};box-shadow:${({theme})=>theme.shadows.xl};width:100%;max-width:580px;max-height:90svh;overflow-y:auto;`
const ModalHeader = styled.div`display:flex;align-items:center;justify-content:space-between;padding:1rem 1.25rem;border-bottom:3px solid ${({theme})=>theme.colors.border};background:${({theme})=>theme.colors.primary};`
const ModalTitle = styled.h2`font-family:${({theme})=>theme.typography.fontDisplay};font-size:${({theme})=>theme.typography.sizes.lg};font-weight:700;color:#000;`
const ModalBody = styled.div`padding:1.25rem;display:flex;flex-direction:column;gap:1rem;`
const Field = styled.div`display:flex;flex-direction:column;gap:0.4rem;`
const Label = styled.label`font-family:${({theme})=>theme.typography.fontMono};font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:${({theme})=>theme.colors.textMuted};`
const Input = styled.input`font-family:${({theme})=>theme.typography.fontBody};font-size:${({theme})=>theme.typography.sizes.sm};color:${({theme})=>theme.colors.text};background:${({theme})=>theme.colors.background};border:2px solid ${({theme})=>theme.colors.border};padding:0.6rem 0.875rem;outline:none;width:100%;&:focus{box-shadow:${({theme})=>theme.shadows.sm};}`
const Textarea = styled.textarea`font-family:${({theme})=>theme.typography.fontBody};font-size:${({theme})=>theme.typography.sizes.sm};color:${({theme})=>theme.colors.text};background:${({theme})=>theme.colors.background};border:2px solid ${({theme})=>theme.colors.border};padding:0.6rem 0.875rem;outline:none;width:100%;min-height:80px;resize:vertical;line-height:1.5;&:focus{box-shadow:${({theme})=>theme.shadows.sm};}`
const Select = styled.select`font-family:${({theme})=>theme.typography.fontMono};font-size:${({theme})=>theme.typography.sizes.xs};font-weight:700;color:${({theme})=>theme.colors.text};background:${({theme})=>theme.colors.background};border:2px solid ${({theme})=>theme.colors.border};padding:0.6rem 0.875rem;outline:none;width:100%;cursor:pointer;`
const Row2 = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;`
const SaveBtn = styled(motion.button)`display:flex;align-items:center;gap:0.5rem;font-family:${({theme})=>theme.typography.fontBody};font-size:${({theme})=>theme.typography.sizes.sm};font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#000;background:${({theme})=>theme.colors.primary};padding:0.7rem 1.5rem;border:3px solid ${({theme})=>theme.colors.border};cursor:pointer;align-self:flex-end;box-shadow:${({theme})=>theme.shadows.sm};&:hover{box-shadow:${({theme})=>theme.shadows.md};}`

const blank = (): Omit<ExperienceItem,'id'> => ({
  type:'education', title:'', organization:'', location:'',
  startDate:'', endDate:'', description:'', highlights:[], technologies:[],
})

export default function AdminJourney() {
  const { journey, addJourneyItem, updateJourneyItem, deleteJourneyItem } = useAdmin()
  const [editing, setEditing] = useState<ExperienceItem|null>(null)
  const [isNew,   setIsNew]   = useState(false)
  const [form,    setForm]    = useState<Omit<ExperienceItem,'id'>>(blank())
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')

  const openNew  = () => { setForm(blank()); setIsNew(true); setEditing(null); setError('') }
  const openEdit = (i: ExperienceItem) => { setForm({...i}); setEditing(i); setIsNew(false); setError('') }
  const close    = () => { setEditing(null); setIsNew(false); setError('') }

  const parse = (v: string | string[]) =>
    typeof v === 'string' ? v.split('\n').map(s=>s.trim()).filter(Boolean) : v

  const handleSave = async () => {
    if (!form.title.trim()) return
    setSaving(true)
    setError('')
    const item = { ...form, highlights: parse(form.highlights ?? []), technologies: parse(form.technologies ?? []) }
    try {
      if (isNew) await addJourneyItem(item)
      else if (editing) await updateJourneyItem({ ...editing, ...item })
      close()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.includes('permission') || msg.includes('PERMISSION_DENIED')) {
        setError('Permission denied — check Firestore security rules or confirm you are signed in.')
      } else {
        setError(`Save failed: ${msg}`)
      }
    } finally {
      setSaving(false)
    }
  }

  const set = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div>
      <Header>
        <PageTitle>Journey</PageTitle>
        <AddBtn onClick={openNew} whileHover={{scale:1.03}} whileTap={{scale:0.97}}>
          <FiPlus /> Add Entry
        </AddBtn>
      </Header>

      <Table>
        <TableHead>
          <TH>Entry</TH><TH>Type</TH><TH>Dates</TH><TH>Actions</TH>
        </TableHead>
        <AnimatePresence>
          {journey.map((item, i) => (
            <Row key={item.id}
              initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:16}}
              transition={{delay:i*0.04}}>
              <div>
                <Cell>{item.title}</Cell>
                <CellSub>{item.organization}{item.location ? ` · ${item.location}` : ''}</CellSub>
              </div>
              <TypeBadge $type={item.type}>{item.type}</TypeBadge>
              <Cell style={{fontFamily:'Space Mono',fontSize:'0.7rem'}}>
                {item.startDate}{item.endDate ? `–${item.endDate}` : '–Now'}
              </Cell>
              <Actions>
                <IconBtn onClick={()=>openEdit(item)} whileHover={{scale:1.1}} whileTap={{scale:0.9}}><FiEdit2/></IconBtn>
                <IconBtn $danger onClick={()=>deleteJourneyItem(item.id)} whileHover={{scale:1.1}} whileTap={{scale:0.9}}><FiTrash2/></IconBtn>
              </Actions>
            </Row>
          ))}
        </AnimatePresence>
      </Table>

      <AnimatePresence>
        {(isNew||editing) && (
          <Backdrop initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            onClick={e=>{if(e.target===e.currentTarget)close()}}>
            <Modal initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:24}} transition={{duration:0.3}}>
              <ModalHeader>
                <ModalTitle>{isNew?'Add Entry':'Edit Entry'}</ModalTitle>
                <IconBtn onClick={close} whileTap={{scale:0.9}}><FiX/></IconBtn>
              </ModalHeader>
              <ModalBody>
                <Row2>
                  <Field><Label>Type</Label>
                    <Select value={form.type} onChange={e=>set('type',e.target.value)}>
                      {['education','work','project','milestone'].map(t=><option key={t}>{t}</option>)}
                    </Select></Field>
                  <Field><Label>Start Date</Label>
                    <Input value={form.startDate} onChange={e=>set('startDate',e.target.value)} placeholder="2024"/></Field>
                </Row2>
                <Row2>
                  <Field><Label>Title *</Label>
                    <Input value={form.title} onChange={e=>set('title',e.target.value)} placeholder="Role or programme title"/></Field>
                  <Field><Label>End Date (leave blank = Present)</Label>
                    <Input value={form.endDate??''} onChange={e=>set('endDate',e.target.value)} placeholder="2025"/></Field>
                </Row2>
                <Row2>
                  <Field><Label>Organisation</Label>
                    <Input value={form.organization} onChange={e=>set('organization',e.target.value)} placeholder="Company or institution"/></Field>
                  <Field><Label>Location</Label>
                    <Input value={form.location??''} onChange={e=>set('location',e.target.value)} placeholder="Zimbabwe"/></Field>
                </Row2>
                <Field><Label>Description</Label>
                  <Textarea value={form.description} onChange={e=>set('description',e.target.value)}/></Field>
                <Field><Label>Highlights (one per line)</Label>
                  <Textarea value={Array.isArray(form.highlights)?form.highlights.join('\n'):form.highlights??''}
                    onChange={e=>set('highlights',e.target.value)} placeholder="Built X&#10;Achieved Y"/></Field>
                <Field><Label>Technologies (one per line)</Label>
                  <Textarea style={{minHeight:60}} value={Array.isArray(form.technologies)?form.technologies.join('\n'):form.technologies??''}
                    onChange={e=>set('technologies',e.target.value)} placeholder="React&#10;TypeScript"/></Field>
                <Field><Label>URL (optional)</Label>
                  <Input value={form.url??''} onChange={e=>set('url',e.target.value)} placeholder="https://..."/></Field>
                {error && (
                  <div style={{
                    background:'#ff000015',border:'2px solid #FF3C2F',
                    color:'#FF3C2F',padding:'0.6rem 0.875rem',
                    fontFamily:'Space Mono',fontSize:'0.75rem',fontWeight:700,lineHeight:1.5,
                  }}>⚠ {error}</div>
                )}
                <SaveBtn onClick={handleSave} disabled={saving} whileHover={{scale:saving?1:1.02}} whileTap={{scale:0.97}}>
                  <FiCheck/> {saving ? 'Saving…' : isNew ? 'Add Entry' : 'Save Changes'}
                </SaveBtn>
              </ModalBody>
            </Modal>
          </Backdrop>
        )}
      </AnimatePresence>
    </div>
  )
}
