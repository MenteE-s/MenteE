from . import profile_bp
from .utils import register_crud, ser_course, build_course, update_course
from app.models import CourseTraining

register_crud("courses", CourseTraining, "course", ser_course, build_course, update_course)
