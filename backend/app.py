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
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
import os
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import re

# Create Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-string')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
# Allow JWT to be passed via Authorization header (Bearer token) - required for frontend auth
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_HEADER_TYPE'] = 'Bearer'
CORS(app)

# Initialize JWT
jwt = JWTManager(app)

# Initialize database safely with multiple driver attempts
db = None
database_url = os.getenv('DATABASE_URL')
db_error = None

if database_url:
    try:
        from flask_sqlalchemy import SQLAlchemy
        
        # Use pg8000 driver (we know it works)
        modified_url = database_url.replace('postgresql://', 'postgresql+pg8000://')
        app.config['SQLALCHEMY_DATABASE_URI'] = modified_url
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        
        db = SQLAlchemy()
        db.init_app(app)
        
        # Define models
        with app.app_context():
            class User(db.Model):
                id = db.Column(db.Integer, primary_key=True)
                email = db.Column(db.String(120), unique=True, nullable=False)
                password_hash = db.Column(db.String(128))
                created_at = db.Column(db.DateTime, default=datetime.utcnow)
                
                def set_password(self, password):
                    self.password_hash = generate_password_hash(password)
                
                def check_password(self, password):
                    return check_password_hash(self.password_hash, password)
                
                def to_dict(self):
                    return {
                        'id': self.id,
                        'email': self.email,
                        'created_at': self.created_at.isoformat()
                    }

            class Interview(db.Model):
                id = db.Column(db.Integer, primary_key=True)
                user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
                title = db.Column(db.String(200), nullable=False)
                created_at = db.Column(db.DateTime, default=datetime.utcnow)
                
                def to_dict(self):
                    return {
                        'id': self.id,
                        'user_id': self.user_id,
                        'title': self.title,
                        'created_at': self.created_at.isoformat()
                    }
            
            app.User = User
            app.Interview = Interview
        
        print("✅ SQLAlchemy and models initialized successfully")
        
    except Exception as e:
        db_error = f"Database initialization error: {str(e)}"
        print(f"⚠️ Database initialization failed: {e}")

# Helper function to validate email
def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

# Routes
@app.route('/')
def root():
    return jsonify({
        "status": "ok",
        "message": "RecruAI Backend is running!",
        "version": "1.0.0",
        "database": "connected" if db else "disabled",
        "features": ["authentication", "interviews", "chat"]
    })

@app.route('/health')
def health():
    return jsonify({"status": "healthy"})

# Authentication Routes
@app.route('/api/v1/auth/register', methods=['POST'])
def register():
    if not db:
        return jsonify({"error": "Database not available"}), 500
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        # Validation
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        
        if not is_valid_email(email):
            return jsonify({"error": "Invalid email format"}), 400
        
        if len(password) < 6:
            return jsonify({"error": "Password must be at least 6 characters"}), 400
        
        with app.app_context():
            # Check if user exists
            if app.User.query.filter_by(email=email).first():
                return jsonify({"error": "Email already registered"}), 400
            
            # Create new user
            user = app.User(email=email)
            user.set_password(password)
            
            db.session.add(user)
            db.session.commit()
            
            # Create access token
            access_token = create_access_token(identity=user.id)
            
            return jsonify({
                "message": "User registered successfully",
                "user": user.to_dict(),
                "access_token": access_token
            }), 201
            
    except Exception as e:
        return jsonify({"error": f"Registration failed: {str(e)}"}), 500

@app.route('/api/v1/auth/login', methods=['POST'])
def login():
    if not db:
        return jsonify({"error": "Database not available"}), 500
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        
        with app.app_context():
            user = app.User.query.filter_by(email=email).first()
            
            if not user or not user.check_password(password):
                return jsonify({"error": "Invalid email or password"}), 401
            
            access_token = create_access_token(identity=user.id)
            
            return jsonify({
                "message": "Login successful",
                "user": user.to_dict(),
                "access_token": access_token
            })
            
    except Exception as e:
        return jsonify({"error": f"Login failed: {str(e)}"}), 500

