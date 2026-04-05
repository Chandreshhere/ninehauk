import { useEffect, useRef, useState } from 'react'
import './styles.css'

function AsciiVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')!
    const chars = '▓▒░█╔╗╚╝║═╠╣╦╩╬@#$%&*+=-~'
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

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const dx = (c - cx) / cols
          const dy = (r - cy) / rows
          const dist = Math.sqrt(dx * dx + dy * dy)

          const shieldWidth = 0.35 - dy * 0.15
          const inShield = Math.abs(dx) < shieldWidth && dy > -0.35 && dy < 0.4
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
    <section className="section" id="about">
      <div className="section-header">
        <span className="section-label">
          <span className="section-dot" />
          ABOUT NINEHAWK
        </span>
        <span className="section-number">05</span>
        <span className="section-right">THE COMPANY</span>
      </div>

      <div
        ref={ref}
        className={`about-content ${visible ? 'visible' : 'hidden'}`}
      >
        <div className="about-left">
          <h2 className="about-heading">
            NINEHAWK HAS DEVELOPED A NEW WAY TO SECURE PRODUCT
            PACKAGING USING INVISIBLE PRINTED TECHNOLOGY.
          </h2>
          <p className="about-text">
            THE SOLUTION IS DESIGNED TO BE EXTREMELY EASY TO USE.
            ANY CUSTOMER CAN SIMPLY SCAN IT USING A SMARTPHONE,
            WITHOUT NEEDING ANY SPECIAL DEVICE, AND INSTANTLY VERIFY
            WHETHER THE PRODUCT IS GENUINE.
          </p>
          <p className="about-text">
            A WORKING PROOF OF CONCEPT HAS ALREADY BEEN DEVELOPED,
            AND A PROVISIONAL PATENT HAS BEEN GRANTED. THE GOAL IS
            TO FURTHER DEVELOP THIS INTO A FULL-SCALE PRODUCT THAT
            CAN BE IMPLEMENTED ACROSS INDUSTRIES TO STRENGTHEN
            PRODUCT AUTHENTICITY AND BUILD CONSUMER TRUST.
          </p>

          <div className="about-milestone">
            <span className="about-milestone-label">CURRENT STATUS</span>
            <span className="about-milestone-text">
              WORKING PROOF OF CONCEPT DEVELOPED
            </span>
          </div>
          <div className="about-milestone">
            <span className="about-milestone-label">IP STATUS</span>
            <span className="about-milestone-text">
              PROVISIONAL PATENT GRANTED
            </span>
          </div>
          <div className="about-milestone">
            <span className="about-milestone-label">NEXT PHASE</span>
            <span className="about-milestone-text">
              FULL-SCALE PRODUCT DEVELOPMENT &amp;
              INDUSTRY IMPLEMENTATION
            </span>
          </div>
        </div>

        <div className="about-visual">
          <AsciiVisual />
        </div>
      </div>
    </section>
  )
}
