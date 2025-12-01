from flask_jwt_extended import jwt_required

from . import profile_bp
from .utils import register_crud, ser_education, build_education, update_education
from app.models import Education

register_crud(
    "education",
    Education,
    "education",
    ser_education,
    build_education,
    update_education,
)
