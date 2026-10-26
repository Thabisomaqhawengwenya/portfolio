import { useState, useEffect, useRef, useId, useMemo } from 'react'
import styled, { keyframes } from 'styled-components'

export interface TVFrameProps {
  children: React.ReactNode
  channel?: string
  enableCurvature?: boolean
  enableOSD?: boolean
  className?: string
  style?: React.CSSProperties
}

/* ─────────────────────────────────────────────────────────────
   PROCEDURAL RADIAL BARREL DISPLACEMENT GENERATOR
   Creates a 128x128 radial displacement map on an offscreen
   canvas without any external image assets.
───────────────────────────────────────────────────────────── */
function generateRadialDisplacementDataUrl(): string {
  if (typeof document === 'undefined') return ''
  try {
    const size = 128
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    const imgData = ctx.createImageData(size, size)
    const data = imgData.data
    const center = (size - 1) / 2

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4
        // Normalized coordinates in [-1, 1]
        const nx = (x - center) / center
        const ny = (y - center) / center
        const r2 = nx * nx + ny * ny

        // Radial barrel distortion curve:
        // Center has zero displacement (128 neutral in SVG displacement mapping)
        const factor = r2 * 0.42
        const dispX = nx * factor
        const dispY = ny * factor

        data[idx] = Math.max(0, Math.min(255, Math.round(128 + dispX * 127)))
        data[idx + 1] = Math.max(0, Math.min(255, Math.round(128 + dispY * 127)))
        data[idx + 2] = 128
        data[idx + 3] = 255
      }
    }

    ctx.putImageData(imgData, 0, 0)
    return canvas.toDataURL('image/png')
  } catch {
    return ''
  }
}

/* ─────────────────────────────────────────────────────────────
   ANIMATIONS & KEYFRAMES
───────────────────────────────────────────────────────────── */
const pulseAnimation = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.2; transform: scale(0.92); }
`

const cathodeRoll = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(700%); }
`

const grainJitter = keyframes`
  0%   { transform: translate(0, 0); }
  20%  { transform: translate(-3%, 2%); }
  40%  { transform: translate(2%, -3%); }
  60%  { transform: translate(-2%, 3%); }
  80%  { transform: translate(3%, -1%); }
  100% { transform: translate(-1%, -2%); }
`

/* ─────────────────────────────────────────────────────────────
   STYLED COMPONENTS
───────────────────────────────────────────────────────────── */
const TVEnclosure = styled.div`
  width: 100%;
  position: relative;
  box-sizing: border-box;
  margin-top: clamp(4.25rem, 6vw, 5.25rem);
  padding: 0 1rem 2.5rem 1rem;

  @media (max-width: 1024px) {
    margin-top: 3.75rem;
    padding: 0 0.5rem 1.25rem 0.5rem;
  }
`

const TVChassis = styled.div`
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  background: linear-gradient(180deg, #18191d 0%, #101114 60%, #0a0b0d 100%);
  border: 14px solid #141519;
  border-radius: 38px;
  box-shadow:
    0 0 0 3px #000000,
    0 25px 65px rgba(0, 0, 0, 0.75),
    inset 0 2px 4px rgba(255, 255, 255, 0.12),
    inset 0 -6px 12px rgba(0, 0, 0, 0.85);
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    border-width: 8px;
    border-radius: 20px;
    box-shadow: 0 0 0 2px #000000, 0 15px 35px rgba(0, 0, 0, 0.6);
  }

  @media (max-width: 640px) {
    border-width: 4px;
    border-radius: 14px;
  }
`

const TVTopBevel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.55rem 1.5rem;
  background: #0d0e11;
  border-bottom: 2px solid #000000;
  user-select: none;

  @media (max-width: 768px) {
    padding: 0.35rem 0.85rem;
  }
`

const ChassisBrandTag = styled.div`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: #4f535f;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before, &::after {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    background: #2a2c33;
    border-radius: 50%;
  }

  @media (max-width: 640px) {
    font-size: 0.55rem;
  }
`

const BevelVentBar = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;

  span {
    display: inline-block;
    width: 24px;
    height: 3px;
    background: #060708;
    border-radius: 1px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  }

  @media (max-width: 768px) {
    display: none;
  }
`

