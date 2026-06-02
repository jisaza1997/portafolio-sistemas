import React, { useState, useEffect } from 'react'

export default function Header({ lang, setLang, theme, toggleTheme, t }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
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
    <header className={isScrolled ? 'scrolled' : ''}>
      <div className="header-container">
        <a href="#" className="logo">Julián Isaza</a>
        
        <nav className={isMenuOpen ? 'active' : ''}>
          <a href="#about" onClick={closeMenu}>{t('nav_about')}</a>
          <a href="#skills" onClick={closeMenu}>{t('nav_skills')}</a>
          <a href="#experience" onClick={closeMenu}>{t('nav_experience')}</a>
          <a href="#projects" onClick={closeMenu}>{t('nav_projects')}</a>
          <a href="#certs" onClick={closeMenu}>{t('nav_certs')}</a>
          <a href="#audit" onClick={closeMenu}>{t('nav_audit')}</a>
          <a href="#contact" className="nav-cta" onClick={closeMenu}>{t('nav_contact')}</a>
        </nav>

        <div className="header-actions">
          <button 
            className="btn-icon" 
            id="lang-toggle" 
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            aria-label="Toggle language"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
              <path d="M12 2a10 10 0 1 1-10 10h10V2z" />
            </svg>
            {' '}{lang === 'es' ? 'EN' : 'ES'}
          </button>
          
          <button 
            className="btn-icon" 
            id="theme-toggle" 
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
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
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
