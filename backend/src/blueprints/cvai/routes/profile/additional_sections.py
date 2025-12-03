import json
from datetime import datetime
from typing import Any, Dict, List

from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from .blueprint import profile_bp
from extensions import db
from src.models import (
    Award,
    Certification,
    Conference,
    CourseTraining,
    HobbyInterest,
    KeyAchievement,
    License,
    Patent,
    ProfessionalMembership,
    Publication,
    Reference,
    SocialMediaLink,
    SpeakingEngagement,
    VolunteerExperience,
)

ProfileResourceConfig = Dict[str, Dict[str, Any]]


def _parse_date(value: Any, field: str) -> Any:
    if value in (None, ""):
        return None
    if isinstance(value, datetime):
        return value.date()
    try:
        # accept date or datetime strings (YYYY-MM-DD or ISO with time)
        string_value = str(value)
        date_part = string_value.split("T")[0]
        return datetime.strptime(date_part, "%Y-%m-%d").date()
    except ValueError as exc:
        raise ValueError(f"Invalid date format for {field}. Use YYYY-MM-DD.") from exc


def _coerce_field(field: str, value: Any, config: Dict[str, Any]) -> Any:
    if value == "":
        value = None
    if field in config.get("date_fields", []):
        return _parse_date(value, field)
    if field in config.get("json_fields", []):
        if not value:
            return None
        if isinstance(value, str):
            return value
        return json.dumps(value)
    return value


def _update_instance(instance: Any, data: Dict[str, Any], config: Dict[str, Any]) -> None:
    for field, value in data.items():
        if field in {"id", "user_id", "created_at", "updated_at"}:
            continue
        if not hasattr(instance, field):
            continue
        coerced = _coerce_field(field, value, config)
        setattr(instance, field, coerced)


def _current_user_id() -> int:
    identity = get_jwt_identity()
    try:
        return int(identity)
    except (TypeError, ValueError):
        raise ValueError("invalid user identity")


PROFILE_SECTION_CONFIG: ProfileResourceConfig = {
    "publications": {
        "model": Publication,
        "list_key": "publications",
        "single_key": "publication",
        "aliases": [],
        "order_by": lambda query: query.order_by(Publication.year.desc().nullslast()),
        "json_fields": {"authors"},
    },
    "awards": {
        "model": Award,
        "list_key": "awards",
        "single_key": "award",
        "aliases": [],
        "date_fields": ["date"],
        "order_by": lambda query: query.order_by(Award.date.desc().nullslast()),
    },
    "certifications": {
        "model": Certification,
        "list_key": "certifications",
        "single_key": "certification",
        "aliases": [],
        "date_fields": ["date_obtained", "expiry_date"],
        "order_by": lambda query: query.order_by(Certification.date_obtained.desc().nullslast()),
    },
    "volunteer-experiences": {
        "model": VolunteerExperience,
        "list_key": "volunteer_experiences",
        "single_key": "volunteer_experience",
        "aliases": ["volunteerExperiences"],
        "date_fields": ["start_date", "end_date"],
        "order_by": lambda query: query.order_by(VolunteerExperience.start_date.desc().nullslast()),
    },
    "references": {
        "model": Reference,
        "list_key": "references",
        "single_key": "reference",
        "aliases": [],
        "order_by": lambda query: query.order_by(Reference.created_at.desc()),
    },
    "hobby-interests": {
        "model": HobbyInterest,
        "list_key": "hobby_interests",
        "single_key": "hobby_interest",
        "aliases": ["hobbyInterests"],
        "order_by": lambda query: query.order_by(HobbyInterest.created_at.desc()),
    },
    "professional-memberships": {
        "model": ProfessionalMembership,
        "list_key": "professional_memberships",
        "single_key": "professional_membership",
        "aliases": ["professionalMemberships"],
        "date_fields": ["start_date", "end_date"],
        "order_by": lambda query: query.order_by(ProfessionalMembership.start_date.desc().nullslast()),
    },
    "patents": {
        "model": Patent,
        "list_key": "patents",
        "single_key": "patent",
        "aliases": [],
        "date_fields": ["filing_date", "grant_date"],
        "json_fields": {"inventors"},
        "order_by": lambda query: query.order_by(Patent.filing_date.desc().nullslast()),
    },
    "course-trainings": {
        "model": CourseTraining,
        "list_key": "course_trainings",
        "single_key": "course_training",
        "aliases": ["courseTrainings"],
        "date_fields": ["completion_date"],
        "order_by": lambda query: query.order_by(CourseTraining.completion_date.desc().nullslast()),
    },
    "social-media-links": {
        "model": SocialMediaLink,
        "list_key": "social_media_links",
        "single_key": "social_media_link",
        "aliases": ["socialMediaLinks"],
        "order_by": lambda query: query.order_by(SocialMediaLink.created_at.desc()),
    },
    "key-achievements": {
        "model": KeyAchievement,
        "list_key": "key_achievements",
        "single_key": "key_achievement",
        "aliases": ["keyAchievements"],
        "date_fields": ["date"],
        "order_by": lambda query: query.order_by(KeyAchievement.date.desc().nullslast()),
    },
    "conferences": {
        "model": Conference,
        "list_key": "conferences",
        "single_key": "conference",
        "aliases": [],
        "date_fields": ["date"],
        "order_by": lambda query: query.order_by(Conference.date.desc().nullslast()),
    },
    "speaking-engagements": {
        "model": SpeakingEngagement,
        "list_key": "speaking_engagements",
        "single_key": "speaking_engagement",
        "aliases": ["speakingEngagements"],
        "date_fields": ["date"],
        "order_by": lambda query: query.order_by(SpeakingEngagement.date.desc().nullslast()),
    },
    "licenses": {
        "model": License,
        "list_key": "licenses",
        "single_key": "license",
        "aliases": [],
        "date_fields": ["issue_date", "expiry_date"],
        "order_by": lambda query: query.order_by(License.issue_date.desc().nullslast()),
    },
}


