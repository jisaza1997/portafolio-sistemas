import React from 'react'

export default function Skills({ t }) {
  return (
    <section id="skills" className="section-padding">
      <div className="container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">{t('nav_skills')}</span>
          <h2 className="section-title">{t('skills_title')}</h2>
        </div>
        
        <div className="skills-grid">
          {/* Backend Development */}
          <div className="skills-category glass-card" id="skills-cat-backend">
            <div className="category-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                <polyline points="2 17 12 22 22 17"/>
                <polyline points="2 12 12 17 22 12"/>
              </svg>
            </div>
            <h3>{t('skills_backend')}</h3>
            <div className="skills-list">
              <div className="skill-tag"><span>Python / Go / Java</span> <span className="level">{t('skills_level_advanced')}</span></div>
              <div className="skill-tag"><span>SQL / MySQL / Oracle</span> <span className="level">{t('skills_level_advanced')}</span></div>
              <div className="skill-tag"><span>Ciclo de Vida de Software</span> <span className="level">{t('skills_level_advanced')}</span></div>
              <div className="skill-tag"><span>Linux (Línea de Comandos)</span> <span className="level">{t('skills_level_intermediate')}</span></div>
              <div className="skill-tag"><span>Control de Versiones (Git)</span> <span className="level">{t('skills_level_advanced')}</span></div>
            </div>
          </div>
          
          {/* IT Audit */}
          <div className="skills-category glass-card" id="skills-cat-audit">
            <div className="category-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <h3>{t('skills_audit')}</h3>
            <div className="skills-list">
              <div className="skill-tag"><span>Gobernanza (COBIT / ITIL)</span> <span className="level">{t('skills_level_advanced')}</span></div>
              <div className="skill-tag"><span>Controles Generales (GITCs)</span> <span className="level">{t('skills_level_advanced')}</span></div>
              <div className="skill-tag"><span>SOX & BIA Compliance</span> <span className="level">{t('skills_level_advanced')}</span></div>
              <div className="skill-tag"><span>Normas PCAOB / AICPA</span> <span className="level">{t('skills_level_advanced')}</span></div>
              <div className="skill-tag"><span>Auditoría de ERPs (SAP)</span> <span className="level">{t('skills_level_intermediate')}</span></div>
            </div>
          </div>
          
          {/* Security & Risk */}
          <div className="skills-category glass-card" id="skills-cat-security">
            <div className="category-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3>{t('skills_security')}</h3>
            <div className="skills-list">
              <div className="skill-tag"><span>ISO 27001 Lead Auditor</span> <span className="level">{t('skills_level_advanced')}</span></div>
              <div className="skill-tag"><span>Operaciones Ciberseguridad</span> <span className="level">{t('skills_level_advanced')}</span></div>
              <div className="skill-tag"><span>Ethical Hacking</span> <span className="level">{t('skills_level_intermediate')}</span></div>
              <div className="skill-tag"><span>Cisco CyberOps Associate</span> <span className="level">{t('skills_level_advanced')}</span></div>
              <div className="skill-tag"><span>Controles en la Nube (AWS/GCP)</span> <span className="level">{t('skills_level_intermediate')}</span></div>
            </div>
          </div>
          
          {/* Tools & Analytics */}
          <div className="skills-category glass-card" id="skills-cat-tools">
            <div className="category-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <h3>{t('skills_tools')}</h3>
            <div className="skills-list">
              <div className="skill-tag"><span>DataSnipper / IDEA Script</span> <span className="level">{t('skills_level_advanced')}</span></div>
              <div className="skill-tag"><span>Power BI & Analítica</span> <span className="level">{t('skills_level_advanced')}</span></div>
              <div className="skill-tag"><span>Sistemas de Tickets</span> <span className="level">{t('skills_level_advanced')}</span></div>
              <div className="skill-tag"><span>RPA & Virtualización</span> <span className="level">{t('skills_level_intermediate')}</span></div>
              <div className="skill-tag"><span>Excel Avanzado</span> <span className="level">{t('skills_level_advanced')}</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
