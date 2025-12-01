from . import profile_bp
from .utils import register_crud, ser_reference, build_reference, update_reference
from app.models import Reference

register_crud("references", Reference, "reference", ser_reference, build_reference, update_reference)
