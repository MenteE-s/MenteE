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
from functools import wraps

# Create Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-string')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
# Allow JWT to be passed via Authorization header (Bearer token) - required for frontend auth
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_HEADER_TYPE'] = 'Bearer'

# Configure CORS to allow the Vercel frontend
# Cover both /api/* and /api/v1/* paths since frontend may call either
CORS(app, resources={
    r"/api/*": {"origins": [
    "http://localhost:3000",
    "http://localhost:3001", 
    "https://recruai-nine.vercel.app",
    "https://*.vercel.app"
    ]},
    r"/api/v1/*": {"origins": [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://recruai-nine.vercel.app",
        "https://*.vercel.app"
    ]}
}, supports_credentials=True)


@app.after_request
def ensure_cors_credentials(response):
    """Guarantee CORS responses include the credentials flag for API routes."""
    if request.path.startswith(('/api/', '/api_v1/', '/api')):
        response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

# Initialize JWT
jwt = JWTManager(app)

# Import db from extensions so blueprint routes use the same instance
from extensions import db

# Initialize database safely with multiple driver attempts
database_url = os.getenv('DATABASE_URL')
db_error = None

if database_url:
    try:
        # Use pg8000 driver (we know it works)
        modified_url = database_url.replace('postgresql://', 'postgresql+pg8000://')
        app.config['SQLALCHEMY_DATABASE_URI'] = modified_url
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        
        # Initialize the shared db instance with this app
        db.init_app(app)
        
        # Import ALL models from src.models so db.create_all() creates all tables
        with app.app_context():
            from src.models import (
                User, Organization, TeamMember, Interview, InterviewAnalysis,
                Post, Application, SavedJob, Message, ProfileSection,
                Experience, Education, Skill, Project, Publication, Award,
                Certification, Language, VolunteerExperience, Reference,
                HobbyInterest, ProfessionalMembership, Patent, CourseTraining,
                SocialMediaLink, KeyAchievement, Conference, SpeakingEngagement,
                License, AIInterviewAgent, ConversationMemory, SystemIssue
            )
            
            app.User = User
            app.Interview = Interview
            
            # Auto-create all tables if they don't exist
            db.create_all()
            print("✅ Database tables created/verified")
        
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
            
            # Create access token - identity must be a string for Flask-JWT-Extended
            access_token = create_access_token(identity=str(user.id))
            
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
            
            # Identity must be a string for Flask-JWT-Extended
            access_token = create_access_token(identity=str(user.id))
            
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
        # get_jwt_identity returns string, convert to int for DB query
        current_user_id = int(get_jwt_identity())
        
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
        # get_jwt_identity returns string, convert to int for DB query
        current_user_id = int(get_jwt_identity())
        
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
        # get_jwt_identity returns string, convert to int for DB
        current_user_id = int(get_jwt_identity())
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

@app.route('/api/v1/debug/routes')
def debug_routes():
    """Debug endpoint to list all registered routes"""
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            "endpoint": rule.endpoint,
            "methods": list(rule.methods - {'HEAD', 'OPTIONS'}),
            "path": rule.rule
        })
    # Filter to show /api/ routes
    api_routes = [r for r in routes if r['path'].startswith('/api/')]
    return jsonify({
        "total_routes": len(routes),
        "api_routes_count": len(api_routes),
        "sample_api_routes": api_routes[:20]
    })

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

@app.route('/debug/tables')
def debug_tables():
    """Debug endpoint to list all database tables and test queries"""
    try:
        # List all tables
        result = db.session.execute(db.text("""
            SELECT table_name FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        """))
        tables = [row[0] for row in result.fetchall()]
        
        # Test specific model queries
        test_results = {}
        try:
            from src.models import Application
            test_results['applications_count'] = Application.query.count()
        except Exception as e:
            test_results['applications_error'] = str(e)
        
        try:
            from src.models import SavedJob
            test_results['saved_jobs_count'] = SavedJob.query.count()
        except Exception as e:
            test_results['saved_jobs_error'] = str(e)
            
        try:
            from src.models import Post
            test_results['posts_count'] = Post.query.count()
        except Exception as e:
            test_results['posts_error'] = str(e)
        
        return jsonify({
            "status": "ok",
            "tables": tables,
            "test_results": test_results
        })
    except Exception as e:
        import traceback
        return jsonify({
            "status": "error",
            "error": str(e),
            "traceback": traceback.format_exc()
        }), 500

@app.route('/api/v1/chat', methods=['POST'])
@jwt_required()
def chat():
    try:
        # get_jwt_identity returns string, convert to int
        current_user_id = int(get_jwt_identity())
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

# Register the RecruAI API blueprint to get all the additional endpoints
# The blueprint routes are under /api (without /v1)
blueprint_error = None
blueprint_registered = False
try:
    from src.blueprints.recruai.routes.api import api_bp
    # Register once under /api
    app.register_blueprint(api_bp, url_prefix="/api")
    print("✅ RecruAI API blueprint registered")
    blueprint_registered = True
except Exception as e:
    blueprint_error = f"{type(e).__name__}: {str(e)}"
    print(f"⚠️ Could not register RecruAI blueprint: {e}")
    import traceback
    traceback.print_exc()

def _duplicate_api_routes_to_v1(app):
    """Duplicate all /api/* routes under /api/v1/* without redirect, to satisfy CORS preflights."""
    # Build a list first to avoid modifying the map while iterating
    api_rules = [rule for rule in app.url_map.iter_rules() if rule.rule.startswith('/api/')]
    for rule in api_rules:
        v1_path = rule.rule.replace('/api/', '/api/v1/', 1)
        # Create a unique endpoint name to avoid collision
        v1_endpoint = f"{rule.endpoint}_v1"
        # Fetch the original view function
        view_func = app.view_functions.get(rule.endpoint)
        if not view_func:
            continue
        # Register the new rule with same methods excluding HEAD/OPTIONS (Flask will handle OPTIONS via CORS)
        methods = list(rule.methods) if rule.methods else None
        if methods:
            methods = [m for m in methods if m not in {'OPTIONS'}]
        app.add_url_rule(
            v1_path,
            endpoint=v1_endpoint,
            view_func=view_func,
            methods=methods,
        )

# After blueprint registration, duplicate routes to /api/v1/*
try:
    _duplicate_api_routes_to_v1(app)
    print("✅ Duplicated /api routes under /api/v1 for compatibility")
except Exception as e:
    print(f"⚠️ Could not duplicate /api routes to /api/v1: {e}")

@app.route('/api/v1/debug/blueprint')
def debug_blueprint():
    """Debug endpoint to check blueprint registration"""
    return jsonify({
        "blueprint_registered": blueprint_registered,
        "blueprint_error": blueprint_error,
        "src_exists": __import__('os').path.exists('src'),
        "src_blueprints_exists": __import__('os').path.exists('src/blueprints'),
        "cwd": __import__('os').getcwd(),
        "dir_contents": __import__('os').listdir('.')
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
