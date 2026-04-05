import { useEffect, useRef, useState } from 'react'

const styles: Record<string, React.CSSProperties> = {
  section: {
    padding: '160px 40px',
    position: 'relative',
    borderBottom: '1px solid var(--border)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '100px',
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
  heading: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(36px, 7vw, 96px)',
    fontWeight: 800,
    color: 'var(--text-bright)',
    lineHeight: 1.0,
    letterSpacing: '-0.03em',
    maxWidth: '1200px',
  },
  subtext: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    lineHeight: 1.8,
    color: 'var(--text)',
    maxWidth: '600px',
    marginTop: '60px',
    letterSpacing: '0.08em',
  },
  bgChar: {
    position: 'absolute' as const,
    fontFamily: 'var(--font-mono)',
    fontSize: '200px',
    fontWeight: 700,
    color: 'var(--border)',
    right: '40px',
    top: '50%',
    transform: 'translateY(-50%)',
    opacity: 0.3,
    userSelect: 'none' as const,
    pointerEvents: 'none' as const,
  },
}

export default function Statement() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
        }
      },
      { threshold: 0.2 }
    )
    if (headingRef.current) observer.observe(headingRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section style={styles.section}>
      <div style={styles.bgChar}>?</div>
      <div style={styles.header}>
        <span style={styles.label}>
          <span style={styles.dot} />
          THE PROBLEM
        </span>
        <span style={styles.number}>02</span>
        <span style={styles.right}>SCAN OR SUSPECT</span>
      </div>

      <h2
        ref={headingRef}
        style={{
          ...styles.heading,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        EVERY COPY LOOKS REAL.
        ONLY THE ORIGINAL
        PASSES THE SCAN.
      </h2>

      <p style={{
        ...styles.subtext,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s',
      }}>
        IF SOMEONE TRIES TO COPY, DUPLICATE OR REPRINT THE PATTERN,
        THE SYSTEM DETECTS IT AS A DUPLICATE AND FAILS AUTHENTICATION,
        HELPING PREVENT COUNTERFEIT PRODUCTS FROM ENTERING THE MARKET.
      </p>
    </section>
  )
}
