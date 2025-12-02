"""Legacy runner kept for convenience.

This file previously contained a duplicate app factory registering only the
RecruAI blueprint, which caused divergence from the unified factory in
`app/__init__.py` (where CVAI and compatibility auth blueprints are
registered). Running `python app.py` therefore omitted `/api/cvai` and
`/api/login` routes, producing 404 responses. Simplify by delegating to the
canonical factory.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import os

# Create Flask app directly (no __init__.py file)
app = Flask(__name__)

# Configure app
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
CORS(app)

# Basic routes
@app.route('/')
def root():
    return jsonify({
        "status": "ok",
        "message": "RecruAI Backend is running!",
        "version": "1.0.0",
        "timestamp": "2025-12-03"
    })

@app.route('/health')
def health():
    return jsonify({"status": "healthy"})

@app.route('/api/v1/health')
def api_health():
    return jsonify({"status": "api_healthy"})

@app.route('/api/v1/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json() or {}
        message = data.get('message', 'Hello')
        
        # Simple echo response for now
        return jsonify({
            "response": f"RecruAI received: {message}",
            "status": "success"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/test-db')
def test_db():
    return jsonify({
        "status": "database_skipped",
        "message": "Database testing disabled for now - app is running!"
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
