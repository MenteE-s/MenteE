from . import profile_bp
from .utils import register_crud, ser_portfolio_item, build_portfolio_item, update_portfolio_item, project_is_portfolio
from app.models import Project

register_crud(
    "portfolio",
    Project,
    "portfolio_item",
    ser_portfolio_item,
    build_portfolio_item,
    update_portfolio_item,
    predicate=project_is_portfolio,
)
