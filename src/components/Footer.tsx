import { useRef } from 'react'
import { TextScramble } from '../utils/textScramble'

const styles: Record<string, React.CSSProperties> = {
  footer: {
    padding: '60px 40px',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '40px',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-dim)',
    letterSpacing: '0.1em',
    borderTop: '1px solid var(--border)',
  },
  col: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  colTitle: {
    color: 'var(--text)',
    marginBottom: '8px',
    fontSize: '10px',
    letterSpacing: '0.2em',
  },
  link: {
    color: 'var(--text-dim)',
    textDecoration: 'none',
    transition: 'color 0.3s',
    cursor: 'pointer',
    fontSize: '11px',
    letterSpacing: '0.1em',
  },
  logo: {
    fontFamily: 'var(--font-display)',
    fontSize: '18px',
    fontWeight: 800,
    color: 'var(--text-bright)',
    letterSpacing: '-0.02em',
    textTransform: 'lowercase' as const,
  },
  logoAccent: {
    color: 'var(--accent)',
    fontStyle: 'italic',
  },
  bottom: {
    gridColumn: '1 / -1',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '40px',
    borderTop: '1px solid var(--border)',
    fontSize: '10px',
    color: 'var(--text-dim)',
  },
  statusDot: {
    display: 'inline-block',
    width: '6px',
    height: '6px',
    background: 'var(--accent)',
    borderRadius: '50%',
    marginRight: '8px',
    animation: 'pulse 2s infinite',
  },
}

export default function Footer() {
  const emailRef = useRef<HTMLAnchorElement>(null)

  const scrambleEmail = () => {
    if (emailRef.current) {
      const s = new TextScramble(emailRef.current)
      s.setText('INFO@NINEHAWK.COM')
    }
  }

  return (
    <footer style={styles.footer} id="contact">
      <div style={styles.col}>
        <span style={styles.logo}>
          nine<span style={styles.logoAccent}>hawk</span>
        </span>
        <span style={{ marginTop: '8px' }}>ANTI-COUNTERFEIT</span>
        <span>TECHNOLOGY</span>
      </div>

      <div style={styles.col}>
        <span style={styles.colTitle}>NAVIGATION</span>
        <a href="#" style={styles.link}>HOME</a>
        <a href="#technology" style={styles.link}>TECHNOLOGY</a>
        <a href="#about" style={styles.link}>ABOUT</a>
        <a href="#contact" style={styles.link}>CONTACT</a>
      </div>

      <div style={styles.col}>
        <span style={styles.colTitle}>PRODUCT</span>
        <span>TRUESCAN</span>
        <span>MICRO-PATTERN SECURITY</span>
        <span>SMARTPHONE VERIFICATION</span>
        <span>PROVISIONAL PATENT</span>
      </div>

      <div style={styles.col}>
        <span style={styles.colTitle}>CONTACT</span>
        <a
          ref={emailRef}
          href="mailto:info@ninehawk.com"
          style={styles.link}
          onMouseEnter={scrambleEmail}
        >
          INFO@NINEHAWK.COM
        </a>
        <span style={{ marginTop: '16px' }}>
          <span style={styles.statusDot} />
          SYSTEM ONLINE
        </span>
      </div>

      <div style={styles.bottom}>
        <span>&copy; 2025 NINEHAWK. ALL RIGHTS RESERVED.</span>
        <span>TRUESCAN &mdash; PROOF OF ORIGINAL</span>
        <span>DESIGNED WITH PRECISION</span>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </footer>
  )
}
