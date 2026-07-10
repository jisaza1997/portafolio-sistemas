# Scripts de Automatización del Portafolio

Este directorio contiene las herramientas escritas en **Python** para automatizar el mantenimiento, sincronización y generación de recursos de este portafolio profesional.

## 🛠️ Herramientas Disponibles

### 1. Extractor de Metadatos de Certificados (`sync_certificates.py`)
Lee recursivamente los archivos PDF de certificaciones ubicados en `public/Certificaciones/`, extrae su texto mediante análisis heurístico y genera un inventario unificado en `public/certifications.json`.
* **Características:**
  * Extracción automática de títulos, emisores, fechas y habilidades utilizando expresiones regulares avanzadas.
  * Detección automática del emisor basándose en el contenido de la plataforma (Udemy, Coursera, Cisco NetAcad, Microsoft, etc.).
* **Requisitos:**
  * `pip install pypdf`
* **Uso:**
  ```bash
  python scripts/sync_certificates.py
  ```

### 2. Sincronizador Cloud a Supabase (`sync_to_supabase.py`)
Toma el inventario generado localmente (`public/certifications.json`) y realiza un guardado masivo seguro (upsert) en la base de datos de Supabase PostgreSQL mediante REST API.
* **Características:**
  * Protege las llaves mediante variables de entorno (principios de codificación segura OWASP).
  * Habilitado para bypass seguro con Row Level Security (RLS) en base de datos.
* **Requisitos:**
  * `pip install requests`
* **Uso:**
  ```bash
  # Configurar clave de API en PowerShell
  $env:SUPABASE_SERVICE_ROLE_KEY="tu_clave_aqui"
  python scripts/sync_to_supabase.py
  ```

### 3. Generador de Hojas de Vida Impresas (`generate_cv.py`)
Genera currículums dinámicos y profesionales en PDF (en español e inglés) a partir del perfil técnico y la experiencia actualizados en el portafolio.
* **Características:**
  * Utiliza ReportLab para compilar layouts de alta precisión tipográfica y cuadre de márgenes.
  * Autogenera:
    * `public/assets/pdf/hoja_de_vida_julian_isaza.pdf` (Versión en Español)
    * `public/assets/pdf/profile_julian_isaza.pdf` (Versión en Inglés)
* **Requisitos:**
  * `pip install reportlab`
* **Uso:**
  ```bash
  python scripts/generate_cv.py
  ```
