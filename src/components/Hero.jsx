import React, { useState, useEffect } from 'react'

export default function Hero({ lang, t }) {
  const [typedText, setTypedText] = useState('')
  const [roleIndex, setRoleIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(100)

  const roles = {
    es: ["Ingeniero de Sistemas", "Auditor de TI", "Desarrollador Backend", "Especialista en ISO 27001"],
    en: ["Systems Engineer", "IT Auditor", "Backend Developer", "ISO 27001 Specialist"]
  }

  useEffect(() => {
    setCharIndex(0)
    setTypedText('')
    setIsDeleting(false)
    setTypingSpeed(100)
  }, [lang])

  useEffect(() => {
    const activeRoles = roles[lang]
    const currentRole = activeRoles[roleIndex % activeRoles.length]

    const handleTyping = () => {
      if (!isDeleting) {
        setTypedText(currentRole.substring(0, charIndex + 1))
        setCharIndex(prev => prev + 1)
        setTypingSpeed(100)

        if (charIndex + 1 === currentRole.length) {
          setIsDeleting(true)
          setTypingSpeed(2000) // Pause at full text
        }
      } else {
        setTypedText(currentRole.substring(0, charIndex - 1))
        setCharIndex(prev => prev - 1)
        setTypingSpeed(50)

        if (charIndex - 1 === 0) {
          setIsDeleting(false)
          setRoleIndex(prev => (prev + 1) % activeRoles.length)
          setTypingSpeed(500) // Pause before next word
        }
      }
    }

    const timer = setTimeout(handleTyping, typingSpeed)
    return () => clearTimeout(timer)
  }, [charIndex, isDeleting, roleIndex, lang, typingSpeed])

  return (
    <section id="hero">
      <div className="hero-bg-animations">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
      </div>
      
      <div className="container">
        <div className="hero-content">
          <h3 data-i18n="hero_greet">{t('hero_greet')}</h3>
          <h1 className="text-gradient-cyan">Julián Andrés Isaza Arias</h1>
          <div className="subtitle-typing" id="typing-text">
            {typedText}
          </div>
          <p data-i18n="hero_desc">{t('hero_desc')}</p>
          <div className="hero-cta">
            <a href="#github-section" className="btn btn-primary" id="cta-view-portfolio">{t('hero_cta_portfolio')}</a>
            <a href="#contact" className="btn btn-secondary" id="cta-contact-me">{t('hero_cta_contact')}</a>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="profile-card">
            <div className="profile-card-inner">
              <div className="avatar-wrapper">
                <img src="./assets/img/profile.png" alt="Julián Andrés Isaza Arias" className="profile-avatar" />
              </div>
              <h3>Julián Isaza</h3>
              <p data-i18n="hero_tagline">{t('hero_tagline')}</p>
              <div className="social-icons">
                <a href="https://www.linkedin.com/in/julian-andres-isaza-arias-404b78230/" target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="LinkedIn profile">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
                <a href="https://github.com/jisaza1997" target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="GitHub profile">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
