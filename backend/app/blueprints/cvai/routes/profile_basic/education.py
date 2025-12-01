from flask import jsonify, request
from flask_jwt_extended import jwt_required

from . import profile_bp
from .utils import current_user, parse_date, serialize_education
from ..models import db, Education


@profile_bp.route("/me/education", methods=["POST"])
@jwt_required()
def add_education():
    user = current_user()
    data = request.get_json() or {}
    edu = Education(
        user_id=user.id,
        institution=data.get("institution"),
        degree=data.get("degree"),
        field=data.get("field"),
        location=data.get("location"),
        description=data.get("description"),
        start_date=parse_date(data.get("startDate")),
        end_date=parse_date(data.get("endDate")),
    )
    db.session.add(edu)
    db.session.commit()
    return jsonify({"message": "Education added", "education": serialize_education(edu)}), 201


@profile_bp.route("/me/education/<int:edu_id>", methods=["PUT"])
@jwt_required()
def update_education(edu_id: int):
    user = current_user()
    edu = Education.query.get(edu_id)
    if not edu or edu.user_id != user.id:
        return jsonify({"message": "Education not found"}), 404
    data = request.get_json() or {}
    edu.institution = data.get("institution", edu.institution)
    edu.degree = data.get("degree", edu.degree)
    edu.field = data.get("field", edu.field)
    edu.location = data.get("location", edu.location)
    edu.description = data.get("description", edu.description)
    if "startDate" in data:
        edu.start_date = parse_date(data.get("startDate"))
    if "endDate" in data:
        edu.end_date = parse_date(data.get("endDate"))
    db.session.commit()
    return jsonify({"message": "Education updated", "education": serialize_education(edu)}), 200


@profile_bp.route("/me/education/<int:edu_id>", methods=["DELETE"])
@jwt_required()
def delete_education(edu_id: int):
    user = current_user()
    edu = Education.query.get(edu_id)
    if not edu or edu.user_id != user.id:
        return jsonify({"message": "Education not found"}), 404
    db.session.delete(edu)
    db.session.commit()
    return jsonify({"message": "Education deleted"}), 200
