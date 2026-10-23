import { useRef, useState } from 'react'
import styled from 'styled-components'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiArrowRight, FiDownload, FiCheck, FiSend, FiCopy, FiAlertCircle } from 'react-icons/fi'
import {
  Container,
  Section,
  SectionTitle,
  SectionSubtitle,
  BannerHeaderBar,
  popSpring,
} from '../UI'
import { fadeUp, slideLeft } from '../../styles/animations'
import { fsAddMessage } from '../../firebase/firestoreService'
import { useToast } from '../../context/ToastContext'
import { usePublicData } from '../../styles/PublicDataContext'
import { useAccent } from '../../styles/ThemeContext'
import { recordContactSubmit, recordCvDownload } from '../../services/analyticsService'

/* ─── Styled Components ─── */
const BannerBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  letter-spacing: 0.12em;
  text-transform: uppercase;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.accentText ?? theme.colors.text};
  border: 2px solid ${({ theme }) => theme.colors.background};
  padding: 0.25rem 0.65rem;
  margin-bottom: ${({ theme }) => theme.spacing['3']};
  width: fit-content;
`

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

const Input = styled.input<{ $hasError?: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ $hasError, theme }) => ($hasError ? theme.colors.error : theme.colors.border)};
  border-radius: 0;
  padding: 0.75rem 1rem;
  outline: none;
  width: 100%;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textFaint};
  }

  &:focus {
    border-color: ${({ $hasError, theme }) => ($hasError ? theme.colors.error : theme.colors.text)};
    box-shadow: 3px 3px 0 ${({ $hasError, theme }) => ($hasError ? theme.colors.error : theme.colors.primary)};
  }
`

const Textarea = styled.textarea<{ $hasError?: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ $hasError, theme }) => ($hasError ? theme.colors.error : theme.colors.border)};
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
    border-color: ${({ $hasError, theme }) => ($hasError ? theme.colors.error : theme.colors.text)};
    box-shadow: 3px 3px 0 ${({ $hasError, theme }) => ($hasError ? theme.colors.error : theme.colors.primary)};
  }
