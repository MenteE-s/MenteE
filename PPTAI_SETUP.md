# PPTAI - AI Presentation Generator Setup Guide

## Overview
PPTAI is an intelligent presentation generator that uses Groq AI to create professional slide decks automatically. Users input a topic, and the AI generates multiple slides with images from Unsplash, all previewed in real-time.

## Features
- 🚀 Real-time slide generation streaming
- 🎨 Professional HTML/CSS slides with multiple templates
- 🖼️ Automatic image fetching from Unsplash
- 💬 Chat interface for multi-turn conversation
- 📥 PDF export with headless browser rendering
- 🗑️ Auto-cleanup of presentations after 7 days
- ✨ Split-screen live preview interface

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
playwright install
```

### 2. Environment Variables
Add these to your `.env` file in the `backend/` directory:

```env
# Groq API (for AI slide generation)
GROQ_API_KEY=your_groq_api_key_here

# Unsplash API (for images)
UNSPLASH_API_KEY=your_unsplash_api_key_here

# Flask
FLASK_ENV=development
FLASK_DEBUG=1
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here

# Database (existing)
DATABASE_URL=postgresql://user:password@localhost/dbname

# Frontend Origins
FRONTEND_ORIGIN=http://localhost:3000,http://localhost:5173
```

### 3. API Keys
Get your API keys from:
- **Groq**: https://console.groq.com/keys
- **Unsplash**: https://unsplash.com/oauth/applications

### 4. File Structure
The backend creates these directories automatically:
```
backend/
├── app/
│   ├── slides/           # User presentations (created at runtime)
│   │   └── {user_id}/
│   │       └── {presentation_id}/
│   │           ├── slide_1.html
│   │           ├── slide_2.html
│   │           └── metadata.json
│   └── exports/          # PDF exports (created at runtime)
│       └── {user_id}/
│           └── {presentation_id}.pdf
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend/pptai
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Access the app at `http://localhost:5173`

## API Endpoints

All endpoints require JWT authentication (Authorization header).

### Generate Presentation
```
POST /api/pptai/generate
Query Parameters:
  - topic: string (presentation topic)
  - slide_count: number (default: 5)

Response: Server-Sent Events (SSE)
  Event data format: { "slide": "<html>...", "number": 1 }
```

### Download Presentation
```
GET /api/pptai/download/{presentation_id}

Response:
{
  "download_url": "/api/pptai/download-file/{presentation_id}",
  "filename": "presentation_{id}.pdf"
}
```

### Chat with AI
```
POST /api/pptai/chat
Body:
{
  "message": "user message",
  "presentation_id": "optional"
}

Response:
{
  "response": "AI response text"
}
```

### List User Presentations
```
GET /api/pptai/list

Response:
{
  "presentations": [
    {
      "presentation_id": "uuid",
      "topic": "topic string",
      "slide_count": 5,
      "created_at": "ISO timestamp",
      "expires_at": "ISO timestamp"
    }
  ]
}
```

## How It Works

### Slide Generation Flow
1. User enters topic and selects slide count
2. Frontend sends request to `/api/pptai/generate`
3. Backend uses Groq to generate HTML/CSS for each slide
4. For each slide, AI suggests image keywords
5. Backend fetches matching image from Unsplash
6. Image URL is injected into HTML
7. Backend streams HTML to frontend via SSE
8. Frontend displays each slide as it arrives
9. Metadata is saved with expiration date (7 days)

### PDF Export Flow
1. User clicks "Download PDF"
2. Backend retrieves all slide HTML files
3. Playwright renders each HTML to PDF
4. PyPDF2 combines all PDFs
5. User downloads merged PDF file

### Cleanup
- Presentations expire after 7 days
- Scheduler can run cleanup via: `python scheduler.py`
- Or manually call cleanup from management script

## Slide Templates

The AI generates slides using these templates:

### Title Slide
```html
<h1>Slide Title</h1>
<p>Subtitle</p>
<img src="" alt="image">
```

### Content Slide
```html
<h2>Section Title</h2>
<ul>
  <li>Key point 1</li>
  <li>Key point 2</li>
</ul>
<img src="" alt="image">
```

### Two Column Layout
```html
<div class="column">
  <h2>Left Content</h2>
  <p>Description</p>
</div>
<div class="column">
  <img src="" alt="image">
</div>
```

## Testing

### Test Slide Generation
```bash
curl -X POST http://localhost:5000/api/pptai/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"topic": "Machine Learning", "slide_count": 5}'
```

### Test PDF Export
```bash
curl -X GET http://localhost:5000/api/pptai/download/{presentation_id} \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o presentation.pdf
```

## Troubleshooting

### Groq API Errors
- Verify API key in `.env`
- Check rate limits at https://console.groq.com
- Ensure model name is correct ("mixtral-8x7b-32768")

### Unsplash API Errors
- Verify API key is valid
- Check rate limit (50 requests/hour for free tier)
- Ensure keywords are not empty

### PDF Export Issues
- Install Playwright browsers: `playwright install`
- Check that Chromium is available
- Verify PyPDF2 is installed: `pip install PyPDF2`

### File Storage Issues
- Ensure `backend/app/slides/` directory is writable
- Check disk space for PDF exports
- Verify file permissions on Linux/Mac

## Performance Tips

1. **Image Caching**: Unsplash URLs are cached; consider Redis for user preferences
2. **PDF Generation**: Use async processing for large presentations
3. **Stream Optimization**: Reduce HTML size by minifying CSS
4. **Cleanup**: Run cleanup job during off-peak hours

## Security Notes

- Never expose `GROQ_API_KEY` or `UNSPLASH_API_KEY` to frontend
- All endpoints require JWT authentication
- File uploads are restricted to authenticated users
- Presentations are scoped to user_id
- HTML in slides is rendered in iframe sandbox for XSS protection

## Future Enhancements

- [ ] Custom slide templates/themes
- [ ] Collaboration features
- [ ] Slide editing interface
- [ ] Speaker notes
- [ ] Presentation analytics
- [ ] Multiple language support
- [ ] Video/animation support
- [ ] Cloud storage integration
