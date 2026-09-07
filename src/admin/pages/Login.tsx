import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FiLock, FiArrowRight, FiAlertCircle } from 'react-icons/fi'
import { useAdmin } from '../context/AdminContext'

const Page = styled.div`
  min-height: 100svh;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`

const Card = styled(motion.div)`
  width: 100%;
  max-width: 400px;
  background: ${({ theme }) => theme.colors.surface};
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.primary};
`

const Title = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  font-weight: 700;
  color: #000;
  letter-spacing: -0.03em;
  line-height: 1;
`

const Subtitle = styled.p`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: 700;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 0.35rem;
  opacity: 0.7;
`

const CardBody = styled.div`
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 0.4rem;
`

const Input = styled.input`
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.base};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  border: 3px solid ${({ theme }) => theme.colors.border};
  padding: 0.7rem 1rem;
  outline: none;
  width: 100%;
  transition: box-shadow 0.15s ease;

  &::placeholder { color: ${({ theme }) => theme.colors.textFaint}; }
  &:focus { box-shadow: ${({ theme }) => theme.shadows.md}; }
`

const SubmitBtn = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #000;
  background: ${({ theme }) => theme.colors.primary};
  padding: 0.8rem;
  border: 3px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: box-shadow 0.1s ease;
  width: 100%;

  &:hover { box-shadow: ${({ theme }) => theme.shadows.lg}; }
  &:active { box-shadow: none; transform: translate(2px,2px); }
`

const ErrorMsg = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.error};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 2px solid ${({ theme }) => theme.colors.error};
  padding: 0.6rem 0.875rem;
`

const Hint = styled.p`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.65rem;
  color: ${({ theme }) => theme.colors.textFaint};
  text-align: center;
  letter-spacing: 0.06em;
`

export default function Login() {
  const { isAuthed, login } = useAdmin()
  const navigate = useNavigate()
  const [pw,    setPw]    = useState('')
  const [error, setError] = useState('')

  if (isAuthed) return <Navigate to="/admin" replace />

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(pw)) {
      navigate('/admin')
    } else {
      setError('Incorrect password. Try again.')
      setPw('')
    }
  }

  return (
    <Page>
      <Card
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}>

        <CardHeader>
          <Title>Admin Access</Title>
          <Subtitle>Maqhawe Ngwenya — Portfolio CMS</Subtitle>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
            <Field>
              <Label><FiLock /> Password</Label>
              <Input
                type="password"
                placeholder="Enter admin password"
                value={pw}
                onChange={e => { setPw(e.target.value); setError('') }}
                autoFocus
                autoComplete="current-password"
              />
            </Field>

            {error && (
              <ErrorMsg
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}>
                <FiAlertCircle /> {error}
              </ErrorMsg>
            )}

            <SubmitBtn type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              Sign In <FiArrowRight />
            </SubmitBtn>
          </form>

          <Hint>Default password: admin2026 — change in AdminContext.tsx</Hint>
        </CardBody>
      </Card>
    </Page>
  )
}
