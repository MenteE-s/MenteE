# import routs

from flask import Blueprint

bp = Blueprint("pptai", __name__)

from . import routes
