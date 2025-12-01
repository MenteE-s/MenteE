from . import profile_bp
from .utils import register_crud, ser_cert, build_certification, update_certification
from app.models import Certification

register_crud(
    "certifications", Certification, "certification", ser_cert, build_certification, update_certification
)
