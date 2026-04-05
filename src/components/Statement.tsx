import { useEffect, useRef, useState } from 'react'
import './styles.css'

export default function Statement() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.2 }
    )
    if (headingRef.current) observer.observe(headingRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="section statement">
      <div className="statement-bg">?</div>
      <div className="section-header">
        <span className="section-label">
          <span className="section-dot" />
          THE PROBLEM
        </span>
        <span className="section-number">03</span>
        <span className="section-right">SCAN OR SUSPECT</span>
      </div>

      <h2
        ref={headingRef}
        className={`statement-heading ${visible ? 'visible' : 'hidden'}`}
      >
        EVERY COPY LOOKS REAL.
        ONLY THE ORIGINAL
        PASSES THE SCAN.
      </h2>

      <p className={`statement-sub ${visible ? 'visible' : 'hidden'}`}>
        IF SOMEONE TRIES TO COPY, DUPLICATE OR REPRINT THE PATTERN,
        THE SYSTEM DETECTS IT AS A DUPLICATE AND FAILS AUTHENTICATION,
        HELPING PREVENT COUNTERFEIT PRODUCTS FROM ENTERING THE MARKET.
      </p>
    </section>
  )
}
