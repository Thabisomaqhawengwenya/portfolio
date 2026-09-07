import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMail, FiCheckCircle, FiTrash2, FiCalendar, FiAtSign } from 'react-icons/fi'
import { useAdmin } from '../context/AdminContext'
import type { Message } from '../context/AdminContext'

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.fontDisplay};
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.03em;
  margin-bottom: 0.5rem;
`

const PageSub = styled.p`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.textFaint};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1.75rem;
`

const MsgList = styled.div`
  border: 3px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.md};
`

const MsgCard = styled(motion.div)<{ $unread: boolean }>`
  border-bottom: 3px solid ${({ theme }) => theme.colors.border};
  background: ${({ $unread, theme }) => $unread ? theme.colors.surfaceAlt : theme.colors.surface};

  &:last-child { border-bottom: none; }
`

const MsgHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderSubtle};
  flex-wrap: wrap;
`

const UnreadDot = styled.div<{ $unread: boolean }>`
  width: 9px; height: 9px;
  border-radius: 50%;
  background: ${({ $unread, theme }) => $unread ? theme.colors.primary : 'transparent'};
  border: 2px solid ${({ $unread, theme }) => $unread ? theme.colors.primary : theme.colors.borderSubtle};
  flex-shrink: 0;
`

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.65rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textFaint};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

const Sender = styled.span`
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
`

const IconBtn = styled(motion.button)<{ $danger?: boolean; $primary?: boolean }>`
  width: 30px; height: 30px;
  display: flex; align-items: center; justify-content: center;
  background: ${({ $danger, $primary, theme }) =>
    $danger ? theme.colors.error : $primary ? theme.colors.primary : theme.colors.surfaceAlt};
  border: 2px solid ${({ theme }) => theme.colors.border};
  color: ${({ $danger, $primary }) => ($danger || $primary) ? '#000' : 'inherit'};
  cursor: pointer; font-size: 0.8rem;
  transition: opacity 0.1s;
  &:hover { opacity: 0.8; }
`

const MsgBody = styled.div`
  padding: 1rem 1.25rem;
`

const MsgText = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.7;
  font-weight: 500;
  white-space: pre-wrap;
`

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  background: ${({ theme }) => theme.colors.surface};
`

const EmptyIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  opacity: 0.3;
`

const EmptyText = styled.p`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.textFaint};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

export default function AdminMessages() {
  const { messages, markRead, deleteMessage } = useAdmin()

  const unread = messages.filter(m => !m.read).length

  return (
    <div>
      <PageTitle>
        Messages
        {unread > 0 && (
          <span style={{
            marginLeft: '0.75rem',
            verticalAlign: 'middle',
            fontFamily: 'Space Mono',
            fontSize: '0.75rem',
            background: '#FF3C2F',
            color: '#fff',
            padding: '0.1rem 0.5rem',
            border: '2px solid #fff',
          }}>
            {unread} unread
          </span>
        )}
      </PageTitle>
      <PageSub>Contact form submissions from your portfolio.</PageSub>

      <MsgList>
        {messages.length === 0 ? (
          <EmptyState>
            <EmptyIcon><FiMail /></EmptyIcon>
            <EmptyText>No messages yet</EmptyText>
          </EmptyState>
        ) : (
          <AnimatePresence>
            {messages.map((m: Message, i: number) => (
              <MsgCard key={m.id} $unread={!m.read}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ delay: i * 0.05 }}>

                <MsgHeader>
                  <UnreadDot $unread={!m.read} />
                  <Sender>{m.name}</Sender>
                  <MetaItem><FiAtSign size={10} />{m.email}</MetaItem>
                  <MetaItem><FiCalendar size={10} />
                    {new Date(m.date).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}
                  </MetaItem>
                  <Actions>
                    {!m.read && (
                      <IconBtn $primary onClick={() => markRead(m.id)} title="Mark as read"
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <FiCheckCircle size={13} />
                      </IconBtn>
                    )}
                    <IconBtn $danger onClick={() => deleteMessage(m.id)} title="Delete"
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <FiTrash2 size={13} />
                    </IconBtn>
                  </Actions>
                </MsgHeader>

                <MsgBody>
                  <MsgText>{m.message}</MsgText>
                </MsgBody>
              </MsgCard>
            ))}
          </AnimatePresence>
        )}
      </MsgList>
    </div>
  )
}
