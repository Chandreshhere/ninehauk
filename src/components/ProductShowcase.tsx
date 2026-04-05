import { useEffect, useRef } from 'react'
import './styles.css'

function PatternCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')!
    const chars = '01█▓▒░╔╗╚╝║═╠╣╦╩╬●◆■□▪▫'
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
      time += 0.02
      const rect = canvas.parentElement!.getBoundingClientRect()
      const w = rect.width
      const h = rect.height

      ctx.fillStyle = '#111111'
      ctx.fillRect(0, 0, w, h)

      const cellSize = 16
      const cols = Math.ceil(w / cellSize)
      const rows = Math.ceil(h / cellSize)

      ctx.font = `${cellSize - 2}px 'JetBrains Mono', monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const cx = cols / 2
      const cy = rows / 2
      const patternRadius = Math.min(cols, rows) * 0.3

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const dx = c - cx
          const dy = r - cy
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < patternRadius) {
            const wave = Math.sin(dist * 0.3 - time * 2) * 0.5 + 0.5
            const ringWave = Math.sin(dist * 0.8 - time * 3) * 0.5 + 0.5
            const alpha = (1 - dist / patternRadius) * 0.7 * wave

            if (alpha > 0.05) {
              const charIdx = Math.floor((dist + time * 5) % chars.length)
              const green = Math.floor(180 + ringWave * 75)
              ctx.fillStyle = `rgba(0, ${green}, 65, ${alpha})`
              ctx.fillText(
                chars[charIdx],
                c * cellSize + cellSize / 2,
                r * cellSize + cellSize / 2
              )
            }
          } else if (Math.random() < 0.003) {
            ctx.fillStyle = `rgba(0, 255, 65, 0.08)`
            ctx.fillText(
              chars[Math.floor(Math.random() * chars.length)],
              c * cellSize + cellSize / 2,
              r * cellSize + cellSize / 2
            )
          }
        }
      }

      // Crosshair
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.3)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(w / 2 - 30, h / 2)
      ctx.lineTo(w / 2 + 30, h / 2)
      ctx.moveTo(w / 2, h / 2 - 30)
      ctx.lineTo(w / 2, h / 2 + 30)
      ctx.stroke()

      // Corner brackets
      const bLen = 20
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.4)'
      ctx.beginPath()
      ctx.moveTo(20, 20 + bLen); ctx.lineTo(20, 20); ctx.lineTo(20 + bLen, 20)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(w - 20 - bLen, 20); ctx.lineTo(w - 20, 20); ctx.lineTo(w - 20, 20 + bLen)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(20, h - 20 - bLen); ctx.lineTo(20, h - 20); ctx.lineTo(20 + bLen, h - 20)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(w - 20 - bLen, h - 20); ctx.lineTo(w - 20, h - 20); ctx.lineTo(w - 20, h - 20 - bLen)
      ctx.stroke()

      // HUD text
      ctx.fillStyle = 'rgba(0, 255, 65, 0.5)'
      ctx.font = `10px 'JetBrains Mono', monospace`
      ctx.textAlign = 'left'
      ctx.fillText('TRUESCAN PATTERN v2.4', 30, h - 30)
      ctx.textAlign = 'right'
      ctx.fillText(`AUTH: ${Math.random() > 0.5 ? 'VERIFIED' : 'SCANNING...'}`, w - 30, h - 30)
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

export default function ProductShowcase() {
  return (
    <section className="section" id="technology">
      <div className="section-header">
        <span className="section-label">
          <span className="section-dot" />
          THE TECHNOLOGY
        </span>
        <span className="section-number">01</span>
        <span className="section-right">TRUESCAN MICRO-PATTERN</span>
      </div>

      <div className="showcase-grid">
        <div className="showcase-visual">
          <PatternCanvas />
        </div>

        <div className="showcase-info">
          <h2 className="showcase-title">
            INVISIBLE<br />
            SECURITY.<br />
            VISIBLE<br />
            TRUST.
          </h2>
          <p className="showcase-desc">
            A VERY SMALL PRINTED PATTERN ADDED DIRECTLY TO ANY PRODUCT
            PACKAGING. IT APPEARS LIKE A NORMAL PART OF THE DESIGN, BUT
            CONTAINS HIDDEN SECURITY FEATURES THAT CANNOT BE DUPLICATED
            OR REPRINTED.
          </p>
          <div className="showcase-stats">
            <div className="stat">
              <div className="stat-value">100%</div>
              <div className="stat-label">SMARTPHONE VERIFIED</div>
            </div>
            <div className="stat">
              <div className="stat-value">0</div>
              <div className="stat-label">SPECIAL DEVICES NEEDED</div>
            </div>
            <div className="stat">
              <div className="stat-value">P.P.</div>
              <div className="stat-label">PROVISIONAL PATENT</div>
            </div>
            <div className="stat">
              <div className="stat-value">POC</div>
              <div className="stat-label">PROOF OF CONCEPT READY</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