def _register_resource(resource_name: str, config: Dict[str, Any]) -> None:
    routes = [resource_name] + config.get("aliases", [])

    @jwt_required()
    def list_items() -> Any:
        try:
            user_id = _current_user_id()
        except ValueError as exc:
            return jsonify({"error": str(exc)}), 400

        query = config["model"].query.filter_by(user_id=user_id)
        order_by = config.get("order_by")
        if callable(order_by):
            query = order_by(query)
        items = query.all()
        return jsonify({config["list_key"]: [item.to_dict() for item in items]}), 200

    @jwt_required()
    def create_item() -> Any:
        try:
            user_id = _current_user_id()
        except ValueError as exc:
            return jsonify({"error": str(exc)}), 400

        payload = request.get_json(silent=True) or {}
        item = config["model"](user_id=user_id)
        try:
            _update_instance(item, payload, config)
        except ValueError as exc:
            return jsonify({"error": str(exc)}), 400

        db.session.add(item)
        db.session.commit()
        return (
            jsonify({
                "message": f"{config['single_key'].replace('_', ' ')} created successfully",
                config["single_key"]: item.to_dict(),
            }),
            201,
        )

    @jwt_required()
    def update_item(item_id: int) -> Any:
        try:
            user_id = _current_user_id()
        except ValueError as exc:
            return jsonify({"error": str(exc)}), 400

        item = config["model"].query.filter_by(id=item_id, user_id=user_id).first()
        if not item:
            return jsonify({"error": "Item not found"}), 404

        payload = request.get_json(silent=True) or {}
        try:
            _update_instance(item, payload, config)
        except ValueError as exc:
            return jsonify({"error": str(exc)}), 400

        db.session.commit()
        return (
            jsonify({
                "message": f"{config['single_key'].replace('_', ' ')} updated successfully",
                config["single_key"]: item.to_dict(),
            }),
            200,
        )

    @jwt_required()
    def delete_item(item_id: int) -> Any:
        try:
            user_id = _current_user_id()
        except ValueError as exc:
            return jsonify({"error": str(exc)}), 400

        item = config["model"].query.filter_by(id=item_id, user_id=user_id).first()
        if not item:
            return jsonify({"error": "Item not found"}), 404

        db.session.delete(item)
        db.session.commit()
        return jsonify({"message": "Item deleted successfully"}), 200

    for idx, route in enumerate(routes):
        route_suffix = route.replace("/", "_")
        base_rule = f"/{route}"
        profile_bp.add_url_rule(
            base_rule,
            endpoint=f"profile_{route_suffix}_list_{idx}",
            view_func=list_items,
            methods=["GET"],
        )
        profile_bp.add_url_rule(
            base_rule,
            endpoint=f"profile_{route_suffix}_create_{idx}",
            view_func=create_item,
            methods=["POST"],
        )
        profile_bp.add_url_rule(
            f"{base_rule}/<int:item_id>",
            endpoint=f"profile_{route_suffix}_update_{idx}",
            view_func=update_item,
            methods=["PUT"],
        )
        profile_bp.add_url_rule(
            f"{base_rule}/<int:item_id>",
            endpoint=f"profile_{route_suffix}_delete_{idx}",
            view_func=delete_item,
            methods=["DELETE"],
        )


for resource_key, resource_config in PROFILE_SECTION_CONFIG.items():
    _register_resource(resource_key, resource_config)