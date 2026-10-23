import { useRef } from 'react'
import styled from 'styled-components'
import { motion, useInView } from 'framer-motion'
import { FiAward, FiExternalLink, FiCheckCircle, FiShield } from 'react-icons/fi'
import {
  Container,
  Section,
  SectionTitle,
  SectionSubtitle,
  SplitSectionHeader,
  SectionIndexRule,
  Tag,
  popSpring,
} from '../UI'
import { fadeUp, staggerContainer, staggerItem } from '../../styles/animations'
import { certificates as staticCertificates } from '../../data/certificates'
import { usePublicData } from '../../styles/PublicDataContext'
import type { Certificate } from '../../types'

/* ─── Styled Components ─── */
const VerifiedCountBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1rem;
  border: 3px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
  font-variant-numeric: tabular-nums;

  svg {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1rem;
  }
`

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
  transition: transform 0.2s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.2s cubic-bezier(0.23, 1, 0.32, 1), background 0.15s ease;
  will-change: transform;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      box-shadow: ${({ theme }) => theme.shadows.xl};
      background: ${({ theme }) => theme.colors.surfaceAlt};
      transform: translate(-3px, -3px);
    }
  }

  &:active {
    transform: translate(1px, 1px);
    box-shadow: 2px 2px 0 ${({ theme }) => theme.colors.border};
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

const IssuerBadge = styled.div<{ $isPrimary: boolean }>`
  background: ${({ $isPrimary, theme }) => ($isPrimary ? theme.colors.primary : theme.colors.text)};
  color: ${({ $isPrimary, theme }) => ($isPrimary ? (theme.accentText ?? theme.colors.text) : theme.colors.background)};
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
  font-variant-numeric: tabular-nums;
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

const VerifyBtn = styled(motion.a)`
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

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.accentText ?? theme.colors.text};
      transform: translate(-2px, -2px);
      box-shadow: 4px 4px 0 ${({ theme }) => theme.colors.border};
    }
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
  const isPrimary = index % 2 === 0

  return (
    <CertCard variants={staggerItem}>
      <CardTop>
        <IssuerBadge $isPrimary={isPrimary}>
          <FiAward aria-hidden="true" /> {cert.issuer}
        </IssuerBadge>
        <DateVerified>
          <span>{cert.issueDate}</span>
          <VerifiedTag>
            <FiCheckCircle aria-hidden="true" /> Verified
          </VerifiedTag>
        </DateVerified>
      </CardTop>

      <CardBody>
        <CertTitle>{cert.title.replace(/\s*—\s*/g, ': ')}</CertTitle>

        {cert.credentialId && (
          <CredentialMeta>
            <CredentialId>
              <FiShield aria-hidden="true" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
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
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={popSpring}>
            Verify Credential <FiExternalLink aria-hidden="true" />
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
          <SplitSectionHeader>
            <div>
              <SectionIndexRule>
                <span className="num">05</span> // CREDENTIALS &amp; LICENSES
              </SectionIndexRule>
              <SectionTitle>Certified Skills.</SectionTitle>
              <SectionSubtitle>
                Industry certifications and technical credentials validating full-stack engineering proficiency.
              </SectionSubtitle>
            </div>
            <VerifiedCountBadge>
              <FiCheckCircle aria-hidden="true" /> {String(certList.length).padStart(2, '0')} Verified Credentials
            </VerifiedCountBadge>
          </SplitSectionHeader>
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
