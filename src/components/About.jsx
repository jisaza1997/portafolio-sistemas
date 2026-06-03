import React from 'react'

export default function About({ certsCount, profile, setProfile, t }) {
  return (
    <section id="about" className="section-padding">
      <div className="container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">{t('nav_about')}</span>
          <h2 className="section-title">{t('about_title')}</h2>
        </div>
        
        <div className="about-grid">
          <div className="about-text">
            <p>{t('about_p1')}</p>
            <p>{t('about_p2')}</p>
            
            <div className="about-stats">
              <div className="stat-item glass-card">
                <h4 className="text-gradient-cyan">8+</h4>
                <p>{t('about_years_exp')}</p>
              </div>
              <div className="stat-item glass-card">
                <h4 className="text-gradient-emerald" id="certs-stat-count">{certsCount}</h4>
                <p>{t('about_certs_count')}</p>
              </div>
            </div>
          </div>
          
          <div className="about-cv">
            <div className="profile-switcher-wrapper glass-card" style={{ marginBottom: '20px', padding: '20px' }}>
              <h4 style={{ marginBottom: '12px', fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {t('about_profile_switcher_title')}
              </h4>
              <div className="profile-switcher-buttons" style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.25)', padding: '4px', borderRadius: '8px' }}>
                <button 
                  className={`btn-switcher ${profile === 'all' ? 'active' : ''}`}
                  onClick={() => setProfile('all')}
                  style={{ 
                    flex: 1, 
                    border: 'none', 
                    background: profile === 'all' ? 'var(--accent-primary)' : 'transparent', 
                    color: profile === 'all' ? '#0f172a' : 'var(--text-secondary)', 
                    padding: '8px', 
                    borderRadius: '6px', 
                    cursor: 'pointer', 
                    fontWeight: 600, 
                    fontSize: '0.8rem', 
                    transition: 'all var(--transition-fast)' 
                  }}
                >
                  {t('profile_switcher_all')}
                </button>
                <button 
                  className={`btn-switcher ${profile === 'backend' ? 'active' : ''}`}
                  onClick={() => setProfile('backend')}
                  style={{ 
                    flex: 1, 
                    border: 'none', 
                    background: profile === 'backend' ? 'var(--accent-primary)' : 'transparent', 
                    color: profile === 'backend' ? '#0f172a' : 'var(--text-secondary)', 
                    padding: '8px', 
                    borderRadius: '6px', 
                    cursor: 'pointer', 
                    fontWeight: 600, 
                    fontSize: '0.8rem', 
                    transition: 'all var(--transition-fast)' 
                  }}
                >
                  {t('profile_switcher_backend')}
                </button>
                <button 
                  className={`btn-switcher ${profile === 'audit' ? 'active' : ''}`}
                  onClick={() => setProfile('audit')}
                  style={{ 
                    flex: 1, 
                    border: 'none', 
                    background: profile === 'audit' ? 'var(--accent-secondary)' : 'transparent', 
                    color: profile === 'audit' ? '#0f172a' : 'var(--text-secondary)', 
                    padding: '8px', 
                    borderRadius: '6px', 
                    cursor: 'pointer', 
                    fontWeight: 600, 
                    fontSize: '0.8rem', 
                    transition: 'all var(--transition-fast)' 
                  }}
                >
                  {t('profile_switcher_audit')}
                </button>
              </div>
            </div>

            <div className="cv-download-wrapper glass-card">
              <h4>{t('about_cv_title')}</h4>
              <div className="cv-buttons">
                <a href="./assets/pdf/hoja_de_vida_julian_isaza.pdf" download className="btn btn-primary" id="download-cv-es">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  <span>{t('about_cv_es')}</span>
                </a>
                <a href="./assets/pdf/profile_julian_isaza.pdf" download className="btn btn-secondary" id="download-cv-en">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  <span>{t('about_cv_en')}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
