"""CVAI Organization blueprint.

Provides organization management endpoints:
  GET    /organizations
  GET    /organizations/<id>
  POST   /organizations
  PUT    /organizations/<id>
  DELETE /organizations/<id>
"""

from flask import Blueprint

bp = Blueprint("cvai_organizations", __name__)

# Import route modules so their decorators register with this blueprint
from . import organizations  # noqa: F401