import { useEffect, useRef } from 'react'
import { AsciiHeroRenderer } from '../utils/asciiRenderer'

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  bottomContent: {
    position: 'relative',
    zIndex: 2,
    padding: '0 40px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: '40px',
    pointerEvents: 'none',
  },
  tagline: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(14px, 1.5vw, 18px)',
    fontWeight: 700,
    color: 'var(--text-bright)',
    lineHeight: 1.4,
    letterSpacing: '0.02em',
    maxWidth: '300px',
  },
  description: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    lineHeight: 1.8,
    color: 'var(--text)',
    maxWidth: '550px',
    textAlign: 'right' as const,
    letterSpacing: '0.08em',
  },
  scanline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'var(--border-light)',
    zIndex: 3,
  },
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<AsciiHeroRenderer | null>(null)

  useEffect(() => {
    if (canvasRef.current && !rendererRef.current) {
      rendererRef.current = new AsciiHeroRenderer(canvasRef.current)
    }
    return () => {
      rendererRef.current?.destroy()
      rendererRef.current = null
    }
  }, [])

  return (
    <section style={styles.container}>
      <canvas ref={canvasRef} style={styles.canvas} />
      <div style={styles.bottomContent}>
        <div style={styles.tagline}>
          PROOF OF ORIGINAL.<br />
          REIMAGINED.
        </div>
        <div style={styles.description}>
          NINEHAWK IS A SECURITY TECHNOLOGY COMPANY DEVELOPING
          ANTI-COUNTERFEIT SOLUTIONS THAT PROTECT PRODUCT AUTHENTICITY
          THROUGH INVISIBLE PRINTED MICRO-PATTERNS.
        </div>
      </div>
      <div style={styles.scanline} />
    </section>
  )
}
