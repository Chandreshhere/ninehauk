import { useRef } from 'react'
import { TextScramble } from '../utils/textScramble'
import './styles.css'

export default function Footer() {
  const emailRef = useRef<HTMLAnchorElement>(null)

  const scrambleEmail = () => {
    if (emailRef.current) {
      const s = new TextScramble(emailRef.current)
      s.setText('INFO@NINEHAWK.COM')
    }
  }

  return (
    <footer className="footer" id="contact">
      <div className="footer-col">
        <span className="footer-logo">
          nine<span className="footer-logo-accent">hawk</span>
        </span>
        <span style={{ marginTop: '8px' }}>ANTI-COUNTERFEIT</span>
        <span>TECHNOLOGY</span>
      </div>

      <div className="footer-col">
        <span className="footer-col-title">NAVIGATION</span>
        <a href="#" className="footer-link">HOME</a>
        <a href="#technology" className="footer-link">TECHNOLOGY</a>
        <a href="#about" className="footer-link">ABOUT</a>
        <a href="#contact" className="footer-link">CONTACT</a>
      </div>

      <div className="footer-col">
        <span className="footer-col-title">PRODUCT</span>
        <span>TRUESCAN</span>
        <span>MICRO-PATTERN SECURITY</span>
        <span>SMARTPHONE VERIFICATION</span>
        <span>PROVISIONAL PATENT</span>
      </div>

      <div className="footer-col">
        <span className="footer-col-title">CONTACT</span>
        <a
          ref={emailRef}
          href="mailto:info@ninehawk.com"
          className="footer-link"
          onMouseEnter={scrambleEmail}
        >
          INFO@NINEHAWK.COM
        </a>
        <span className="footer-status">
          <span className="footer-status-dot" />
          SYSTEM ONLINE
        </span>
      </div>

      <div className="footer-bottom">
        <span>&copy; 2025 NINEHAWK. ALL RIGHTS RESERVED.</span>
        <span>TRUESCAN &mdash; PROOF OF ORIGINAL</span>
        <span>DESIGNED WITH PRECISION</span>
      </div>
    </footer>
  )
}
