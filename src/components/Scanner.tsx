import { useEffect, useRef, useState } from 'react'
import './styles.css'

/**
 * Full interactive scanner demo section.
 * Shows a simulated scan interface with:
 * - A scanning viewport with animated scan line
 * - A micro-pattern being scanned
 * - Live authentication log output
 * - Status transitions: SCANNING -> ANALYZING -> VERIFIED / COUNTERFEIT DETECTED
 */

const LOG_LINES_GENUINE = [
  '> INITIALIZING TRUESCAN ENGINE v2.4.1...',
  '> CAMERA MODULE: ACTIVE',
  '> MICRO-PATTERN DETECTED IN FRAME',
  '> ISOLATING PATTERN REGION... OK',
  '> EXTRACTING FREQUENCY DOMAIN DATA...',
  '> ANALYZING PRINT SIGNATURE...',
  '> HASH: 7f3a...c9e2 | ORIGIN: VERIFIED',
  '> COMPARING AGAINST REGISTERED PATTERNS...',
  '> MATCH FOUND — CONFIDENCE: 99.97%',
  '> SUBSTRATE ANALYSIS: ORIGINAL PRINT STOCK',
  '> DUPLICATION MARKERS: NONE DETECTED',
  '> ✓ AUTHENTICATION RESULT: GENUINE',
  '> PRODUCT ID: NH-2025-00482',
  '> REGISTERED TO: AUTHORIZED MANUFACTURER',
  '> STATUS: ✓✓✓ VERIFIED ORIGINAL ✓✓✓',
]

const LOG_LINES_FAKE = [
  '> INITIALIZING TRUESCAN ENGINE v2.4.1...',
  '> CAMERA MODULE: ACTIVE',
  '> MICRO-PATTERN DETECTED IN FRAME',
  '> ISOLATING PATTERN REGION... OK',
  '> EXTRACTING FREQUENCY DOMAIN DATA...',
  '> ANALYZING PRINT SIGNATURE...',
  '> HASH: 3b1f...a7d0 | ORIGIN: UNKNOWN',
  '> COMPARING AGAINST REGISTERED PATTERNS...',
  '> ⚠ ANOMALY: PATTERN DEGRADATION DETECTED',
  '> SUBSTRATE ANALYSIS: REPRINT DETECTED',
  '> DUPLICATION MARKERS: POSITIVE (×3)',
  '> MOIRÉ INTERFERENCE: CONFIRMED',
  '> ✗ AUTHENTICATION RESULT: COUNTERFEIT',
  '> ⚠ WARNING: THIS IS NOT AN ORIGINAL PRODUCT',
  '> STATUS: ✗✗✗ DUPLICATE REJECTED ✗✗✗',
]

