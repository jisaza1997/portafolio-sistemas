import os
import re
import json
import pypdf

# Config paths
certs_dir = r"Certificaciones"
json_path = "certifications.json"

def clean_spacing(text):
    return " ".join(text.split())

def parse_pdf_content(filepath, filename):
    """
    Reads a PDF, extracts its text, and parses its issuer, title, date, and category.
    """
    try:
        reader = pypdf.PdfReader(filepath)
        text = ""
        for i in range(min(3, len(reader.pages))):
            page_text = reader.pages[i].extract_text()
            if page_text:
                text += page_text + "\n"
        
        if not text.strip():
            # If pypdf extracts no text, try simple PDF metadata or return empty
            return None
        
        clean_text = clean_spacing(text)
        
        # Heuristics variables
        title_es = ""
        title_en = ""
        issuer = "Unknown Issuer"
        category = "udemy"
        date_str = "Completo"
        skills = ["IT Skills"]

        # 1. Platform Detection
        # -- COURSERA --
        if "coursera" in clean_text.lower():
            category = "coursera"
            issuer = "Coursera"
            
            # Try to identify offering organization (e.g. "offered by IBM", "offered by Google")
            org_match = re.search(r"offered by\s+([\w\s&,\.\-]+?)(?:\ban\b|has successfully|authorized by)", clean_text)
            if org_match:
                offering_org = org_match.group(1).strip()
                issuer = f"Coursera ({offering_org})"
            else:
                issuer = "Coursera (Bancolombia Program)"
                
            # Try to extract Coursera Course Title
            # Patterns: "successfully completed [Title] an online", "completed [Title] a course"
            title_match = re.search(r"successfully completed\s+([\w\s:,\-\(\)\!\.\#\&\/]+?)(?:\ban\b\s+online|a course|a \d+-week|offered by)", clean_text)
            if title_match:
                title_en = title_match.group(1).strip()
                title_es = title_en  # Coursera titles are usually in English
            else:
                # Fallback: take file name as title
                clean_name = filename.replace(".pdf", "").replace("_", " ").replace("-", " ")
                title_en = clean_name.title()
                title_es = title_en

            # Extract Coursera Date: typically "December 15, 2024" or "Month DD, YYYY"
            date_match = re.search(r"\b([A-Za-z]+ \d{1,2}, \d{4})\b", clean_text)
            if date_match:
                date_str = date_match.group(1)
            
        # -- UDEMY --
        elif "udemy" in clean_text.lower():
            category = "udemy"
            issuer = "Udemy"
            
            # Extract Udemy instructor
            inst_match = re.search(r"(?:Instructores|Instructors)\s+([\w\s,&\.\-]+?)(?:\bJulián\b|\bJulian\b|\bFecha\b|\bDate\b|\d{1,2} de|\d{4})", clean_text)
            if inst_match:
                instructor = inst_match.group(1).strip()
                issuer = f"Udemy ({instructor})"
                
            # Extract Udemy Title: text between "CERTIFICADO DE FINALIZACIÓN" and "Instructores"
            # In Udemy PDFs, the text usually places the title right after "CERTIFICADO DE FINALIZACIÓN" or "CERTIFICATE OF COMPLETION"
            title_match = re.search(r"(?:CERTIFICADO DE FINALIZACIÓN|CERTIFICATE OF COMPLETION)\s+([\w\s:,\-\(\)\!\.\#\&\/]+?)\s+(?:Instructores|Instructors|Fecha|Date|Julián)", clean_text)
            if title_match:
                title_en = title_match.group(1).strip()
                title_es = title_en
            else:
                # Look for fallback title
                clean_name = filename.replace(".pdf", "").replace("UC-", "Udemy-").replace("_", " ").replace("-", " ")
                title_en = clean_name.title()
                title_es = title_en

            # Extract Udemy Date
            # Patterns: "Fecha 4 de junio de 2025" or "Date June 4, 2025"
            date_match = re.search(r"(?:Fecha|Date)\s+([\w\d\s,]+?)(?:\bDuración\b|\bDuration\b|\bNúmero\b|\bUrl\b|$)", clean_text)
            if date_match:
                date_str = date_match.group(1).strip()

        # -- CISCO --
        elif "cisco" in clean_text.lower() or "netacad" in clean_text.lower() or "cyberops" in clean_text.lower():
            category = "cisco"
            issuer = "Cisco Networking Academy"
            title_match = re.search(r"(?:curso|course)\s+([\w\s:,\-\(\)]+?)(?:\bEl estudiante\b|\bThe student\b|\bhas successfully\b)", clean_text)
            if title_match:
                title_en = title_match.group(1).strip().title()
                title_es = title_en
            else:
                title_en = "Cisco Certified Course"
                title_es = "Curso Certificado Cisco"
                
            # Date extraction
            date_match = re.search(r"\b([A-Za-z]+ \d{1,2}, \d{4})\b", clean_text)
            if date_match:
                date_str = date_match.group(1)

        # -- KPMG --
        elif "kpmg" in clean_text.lower() or "successfactors" in clean_text.lower():
            category = "kpmg"
            issuer = "KPMG SuccessFactors Learning"
            
            # Title extraction: check module names
            title_match = re.search(r"(?:Completed the|Completó el|completado el)\s+([\w\s:,\-\(\)\/]+?)(?:\bmodule\b|\bcurso\b|\bel\b|\bon\b|\bel\b)", clean_text)
            if title_match:
                title_en = title_match.group(1).strip()
                title_es = title_en
            else:
                title_en = "KPMG Core Audit Module"
                title_es = "Módulo de Auditoría KPMG"
                
            # Date extraction: e.g. 7/3/2024 or 16/7/2023 or "on 6/12/2022"
            date_match = re.search(r"\b(\d{1,2}/\d{1,2}/\d{4})\b", clean_text)
            if date_match:
                date_str = date_match.group(1)

        # -- UNIVERSITY / GENERAL --
        else:
            category = "university"
            if "areandina" in clean_text.lower() or "área andina" in clean_text.lower():
                issuer = "Fundación Universitaria del Área Andina"
            else:
                issuer = "Educación Continua"
                
            clean_name = filename.replace(".pdf", "").replace("_", " ").replace("-", " ")
            title_en = clean_name.title()
            title_es = title_en
            
            # Look for dates
            date_match = re.search(r"\b(\d{1,2} de [A-Za-z]+ de \d{4})\b", clean_text)
            if date_match:
                date_str = date_match.group(1)

        # 2. Skill Inference based on Title text
        combined_title = f"{title_en} {title_es}".lower()
        if "security" in combined_title or "seguridad" in combined_title or "ciber" in combined_title or "cyber" in combined_title:
            skills = ["Cybersecurity", "Security Controls", "Information Security"]
        elif "audit" in combined_title or "auditoría" in combined_title or "control" in combined_title:
            skills = ["IT Auditing", "Internal Controls", "Risk Assessment"]
        elif "iso" in combined_title:
            skills = ["ISO Standards", "Compliance Auditing", "Risk Management"]
        elif "cloud" in combined_title or "aws" in combined_title or "azure" in combined_title or "gcp" in combined_title:
            skills = ["Cloud Computing", "Cloud Security", "Infrastructure"]
        elif "python" in combined_title or "django" in combined_title or "flask" in combined_title:
            skills = ["Python Programming", "Software Development", "Backend Systems"]
        elif "sql" in combined_title or "data" in combined_title or "base" in combined_title:
            skills = ["Databases", "SQL Queries", "Data Integrity"]
        elif "linux" in combined_title or "unix" in combined_title:
            skills = ["Linux OS", "Shell Scripting", "System Operations"]
        else:
            skills = ["Technical Training", "Process Compliance"]

        # Generate custom unique ID
        safe_id = re.sub(r'[^a-z0-9_]', '', title_en.lower().replace(" ", "_"))[:30] + f"_{len(filename)}"

        return {
            "id": safe_id,
            "title_es": title_es,
            "title_en": title_en,
            "issuer": issuer,
            "date": date_str,
            "category": category,
            "skills": skills,
            "filename": filename
        }

    except Exception as e:
        print(f"Error parsing {filename}: {e}")
        return None

