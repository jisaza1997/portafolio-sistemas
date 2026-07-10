import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

def build_pdf(filename, lang="es"):
    # Target path
    workspace = "C:/Users/jisaz/Documents/Portafolio Ingeniero de Sistemas"
    pdf_path = os.path.join(workspace, "public/assets/pdf", filename)
    os.makedirs(os.path.dirname(pdf_path), exist_ok=True)
    
    # Page setup - Letter size, 0.5 inch margins for maximized space
    margin = 36 # 0.5 inch in points
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=margin,
        rightMargin=margin,
        topMargin=margin,
        bottomMargin=margin
    )
    
    # Styles
    styles = getSampleStyleSheet()
    
    # Custom colors
    c_primary = colors.HexColor("#0f172a")   # Slate 900 (Dark Navy)
    c_secondary = colors.HexColor("#6366f1") # Electric Violet/Indigo Accent
    c_text = colors.HexColor("#334155")      # Slate 700 (Body text)
    c_muted = colors.HexColor("#64748b")     # Slate 500
    
    # Custom Paragraph Styles
    style_name = ParagraphStyle(
        'CVName',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=c_primary,
        alignment=TA_LEFT
    )
    
    style_title = ParagraphStyle(
        'CVTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=c_secondary,
        alignment=TA_LEFT
    )
    
    style_contact = ParagraphStyle(
        'CVContact',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=c_text,
        alignment=TA_LEFT
    )
    
    style_section = ParagraphStyle(
        'CVSection',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=c_primary,
        spaceAfter=4
    )
    
    style_body = ParagraphStyle(
        'CVBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12.5,
        textColor=c_text,
        alignment=TA_JUSTIFY
    )
    
    style_job_title = ParagraphStyle(
        'CVJobTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=c_primary
    )
    
    style_job_details = ParagraphStyle(
        'CVJobDetails',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=c_secondary,
        alignment=TA_RIGHT
    )
    
    style_bullet = ParagraphStyle(
        'CVBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=c_text,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=3
    )

    story = []
    
    # ------------------ HEADER ------------------
    name = "JULIÁN ANDRÉS ISAZA ARIAS"
    if lang == "es":
        title_text = "INGENIERO DE SISTEMAS | AUDITOR DE TI | DESARROLLADOR BACKEND"
        contact_text = (
            "<b>Email:</b> julianandresisazaarias7@gmail.com | <b>Teléfono:</b> +57 311 8287430<br/>"
            "<b>Ubicación:</b> Medellín, Colombia | <b>GitHub:</b> github.com/jisaza1997<br/>"
            "<b>LinkedIn:</b> linkedin.com/in/julian-andres-isaza-arias-404b78230 | <b>Portafolio:</b> portafolio-sistemas-smoky.vercel.app"
        )
    else:
        title_text = "SYSTEMS ENGINEER | IT AUDITOR | BACKEND DEVELOPER"
        contact_text = (
            "<b>Email:</b> julianandresisazaarias7@gmail.com | <b>Phone:</b> +57 311 8287430<br/>"
            "<b>Location:</b> Medellin, Colombia | <b>GitHub:</b> github.com/jisaza1997<br/>"
            "<b>LinkedIn:</b> linkedin.com/in/julian-andres-isaza-arias-404b78230 | <b>Portfolio:</b> portafolio-sistemas-smoky.vercel.app"
        )
        
    header_data = [
        [Paragraph(name, style_name)],
        [Paragraph(title_text, style_title)],
        [Spacer(1, 4)],
        [Paragraph(contact_text, style_contact)]
    ]
    header_table = Table(header_data, colWidths=[540])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1, color=c_secondary, spaceBefore=2, spaceAfter=8))
    
    # ------------------ PROFILE ------------------
    if lang == "es":
        profile_title = "PERFIL PROFESIONAL"
        profile_desc = (
            "Ingeniero de Sistemas y Auditor de TI en KPMG con un perfil híbrido y dinámico. Combina experiencia en "
            "desarrollo seguro backend (Python, TypeScript) y bases de datos (SQL, MongoDB) con capacidades de evaluación "
            "de riesgos tecnológicos (SOX/ICFR, PCAOB) y auditorías ISO 27001. Cuento con conocimientos avanzados (no experto) "
            "en la integración de Inteligencia Artificial (Agentes Autónomos y servidores MCP) para la creación y automatización "
            "de recursos, así como en la creación de macros estructuradas en Visual Basic para Aplicaciones (VBA) para el análisis "
            "avanzado de datos y generación automatizada de evidencias de auditoría."
        )
    else:
        profile_title = "PROFESSIONAL PROFILE"
        profile_desc = (
            "Systems Engineer and IT Auditor at KPMG with a highly technical hybrid profile. Combines experience in secure backend "
            "development (Python, TypeScript) and databases (SQL, MongoDB) with technology risk assessment, cybersecurity, and "
            "auditing under SOX, PCAOB, and ISO 27001. With advanced knowledge (non-expert) in Artificial Intelligence integration "
            "(Autonomous Agents and MCP servers) for resource automation, as well as in structured Excel macro development using "
            "Visual Basic (VBA) for large-scale data analysis and automated audit evidence generation."
        )
        
    story.append(Paragraph(profile_title, style_section))
    story.append(Paragraph(profile_desc, style_body))
    story.append(Spacer(1, 8))
    story.append(HRFlowable(width="100%", thickness=0.5, color=c_muted, spaceBefore=2, spaceAfter=8))
    
    # ------------------ EXPERIENCE ------------------
    if lang == "es":
        exp_title = "EXPERIENCIA PROFESIONAL"
        jobs = [
            {
                "company": "KPMG Colombia",
                "role": "Auditor de TI (IT Auditor)",
                "date": "Marzo 2024 - Presente",
                "bullets": [
                    "Auditoría y evaluación de Controles Generales de TI (GITCs) incluyendo Gestión de Cambios, Acceso Lógico, Operaciones de TI y Adquisición/Desarrollo de Sistemas bajo regulaciones SOX e ICFR.",
                    "Inspección de cumplimiento y efectividad de controles de seguridad en capas tecnológicas de clientes corporativos: Sistemas Operativos (Windows, Linux), Bases de Datos (SQL Server, Oracle) y ERPs (SAP).",
                    "Evaluación de controles de terceros a través de la revisión y análisis de reportes de aseguramiento SOC 1 y SOC 2, así como validación de Controles del Usuario Entidad (UECs).",
                    "Automatización de procedimientos de pruebas y análisis de datos mediante macros estructuradas de Excel con programación avanzada en Visual Basic (VBA), DataSnipper e IDEA.",
                    "Investigación e integración de Inteligencia Artificial (Agentes Autónomos y servidores MCP) para la creación, optimización y automatización de recursos y flujos de trabajo de auditoría.",
                    "Uso y aplicación diaria del marco metodológico global a través del sistema de auditoría digital KPMG Clara Workflow."
                ]
            },
            {
                "company": "Bancolombia",
                "role": "Ingeniero de Software Backend (Backend Software Engineer)",
                "date": "Noviembre 2022 - Marzo 2024",
                "bullets": [
                    "Diseño y desarrollo del ciclo completo de microservicios bancarios en lenguajes estructurados y entornos de transaccionalidad segura de alta disponibilidad.",
                    "Implementación de estándares de codificación segura basados en el marco OWASP Top 10 para mitigar vulnerabilidades críticas y proteger la integridad de los datos financieros.",
                    "Desarrollo de pruebas unitarias y de integración automatizadas para asegurar la resiliencia y el rendimiento de las aplicaciones de negocio.",
                    "Mantenimiento correctivo y preventivo de servicios backend en producción, gestionando el ciclo de vida del software con Git y despliegues CI/CD."
                ]
            },
            {
                "company": "Unisys",
                "role": "UTS Technical Support Representative 2",
                "date": "Marzo 2022 - Noviembre 2022",
                "bullets": [
                    "Soporte técnico avanzado de hardware y software (Nivel 2) y resolución de incidentes críticos para clientes corporativos multinacionales.",
                    "Gestión integral de incidentes a través de sistemas de ticketing empresarial bajo estándares ITIL, manteniendo estricto cumplimiento de los SLA.",
                    "Administración y soporte de redes de telecomunicaciones, sistemas de escritorios virtualizados y arquitecturas locales de red."
                ]
            },
            {
                "company": "DAWA Solutions Group",
                "role": "Auxiliar de Mantenimiento / Soporte de TI",
                "date": "Agosto 2021 - Febrero 2022",
                "bullets": [
                    "Administración y soporte de bases de datos relacionales locales (SQL Server, MySQL, Access) y gestión operativa de la red local (LAN) corporativa.",
                    "Soporte y mantenimiento a infraestructura VDI (escritorios virtuales), canales de conectividad segura (VPN) e implementaciones RPA.",
                    "Mantenimiento físico y lógico de servidores de archivos, y administración operativa básica en el sistema de gestión SAP."
                ]
            }
        ]
    else:
        exp_title = "PROFESSIONAL EXPERIENCE"
        jobs = [
            {
                "company": "KPMG Colombia",
                "role": "IT Auditor",
                "date": "March 2024 - Present",
                "bullets": [
                    "Audited and evaluated IT General Controls (GITCs) including Change Management, Logical Access, IT Operations, and Systems Acquisition/Development under SOX and ICFR frameworks.",
                    "Inspected security compliance and control effectiveness across enterprise technology layers: Operating Systems (Windows, Linux), Databases (SQL Server, Oracle), and ERP systems (SAP).",
                    "Assessed third-party risk controls by analyzing and reviewing SOC 1 and SOC 2 assurance reports and verifying User Entity Controls (UECs).",
                    "Automated audit testing procedures, performed complex data analysis, and generated audit evidences using Excel macros with Visual Basic for Applications (VBA) programming, DataSnipper, and IDEA.",
                    "Researched and integrated Artificial Intelligence (Autonomous Agents and MCP servers) to automate resource creation, optimize processes, and streamline technology audit workflows.",
                    "Applied KPMG's global audit methodology daily using the digital system KPMG Clara Workflow."
                ]
            },
            {
                "company": "Bancolombia",
                "role": "Backend Software Engineer",
                "date": "November 2022 - March 2024",
                "bullets": [
                    "Designed and developed the full software lifecycle of banking microservices in secure, high-availability, transactional environments.",
                    "Applied secure development practices based on the OWASP Top 10 framework to mitigate critical vulnerabilities and protect financial data.",
                    "Implemented unit and integration tests to ensure code quality, software resilience, and performance tuning.",
                    "Maintained and updated production backend applications, utilizing Git-based version control and automated CI/CD pipelines."
                ]
            },
            {
                "company": "Unisys",
                "role": "UTS Technical Support Representative 2",
                "date": "March 2022 - November 2022",
                "bullets": [
                    "Provided advanced Level 2 hardware and software technical support, resolving critical incidents for enterprise multinational clients.",
                    "Managed the complete incident lifecycle using corporate ticketing systems in alignment with ITIL best practices and strict SLAs.",
                    "Supported virtualization platforms, network telecommunication architectures, and corporate network configurations."
                ]
            },
            {
                "company": "DAWA Solutions Group",
                "role": "IT Support & Maintenance Assistant",
                "date": "August 2021 - February 2022",
                "bullets": [
                    "Administered and maintained local relational databases (SQL Server, MySQL, Access) and managed local area network (LAN) operations.",
                    "Supported corporate Virtual Desktop Infrastructure (VDI), secure VPN connections, and basic Robotic Process Automation (RPA) tools.",
                    "Executed server hardware preventive maintenance and basic administrative tasks within the corporate SAP ERP system."
                ]
            }
        ]
        
    story.append(Paragraph(exp_title, style_section))
    
    for job in jobs:
        # Job header row
        job_header = [
            [Paragraph(f"<b>{job['company']}</b> - {job['role']}", style_job_title), 
             Paragraph(job['date'], style_job_details)]
        ]
        t = Table(job_header, colWidths=[380, 160])
        t.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2),
            ('TOPPADDING', (0,0), (-1,-1), 0),
        ]))
        story.append(t)
        
        # Job bullets
        for bullet in job['bullets']:
            story.append(Paragraph(f"&bull; {bullet}", style_bullet))
        story.append(Spacer(1, 4))
        
    story.append(Spacer(1, 2))
    story.append(HRFlowable(width="100%", thickness=0.5, color=c_muted, spaceBefore=2, spaceAfter=8))
    
    # ------------------ EDUCATION & CERTIFICATIONS ------------------
    # Using a 2-column table layout at the bottom to maximize space (Left: Education & Skills, Right: Key Certifications)
    if lang == "es":
        edu_title = "EDUCACIÓN"
        skills_title_sec = "APTITUDES Y TECNOLOGÍAS"
        certs_title_sec = "CERTIFICACIONES DESTACADAS"
        
        edu_content = (
            "<b>Ingeniería de Sistemas</b><br/>"
            "Fundación Universitaria del Área Andina | <i>Graduado en Feb 2025</i><br/><br/>"
            "<b>Diplomado en Operaciones de Ciberseguridad</b><br/>"
            "Fundación Universitaria del Área Andina | <i>Completado en 2024</i>"
        )
        
        skills_content = (
            "<b>Auditoría y Riesgos:</b> SOX, PCAOB, ICFR, COBIT, ITIL, SOC 1/2.<br/>"
            "<b>IA y Automatización:</b> Agentes Autónomos, Model Context Protocol (MCP).<br/>"
            "<b>Tecnología:</b> Python, TypeScript, MongoDB, SQL, Linux, Git, APIs.<br/>"
            "<b>Herramientas:</b> Macros VBA (Excel), DataSnipper, IDEA Scripting, SAP."
        )
        
        certs_content = (
            "&bull; <b>ISO 27001:2022 Lead Auditor</b> (Udemy/Rigcert, 2025)<br/>"
            "&bull; <b>Cisco Certified CyberOps Associate</b> (Cisco, 2024)<br/>"
            "&bull; <b>Masterclass - CISA Exam Prep 2025</b> (Udemy, 2025)<br/>"
            "&bull; <b>IT Audit: General & Application Controls</b> (Udemy, 2025)<br/>"
            "&bull; <b>IT Audit: Cloud Fundamentals (AWS/Azure)</b> (Udemy, 2025)<br/>"
            "&bull; <b>Módulos de Auditoría y Cumplimiento KPMG</b> (2023-2024)<br/>"
            "&bull; <b>Ethics & PTEE Compliance (SAGRILAFT)</b> (KPMG, 2023)<br/>"
            "&bull; <b>NDG Linux Unhatched Certificate</b> (Cisco Academy)"
        )
    else:
        edu_title = "EDUCATION"
        skills_title_sec = "SKILLS & TECHNOLOGIES"
        certs_title_sec = "FEATURED CERTIFICATIONS"
        
        edu_content = (
            "<b>B.S. in Systems Engineering</b><br/>"
            "Fundación Universitaria del Área Andina | <i>Graduated Feb 2025</i><br/><br/>"
            "<b>Diploma in Cybersecurity Operations</b><br/>"
            "Fundación Universitaria del Área Andina | <i>Completed 2024</i>"
        )
        
        skills_content = (
            "<b>Audit & Risk:</b> SOX, PCAOB, ICFR, COBIT, ITIL, SOC 1 & 2.<br/>"
            "<b>AI & Automation:</b> Autonomous Agents, Model Context Protocol (MCP).<br/>"
            "<b>Development:</b> Python, TypeScript, MongoDB, SQL, Linux, Git, APIs.<br/>"
            "<b>Tools:</b> Excel VBA Macros, DataSnipper, IDEA Scripting, SAP ERP."
        )
        
        certs_content = (
            "&bull; <b>ISO 27001:2022 Lead Auditor</b> (Udemy/Rigcert, 2025)<br/>"
            "&bull; <b>Cisco Certified CyberOps Associate</b> (Cisco, 2024)<br/>"
            "&bull; <b>Masterclass - CISA Exam Prep 2025</b> (Udemy, 2025)<br/>"
            "&bull; <b>IT Audit: General & Application Controls</b> (Udemy, 2025)<br/>"
            "&bull; <b>IT Audit: Cloud Fundamentals (AWS/Azure)</b> (Udemy, 2025)<br/>"
            "&bull; <b>IT Audit & Internal Controls Modules</b> (KPMG, 2023-2024)<br/>"
            "&bull; <b>Ethics & PTEE Compliance (SAGRILAFT)</b> (KPMG, 2023)<br/>"
            "&bull; <b>NDG Linux Unhatched Certificate</b> (Cisco Academy)"
        )
        
    left_column = [
        Paragraph(edu_title, style_section),
        Paragraph(edu_content, style_body),
        Spacer(1, 10),
        Paragraph(skills_title_sec, style_section),
        Paragraph(skills_content, style_body)
    ]
    
    right_column = [
        Paragraph(certs_title_sec, style_section),
        Paragraph(certs_content, style_body)
    ]
    
    # 2-column layout table (Left width: 250, Right width: 270, Gap: 20 -> Total: 540)
    col_data = [
        [left_column, right_column]
    ]
    col_table = Table(col_data, colWidths=[250, 290])
    col_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(col_table)
    
    # Build Document
    doc.build(story)
    print(f"Generated CV: {pdf_path}")

if __name__ == "__main__":
    build_pdf("hoja_de_vida_julian_isaza.pdf", lang="es")
    build_pdf("profile_julian_isaza.pdf", lang="en")
