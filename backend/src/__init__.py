# App package initialization
import os

# Initialize Supabase client for storage
supabase_client = None
try:
    from supabase import create_client
    supabase_url = os.getenv('SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
    if supabase_url and supabase_key:
        supabase_client = create_client(supabase_url, supabase_key)
        print("✅ Supabase storage initialized")
    else:
        print("⚠️  Supabase credentials not found, using local storage")
except ImportError:
    print("⚠️  Supabase library not installed, using local storage")
except Exception as e:
    print(f"⚠️  Supabase initialization failed: {e}, using local storage")
