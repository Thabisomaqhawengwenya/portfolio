import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FiFolder, FiCode, FiMail, FiTrendingUp, FiActivity, FiArrowRight, FiGlobe } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import { analyticsPromise } from '../../firebase/config'

/* ─── Styled ─── */
const PageTitle = styled.h1`font-family:${({theme})=>theme.typography.fontDisplay};font-size:${({theme})=>theme.typography.sizes['3xl']};font-weight:700;color:${({theme})=>theme.colors.text};letter-spacing:-0.03em;margin-bottom:0.5rem;`
const PageSub = styled.p`font-family:${({theme})=>theme.typography.fontMono};font-size:${({theme})=>theme.typography.sizes.xs};color:${({theme})=>theme.colors.textFaint};text-transform:uppercase;letter-spacing:0.1em;margin-bottom:2.5rem;`
const StatsGrid = styled.div`display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:0;border:3px solid ${({theme})=>theme.colors.border};box-shadow:${({theme})=>theme.shadows.md};margin-bottom:2.5rem;`
const StatCard = styled(motion(Link))`display:flex;flex-direction:column;gap:0.5rem;padding:1.5rem;background:${({theme})=>theme.colors.surface};border-right:3px solid ${({theme})=>theme.colors.border};text-decoration:none;transition:background 0.15s;&:last-child{border-right:none;}&:hover{background:${({theme})=>theme.colors.surfaceAlt};}@media(max-width:900px){border-right:none;border-bottom:3px solid ${({theme})=>theme.colors.border};&:last-child{border-bottom:none;}}`
const StatIcon = styled.div<{$color:string}>`width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:${({$color})=>$color};border:2px solid ${({theme})=>theme.colors.border};font-size:1.1rem;color:#000;margin-bottom:0.5rem;`
const StatValue = styled.p`font-family:${({theme})=>theme.typography.fontDisplay};font-size:${({theme})=>theme.typography.sizes['3xl']};font-weight:700;color:${({theme})=>theme.colors.text};letter-spacing:-0.04em;line-height:1;`
const StatLabel = styled.p`font-family:${({theme})=>theme.typography.fontMono};font-size:${({theme})=>theme.typography.sizes.xs};font-weight:700;color:${({theme})=>theme.colors.textFaint};text-transform:uppercase;letter-spacing:0.1em;`
const UnreadBadge = styled.span`font-family:'Space Mono',monospace;font-size:0.65rem;background:#FF3C2F;color:#fff;padding:0.1rem 0.45rem;border:1.5px solid ${({theme})=>theme.colors.border};vertical-align:middle;margin-left:0.5rem;`
const SectionTitle = styled.h2`font-family:${({theme})=>theme.typography.fontDisplay};font-size:${({theme})=>theme.typography.sizes.xl};font-weight:700;color:${({theme})=>theme.colors.text};letter-spacing:-0.02em;margin-bottom:1rem;`
const MsgList = styled.div`border:3px solid ${({theme})=>theme.colors.border};box-shadow:${({theme})=>theme.shadows.sm};`
const MsgRow = styled.div<{$unread:boolean}>`display:grid;grid-template-columns:1fr auto;gap:1rem;padding:1rem 1.25rem;border-bottom:2px solid ${({theme})=>theme.colors.borderSubtle};background:${({$unread,theme})=>$unread?theme.colors.surfaceAlt:theme.colors.surface};&:last-child{border-bottom:none;}`
const MsgName = styled.p`font-family:${({theme})=>theme.typography.fontBody};font-size:${({theme})=>theme.typography.sizes.sm};font-weight:700;color:${({theme})=>theme.colors.text};`
const MsgSnippet = styled.p`font-size:${({theme})=>theme.typography.sizes.xs};color:${({theme})=>theme.colors.textMuted};margin-top:0.25rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:400px;`
const MsgDate = styled.span`font-family:'Space Mono',monospace;font-size:0.65rem;color:${({theme})=>theme.colors.textFaint};white-space:nowrap;`
const EmptyState = styled.div`padding:2.5rem;text-align:center;font-family:'Space Mono',monospace;font-size:${({theme})=>theme.typography.sizes.sm};color:${({theme})=>theme.colors.textFaint};background:${({theme})=>theme.colors.surface};`
const QuickLinks = styled.div`display:flex;flex-wrap:wrap;gap:0.75rem;margin-top:2.5rem;`
const QuickLink = styled(motion(Link))`display:inline-flex;align-items:center;gap:0.5rem;font-family:'Space Mono',monospace;font-size:${({theme})=>theme.typography.sizes.xs};font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#000;background:${({theme})=>theme.colors.primary};padding:0.55rem 1.1rem;border:2px solid ${({theme})=>theme.colors.border};text-decoration:none;box-shadow:${({theme})=>theme.shadows.sm};&:hover{transform:translate(-2px,-2px);box-shadow:${({theme})=>theme.shadows.md};}`

