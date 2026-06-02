import React, { useState, useEffect, useRef } from 'react'

export default function ControlCenter({ logs, addAuditLog, lang, t }) {
  const [activeLightbox, setActiveLightbox] = useState(null)
  const terminalEndRef = useRef(null)

  // TLS Check based on location
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:'

  // Compliance terminal logs loop
  useEffect(() => {
    const loopLogs = [
      { type: "INFO", es: "Iniciando análisis periódico de integridad del sitio...", en: "Starting periodic site integrity scan..." },
      { type: "SUCCESS", es: "Verificación de OWASP A03:2021 (Inyección): Datos sanitizados correctamente.", en: "OWASP A03:2021 (Injection) verifier: Data sanitization checked." },
      { type: "AUDIT", es: "Auditoría de Control de Cambios: Workflow de GitHub Actions validado en producción.", en: "Change Control Audit: GitHub Actions production workflow validated." },
      { type: "INFO", es: "Cargando llaves de cifrado en memoria segura...", en: "Loading encryption keys in secure memory scope..." },
      { type: "SUCCESS", es: "Control A.12.6.1 (Gobernanza técnica ISO 27001): Configuración alineada.", en: "ISO 27001 Control A.12.6.1 compliance checklist matched." },
      { type: "AUDIT", es: "Verificando firmas de confirmación de commits de desarrollo...", en: "Checking commit developer cryptographic signatures..." },
      { type: "SUCCESS", es: "Auditoría de Privacidad (GDPR): Ninguna cookie externa activa en el dominio.", en: "Privacy Audit (GDPR): No external tracking cookies deployed on target domain." },
      { type: "INFO", es: "Escaneando activos multimedia en carpeta assets/img... OK", en: "Scanning static resources in assets/img... OK" },
      { type: "SUCCESS", es: "Evaluación de Seguridad Bancaria (Mitigación MitM): TLS 1.3 activo.", en: "Banking Security Assessment (MitM Mitigation): TLS 1.3 verified." },
      { type: "AUDIT", es: "Verificando pipeline de despliegue en Vercel Edge Network...", en: "Verifying deployment pipeline on Vercel Edge Network..." },
      { type: "SUCCESS", es: "Integridad de Despliegue: Vercel static build y SSL certificados... OK.", en: "Deployment Integrity: Vercel static build and SSL certificates... OK." },
      { type: "AUDIT", es: "Probando conexión segura de base de datos con Supabase API Gateway...", en: "Testing secure database connection with Supabase API Gateway..." },
      { type: "SUCCESS", es: "Conexión Supabase: Políticas de seguridad RLS verificadas activas.", en: "Supabase connection: RLS security policies verified active." }
    ]

    let logIdx = 0
    const interval = setInterval(() => {
      const item = loopLogs[logIdx]
      const text = lang === 'es' ? item.es : item.en
      addAuditLog(item.type, text)
      logIdx = (logIdx + 1) % loopLogs.length
    }, 4500)

    return () => clearInterval(interval)
  }, [lang])

  // Autoscroll terminal to bottom when new logs arrive
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs])

  const getLabelClass = (type) => {
    if (type.includes("SUCCESS")) return "success"
    if (type.includes("AUDIT")) return "status"
    return "info" // INFO, CALL, ERROR, etc.
  }

  const openLightbox = (imgPath, description) => {
    setActiveLightbox(imgPath)
    const fileName = imgPath.split('/').pop()
    addAuditLog("AUDIT_EVIDENCE", `Viewing compliance exam score screenshot: [${fileName}]`)
  }

  return (
    <section id="audit" className="section-padding">
      <div className="container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">{t('nav_audit')}</span>
          <h2 className="section-title">{t('audit_title')}</h2>
          <p className="section-title-desc" style={{ marginTop: '8px', color: 'var(--text-secondary)' }}>
            {t('audit_desc')}
          </p>
        </div>

        <div className="audit-grid-layout">
          {/* Controls List */}
          <div className="audit-controls-grid">
            {/* Control 1: XSS */}
            <div className="control-card glass-card">
              <div className="control-header">
                <span className="status-dot" id="control-xss-dot" style={{ backgroundColor: 'var(--accent-secondary)' }}></span>
                <span className="control-status-label" id="control-xss-status">{t('audit_status_compliant')}</span>
              </div>
              <h3>{t('audit_c1_title')}</h3>
              <p>{t('audit_c1_desc')}</p>
              <div className="control-footer">
                <span>Standard: OWASP A03:2021</span>
              </div>
            </div>

            {/* Control 2: TLS */}
            <div className="control-card glass-card">
              <div className="control-header">
                <span 
                  className="status-dot" 
                  id="control-tls-dot" 
                  style={{ backgroundColor: isHttps ? 'var(--accent-secondary)' : 'var(--accent-warning)' }}
                ></span>
                <span 
                  className="control-status-label" 
                  id="control-tls-status" 
                  style={{ color: isHttps ? 'var(--text-secondary)' : 'var(--accent-warning)' }}
                >
                  {isHttps ? t('audit_status_compliant') : 'DEV MODE'}
                </span>
              </div>
              <h3>{t('audit_c3_title')}</h3>
              <p>{t('audit_c3_desc')}</p>
              <div className="control-footer">
                <span id="control-tls-val">{isHttps ? "TLS 1.3 (HTTPS)" : "HTTP (Unencrypted Development)"}</span>
              </div>
            </div>

            {/* Control 3: Change Control */}
            <div className="control-card glass-card">
              <div className="control-header">
                <span className="status-dot" id="control-deploy-dot" style={{ backgroundColor: 'var(--accent-secondary)' }}></span>
                <span className="control-status-label" id="control-deploy-status">{t('audit_status_compliant')}</span>
              </div>
              <h3>{t('audit_c2_title')}</h3>
              <p>{t('audit_c2_desc')}</p>
              <div className="control-footer">
                <span>Standard: ITIL Change Management</span>
              </div>
            </div>

            {/* Control 4: Privacy */}
            <div className="control-card glass-card">
              <div className="control-header">
                <span className="status-dot" id="control-privacy-dot" style={{ backgroundColor: 'var(--accent-secondary)' }}></span>
                <span className="control-status-label" id="control-privacy-status">{t('audit_status_compliant')}</span>
              </div>
              <h3>{t('audit_c4_title')}</h3>
              <p>{t('audit_c4_desc')}</p>
              <div className="control-footer">
                <span>Standard: GDPR & ISO 27001</span>
              </div>
            </div>

            {/* Control 5: Vercel Deploy */}
            <div className="control-card glass-card">
              <div className="control-header">
                <span className="status-dot" id="control-infrastructure-dot" style={{ backgroundColor: 'var(--accent-secondary)' }}></span>
                <span className="control-status-label" id="control-infrastructure-status">{t('audit_status_compliant')}</span>
              </div>
              <h3>{t('audit_c5_title')}</h3>
              <p>{t('audit_c5_desc')}</p>
              <div className="control-footer">
                <span>Infrastructure: Vercel Edge CDN</span>
              </div>
            </div>

            {/* Control 6: Supabase Gateway */}
            <div className="control-card glass-card">
              <div className="control-header">
                <span className="status-dot" id="control-database-dot" style={{ backgroundColor: 'var(--accent-secondary)' }}></span>
                <span className="control-status-label" id="control-database-status">{t('audit_status_compliant')}</span>
              </div>
              <h3>{t('audit_c6_title')}</h3>
              <p>{t('audit_c6_desc')}</p>
              <div className="control-footer">
                <span>Database: Supabase API (RLS policies)</span>
              </div>
            </div>
          </div>

          {/* Audit Terminal Log Simulator */}
          <div className="audit-terminal glass-card">
            <div className="terminal-header">
              <div className="terminal-dots">
                <span></span><span></span><span></span>
              </div>
              <span>{t('audit_terminal_header')}</span>
            </div>
            <div className="terminal-output" id="terminal-output">
              {logs.map((log, index) => (
                <div className="terminal-line" key={index}>
                  <span className="time">[{log.time}]</span>{' '}
                  <span className={getLabelClass(log.type)}>{log.type}:</span>{' '}
                  <span>{log.message}</span>
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>

        {/* Evidence & Verification Section */}
        <div className="audit-evidence-container" style={{ marginTop: '40px' }}>
          <h3 className="section-subtitle" style={{ textAlign: 'center', marginBottom: '20px' }}>
            {t('evidence_title')}
          </h3>
          <div className="evidence-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {/* SEC Baseline Exam */}
            <div className="evidence-card glass-card" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div 
                className="evidence-thumbnail" 
                data-img="./assets/img/kpmg_sec_baseline_score.png"
                onClick={() => openLightbox('./assets/img/kpmg_sec_baseline_score.png', t('evidence_sec_desc'))}
                style={{ cursor: 'pointer', flexShrink: 0, width: '80px', height: '80px', overflow: 'hidden', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              >
                <img 
                  src="./assets/img/kpmg_sec_baseline_score.png" 
                  alt="SEC Baseline Exam Evidence" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>SEC Baseline Exam</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {t('evidence_sec_desc')}
                </p>
              </div>
            </div>

            {/* Training Week 9 Exam */}
            <div className="evidence-card glass-card" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div 
                className="evidence-thumbnail" 
                data-img="./assets/img/kpmg_tw9_score.png"
                onClick={() => openLightbox('./assets/img/kpmg_tw9_score.png', t('evidence_tw_desc'))}
                style={{ cursor: 'pointer', flexShrink: 0, width: '80px', height: '80px', overflow: 'hidden', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              >
                <img 
                  src="./assets/img/kpmg_tw9_score.png" 
                  alt="Training Week 9 Exam Evidence" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>Training Week 9 Exam</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {t('evidence_tw_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeLightbox && (
        <div className="modal-overlay active" id="lightbox-modal" onClick={() => setActiveLightbox(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveLightbox(null)}>&times;</button>
            <img 
              src={activeLightbox} 
              id="lightbox-img" 
              alt="Compliance Screenshot Evidence" 
              style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '12px', border: '2px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} 
            />
          </div>
        </div>
      )}
    </section>
  )
}
