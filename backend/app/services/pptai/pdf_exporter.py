import os
import json
from pathlib import Path
from flask import send_file
import asyncio

try:
    from playwright.async_api import async_playwright
except ImportError:
    async_playwright = None

SLIDES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'slides')
EXPORTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'exports')

class PDFExporter:
    def __init__(self, user_id):
        self.user_id = user_id
        os.makedirs(EXPORTS_DIR, exist_ok=True)
    
    def get_pdf_path(self, presentation_id):
        """Get the path where PDF should be saved."""
        return os.path.join(EXPORTS_DIR, self.user_id, f'{presentation_id}.pdf')
    
    def export_to_pdf(self, presentation_id):
        """Export presentation slides to PDF using headless browser."""
        if not async_playwright:
            raise Exception("Playwright not installed. Install with: pip install playwright")
        
        presentation_dir = os.path.join(SLIDES_DIR, self.user_id, presentation_id)
        if not os.path.exists(presentation_dir):
            raise Exception(f"Presentation {presentation_id} not found")
        
        pdf_path = self.get_pdf_path(presentation_id)
        os.makedirs(os.path.dirname(pdf_path), exist_ok=True)
        
        try:
            asyncio.run(self._render_to_pdf(presentation_dir, pdf_path))
            return pdf_path
        except Exception as e:
            raise Exception(f"Error exporting to PDF: {str(e)}")
    
    async def _render_to_pdf(self, presentation_dir, output_pdf):
        """Render HTML slides to PDF pages."""
        slide_files = sorted([f for f in os.listdir(presentation_dir) if f.startswith('slide_') and f.endswith('.html')])
        
        if not slide_files:
            raise Exception("No slides found in presentation")
        
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            context = await browser.new_context(viewport={'width': 960, 'height': 720})
            page = await context.new_page()
            
            pdf_pages = []
            
            for slide_file in slide_files:
                slide_path = os.path.join(presentation_dir, slide_file)
                file_url = Path(slide_path).as_uri()
                
                await page.goto(file_url, wait_until='networkidle')
                pdf_page = await page.pdf(format='A4', landscape=True)
                pdf_pages.append(pdf_page)
            
            self._combine_pdfs(pdf_pages, output_pdf)
            await context.close()
            await browser.close()
    
    def _combine_pdfs(self, pdf_pages, output_path):
        """Combine individual PDF pages into one PDF file."""
        try:
            from PyPDF2 import PdfMerger
        except ImportError:
            raise Exception("PyPDF2 not installed. Install with: pip install PyPDF2")
        
        merger = PdfMerger()
        
        for pdf_page in pdf_pages:
            from io import BytesIO
            merger.append(BytesIO(pdf_page))
        
        with open(output_path, 'wb') as f:
            merger.write(f)
        
        merger.close()
    
    def send_file(self, file_path, filename):
        """Send file to client."""
        return send_file(
            file_path,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=filename
        )
