"""
Storage utilities for handling file uploads.
Supports both local storage (development) and Supabase storage (production).
"""

import os
from flask import current_app
from werkzeug.utils import secure_filename


def upload_file(file, filename, folder="uploads", content_type=None):
    """
    Upload a file to storage (Supabase or local).
    All files are stored in a unified structure accessible by both CVAI and RecruAI.

    Args:
        file: File object to upload
        filename: Desired filename (can include subfolders like 'profile_images/filename.jpg')
        folder: Storage folder/bucket (unified for all apps)
        content_type: MIME type of the file

    Returns:
        str: Public URL of the uploaded file
    """
    # Import supabase client from src context
    from src import supabase_client

    # Secure the filename but preserve folder structure
    secure_name = secure_filename(filename)

    if supabase_client:
        # Upload to Supabase Storage (unified bucket)
        try:
            file.seek(0)
            file_data = file.read()

            # Upload to Supabase - all files go to 'uploads' bucket
            bucket_name = "uploads"  # Unified bucket for all apps
            file_path = secure_name  # Preserve folder structure in filename

            response = supabase_client.storage.from_(bucket_name).upload(
                path=file_path,
                file=file_data,
                file_options={
                    "content-type": content_type or "application/octet-stream",
                    "upsert": True  # Allow overwriting
                }
            )

            if response.status_code == 200 or response.status_code == 201:
                # Get public URL
                public_url = supabase_client.storage.from_(bucket_name).get_public_url(file_path)
                return public_url
            else:
                raise Exception(f"Supabase upload failed: {response}")

        except Exception as e:
            print(f"Supabase upload failed, falling back to local storage: {e}")
            # Fall back to local storage

    # Local storage fallback - unified local structure
    return upload_file_local(file, secure_name, "uploads")  # Always use 'uploads' folder locally


def upload_file_local(file, filename, folder="uploads"):
    """
    Upload a file to local storage.

    Args:
        file: File object to upload
        filename: Secure filename
        folder: Local folder path

    Returns:
        str: Local URL path of the uploaded file
    """
    # Create upload directory if it doesn't exist
    upload_dir = os.path.join(os.path.dirname(current_app.root_path), folder)
    os.makedirs(upload_dir, exist_ok=True)

    # Full file path
    file_path = os.path.join(upload_dir, filename)

    # Save file
    file.seek(0)
    file.save(file_path)

    # Return local URL path
    return f"/{folder}/{filename}"


def delete_file(file_url, folder="uploads"):
    """
    Delete a file from storage.

    Args:
        file_url: URL or path of the file to delete
        folder: Storage folder/bucket
    """
    from src import supabase_client

    if supabase_client and file_url.startswith("https://"):
        # Delete from Supabase
        try:
            # Extract filename from URL
            filename = file_url.split("/")[-1]
            supabase_client.storage.from_(folder).remove([filename])
        except Exception as e:
            print(f"Supabase delete failed: {e}")
    else:
        # Delete from local storage
        try:
            # Convert URL to local path
            relative_path = file_url.lstrip("/")
            file_path = os.path.join(os.path.dirname(current_app.root_path), relative_path)
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as e:
            print(f"Local delete failed: {e}")