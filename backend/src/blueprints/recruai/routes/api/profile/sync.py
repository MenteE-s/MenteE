from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .. import api_bp
from extensions import db
from src.models import (
    Experience, Education, Skill, Project, Publication, Award, Certification,
    Language, VolunteerExperience, Reference, HobbyInterest,
    ProfessionalMembership, Patent, CourseTraining, SocialMediaLink,
    KeyAchievement, Conference, SpeakingEngagement, License
)
import requests


def _current_user_id() -> int:
    return int(get_jwt_identity())

# Sync profile data from CVAI to Recrui
@api_bp.route('/profile/sync-from-cvai', methods=['POST'])
@jwt_required()
def sync_from_cvai():
    """Sync profile data from CVAI to Recrui"""
    user_id = _current_user_id()

    try:
        # Get CVAI profile data
        cvai_base_url = "http://localhost:5000/api/cvai"  # Assuming CVAI runs on same server

        # Fetch all CVAI profile data in parallel
        cvai_endpoints = [
            f"{cvai_base_url}/profile/sections",
            f"{cvai_base_url}/profile/experiences",
            f"{cvai_base_url}/profile/educations",
            f"{cvai_base_url}/profile/skills",
            f"{cvai_base_url}/profile/projects",
            f"{cvai_base_url}/profile/publications",
            f"{cvai_base_url}/profile/awards",
            f"{cvai_base_url}/profile/certifications",
            f"{cvai_base_url}/profile/languages",
            f"{cvai_base_url}/profile/volunteer-experiences",
            f"{cvai_base_url}/profile/references",
            f"{cvai_base_url}/profile/hobby-interests",
            f"{cvai_base_url}/profile/professional-memberships",
            f"{cvai_base_url}/profile/patents",
            f"{cvai_base_url}/profile/course-trainings",
            f"{cvai_base_url}/profile/social-media-links",
            f"{cvai_base_url}/profile/key-achievements",
            f"{cvai_base_url}/profile/conferences",
            f"{cvai_base_url}/profile/speaking-engagements",
            f"{cvai_base_url}/profile/licenses",
        ]

        # Get auth token from request
        auth_header = request.headers.get('Authorization')
        headers = {'Authorization': auth_header} if auth_header else {}

        responses = []
        for endpoint in cvai_endpoints:
            try:
                response = requests.get(endpoint, headers=headers, timeout=10)
                if response.status_code == 200:
                    responses.append(response.json())
                else:
                    print(f"Failed to fetch from {endpoint}: {response.status_code}")
                    responses.append(None)
            except Exception as e:
                print(f"Error fetching from {endpoint}: {e}")
                responses.append(None)

        # Clear existing Recrui profile data
        Experience.query.filter_by(user_id=user_id).delete()
        Education.query.filter_by(user_id=user_id).delete()
        Skill.query.filter_by(user_id=user_id).delete()
        Project.query.filter_by(user_id=user_id).delete()
        Publication.query.filter_by(user_id=user_id).delete()
        Award.query.filter_by(user_id=user_id).delete()
        Certification.query.filter_by(user_id=user_id).delete()
        Language.query.filter_by(user_id=user_id).delete()
        VolunteerExperience.query.filter_by(user_id=user_id).delete()
        Reference.query.filter_by(user_id=user_id).delete()
        HobbyInterest.query.filter_by(user_id=user_id).delete()
        ProfessionalMembership.query.filter_by(user_id=user_id).delete()
        Patent.query.filter_by(user_id=user_id).delete()
        CourseTraining.query.filter_by(user_id=user_id).delete()
        SocialMediaLink.query.filter_by(user_id=user_id).delete()
        KeyAchievement.query.filter_by(user_id=user_id).delete()
        Conference.query.filter_by(user_id=user_id).delete()
        SpeakingEngagement.query.filter_by(user_id=user_id).delete()
        License.query.filter_by(user_id=user_id).delete()

        # Import CVAI data to Recrui
        synced_items = 0

        # Process each response
        data_mapping = [
            (responses[0], 'sections', None),  # About section
            (responses[1], 'experiences', Experience),
            (responses[2], 'educations', Education),
            (responses[3], 'skills', Skill),
            (responses[4], 'projects', Project),
            (responses[5], 'publications', Publication),
            (responses[6], 'awards', Award),
            (responses[7], 'certifications', Certification),
            (responses[8], 'languages', Language),
            (responses[9], 'volunteer_experiences', VolunteerExperience),
            (responses[10], 'references', Reference),
            (responses[11], 'hobby_interests', HobbyInterest),
            (responses[12], 'professional_memberships', ProfessionalMembership),
            (responses[13], 'patents', Patent),
            (responses[14], 'course_trainings', CourseTraining),
            (responses[15], 'social_media_links', SocialMediaLink),
            (responses[16], 'key_achievements', KeyAchievement),
            (responses[17], 'conferences', Conference),
            (responses[18], 'speaking_engagements', SpeakingEngagement),
            (responses[19], 'licenses', License),
        ]

        for response_data, key, model_class in data_mapping:
            if response_data and key in response_data and response_data[key]:
                items = response_data[key]
                if not isinstance(items, list):
                    items = [items]

                for item in items:
                    if model_class:
                        # Create new instance with user_id
                        item_data = {**item, 'user_id': user_id}
                        # Remove id if present to avoid conflicts
                        item_data.pop('id', None)
                        new_item = model_class(**item_data)
                        db.session.add(new_item)
                        synced_items += 1

        db.session.commit()

        return jsonify({
            'message': f'Successfully synced {synced_items} profile items from CVAI',
            'synced_items': synced_items
        }), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error syncing profile: {e}")
        return jsonify({'error': 'Failed to sync profile data'}), 500