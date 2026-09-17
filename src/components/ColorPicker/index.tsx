import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown, FiCheck } from 'react-icons/fi'
import { ACCENT_OPTIONS, useAccent } from '../../styles/ThemeContext'
import type { AccentOption } from '../../styles/ThemeContext'

/* ──────────────────────────────────────────────
   NEO-BRUTALIST THEME DROPDOWN
   Instant, crisp, high-contrast theme picker.
────────────────────────────────────────────── */

const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
`

const TriggerBtn = styled(motion.button)<{ $isOpen: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.4rem 0.75rem;
  border: 2.5px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ $isOpen, theme }) =>
    $isOpen ? `1px 1px 0px ${theme.colors.border}` : `3px 3px 0px ${theme.colors.border}`};
  transform: ${({ $isOpen }) => ($isOpen ? 'translate(2px, 2px)' : 'none')};
  cursor: pointer;
  user-select: none;
  transition: background 0.1s ease, color 0.1s ease, box-shadow 0.1s ease, transform 0.1s ease;

  &:hover {
    transform: translate(-1px, -1px);
    box-shadow: 4px 4px 0px ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.surfaceAlt};
  }

  &:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px ${({ theme }) => theme.colors.border};
  }
`

const SwatchPreview = styled.span<{ $color: string }>`
  width: 14px;
  height: 14px;
  background: ${({ $color }) => $color};
  border: 2px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
  display: inline-block;
`

const ChevronIcon = styled(motion.span)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  margin-left: 0.15rem;
`

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 170px;
  background: ${({ theme }) => theme.colors.surface};
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: 5px 5px 0px ${({ theme }) => theme.colors.border};
  z-index: 500;
  padding: 0.35rem 0;
  display: flex;
  flex-direction: column;
`

const DropdownItem = styled(motion.button)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.55rem 0.85rem;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.surfaceAlt : 'transparent'};
  color: ${({ theme }) => theme.colors.text};
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: ${({ $active }) => ($active ? 700 : 600)};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: background 0.08s ease, color 0.08s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.accentText ?? theme.colors.text};
  }
`

const ItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`

const ItemSwatch = styled.span<{ $color: string }>`
  width: 14px;
  height: 14px;
  background: ${({ $color }) => $color};
  border: 2px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
`

const CheckIcon = styled.span`
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  font-weight: 700;
`

interface ColorPickerProps {
  mobile?: boolean
}

export default function ColorPicker({ mobile = false }: ColorPickerProps) {
  const { accent, setAccent } = useAccent()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleSelect = (opt: AccentOption) => {
    setAccent(opt)
    setIsOpen(false)
  }

  const activeColor = accent.label === 'Black' ? '#111111' : accent.primary

  return (
    <DropdownWrapper ref={dropdownRef}>
      <TriggerBtn
        type="button"
        $isOpen={isOpen}
        onClick={() => setIsOpen(v => !v)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`Current Theme: ${accent.label}. Click to choose a theme.`}
      >
        <SwatchPreview $color={activeColor} />
        <span>{accent.label}</span>
        <ChevronIcon
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.15 }}
        >
          <FiChevronDown />
        </ChevronIcon>
      </TriggerBtn>

      <AnimatePresence>
        {isOpen && (
          <DropdownMenu
            role="menu"
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.1 }}
            style={{ width: mobile ? '100%' : 'auto' }}
          >
            {ACCENT_OPTIONS.map((opt: AccentOption) => {
              const isSelected = accent.label === opt.label
              const itemColor = opt.label === 'Black' ? '#111111' : opt.primary

              return (
                <DropdownItem
                  key={opt.label}
                  type="button"
                  role="menuitem"
                  $active={isSelected}
                  onClick={() => handleSelect(opt)}
                >
                  <ItemLeft>
                    <ItemSwatch $color={itemColor} />
                    <span>{opt.label}</span>
                  </ItemLeft>
                  {isSelected && (
                    <CheckIcon>
                      <FiCheck />
                    </CheckIcon>
                  )}
                </DropdownItem>
              )
            })}
          </DropdownMenu>
        )}
      </AnimatePresence>
    </DropdownWrapper>
  )
}
