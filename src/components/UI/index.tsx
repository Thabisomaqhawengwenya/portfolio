import styled, { css } from 'styled-components'
import { motion } from 'framer-motion'

/* ─── Shared spring for pop animations ─── */
export const popSpring = { type: 'spring', stiffness: 400, damping: 17 } as const
export const popHover  = { scale: 1.06, y: -4 } as const
export const popTap    = { scale: 0.93, y: 1  } as const

/* ─── Container ─── */
export const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing['8']};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 ${({ theme }) => theme.spacing['6']};
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 ${({ theme }) => theme.spacing['4']};
  }
`

/* ─── Section wrapper ─── */
export const Section = styled.section`
  padding: ${({ theme }) => theme.spacing['24']} 0;
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing['16']} 0;
  }
`

/* ─── Section header ─── */
export const SectionHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing['12']};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-bottom: ${({ theme }) => theme.spacing['10']};
  }
`

export const SectionEyebrow = styled.p`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacings.wider};
  text-transform: uppercase;
  color: ${({ theme }) => theme.accentText ?? theme.colors.text};
  background: ${({ theme }) => theme.colors.primary};
  display: inline-block;
  padding: 0.2rem 0.6rem;
  margin-bottom: ${({ theme }) => theme.spacing['4']};
  border: 2px solid ${({ theme }) => theme.colors.border};
`

export const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: clamp(2.25rem, 5vw, ${({ theme }) => theme.typography.sizes['4xl']});
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacings.tight};
`

export const SectionSubtitle = styled.p`
  margin-top: ${({ theme }) => theme.spacing['4']};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 540px;
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
`

/* ─── Divider ─── */
export const Divider = styled.hr`
  border: none;
  border-top: 3px solid ${({ theme }) => theme.colors.border};
  margin: 0;
`

/* ──────────────────────────────────────────────
   BUTTON SYSTEM
   All buttons use Framer Motion whileHover/whileTap
   for a spring pop. CSS transition handles shadow/bg.
────────────────────────────────────────────── */
type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize    = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: ButtonVariant
  size?:    ButtonSize
}

const buttonSizes = {
  sm: css`padding: 0.5rem 1.25rem;  font-size: 0.8125rem;`,
  md: css`padding: 0.75rem 1.75rem; font-size: 0.9375rem;`,
  lg: css`padding: 1rem 2.25rem;    font-size: 1rem;`,
}

const buttonBase = css`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing['2']};
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  letter-spacing: 0.02em;
  border-radius: 0;
  cursor: pointer;
  white-space: nowrap;
  text-decoration: none;
  border: 3px solid ${({ theme }) => theme.colors.border};
  /* shadow transition only — scale/translate come from Framer */
  transition: box-shadow 0.12s ease, background 0.12s ease, color 0.12s ease;

  &:active {
    box-shadow: 1px 1px 0 ${({ theme }) => theme.colors.border} !important;
  }
`

export const Button = styled(motion.button).attrs(() => ({
  whileHover: popHover,
  whileTap:   popTap,
  transition: popSpring,
}))<ButtonProps>`
  ${buttonBase}
  ${({ size = 'md' }) => buttonSizes[size]}

  ${({ variant = 'primary', theme }) =>
    variant === 'primary' && css`
      background: ${theme.colors.primary};
      color: ${theme.accentText ?? theme.colors.text};
      box-shadow: ${theme.shadows.md};
      &:hover { box-shadow: ${theme.shadows.hover}; }
    `}

  ${({ variant = 'primary', theme }) =>
    variant === 'secondary' && css`
      background: ${theme.colors.surface};
      color: ${theme.colors.text};
      box-shadow: ${theme.shadows.md};
      &:hover { box-shadow: ${theme.shadows.hover}; }
    `}

  ${({ variant = 'primary', theme }) =>
    variant === 'ghost' && css`
      background: transparent;
      color: ${theme.colors.text};
      border-color: ${theme.colors.text};
      box-shadow: none;
      &:hover {
        background: ${theme.colors.text};
        color: ${theme.colors.background};
        box-shadow: ${theme.shadows.md};
      }
    `}
`

export const ButtonLink = styled(motion.a).attrs(() => ({
  whileHover: popHover,
  whileTap:   popTap,
  transition: popSpring,
}))<ButtonProps>`
  ${buttonBase}
  ${({ size = 'md' }) => buttonSizes[size]}

  ${({ variant = 'primary', theme }) =>
    variant === 'primary' && css`
      background: ${theme.colors.primary};
      color: ${theme.accentText ?? theme.colors.text};
      box-shadow: ${theme.shadows.md};
      &:hover { box-shadow: ${theme.shadows.hover}; }
    `}

  ${({ variant = 'primary', theme }) =>
    variant === 'secondary' && css`
      background: ${theme.colors.surface};
      color: ${theme.colors.text};
      box-shadow: ${theme.shadows.md};
      &:hover { box-shadow: ${theme.shadows.hover}; }
    `}

  ${({ variant = 'primary', theme }) =>
    variant === 'ghost' && css`
      background: transparent;
      color: ${theme.colors.text};
      border-color: ${theme.colors.text};
      box-shadow: none;
      &:hover {
        background: ${theme.colors.text};
        color: ${theme.colors.background};
        box-shadow: ${theme.shadows.md};
      }
    `}
`

/* ──────────────────────────────────────────────
   TAG — pops up and inverts on hover
────────────────────────────────────────────── */
export const Tag = styled(motion.span).attrs(() => ({
  whileHover: { scale: 1.1, y: -3 },
  whileTap:   { scale: 0.95 },
  transition: popSpring,
}))`
  display: inline-flex;
  align-items: center;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 0;
  padding: 0.2rem 0.6rem;
  line-height: 1.4;
  white-space: nowrap;
  cursor: default;
  transition: background 0.1s ease, color 0.1s ease, box-shadow 0.1s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.text};
    color: ${({ theme }) => theme.colors.background};
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`

/* ─── Motion wrappers ─── */
export const MotionDiv = styled(motion.div)``
export const MotionSection = styled(motion.section)``
