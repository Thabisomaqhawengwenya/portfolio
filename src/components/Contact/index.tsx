import { useRef, useState } from 'react'
import styled from 'styled-components'
import { motion, useInView } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiArrowRight, FiDownload, FiCheck, FiSend } from 'react-icons/fi'
import { Container, Section, SectionHeader, SectionEyebrow, SectionTitle, SectionSubtitle, popSpring } from '../UI'
import { fadeUp, slideLeft } from '../../styles/animations'
import { useAdmin } from '../../admin/context/AdminContext'
import { usePublicData } from '../../styles/PublicDataContext'
import { useAccent } from '../../styles/ThemeContext'

/* ─── Styled Components ─── */
const ContactWrap = styled.div`
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 0;
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  background: ${({ theme }) => theme.colors.surface};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`

const FormPane = styled.div`
  padding: ${({ theme }) => theme.spacing['10']};
  background: ${({ theme }) => theme.colors.surface};
  border-right: 3px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    border-right: none;
    border-bottom: 3px solid ${({ theme }) => theme.colors.border};
    padding: ${({ theme }) => theme.spacing['8']} ${({ theme }) => theme.spacing['6']};
  }
`

const FormTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.02em;
  margin-bottom: ${({ theme }) => theme.spacing['6']};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['5']};
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2']};
`

const Label = styled.label`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
`

const Input = styled.input`
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 0;
  padding: 0.75rem 1rem;
  outline: none;
  width: 100%;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textFaint};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.text};
    box-shadow: 3px 3px 0 ${({ theme }) => theme.colors.primary};
  }
`

const Textarea = styled.textarea`
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 0;
  padding: 0.75rem 1rem;
  outline: none;
  width: 100%;
  min-height: 140px;
  resize: vertical;
  line-height: 1.6;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textFaint};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.text};
    box-shadow: 3px 3px 0 ${({ theme }) => theme.colors.primary};
  }
`

const SubmitBtn = styled(motion.button)<{ $fg: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ $fg }) => $fg};
  background: ${({ theme }) => theme.colors.primary};
  padding: 0.85rem 2rem;
  border: 3px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  align-self: flex-start;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: transform 0.1s ease, box-shadow 0.1s ease;

  svg {
    font-size: 1rem;
    transition: transform 0.15s ease;
  }

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: ${({ theme }) => theme.shadows.hover};
    svg {
      transform: translateX(4px);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

const SuccessMsg = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 2px solid ${({ theme }) => theme.colors.border};
  padding: 0.75rem 1rem;
  margin-top: ${({ theme }) => theme.spacing['2']};
`

/* Info Pane */
const InfoPane = styled.div`
  background: ${({ theme }) => theme.colors.surfaceAlt};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const InfoTop = styled.div`
  padding: ${({ theme }) => theme.spacing['10']};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['4']};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing['8']} ${({ theme }) => theme.spacing['6']};
  }
`

const StatusPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.65rem;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.25rem 0.65rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  width: fit-content;

  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #00C853;
    display: inline-block;
  }
`

const InfoHeading = styled.h3`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.03em;
  line-height: 1.15;
`

const InfoText = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.7;
`

const EmailCard = styled.a<{ $hoverBg: string; $hoverFg: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.1s ease, color 0.1s ease;

  &:hover {
    background: ${({ $hoverBg }) => $hoverBg};
    color: ${({ $hoverFg }) => $hoverFg};
    transform: translate(-2px, -2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`

const EmailText = styled.span`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  word-break: break-all;
`

const SocialList = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 2px solid ${({ theme }) => theme.colors.border};
`

const SocialLink = styled(motion.a)<{ $hoverBg: string; $hoverFg: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing['4']};
  padding: ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['8']};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  border-bottom: 2px solid ${({ theme }) => theme.colors.borderSubtle};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  transition: background 0.15s ease, color 0.15s ease, transform 0.1s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ $hoverBg }) => $hoverBg};
    color: ${({ $hoverFg }) => $hoverFg};
    padding-left: ${({ theme }) => theme.spacing['10']};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['6']};
  }
`

const SocialLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const SocialIconBox = styled.span`
  font-size: 1.15rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
`

const SocialMeta = styled.div`
  display: flex;
  flex-direction: column;
`

const SocialLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  font-family: ${({ theme }) => theme.typography.fontBody};
  color: inherit;
`

const SocialHandle = styled.span`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.65rem;
  opacity: 0.75;
  color: inherit;
