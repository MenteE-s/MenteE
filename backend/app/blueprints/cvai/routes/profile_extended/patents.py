from . import profile_bp
from .utils import register_crud, ser_patent, build_patent, update_patent
from app.models import Patent

register_crud("patents", Patent, "patent", ser_patent, build_patent, update_patent)
