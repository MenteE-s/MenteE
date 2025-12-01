from datetime import datetime
from flask import request, jsonify
from werkzeug.exceptions import BadRequest
from flask_jwt_extended import create_access_token

from extensions import db
from app.models import User
from .. import bp


@bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    if not all(k in data for k in ("email", "password")):
        raise BadRequest("Missing required fields: email, password")

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "Email already registered"}), 400
    if data.get("username") and User.query.filter_by(username=data["username"]).first():
        return jsonify({"message": "Username already taken"}), 400

    plan = data.get("plan", "trial")
    user = User(
        email=data["email"],
        username=data.get("username"),
        name=data.get("name"),
        plan=plan,
        created_at=datetime.utcnow(),
    )
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()

    # Optionally issue token immediately
    token = create_access_token(identity=str(user.id))
    return jsonify({"message": "User registered successfully", "access_token": token, "user": user.to_dict()}), 201
