from . import profile_bp
from .utils import register_crud, ser_project, build_project, update_project, project_is_regular
from app.models import Project

register_crud(
    "projects",
    Project,
    "project",
    ser_project,
    build_project,
    update_project,
    predicate=project_is_regular,
)
