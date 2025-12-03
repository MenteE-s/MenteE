from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from src.models import (
    User,
    Experience,
    Education,
    Project,
    Skill,
    Award,
    Certification,
    Publication,
    Patent,
    Language,
    VolunteerExperience,
    HobbyInterest,
    SocialMediaLink,
    CourseTraining,
    Reference,
)
from .. import bp


def _parse_date(date_str):
    from datetime import datetime
    if not date_str:
        return None
    try:
        return datetime.fromisoformat(str(date_str).replace("Z", ""))
    except Exception:
        try:
            return datetime.strptime(str(date_str).split("T")[0], "%Y-%m-%d")
        except Exception:
            return None


@bp.route("/profiles", methods=["GET"])
@jwt_required()
def list_profiles():
    """Return a synthetic single profile entry for the current user.

    Shape: { profiles: [{ profile_id, full_name, summary, updated_at, ... }] }
    """
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"message": "User not found", "profiles": []}), 404

    profile_entry = {
        "profile_id": user.id,
        "full_name": user.name,
        "summary": user.summary or "",
        "updated_at": user.updated_at.isoformat() if user.updated_at else None,
        # Optional analytics placeholders (dashboard handles missing values)
        "total_views": 0,
        "avg_score_percent": 0,
        "interviews_count": 0,
        "success_rate_percent": 0,
    }
    return jsonify({"profiles": [profile_entry]}), 200


@bp.route("/profile", methods=["GET", "PUT"])
@jwt_required()
def profile_root():
    """GET: return user + profile; PUT: update basic user fields."""
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"message": "User not found"}), 404

    if request.method == "GET":
        return jsonify({"user": user.to_dict(), "profile": user.to_dict()}), 200

    data = request.get_json() or {}
    if "username" in data:
        existing = User.query.filter_by(username=data["username"]).first()
        if existing and existing.id != user.id:
            return jsonify({"message": "Username already taken"}), 400
        user.username = data["username"]
    if "email" in data:
        existing = User.query.filter_by(email=data["email"]).first()
        if existing and existing.id != user.id:
            return jsonify({"message": "Email already registered"}), 400
        user.email = data["email"]
    if "name" in data:
        user.name = data["name"]
    if "plan" in data:
        user.plan = data["plan"]
    if "phone" in data:
        user.phone = data["phone"]
    if "location" in data:
        user.location = data["location"]
    if "timezone" in data:
        user.timezone = data["timezone"]
    if "linkedin_url" in data:
        user.linkedin_url = data["linkedin_url"]
    if "github_url" in data:
        user.github_url = data["github_url"]
    if "website_url" in data:
        user.website_url = data["website_url"]
    db.session.commit()
    return jsonify({"user": user.to_dict()}), 200


def _apply_editor_payload_to_user(user: User, payload: dict) -> None:
    pd = payload.get("personalDetails") or {}
    user.name = pd.get("fullName", user.name)
    user.email = pd.get("email", user.email)
    user.phone = pd.get("phone", user.phone)
    user.location = pd.get("location", user.location)
    user.linkedin_url = pd.get("linkedin", user.linkedin_url)
    user.github_url = pd.get("github", user.github_url)
    user.website_url = pd.get("website", user.website_url)
    user.summary = payload.get("summary", user.summary)

    # Replace strategy for nested collections
    Experience.query.filter_by(user_id=user.id).delete()
    for exp in payload.get("experience", []) or []:
        db.session.add(
            Experience(
                user_id=user.id,
                title=exp.get("jobTitle") or exp.get("job_title"),
                company=exp.get("company"),
                location=exp.get("location"),
                description=exp.get("description"),
                start_date=_parse_date(exp.get("startDate")),
                end_date=_parse_date(exp.get("endDate")),
                current_job=(not exp.get("endDate")) or str(exp.get("endDate")).strip().lower() == "present",
                employment_type=exp.get("employmentType"),
            )
        )

    Education.query.filter_by(user_id=user.id).delete()
    for edu in payload.get("education", []) or []:
        db.session.add(
            Education(
                user_id=user.id,
                institution=edu.get("institution"),
                degree=edu.get("degree"),
                field=edu.get("field"),
                location=edu.get("location"),
                description=edu.get("description"),
                start_date=_parse_date(edu.get("startDate")),
                end_date=_parse_date(edu.get("endDate")),
            )
        )

    # Projects (store as regular projects)
    for proj in Project.query.filter_by(user_id=user.id).all():
        db.session.delete(proj)
    for proj in payload.get("projects", []) or []:
        import json
        techs = proj.get("technologies") or []
        db.session.add(
            Project(
                user_id=user.id,
                name=proj.get("title"),
                description=proj.get("description"),
                demo_url=proj.get("project_url") or proj.get("link"),
                technologies=json.dumps([t for t in techs if t]) if techs else None,
                status="project",
            )
        )

    Skill.query.filter_by(user_id=user.id).delete()
    for skill_name in payload.get("skills", []) or []:
        if skill_name:
            db.session.add(Skill(user_id=user.id, name=skill_name))

    # Optional entities: ignore for now or extend similarly (awards, publications, etc.)


@bp.route("/resumes", methods=["POST"])
@jwt_required()
def create_resume():
    """Persist payload to the current user and return a synthetic profile_id.

    The editor treats absence of currentProfileId as 'create'; we map it to the
    single-user profile model and return the user's id as profile_id.
    """
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"message": "User not found"}), 404
    payload = request.get_json() or {}
    _apply_editor_payload_to_user(user, payload)
    db.session.commit()
    return jsonify({"profile_id": user.id}), 201


@bp.route("/profile/<int:profile_id>", methods=["PUT", "DELETE", "GET"])
@jwt_required()
def profile_by_id(profile_id: int):
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"message": "User not found"}), 404
    if int(profile_id) != int(user.id):
        return jsonify({"message": "Forbidden"}), 403

    if request.method == "DELETE":
        # For single-profile model, treat delete as clearing data
        Experience.query.filter_by(user_id=user.id).delete()
        Education.query.filter_by(user_id=user.id).delete()
        Project.query.filter_by(user_id=user.id).delete()
        Skill.query.filter_by(user_id=user.id).delete()
        db.session.commit()
        return jsonify({"message": "Profile deleted"}), 200

    if request.method == "GET":
        return jsonify({"profile": user.to_dict()}), 200

    # PUT
    payload = request.get_json() or {}
    _apply_editor_payload_to_user(user, payload)
    db.session.commit()
    return jsonify({"profile": user.to_dict()}), 200
