import { useEffect, useRef, useState } from 'react'
import { TextScramble } from '../utils/textScramble'
import './styles.css'

export default function Navbar() {
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleHover = (index: number, text: string) => {
    const el = linkRefs.current[index]
    if (el) {
      const scrambler = new TextScramble(el)
      scrambler.setText(text)
    }
  }

  const links = [
    { label: 'TECHNOLOGY', href: '#technology' },
    { label: 'ABOUT', href: '#about' },
  ]

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <a href="#" className="nav-logo">
        nine<span className="nav-logo-accent">hawk</span>
      </a>

      <div className="nav-links">
        {links.map((link, i) => (
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

      <div className="nav-links">
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

      <div className="nav-right">
        <span>ANTI-COUNTERFEIT</span>
        <span>TECHNOLOGY</span>
      </div>
    </nav>
  )
}
