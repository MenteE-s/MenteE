from flask import Blueprint
from flask_cors import CORS

api_bp = Blueprint('api', __name__)
CORS(api_bp)

# Import other modules
from . import auth  # noqa: E402, F401
from . import interviews  # noqa: E402, F401
from . import users  # noqa: E402, F401
from . import ai_service  # noqa: E402, F401

# Temporarily disable RAG module until we configure it properly
# from . import rag  # noqa: E402, F401
