import requests
import os
from urllib.parse import urlencode

class ImageService:
    def __init__(self):
        self.unsplash_api_key = os.getenv('UNSPLASH_API_KEY')
        self.base_url = "https://api.unsplash.com"
        
    def fetch_image(self, keywords):
        """Fetch a free image from Unsplash based on keywords."""
        if not self.unsplash_api_key:
            return None
        
        try:
            search_params = {
                'query': keywords,
                'per_page': 1,
                'client_id': self.unsplash_api_key,
                'order_by': 'relevant'
            }
            
            response = requests.get(
                f"{self.base_url}/search/photos",
                params=search_params,
                timeout=5
            )
            response.raise_for_status()
            
            data = response.json()
            if data.get('results') and len(data['results']) > 0:
                image_url = data['results'][0]['urls']['regular']
                return image_url
            
            return None
        except Exception as e:
            print(f"Error fetching image from Unsplash: {str(e)}")
            return None
