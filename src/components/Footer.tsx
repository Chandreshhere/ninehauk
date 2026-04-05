import { useRef, useState } from 'react'
import { TextScramble } from '../utils/textScramble'
import ContactModal from './ContactModal'
import './styles.css'

export default function Footer() {
  const emailRef = useRef<HTMLAnchorElement>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const scrambleEmail = () => {
    if (emailRef.current) {
      const s = new TextScramble(emailRef.current)
      s.setText('INFO@NINEHAWK.COM')
    }
  }

  return (
    <>
      <footer className="footer" id="contact">
        <div className="footer-col footer-col-brand">
          <span className="footer-logo">
            nine<span className="footer-logo-accent">hawk</span>
          </span>
          <span style={{ marginTop: '8px' }}>ANTI-COUNTERFEIT</span>
          <span>TECHNOLOGY</span>
        </div>

        <div className="footer-col footer-col-nav">
          <span className="footer-col-title">NAVIGATION</span>
          <a href="#" className="footer-link">HOME</a>
          <a href="#technology" className="footer-link">TECHNOLOGY</a>
          <a href="#about" className="footer-link">ABOUT</a>
          <button className="footer-link footer-contact-btn" onClick={() => setModalOpen(true)}>
            CONTACT
          </button>
        </div>

        <div className="footer-col footer-col-product">
          <span className="footer-col-title">PRODUCT</span>
          <span className="footer-product-item">&ldquo;TRUESCAN&rdquo;</span>
          <span className="footer-product-item">&ldquo;MICRO-PATTERN SECURITY&rdquo;</span>
          <span className="footer-product-item">&ldquo;SMARTPHONE VERIFICATION&rdquo;</span>
          <span className="footer-product-item">&ldquo;PROVISIONAL PATENT&rdquo;</span>
        </div>

        <div className="footer-col footer-col-contact">
          <span className="footer-col-title">CONTACT</span>
          <a
            ref={emailRef}
            href="mailto:info@ninehawk.com"
            className="footer-link"
            onMouseEnter={scrambleEmail}
          >
            INFO@NINEHAWK.COM
          </a>
          <button className="footer-contact-trigger" onClick={() => setModalOpen(true)}>
            SEND A MESSAGE &rarr;
          </button>
          <span className="footer-status">
            <span className="footer-status-dot" />
            SYSTEM ONLINE
          </span>
        </div>

        <div className="footer-bottom">
          <span>&copy; 2025 NINEHAWK. ALL RIGHTS RESERVED.</span>
          <span>TRUESCAN &mdash; PROOF OF ORIGINAL</span>
        </div>
      </footer>

      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
