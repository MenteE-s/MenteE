"""Modular CVAI auth blueprint.

Provides unified authentication & user management endpoints:
  POST /register
  POST /login
  POST /update-plan
  GET  /me
  GET  /verify
  PUT  /profile

Legacy resume/profile persistence moved to profile_basic / profile_extended.
"""

from flask import Blueprint

bp = Blueprint("cvai_auth", __name__)

# Import route modules so their decorators register with this blueprint.
# Explicitly import submodules to avoid namespace package lazy imports.
from .login import login as _login_mod  # noqa: F401
from .register import register as _register_mod  # noqa: F401
from .plan import plan as _plan_mod  # noqa: F401
from .me import me as _me_mod  # noqa: F401
from .verify import verify as _verify_mod  # noqa: F401
# Profile endpoints (profiles, profile, resumes, etc.)
from .profile import profile_update as _profile_update_mod  # noqa: F401
