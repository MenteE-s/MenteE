import os
import json
import uuid
from datetime import datetime, timedelta
from langchain_groq import ChatGroq
from app.services.pptai.image_service import ImageService
from app.models.pptai import Presentation, Slide
from app.utils.pptai_utils import save_slide_html, load_presentation_metadata, save_presentation_metadata
from extensions import db

SLIDES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'slides')

class SlideGenerator:
    def __init__(self, user_id):
        self.user_id = user_id
        self.llm = ChatGroq(model="openai/gpt-oss-120b", api_key=os.getenv('GROQ_API_KEY'))
        self.image_service = ImageService()
        self.current_presentation_id = None
        
    def generate_slides(self, topic, slide_count=5):
        """Generate slides one by one and yield HTML content."""
        self.current_presentation_id = str(uuid.uuid4())
        presentation_dir = os.path.join(SLIDES_DIR, self.user_id, self.current_presentation_id)
        os.makedirs(presentation_dir, exist_ok=True)
        
        # Create presentation record
        presentation = Presentation(
            id=self.current_presentation_id,
            user_id=self.user_id,
            title=f"Presentation on {topic}",
            topic=topic,
            slide_count=slide_count,
            status="generating"
        )
        db.session.add(presentation)
        db.session.commit()
        
        prompt = self._build_generation_prompt(topic, slide_count)
        
        try:
            stream = self.llm.stream([{"role": "user", "content": prompt}])
            
            slide_content = ""
            slide_number = 0
            
            for chunk in stream:
                slide_content += chunk.content
                
                if "<!-- SLIDE_END -->" in slide_content:
                    slides = slide_content.split("<!-- SLIDE_END -->")
                    
                    for i, slide_html in enumerate(slides[:-1]):
                        slide_number += 1
                        if slide_html.strip():
                            slide_html = slide_html.strip()
                            
                            image_keywords = self._extract_image_keywords(slide_html)
                            image_url = self.image_service.fetch_image(image_keywords)
                            
                            if image_url:
                                slide_html = self._inject_image(slide_html, image_url)
                            
                            # Save to file
                            slide_path = os.path.join(presentation_dir, f'slide_{slide_number}.html')
                            save_slide_html(slide_path, slide_html)
                            
                            # Save to DB
                            slide = Slide(
                                presentation_id=self.current_presentation_id,
                                slide_number=slide_number,
                                html_content=slide_html,
                                image_url=image_url
                            )
                            db.session.add(slide)
                            
                            yield slide_html, slide_number
                    
                    slide_content = slides[-1]
            
            # Update presentation status
            presentation.status = "completed"
            presentation.slide_count = slide_number
            db.session.commit()
            
            metadata = {
                'presentation_id': self.current_presentation_id,
                'user_id': self.user_id,
                'topic': topic,
                'slide_count': slide_number,
                'created_at': datetime.now().isoformat(),
                'expires_at': (datetime.now() + timedelta(days=7)).isoformat()
            }
            save_presentation_metadata(
                os.path.join(presentation_dir, 'metadata.json'),
                metadata
            )
            
        except Exception as e:
            presentation.status = "error"
            db.session.commit()
            raise Exception(f"Error generating slides: {str(e)}")
    
    def _build_generation_prompt(self, topic, slide_count):
        """Build the Groq prompt for slide generation."""
        return f"""Generate exactly {slide_count} professional slides in HTML/CSS format for a presentation about: "{topic}"

For each slide, create complete, self-contained HTML with inline CSS. Use these templates:

TITLE SLIDE (Slide 1):
<html>
<head>
<style>
body {{ margin: 0; padding: 40px; font-family: 'Arial', sans-serif; height: 100vh; display: flex; flex-direction: column; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }}
h1 {{ font-size: 48px; margin: 0 0 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }}
p {{ font-size: 24px; margin: 10px 0; opacity: 0.9; }}
img {{ width: 100%; height: 400px; object-fit: cover; border-radius: 8px; margin-top: 30px; }}
</style>
</head>
<body>
<h1>Slide Title Here</h1>
<p>Subtitle or topic description</p>
<img src="" alt="slide image">
</body>
</html>
<!-- SLIDE_END -->

CONTENT SLIDE:
<html>
<head>
<style>
body {{ margin: 0; padding: 40px; font-family: 'Arial', sans-serif; background: linear-gradient(to right, #f5f7fa 0%, #c3cfe2 100%); }}
h2 {{ color: #333; font-size: 36px; margin-bottom: 30px; border-bottom: 3px solid #667eea; padding-bottom: 15px; }}
ul {{ font-size: 18px; line-height: 1.8; color: #555; }}
li {{ margin: 15px 0; }}
img {{ width: 100%; height: 300px; object-fit: cover; border-radius: 8px; margin-top: 20px; }}
</style>
</head>
<body>
<h2>Slide Title</h2>
<ul>
<li>Key point 1</li>
<li>Key point 2</li>
<li>Key point 3</li>
</ul>
<img src="" alt="slide image">
</body>
</html>
<!-- SLIDE_END -->

TWO COLUMN SLIDE:
<html>
<head>
<style>
body {{ margin: 0; padding: 40px; font-family: 'Arial', sans-serif; background: #fff; display: flex; gap: 40px; }}
.column {{ flex: 1; }}
h2 {{ color: #667eea; font-size: 24px; }}
p {{ color: #666; font-size: 16px; line-height: 1.6; }}
img {{ width: 100%; height: 300px; object-fit: cover; border-radius: 8px; }}
</style>
</head>
<body>
<div class="column">
<h2>Left Side</h2>
<p>Content here</p>
</div>
<div class="column">
<img src="" alt="image">
</div>
</body>
</html>
<!-- SLIDE_END -->

REQUIREMENTS:
- Each slide must be complete, standalone HTML with inline CSS
- Always include <img src="" alt=""> tags (src will be filled with image URL)
- Use professional colors and typography
- Make slides visually appealing and easy to read
- Add <!-- SLIDE_END --> after each slide
- Use appropriate slide layout for the content
- Include relevant content about: {topic}

Generate {slide_count} slides now:"""

    def _extract_image_keywords(self, html_content):
        """Extract image keywords from slide HTML."""
        try:
            if "<!-- IMAGE_KEYWORDS:" in html_content:
                start = html_content.find("<!-- IMAGE_KEYWORDS:") + len("<!-- IMAGE_KEYWORDS:")
                end = html_content.find("-->", start)
                keywords = html_content[start:end].strip()
                return keywords
        except:
            pass
        
        slide_text = html_content.replace('<html>', '').replace('</html>', '').replace('<head>', '').replace('</head>', '')
        slide_text = slide_text.replace('<body>', '').replace('</body>', '').replace('<style>', '').replace('</style>', '')
        words = [w for w in slide_text.split() if len(w) > 5 and not w.startswith('<')]
        return ' '.join(words[:5]) if words else "professional business concept"

    def _inject_image(self, html_content, image_url):
        """Inject image URL into HTML template."""
        return html_content.replace('src=""', f'src="{image_url}"')

    def process_chat_message(self, message, presentation_id=None):
        """Process user chat message and generate response."""
        try:
            prompt = f"""User is asking about their presentation. Respond helpfully and concisely.
            
User message: {message}

Provide a helpful response about presentation creation or suggestions for improving their slides."""
            
            response = self.llm.invoke([{"role": "user", "content": prompt}])
            
            return response.content
        except Exception as e:
            raise Exception(f"Error processing chat: {str(e)}")

    def list_user_presentations(self):
        """List all presentations for the user."""
        presentations = Presentation.query.filter_by(user_id=self.user_id).all()
        return [{
            'presentation_id': p.id,
            'title': p.title,
            'topic': p.topic,
            'slide_count': p.slide_count,
            'status': p.status,
            'created_at': p.created_at.isoformat(),
            'expires_at': p.expires_at.isoformat() if p.expires_at else None
        } for p in presentations]

