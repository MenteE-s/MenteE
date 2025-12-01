from . import profile_bp
from .utils import register_crud, ser_volunteering, build_volunteering, update_volunteering
from app.models import VolunteerExperience

register_crud(
    "volunteering", VolunteerExperience, "volunteering", ser_volunteering, build_volunteering, update_volunteering
)