const CRTScreen = styled.div<{ $enableCurvature: boolean; $isBW: boolean; $filterId: string }>`
  position: relative;
  background: #08080a;
  border-radius: 26px;
  overflow: hidden;
  box-shadow:
    inset 0 0 80px rgba(0, 0, 0, 0.8),
    inset 0 0 20px rgba(0, 0, 0, 0.95);
  transition: filter 0.3s ease;

  @media (min-width: 1024px) {
    ${({ $enableCurvature, $isBW, $filterId }) => {
      const filters: string[] = []
      if ($isBW) filters.push('grayscale(100%) contrast(1.18)')
      if ($enableCurvature) filters.push(`url(#${$filterId})`)
      return filters.length > 0 ? `filter: ${filters.join(' ')};` : ''
    }}
  }

  @media (max-width: 1023px) {
    border-radius: 12px;
    ${({ $isBW }) => ($isBW ? 'filter: grayscale(100%) contrast(1.18);' : '')}
  }
`

/* Sticky overlay pinned across the screen viewport while scrolling */
const CRTStickyOverlays = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  margin-bottom: -100vh;
  pointer-events: none;
  z-index: 10;
  overflow: hidden;
`

const CRTVignette = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 95% 85% at 50% 50%,
    transparent 62%,
    rgba(0, 0, 0, 0.38) 85%,
    rgba(0, 0, 0, 0.85) 100%
  );
  pointer-events: none;
  z-index: 11;
`

const ScanlinesCanvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 12;
`

const RollingCathode = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 18%;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.035) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
  animation: ${cathodeRoll} 7.5s linear infinite;
  z-index: 13;
`

const FilmGrainOverlay = styled.div<{ $grainFilterId: string }>`
  position: absolute;
  inset: -10%;
  width: 120%;
  height: 120%;
  filter: url(#${({ $grainFilterId }) => $grainFilterId});
  opacity: 0.05;
  pointer-events: none;
  animation: ${grainJitter} 0.25s steps(1) infinite;
  z-index: 14;
`

const GlassGlare = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 85% 55% at 24% 16%,
    rgba(255, 255, 255, 0.07) 0%,
    rgba(255, 255, 255, 0.015) 45%,
    transparent 72%
  );
  pointer-events: none;
  z-index: 15;
`

/* Screen content container — 100% interactive */
const CRTContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  box-sizing: border-box;
  min-height: 50vh;
  /* Allow full interaction */
  pointer-events: auto;
`

/* Vintage VHS OSD HUD Bars */
const OSDTopHeader = styled.div`
  position: sticky;
  top: 0.75rem;
  left: 0;
  right: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1.25rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-shadow: 0 0 4px rgba(0, 255, 120, 0.6), 1px 1px 0 #000;
  color: #00ff66;
  pointer-events: none;
  user-select: none;

  @media (max-width: 640px) {
    font-size: 0.65rem;
    padding: 0.4rem 0.75rem;
  }
`

const OSDBottomFooter = styled.div`
  position: sticky;
  bottom: 0.75rem;
  left: 0;
  right: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1.25rem;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: #00ff66;
  text-shadow: 0 0 4px rgba(0, 255, 120, 0.5), 1px 1px 0 #000;
  pointer-events: none;
  user-select: none;
  flex-wrap: wrap;
  gap: 0.5rem;

  @media (max-width: 640px) {
    font-size: 0.62rem;
    padding: 0.4rem 0.75rem;
  }
`

const OSDLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
`

const OSDCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 480px) {
    display: none;
  }
`

const OSDRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
`

const RecDot = styled.span`
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #ff3333;
  box-shadow: 0 0 8px #ff3333;
  animation: ${pulseAnimation} 1.2s ease-in-out infinite;
`

const OSDPlayText = styled.span`
  font-weight: 700;
  color: #00ff66;
`

const OSDChannelBadge = styled.span`
  background: rgba(0, 0, 0, 0.6);
  border: 1.5px solid #00ff66;
  color: #00ff66;
  padding: 0.1rem 0.45rem;
  font-weight: 700;
  letter-spacing: 0.1em;
`

const OSDTimecode = styled.span`
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.8), 1px 1px 0 #000;
`

const OSDModeBadge = styled.span`
  color: #00e5ff;
  text-shadow: 0 0 4px rgba(0, 229, 255, 0.7), 1px 1px 0 #000;
  font-weight: 700;
`

