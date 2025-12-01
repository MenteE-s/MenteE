from flask import jsonify, request
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from jwt import ExpiredSignatureError
from werkzeug.exceptions import BadRequest

from app.models import User
from .. import bp


@bp.route("/verify", methods=["GET"])
def verify():
    # Return 401 rather than 500 when Authorization header missing or invalid.
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"valid": False, "message": "Missing Authorization header"}), 401
    try:
        verify_jwt_in_request(optional=False)
        user = User.query.get(get_jwt_identity())
        if not user:
            return jsonify({"valid": False, "message": "User not found"}), 404
        return jsonify({"valid": True, "user": user.to_dict()}), 200
    except ExpiredSignatureError:
        return jsonify({"valid": False, "message": "Token has expired"}), 401
    except BadRequest as exc:  # malformed header/token
        return jsonify({"valid": False, "message": str(exc)}), 401
    except Exception as exc:  # defensive catch-all
        return jsonify({"valid": False, "message": f"Unexpected error: {exc}"}), 401
