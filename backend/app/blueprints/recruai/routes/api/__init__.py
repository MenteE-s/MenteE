from flask import Blueprint
from flask_cors import CORS

api_bp = Blueprint('api', __name__)
CORS(api_bp)

# Import modules in correct order to avoid circular imports
from . import auth  # noqa: E402, F401
from . import users  # noqa: E402, F401
from . import interviews  # noqa: E402, F401

# Import individual user routes (saved_jobs, applied_jobs, etc.)
try:
    from .ind import saved_jobs  # noqa: E402, F401
    from .ind import applied_jobs  # noqa: E402, F401
    from .ind import analytics as ind_analytics  # noqa: E402, F401
    from .ind import ai_agents as ind_ai_agents  # noqa: E402, F401
    from .ind import practice  # noqa: E402, F401
except ImportError as e:
    print(f"Warning: Could not import ind submodule: {e}")

# Import organization routes
try:
    from .org import organizations  # noqa: E402, F401
    from .org import posts  # noqa: E402, F401
    from .org import applications  # noqa: E402, F401
    from .org import analytics as org_analytics  # noqa: E402, F401
    from .org import ai_agents as org_ai_agents  # noqa: E402, F401
    from .org import uploads  # noqa: E402, F401
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
