"""Profile Basic blueprint package.

Provides consolidated basic profile CRUD endpoints split across modules:
  - me:     GET/PUT /me (profile overview & bulk update)
  - experience: CRUD /me/experience
  - education:  CRUD /me/education
  - projects:   CRUD /me/projects
  - skills:     POST /me/skills & DELETE /me/skills/<id>

Shared helper & serialization functions live in utils.py.
"""

from flask import Blueprint

profile_bp = Blueprint("profile", __name__)

# Import route modules so their decorators register with profile_bp
from . import me, experience, education, projects, skills  # noqa: E402,F401