def main():
    print("==================================================")
    print("IT Audit Portfolio: Certificate Sync Engine v1.0")
    print("==================================================")
    
    if not os.path.exists(json_path):
        print(f"Error: {json_path} database not found. Run from project root.")
        return

    # Load existing database
    with open(json_path, "r", encoding="utf-8") as f:
        database = json.load(f)
    
    registered_files = {item["filename"] for item in database if "filename" in item}
    print(f"Loaded {len(database)} certificates from database.")
    
    if not os.path.exists(certs_dir):
        print(f"Error: Certificaciones directory [{certs_dir}] not found.")
        return
        
    new_certs = []
    
    # Scan directory
    for filename in os.listdir(certs_dir):
        if filename.endswith(".pdf"):
            if filename not in registered_files:
                filepath = os.path.join(certs_dir, filename)
                print(f"Found new certificate file: {filename}")
                cert_data = parse_pdf_content(filepath, filename)
                if cert_data:
                    new_certs.append(cert_data)
                    print(f"  Parsed successfully: '{cert_data['title_en']}' (Issuer: {cert_data['issuer']})")
                else:
                    print(f"  Warning: Could not extract text from {filename}. Skipping automatic parse.")
                    
    if new_certs:
        # Append and write back to database
        database.extend(new_certs)
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(database, f, ensure_ascii=False, indent=2)
            
        print("--------------------------------------------------")
        print(f"Success: Added {len(new_certs)} new certificates to {json_path}.")
        
        # Simulating ITIL/Change Control logging
        log_message = f"Certificate sync completed. Ingested {len(new_certs)} new records into certifications.json."
        print(f"ITIL Change Control Log: {log_message}")
    else:
        print("--------------------------------------------------")
        print("Check completed. No new certificates found.")
        
    print("==================================================")

if __name__ == "__main__":
    main()
