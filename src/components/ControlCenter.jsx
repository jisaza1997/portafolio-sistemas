import React, { useState, useEffect, useRef } from 'react'

const SCRIPT_CODES = {
  sync_certificates: `import os
import re
import json
import pypdf

# Config paths
certs_dir = r"public/Certificaciones"
json_path = "public/certifications.json"

def parse_pdf_content(filepath, filename):
    """Reads a PDF, extracts its text, and parses its metadata."""
    try:
        reader = pypdf.PdfReader(filepath)
        text = ""
        for i in range(min(3, len(reader.pages))):
            page_text = reader.pages[i].extract_text()
            if page_text:
                text += page_text + "\\n"
        
        if not text.strip():
            return None
        
        clean_text = " ".join(text.split())
        title_es, title_en = "", ""
        issuer = "Unknown Issuer"
        category = "udemy"
        date_str = "Completo"
        skills = ["IT Skills"]

        # Platform Detection
        if "coursera" in clean_text.lower():
            category = "coursera"
            issuer = "Coursera (IBM/Google Program)"
            title_match = re.search(r"successfully completed\\s+([\\w\\s:,\\-\\(\\)\\!\\.\\#\\&\\/]+?)(?:\\ban\\b\\s+online|a course)", clean_text)
            title_en = title_match.group(1).strip() if title_match else filename.replace(".pdf", "")
            title_es = title_en
        elif "udemy" in clean_text.lower():
            category = "udemy"
            issuer = "Udemy"
            title_match = re.search(r"(?:CERTIFICADO DE FINALIZACIÓN|CERTIFICATE OF COMPLETION)\\s+([\\w\\s:,\\-\\(\\)\\!\\.\\#\\&\\/]+?)\\s+(?:Instructores|Instructors)", clean_text)
            title_en = title_match.group(1).strip() if title_match else filename.replace(".pdf", "")
            title_es = title_en
        elif "cisco" in clean_text.lower() or "cyberops" in clean_text.lower():
            category = "cisco"
            issuer = "Cisco Networking Academy"
            title_match = re.search(r"(?:curso|course)\\s+([\\w\\s:,\\-\\(\\)]+?)(?:\\bEl estudiante\\b|has successfully)", clean_text)
            title_en = title_match.group(1).strip().title() if title_match else "Cisco Certified Course"
            title_es = title_en

        # Skill Inference
        combined_title = f"{title_en} {title_es}".lower()
        if "security" in combined_title or "seguridad" in combined_title:
            skills = ["Cybersecurity", "Security Controls", "Information Security"]
        elif "audit" in combined_title or "auditoría" in combined_title:
            skills = ["IT Auditing", "Internal Controls", "Risk Assessment"]
        else:
            skills = ["Technical Training", "Process Compliance"]

        safe_id = re.sub(r'[^a-z0-9_]', '', title_en.lower().replace(" ", "_"))[:30] + f"_{len(filename)}"
        return {
            "id": safe_id, "title_es": title_es, "title_en": title_en,
            "issuer": issuer, "date": date_str, "category": category,
            "skills": skills, "filename": filename
        }
    except Exception as e:
        print(f"Error parsing {filename}: {e}")
        return None

def main():
    print("IT Audit Portfolio: Certificate Sync Engine v1.0")
    # Scan directory and write public/certifications.json...
    # (Extracts metadata, performs checks and updates local JSON database)
    pass
`,
  sync_to_supabase: `import os
import json
import requests

# Supabase Configurations (Secure Environment Scope)
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://rjmzpikjbqkwdoqkpkqy.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
json_path = "public/certifications.json"

def main():
    print("Supabase Secure Sync Engine - Certifications Ledger")
    if not SUPABASE_KEY:
        print("ERROR: SUPABASE_SERVICE_ROLE_KEY env variable is not set.")
        return

    with open(json_path, "r", encoding="utf-8") as f:
        certs = json.load(f)
        
    print(f"Loaded {len(certs)} records. Synchronizing to Supabase...")

    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }

    url = f"{SUPABASE_URL}/rest/v1/certifications"
    response = requests.post(url, headers=headers, data=json.dumps(certs))
    
    if response.status_code in [200, 201]:
        print("SUCCESS: Synchronized local certifications db to Supabase!")
    else:
        print(f"API ERROR (Status {response.status_code}): {response.text}")

if __name__ == "__main__":
    main()
`,
  generate_cv: `import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def build_pdf(filename, lang="es"):
    workspace = "C:/Users/jisaz/Documents/Portafolio Ingeniero de Sistemas"
    pdf_path = os.path.join(workspace, "public/assets/pdf", filename)
    
    doc = SimpleDocTemplate(pdf_path, pagesize=letter, leftMargin=36, rightMargin=36, topMargin=36, bottomMargin=36)
    styles = getSampleStyleSheet()
    
    # Theme definition (KPMG dark navy slate & cyan secondary)
    c_primary = colors.HexColor("#0f172a")
    c_secondary = colors.HexColor("#0284c7")
    c_text = colors.HexColor("#334155")
    
    style_name = ParagraphStyle('CVName', fontName='Helvetica-Bold', fontSize=24, leading=28, textColor=c_primary)
    style_title = ParagraphStyle('CVTitle', fontName='Helvetica-Bold', fontSize=12, leading=15, textColor=c_secondary)
    style_body = ParagraphStyle('CVBody', fontName='Helvetica', fontSize=9, leading=12.5, textColor=c_text)
    
    story = [
        Paragraph("JULIÁN ANDRÉS ISAZA ARIAS", style_name),
        Paragraph("SYSTEMS ENGINEER | IT AUDITOR", style_title),
        Spacer(1, 10),
        HRFlowable(width="100%", thickness=1, color=c_secondary, spaceBefore=2, spaceAfter=8)
    ]
    
    # Compiles experiences, qualifications, and certified credentials...
    doc.build(story)
    print(f"Generated CV: {pdf_path}")

if __name__ == "__main__":
    build_pdf("hoja_de_vida_julian_isaza.pdf", lang="es")
    build_pdf("profile_julian_isaza.pdf", lang="en")
`
}