function ScannerViewport() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')!
    let animFrame: number
    let time = 0

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.scale(dpr, dpr)
    }

    resize()

    const animate = () => {
      animFrame = requestAnimationFrame(animate)
      time += 0.016
      const rect = canvas.parentElement!.getBoundingClientRect()
      const w = rect.width
      const h = rect.height

      // Dark background
      ctx.fillStyle = '#080808'
      ctx.fillRect(0, 0, w, h)

      // Grid pattern (simulating the micro-pattern being scanned)
      const cellSize = 8
      const cols = Math.ceil(w / cellSize)
      const rows = Math.ceil(h / cellSize)
      const cx = w / 2
      const cy = h / 2

      ctx.font = `${cellSize - 1}px 'JetBrains Mono', monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const patternChars = '░▒▓█■□▪▫●○◆◇'

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const px = c * cellSize + cellSize / 2
          const py = r * cellSize + cellSize / 2
          const dx = (px - cx) / w
          const dy = (py - cy) / h
          const dist = Math.sqrt(dx * dx + dy * dy)

          // Circular pattern area
          if (dist < 0.35) {
            // Concentric ring pattern
            const ring = Math.sin(dist * 60 + time * 1.5) * 0.5 + 0.5
            const spiral = Math.sin(Math.atan2(dy, dx) * 8 + dist * 30 - time * 2) * 0.5 + 0.5
            const alpha = (1 - dist / 0.35) * 0.6 * (ring * 0.6 + spiral * 0.4)

            if (alpha > 0.08) {
              const charIdx = Math.floor((dist * 40 + time * 2) % patternChars.length)
              ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`
              ctx.fillText(patternChars[charIdx], px, py)
            }
          }
        }
      }

      // Scanning line sweeping vertically
      const scanY = ((Math.sin(time * 1.2) + 1) / 2) * h
      const scanGrad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40)
      scanGrad.addColorStop(0, 'rgba(0, 255, 65, 0)')
      scanGrad.addColorStop(0.4, 'rgba(0, 255, 65, 0.08)')
      scanGrad.addColorStop(0.5, 'rgba(0, 255, 65, 0.35)')
      scanGrad.addColorStop(0.6, 'rgba(0, 255, 65, 0.08)')
      scanGrad.addColorStop(1, 'rgba(0, 255, 65, 0)')
      ctx.fillStyle = scanGrad
      ctx.fillRect(0, scanY - 40, w, 80)

      // Bright scan line
      ctx.fillStyle = 'rgba(0, 255, 65, 0.6)'
      ctx.fillRect(0, scanY - 1, w, 2)

      // Corner brackets (scanner frame)
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.7)'
      ctx.lineWidth = 2
      const margin = 24
      const bLen = 30

      // Top-left
      ctx.beginPath()
      ctx.moveTo(margin, margin + bLen); ctx.lineTo(margin, margin); ctx.lineTo(margin + bLen, margin)
      ctx.stroke()
      // Top-right
      ctx.beginPath()
      ctx.moveTo(w - margin - bLen, margin); ctx.lineTo(w - margin, margin); ctx.lineTo(w - margin, margin + bLen)
      ctx.stroke()
      // Bottom-left
      ctx.beginPath()
      ctx.moveTo(margin, h - margin - bLen); ctx.lineTo(margin, h - margin); ctx.lineTo(margin + bLen, h - margin)
      ctx.stroke()
      // Bottom-right
      ctx.beginPath()
      ctx.moveTo(w - margin - bLen, h - margin); ctx.lineTo(w - margin, h - margin); ctx.lineTo(w - margin, h - margin - bLen)
      ctx.stroke()

      // Crosshair in center
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.25)'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(cx - 40, cy); ctx.lineTo(cx + 40, cy)
      ctx.moveTo(cx, cy - 40); ctx.lineTo(cx, cy + 40)
      ctx.stroke()
      ctx.setLineDash([])

      // Small crosshair center dot
      ctx.fillStyle = 'rgba(0, 255, 65, 0.5)'
      ctx.beginPath()
      ctx.arc(cx, cy, 3, 0, Math.PI * 2)
      ctx.fill()

      // HUD overlay text
      ctx.font = `9px 'JetBrains Mono', monospace`
      ctx.fillStyle = 'rgba(0, 255, 65, 0.5)'
      ctx.textAlign = 'left'
      ctx.fillText('TRUESCAN', margin + 4, margin + bLen + 16)
      ctx.fillText(`FPS: ${Math.floor(30 + Math.sin(time) * 5)}`, margin + 4, margin + bLen + 28)

      ctx.textAlign = 'right'
      ctx.fillText('PATTERN: LOCKED', w - margin - 4, margin + bLen + 16)
      ctx.fillText(`ZOOM: ${(1.0 + Math.sin(time * 0.5) * 0.1).toFixed(2)}x`, w - margin - 4, margin + bLen + 28)

      ctx.textAlign = 'left'
      ctx.fillText(`REGION: ${Math.floor(cx)}x${Math.floor(cy)}`, margin + 4, h - margin - bLen - 8)

      ctx.textAlign = 'right'
      const status = Math.sin(time * 0.8) > 0 ? 'SCANNING...' : 'ANALYZING...'
      ctx.fillStyle = `rgba(0, 255, 65, ${0.4 + Math.sin(time * 3) * 0.2})`
      ctx.fillText(status, w - margin - 4, h - margin - bLen - 8)

      // Pulsing border
      const borderAlpha = 0.15 + Math.sin(time * 2) * 0.05
      ctx.strokeStyle = `rgba(0, 255, 65, ${borderAlpha})`
      ctx.lineWidth = 1
      ctx.strokeRect(0.5, 0.5, w - 1, h - 1)
    }

    animate()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
}

