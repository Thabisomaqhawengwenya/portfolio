import { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMail, FiCheckCircle, FiTrash2,
  FiCalendar, FiAtSign, FiArrowRight,
  FiCheckSquare, FiDelete, FiSearch,
} from 'react-icons/fi'
import { useAdmin } from '../context/AdminContext'
import type { Message } from '../context/AdminContext'

const PageTitle = styled.h1`font-family:${({theme})=>theme.typography.fontDisplay};font-size:${({theme})=>theme.typography.sizes['2xl']};font-weight:700;color:${({theme})=>theme.colors.text};letter-spacing:-0.03em;margin-bottom:0.5rem;`
const PageSub = styled.p`font-family:${({theme})=>theme.typography.fontMono};font-size:${({theme})=>theme.typography.sizes.xs};color:${({theme})=>theme.colors.textFaint};text-transform:uppercase;letter-spacing:0.1em;margin-bottom:1.5rem;`
const Toolbar = styled.div`display:flex;align-items:center;justify-content:space-between;gap:0.75rem;margin-bottom:1.25rem;flex-wrap:wrap;`
const ToolbarLeft = styled.div`display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;flex:1;`
const SearchWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.border};
  padding: 0.4rem 0.75rem;
  min-width: 260px;

  svg { color: ${({ theme }) => theme.colors.textFaint}; flex-shrink: 0; }
`
const SearchInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  font-family: ${({ theme }) => theme.typography.fontBody};
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.text};
  width: 100%;
  &::placeholder { color: ${({ theme }) => theme.colors.textFaint}; }
`
const FilterTabs = styled.div`
  display: flex;
  gap: 0.25rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  padding: 2px;
`
const FilterTab = styled.button<{ $active: boolean }>`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.35rem 0.65rem;
  border: none;
  background: ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active }) => $active ? '#000' : 'inherit'};
  cursor: pointer;
  transition: all 0.1s;
`
const BulkBtn = styled(motion.button)<{$danger?:boolean}>`display:flex;align-items:center;gap:0.4rem;font-family:${({theme})=>theme.typography.fontMono};font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;padding:0.4rem 0.875rem;border:2px solid ${({theme})=>theme.colors.border};cursor:pointer;background:${({$danger,theme})=>$danger?theme.colors.error:theme.colors.primary};color:${({$danger})=>$danger?'#fff':'#000'};&:hover{opacity:0.85;}`
const MsgList = styled.div`border:3px solid ${({theme})=>theme.colors.border};box-shadow:${({theme})=>theme.shadows.md};`
const MsgCard = styled(motion.div)<{$unread:boolean}>`border-bottom:3px solid ${({theme})=>theme.colors.border};background:${({$unread,theme})=>$unread?theme.colors.surfaceAlt:theme.colors.surface};&:last-child{border-bottom:none;}`
const MsgHeader = styled.div`display:flex;align-items:center;gap:1rem;padding:0.875rem 1.25rem;border-bottom:1px solid ${({theme})=>theme.colors.borderSubtle};flex-wrap:wrap;`
const UnreadDot = styled.div<{$unread:boolean}>`width:9px;height:9px;border-radius:50%;background:${({$unread,theme})=>$unread?theme.colors.primary:'transparent'};border:2px solid ${({$unread,theme})=>$unread?theme.colors.primary:theme.colors.borderSubtle};flex-shrink:0;`
const Sender = styled.span`font-family:${({theme})=>theme.typography.fontBody};font-size:${({theme})=>theme.typography.sizes.sm};font-weight:700;color:${({theme})=>theme.colors.text};`
const MetaItem = styled.span`display:flex;align-items:center;gap:0.3rem;font-family:${({theme})=>theme.typography.fontMono};font-size:0.65rem;font-weight:700;color:${({theme})=>theme.colors.textFaint};text-transform:uppercase;letter-spacing:0.08em;`
const MsgActions = styled.div`display:flex;gap:0.5rem;margin-left:auto;`
const IconBtn = styled(motion.button)<{$danger?:boolean;$primary?:boolean}>`width:30px;height:30px;display:flex;align-items:center;justify-content:center;background:${({$danger,$primary,theme})=>$danger?theme.colors.error:$primary?theme.colors.primary:theme.colors.surfaceAlt};border:2px solid ${({theme})=>theme.colors.border};color:${({$danger,$primary})=>($danger||$primary)?'#000':'inherit'};cursor:pointer;font-size:0.8rem;transition:opacity 0.1s;&:hover{opacity:0.8;}`
const ReplyBtn = styled(motion.a)`display:flex;align-items:center;gap:0.4rem;font-family:${({theme})=>theme.typography.fontMono};font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${({theme})=>theme.colors.primary};text-decoration:none;padding:0.25rem 0.625rem;border:1.5px solid ${({theme})=>theme.colors.primary};&:hover{background:${({theme})=>theme.colors.primary};color:#000;}`
const MsgBody = styled.div`padding:1rem 1.25rem;`
const MsgText = styled.p`font-size:${({theme})=>theme.typography.sizes.sm};color:${({theme})=>theme.colors.textMuted};line-height:1.7;font-weight:500;white-space:pre-wrap;`
const EmptyState = styled.div`padding:3rem;text-align:center;background:${({theme})=>theme.colors.surface};`
const EmptyIcon = styled.div`font-size:2.5rem;margin-bottom:0.75rem;opacity:0.3;`
const EmptyText = styled.p`font-family:${({theme})=>theme.typography.fontMono};font-size:${({theme})=>theme.typography.sizes.sm};color:${({theme})=>theme.colors.textFaint};text-transform:uppercase;letter-spacing:0.08em;`
const UnreadBadge = styled.span`font-family:'Space Mono',monospace;font-size:0.65rem;background:#FF3C2F;color:#fff;padding:0.1rem 0.45rem;border:1.5px solid #fff;vertical-align:middle;margin-left:0.625rem;`

