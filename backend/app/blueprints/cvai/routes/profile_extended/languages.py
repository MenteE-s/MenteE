from . import profile_bp
from .utils import register_crud, ser_language, build_language, update_language
from app.models import Language

register_crud("languages", Language, "language", ser_language, build_language, update_language)
