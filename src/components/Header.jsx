import React, { useState, useEffect } from 'react'

export default function Header({ lang, setLang, theme, toggleTheme, t }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('about')

  useEffect(() => {
    const handleScroll = () => {
      // Toggle scrolled class
      setIsScrolled(window.scrollY > 50)

      // Auto-highlight active link based on scroll position
      const sections = ['about', 'skills', 'experience', 'github-section', 'certifications', 'audit-section', 'contact']
      const scrollPos = window.scrollY + 200

      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header id="site-header" className={isScrolled ? 'scrolled' : ''}>
      <div className="container nav-container">
        <a href="#" className="logo" id="header-logo">
          JULIÁN ISAZA<span>.DEV</span>
        </a>
        
        <nav id="navigation-menu" className={isMenuOpen ? 'active' : ''}>
          <a href="#about" className={activeSection === 'about' ? 'active' : ''} onClick={closeMenu}>
            {t('nav_about')}
          </a>
          <a href="#skills" className={activeSection === 'skills' ? 'active' : ''} onClick={closeMenu}>
            {t('nav_skills')}
          </a>
          <a href="#experience" className={activeSection === 'experience' ? 'active' : ''} onClick={closeMenu}>
            {t('nav_experience')}
          </a>
          <a href="#github-section" className={activeSection === 'github-section' ? 'active' : ''} onClick={closeMenu}>
            {t('nav_projects')}
          </a>
          <a href="#certifications" className={activeSection === 'certifications' ? 'active' : ''} onClick={closeMenu}>
            {t('nav_certs')}
          </a>
          <a href="#audit-section" className={activeSection === 'audit-section' ? 'active' : ''} onClick={closeMenu}>
            {t('nav_audit')}
          </a>
          <a href="#contact" className={activeSection === 'contact' ? 'active' : ''} onClick={closeMenu}>
            {t('nav_contact')}
          </a>
        </nav>

        <div className="controls-wrapper">
          <button 
            className="btn-icon" 
            id="theme-toggle" 
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          <button 
            className="btn-lang" 
            id="lang-toggle" 
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            aria-label="Cambiar idioma"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
              <path d="M12 2a10 10 0 1 1-10 10h10V2z" />
            </svg>
            {' '}{lang === 'es' ? 'EN' : 'ES'}
          </button>

          <button 
            className="btn-icon menu-btn" 
            id="menu-toggle" 
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              {isMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
