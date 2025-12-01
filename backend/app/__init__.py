"""Application package providing the Flask app factory.

Moving the factory code here eliminates the name collision between the
package directory `app/` and the former top-level `app.py` module, so
`flask --app app ...` now works without setting environment variables.
"""

import os
from dotenv import load_dotenv
from flask import Flask, jsonify, send_from_directory

from config import Config
from extensions import db, migrate, jwt

# Import blueprints from the package structure
from app.blueprints.recruai.routes.api import api_bp  # type: ignore
# Register only implemented CVAI blueprints; drop non-existent/empty ones to avoid import errors
from app.blueprints.cvai.routes import auth, profile_extended  # type: ignore


def create_app(config_object: object | None = None):
	"""Flask application factory.

	- Loads environment from .env
	- Initializes extensions (db, migrate, jwt)
	- Registers blueprints under /api
	- Adds common security headers
	"""
	here = os.path.dirname(os.path.abspath(__file__))
	dotenv_path = os.path.join(os.path.dirname(here), ".env")  # backend/.env
	load_dotenv(dotenv_path)

	app = Flask(__name__)
	app.config.from_object(config_object or Config)

	# Initialize extensions
	db.init_app(app)
	migrate.init_app(app, db)
	jwt.init_app(app)

	# Background scheduler (non-critical)
	try:
		from scheduler import init_scheduler  # type: ignore
		init_scheduler()
	except Exception as e:  # pragma: no cover
		print(f"Warning: Could not initialize background scheduler: {e}")

	# CORS for frontend dev
	try:
		from flask_cors import CORS  # type: ignore
		# Support multiple dev frontends: allow comma-separated FRONTEND_ORIGIN list
		origins_raw = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000,http://localhost:3001")
		origins = [o.strip() for o in origins_raw.split(',') if o.strip()]
		app.config["FRONTEND_ORIGIN"] = origins_raw  # expose raw for compat preflight helper
		CORS(app, resources={r"/api/*": {"origins": origins}}, supports_credentials=True)
	except Exception:
		pass

	# Register RecruAI blueprint
	app.register_blueprint(api_bp, url_prefix="/api")
	# Register CVAI blueprints under /api/cvai
	app.register_blueprint(auth.bp, url_prefix="/api/cvai")
	# Use the extended profile API; basic routes are superseded to avoid duplicate /me endpoints
	app.register_blueprint(profile_extended.profile_bp, url_prefix="/api/cvai")

	@app.route('/uploads/<path:filename>')
	def uploaded_file(filename):  # type: ignore
		return send_from_directory(os.path.join(os.path.dirname(here), 'uploads'), filename)

	app.config.setdefault("SESSION_COOKIE_HTTPONLY", True)
	app.config.setdefault("SESSION_COOKIE_SECURE", os.getenv("SESSION_COOKIE_SECURE", "0") == "1")

	if app.config.get("SECRET_KEY") in (None, "dev-secret") or app.config.get("JWT_SECRET_KEY") in (None, app.config.get("SECRET_KEY")):
		print("WARNING: SECRET_KEY or JWT_SECRET_KEY appears to be using a default value. Set them in backend/.env for secure deployments.")

	@app.after_request
	def set_security_headers(response):  # type: ignore
		response.headers.setdefault("X-Content-Type-Options", "nosniff")
		response.headers.setdefault("X-Frame-Options", "SAMEORIGIN")
		response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
		if os.getenv("ENABLE_HSTS", "0") == "1":
			response.headers.setdefault("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
		return response

	@app.before_request
	def log_auth_header():  # type: ignore
		from flask import request
		if request.path == "/api/auth/me":
			print("DEBUG: Authorization header:", request.headers.get("Authorization"))

	@app.route("/")
	def index():  # type: ignore
		return jsonify({"status": "ok", "message": "Unified backend running"})

	try:  # shell context convenience
		from app.models import User  # type: ignore

		@app.shell_context_processor
		def make_shell_context():  # type: ignore
			return {"db": db, "User": User}
	except Exception:
		pass

	return app


# Expose an app instance for `flask --app app run` and migration commands
app = create_app()
