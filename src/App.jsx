import React, { useState, useEffect, useCallback } from 'react'
import { translations } from './translations'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import GitHubSection from './components/GitHubSection'
import Certifications from './components/Certifications'
import ControlCenter from './components/ControlCenter'
import Contact from './components/Contact'

export default function App() {
  const [lang, setLang] = useState('es')
  const [theme, setTheme] = useState('dark')
  const [certsCount, setCertsCount] = useState(42) // Fallback default
  
  const getTimestamp = () => new Date().toISOString().replace('T', ' ').substring(0, 19)

  const [logs, setLogs] = useState([
    { time: getTimestamp(), type: 'SYS_BOOT', message: 'IT Audit System bootstrap initialized.' },
    { time: getTimestamp(), type: 'SYS_LOAD', message: 'Loading translation matrix (ES/EN) and visual assets...' },
    { time: getTimestamp(), type: 'SYS_READY', message: 'Security control frameworks mapped. Standing by.' }
  ])

  // Translation helper
  const t = useCallback((key) => {
    return translations[lang]?.[key] || key
  }, [lang])

  // Centralized audit logger
  const addAuditLog = useCallback((type, message) => {
    setLogs(prev => [
      ...prev,
      {
        time: getTimestamp(),
        type,
        message
      }
    ])
  }, [])

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme')
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
      setTheme(prefersLight ? 'light' : 'dark')
    }
  }, [])

  // Apply theme class to body
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode')
    } else {
      document.body.classList.remove('light-mode')
    }
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  // Sync document language attribute
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const toggleTheme = () => {
    setTheme(prev => {
      const nextTheme = prev === 'light' ? 'dark' : 'light'
      addAuditLog("THEME", `UI theme toggled to: ${nextTheme === 'light' ? 'Light Mode' : 'Dark Mode'}`)
      return nextTheme
    })
  }

  return (
    <>
      <Header 
        lang={lang} 
        setLang={setLang} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        t={t} 
      />
      
      <main>
        <Hero 
          lang={lang} 
          t={t} 
        />
        
        <About 
          certsCount={certsCount} 
          t={t} 
        />
        
        <Skills 
          t={t} 
        />
        
        <Experience 
          t={t} 
        />
        
        <GitHubSection 
          addAuditLog={addAuditLog} 
          t={t} 
        />
        
        <Certifications 
          onCertsLoaded={setCertsCount} 
          addAuditLog={addAuditLog} 
          lang={lang} 
          t={t} 
        />
        
        <ControlCenter 
          logs={logs} 
          addAuditLog={addAuditLog} 
          lang={lang} 
          t={t} 
        />
        
        <Contact 
          addAuditLog={addAuditLog} 
          t={t} 
        />
      </main>

      <footer>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <p>&copy; 2026 Julián Andrés Isaza Arias. Todos los derechos reservados.</p>
          <div className="social-icons" style={{ display: 'flex', gap: '12px' }}>
            <a 
              href="https://www.linkedin.com/in/julian-andres-isaza-arias-404b78230/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn Profile Link"
              style={{ color: 'var(--text-secondary)', transition: 'color var(--transition-normal)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a 
              href="https://github.com/jisaza1997" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="GitHub Profile Link"
              style={{ color: 'var(--text-secondary)', transition: 'color var(--transition-normal)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
