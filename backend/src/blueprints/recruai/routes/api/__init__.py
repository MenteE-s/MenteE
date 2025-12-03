from flask import Blueprint
from flask_cors import CORS

api_bp = Blueprint('api', __name__)
CORS(api_bp)

# Import modules in correct order to avoid circular imports
from . import auth  # noqa: E402, F401
from . import users  # noqa: E402, F401
from . import interviews  # noqa: E402, F401

# Import ind package (triggers ind/__init__.py -> ind/routes.py -> all ind route modules)
try:
    from . import ind  # noqa: E402, F401
except ImportError as e:
    print(f"Warning: Could not import ind submodule: {e}")

# Import org package (triggers org/__init__.py -> org/routes.py -> all org route modules)
try:
    from . import org  # noqa: E402, F401
except ImportError as e:
    print(f"Warning: Could not import org submodule: {e}")

# Import profile routes
try:
    from . import profile  # noqa: E402, F401
except ImportError as e:
    print(f"Warning: Could not import profile: {e}")

# Import system issues
try:
    from . import system_issues  # noqa: E402, F401
except ImportError as e:
    print(f"Warning: Could not import system_issues: {e}")

# Import ai_service last and handle import error
try:
    from . import ai_service  # noqa: E402, F401
except ImportError as e:
    print(f"Warning: Could not import ai_service: {e}")

# Comment out RAG module temporarily (causes OpenAI API key issues)
# from . import rag  # noqa: E402, F401
