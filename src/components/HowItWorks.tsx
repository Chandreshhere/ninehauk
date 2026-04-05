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
      className={`hiw-item ${visible ? 'visible' : 'hidden'}`}
      style={{ transitionDelay: `${index * 0.15}s` }}
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

export default function HowItWorks() {
  return (
    <section className="section">
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
    </section>
  )
}
