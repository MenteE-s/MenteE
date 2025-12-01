from flask import jsonify, request
from flask_jwt_extended import jwt_required

from . import profile_bp
from .utils import current_user, serialize_project
from ..models import db, Project


@profile_bp.route("/me/projects", methods=["POST"])
@jwt_required()
def add_project():
    user = current_user()
    data = request.get_json() or {}
    proj = Project(
        user_id=user.id,
        name=data.get("title"),
        description=data.get("description"),
        demo_url=data.get("link"),
        technologies=None,
    )
    db.session.add(proj)
    db.session.commit()
    return jsonify({"message": "Project added", "project": serialize_project(proj)}), 201


@profile_bp.route("/me/projects/<int:proj_id>", methods=["PUT"])
@jwt_required()
def update_project(proj_id: int):
    user = current_user()
    proj = Project.query.get(proj_id)
    if not proj or proj.user_id != user.id:
        return jsonify({"message": "Project not found"}), 404
    data = request.get_json() or {}
    if "title" in data:
        proj.name = data.get("title") or proj.name
    proj.description = data.get("description", proj.description)
    if "link" in data:
        proj.demo_url = data.get("link")
    db.session.commit()
    return jsonify({"message": "Project updated", "project": serialize_project(proj)}), 200


@profile_bp.route("/me/projects/<int:proj_id>", methods=["DELETE"])
@jwt_required()
def delete_project(proj_id: int):
    user = current_user()
    proj = Project.query.get(proj_id)
    if not proj or proj.user_id != user.id:
        return jsonify({"message": "Project not found"}), 404
    db.session.delete(proj)
    db.session.commit()
    return jsonify({"message": "Project deleted"}), 200