`

const FieldError = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.error};
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

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      transform: translate(-2px, -2px);
      box-shadow: ${({ theme }) => theme.shadows.hover};
      svg {
        transform: translateX(4px);
      }
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
    background: ${({ theme }) => theme.colors.primary};
    border: 1.5px solid ${({ theme }) => theme.colors.border};
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

const EmailCard = styled(motion.button)<{ $hoverBg: string; $hoverFg: string; $copied: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ $copied, $hoverBg, theme }) => ($copied ? $hoverBg : theme.colors.surface)};
  color: ${({ $copied, $hoverFg, theme }) => ($copied ? $hoverFg : theme.colors.text)};
  cursor: pointer;
  width: 100%;
  text-align: left;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.15s ease, color 0.15s ease;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${({ $hoverBg }) => $hoverBg};
      color: ${({ $hoverFg }) => $hoverFg};
      transform: translate(-2px, -2px);
      box-shadow: ${({ theme }) => theme.shadows.md};
    }
  }

  &:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 ${({ theme }) => theme.colors.border};
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

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${({ $hoverBg }) => $hoverBg};
      color: ${({ $hoverFg }) => $hoverFg};
      padding-left: ${({ theme }) => theme.spacing['10']};
    }
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
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { toast } = useToast()
  const { settings, heroContent } = usePublicData()
  const { accent, isMonoTheme } = useAccent()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)

  const cvUrl = heroContent.cvUrl || '/Maqhawe-Ngwenya-CV.pdf'

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault()
    if (navigator?.clipboard && settings.email) {
      navigator.clipboard.writeText(settings.email).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2200)
      }).catch(() => {
        window.location.href = `mailto:${settings.email}`
      })
    } else {
      window.location.href = `mailto:${settings.email}`
    }
  }

  const btnFg = isMonoTheme ? '#000000' : (accent.textColor || '#000000')
  const hoverBg = accent.primary
  const hoverFg = accent.textColor

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = () => {
    const nextErrors: { name?: string; email?: string; message?: string } = {}
    const trimmedName = form.name.trim()
    const trimmedEmail = form.email.trim()
    const trimmedMsg = form.message.trim()

    if (!trimmedName) {
      nextErrors.name = 'Please enter your name.'
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = 'Please enter a valid email address.'
    }
    if (!trimmedMsg) {
      nextErrors.message = 'Please enter a message.'
    }

    setErrors(nextErrors)

    if (nextErrors.name) {
      nameRef.current?.focus()
      return false
    }
    if (nextErrors.email) {
      emailRef.current?.focus()
      return false
    }
    if (nextErrors.message) {
      messageRef.current?.focus()
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    }

    setSending(true)
    try {
      await toast.promise(
        fsAddMessage(payload),
        {
          loading: 'Sending message…',
          success: 'Message sent & saved!',
          error: (err) => `Firestore unavailable (${(err as Error)?.message || 'Network error'}): opening mail client…`,
        }
      )
      recordContactSubmit()
      setSent(true)
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      console.error(err)
      // Fallback to mailto so public visitors can still reach out if Firestore is unreachable
      const subject = encodeURIComponent(`Portfolio contact from ${payload.name}`)
      const body = encodeURIComponent(`Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`)
      window.location.href = `mailto:${settings.email}?subject=${subject}&body=${body}`
      setSent(true)
      setForm({ name: '', email: '', message: '' })
    } finally {
      setSending(false)
    }
  }

  return (
    <Section id="contact">
      <Container>
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}>
          <BannerHeaderBar>
            <div>
              <BannerBadge>07 // DIRECT DISPATCH</BannerBadge>
              <SectionTitle>Let's Build Together.</SectionTitle>
            </div>
            <SectionSubtitle>
              Have a project in mind, an engineering role to discuss, or want to collaborate? Reach out below.
            </SectionSubtitle>
          </BannerHeaderBar>
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
                  <FiSend aria-hidden="true" /> Send a Direct Message
                </FormTitle>
                <Form onSubmit={handleSubmit} noValidate>
                  <Field>
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      ref={nameRef}
                      id="name"
                      name="name"
                      type="text"
                      placeholder="e.g. Alex Morgan…"
                      value={form.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      $hasError={!!errors.name}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    />
                    {errors.name && (
                      <FieldError id="contact-name-error" role="alert">
                        <FiAlertCircle aria-hidden="true" /> {errors.name}
                      </FieldError>
                    )}
                  </Field>
                  <Field>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      ref={emailRef}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="e.g. alex@example.com…"
                      value={form.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      spellCheck={false}
                      $hasError={!!errors.email}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    />
                    {errors.email && (
                      <FieldError id="contact-email-error" role="alert">
                        <FiAlertCircle aria-hidden="true" /> {errors.email}
                      </FieldError>
                    )}
                  </Field>
                  <Field>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      ref={messageRef}
                      id="message"
                      name="message"
                      placeholder="Tell me about your project, timeline, or inquiry…"
                      value={form.message}
                      onChange={handleChange}
                      required
                      $hasError={!!errors.message}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    />
                    {errors.message && (
                      <FieldError id="contact-message-error" role="alert">
                        <FiAlertCircle aria-hidden="true" /> {errors.message}
                      </FieldError>
                    )}
                  </Field>
                  <SubmitBtn
                    type="submit"
                    disabled={sending}
                    $fg={btnFg}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    transition={popSpring}>
                    {sending ? 'Sending Message…' : 'Send Message'} <FiArrowRight aria-hidden="true" />
                  </SubmitBtn>
                  <div aria-live="polite">
                    {sent && (
                      <SuccessMsg initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                        <FiCheck size={16} aria-hidden="true" /> Your message has been sent and recorded.
                      </SuccessMsg>
                    )}
                  </div>
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
                  Available for Front-End Software Developer roles, freelance web applications, and collaborative engineering projects.
                </InfoText>

                <EmailCard
                  type="button"
                  onClick={handleCopyEmail}
                  $hoverBg={hoverBg}
                  $hoverFg={hoverFg}
                  $copied={copied}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  title="Click to copy email address">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiMail aria-hidden="true" />
                    <EmailText>{copied ? 'COPIED TO CLIPBOARD!' : settings.email}</EmailText>
                  </div>
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.span
                        key="copied"
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700, fontSize: '0.75rem' }}>
                        <FiCheck size={16} aria-hidden="true" /> COPIED!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', opacity: 0.8, fontSize: '0.75rem' }}>
                        <FiCopy size={13} aria-hidden="true" /> COPY
                      </motion.span>
                    )}
                  </AnimatePresence>
                </EmailCard>
              </InfoTop>

              <SocialList>
                {[
                  {
                    icon: <FiGithub aria-hidden="true" />,
                    label: 'GitHub',
                    handle: settings.githubUrl.replace('https://', ''),
                    href: settings.githubUrl,
                  },
                  {
                    icon: <FiLinkedin aria-hidden="true" />,
                    label: 'LinkedIn',
                    handle: settings.linkedinUrl.replace('https://', ''),
                    href: settings.linkedinUrl,
                  },
                  {
                    icon: <FiDownload aria-hidden="true" />,
                    label: 'Download CV',
                    handle: 'Maqhawe-Ngwenya-CV.pdf',
                    href: cvUrl,
                    download: true,
                    onClick: () => recordCvDownload(cvUrl),
                  },
                ].map(s => (
                  <SocialLink
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    download={'download' in s && s.download ? s.handle : undefined}
                    onClick={'onClick' in s ? s.onClick : undefined}
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
                    <FiArrowRight size={14} aria-hidden="true" />
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
