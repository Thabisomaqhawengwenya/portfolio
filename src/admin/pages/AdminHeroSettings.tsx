import { useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FiSave, FiEye, FiEyeOff } from 'react-icons/fi'
import { useAdmin } from '../context/AdminContext'
import type { HeroContent } from '../../types'

const PageTitle = styled.h1`font-family:${({theme})=>theme.typography.fontDisplay};font-size:${({theme})=>theme.typography.sizes['2xl']};font-weight:700;color:${({theme})=>theme.colors.text};letter-spacing:-0.03em;margin-bottom:0.5rem;`
const PageSub = styled.p`font-family:${({theme})=>theme.typography.fontMono};font-size:${({theme})=>theme.typography.sizes.xs};color:${({theme})=>theme.colors.textFaint};text-transform:uppercase;letter-spacing:0.1em;margin-bottom:1.75rem;`
const Card = styled.div`background:${({theme})=>theme.colors.surface};border:3px solid ${({theme})=>theme.colors.border};box-shadow:${({theme})=>theme.shadows.md};margin-bottom:1.5rem;`
const CardHead = styled.div`padding:0.75rem 1.25rem;border-bottom:3px solid ${({theme})=>theme.colors.border};background:${({theme})=>theme.colors.surfaceAlt};font-family:${({theme})=>theme.typography.fontMono};font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:${({theme})=>theme.colors.textMuted};`
const CardBody = styled.div`padding:1.25rem;display:flex;flex-direction:column;gap:1rem;`
const Field = styled.div`display:flex;flex-direction:column;gap:0.4rem;`
const Label = styled.label`font-family:${({theme})=>theme.typography.fontMono};font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:${({theme})=>theme.colors.textMuted};`
const Input = styled.input`font-family:${({theme})=>theme.typography.fontBody};font-size:${({theme})=>theme.typography.sizes.sm};font-weight:500;color:${({theme})=>theme.colors.text};background:${({theme})=>theme.colors.background};border:2px solid ${({theme})=>theme.colors.border};padding:0.6rem 0.875rem;outline:none;width:100%;&:focus{box-shadow:${({theme})=>theme.shadows.sm};}`
const Textarea = styled.textarea`font-family:${({theme})=>theme.typography.fontBody};font-size:${({theme})=>theme.typography.sizes.sm};color:${({theme})=>theme.colors.text};background:${({theme})=>theme.colors.background};border:2px solid ${({theme})=>theme.colors.border};padding:0.6rem 0.875rem;outline:none;width:100%;min-height:80px;resize:vertical;line-height:1.55;&:focus{box-shadow:${({theme})=>theme.shadows.sm};}`
const Row3 = styled.div`display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.75rem;`
const Toggle = styled.button<{$on:boolean}>`display:flex;align-items:center;gap:0.5rem;font-family:${({theme})=>theme.typography.fontMono};font-size:${({theme})=>theme.typography.sizes.xs};font-weight:700;text-transform:uppercase;letter-spacing:0.08em;padding:0.5rem 1rem;border:2px solid ${({theme})=>theme.colors.border};cursor:pointer;background:${({$on,theme})=>$on?theme.colors.primary:theme.colors.surfaceAlt};color:${({$on})=>$on?'#000':'inherit'};transition:background 0.15s;`
const SaveBtn = styled(motion.button)<{$saved?:boolean}>`display:flex;align-items:center;gap:0.5rem;font-family:${({theme})=>theme.typography.fontBody};font-size:${({theme})=>theme.typography.sizes.sm};font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#000;background:${({$saved,theme})=>$saved?theme.colors.accent3:theme.colors.primary};padding:0.75rem 1.75rem;border:3px solid ${({theme})=>theme.colors.border};cursor:pointer;box-shadow:${({theme})=>theme.shadows.md};transition:background 0.2s;&:hover{box-shadow:${({theme})=>theme.shadows.lg};transform:translate(-2px,-2px);}`

export default function AdminHeroSettings() {
  const { heroContent, updateHeroContent } = useAdmin()
  const [form,  setForm]  = useState<HeroContent>({ ...heroContent })
  const [saved, setSaved] = useState(false)

  const set = (k: keyof HeroContent, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    await updateHeroContent(form)
    setSaved(true); setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <PageTitle>Hero Content</PageTitle>
      <PageSub>Edit the text and labels shown in the hero section of the portfolio.</PageSub>

      <Card>
        <CardHead>Text Content</CardHead>
        <CardBody>
          <Field>
            <Label>Greeting label (after the 👋)</Label>
            <Input value={form.greeting} onChange={e=>set('greeting',e.target.value)} placeholder="Hello, World"/>
          </Field>
          <Field>
            <Label>Role / subtitle</Label>
            <Textarea value={form.role} onChange={e=>set('role',e.target.value)}/>
          </Field>
          <Field>
            <Label>CV / Resume URL</Label>
            <Input value={form.cvUrl} onChange={e=>set('cvUrl',e.target.value)} placeholder="/Maqhawe-Ngwenya-CV.pdf"/>
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHead>Avatar Card</CardHead>
        <CardBody>
          <Field>
            <Label>Availability status</Label>
            <Toggle $on={form.available} onClick={()=>set('available',!form.available)}>
              {form.available ? <><FiEye/> Showing "Open"</> : <><FiEyeOff/> Hidden</>}
            </Toggle>
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHead>Floating Sticker Badges</CardHead>
        <CardBody>
          <Row3>
            <Field><Label>Sticker 1 (yellow)</Label>
              <Input value={form.sticker1} onChange={e=>set('sticker1',e.target.value)} placeholder="React + TS"/></Field>
            <Field><Label>Sticker 2 (red)</Label>
              <Input value={form.sticker2} onChange={e=>set('sticker2',e.target.value)} placeholder="Node.js"/></Field>
            <Field><Label>Sticker 3 (blue)</Label>
              <Input value={form.sticker3} onChange={e=>set('sticker3',e.target.value)} placeholder="Full-Stack"/></Field>
          </Row3>
        </CardBody>
      </Card>

      <div style={{display:'flex',justifyContent:'flex-end'}}>
        <SaveBtn $saved={saved} onClick={handleSave} whileHover={{scale:1.02}} whileTap={{scale:0.97}}>
          <FiSave/> {saved ? 'Saved!' : 'Save Hero Content'}
        </SaveBtn>
      </div>
    </div>
  )
}
