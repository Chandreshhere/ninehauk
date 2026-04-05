import { useEffect, useRef, useState } from 'react'
import './styles.css'

const features = [
  {
    num: '(01)',
    title: 'PRINT',
    items: [
      'MICRO-PATTERN INTEGRATION',
      'DIRECT PACKAGING APPLICATION',
      'INVISIBLE SECURITY LAYER',
      'SEAMLESS DESIGN BLENDING',
    ],
  },
  {
    num: '(02)',
    title: 'SCAN',
    items: [
      'SMARTPHONE VERIFICATION',
      'INSTANT AUTHENTICATION',
      'NO SPECIAL DEVICE REQUIRED',
      'CONSUMER-FRIENDLY UX',
    ],
  },
  {
    num: '(03)',
    title: 'DETECT',
    items: [
      'DUPLICATE DETECTION',
      'COPY PREVENTION SYSTEM',
      'REPRINT IDENTIFICATION',
      'COUNTERFEIT BLOCKING',
    ],
  },
  {
    num: '(04)',
    title: 'PROTECT',
    items: [
      'PATENT-PENDING TECHNOLOGY',
      'INDUSTRY-SCALE DEPLOYMENT',
      'CONSUMER TRUST BUILDING',
      'CROSS-INDUSTRY APPLICATION',
    ],
  },
]

function FeatureItem({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const isRight = index % 2 === 1

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`hiw-item ${isRight ? 'hiw-item-right' : ''} ${visible ? 'visible' : 'hidden'}`}
      style={{ transitionDelay: `${index * 0.12}s` }}
    >
      <span className="hiw-item-num">{feature.num}</span>
      <h3 className="hiw-item-title">{feature.title}</h3>
      <ul className="hiw-item-list">
        {feature.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

function HiwVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')!
    const chars = '░▒▓█■□●○◆◇╔╗╚╝║═01'
    let animFrame: number
    let time = 0

    const resize = () => {
      const parent = canvas.parentElement!
      const w = parent.clientWidth
      const h = parent.clientHeight
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.scale(dpr, dpr)
    }

    resize()

    const animate = () => {
      animFrame = requestAnimationFrame(animate)
      time += 0.012

      const parent = canvas.parentElement!
      const w = parent.clientWidth
      const h = parent.clientHeight

      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, w, h)

      const cellSize = 10

      ctx.font = `${cellSize - 1}px 'JetBrains Mono', monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // 4 connected nodes
      const nodes = [
        { x: w * 0.15, y: h * 0.5, label: 'P' },
        { x: w * 0.38, y: h * 0.5, label: 'S' },
        { x: w * 0.62, y: h * 0.5, label: 'D' },
        { x: w * 0.85, y: h * 0.5, label: 'V' },
      ]

      // Connecting data streams
      for (let i = 0; i < nodes.length - 1; i++) {
        const from = nodes[i]
        const to = nodes[i + 1]
        const segments = 30
        for (let s = 0; s < segments; s++) {
          const t = s / segments
          const px = from.x + (to.x - from.x) * t
          const py = from.y + (to.y - from.y) * t + Math.sin(t * Math.PI * 2 + time * 3) * 8
          const progress = (time * 0.5 + i * 0.25) % 1
          const dist = Math.abs(t - progress)
          const alpha = dist < 0.15 ? (1 - dist / 0.15) * 0.6 : 0.08
          ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`
          const charIdx = Math.floor((t * 20 + time * 5) % chars.length)
          ctx.fillText(chars[charIdx], px, py)
        }
      }

      // Node rings
      for (let n = 0; n < nodes.length; n++) {
        const node = nodes[n]
        const pulseRadius = 22 + Math.sin(time * 2 + n) * 4

        for (let a = 0; a < 24; a++) {
          const angle = (a / 24) * Math.PI * 2 + time * 0.5
          const rx = node.x + Math.cos(angle) * pulseRadius
          const ry = node.y + Math.sin(angle) * pulseRadius
          const alpha = 0.2 + Math.sin(angle * 3 + time * 2) * 0.15
          ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`
          const charIdx = Math.floor((a + time * 8) % chars.length)
          ctx.fillText(chars[charIdx], rx, ry)
        }

        ctx.font = `bold 16px 'Space Grotesk', sans-serif`
        ctx.fillStyle = `rgba(0, 255, 65, ${0.6 + Math.sin(time * 1.5 + n) * 0.2})`
        ctx.fillText(node.label, node.x, node.y)
        ctx.font = `${cellSize - 1}px 'JetBrains Mono', monospace`
      }

      // HUD
      ctx.fillStyle = 'rgba(0, 255, 65, 0.3)'
      ctx.font = `9px 'JetBrains Mono', monospace`
      ctx.textAlign = 'left'
      ctx.fillText('PRINT → SCAN → DETECT → PROTECT', 16, h - 16)
      ctx.textAlign = 'right'
      ctx.fillText('TRUESCAN PIPELINE', w - 16, h - 16)
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

export default function HowItWorks() {
  return (
    <section className="section hiw-section">
      <div className="section-header">
        <span className="section-label">
          <span className="section-dot" />
          HOW IT WORKS
        </span>
        <span className="section-number">04</span>
        <span className="section-right">FROM PATTERN TO PROOF</span>
      </div>

      <h2 className="hiw-heading">
        WE PRINT. WE SCAN. WE VERIFY.<br />
        AUTHENTICATION BUILT INTO<br />
        THE PACKAGING.
      </h2>

      <div className="hiw-grid">
        {features.map((feature, i) => (
          <FeatureItem key={feature.title} feature={feature} index={i} />
        ))}
      </div>

      {/* Centered visual at bottom */}
      <div className="hiw-visual">
        <HiwVisual />
      </div>
    </section>
  )
}
