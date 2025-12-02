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

# Initialize database safely with multiple driver attempts
db = None
database_url = os.getenv('DATABASE_URL')
db_error = None

print(f"🔍 Starting app with DATABASE_URL: {database_url[:50] if database_url else 'None'}...")

if database_url:
    try:
        print("📦 Importing SQLAlchemy...")
        from flask_sqlalchemy import SQLAlchemy
        from datetime import datetime
        
        # Try different PostgreSQL drivers
        drivers_to_try = [
            ('postgresql+pg8000://', 'pg8000'),
            ('postgresql+psycopg2://', 'psycopg2'),
            ('postgresql://', 'default')
        ]
        
        for driver_prefix, driver_name in drivers_to_try:
            try:
                print(f"🔧 Trying {driver_name} driver...")
                
                # Modify URL for specific driver
                if driver_name == 'pg8000':
                    modified_url = database_url.replace('postgresql://', 'postgresql+pg8000://')
                elif driver_name == 'psycopg2':
                    modified_url = database_url.replace('postgresql://', 'postgresql+psycopg2://')
                else:
                    modified_url = database_url
                
                app.config['SQLALCHEMY_DATABASE_URI'] = modified_url
                app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
                
                db = SQLAlchemy()
                db.init_app(app)
                
                # Test the connection
                with app.app_context():
                    db.session.execute(db.text('SELECT 1'))
                    print(f"✅ {driver_name} driver working!")
                    break
                    
            except Exception as driver_error:
                print(f"❌ {driver_name} failed: {driver_error}")
                db = None
                continue
        
        if db:
            print("📋 Defining models...")
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
                
                app.User = User
                app.Interview = Interview
            
            print("✅ SQLAlchemy initialized successfully")
        else:
            db_error = "All PostgreSQL drivers failed"
        
    except Exception as e:
        db_error = f"SQLAlchemy initialization error: {str(e)}"
        print(f"⚠️ Database initialization failed: {e}")

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
                "postgres_version": version[:100],
                "driver": app.config.get('SQLALCHEMY_DATABASE_URI', '')[:30]
            })
    except Exception as e:
        return jsonify({
            "status": "database_error", 
            "error": str(e)
        }), 500

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
