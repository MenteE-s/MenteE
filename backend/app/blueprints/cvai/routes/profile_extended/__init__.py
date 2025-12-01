"""Profile Extended blueprint package.

Modular CRUD endpoints for extended profile entities beyond the basic set:
 experience, education, projects, portfolio items, awards, certifications,
 publications, patents, languages, volunteering, interests, social profiles,
 courses, references, and bulk skills handling.

Exports `profile_bp` used by app factory.
"""

from flask import Blueprint

profile_bp = Blueprint("profile_extended", __name__)

# Import modules so route decorators attach to profile_bp
from . import (
    me,
    experience,
    education,
    projects,
    portfolio,
    awards,
    certifications,
    publications,
    patents,
    languages,
    volunteering,
    interests,
    social,
    courses,
    references,
    skills,
    public,
)  # noqa: E402,F401
