from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.models import User
from .. import bp


@bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify({"user": user.to_dict()}), 200
