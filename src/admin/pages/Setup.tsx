import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiAlertCircle, FiArrowRight } from 'react-icons/fi'
import { createAdminUser } from '../../firebase/authService'

/* ─── This page creates the admin Firebase user ONE TIME.
       Once created, navigate to /admin/login and use those credentials.
       You can remove this route from App.tsx after setup. ─── */

const Page = styled.div`
  min-height: 100svh;
  background: #0d0d0d;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`

const Card = styled(motion.div)`
  width: 100%;
  max-width: 460px;
  background: #141414;
  border: 3px solid #fff;
  box-shadow: 7px 7px 0 #fff;
`

const CardHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 3px solid #fff;
  background: #FFE500;
`

const Title = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #000;
  letter-spacing: -0.02em;
`

const Sub = styled.p`
  font-family: 'Space Mono', monospace;
  font-size: 0.65rem;
  font-weight: 700;
  color: #000;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.6;
  margin-top: 0.25rem;
`

const Body = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`

const Label = styled.label`
  font-family: 'Space Mono', monospace;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #888;
`

const Input = styled.input`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9375rem;
  color: #f0f0f0;
  background: #0d0d0d;
  border: 2px solid #fff;
  padding: 0.65rem 1rem;
  outline: none;
  width: 100%;
  &::placeholder { color: #444; }
  &:focus { box-shadow: 5px 5px 0 #fff; }
`

const Btn = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #000;
  background: #FFE500;
  padding: 0.8rem;
  border: 3px solid #fff;
  cursor: pointer;
  width: 100%;
  box-shadow: 5px 5px 0 #fff;
  &:hover { box-shadow: 7px 7px 0 #fff; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

const Msg = styled(motion.div)<{ $success?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-family: 'Space Mono', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.75rem 1rem;
  border: 2px solid ${({ $success }) => $success ? '#00C853' : '#FF3C2F'};
  color: ${({ $success }) => $success ? '#00C853' : '#FF3C2F'};
  background: ${({ $success }) => $success ? '#001a0a' : '#1a0000'};
  line-height: 1.5;
`

const Warning = styled.p`
  font-family: 'Space Mono', monospace;
  font-size: 0.65rem;
  color: #555;
  text-align: center;
  line-height: 1.6;
`

export default function Setup() {
  const navigate = useNavigate()
  const [email,   setEmail]   = useState('thabisomaqhawengwenya@gmail.com')
  const [pw,      setPw]      = useState('maqhawe06')
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)
  const [error,   setError]   = useState('')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await createAdminUser(email.trim(), pw)
      setDone(true)
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      if (code === 'auth/email-already-in-use') {
        setError('User already exists — go to /admin/login and sign in.')
      } else if (code === 'auth/operation-not-allowed') {
        setError('Email/Password sign-in is disabled in Firebase Console. Enable it first under Authentication → Sign-in method.')
      } else {
        setError(`Error: ${code || String(err)}`)
      }
    }
    setLoading(false)
  }

  return (
    <Page>
      <Card initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
        <CardHeader>
          <Title>One-Time Setup</Title>
          <Sub>Create admin Firebase user</Sub>
        </CardHeader>

        <Body>
          {!done ? (
            <form onSubmit={handleCreate} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <Field>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </Field>
              <Field>
                <Label>Password</Label>
                <Input type="password" value={pw} onChange={e => setPw(e.target.value)} />
              </Field>

              {error && (
                <Msg initial={{ opacity:0 }} animate={{ opacity:1 }}>
                  <FiAlertCircle style={{ flexShrink:0, marginTop:2 }} /> {error}
                </Msg>
              )}

              <Btn type="submit" disabled={loading} whileTap={{ scale:0.97 }}>
                {loading ? 'Creating…' : <> Create Admin User <FiArrowRight /> </>}
              </Btn>
            </form>
          ) : (
            <>
              <Msg $success initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}>
                <FiCheckCircle style={{ flexShrink:0, marginTop:2 }} />
                <span>
                  Admin user created successfully!<br />
                  Email: <strong>{email}</strong><br />
                  You can now sign in at /admin/login.
                </span>
              </Msg>
              <Btn onClick={() => navigate('/admin/login')} whileTap={{ scale:0.97 }}>
                Go to Login <FiArrowRight />
              </Btn>
            </>
          )}

          <Warning>
            ⚠ Visit this page once, create the user, then remove the /admin/setup route from App.tsx.
          </Warning>
        </Body>
      </Card>
    </Page>
  )
}
