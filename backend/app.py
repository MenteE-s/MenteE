"""Legacy runner kept for convenience.

This file previously contained a duplicate app factory registering only the
RecruAI blueprint, which caused divergence from the unified factory in
`app/__init__.py` (where CVAI and compatibility auth blueprints are
registered). Running `python app.py` therefore omitted `/api/cvai` and
`/api/login` routes, producing 404 responses. Simplify by delegating to the
canonical factory.
"""

from flask import Flask, jsonify
from flask_cors import CORS
import os

def create_app():
    app = Flask(__name__)
    
    # Basic configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    
    # Initialize CORS
    CORS(app)
    
    # Simple health check routes
    @app.route('/')
    def root():
        return jsonify({
            "status": "ok", 
            "message": "RecruAI Backend is running!",
            "version": "1.0.0",
            "port": os.getenv('PORT', 'not-set')
        })
    
    @app.route('/health')
    def health():
        return jsonify({"status": "healthy"})
    
    @app.route('/test-db')
    def test_db():
        try:
            import psycopg2
            conn = psycopg2.connect(os.getenv('DATABASE_URL'))
            cursor = conn.cursor()
            cursor.execute("SELECT version();")
            version = cursor.fetchone()[0]
            cursor.close()
            conn.close()
            return jsonify({
                "status": "database_connected",
                "postgres_version": version[:50]
            })
        except Exception as e:
            return jsonify({
                "status": "database_error",
                "error": str(e)
            }), 500
    
    return app

# Create the app instance
app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=os.getenv("FLASK_DEBUG", "1") == "1")