class PlanningAgent:
    def __init__(self, topic, slide_count):
        self.topic = topic
        self.slide_count = slide_count

    def generate_plan(self):
        """Generate a slide plan based on the topic and slide count."""
        plan = []
        for i in range(1, self.slide_count + 1):
            plan.append({
                'slide_number': i,
                'title': f'Slide {i} Title',
                'content_outline': f'Content outline for slide {i} about {self.topic}'
            })
        return plan

class ContentAgent:
    def __init__(self, llm, topic):
        self.llm = llm
        self.topic = topic

    def generate_slide_content(self, slide_plan):
        """Generate HTML/CSS content for a slide based on the plan."""
        slide_number = slide_plan['slide_number']
        title = slide_plan['title']
        content_outline = slide_plan['content_outline']

        prompt = f"""
        Create HTML/CSS for slide {slide_number}.
        Title: {title}
        Content: {content_outline}
        Topic: {self.topic}
        """

        response = self.llm.invoke([{"role": "user", "content": prompt}])
        return response.content

class ImageAgent:
    def __init__(self, image_service):
        self.image_service = image_service

    def fetch_image(self, slide_plan):
        """Fetch an image URL based on the slide content outline."""
        content_outline = slide_plan['content_outline']
        keywords = ' '.join(content_outline.split()[:5])  # Use first 5 words as keywords
        return self.image_service.fetch_image(keywords)

class FinalizationAgent:
    def __init__(self, presentation_id, user_id):
        self.presentation_id = presentation_id
        self.user_id = user_id

    def finalize_presentation(self):
        """Combine slides and save metadata for the presentation."""
        metadata = {
            'presentation_id': self.presentation_id,
            'user_id': self.user_id,
            'finalized_at': datetime.now().isoformat()
        }
        save_presentation_metadata(
            os.path.join(SLIDES_DIR, self.user_id, self.presentation_id, 'metadata.json'),
            metadata
        )
