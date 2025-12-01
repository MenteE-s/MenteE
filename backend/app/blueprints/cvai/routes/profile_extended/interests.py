from . import profile_bp
from .utils import register_crud, ser_interest, build_interest, update_interest
from app.models import HobbyInterest

register_crud("interests", HobbyInterest, "interest", ser_interest, build_interest, update_interest)
