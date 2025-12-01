from flask import jsonify, request
from flask_jwt_extended import jwt_required

from . import profile_bp
from .utils import (
    current_user,
    parse_date,
    profile_payload,
    serialize_experience,
    serialize_education,
    serialize_project,
    serialize_skill,
)
from ..models import db, Experience, Education, Project, Skill


@profile_bp.route("/me", methods=["GET"])
@jwt_required()
def get_my_profile():
    user = current_user()
    return jsonify({"profile": profile_payload(user)}), 200


@profile_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_my_profile():
    user = current_user()
    data = request.get_json() or {}
    personal = data.get("personalDetails", {})

    if personal.get("fullName"):
        user.name = personal["fullName"]
    user.email = personal.get("email", user.email)
    user.phone = personal.get("phone", user.phone)
    user.location = personal.get("location", user.location)
    user.linkedin_url = personal.get("linkedin", user.linkedin_url)
    user.github_url = personal.get("github", user.github_url)
    user.website_url = personal.get("website", user.website_url)
    user.summary = data.get("summary", user.summary)

    Experience.query.filter_by(user_id=user.id).delete()
    for exp in data.get("experience", []):
        db.session.add(
            Experience(
                user_id=user.id,
                title=exp.get("jobTitle") or exp.get("title"),
                company=exp.get("company"),
                location=exp.get("location"),
                start_date=parse_date(exp.get("startDate")),
                end_date=parse_date(exp.get("endDate")),
                description=exp.get("description"),
                employment_type=exp.get("employmentType"),
                current_job=bool(exp.get("current")),
            )
        )

    Education.query.filter_by(user_id=user.id).delete()
    for edu in data.get("education", []):
        db.session.add(
            Education(
                user_id=user.id,
                institution=edu.get("institution"),
                degree=edu.get("degree"),
                field=edu.get("field"),
                location=edu.get("location"),
                description=edu.get("description"),
                start_date=parse_date(edu.get("startDate")),
                end_date=parse_date(edu.get("endDate")),
            )
        )

    Project.query.filter_by(user_id=user.id).delete()
    for proj in data.get("projects", []):
        db.session.add(
            Project(
                user_id=user.id,
                name=proj.get("title"),
                description=proj.get("description"),
                demo_url=proj.get("link"),
                technologies=None,
            )
        )

    Skill.query.filter_by(user_id=user.id).delete()
    for skill_name in data.get("skills", []):
        if not skill_name:
            continue
        db.session.add(Skill(user_id=user.id, name=skill_name))

    db.session.commit()
    return jsonify({"message": "Profile updated successfully", "profile": profile_payload(user)}), 200
