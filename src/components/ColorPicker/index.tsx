import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'
import { ACCENT_OPTIONS, useAccent } from '../../styles/ThemeContext'
import type { AccentOption } from '../../styles/ThemeContext'
import { recordThemeChange } from '../../services/analyticsService'

/* ──────────────────────────────────────────────
   NEO-BRUTALIST THEME PICKER (MOON ICON BUTTON)
   Matches reference sky-blue square icon button
   while preserving full 5-theme switching.
────────────────────────────────────────────── */

const DropdownWrapper = styled.div`
  position: relative;
  display: inline-flex;
`

const TriggerBtn = styled(motion.button)<{ $isOpen: boolean; $mobile?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: ${({ $mobile }) => ($mobile ? 'auto' : '42px')};
  height: 42px;
  padding: ${({ $mobile }) => ($mobile ? '0 0.9rem' : '0')};
  background: #62D8F9;
  color: #000000;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: 700;
  border-radius: 6px;
  border: 2.5px solid #000000;
  box-shadow: ${({ $isOpen }) =>
    $isOpen ? '1px 1px 0px #000000' : '3px 3px 0px #000000'};
  transform: ${({ $isOpen }) => ($isOpen ? 'translate(2px, 2px)' : 'none')};
  cursor: pointer;
  user-select: none;
  transition: background 0.12s ease, box-shadow 0.1s ease, transform 0.1s ease;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0px #000000;
    background: #7ce3ff;
  }

  &:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px #000000;
  }
`

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 170px;
  background: ${({ theme }) => theme.colors.surface};
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  box-shadow: 5px 5px 0px ${({ theme }) => theme.colors.border};
  z-index: 500;
  padding: 0.35rem 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  border-radius: 3px;
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
    recordThemeChange(opt.label)
    setIsOpen(false)
  }

  return (
    <DropdownWrapper ref={dropdownRef}>
      <TriggerBtn
        type="button"
        $isOpen={isOpen}
        $mobile={mobile}
        onClick={() => setIsOpen(v => !v)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`Current Theme: ${accent.label}. Click to choose a theme.`}
        title={`Theme: ${accent.label}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
        {mobile && <span>Theme: {accent.label}</span>}
      </TriggerBtn>

      <AnimatePresence>
        {isOpen && (
          <DropdownMenu
            role="menu"
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.1 }}
            style={{ width: mobile ? '100%' : 'auto', left: mobile ? 0 : 'auto' }}
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
