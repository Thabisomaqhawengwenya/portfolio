import styled from 'styled-components'
import { motion } from 'framer-motion'
import { ACCENT_OPTIONS, useAccent } from '../../styles/ThemeContext'
import type { AccentOption } from '../../styles/ThemeContext'
import { popSpring } from '../UI'

/* ──────────────────────────────────────────────
   COLOUR PICKER
   Comic-panel style, neo-brutalism adapted.
   All structural colours come from theme.
────────────────────────────────────────────── */

const Panel = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 3px solid ${({ theme }) => theme.colors.border};
  padding: 0.875rem 1rem;
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: inline-flex;
  flex-direction: column;
  gap: 0.5rem;
  width: fit-content;
  transition: background 0.3s ease, border-color 0.3s ease;
`

const PanelLabel = styled.p`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${({ theme }) => theme.colors.textFaint};
`

const SwatchRow = styled.div`
  display: flex;
  gap: 0;
  transform-style: preserve-3d;
  transform: perspective(1000px);
`

/* Each swatch — the ::after face and ::before tooltip use CSS vars
   so they can respond to the current theme border colour */
const SwatchBtn = styled(motion.button)<{ $color: string; $active: boolean }>`
  position: relative;
  width: 40px;
  height: 48px;
  background: transparent;
  border: none;
  outline: none;
  margin: 0 -4px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform 300ms ease-out;
  z-index: ${({ $active }) => $active ? 10 : 1};

  /* Coloured swatch face */
  &::after {
    content: '';
    position: absolute;
    top: 4px;
    left: 0;
    width: 36px;
    height: 36px;
    background: ${({ $color }) => $color};
    /* Use a specific border so it's always visible regardless of theme */
    border: 3px solid ${({ $active }) => $active ? '#888' : '#000'};
    outline: ${({ $active }) => $active ? '2px solid currentColor' : 'none'};
    outline-offset: 2px;
    box-shadow: ${({ $active }) =>
      $active ? '0 0 0 2px #000, 3px 3px 0 2px #000' : '3px 3px 0 0 #000'};
    pointer-events: none;
    transition: box-shadow 200ms ease, border-color 200ms ease;
  }

  /* Tooltip with colour name */
  &::before {
    content: attr(data-label);
    position: absolute;
    left: 50%;
    bottom: 56px;
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 4px 8px;
    /* Tooltip is always high-contrast regardless of theme */
    background: #000;
    color: #fff;
    border: 2px solid #000;
    pointer-events: none;
    opacity: 0;
    visibility: hidden;
    transform-origin: bottom center;
    transform: translateX(-50%) scale(0.5) translateY(8px);
    transition:
      opacity 200ms ease-out,
      visibility 200ms ease-out,
      transform 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
    white-space: nowrap;
    z-index: 99999;
  }

  &:hover {
    transform: scale(1.5) translateY(-6px);
    z-index: 99999;

    &::before {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) scale(1) translateY(0);
    }
  }

  &:active::after {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 0 #000;
  }

  /* Neighbour ripple */
  &:hover + * > & {
    transform: scale(1.2) translateY(-3px);
    z-index: 9999;
  }
`

const ActiveIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-top: 0.25rem;
`

const ActiveDot = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  background: ${({ $color }) => $color};
  border: 2px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
`

const ActiveLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.textFaint};
`

export default function ColorPicker() {
  const { accent, setAccent } = useAccent()

  return (
    <Panel role="group" aria-label="Choose accent colour">
      <PanelLabel>Theme</PanelLabel>

      <SwatchRow>
        {ACCENT_OPTIONS.map((opt: AccentOption) => (
          <SwatchBtn
            key={opt.label}
            $color={opt.primary}
            $active={accent.label === opt.label}
            data-label={opt.label}
            aria-label={`Set theme to ${opt.label}`}
            aria-pressed={accent.label === opt.label}
            onClick={() => setAccent(opt)}
            whileHover={{ scale: 1.5, y: -6 }}
            whileTap={{ scale: 0.9 }}
            transition={popSpring}
          />
        ))}
      </SwatchRow>

      <ActiveIndicator
        key={accent.label}
        initial={{ opacity: 0, x: -4 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}>
        <ActiveDot $color={accent.primary} />
        <ActiveLabel>{accent.label}</ActiveLabel>
      </ActiveIndicator>
    </Panel>
  )
}
