from flask import jsonify, request
from flask_jwt_extended import jwt_required
from extensions import db
from src.models import Organization

from . import bp


@bp.route("/organizations", methods=["GET"])
@jwt_required()
def get_organizations():
    """Get all organizations"""
    try:
        organizations = Organization.query.all()
        return jsonify({
            "organizations": [org.to_dict() for org in organizations]
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route("/organizations/<int:org_id>", methods=["GET"])
@jwt_required()
def get_organization(org_id):
    """Get a specific organization by ID"""
    try:
        organization = Organization.query.get(org_id)
        if not organization:
            return jsonify({"error": "Organization not found"}), 404

        return jsonify({"organization": organization.to_dict()}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route("/organizations", methods=["POST"])
@jwt_required()
def create_organization():
    """Create a new organization"""
    try:
        data = request.get_json() or {}

        # Validate required fields
        if not data.get("name"):
            return jsonify({"error": "Organization name is required"}), 400

        # Check if organization with this name already exists
        existing = Organization.query.filter_by(name=data["name"]).first()
        if existing:
            return jsonify({"error": "Organization with this name already exists"}), 400

        organization = Organization(
            name=data["name"],
            description=data.get("description"),
            website=data.get("website"),
            contact_email=data.get("contact_email"),
            contact_name=data.get("contact_name"),
            location=data.get("location"),
            company_size=data.get("company_size"),
            industry=data.get("industry"),
            mission=data.get("mission"),
            vision=data.get("vision"),
            social_media_links=data.get("social_media_links"),
            profile_image=data.get("profile_image"),
            banner_image=data.get("banner_image"),
            timezone=data.get("timezone", "UTC")
        )

        db.session.add(organization)
        db.session.commit()

        return jsonify({"organization": organization.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@bp.route("/organizations/<int:org_id>", methods=["PUT"])
@jwt_required()
def update_organization(org_id):
    """Update an organization"""
    try:
        organization = Organization.query.get(org_id)
        if not organization:
            return jsonify({"error": "Organization not found"}), 404

        data = request.get_json() or {}

        # Update fields
        for field in ["name", "description", "website", "contact_email", "contact_name",
                     "location", "company_size", "industry", "mission", "vision",
                     "social_media_links", "profile_image", "banner_image", "timezone"]:
            if field in data:
                setattr(organization, field, data[field])

        db.session.commit()

        return jsonify({"organization": organization.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@bp.route("/organizations/<int:org_id>", methods=["DELETE"])
@jwt_required()
def delete_organization(org_id):
    """Delete an organization"""
    try:
        organization = Organization.query.get(org_id)
        if not organization:
            return jsonify({"error": "Organization not found"}), 404

        db.session.delete(organization)
        db.session.commit()

        return jsonify({"message": "Organization deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500