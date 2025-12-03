import os
import json
from datetime import datetime, timedelta

def save_slide_html(file_path, html_content):
    """Save slide HTML to file."""
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

def load_slide_html(file_path):
    """Load slide HTML from file."""
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    return None

def save_presentation_metadata(file_path, metadata):
    """Save presentation metadata to JSON file."""
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2)

def load_presentation_metadata(file_path):
    """Load presentation metadata from JSON file."""
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return None

def cleanup_expired_slides(slides_dir, days=7):
    """Delete presentations older than specified days."""
    now = datetime.now()
    expiration_threshold = now - timedelta(days=days)
    
    cleaned_count = 0
    for user_dir in os.listdir(slides_dir):
        user_path = os.path.join(slides_dir, user_dir)
        if not os.path.isdir(user_path):
            continue
        
        for presentation_dir in os.listdir(user_path):
            presentation_path = os.path.join(user_path, presentation_dir)
            metadata_file = os.path.join(presentation_path, 'metadata.json')
            
            try:
                if os.path.exists(metadata_file):
                    with open(metadata_file, 'r') as f:
                        metadata = json.load(f)
                        created_at = datetime.fromisoformat(metadata.get('created_at', datetime.now().isoformat()))
                        
                        if created_at < expiration_threshold:
                            import shutil
                            shutil.rmtree(presentation_path)
                            cleaned_count += 1
            except Exception as e:
                print(f"Error cleaning up {presentation_path}: {e}")
    
    return cleaned_count

def get_presentation_stats(slides_dir, user_id):
    """Get statistics about user's presentations."""
    user_path = os.path.join(slides_dir, user_id)
    
    if not os.path.exists(user_path):
        return {
            'total_presentations': 0,
            'total_slides': 0,
            'total_storage': 0
        }
    
    total_presentations = 0
    total_slides = 0
    total_storage = 0
    
    for presentation_dir in os.listdir(user_path):
        presentation_path = os.path.join(user_path, presentation_dir)
        if os.path.isdir(presentation_path):
            total_presentations += 1
            
            for file in os.listdir(presentation_path):
                if file.startswith('slide_') and file.endswith('.html'):
                    total_slides += 1
                
                file_path = os.path.join(presentation_path, file)
                if os.path.isfile(file_path):
                    total_storage += os.path.getsize(file_path)
    
    return {
        'total_presentations': total_presentations,
        'total_slides': total_slides,
        'total_storage': total_storage
    }
