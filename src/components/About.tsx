import { useEffect, useRef, useState } from 'react'

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: '120px 40px',
    position: 'relative',
    borderBottom: '1px solid var(--border)',
    overflow: 'hidden',
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
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '80px',
    alignItems: 'start',
  },
  left: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '40px',
  },
  aboutHeading: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(24px, 3vw, 40px)',
    fontWeight: 700,
    color: 'var(--text-bright)',
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  aboutText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    lineHeight: 2,
    color: 'var(--text)',
    letterSpacing: '0.06em',
  },
  milestone: {
    borderTop: '1px solid var(--border)',
    paddingTop: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  milestoneLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--accent)',
    letterSpacing: '0.2em',
  },
  milestoneText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text)',
    lineHeight: 1.7,
    letterSpacing: '0.06em',
  },
  asciiPortrait: {
    position: 'relative' as const,
    aspectRatio: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
}

// ASCII art visual for the about section
function AsciiVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')!
    const chars = '▓▒░█╔╗╚╝║═╠╣╦╩╬@#$%&*+=-~·'
    let animFrame: number
    let time = 0

    const resize = () => {
      const parent = canvas.parentElement!
      const size = Math.min(parent.clientWidth, parent.clientHeight)
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = size * dpr
      canvas.height = size * dpr
      canvas.style.width = `${size}px`
      canvas.style.height = `${size}px`
      ctx.scale(dpr, dpr)
    }

    resize()

    const animate = () => {
      animFrame = requestAnimationFrame(animate)
      time += 0.015

      const parent = canvas.parentElement!
      const size = Math.min(parent.clientWidth, parent.clientHeight)

      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, size, size)

      const cellSize = 12
      const cols = Math.ceil(size / cellSize)
      const rows = Math.ceil(size / cellSize)
      const cx = cols / 2
      const cy = rows / 2

      ctx.font = `${cellSize - 1}px 'JetBrains Mono', monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Create a shield/hawk shape
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const dx = (c - cx) / cols
          const dy = (r - cy) / rows
          const dist = Math.sqrt(dx * dx + dy * dy)

          // Shield shape
          const shieldWidth = 0.35 - dy * 0.15
          const inShield = Math.abs(dx) < shieldWidth && dy > -0.35 && dy < 0.4

          // V shape at bottom
          const vShape = dy > 0.1 && Math.abs(dx) < (0.4 - dy)

          if (inShield || vShape) {
            const wave = Math.sin(r * 0.3 + time * 2) * 0.3 + 0.7
            const alpha = wave * (0.2 + (1 - dist * 2) * 0.6)

            if (alpha > 0.05) {
              const charIdx = Math.floor((dist * 20 + time * 3) % chars.length)
              const g = Math.floor(150 + wave * 105)
              ctx.fillStyle = `rgba(0, ${g}, 50, ${Math.min(alpha, 0.8)})`
              ctx.fillText(
                chars[charIdx],
                c * cellSize + cellSize / 2,
                r * cellSize + cellSize / 2
              )
            }
          }
        }
      }

      // "NH" text in center
      ctx.font = `bold ${size * 0.15}px 'Space Grotesk', sans-serif`
      ctx.fillStyle = `rgba(0, 255, 65, ${0.15 + Math.sin(time) * 0.05})`
      ctx.fillText('NH', size / 2, size / 2)
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

export default function About() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section style={styles.section} id="about">
      <div style={styles.header}>
        <span style={styles.label}>
          <span style={styles.dot} />
          ABOUT NINEHAWK
        </span>
        <span style={styles.number}>04</span>
        <span style={styles.right}>THE COMPANY</span>
      </div>

      <div
        ref={ref}
        style={{
          ...styles.content,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        <div style={styles.left}>
          <h2 style={styles.aboutHeading}>
            NINEHAWK HAS DEVELOPED A NEW WAY TO SECURE PRODUCT
            PACKAGING USING INVISIBLE PRINTED TECHNOLOGY.
          </h2>
          <p style={styles.aboutText}>
            THE SOLUTION IS DESIGNED TO BE EXTREMELY EASY TO USE.
            ANY CUSTOMER CAN SIMPLY SCAN IT USING A SMARTPHONE,
            WITHOUT NEEDING ANY SPECIAL DEVICE, AND INSTANTLY VERIFY
            WHETHER THE PRODUCT IS GENUINE.
          </p>
          <p style={styles.aboutText}>
            A WORKING PROOF OF CONCEPT HAS ALREADY BEEN DEVELOPED,
            AND A PROVISIONAL PATENT HAS BEEN GRANTED. THE GOAL IS
            TO FURTHER DEVELOP THIS INTO A FULL-SCALE PRODUCT THAT
            CAN BE IMPLEMENTED ACROSS INDUSTRIES TO STRENGTHEN
            PRODUCT AUTHENTICITY AND BUILD CONSUMER TRUST.
          </p>

          <div style={styles.milestone}>
            <span style={styles.milestoneLabel}>CURRENT STATUS</span>
            <span style={styles.milestoneText}>
              WORKING PROOF OF CONCEPT DEVELOPED
            </span>
          </div>
          <div style={styles.milestone}>
            <span style={styles.milestoneLabel}>IP STATUS</span>
            <span style={styles.milestoneText}>
              PROVISIONAL PATENT GRANTED
            </span>
          </div>
          <div style={styles.milestone}>
            <span style={styles.milestoneLabel}>NEXT PHASE</span>
            <span style={styles.milestoneText}>
              FULL-SCALE PRODUCT DEVELOPMENT &
              INDUSTRY IMPLEMENTATION
            </span>
          </div>
        </div>

        <div style={styles.asciiPortrait}>
          <AsciiVisual />
        </div>
      </div>
    </section>
  )
}
