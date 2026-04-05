import { useEffect, useRef, useState } from 'react'
import { TextScramble } from '../utils/textScramble'
import './styles.css'

export default function Navbar() {
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when menu is open (use class to preserve overflow-x: hidden)
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflowY = 'hidden'
    } else {
      document.body.style.overflowY = ''
    }
    return () => { document.body.style.overflowY = '' }
  }, [menuOpen])

  const handleHover = (index: number, text: string) => {
    const el = linkRefs.current[index]
    if (el) {
      const scrambler = new TextScramble(el)
      scrambler.setText(text)
    }
  }

  const navItems = [
    { label: 'TECHNOLOGY', href: '#technology' },
    { label: 'ABOUT', href: '#about' },
    { label: 'CONTACT', href: '#contact' },
  ]

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <a href="#" className="nav-logo">
          nine<span className="nav-logo-accent">hawk</span>
        </a>

        <div className="nav-links nav-links-desktop">
          {navItems.slice(0, 2).map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              ref={el => { linkRefs.current[i] = el }}
              className="nav-link"
              onMouseEnter={() => handleHover(i, link.label)}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="nav-links nav-links-desktop">
          <a
            href="#contact"
            className="nav-link"
            ref={el => { linkRefs.current[2] = el }}
            onMouseEnter={() => handleHover(2, 'CONTACT')}
          >
            CONTACT
          </a>
          <a
            href="mailto:info@ninehawk.com"
            className="nav-link"
            ref={el => { linkRefs.current[3] = el }}
            onMouseEnter={() => handleHover(3, 'INFO@NINEHAWK.COM')}
          >
            INFO@NINEHAWK.COM
          </a>
        </div>

        <div className="nav-right nav-right-desktop">
          <span>ANTI-COUNTERFEIT</span>
          <span>TECHNOLOGY</span>
        </div>

        {/* Mobile hamburger */}
        <button
          className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile fullscreen menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-inner">
          {navItems.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="mobile-menu-link"
              onClick={closeMenu}
            >
              {link.label}
            </a>
          ))}
          <div className="mobile-menu-divider" />
          <a href="mailto:info@ninehawk.com" className="mobile-menu-link mobile-menu-link-sm" onClick={closeMenu}>
            INFO@NINEHAWK.COM
          </a>
          <span className="mobile-menu-tag">ANTI-COUNTERFEIT TECHNOLOGY</span>
        </div>
      </div>
    </>
  )
}