/* Analytics card */
const AnalyticsCard = styled.div`border:3px solid ${({theme})=>theme.colors.border};box-shadow:${({theme})=>theme.shadows.md};background:${({theme})=>theme.colors.surface};margin-bottom:2.5rem;`
const AnalyticsHead = styled.div`display:flex;align-items:center;justify-content:space-between;padding:0.875rem 1.25rem;border-bottom:3px solid ${({theme})=>theme.colors.border};background:${({theme})=>theme.colors.surfaceAlt};`
const AnalyticsLabel = styled.p`font-family:'Space Mono',monospace;font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:${({theme})=>theme.colors.textMuted};`
const AnalyticsBody = styled.div`padding:1.25rem;display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:1rem;`
const AMetric = styled.div`display:flex;flex-direction:column;gap:0.25rem;`
const AValue = styled.p`font-family:${({theme})=>theme.typography.fontDisplay};font-size:${({theme})=>theme.typography.sizes['2xl']};font-weight:700;color:${({theme})=>theme.colors.text};letter-spacing:-0.03em;line-height:1;`
const ALabel = styled.p`font-family:'Space Mono',monospace;font-size:0.6rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:${({theme})=>theme.colors.textFaint};`
const AnalyticsNote = styled.p`font-family:'Space Mono',monospace;font-size:0.65rem;color:${({theme})=>theme.colors.textFaint};padding:0 1.25rem 1rem;line-height:1.6;`
const GaLink = styled.a`color:${({theme})=>theme.colors.primary};text-decoration:none;&:hover{text-decoration:underline;}`

export default function Overview() {
  const { projects, skillGroups, messages, journey, settings } = useAdmin()
  const unread = messages.filter(m => !m.read).length
  const totalSkills = skillGroups.reduce((a,g)=>a+g.skills.length, 0)
  const [gaReady, setGaReady] = useState(false)

  useEffect(() => {
    analyticsPromise.then(a => setGaReady(!!a)).catch(() => setGaReady(false))
  }, [])

  const stats = [
    { label:'Projects',     value:projects.length,    icon:<FiFolder/>,     color:'#FFE500', to:'/admin/projects' },
    { label:'Skill Groups', value:skillGroups.length,  icon:<FiCode/>,       color:'#0047FF', to:'/admin/skills'   },
    { label:'Total Skills', value:totalSkills,          icon:<FiTrendingUp/>, color:'#00C853', to:'/admin/skills'   },
    { label:'Journey',      value:journey.length,      icon:<FiActivity/>,   color:'#FF6B9D', to:'/admin/journey'  },
    { label:'Messages',     value:messages.length,     icon:<FiMail/>,       color:'#FF3C2F', to:'/admin/messages' },
  ]

  return (
    <div>
      <PageTitle>Welcome back.</PageTitle>
      <PageSub>Maqhawe Ngwenya — Portfolio Dashboard · {settings.location}</PageSub>

      {/* Stats */}
      <StatsGrid>
        {stats.map((s,i)=>(
          <StatCard key={s.label} to={s.to}
            initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.07,duration:0.5}}>
            <StatIcon $color={s.color}>{s.icon}</StatIcon>
            <StatValue>
              {s.value}
              {s.label==='Messages'&&unread>0&&<UnreadBadge>{unread} new</UnreadBadge>}
            </StatValue>
            <StatLabel>{s.label}</StatLabel>
          </StatCard>
        ))}
      </StatsGrid>

      {/* Analytics */}
      <AnalyticsCard>
        <AnalyticsHead>
          <AnalyticsLabel>Analytics (Google Analytics)</AnalyticsLabel>
          <FiGlobe style={{color:'var(--primary)',fontSize:'1rem'}}/>
        </AnalyticsHead>
        <AnalyticsBody>
          <AMetric>
            <AValue>–</AValue>
            <ALabel>Page Views</ALabel>
          </AMetric>
          <AMetric>
            <AValue>–</AValue>
            <ALabel>Unique Visitors</ALabel>
          </AMetric>
          <AMetric>
            <AValue>{gaReady ? 'Active' : 'Loading…'}</AValue>
            <ALabel>GA Status</ALabel>
          </AMetric>
        </AnalyticsBody>
        <AnalyticsNote>
          Real-time metrics are not available via the client SDK.{' '}
          View full analytics in the{' '}
          <GaLink href={`https://analytics.google.com/analytics/web/#/p${import.meta.env.VITE_GA_PROPERTY_ID??''}/reports/reportinghub`}
            target="_blank" rel="noopener noreferrer">
            Google Analytics Console
          </GaLink>{' '}
          using Measurement ID <strong>G-WYTDKSMD0G</strong>.
        </AnalyticsNote>
      </AnalyticsCard>

      {/* Recent messages */}
      <SectionTitle>Recent Messages</SectionTitle>
      <MsgList>
        {messages.length===0
          ? <EmptyState>No messages yet.</EmptyState>
          : messages.slice(0,5).map(m=>(
              <MsgRow key={m.id} $unread={!m.read}>
                <div>
                  <MsgName>{m.name} — <span style={{fontWeight:400,color:'#888',fontSize:'0.75rem'}}>{m.email}</span></MsgName>
                  <MsgSnippet>{m.message}</MsgSnippet>
                </div>
                <MsgDate>{new Date(m.date).toLocaleDateString()}</MsgDate>
              </MsgRow>
            ))
        }
      </MsgList>

      <QuickLinks>
        <QuickLink to="/admin/journey"   whileHover={{scale:1.03}}><FiActivity/>Manage Journey</QuickLink>
        <QuickLink to="/admin/projects"  whileHover={{scale:1.03}}><FiFolder/>Projects</QuickLink>
        <QuickLink to="/admin/skills"    whileHover={{scale:1.03}}><FiCode/>Skills</QuickLink>
        <QuickLink to="/admin/hero"      whileHover={{scale:1.03}}><FiArrowRight/>Hero Content</QuickLink>
        <QuickLink to="/admin/messages"  whileHover={{scale:1.03}}><FiMail/>Messages</QuickLink>
      </QuickLinks>
    </div>
  )
}
