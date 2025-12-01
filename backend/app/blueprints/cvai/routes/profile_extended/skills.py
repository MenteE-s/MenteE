from flask import jsonify, request
from flask_jwt_extended import jwt_required

from . import profile_bp
from .utils import current_user, ser_skill, handle_error
from extensions import db
from app.models import Skill


@profile_bp.route("/me/skills", methods=["POST"])
@jwt_required()
def save_skills():
    try:
        user = current_user()
        payload = request.get_json() or {}
        if "skills" not in payload:
            raise BadRequest("Missing skills data")  # type: ignore[name-defined]
        Skill.query.filter_by(user_id=user.id).delete()
        for name in payload.get("skills", []):
            if name:
                db.session.add(Skill(user_id=user.id, name=name))
        db.session.commit()
        skills = Skill.query.filter_by(user_id=user.id).order_by(Skill.created_at.desc()).all()
        return jsonify({"message": "Skills saved successfully", "skills": [ser_skill(s) for s in skills]}), 201
    except Exception as exc:  # pragma: no cover
        return handle_error("save_skills_ext", exc)


@profile_bp.route("/me/skills", methods=["PUT"])
@jwt_required()
def update_skills():
    return save_skills()
