from flask import jsonify, request
from flask_jwt_extended import jwt_required

from . import profile_bp
from .utils import current_user, parse_date, serialize_experience
from ..models import db, Experience


@profile_bp.route("/me/experience", methods=["POST"])
@jwt_required()
def add_experience():
    user = current_user()
    data = request.get_json() or {}
    exp = Experience(
        user_id=user.id,
        title=data.get("jobTitle") or data.get("title"),
        company=data.get("company"),
        location=data.get("location"),
        start_date=parse_date(data.get("startDate")),
        end_date=parse_date(data.get("endDate")),
        description=data.get("description"),
        employment_type=data.get("employmentType"),
        current_job=bool(data.get("current")),
    )
    db.session.add(exp)
    db.session.commit()
    return jsonify({"message": "Experience added", "experience": serialize_experience(exp)}), 201


@profile_bp.route("/me/experience/<int:exp_id>", methods=["PUT"])
@jwt_required()
def update_experience(exp_id: int):
    user = current_user()
    exp = Experience.query.get(exp_id)
    if not exp or exp.user_id != user.id:
        return jsonify({"message": "Experience not found"}), 404
    data = request.get_json() or {}
    if "jobTitle" in data or "title" in data:
        exp.title = data.get("jobTitle") or data.get("title") or exp.title
    exp.company = data.get("company", exp.company)
    exp.location = data.get("location", exp.location)
    if "startDate" in data:
        exp.start_date = parse_date(data.get("startDate"))
    if "endDate" in data:
        exp.end_date = parse_date(data.get("endDate"))
    exp.description = data.get("description", exp.description)
    exp.employment_type = data.get("employmentType", exp.employment_type)
    exp.current_job = data.get("current", exp.current_job)
    db.session.commit()
    return jsonify({"message": "Experience updated", "experience": serialize_experience(exp)}), 200


@profile_bp.route("/me/experience/<int:exp_id>", methods=["DELETE"])
@jwt_required()
def delete_experience(exp_id: int):
    user = current_user()
    exp = Experience.query.get(exp_id)
    if not exp or exp.user_id != user.id:
        return jsonify({"message": "Experience not found"}), 404
    db.session.delete(exp)
    db.session.commit()
    return jsonify({"message": "Experience deleted"}), 200
