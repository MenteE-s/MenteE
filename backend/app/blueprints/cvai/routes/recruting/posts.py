from flask import jsonify, request
from flask_jwt_extended import jwt_required
from extensions import db
from app.models import Post, Organization

from . import bp


@bp.route("/posts", methods=["GET"])
@jwt_required()
def get_posts():
    """Get all job posts"""
    try:
        # Get query parameters for filtering
        status = request.args.get("status", "active")
        category = request.args.get("category")
        location = request.args.get("location")
        employment_type = request.args.get("employment_type")

        query = Post.query

        if status:
            query = query.filter_by(status=status)
        if category:
            query = query.filter_by(category=category)
        if location:
            query = query.filter(Post.location.ilike(f"%{location}%"))
        if employment_type:
            query = query.filter_by(employment_type=employment_type)

        posts = query.all()
        return jsonify({
            "posts": [post.to_dict() for post in posts]
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route("/posts/<int:post_id>", methods=["GET"])
@jwt_required()
def get_post(post_id):
    """Get a specific job post by ID"""
    try:
        post = Post.query.get(post_id)
        if not post:
            return jsonify({"error": "Job post not found"}), 404

        return jsonify({"post": post.to_dict()}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route("/organizations/<int:org_id>/posts", methods=["GET"])
@jwt_required()
def get_organization_posts(org_id):
    """Get all posts for a specific organization"""
    try:
        organization = Organization.query.get(org_id)
        if not organization:
            return jsonify({"error": "Organization not found"}), 404

        posts = Post.query.filter_by(organization_id=org_id).all()
        return jsonify({
            "organization": organization.to_dict(),
            "posts": [post.to_dict() for post in posts]
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route("/posts", methods=["POST"])
@jwt_required()
def create_post():
    """Create a new job post"""
    try:
        data = request.get_json() or {}

        # Validate required fields
        required_fields = ["organization_id", "title"]
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"{field} is required"}), 400

        # Check if organization exists
        organization = Organization.query.get(data["organization_id"])
        if not organization:
            return jsonify({"error": "Organization not found"}), 404

        post = Post(
            organization_id=data["organization_id"],
            title=data["title"],
            description=data.get("description"),
            location=data.get("location"),
            employment_type=data.get("employment_type"),
            category=data.get("category"),
            salary_min=data.get("salary_min"),
            salary_max=data.get("salary_max"),
            salary_currency=data.get("salary_currency", "USD"),
            requirements=data.get("requirements"),
            application_deadline=data.get("application_deadline"),
            status=data.get("status", "active")
        )

        db.session.add(post)
        db.session.commit()

        return jsonify({"post": post.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@bp.route("/posts/<int:post_id>", methods=["PUT"])
@jwt_required()
def update_post(post_id):
    """Update a job post"""
    try:
        post = Post.query.get(post_id)
        if not post:
            return jsonify({"error": "Job post not found"}), 404

        data = request.get_json() or {}

        # Update fields
        updatable_fields = ["title", "description", "location", "employment_type",
                          "category", "salary_min", "salary_max", "salary_currency",
                          "requirements", "application_deadline", "status"]

        for field in updatable_fields:
            if field in data:
                setattr(post, field, data[field])

        db.session.commit()

        return jsonify({"post": post.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@bp.route("/posts/<int:post_id>", methods=["DELETE"])
@jwt_required()
def delete_post(post_id):
    """Delete a job post"""
    try:
        post = Post.query.get(post_id)
        if not post:
            return jsonify({"error": "Job post not found"}), 404

        db.session.delete(post)
        db.session.commit()

        return jsonify({"message": "Job post deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500