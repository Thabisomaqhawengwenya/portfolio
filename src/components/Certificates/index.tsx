import { useRef } from 'react'
import styled from 'styled-components'
import { motion, useInView } from 'framer-motion'
import { FiAward, FiExternalLink, FiCheckCircle, FiShield } from 'react-icons/fi'
import {
  Container, Section, SectionHeader,
  SectionEyebrow, SectionTitle, SectionSubtitle, Tag,
  popSpring,
} from '../UI'
import { fadeUp, staggerContainer, staggerItem } from '../../styles/animations'
import { certificates as staticCertificates } from '../../data/certificates'
import { useAccent } from '../../styles/ThemeContext'
import { usePublicData } from '../../styles/PublicDataContext'
import type { Certificate } from '../../types'

/* Multi-colour palette for non-mono themes */
const CARD_ACCENTS = ['#FFE500', '#FF3C2F', '#0047FF', '#00C853', '#FFE500', '#FF3C2F']
const CARD_TEXT    = ['#000000', '#ffffff', '#ffffff', '#000000', '#000000', '#ffffff']

/* ─── Styled Components ─── */
const CertificatesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing['6']};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing['5']};
  }
`

const CertCard = styled(motion.div)`
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.md};
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;

  &:hover {
    transform: translate(-3px, -3px);
    box-shadow: ${({ theme }) => theme.shadows.hover};
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }
`

const CardTop = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  flex-wrap: wrap;
`

const IssuerBadge = styled.div<{ $bg: string; $fg: string }>`
  background: ${({ $bg }) => $bg};
  color: ${({ $fg }) => $fg};
  padding: 0.5rem 1rem;
  border-right: 3px solid ${({ theme }) => theme.colors.border};
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;

  svg {
    font-size: 0.95rem;
  }
`

const DateVerified = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.textMuted};
`

const VerifiedTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const CardBody = styled.div`
  padding: ${({ theme }) => theme.spacing['6']};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['4']};
  flex: 1;
`

const CertTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.02em;
  line-height: 1.2;
`

const CredentialMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
`

const CredentialId = styled.span`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.65rem;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.2rem 0.5rem;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textMuted};
`

const SkillsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing['2']};
  margin-top: auto;
`

const CardFooter = styled.div`
  padding: ${({ theme }) => theme.spacing['4']} ${({ theme }) => theme.spacing['6']};
  border-top: 3px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const VerifyBtn = styled(motion.a)<{ $accentBg: string; $accentFg: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.45rem 0.9rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  cursor: pointer;
  box-shadow: 2px 2px 0 ${({ theme }) => theme.colors.border};
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.1s ease, color 0.1s ease;

  &:hover {
    background: ${({ $accentBg }) => $accentBg};
    color: ${({ $accentFg }) => $accentFg};
    transform: translate(-2px, -2px);
    box-shadow: 4px 4px 0 ${({ theme }) => theme.colors.border};
  }

  &:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 ${({ theme }) => theme.colors.border};
  }

  svg {
    font-size: 0.85rem;
  }
`

/* ─── Individual Certificate Item ─── */
function CertificateCard({ cert, index }: { cert: Certificate; index: number }) {
  const { isMonoTheme, accent } = useAccent()
  const bg = isMonoTheme ? accent.primary   : CARD_ACCENTS[index % CARD_ACCENTS.length]
  const fg = isMonoTheme ? accent.textColor : CARD_TEXT[index % CARD_TEXT.length]

  return (
    <CertCard variants={staggerItem}>
      <CardTop>
        <IssuerBadge $bg={bg} $fg={fg}>
          <FiAward /> {cert.issuer}
        </IssuerBadge>
        <DateVerified>
          <span>{cert.issueDate}</span>
          <VerifiedTag>
            <FiCheckCircle /> Verified
          </VerifiedTag>
        </DateVerified>
      </CardTop>

      <CardBody>
        <CertTitle>{cert.title}</CertTitle>

        {cert.credentialId && (
          <CredentialMeta>
            <CredentialId>
              <FiShield style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              ID: {cert.credentialId}
            </CredentialId>
          </CredentialMeta>
        )}

        <SkillsWrap>
          {cert.skills.map(s => (
            <Tag key={s}>{s}</Tag>
          ))}
        </SkillsWrap>
      </CardBody>

      {cert.credentialUrl && (
        <CardFooter>
          <VerifyBtn
            href={cert.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Verify ${cert.title} credential`}
            $accentBg={bg}
            $accentFg={fg}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={popSpring}>
            Verify Credential <FiExternalLink />
          </VerifyBtn>
        </CardFooter>
      )}
    </CertCard>
  )
}

export default function Certificates() {
  const { certificates } = usePublicData()
  const certList = certificates && certificates.length > 0 ? certificates : staticCertificates
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <Section id="certificates">
      <Container>
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}>
          <SectionHeader>
            <SectionEyebrow>Credentials & Licenses</SectionEyebrow>
            <SectionTitle>Certified Skills.</SectionTitle>
            <SectionSubtitle>
              Industry certifications and technical credentials validating full-stack engineering proficiency.
            </SectionSubtitle>
          </SectionHeader>
        </motion.div>

        <CertificatesGrid
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}>
          {certList.map((cert, i) => (
            <CertificateCard key={cert.id} cert={cert} index={i} />
          ))}
        </CertificatesGrid>
      </Container>
    </Section>
  )
}

