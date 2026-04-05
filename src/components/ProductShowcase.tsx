import { useEffect, useRef } from 'react'

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: '120px 40px',
    position: 'relative',
    borderBottom: '1px solid var(--border)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '80px',
    paddingBottom: '20px',
    borderBottom: '1px solid var(--border)',
  },
  label: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-dim)',
    letterSpacing: '0.15em',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  dot: {
    width: '6px',
    height: '6px',
    background: 'var(--accent)',
    display: 'inline-block',
  },
  number: {
    fontFamily: 'var(--font-mono)',
    fontSize: '14px',
    color: 'var(--text-dim)',
  },
  right: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-dim)',
    letterSpacing: '0.15em',
    textAlign: 'right' as const,
  },
  showcase: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    alignItems: 'center',
  },
  visual: {
    position: 'relative' as const,
    aspectRatio: '16/10',
    background: 'var(--bg-light)',
    border: '1px solid var(--border)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvasContainer: {
    width: '100%',
    height: '100%',
  },
  info: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(28px, 4vw, 48px)',
    fontWeight: 700,
    color: 'var(--text-bright)',
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  desc: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    lineHeight: 1.8,
    color: 'var(--text)',
    maxWidth: '500px',
    letterSpacing: '0.06em',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginTop: '20px',
  },
  stat: {
    borderTop: '1px solid var(--border)',
    paddingTop: '16px',
  },
  statValue: {
    fontFamily: 'var(--font-display)',
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--accent)',
    marginBottom: '4px',
  },
  statLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--text-dim)',
    letterSpacing: '0.15em',
  },
  counter: {
    fontFamily: 'var(--font-mono)',
    fontSize: '14px',
    color: 'var(--text-dim)',
  },
}

// ASCII pattern animation canvas
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

      // Center pattern region
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

      // Crosshair at center
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
      // top-left
      ctx.beginPath()
      ctx.moveTo(20, 20 + bLen); ctx.lineTo(20, 20); ctx.lineTo(20 + bLen, 20)
      ctx.stroke()
      // top-right
      ctx.beginPath()
      ctx.moveTo(w - 20 - bLen, 20); ctx.lineTo(w - 20, 20); ctx.lineTo(w - 20, 20 + bLen)
      ctx.stroke()
      // bottom-left
      ctx.beginPath()
      ctx.moveTo(20, h - 20 - bLen); ctx.lineTo(20, h - 20); ctx.lineTo(20 + bLen, h - 20)
      ctx.stroke()
      // bottom-right
      ctx.beginPath()
      ctx.moveTo(w - 20 - bLen, h - 20); ctx.lineTo(w - 20, h - 20); ctx.lineTo(w - 20, h - 20 - bLen)
      ctx.stroke()

      // Scan text
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
    <section style={styles.section} id="technology">
      <div style={styles.header}>
        <span style={styles.label}>
          <span style={styles.dot} />
          THE TECHNOLOGY
        </span>
        <span style={styles.counter}>01</span>
        <span style={styles.right}>TRUESCAN MICRO-PATTERN</span>
      </div>

      <div style={styles.showcase}>
        <div style={styles.visual}>
          <div style={styles.canvasContainer}>
            <PatternCanvas />
          </div>
        </div>

        <div style={styles.info}>
          <h2 style={styles.title}>
            INVISIBLE<br />
            SECURITY.<br />
            VISIBLE<br />
            TRUST.
          </h2>
          <p style={styles.desc}>
            A VERY SMALL PRINTED PATTERN ADDED DIRECTLY TO ANY PRODUCT
            PACKAGING. IT APPEARS LIKE A NORMAL PART OF THE DESIGN, BUT
            CONTAINS HIDDEN SECURITY FEATURES THAT CANNOT BE DUPLICATED
            OR REPRINTED.
          </p>
          <div style={styles.stats}>
            <div style={styles.stat}>
              <div style={styles.statValue}>100%</div>
              <div style={styles.statLabel}>SMARTPHONE VERIFIED</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statValue}>0</div>
              <div style={styles.statLabel}>SPECIAL DEVICES NEEDED</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statValue}>P.P.</div>
              <div style={styles.statLabel}>PROVISIONAL PATENT</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statValue}>POC</div>
              <div style={styles.statLabel}>PROOF OF CONCEPT READY</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