@app.route('/api/v1/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    if not db:
        return jsonify({"error": "Database not available"}), 500
    
    try:
        current_user_id = get_jwt_identity()
        
        with app.app_context():
            user = app.User.query.get(current_user_id)
            if not user:
                return jsonify({"error": "User not found"}), 404
            
            return jsonify({"user": user.to_dict()})
            
    except Exception as e:
        return jsonify({"error": f"Failed to get user: {str(e)}"}), 500

# Interview Routes
@app.route('/api/v1/interviews', methods=['GET'])
@jwt_required()
def get_interviews():
    if not db:
        return jsonify({"error": "Database not available"}), 500
    
    try:
        current_user_id = get_jwt_identity()
        
        with app.app_context():
            interviews = app.Interview.query.filter_by(user_id=current_user_id).all()
            return jsonify({
                "interviews": [interview.to_dict() for interview in interviews]
            })
            
    except Exception as e:
        return jsonify({"error": f"Failed to get interviews: {str(e)}"}), 500

@app.route('/api/v1/interviews', methods=['POST'])
@jwt_required()
def create_interview():
    if not db:
        return jsonify({"error": "Database not available"}), 500
    
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or not data.get('title'):
            return jsonify({"error": "Interview title is required"}), 400
        
        with app.app_context():
            interview = app.Interview(
                user_id=current_user_id,
                title=data['title'].strip()
            )
            
            db.session.add(interview)
            db.session.commit()
            
            return jsonify({
                "message": "Interview created successfully",
                "interview": interview.to_dict()
            }), 201
            
    except Exception as e:
        return jsonify({"error": f"Failed to create interview: {str(e)}"}), 500

# Existing routes
@app.route('/api/v1/health')
def api_health():
    return jsonify({"status": "api_healthy"})

@app.route('/test-db')
def test_db():
    if not db:
        return jsonify({"error": "Database not initialized"}), 500
    
    try:
        with app.app_context():
            result = db.session.execute(db.text('SELECT version()'))
            version = result.fetchone()[0]
            
            user_count = app.User.query.count()
            interview_count = app.Interview.query.count()
            
            return jsonify({
                "status": "database_connected",
                "message": "PostgreSQL connection successful",
                "postgres_version": version[:100],
                "tables": {
                    "users": user_count,
                    "interviews": interview_count
                }
            })
    except Exception as e:
        return jsonify({
            "status": "database_error", 
            "error": str(e)
        }), 500

@app.route('/api/v1/chat', methods=['POST'])
@jwt_required()
def chat():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json() or {}
        message = data.get('message', 'Hello')
        
        # Simple echo for now - we'll add Groq integration next
        return jsonify({
            "response": f"RecruAI (User {current_user_id}): {message}",
            "status": "success"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Debug routes
@app.route('/api/v1/debug/token', methods=['POST'])
def debug_token():
    """Debug JWT token validation"""
    try:
        data = request.get_json()
        token = data.get('token')
        
        if not token:
            return jsonify({"error": "No token provided"}), 400
        
        from flask_jwt_extended import decode_token
        decoded = decode_token(token)
        
        return jsonify({
            "status": "token_valid",
            "decoded": decoded,
            "user_id": decoded.get('sub'),
            "expires": decoded.get('exp')
        })
        
    except Exception as e:
        return jsonify({
            "status": "token_invalid", 
            "error": str(e),
            "error_type": type(e).__name__
        }), 422

@app.route('/api/v1/debug/jwt-config', methods=['GET'])
def debug_jwt_config():
    """Debug JWT configuration"""
    return jsonify({
        "jwt_secret_set": bool(app.config.get('JWT_SECRET_KEY')),
        "jwt_secret_length": len(app.config.get('JWT_SECRET_KEY', '')),
        "jwt_algorithm": "HS256",
        "jwt_expires": str(app.config.get('JWT_ACCESS_TOKEN_EXPIRES'))
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