`

/* ─── Component ─── */
export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { addMessage } = useAdmin()
  const { settings } = usePublicData()
  const { accent, isMonoTheme } = useAccent()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const btnFg = isMonoTheme ? '#000000' : (accent.textColor || '#000000')
  const hoverBg = isMonoTheme ? accent.primary : accent.primary
  const hoverFg = isMonoTheme ? accent.textColor : accent.textColor

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return
    setSending(true)
    await addMessage({ name: form.name, email: form.email, message: form.message })
    const subject = encodeURIComponent(`Portfolio contact from ${form.name}`)
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)
    window.location.href = `mailto:${settings.email}?subject=${subject}&body=${body}`
    setTimeout(() => {
      setSending(false)
      setSent(true)
      setForm({ name: '', email: '', message: '' })
    }, 800)
  }

  return (
    <Section id="contact">
      <Container>
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}>
          <SectionHeader>
            <SectionEyebrow>Contact & Inquiries</SectionEyebrow>
            <SectionTitle>Let's Build Together.</SectionTitle>
            <SectionSubtitle>
              Have a project in mind, an opportunity to discuss, or just want to connect? Reach out below.
            </SectionSubtitle>
          </SectionHeader>
        </motion.div>

        <ContactWrap>
          {/* Form */}
          <motion.div
            variants={slideLeft}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ delay: 0.1 }}>
            <FormPane>
              <div>
                <FormTitle>
                  <FiSend /> Send a Direct Message
                </FormTitle>
                <Form onSubmit={handleSubmit} noValidate>
                  <Field>
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="e.g. Alex Morgan"
                      value={form.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                    />
                  </Field>
                  <Field>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="e.g. alex@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                    />
                  </Field>
                  <Field>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell me about your project, timeline, or inquiry..."
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </Field>
                  <SubmitBtn
                    type="submit"
                    disabled={sending}
                    $fg={btnFg}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    transition={popSpring}>
                    {sending ? 'Opening Mail Client…' : 'Send Message'} <FiArrowRight />
                  </SubmitBtn>
                  {sent && (
                    <SuccessMsg initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      <FiCheck size={16} /> Your message was recorded and mail client opened.
                    </SuccessMsg>
                  )}
                </Form>
              </div>
            </FormPane>
          </motion.div>

          {/* Info */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ delay: 0.2 }}>
            <InfoPane>
              <InfoTop>
                <StatusPill>
                  <span /> Available For Work
                </StatusPill>
                <InfoHeading>Open to opportunities.</InfoHeading>
                <InfoText>
                  Available for Junior Full-Stack roles, freelance web applications, and collaborative engineering projects.
                </InfoText>

                <EmailCard
                  href={`mailto:${settings.email}`}
                  $hoverBg={hoverBg}
                  $hoverFg={hoverFg}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiMail />
                    <EmailText>{settings.email}</EmailText>
                  </div>
                  <FiArrowRight />
                </EmailCard>
              </InfoTop>

              <SocialList>
                {[
                  {
                    icon: <FiGithub />,
                    label: 'GitHub',
                    handle: settings.githubUrl.replace('https://', ''),
                    href: settings.githubUrl,
                  },
                  {
                    icon: <FiLinkedin />,
                    label: 'LinkedIn',
                    handle: settings.linkedinUrl.replace('https://', ''),
                    href: settings.linkedinUrl,
                  },
                  {
                    icon: <FiDownload />,
                    label: 'Download CV',
                    handle: 'Maqhawe-Ngwenya-CV.pdf',
                    href: '/Maqhawe-Ngwenya-CV.pdf',
                    download: true,
                  },
                ].map(s => (
                  <SocialLink
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    download={'download' in s && s.download ? s.handle : undefined}
                    $hoverBg={hoverBg}
                    $hoverFg={hoverFg}
                    whileTap={{ scale: 0.98 }}
                    transition={popSpring}>
                    <SocialLeft>
                      <SocialIconBox>{s.icon}</SocialIconBox>
                      <SocialMeta>
                        <SocialLabel>{s.label}</SocialLabel>
                        <SocialHandle>{s.handle}</SocialHandle>
                      </SocialMeta>
                    </SocialLeft>
                    <FiArrowRight size={14} />
                  </SocialLink>
                ))}
              </SocialList>
            </InfoPane>
          </motion.div>
        </ContactWrap>
      </Container>
    </Section>
  )
}
