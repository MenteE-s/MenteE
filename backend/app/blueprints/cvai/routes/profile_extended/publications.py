from . import profile_bp
from .utils import register_crud, ser_publication, build_publication, update_publication
from app.models import Publication

register_crud(
    "publications", Publication, "publication", ser_publication, build_publication, update_publication
)