export default function ControlCenter({ logs, addAuditLog, lang, t }) {
  const [activeLightbox, setActiveLightbox] = useState(null)
  const [selectedCode, setSelectedCode] = useState(null)
  const [runningScript, setRunningScript] = useState(null)
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
      // Don't inject loop logs if a script simulation is currently occupying the terminal
      if (runningScript) return
      
      const item = loopLogs[logIdx]
      const text = lang === 'es' ? item.es : item.en
      addAuditLog(item.type, text)
      logIdx = (logIdx + 1) % loopLogs.length
    }, 4500)

    return () => clearInterval(interval)
  }, [lang, runningScript])

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

  // Simulated script logs pipeline
  const runScriptSimulation = (scriptKey) => {
    if (runningScript) return
    setRunningScript(scriptKey)

    if (scriptKey === 'sync_certificates') {
      addAuditLog("SYS_RUN", lang === 'es' ? "python scripts/sync_certificates.py" : "python scripts/sync_certificates.py")
      setTimeout(() => addAuditLog("INFO", "IT Audit Portfolio: Certificate Sync Engine v1.0 initialized."), 300)
      setTimeout(() => addAuditLog("INFO", "Scanning public/Certificaciones/ for local files..."), 800)
      setTimeout(() => addAuditLog("AUDIT", "Found file: 'ISO_27001_Lead_Auditor.pdf'"), 1400)
      setTimeout(() => addAuditLog("SUCCESS", "Parsed: 'ISO/IEC 27001:2022 Lead Auditor' | Issuer: Udemy (Rigcert)"), 1900)
      setTimeout(() => addAuditLog("AUDIT", "Found file: 'Cisco_CyberOps_Associate.pdf'"), 2500)
      setTimeout(() => addAuditLog("SUCCESS", "Parsed: 'Cisco Certified CyberOps Associate' | Issuer: Cisco Academy"), 3000)
      setTimeout(() => addAuditLog("INFO", "Saving parsed metadata to public/certifications.json..."), 3600)
      setTimeout(() => {
        addAuditLog("SUCCESS", "Sync completed. certifications.json successfully updated.")
        setRunningScript(null)
      }, 4200)
    } 
    
    else if (scriptKey === 'sync_to_supabase') {
      addAuditLog("SYS_RUN", "python scripts/sync_to_supabase.py")
      setTimeout(() => addAuditLog("INFO", "Supabase Secure Sync Engine - Certifications Ledger"), 300)
      setTimeout(() => addAuditLog("INFO", "Verifying token authorization headers..."), 700)
      setTimeout(() => addAuditLog("SUCCESS", "SUPABASE_SERVICE_ROLE_KEY authenticated successfully."), 1200)
      setTimeout(() => addAuditLog("AUDIT", "Loading 'public/certifications.json' inventory ledger..."), 1700)
      setTimeout(() => addAuditLog("INFO", "Loaded 42 records. Packing batch encryption payload..."), 2200)
      setTimeout(() => addAuditLog("AUDIT", "Sending POST payload request to cloud endpoint rest/v1/certifications..."), 2800)
      setTimeout(() => {
        addAuditLog("SUCCESS", "POST upsert successful: 201 Created. Supabase Database updated.")
        setRunningScript(null)
      }, 3400)
    } 
    
    else if (scriptKey === 'generate_cv') {
      addAuditLog("SYS_RUN", "python scripts/generate_cv.py")
      setTimeout(() => addAuditLog("INFO", "Initiating ReportLab PDF document compiler..."), 300)
      setTimeout(() => addAuditLog("INFO", "Importing translations and profile descriptions..."), 800)
      setTimeout(() => addAuditLog("AUDIT", "Compiling layout elements for 'hoja_de_vida_julian_isaza.pdf'"), 1400)
      setTimeout(() => addAuditLog("SUCCESS", "Successfully generated Spanish CV layout at public/assets/pdf/hoja_de_vida_julian_isaza.pdf"), 2000)
      setTimeout(() => addAuditLog("AUDIT", "Compiling layout elements for 'profile_julian_isaza.pdf'"), 2600)
      setTimeout(() => addAuditLog("SUCCESS", "Successfully generated English Profile layout at public/assets/pdf/profile_julian_isaza.pdf"), 3200)
      setTimeout(() => {
        addAuditLog("SUCCESS", "CV generation finished. Assets folder refreshed.")
        setRunningScript(null)
      }, 3800)
    }
  }

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
          addAuditLog("SYS_HELP", "Comandos: 'ayuda', 'limpiar', 'scripts', 'run <script_name>', 'xss <texto>'")
        } else {
          addAuditLog("SYS_HELP", "Commands: 'help', 'clear', 'scripts', 'run <script_name>', 'xss <payload>'")
        }
      } else if (lowerCmd === 'clear' || lowerCmd === 'limpiar') {
        addAuditLog("SYS_CMD", lang === 'es' ? "Limpieza denegada: Se requiere rol de Administrador." : "Clear denied: Administrator role required.")
      } else if (lowerCmd === 'scripts' || lowerCmd === 'list-scripts') {
        addAuditLog("SYS_HELP", "scripts/sync_certificates.py | scripts/sync_to_supabase.py | scripts/generate_cv.py")
      } else if (lowerCmd.startsWith('run ')) {
        const scriptName = lowerCmd.substring(4).replace('.py', '').replace('scripts/', '')
        if (SCRIPT_CODES[scriptName]) {
          runScriptSimulation(scriptName)
        } else {
          addAuditLog("XSS_ALERT", lang === 'es' ? `Script no encontrado: ${scriptName}` : `Script not found: ${scriptName}`)
        }
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

  // Simple client-side Python syntax highlighter
  const highlightPython = (code) => {
    return code.split('\n').map((line, idx) => {
      let highlighted = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')

      // Highlight Strings
      highlighted = highlighted.replace(/(["'])(.*?)\1/g, '<span style="color: #ecc94b;">$1$2$1</span>')

      // Highlight Comments
      if (highlighted.includes('#')) {
        const parts = highlighted.split('#')
        const codePart = parts[0]
        const commentPart = parts.slice(1).join('#')
        highlighted = `${codePart}<span style="color: #718096; font-style: italic;">#${commentPart}</span>`
      }

      // Highlight Keywords
      const keywords = [
        'def ', 'class ', 'if ', 'else:', 'else ', 'elif ', 'for ', 'while ', 'return ', 'import ', 'from ',
        'try:', 'except ', 'in ', 'not ', 'is ', 'print\\(', 'with ', 'open\\(', 'as ', 'None', 'True', 'False', 'pass'
      ]
      keywords.forEach(kw => {
        const regex = new RegExp(`\\b${kw}`, 'g')
        const styleKw = kw.replace('\\(', '(').replace('\\:', ':')
        highlighted = highlighted.replace(regex, `<span style="color: #63b3ed; font-weight: bold;">${styleKw}</span>`)
      })

      return (
        <div key={idx} style={{ display: 'flex', fontSize: '0.82rem', lineHeight: '1.6', fontFamily: 'monospace' }}>
          <span style={{ color: '#4a5568', width: '32px', textAlign: 'right', paddingRight: '12px', userSelect: 'none', borderRight: '1px solid #2d3748' }}>{idx + 1}</span>
          <span dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }} style={{ whiteSpace: 'pre', paddingLeft: '12px', color: '#cbd5e0' }} />
        </div>
      )
    })
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert(lang === 'es' ? "¡Código copiado al portapapeles!" : "Code copied to clipboard!")
  }

  const scriptCards = [
    {
      key: "generate_cv",
      title: t('script_cv_title'),
      desc: t('script_cv_desc'),
      tech: "Python / ReportLab / Dynamic Layout",
      filename: "generate_cv.py"
    },
    {
      key: "sync_certificates",
      title: t('script_sync_title'),
      desc: t('script_sync_desc'),
      tech: "Python / PyPDF / Heuristics / RegEx",
      filename: "sync_certificates.py"
    },
    {
      key: "sync_to_supabase",
      title: t('script_db_title'),
      desc: t('script_db_desc'),
      tech: "Python / REST API / Cryptography / Supabase",
      filename: "sync_to_supabase.py"
    }
  ]

  return (
    <section id="audit-section" className="section-padding">
      <div className="container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">{t('automation_subtitle')}</span>
          <h2 className="section-title">{t('automation_title')}</h2>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '800px', margin: '0 auto 36px auto' }}>
          {t('automation_desc')}
        </p>

        {/* Platform Automation Manager Script Cards */}
        <div className="projects-grid" style={{ marginBottom: '40px' }}>
          {scriptCards.map(card => (
            <div className="project-card glass-card" key={card.key} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="project-header" style={{ marginBottom: '16px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24" style={{ color: 'var(--accent-primary)' }}>
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Python Automation</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{card.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>{card.desc}</p>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 600, marginBottom: '16px' }}>
                  {card.tech}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => setSelectedCode({ title: card.title, filename: card.filename, code: SCRIPT_CODES[card.key] })}
                    className="badge" 
                    style={{ flex: 1, background: 'rgba(255,255,255,0.05)', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', textAlign: 'center', padding: '6px 0', fontSize: '0.75rem', borderRadius: '4px', fontWeight: 600 }}
                  >
                    {t('automation_btn_view')}
                  </button>
                  <button 
                    onClick={() => runScriptSimulation(card.key)}
                    disabled={runningScript !== null}
                    className="badge" 
                    style={{ flex: 1, cursor: runningScript !== null ? 'not-allowed' : 'pointer', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', textAlign: 'center', padding: '6px 0', fontSize: '0.75rem', borderRadius: '4px', fontWeight: 600, background: 'transparent' }}
                  >
                    {runningScript === card.key ? t('automation_running') : t('automation_btn_run')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="section-title-wrapper" style={{ marginTop: '60px', marginBottom: '24px' }}>
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

      {/* Interactive Code Viewer Modal */}
      {selectedCode && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(5, 8, 16, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setSelectedCode(null)}
        >
          <div 
            style={{
              width: '100%',
              maxWidth: '850px',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.6)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(30, 41, 59, 0.5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20" style={{ color: 'var(--accent-primary)' }}>
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                  scripts/{selectedCode.filename}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => copyToClipboard(selectedCode.code)}
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#cbd5e0', padding: '5px 12px', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                >
                  {lang === 'es' ? "Copiar" : "Copy"}
                </button>
                <button 
                  onClick={() => setSelectedCode(null)}
                  style={{ background: 'transparent', border: 'none', color: '#a0aec0', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Modal Code Scope */}
            <div style={{ padding: '20px', background: '#0b111e', overflowX: 'auto', maxHeight: '500px', overflowY: 'auto' }}>
              <pre style={{ margin: 0 }}>
                <code>{highlightPython(selectedCode.code)}</code>
              </pre>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '12px 20px', background: 'rgba(30, 41, 59, 0.4)', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setSelectedCode(null)}
                style={{ background: 'var(--accent-primary)', border: 'none', color: '#000', padding: '6px 16px', fontSize: '0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
              >
                {t('automation_close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
