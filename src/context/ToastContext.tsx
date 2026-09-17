/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import styled, { keyframes } from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheckCircle, FiAlertTriangle, FiInfo, FiLoader, FiX } from 'react-icons/fi'

export type ToastType = 'loading' | 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

interface ToastContextType {
  showToast: (item: Omit<ToastItem, 'id'>) => string
  updateToast: (id: string, updates: Partial<Omit<ToastItem, 'id'>>) => void
  dismissToast: (id: string) => void
  toast: {
    loading: (title: string, description?: string) => string
    success: (title: string, description?: string, duration?: number) => string
    error: (title: string, description?: string, duration?: number) => string
    info: (title: string, description?: string, duration?: number) => string
    dismiss: (id: string) => void
    promise: <T>(
      promise: Promise<T>,
      messages: {
        loading: string
        success: string | ((data: T) => string)
        error: string | ((err: unknown) => string)
      }
    ) => Promise<T>
  }
}

const ToastContext = createContext<ToastContextType | null>(null)

/* ─── Styles ─── */
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const Container = styled.div`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 999999;
  display: flex;
  flex-direction: column-reverse;
  gap: 0.75rem;
  pointer-events: none;
  max-width: 420px;
  width: calc(100vw - 3rem);

  @media (max-width: 640px) {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    width: calc(100vw - 2rem);
  }
`

const ToastCard = styled(motion.div)<{ $type: ToastType }>`
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  background: #141414;
  color: #ffffff;
  border: 2.5px solid ${({ $type }) => {
    switch ($type) {
      case 'success': return '#00E676'
      case 'error':   return '#FF334B'
      case 'loading': return '#FFE500'
      case 'info':    return '#00E5FF'
    }
  }};
  box-shadow: 4px 4px 0 #000000;
  border-radius: 0;
  position: relative;
  overflow: hidden;
`

const IconBox = styled.div<{ $type: ToastType }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.25rem;
  margin-top: 0.1rem;
  color: ${({ $type }) => {
    switch ($type) {
      case 'success': return '#00E676'
      case 'error':   return '#FF334B'
      case 'loading': return '#FFE500'
      case 'info':    return '#00E5FF'
    }
  }};

  .spin-icon {
    animation: ${spin} 1s linear infinite;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
  min-width: 0;
`

const Title = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #ffffff;
  line-height: 1.3;
`

const Description = styled.div`
  font-family: 'Space Mono', monospace;
  font-size: 0.72rem;
  color: #a0a0a0;
  line-height: 1.4;
  word-break: break-word;
`

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: color 0.15s ease;
  flex-shrink: 0;

  &:hover {
    color: #fff;
  }
`

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timersRef = useRef<Record<string, number>>({})

  const dismissToast = useCallback((id: string) => {
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id])
      delete timersRef.current[id]
    }
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const showToast = useCallback((item: Omit<ToastItem, 'id'>): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    const duration = item.duration ?? (item.type === 'loading' ? 0 : item.type === 'error' ? 5000 : 3500)

    const newToast: ToastItem = { ...item, id, duration }
    setToasts(prev => [...prev.filter(t => t.id !== id), newToast])

    if (duration > 0) {
      timersRef.current[id] = window.setTimeout(() => {
        dismissToast(id)
      }, duration)
    }

    return id
  }, [dismissToast])

  const updateToast = useCallback((id: string, updates: Partial<Omit<ToastItem, 'id'>>) => {
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id])
      delete timersRef.current[id]
    }

    setToasts(prev => prev.map(t => {
      if (t.id !== id) return t
      const updated = { ...t, ...updates }
      const dur = updated.duration ?? (updated.type === 'loading' ? 0 : updated.type === 'error' ? 5000 : 3500)
      if (dur > 0) {
        timersRef.current[id] = window.setTimeout(() => {
          dismissToast(id)
        }, dur)
      }
      return updated
    }))
  }, [dismissToast])

  const toastMethods = {
    loading: (title: string, description?: string) =>
      showToast({ type: 'loading', title, description, duration: 0 }),
    success: (title: string, description?: string, duration?: number) =>
      showToast({ type: 'success', title, description, duration }),
    error: (title: string, description?: string, duration?: number) =>
      showToast({ type: 'error', title, description, duration }),
    info: (title: string, description?: string, duration?: number) =>
      showToast({ type: 'info', title, description, duration }),
    dismiss: dismissToast,
    promise: async <T,>(
      promise: Promise<T>,
      messages: {
        loading: string
        success: string | ((data: T) => string)
        error: string | ((err: unknown) => string)
      }
    ): Promise<T> => {
      const id = showToast({ type: 'loading', title: messages.loading, duration: 0 })
      try {
        const result = await promise
        const successMsg = typeof messages.success === 'function' ? messages.success(result) : messages.success
        updateToast(id, { type: 'success', title: successMsg, duration: 3500 })
        return result
      } catch (err: unknown) {
        const errorMsg = typeof messages.error === 'function' ? messages.error(err) : messages.error
        const errDesc = (err as Error)?.message || undefined
        updateToast(id, { type: 'error', title: errorMsg, description: errDesc, duration: 5000 })
        throw err
      }
    },
  }

  const renderIcon = (type: ToastType) => {
    switch (type) {
      case 'loading': return <FiLoader className="spin-icon" />
      case 'success': return <FiCheckCircle />
      case 'error':   return <FiAlertTriangle />
      case 'info':    return <FiInfo />
    }
  }

  return (
    <ToastContext.Provider value={{ showToast, updateToast, dismissToast, toast: toastMethods }}>
      {children}
      <Container>
        <AnimatePresence mode="popLayout">
          {toasts.map(item => (
            <ToastCard
              key={item.id}
              $type={item.type}
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.94 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              layout
            >
              <IconBox $type={item.type}>
                {renderIcon(item.type)}
              </IconBox>
              <Content>
                <Title>{item.title}</Title>
                {item.description && <Description>{item.description}</Description>}
              </Content>
              <CloseBtn onClick={() => dismissToast(item.id)} title="Dismiss">
                <FiX />
              </CloseBtn>
            </ToastCard>
          ))}
        </AnimatePresence>
      </Container>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}
