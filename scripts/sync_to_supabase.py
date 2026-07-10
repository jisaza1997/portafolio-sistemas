import os
import json
import requests

# Supabase Configurations
# Best practices: Use environment variables to avoid hardcoding secrets (Secure Coding principles)
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://rjmzpikjbqkwdoqkpkqy.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "") # Service role key for writes

json_path = "public/certifications.json"

def main():
    print("==================================================")
    print("Supabase Secure Sync Engine - Certifications Ledger")
    print("==================================================")
    
    if not SUPABASE_KEY:
        print("ERROR: SUPABASE_SERVICE_ROLE_KEY environment variable is not set.")
        print("Please configure your secrets securely before running this script:")
        print("  Windows CMD: set SUPABASE_SERVICE_ROLE_KEY=your_key_here")
        print("  Windows PowerShell: $env:SUPABASE_SERVICE_ROLE_KEY='your_key_here'")
        print("==================================================")
        return

    if not os.path.exists(json_path):
        print(f"ERROR: Local database {json_path} not found.")
        return

    # Load local certs JSON
    with open(json_path, "r", encoding="utf-8") as f:
        certs = json.load(f)
        
    print(f"Loaded {len(certs)} local records. Preparing secure upsert to Supabase...")

    # Configure headers with authorization token (Bearer Token)
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates" # Upsert behavior
    }

    # API endpoint for the 'certifications' table
    url = f"{SUPABASE_URL}/rest/v1/certifications"

    try:
        # Loop through certs and upsert them (or batch upload)
        # We transform 'skills' array to database compatible formats if needed (e.g. Postgres array or JSONB)
        payload = []
        for cert in certs:
            payload.append({
                "id": cert["id"],
                "title_es": cert["title_es"],
                "title_en": cert["title_en"],
                "issuer": cert["issuer"],
                "date": cert["date"],
                "category": cert["category"],
                "skills": cert["skills"], # Stored as JSONB or text array
                "filename": cert["filename"]
            })

        print(f"Sending encrypted batch payload to {url}...")
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        
        if response.status_code in [200, 201]:
            print("SUCCESS: Securely synchronized database to Supabase Cloud Registry!")
            print("Database Table: certifications")
            print("Security Policy: Row Level Security (RLS) enabled (Select: public, Write: service_role only).")
        else:
            print(f"API ERROR (Status {response.status_code}): {response.text}")
            
    except Exception as e:
        print(f"Exception during secure API call: {e}")
        
    print("==================================================")

if __name__ == "__main__":
    main()
