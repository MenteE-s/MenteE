from flask import jsonify, request
from flask_jwt_extended import jwt_required

from . import profile_bp
from .utils import current_user, serialize_skill
from ..models import db, Skill


@profile_bp.route("/me/skills", methods=["POST"])
@jwt_required()
def set_skills():
    user = current_user()
    data = request.get_json() or {}
    skills_in = data.get("skills", [])
    Skill.query.filter_by(user_id=user.id).delete()
    for name in skills_in:
        if name:
            db.session.add(Skill(user_id=user.id, name=name))
    db.session.commit()
    skills = Skill.query.filter_by(user_id=user.id).all()
    return jsonify({"message": "Skills saved", "skills": [serialize_skill(s) for s in skills]}), 201


@profile_bp.route("/me/skills/<int:skill_id>", methods=["DELETE"])
@jwt_required()
def delete_skill(skill_id: int):
    user = current_user()
    skill = Skill.query.get(skill_id)
    if not skill or skill.user_id != user.id:
        return jsonify({"message": "Skill not found"}), 404
    db.session.delete(skill)
    db.session.commit()
    return jsonify({"message": "Skill deleted"}), 200
