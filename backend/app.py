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

# Create Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
CORS(app)

# Initialize database safely
db = None
database_url = os.getenv('DATABASE_URL')
db_error = None

print(f"🔍 Starting app with DATABASE_URL: {database_url[:50] if database_url else 'None'}...")

try:
    if database_url:
        print("📦 Importing SQLAlchemy...")
        from flask_sqlalchemy import SQLAlchemy
        from datetime import datetime
        
        print("🔧 Configuring SQLAlchemy...")
        # Fix potential Railway DATABASE_URL format
        if database_url.startswith('postgres://'):
            database_url = database_url.replace('postgres://', 'postgresql://', 1)
        
        app.config['SQLALCHEMY_DATABASE_URI'] = database_url
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        
        print("🏗️ Initializing SQLAlchemy...")
        db = SQLAlchemy()
        db.init_app(app)
        
        print("📋 Defining models...")
        # Define models inside app context
        with app.app_context():
            class User(db.Model):
                id = db.Column(db.Integer, primary_key=True)
                email = db.Column(db.String(120), unique=True, nullable=False)
                password_hash = db.Column(db.String(128))
                created_at = db.Column(db.DateTime, default=datetime.utcnow)

            class Interview(db.Model):
                id = db.Column(db.Integer, primary_key=True)
                user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
                title = db.Column(db.String(200), nullable=False)
                created_at = db.Column(db.DateTime, default=datetime.utcnow)
            
            # Store models globally
            app.User = User
            app.Interview = Interview
        
        print("✅ SQLAlchemy initialized successfully")
    else:
        db_error = "DATABASE_URL environment variable not found"
        print(f"❌ {db_error}")
        
except Exception as e:
    db_error = f"SQLAlchemy initialization error: {str(e)}"
    print(f"⚠️ Database initialization failed: {e}")
    import traceback
    traceback.print_exc()

# Routes
@app.route('/')
def root():
    return jsonify({
        "status": "ok",
        "message": "RecruAI Backend is running!",
        "version": "1.0.0",
        "database": "connected" if db else "disabled",
        "database_error": db_error
    })

@app.route('/debug-env')
def debug_env():
    """Debug environment variables"""
    return jsonify({
        "DATABASE_URL_exists": database_url is not None,
        "DATABASE_URL_type": type(database_url).__name__,
        "DATABASE_URL_length": len(database_url) if database_url else 0,
        "DATABASE_URL_starts_with": database_url[:30] if database_url else None,
        "db_object_exists": db is not None,
        "db_error": db_error,
        "flask_sqlalchemy_installed": True
    })

@app.route('/health')
def health():
    return jsonify({"status": "healthy"})

@app.route('/create-tables')
def create_tables():
    if not db:
        return jsonify({"error": "Database not initialized", "reason": db_error}), 500
    
    try:
        with app.app_context():
            db.create_all()
            return jsonify({
                "status": "success",
                "message": "All tables created successfully"
            })
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500

@app.route('/test-db')
def test_db():
    if not db:
        return jsonify({"error": "Database not initialized", "reason": db_error}), 500
    
    try:
        with app.app_context():
            # Simple connection test
            result = db.session.execute(db.text('SELECT version()'))
            version = result.fetchone()[0]
            
            return jsonify({
                "status": "database_connected",
                "message": "PostgreSQL connection successful",
                "postgres_version": version[:100]
            })
    except Exception as e:
        return jsonify({
            "status": "database_error", 
            "error": str(e)
        }), 500

@app.route('/api/v1/health')
def api_health():
    return jsonify({"status": "api_healthy"})

@app.route('/api/v1/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json() or {}
        message = data.get('message', 'Hello')
        
        return jsonify({
            "response": f"RecruAI received: {message}",
            "status": "success"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
