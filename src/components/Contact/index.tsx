import { useRef, useState } from 'react'
import styled from 'styled-components'
import { motion, useInView } from 'framer-motion'
import { FiGithub, FiLinkedin, FiMail, FiArrowRight } from 'react-icons/fi'
import { Container, Section, SectionHeader, SectionEyebrow, SectionTitle } from '../UI'
import { popSpring } from '../UI'
import { fadeUp, slideLeft } from '../../styles/animations'

/* ─── Styled ─── */
const ContactWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 0;
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`

const FormPane = styled.div`
  padding: ${({ theme }) => theme.spacing['10']};
  background: ${({ theme }) => theme.colors.surface};
  border-right: 3px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    border-right: none;
    border-bottom: 3px solid ${({ theme }) => theme.colors.border};
    padding: ${({ theme }) => theme.spacing['8']};
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['4']};
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
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-radius: 0;
  padding: 0.75rem 1rem;
  outline: none;
  width: 100%;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &::placeholder { color: ${({ theme }) => theme.colors.textFaint}; }
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
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-radius: 0;
  padding: 0.75rem 1rem;
  outline: none;
  width: 100%;
  min-height: 140px;
  resize: vertical;
  line-height: 1.6;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &::placeholder { color: ${({ theme }) => theme.colors.textFaint}; }
  &:focus {
    border-color: ${({ theme }) => theme.colors.text};
    box-shadow: 3px 3px 0 ${({ theme }) => theme.colors.primary};
  }
`

const SubmitBtn = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.primary};
  padding: 0.8rem 1.75rem;
  border: 3px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  align-self: flex-start;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: transform 0.1s ease, box-shadow 0.1s ease;

  svg { transition: transform 0.15s ease; }
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: ${({ theme }) => theme.shadows.hover};
    svg { transform: translateX(4px); }
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`

const SuccessMsg = styled(motion.p)`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.primary};
  border: 3px solid ${({ theme }) => theme.colors.border};
  padding: 0.75rem 1rem;
  margin-top: ${({ theme }) => theme.spacing['3']};
`

/* Info pane */
const InfoPane = styled.div`
  background: ${({ theme }) => theme.colors.text};
  display: flex;
  flex-direction: column;
`

const InfoTop = styled.div`
  padding: ${({ theme }) => theme.spacing['8']};
  flex: 1;
  border-bottom: 3px solid ${({ theme }) => theme.colors.primary};
`

const InfoHeading = styled.h3`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin-bottom: ${({ theme }) => theme.spacing['3']};
`

const InfoText = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: #aaa;
  line-height: 1.7;
  margin-bottom: ${({ theme }) => theme.spacing['5']};
`

const EmailLink = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.04em;

  svg { transition: transform 0.15s ease; }
  &:hover svg { transform: translateX(5px); }
`

const SocialList = styled.ul`
  display: flex;
  flex-direction: column;
`

const SocialItem = styled(motion.li)`
  border-top: 2px solid #1a1a1a;
`

const SocialLink = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['3']};
  padding: ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['8']};
  color: #888;
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: #111;
    color: ${({ theme }) => theme.colors.primary};
  }
`

const SocialIcon = styled.span`
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`

const SocialMeta = styled.div`
  flex: 1;
`

const SocialLabel = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: #ccc;
  font-family: ${({ theme }) => theme.typography.fontBody};
`

const SocialHandle = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: #555;
`

/* ─── Component ─── */
export default function Contact() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [form,    setForm]    = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent,    setSent]    = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    const subject = encodeURIComponent(`Portfolio contact from ${form.name}`)
    const body    = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)
    window.location.href = `mailto:maqhawe@example.com?subject=${subject}&body=${body}`
    setTimeout(() => { setSending(false); setSent(true) }, 800)
  }

  return (
    <Section id="contact">
      <Container>
        <motion.div ref={ref}
          variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <SectionHeader>
            <SectionEyebrow>Contact</SectionEyebrow>
            <SectionTitle>Let's build something<br />together.</SectionTitle>
          </SectionHeader>
        </motion.div>

        <ContactWrap>
          {/* Form */}
          <motion.div variants={slideLeft} initial="hidden"
            animate={inView ? 'visible' : 'hidden'} transition={{ delay: 0.1 }}>
            <FormPane>
              <Form onSubmit={handleSubmit} noValidate>
                <Field>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" type="text" placeholder="Your name"
                    value={form.name} onChange={handleChange} required autoComplete="name" />
                </Field>
                <Field>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="your@email.com"
                    value={form.email} onChange={handleChange} required autoComplete="email" />
                </Field>
                <Field>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" placeholder="What's on your mind?"
                    value={form.message} onChange={handleChange} required />
                </Field>
                <SubmitBtn type="submit" disabled={sending}
                  whileHover={{ scale: 1.06, y: -4 }}
                  whileTap={{ scale: 0.93 }}
                  transition={popSpring}>
                  {sending ? 'Opening…' : 'Send Message'} <FiArrowRight />
                </SubmitBtn>
                {sent && (
                  <SuccessMsg initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    ✓ Your mail client should open.
                  </SuccessMsg>
                )}
              </Form>
            </FormPane>
          </motion.div>

          {/* Info */}
          <motion.div variants={fadeUp} initial="hidden"
            animate={inView ? 'visible' : 'hidden'} transition={{ delay: 0.2 }}>
            <InfoPane>
              <InfoTop>
                <InfoHeading>Open to opportunities.</InfoHeading>
                <InfoText>
                  Junior roles, freelance projects, interesting collaborations. Let's talk.
                </InfoText>
                <EmailLink href="mailto:maqhawe@example.com"
                  whileHover={{ scale: 1.04, x: 3 }}
                  whileTap={{ scale: 0.96 }}
                  transition={popSpring}>
                  maqhawe@example.com {/* TODO: real email */}
                  <FiArrowRight />
                </EmailLink>
              </InfoTop>
              <SocialList>
                {[
                  { icon: <FiGithub />,   label: 'GitHub',   handle: 'github.com/Maqhawe',       href: 'https://github.com/Maqhawe' },
                  { icon: <FiLinkedin />, label: 'LinkedIn', handle: 'linkedin.com/in/maqhawe',   href: 'https://linkedin.com' },
                  { icon: <FiMail />,     label: 'Email',    handle: 'maqhawe@example.com',       href: 'mailto:maqhawe@example.com' },
                ].map(s => (
                  <SocialItem key={s.label}>
                    <SocialLink href={s.href}
                      target={s.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.03, x: 5 }}
                      whileTap={{ scale: 0.96 }}
                      transition={popSpring}>
                      <SocialIcon>{s.icon}</SocialIcon>
                      <SocialMeta>
                        <SocialLabel>{s.label}</SocialLabel>
                        <SocialHandle>{s.handle}</SocialHandle>
                      </SocialMeta>
                      <FiArrowRight style={{ opacity: 0.3 }} />
                    </SocialLink>
                  </SocialItem>
                ))}
              </SocialList>
            </InfoPane>
          </motion.div>
        </ContactWrap>
      </Container>
    </Section>
  )
}
