from flask import Blueprint
from flask_cors import CORS

api_bp = Blueprint('api', __name__)
CORS(api_bp)

# Import modules in correct order to avoid circular imports
from . import auth  # noqa: E402, F401
from . import users  # noqa: E402, F401
from . import interviews  # noqa: E402, F401

# Import ai_service last and handle import error
try:
    from . import ai_service  # noqa: E402, F401
except ImportError as e:
    print(f"Warning: Could not import ai_service: {e}")

# Comment out RAG module temporarily (causes OpenAI API key issues)
# from . import rag  # noqa: E402, F401
