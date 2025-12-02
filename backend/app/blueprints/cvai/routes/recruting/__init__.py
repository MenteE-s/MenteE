"""CVAI Recruiting blueprint.

Provides job posting management endpoints:
  GET    /posts
  GET    /posts/<id>
  GET    /organizations/<org_id>/posts
  POST   /posts
  PUT    /posts/<id>
  DELETE /posts/<id>
"""

from flask import Blueprint

bp = Blueprint("cvai_posts", __name__)

# Import route modules so their decorators register with this blueprint
from . import posts  # noqa: F401