from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .blueprint import profile_bp

@profile_bp.route('/profiles', methods=['GET'])
@jwt_required()
def get_profiles():
    """Get all profiles for the current user"""
    user_id = get_jwt_identity()

    # For now, return empty array since CVAI doesn't have separate profiles concept
    # In the future, this could return different profile versions or templates
    return jsonify({'profiles': []}), 200