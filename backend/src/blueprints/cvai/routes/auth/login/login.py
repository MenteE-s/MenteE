from flask import request, jsonify
from werkzeug.exceptions import BadRequest
from flask_jwt_extended import create_access_token

from src.models import User
from .. import bp


@bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    if not all(k in data for k in ("email", "password")):
        raise BadRequest("Missing required fields")

    user = User.query.filter_by(email=data["email"]).first()
    if not user or not user.check_password(data["password"]):
        return jsonify({"message": "Invalid credentials"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": token, "user": user.to_dict()}), 200
