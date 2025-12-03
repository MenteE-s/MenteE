from datetime import datetime
from flask import request, jsonify
from werkzeug.exceptions import BadRequest
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from src.models import User
from .. import bp


@bp.route("/update-plan", methods=["POST"])
@jwt_required()
def update_plan():
    data = request.get_json() or {}
    if "plan" not in data:
        raise BadRequest("Missing plan field")
    if data["plan"] not in ["trial", "pro", "free"]:
        raise BadRequest("Invalid plan type")

    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"message": "User not found"}), 404
    user.plan = data["plan"]
    user.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify({"message": "Plan updated successfully", "user": user.to_dict()}), 200