export default function AdminMessages() {
  const { messages, markRead, deleteMessage, markAllRead, deleteReadMessages } = useAdmin()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  const unread = messages.filter(m => !m.read).length

  const filtered = messages.filter(m => {
    if (filter === 'unread' && m.read) return false
    if (filter === 'read' && !m.read) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    )
  })

  return (
    <div>
      <PageTitle>Messages{unread>0&&<UnreadBadge>{unread} unread</UnreadBadge>}</PageTitle>
      <PageSub>Contact form submissions from your portfolio.</PageSub>

      {messages.length > 0 && (
        <Toolbar>
          <ToolbarLeft>
            <SearchWrap>
              <FiSearch size={14} />
              <SearchInput
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search sender, email, message..."
              />
            </SearchWrap>

            <FilterTabs>
              <FilterTab $active={filter === 'all'} onClick={() => setFilter('all')}>
                All ({messages.length})
              </FilterTab>
              <FilterTab $active={filter === 'unread'} onClick={() => setFilter('unread')}>
                Unread ({unread})
              </FilterTab>
              <FilterTab $active={filter === 'read'} onClick={() => setFilter('read')}>
                Read ({messages.length - unread})
              </FilterTab>
            </FilterTabs>
          </ToolbarLeft>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <BulkBtn onClick={markAllRead} whileTap={{scale:0.95}}>
              <FiCheckSquare size={12}/> Mark all read
            </BulkBtn>
            <BulkBtn $danger onClick={deleteReadMessages} whileTap={{scale:0.95}}>
              <FiDelete size={12}/> Delete read
            </BulkBtn>
          </div>
        </Toolbar>
      )}

      <MsgList>
        {filtered.length === 0 ? (
          <EmptyState>
            <EmptyIcon><FiMail/></EmptyIcon>
            <EmptyText>{messages.length === 0 ? 'No messages yet' : 'No matching messages found'}</EmptyText>
          </EmptyState>
        ) : (
          <AnimatePresence>
            {filtered.map((m: Message, i: number) => (
              <MsgCard key={m.id} $unread={!m.read}
                initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:16}}
                transition={{delay:i*0.04}}>
                <MsgHeader>
                  <UnreadDot $unread={!m.read}/>
                  <Sender>{m.name}</Sender>
                  <MetaItem><FiAtSign size={10}/>{m.email}</MetaItem>
                  <MetaItem><FiCalendar size={10}/>
                    {new Date(m.date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}
                  </MetaItem>
                  <MsgActions>
                    {/* Direct 1-Click Mailto Reply */}
                    <ReplyBtn
                      href={`mailto:${m.email}?subject=Re:%20Portfolio%20Inquiry%20-%20Maqhawe%20Ngwenya&body=Hi%20${encodeURIComponent(m.name)},%0A%0AThank%20you%20for%20reaching%20out%20via%20my%20portfolio.%0A%0A%3E%20${encodeURIComponent(m.message)}%0A%0A`}
                      whileHover={{scale:1.05}}>
                      <FiArrowRight size={10}/> Reply
                    </ReplyBtn>
                    {!m.read&&(
                      <IconBtn $primary onClick={()=>markRead(m.id)} title="Mark as read"
                        whileHover={{scale:1.1}} whileTap={{scale:0.9}}>
                        <FiCheckCircle size={13}/>
                      </IconBtn>
                    )}
                    <IconBtn $danger onClick={()=>deleteMessage(m.id)} title="Delete"
                      whileHover={{scale:1.1}} whileTap={{scale:0.9}}>
                      <FiTrash2 size={13}/>
                    </IconBtn>
                  </MsgActions>
                </MsgHeader>
                <MsgBody><MsgText>{m.message}</MsgText></MsgBody>
              </MsgCard>
            ))}
          </AnimatePresence>
        )}
      </MsgList>
    </div>
  )
}

