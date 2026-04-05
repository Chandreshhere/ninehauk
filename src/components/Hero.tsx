import { useEffect, useRef } from 'react'
import { AsciiHeroRenderer } from '../utils/asciiRenderer'
import './styles.css'

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
    <section className="hero">
      <canvas ref={canvasRef} className="hero-canvas" />
      <div className="hero-bottom">
        <div className="hero-tagline">
          PROOF OF ORIGINAL.<br />
          REIMAGINED.
        </div>
        <div className="hero-desc">
          NINEHAWK IS A SECURITY TECHNOLOGY COMPANY DEVELOPING
          ANTI-COUNTERFEIT SOLUTIONS THAT PROTECT PRODUCT AUTHENTICITY
          THROUGH INVISIBLE PRINTED MICRO-PATTERNS.
        </div>
      </div>
      <div className="hero-scanline" />
    </section>
  )
}
