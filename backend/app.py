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
    app.config['DATABASE_URL'] = os.getenv('DATABASE_URL')
    
    # Initialize CORS
    CORS(app)
    
    # Health check routes
    @app.route('/')
    def root():
        return jsonify({
            "status": "ok", 
            "message": "RecruAI Backend is running!",
            "version": "1.0.0",
            "endpoints": ["/", "/health", "/api/v1/health", "/test-db"]
        })
    
    @app.route('/health')
    def health():
        return jsonify({"status": "healthy", "service": "RecruAI"})
    
    @app.route('/test-db')
    def test_db():
        """Test database connection without SQLAlchemy"""
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
                "postgres_version": version[:100],
                "message": "Direct psycopg2 connection successful"
            })
        except Exception as e:
            return jsonify({
                "status": "database_error",
                "error": str(e),
                "message": "Will add SQLAlchemy back once basic app works"
            }), 500
    
    # Try to register API blueprint, but don't fail if it doesn't work
    try:
        from app.blueprints.recruai.routes.api import api_bp
        app.register_blueprint(api_bp, url_prefix='/api/v1')
        print("✅ API Blueprint registered successfully")
    except Exception as e:
        print(f"⚠️  Warning: Could not register API blueprint: {e}")
        
        # Create simple API endpoints as fallback
        @app.route('/api/v1/health')
        def api_health():
            return jsonify({"status": "api_healthy", "message": "Basic API working"})
        
        @app.route('/api/v1/chat', methods=['POST'])
        def simple_chat():
            from flask import request
            try:
                data = request.get_json()
                message = data.get('message', '')
                
                # Simple response for now
                return jsonify({
                    "response": f"Echo: {message}",
                    "message": "Basic chat endpoint - will integrate Groq properly soon"
                })
            except Exception as e:
                return jsonify({"error": str(e)}), 500
    
    return app

# Create the app instance
app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=os.getenv("FLASK_DEBUG", "1") == "1")
