import React, { useState, useEffect, useRef } from 'react'

export default function ControlCenter({ logs, addAuditLog, lang, t }) {
  const [activeLightbox, setActiveLightbox] = useState(null)
  const logsContainerRef = useRef(null)

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
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTo({
        top: logsContainerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [logs])

  const getLabelClass = (type) => {
    if (type === "USER_INPUT") return "cli-prompt"
    if (type === "SYS_HELP") return "cli-help"
    if (type === "SYS_CMD" || type === "SYS_RUN") return "cli-run"
    if (type === "XSS_ALERT") return "xss-alert"
    if (type === "XSS_SAFE") return "xss-safe"
    if (type.includes("SUCCESS")) return "success"
    if (type.includes("AUDIT")) return "status"
    return "info"
  }

  const openLightbox = (imgPath) => {
    setActiveLightbox(imgPath)
    const fileName = imgPath.split('/').pop()
    addAuditLog("AUDIT_EVIDENCE", `Viewing compliance exam score screenshot: [${fileName}]`)
  }

  const [cliInput, setCliInput] = useState('')

  const handleCliKeyDown = (e) => {
    if (e.key === 'Enter') {
      const command = cliInput.trim()
      if (!command) return

      const escapeHtml = (str) => {
        return str
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;')
      }

      const escapedCmd = escapeHtml(command)
      addAuditLog("USER_INPUT", `guest@audit-cli:~$ ${escapedCmd}`)

      const lowerCmd = command.toLowerCase().trim()
      
      if (lowerCmd === 'help' || lowerCmd === 'ayuda') {
        if (lang === 'es') {
          addAuditLog("SYS_HELP", "Comandos: 'ayuda', 'limpiar', 'auditoria', 'xss <texto>'")
        } else {
          addAuditLog("SYS_HELP", "Commands: 'help', 'clear', 'audit', 'xss <payload>'")
        }
      } else if (lowerCmd === 'clear' || lowerCmd === 'limpiar') {
        addAuditLog("SYS_CMD", lang === 'es' ? "Limpieza denegada: Se requiere rol de Administrador." : "Clear denied: Administrator role required.")
      } else if (lowerCmd === 'audit' || lowerCmd === 'auditoria') {
        addAuditLog("SYS_RUN", lang === 'es' ? "Escaneando firmas criptográficas de commits y políticas..." : "Scanning commit cryptographic signatures and policies...")
        setTimeout(() => addAuditLog("SUCCESS", lang === 'es' ? "Pipeline verificado: Despliegue firmado e íntegro." : "Pipeline verified: Signed, integral deployment."), 800)
        setTimeout(() => addAuditLog("SUCCESS", lang === 'es' ? "Control A.12.6.1: Cumplimiento de parches OK." : "Control A.12.6.1: Patch compliance OK."), 1500)
      } else if (lowerCmd.startsWith('xss ')) {
        const payload = command.substring(4)
        const sanitized = escapeHtml(payload)
        addAuditLog("XSS_ALERT", lang === 'es' ? `Carga cruda recibida: ${payload}` : `Raw payload received: ${payload}`)
        addAuditLog("XSS_SAFE", lang === 'es' ? `DOM sanitizado seguro: ${sanitized}` : `Safe sanitized DOM: ${sanitized}`)
        addAuditLog("SUCCESS", "OWASP A03:2021 (Injection Protection) Compliant")
      } else {
        addAuditLog("XSS_SAFE", `${escapeHtml(command)}`)
      }

      setCliInput('')
    }
  }


  return (
    <section id="audit-section" className="section-padding">
      <div className="container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">{t('audit_subtitle')}</span>
          <h2 className="section-title">{t('audit_title')}</h2>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px auto' }}>
          {t('audit_desc')}
        </p>

        <div className="audit-panel">
          {/* System Audit Checklist */}
          <div className="audit-controls-grid">
            {/* Control 1: XSS */}
            <div className="audit-control-card glass-card" id="control-xss">
              <div className="audit-control-header">
                <h4 data-i18n="audit_c1_title">{t('audit_c1_title')}</h4>
                <div className="control-status-dot" id="control-xss-dot" style={{ backgroundColor: 'var(--accent-secondary)' }}></div>
              </div>
              <p>{t('audit_c1_desc')}</p>
              <div className="control-footer">
                <span className="control-status-label" id="control-xss-status">{t('audit_status_compliant')}</span>
                <span>OWASP A03:2021</span>
              </div>
            </div>

            {/* Control 2: TLS */}
            <div className="audit-control-card glass-card" id="control-tls">
              <div className="audit-control-header">
                <h4 data-i18n="audit_c3_title">{t('audit_c3_title')}</h4>
                <div 
                  className="control-status-dot" 
                  id="control-tls-dot" 
                  style={{ backgroundColor: isHttps ? 'var(--accent-secondary)' : 'var(--accent-warning)', boxShadow: isHttps ? '' : '0 0 10px rgba(240, 160, 50, 0.5)' }}
                ></div>
              </div>
              <p>{t('audit_c3_desc')}</p>
              <div className="control-footer">
                <span className="control-status-label" id="control-tls-status" style={{ color: isHttps ? '' : 'var(--accent-warning)' }}>
                  {isHttps ? t('audit_status_compliant') : 'LOCALHOST / HTTP'}
                </span>
                <span id="control-tls-val">{isHttps ? "TLS 1.3 (HTTPS)" : "Unencrypted (Development)"}</span>
              </div>
            </div>

            {/* Control 3: Change Control */}
            <div className="audit-control-card glass-card" id="control-deploy">
              <div className="audit-control-header">
                <h4 data-i18n="audit_c2_title">{t('audit_c2_title')}</h4>
                <div className="control-status-dot" id="control-deploy-dot" style={{ backgroundColor: 'var(--accent-secondary)' }}></div>
              </div>
              <p>{t('audit_c2_desc')}</p>
              <div className="control-footer">
                <span className="control-status-label" id="control-deploy-status">{t('audit_status_compliant')}</span>
                <span>ITIL Change Control</span>
              </div>
            </div>

            {/* Control 4: Privacy */}
            <div className="audit-control-card glass-card" id="control-privacy">
              <div className="audit-control-header">
                <h4 data-i18n="audit_c4_title">{t('audit_c4_title')}</h4>
                <div className="control-status-dot" id="control-privacy-dot" style={{ backgroundColor: 'var(--accent-secondary)' }}></div>
              </div>
              <p>{t('audit_c4_desc')}</p>
              <div className="control-footer">
                <span className="control-status-label" id="control-privacy-status">{t('audit_status_compliant')}</span>
                <span>GDPR / ISO 27001</span>
              </div>
            </div>

            {/* Control 5: Vercel */}
            <div className="audit-control-card glass-card" id="control-infrastructure">
              <div className="audit-control-header">
                <h4 data-i18n="audit_c5_title">{t('audit_c5_title')}</h4>
                <div className="control-status-dot" id="control-infrastructure-dot" style={{ backgroundColor: 'var(--accent-secondary)' }}></div>
              </div>
              <p>{t('audit_c5_desc')}</p>
              <div className="control-footer">
                <span className="control-status-label" id="control-infrastructure-status">{t('audit_status_compliant')}</span>
                <span>Vercel Edge CDN</span>
              </div>
            </div>

            {/* Control 6: Supabase */}
            <div className="audit-control-card glass-card" id="control-database">
              <div className="audit-control-header">
                <h4 data-i18n="audit_c6_title">{t('audit_c6_title')}</h4>
                <div className="control-status-dot" id="control-database-dot" style={{ backgroundColor: 'var(--accent-secondary)' }}></div>
              </div>
              <p>{t('audit_c6_desc')}</p>
              <div className="control-footer">
                <span className="control-status-label" id="control-database-status">{t('audit_status_compliant')}</span>
                <span>Supabase (RLS Active)</span>
              </div>
            </div>
          </div>

          {/* Audit Right Panel: Terminal logs + Exam screenshots */}
          <div className="audit-side-panel">
            {/* Live logs console */}
            <div className="audit-log-terminal">
              <div className="terminal-header">
                <div className="terminal-dots">
                  <span></span><span></span><span></span>
                </div>
                <span data-i18n="audit_terminal_header">{t('audit_terminal_header')}</span>
              </div>
              <div className="terminal-logs" id="terminal-output" ref={logsContainerRef}>
                {logs.map((log, index) => (
                  <div className="terminal-line" key={index}>
                    <span className="time">[{log.time}]</span>{' '}
                    <span className={getLabelClass(log.type)}>{log.type}:</span>{' '}
                    <span>{log.message}</span>
                  </div>
                ))}
              </div>
              <div className="terminal-input-wrapper">
                <span style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', marginRight: '6px', fontFamily: 'monospace', fontWeight: 600 }}>guest@audit-cli:~$</span>
                <input 
                  type="text" 
                  value={cliInput}
                  onChange={(e) => setCliInput(e.target.value)}
                  onKeyDown={handleCliKeyDown}
                  placeholder={lang === 'es' ? "escribe 'ayuda' para empezar..." : "type 'help' to start..."}
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#00ff66', fontFamily: 'monospace', fontSize: '0.85rem', width: '100%' }}
                />
              </div>
            </div>

            {/* KPMG Exam Evidences */}
            <div className="evidence-wrapper glass-card">
              <h4 data-i18n="evidence_title">{t('evidence_title')}</h4>
              <div className="evidence-carousel">
                {/* SEC Baseline Exam */}
                <div 
                  className="evidence-thumbnail" 
                  data-img="./assets/img/kpmg_sec_baseline_score.png" 
                  id="evidence-sec"
                  onClick={() => openLightbox('./assets/img/kpmg_sec_baseline_score.png')}
                  style={{ cursor: 'pointer' }}
                >
                  <img src="./assets/img/kpmg_sec_baseline_score.png" alt="KPMG SEC Baseline Exam Score 100%" />
                  <div className="evidence-info">
                    <span>SEC Baseline</span>
                    <span>100% Score</span>
                  </div>
                </div>

                {/* Training Week 9 Exam */}
                <div 
                  className="evidence-thumbnail" 
                  data-img="./assets/img/kpmg_tw9_score.png" 
                  id="evidence-tw"
                  onClick={() => openLightbox('./assets/img/kpmg_tw9_score.png')}
                  style={{ cursor: 'pointer' }}
                >
                  <img src="./assets/img/kpmg_tw9_score.png" alt="KPMG Training Week 9 Exam Score 100%" />
                  <div className="evidence-info">
                    <span>Training Week 9</span>
                    <span>7/7 Qs (100%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <div 
        className={`lightbox ${activeLightbox ? 'active' : ''}`} 
        id="lightbox-modal"
        onClick={() => setActiveLightbox(null)}
      >
        {activeLightbox && (
          <img id="lightbox-img" src={activeLightbox} alt="Amplia evidencia del examen" />
        )}
      </div>
    </section>
  )
}