function AuthLog({ mode }: { mode: 'genuine' | 'counterfeit' }) {
  const [lines, setLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const logRef = useRef<HTMLDivElement>(null)
  const logData = mode === 'genuine' ? LOG_LINES_GENUINE : LOG_LINES_FAKE

  useEffect(() => {
    setLines([])
    setCurrentLine(0)
  }, [mode])

  useEffect(() => {
    if (currentLine >= logData.length) return

    const delay = currentLine === 0 ? 500 : 120 + Math.random() * 200
    const timer = setTimeout(() => {
      setLines(prev => [...prev, logData[currentLine]])
      setCurrentLine(prev => prev + 1)
    }, delay)

    return () => clearTimeout(timer)
  }, [currentLine, logData])

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [lines])

  const isComplete = currentLine >= logData.length
  const isGenuine = mode === 'genuine'

  return (
    <div className="scanner-log-container">
      <div className="scanner-log-header">
        <span className="scanner-log-title">
          <span className={`scanner-log-dot ${isComplete ? (isGenuine ? 'genuine' : 'fake') : 'scanning'}`} />
          AUTHENTICATION LOG
        </span>
        <span className="scanner-log-status">
          {!isComplete ? 'PROCESSING...' : isGenuine ? '✓ GENUINE' : '✗ COUNTERFEIT'}
        </span>
      </div>
      <div className="scanner-log" ref={logRef}>
        {lines.map((line, i) => (
          <div
            key={i}
            className={`scanner-log-line ${
              line.includes('✓') ? 'genuine' : line.includes('✗') || line.includes('⚠') ? 'fake' : ''
            }`}
          >
            {line}
          </div>
        ))}
        {!isComplete && (
          <div className="scanner-log-line blink">{'>'} _</div>
        )}
      </div>
      {isComplete && (
        <div className={`scanner-result ${isGenuine ? 'genuine' : 'fake'}`}>
          <div className="scanner-result-icon">{isGenuine ? '✓' : '✗'}</div>
          <div className="scanner-result-text">
            {isGenuine ? 'PRODUCT AUTHENTICATED' : 'COUNTERFEIT DETECTED'}
          </div>
          <div className="scanner-result-sub">
            {isGenuine
              ? 'THIS PRODUCT IS VERIFIED ORIGINAL'
              : 'WARNING: THIS IS NOT AN ORIGINAL PRODUCT'}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Scanner() {
  const [mode, setMode] = useState<'genuine' | 'counterfeit'>('genuine')
  const [key, setKey] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const switchMode = (newMode: 'genuine' | 'counterfeit') => {
    setMode(newMode)
    setKey(prev => prev + 1)
  }

  return (
    <section className="section scanner-section" ref={sectionRef}>
      <div className="section-header">
        <span className="section-label">
          <span className="section-dot" />
          LIVE DEMO
        </span>
        <span className="section-number">02</span>
        <span className="section-right">AUTHENTICATION SCANNER</span>
      </div>

      <div className={`scanner-intro ${visible ? 'visible' : 'hidden'}`}>
        <h2 className="scanner-heading">
          SEE IT IN ACTION.<br />
          SCAN. VERIFY. TRUST.
        </h2>
        <p className="scanner-desc">
          WATCH THE TRUESCAN ENGINE AUTHENTICATE A PRODUCT IN REAL-TIME.
          TOGGLE BETWEEN GENUINE AND COUNTERFEIT TO SEE HOW THE SYSTEM
          DETECTS DUPLICATES.
        </p>
      </div>

      <div className="scanner-toggle">
        <button
          className={`scanner-toggle-btn ${mode === 'genuine' ? 'active genuine' : ''}`}
          onClick={() => switchMode('genuine')}
        >
          <span className="scanner-toggle-dot genuine" />
          SCAN ORIGINAL
        </button>
        <button
          className={`scanner-toggle-btn ${mode === 'counterfeit' ? 'active fake' : ''}`}
          onClick={() => switchMode('counterfeit')}
        >
          <span className="scanner-toggle-dot fake" />
          SCAN COUNTERFEIT
        </button>
      </div>

      <div className="scanner-demo">
        <div className="scanner-viewport">
          <ScannerViewport />
        </div>
        <AuthLog key={key} mode={mode} />
      </div>
    </section>
  )
}
