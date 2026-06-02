import React from 'react'

export default function Experience({ t }) {
  // KPMG description might not be rendered dynamically inside the original HTML directly since it had no bullets loaded by default (or it was loaded dynamically by JS).
  // Let's render all descriptions dynamically using React!
  const getBullets = (key) => {
    const list = t(key)
    if (Array.isArray(list)) {
      return list.map((bullet, idx) => <li key={idx}>{bullet}</li>)
    }
    return null
  }

  return (
    <section id="experience" className="section-padding">
      <div className="container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">{t('nav_experience')}</span>
          <h2 className="section-title">{t('exp_title')}</h2>
        </div>
        
        <div className="timeline">
          {/* KPMG */}
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-date">2024 - Pres.</div>
            <div className="timeline-content glass-card">
              <h3>KPMG Colombia</h3>
              <span className="role-badge">{t('exp_kpmg_role')}</span>
              <ul id="exp-kpmg-bullets">
                {getBullets('exp_kpmg_desc')}
              </ul>
            </div>
          </div>
          
          {/* Bancolombia */}
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-date">2022 - 2024</div>
            <div className="timeline-content glass-card">
              <h3>Bancolombia</h3>
              <span className="role-badge">{t('exp_bancolombia_role')}</span>
              <ul id="exp-bancolombia-bullets">
                {getBullets('exp_bancolombia_desc')}
              </ul>
              <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
                <a 
                  href="./assets/pdf/certificado_laboral_bancolombia.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-secondary" 
                  style={{ fontSize: '0.8rem', padding: '8px 16px', borderRadius: '8px' }} 
                  id="btn-cert-bancolombia"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style={{ marginRight: '4px', verticalAlign: 'middle' }}>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  <span>{t('exp_view_certificate')}</span>
                </a>
              </div>
            </div>
          </div>
          
          {/* Unisys */}
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-date">2022</div>
            <div className="timeline-content glass-card">
              <h3>Unisys</h3>
              <span className="role-badge">{t('exp_unisys_role')}</span>
              <ul id="exp-unisys-bullets">
                {getBullets('exp_unisys_desc')}
              </ul>
              <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
                <a 
                  href="./assets/pdf/certificado_laboral_unisys.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-secondary" 
                  style={{ fontSize: '0.8rem', padding: '8px 16px', borderRadius: '8px' }} 
                  id="btn-cert-unisys"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style={{ marginRight: '4px', verticalAlign: 'middle' }}>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  <span>{t('exp_view_certificate')}</span>
                </a>
              </div>
            </div>
          </div>
          
          {/* DAWA */}
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-date">2021 - 2022</div>
            <div className="timeline-content glass-card">
              <h3>DAWA Solutions Group</h3>
              <span className="role-badge">{t('exp_dawa_role')}</span>
              <ul id="exp-dawa-bullets">
                {getBullets('exp_dawa_desc')}
              </ul>
              <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
                <a 
                  href="./assets/pdf/certificado_laboral_dawa.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-secondary" 
                  style={{ fontSize: '0.8rem', padding: '8px 16px', borderRadius: '8px' }} 
                  id="btn-cert-dawa"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style={{ marginRight: '4px', verticalAlign: 'middle' }}>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  <span>{t('exp_view_certificate')}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
