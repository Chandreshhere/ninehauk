import { useEffect, useRef, useState } from 'react'
import './styles.css'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const modalRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  // Focus trap + escape key
  useEffect(() => {
    if (!isOpen) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflowY = 'hidden'

    // Focus first input
    setTimeout(() => nameRef.current?.focus(), 100)

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflowY = ''
    }
  }, [isOpen, onClose])

  // Click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) onClose()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')

    // Simulate send
    setTimeout(() => {
      setStatus('sent')
      setTimeout(() => {
        onClose()
        setStatus('idle')
        setFormState({ name: '', email: '', company: '', message: '' })
      }, 2000)
    }, 1500)
  }

  if (!isOpen) return null

  return (
    <div
      ref={modalRef}
      className={`modal-backdrop ${isOpen ? 'open' : ''}`}
      onClick={handleBackdropClick}
    >
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">GET IN TOUCH</h2>
            <p className="modal-subtitle">SECURE YOUR PRODUCTS WITH TRUESCAN</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <span /><span />
          </button>
        </div>

        {status === 'sent' ? (
          <div className="modal-success">
            <div className="modal-success-icon">&#10003;</div>
            <h3 className="modal-success-title">MESSAGE TRANSMITTED</h3>
            <p className="modal-success-text">
              YOUR INQUIRY HAS BEEN RECEIVED.<br />
              WE WILL RESPOND WITHIN 24 HOURS.
            </p>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="modal-form-row">
              <div className="modal-field">
                <label className="modal-label" htmlFor="name">NAME</label>
                <input
                  ref={nameRef}
                  className="modal-input"
                  type="text"
                  id="name"
                  name="name"
                  placeholder="YOUR NAME"
                  value={formState.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="modal-field">
                <label className="modal-label" htmlFor="email">EMAIL</label>
                <input
                  className="modal-input"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="YOUR@EMAIL.COM"
                  value={formState.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="modal-field">
              <label className="modal-label" htmlFor="company">COMPANY <span className="modal-optional">(OPTIONAL)</span></label>
              <input
                className="modal-input"
                type="text"
                id="company"
                name="company"
                placeholder="COMPANY NAME"
                value={formState.company}
                onChange={handleChange}
              />
            </div>

            <div className="modal-field">
              <label className="modal-label" htmlFor="message">MESSAGE</label>
              <textarea
                className="modal-input modal-textarea"
                id="message"
                name="message"
                placeholder="TELL US ABOUT YOUR NEEDS..."
                rows={5}
                value={formState.message}
                onChange={handleChange}
                required
              />
            </div>

            <div className="modal-footer">
              <button
                type="submit"
                className="modal-submit"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? (
                  <>
                    <span className="modal-spinner" />
                    TRANSMITTING...
                  </>
                ) : (
                  'SEND MESSAGE'
                )}
              </button>
              <span className="modal-hint">
                OR EMAIL DIRECTLY AT INFO@NINEHAWK.COM
              </span>
            </div>
          </form>
        )}

        {/* Decorative corner brackets */}
        <div className="modal-corner modal-corner-tl" />
        <div className="modal-corner modal-corner-tr" />
        <div className="modal-corner modal-corner-bl" />
        <div className="modal-corner modal-corner-br" />
      </div>
    </div>
  )
}
