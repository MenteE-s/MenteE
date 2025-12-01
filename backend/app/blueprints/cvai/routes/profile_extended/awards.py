from . import profile_bp
from .utils import register_crud, ser_award, build_award, update_award
from app.models import Award

register_crud("awards", Award, "award", ser_award, build_award, update_award)