const OSDFormatBadge = styled.span`
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.65rem;

  @media (max-width: 768px) {
    display: none;
  }
`

const OSDAudioBadge = styled.span`
  color: #00ff66;
  font-weight: 700;
`

const OSDToggleButton = styled.button<{ $active?: boolean }>`
  pointer-events: auto;
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ $active }) => ($active ? '#000000' : '#00ff66')};
  background: ${({ $active }) => ($active ? '#00ff66' : 'rgba(0, 0, 0, 0.65)')};
  border: 1.5px solid #00ff66;
  padding: 0.25rem 0.65rem;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 2px 2px 0 #000000;

  &:hover {
    background: #00ff66;
    color: #000000;
    box-shadow: 3px 3px 0 #000000;
    transform: translate(-1px, -1px);
  }

  &:active {
    transform: translate(1px, 1px);
    box-shadow: none;
  }
`

const TVBottomBevel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1.5rem;
  background: #0d0e11;
  border-top: 2px solid #000000;
  user-select: none;

  @media (max-width: 768px) {
    padding: 0.45rem 0.85rem;
  }
`

const ChassisSpecText = styled.span`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #3b3e48;
  text-transform: uppercase;

  @media (max-width: 640px) {
    font-size: 0.52rem;
  }
`

const PowerCluster = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
`

const PowerLed = styled.span<{ $on: boolean }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $on }) => ($on ? '#00e676' : '#222')};
  box-shadow: ${({ $on }) => ($on ? '0 0 8px #00e676' : 'none')};
`

const PowerLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #4a4d57;
  text-transform: uppercase;

  @media (max-width: 480px) {
    display: none;
  }
`

