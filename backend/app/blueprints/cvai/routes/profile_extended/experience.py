from flask_jwt_extended import jwt_required

from . import profile_bp
from .utils import register_crud, ser_experience, build_experience, update_experience
from app.models import Experience

register_crud(
    "experience",
    Experience,
    "experience",
    ser_experience,
    build_experience,
    update_experience,
)
