from . import profile_bp
from .utils import register_crud, ser_social, build_social, update_social
from app.models import SocialMediaLink

register_crud("social", SocialMediaLink, "social_profile", ser_social, build_social, update_social)
