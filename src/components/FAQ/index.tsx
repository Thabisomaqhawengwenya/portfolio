import { useState, useRef } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { FiChevronDown, FiHelpCircle } from 'react-icons/fi'
import {
  Container,
  Section,
  SectionHeader,
  SectionEyebrow,
  SectionTitle,
  SectionSubtitle,
} from '../UI'
import { fadeUp, staggerContainer, staggerItem } from '../../styles/animations'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'bio',
    category: 'About Me',
    question: 'Who is Maqhawe Thabiso Ngwenya?',
    answer:
      'I am a Zimbabwean Front-End Software Developer based in Bulawayo, Zimbabwe. An alumnus of Uncommon.org, I build performant, accessible web applications and modern user interfaces utilizing React, TypeScript, Node.js, Express, PostgreSQL, and Cloud Firestore.',
  },
  {
    id: 'services',
    category: 'Engineering Services',
    question: 'What engineering services and technical expertise do you provide?',
    answer:
      'I deliver high-performance front-end and web engineering: responsive user interfaces (React, TypeScript, styled-components, Tailwind), modern component systems, RESTful API integrations (Node.js, Express, Prisma), database querying (PostgreSQL, Cloud Firestore), performance optimization, and SEO-first web architecture.',
  },
  {
    id: 'availability',
    category: 'Career & Hiring',
    question: 'Are you available for full-time remote roles or freelance contracts?',
    answer:
      'Yes. I am actively available for global remote full-time front-end software developer opportunities, long-term contracts, and high-impact freelance projects. I have extensive experience collaborating asynchronously and shipping production code with distributed teams.',
  },
  {
    id: 'tech-stack',
    category: 'Technical Stack',
    question: 'What technologies and frameworks make up your primary stack?',
    answer:
      'My primary stack centers on React 19, TypeScript, Vite, and modern styling architectures. On the backend, I leverage Node.js, Express, and PostgreSQL with Prisma ORM, alongside Firebase and Google Cloud Firestore for real-time applications.',
  },
  {
    id: 'location-contact',
    category: 'Collaboration',
    question: 'Where are you based and what time zones do you support?',
    answer:
      'I am based in Bulawayo, Zimbabwe (CAT / UTC+2), which provides natural working-hour overlap with European, African, and North American engineering teams. You can reach out directly through the contact section below, via LinkedIn, or by emailing me directly.',
  },
]

/* ─── Styled Components ─── */
const FAQList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['4']};
  max-width: 900px;
  margin: 0 auto;
`

const AccordionCard = styled(motion.div)<{ $isOpen: boolean }>`
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme, $isOpen }) => ($isOpen ? theme.shadows.lg : theme.shadows.md)};
  background: ${({ theme, $isOpen }) => ($isOpen ? theme.colors.surfaceAlt : theme.colors.surface)};
  transition: box-shadow 0.2s cubic-bezier(0.23, 1, 0.32, 1), background 0.15s ease;
  overflow: hidden;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      box-shadow: ${({ theme }) => theme.shadows.xl};
    }
  }
`

const AccordionButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing['4']};
  padding: ${({ theme }) => theme.spacing['6']};
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  outline: none;

  &:active {
    transform: scale(0.995);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.text};
    outline-offset: -3px;
  }
`

const QuestionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing['2']};
`

const CategoryBadge = styled.span`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.accentText ?? theme.colors.text};
  background: ${({ theme }) => theme.colors.primary};
  padding: 0.15rem 0.5rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  width: fit-content;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

const QuestionText = styled.h3`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: clamp(1.05rem, 2vw, 1.25rem);
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  line-height: ${({ theme }) => theme.typography.lineHeights.snug};
`

const IconBox = styled(motion.div)<{ $isOpen: boolean }>`
  width: 36px;
  height: 36px;
  min-width: 36px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme, $isOpen }) => ($isOpen ? theme.colors.primary : theme.colors.surface)};
  color: ${({ theme, $isOpen }) => ($isOpen ? theme.accentText ?? theme.colors.text : theme.colors.text)};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 2px 2px 0 ${({ theme }) => theme.colors.border};
  transition: background 0.15s ease, color 0.15s ease;

  svg {
    transition: transform 0.25s cubic-bezier(0.23, 1, 0.32, 1);
    transform: rotate(${({ $isOpen }) => ($isOpen ? '180deg' : '0deg')});
  }
`

const AnswerWrapper = styled(motion.div)`
  overflow: hidden;
`

const AnswerContent = styled.div`
  padding: 0 ${({ theme }) => theme.spacing['6']} ${({ theme }) => theme.spacing['6']};
  border-top: 2px dashed ${({ theme }) => theme.colors.borderSubtle};
  padding-top: ${({ theme }) => theme.spacing['4']};

  p {
    font-size: ${({ theme }) => theme.typography.sizes.base};
    line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: ${({ theme }) => theme.typography.weights.medium};
  }
`

/* ─── Main FAQ Component ─── */
export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>('bio')
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <Section id="faq">
      <Container>
        <motion.div
          ref={ref}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <SectionHeader style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 3rem auto' }}>
            <SectionEyebrow style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <FiHelpCircle aria-hidden="true" />
              Frequently Asked Questions
            </SectionEyebrow>
            <SectionTitle>Clear answers on background, capabilities & availability.</SectionTitle>
            <SectionSubtitle style={{ margin: '0.75rem auto 0 auto' }}>
              Everything hiring managers, recruiters, and engineering partners want to know before reaching out.
            </SectionSubtitle>
          </SectionHeader>
        </motion.div>

        <FAQList
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {FAQ_DATA.map((item) => {
            const isOpen = openId === item.id
            return (
              <AccordionCard
                key={item.id}
                variants={staggerItem}
                $isOpen={isOpen}
              >
                <AccordionButton
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  id={`faq-question-${item.id}`}
                >
                  <QuestionInfo>
                    <CategoryBadge>{item.category}</CategoryBadge>
                    <QuestionText>{item.question}</QuestionText>
                  </QuestionInfo>
                  <IconBox $isOpen={isOpen} aria-hidden="true">
                    <FiChevronDown />
                  </IconBox>
                </AccordionButton>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <AnswerWrapper
                      id={`faq-answer-${item.id}`}
                      role="region"
                      aria-labelledby={`faq-question-${item.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <AnswerContent>
                        <p>{item.answer}</p>
                      </AnswerContent>
                    </AnswerWrapper>
                  )}
                </AnimatePresence>
              </AccordionCard>
            )
          })}
        </FAQList>
      </Container>
    </Section>
  )
}
