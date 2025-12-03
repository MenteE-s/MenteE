from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from .blueprint import profile_bp
from extensions import db
from src.models import User
import os
from werkzeug.utils import secure_filename

# Profile Picture Upload endpoint
@profile_bp.route('/upload-profile-picture', methods=['POST'])
@jwt_required()
def upload_profile_picture():
    """Upload a profile picture for the current user"""
    user_id = get_jwt_identity()
    try:
        user_id_int = int(user_id)
        user = User.query.get(user_id_int)
    except (ValueError, TypeError):
        return jsonify({"error": "invalid user identity"}), 400

    if not user:
        return jsonify({'error': 'User not found'}), 404

    if 'profile_picture' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['profile_picture']

    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    # Validate file type
    allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
    if not file.filename.lower().split('.')[-1] in allowed_extensions:
        return jsonify({'error': 'Invalid file type. Only PNG, JPG, JPEG, and GIF are allowed'}), 400

    # Validate file size (max 5MB)
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)
    if file_size > 5 * 1024 * 1024:  # 5MB
        return jsonify({'error': 'File too large. Maximum size is 5MB'}), 400

    # Secure filename and create unique filename
    filename = secure_filename(file.filename)
    extension = filename.rsplit('.', 1)[1].lower()
    unique_filename = f"user_{user_id_int}_profile.{extension}"

    # Upload file using storage utility
    from src.utils.storage import upload_file
    profile_picture_url = upload_file(
        file=file,
        filename=f"profile_pictures/{unique_filename}",
        folder="uploads",  # Unified bucket
        content_type=file.content_type
    )
    user.profile_picture = profile_picture_url
    try:
        db.session.commit()
        return jsonify({
            'message': 'Profile picture uploaded successfully',
            'profile_picture': profile_picture_url
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to update profile picture: {str(e)}"}), 500