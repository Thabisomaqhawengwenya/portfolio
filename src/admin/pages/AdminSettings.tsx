import { useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import {
  FiSave, FiGithub, FiLinkedin, FiMail, FiMapPin,
  FiAlertTriangle, FiDownload, FiCheck, FiDatabase, FiUploadCloud, FiRefreshCw,
} from 'react-icons/fi'
import { useAdmin } from '../context/AdminContext'
import type { AdminSettings } from '../context/AdminContext'

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

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.md};
  margin-bottom: 1.5rem;
`

const CardHeader = styled.div`
  padding: 0.75rem 1.25rem;
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.textMuted};
`

const CardBody = styled.div`
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
  display: flex;
  align-items: center;
  gap: 0.4rem;
`

const Input = styled.input`
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: 500;
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
  min-height: 90px;
  resize: vertical;
  line-height: 1.55;
  &:focus { box-shadow: ${({ theme }) => theme.shadows.sm}; }
`

const SaveBtn = styled(motion.button)<{ $saved?: boolean }>`
  display: flex; align-items: center; gap: 0.5rem;
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
  color: #000;
  background: ${({ $saved, theme }) => $saved ? theme.colors.accent3 : theme.colors.primary};
  padding: 0.75rem 1.75rem;
  border: 3px solid ${({ theme }) => theme.colors.border};
  cursor: pointer; box-shadow: ${({ theme }) => theme.shadows.md};
  transition: background 0.2s ease;
  &:hover { box-shadow: ${({ theme }) => theme.shadows.lg}; transform: translate(-2px,-2px); }
`

const ExportBtn = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  padding: 0.65rem 1.25rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  align-self: flex-start;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: #000;
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`

const Notice = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
  margin-bottom: 1.5rem;

  svg { color: ${({ theme }) => theme.colors.primary}; flex-shrink: 0; margin-top: 0.1rem; }
`

const BackupDesc = styled.p`
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
`

export default function AdminSettings() {
  const {
    settings, updateSettings,
    projects, certificates, skillGroups, journey, messages, heroContent,
    seedDatabase,
  } = useAdmin()
  const [form,  setForm]  = useState<AdminSettings>({ ...settings })
  const [saved, setSaved] = useState(false)
  const [exported, setExported] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [seedMsg, setSeedMsg] = useState('')

  const set = (k: keyof AdminSettings, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    updateSettings(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleSeed = async () => {
    setSeeding(true)
    setSeedMsg('')
    try {
      const res = await seedDatabase()
      setSeedMsg(`✓ ${res.message} (${res.details.projects} projects, ${res.details.journey} journey items, ${res.details.skills} skill groups).`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setSeedMsg(`Error syncing to Firebase: ${msg}`)
    } finally {
      setSeeding(false)
    }
  }

  const handleExportJson = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      portfolioOwner: 'Maqhawe Thabiso Ngwenya',
      settings: form,
      heroContent,
      projects,
      certificates,
      skills: skillGroups,
      journey,
      messagesCount: messages.length,
    }

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    const dateStr = new Date().toISOString().split('T')[0]
    downloadAnchor.setAttribute('download', `maqhawe-portfolio-backup-${dateStr}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()

    setExported(true)
    setTimeout(() => setExported(false), 3000)
  }

  return (
    <div>
      <PageTitle>Settings</PageTitle>
      <PageSub>Manage your portfolio information and social links.</PageSub>

      <Notice>
        <FiAlertTriangle />
        <span>
          Settings are saved to Firestore and applied to the live portfolio immediately on next page load.
          No redeploy needed.
        </span>
      </Notice>

      {/* Profile */}
      <Card>
        <CardHeader>Profile</CardHeader>
        <CardBody>
          <Field>
            <Label>Bio / Introduction</Label>
            <Textarea value={form.bio} onChange={e => set('bio', e.target.value)} />
          </Field>
          <Field>
            <Label><FiMapPin size={11} /> Location</Label>
            <Input value={form.location} onChange={e => set('location', e.target.value)} placeholder="Zimbabwe" />
          </Field>
        </CardBody>
      </Card>

      {/* Social links */}
      <Card>
        <CardHeader>Social Links</CardHeader>
        <CardBody>
          <Field>
            <Label><FiMail size={11} /> Email</Label>
            <Input type="email" value={form.email} onChange={e => set('email', e.target.value)}
              placeholder="your@email.com" />
          </Field>
          <Field>
            <Label><FiGithub size={11} /> GitHub URL</Label>
            <Input value={form.githubUrl} onChange={e => set('githubUrl', e.target.value)}
              placeholder="https://github.com/..." />
          </Field>
          <Field>
            <Label><FiLinkedin size={11} /> LinkedIn URL</Label>
            <Input value={form.linkedinUrl} onChange={e => set('linkedinUrl', e.target.value)}
              placeholder="https://linkedin.com/in/..." />
          </Field>
        </CardBody>
      </Card>

      {/* Firebase Database Sync */}
      <Card>
        <CardHeader><FiUploadCloud style={{ marginRight: 6, verticalAlign: 'middle' }} /> Firebase Database Sync</CardHeader>
        <CardBody>
          <BackupDesc>
            Store / synchronize all portfolio data (12 Projects, 6 Certificates, 4 Journey milestones, 5 Skill groups, Hero content, Settings) into your live Firestore database collections.
          </BackupDesc>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <ExportBtn
              onClick={handleSeed}
              disabled={seeding}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}>
              {seeding ? <FiRefreshCw className="spin" /> : <FiUploadCloud />}
              {seeding ? 'Syncing to Firebase…' : 'Sync All Data to Firebase'}
            </ExportBtn>
          </div>
          {seedMsg && (
            <div style={{
              fontFamily: 'Space Mono',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: seedMsg.startsWith('✓') ? '#00C853' : '#FF3C2F',
              marginTop: '0.5rem',
            }}>
              {seedMsg}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Backup & Export Data */}
      <Card>
        <CardHeader><FiDatabase style={{ marginRight: 6, verticalAlign: 'middle' }} /> Data Backup & JSON Export</CardHeader>
        <CardBody>
          <BackupDesc>
            Download an offline JSON snapshot of your entire portfolio database (Projects, Certificates, Journey, Skills, Settings, Hero Content).
          </BackupDesc>
          <ExportBtn
            onClick={handleExportJson}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}>
            {exported ? <FiCheck color="#00C853" /> : <FiDownload />}
            {exported ? 'Backup Downloaded!' : 'Export Portfolio Data (JSON)'}
          </ExportBtn>
        </CardBody>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <SaveBtn $saved={saved} onClick={handleSave}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
          <FiSave /> {saved ? 'Saved!' : 'Save Settings'}
        </SaveBtn>
      </div>
    </div>
  )
}