/* ─────────────────────────────────────────────────────────────
   COMPONENT IMPLEMENTATION
───────────────────────────────────────────────────────────── */
export default function TVFrame({
  children,
  channel = 'AV-1',
  enableCurvature = true,
  enableOSD = true,
  className,
  style,
}: TVFrameProps) {
  const rawId = useId()
  const filterId = `crt-barrel-${rawId.replace(/:/g, '')}`
  const grainFilterId = `crt-grain-${rawId.replace(/:/g, '')}`

  const [curvatureActive, setCurvatureActive] = useState(true)
  const [isBW, setIsBW] = useState(false)
  const [secondsElapsed, setSecondsElapsed] = useState(14)

  const scanlinesCanvasRef = useRef<HTMLCanvasElement>(null)
  const stickyOverlaysRef = useRef<HTMLDivElement>(null)

  // In-memory procedural radial displacement map (zero network asset dependencies)
  const displacementMapUrl = useMemo(() => generateRadialDisplacementDataUrl(), [])

  // Live ticking session timecode counter (HH:MM:SS)
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed(sec => sec + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formattedTimecode = useMemo(() => {
    const hours = Math.floor(secondsElapsed / 3600)
    const minutes = Math.floor((secondsElapsed % 3600) / 60)
    const seconds = secondsElapsed % 60
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }, [secondsElapsed])

  // Mathematical Scanlines Renderer with ResizeObserver
  // Uses equation: y(x) = centerY + (y - centerY) / (1 + K * ((x - centerX) / centerX)^2)
  useEffect(() => {
    const canvas = scanlinesCanvasRef.current
    const container = stickyOverlaysRef.current
    if (!canvas || !container) return

    const renderScanlines = (width: number, height: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, width, height)

      const centerX = width / 2
      const centerY = height / 2
      const K = enableCurvature && curvatureActive ? 0.085 : 0.0
      const step = 3.5

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.28)'
      ctx.lineWidth = 1.15

      const segments = 24
      for (let y = 0; y <= height; y += step) {
        ctx.beginPath()
        for (let i = 0; i <= segments; i++) {
          const x = (i / segments) * width
          const nx = (x - centerX) / centerX
          const curvedY = K > 0 ? centerY + (y - centerY) / (1 + K * nx * nx) : y
          if (i === 0) {
            ctx.moveTo(x, curvedY)
          } else {
            ctx.lineTo(x, curvedY)
          }
        }
        ctx.stroke()
      }
    }

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width > 0 && height > 0) {
          renderScanlines(width, height)
        }
      }
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [enableCurvature, curvatureActive])

  return (
    <TVEnclosure className={className} style={style}>
      {/* Layer 2: In-Memory SVG Filter Definitions */}
      <svg
        style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {displacementMapUrl && (
            <filter id={filterId} x="-5%" y="-5%" width="110%" height="110%">
              <feImage href={displacementMapUrl} result="distMap" />
              <feDisplacementMap
                in="SourceGraphic"
                in2="distMap"
                scale={18}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          )}

          {/* Layer 4: SVG Fractal Noise Film Grain */}
          <filter id={grainFilterId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="2"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
      </svg>

      {/* Layer 1: Physical Bezel & Enclosure */}
      <TVChassis>
        <TVTopBevel>
          <BevelVentBar>
            <span />
            <span />
            <span />
            <span />
          </BevelVentBar>
          <ChassisBrandTag>TRINITRON // RETRO-CRT MONITOR</ChassisBrandTag>
          <BevelVentBar>
            <span />
            <span />
            <span />
            <span />
          </BevelVentBar>
        </TVTopBevel>

        {/* CRT Screen Viewport */}
        <CRTScreen
          $enableCurvature={enableCurvature && curvatureActive}
          $isBW={isBW}
          $filterId={filterId}
        >
          {/* Compositing Overlay Stack (Phosphor Vignette, Scanlines, Cathode Bar, Film Grain, Glare) */}
          <CRTStickyOverlays ref={stickyOverlaysRef}>
            <CRTVignette />
            <ScanlinesCanvas ref={scanlinesCanvasRef} />
            <RollingCathode />
            <FilmGrainOverlay $grainFilterId={grainFilterId} />
            <GlassGlare />
          </CRTStickyOverlays>

          {/* Layer 5: Vintage VHS OSD HUD (Top Header) */}
          {enableOSD && (
            <OSDTopHeader>
              <OSDLeft>
                <RecDot />
                <OSDPlayText>PLAY ▶</OSDPlayText>
                <OSDChannelBadge>{channel}</OSDChannelBadge>
              </OSDLeft>
              <OSDCenter>
                <OSDTimecode>TCR {formattedTimecode}</OSDTimecode>
              </OSDCenter>
              <OSDRight>
                <OSDModeBadge>SP</OSDModeBadge>
                <OSDFormatBadge>NTSC • 60Hz</OSDFormatBadge>
              </OSDRight>
            </OSDTopHeader>
          )}

          {/* Wrapped Children Content (Fully Interactive) */}
          <CRTContentWrapper>{children}</CRTContentWrapper>

          {/* Layer 5: Vintage VHS OSD HUD (Bottom Footer with B&W Toggle) */}
          {enableOSD && (
            <OSDBottomFooter>
              <OSDLeft>
                <OSDAudioBadge>SP • STEREO</OSDAudioBadge>
                <OSDFormatBadge>// HI-FI AUDIO</OSDFormatBadge>
              </OSDLeft>
              <OSDRight>
                <OSDToggleButton
                  type="button"
                  onClick={() => setIsBW(v => !v)}
                  $active={isBW}
                  aria-pressed={isBW}
                  title="Toggle Black & White / Color CRT display"
                >
                  {isBW ? 'MODE: B&W' : 'MODE: COLOR'}
                </OSDToggleButton>

                {enableCurvature && (
                  <OSDToggleButton
                    type="button"
                    onClick={() => setCurvatureActive(v => !v)}
                    $active={curvatureActive}
                    aria-pressed={curvatureActive}
                    title="Toggle CRT Screen Curvature"
                  >
                    {curvatureActive ? 'SCREEN: CURVED' : 'SCREEN: FLAT'}
                  </OSDToggleButton>
                )}
              </OSDRight>
            </OSDBottomFooter>
          )}
        </CRTScreen>

        {/* Bottom Chassis Details */}
        <TVBottomBevel>
          <ChassisSpecText>MODEL TV-1989 // ANALOG PHOSPHOR DISPLAY</ChassisSpecText>
          <PowerCluster>
            <PowerLed $on={true} />
            <PowerLabel>STANDBY / POWER</PowerLabel>
          </PowerCluster>
        </TVBottomBevel>
      </TVChassis>
    </TVEnclosure>
  )
}
