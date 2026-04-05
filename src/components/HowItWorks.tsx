import { useEffect, useRef, useState } from 'react'

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
  },
  bigHeading: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(32px, 6vw, 72px)',
    fontWeight: 800,
    color: 'var(--text-bright)',
    lineHeight: 1.05,
    letterSpacing: '-0.03em',
    marginBottom: '100px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '0',
  },
  item: {
    padding: '40px 30px 40px 0',
    borderTop: '1px solid var(--border)',
    position: 'relative' as const,
  },
  itemNumber: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    color: 'var(--text-dim)',
    letterSpacing: '0.2em',
    marginBottom: '24px',
    display: 'block',
  },
  itemTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text-bright)',
    marginBottom: '20px',
    letterSpacing: '0.02em',
  },
  itemList: {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  itemListItem: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text)',
    letterSpacing: '0.08em',
    lineHeight: 1.6,
  },
}

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
      style={{
        ...styles.item,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`,
      }}
    >
      <span style={styles.itemNumber}>{feature.num}</span>
      <h3 style={styles.itemTitle}>{feature.title}</h3>
      <ul style={styles.itemList}>
        {feature.items.map((item) => (
          <li key={item} style={styles.itemListItem}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function HowItWorks() {
  return (
    <section style={styles.section}>
      <div style={styles.header}>
        <span style={styles.label}>
          <span style={styles.dot} />
          HOW IT WORKS
        </span>
        <span style={styles.number}>03</span>
        <span style={styles.right}>FROM PATTERN TO PROOF</span>
      </div>

      <h2 style={styles.bigHeading}>
        WE PRINT. WE SCAN. WE VERIFY.<br />
        AUTHENTICATION BUILT INTO<br />
        THE PACKAGING.
      </h2>

      <div style={styles.grid}>
        {features.map((feature, i) => (
          <FeatureItem key={feature.title} feature={feature} index={i} />
        ))}
      </div>
    </section>
  )
}
